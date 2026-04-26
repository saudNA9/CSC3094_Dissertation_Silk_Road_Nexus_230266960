"use client"

import { useRef, useEffect, useCallback, useState, useMemo } from "react"
import * as d3 from "d3"
import {
  ALL_ENTITIES,
  SILK_ROAD_RELATIONSHIPS,
  SILK_ROAD_ROUTES,
  getEntitiesForCentury,
  type SilkRoadEntity,
} from "@/lib/silk-road-data"
import { fetchAllEntities } from "@/lib/api-client"

export type GraphMode = "force" | "radial" | "hierarchical" | "geographic" | "commodity" | "temporal"

interface GraphNode extends d3.SimulationNodeDatum {
  id: string
  name: string
  type: string
  importance: string
  startYear: number
  endYear: number
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode
  target: string | GraphNode
}

interface RelationshipGraphProps {
  onSelectEntity: (entity: SilkRoadEntity) => void
  focusId?: string | null
  isDark: boolean
  mode: GraphMode
  centuryYear: number
}

const TYPE_COLORS: Record<string, string> = {
  City: "#C6A75E",
  Route: "#5B8FB9",
  Person: "#10b981",
  Good: "#f97316",
  Event: "#f43f5e",
  Inscription: "#a855f7",
}

// Build graph with ALL entities - temporal filtering via opacity in separate effect
function buildGraphData(allEntities: SilkRoadEntity[] = ALL_ENTITIES) {
  const entityMap = new Map(allEntities.map(e => [e.id, e]))
  const allIds = new Set(allEntities.map((e) => e.id))

  const nodes: GraphNode[] = []
  const links: GraphLink[] = []
  const nodeIds = new Set<string>()

  // Add ALL entities as nodes
  allEntities.forEach((entity) => {
    if (!nodeIds.has(entity.id)) {
      nodeIds.add(entity.id)
      nodes.push({
        id: entity.id,
        name: entity.name.split("(")[0].trim(),
        type: entity.type,
        importance: entity.importance,
        startYear: entity.startYear,
        endYear: entity.endYear,
      })
    }
  })

  // Helper to add a link without duplicates
  const addedLinks = new Set<string>()
  const addLink = (sourceId: string, targetId: string) => {
    if (sourceId === targetId) return
    if (!allIds.has(sourceId) || !allIds.has(targetId)) return
    const linkKey = [sourceId, targetId].sort().join('-')
    if (addedLinks.has(linkKey)) return
    addedLinks.add(linkKey)
    links.push({ source: sourceId, target: targetId })
  }

  // 1. Build links from SILK_ROAD_RELATIONSHIPS (person-to-city, event-to-city, etc.)
  SILK_ROAD_RELATIONSHIPS.forEach((rel) => {
    // Skip route references as targets (routes are not entity nodes)
    if (rel.targetId.startsWith('route-')) return
    addLink(rel.sourceId, rel.targetId)
  })

  // 2. Build links from relatedEntities on each entity
  allEntities.forEach((entity) => {
    (entity.relatedEntities || []).forEach((relId) => {
      // Skip route references
      if (relId.startsWith('route-')) return
      addLink(entity.id, relId)
    })
  })

  // 3. Connect cities that share the same route (creates the network)
  // This is crucial - cities on the same trade route are inherently connected
  const cityEntities = allEntities.filter(e => e.type === "City")
  
  // Build a map of route -> cities that reference it
  const routeToCities = new Map<string, string[]>()
  cityEntities.forEach(city => {
    (city.relatedEntities || []).forEach(relId => {
      if (relId.startsWith('route-')) {
        if (!routeToCities.has(relId)) routeToCities.set(relId, [])
        routeToCities.get(relId)!.push(city.id)
      }
    })
  })

  // Connect cities on the same route (limited connections to avoid too many edges)
  routeToCities.forEach((cityIds) => {
    // Connect each city to its neighbors on the route (max 3 connections per city)
    for (let i = 0; i < cityIds.length; i++) {
      for (let j = i + 1; j < Math.min(i + 4, cityIds.length); j++) {
        addLink(cityIds[i], cityIds[j])
      }
    }
  })

  // 4. Connect goods to cities where they are mentioned (limit connections to avoid excessive edges)
  const goodEntities = allEntities.filter(e => e.type === "Good")
  goodEntities.forEach(good => {
    // Only connect to top 5 cities in the same region to reduce link explosion
    const citiesInRegion = cityEntities
      .filter(city => city.region === good.region)
      .sort((a, b) => {
        const importanceOrder = { Major: 0, Significant: 1, Moderate: 2, Minor: 3 }
        return (importanceOrder[a.importance as keyof typeof importanceOrder] || 99) -
               (importanceOrder[b.importance as keyof typeof importanceOrder] || 99)
      })
      .slice(0, 5)

    citiesInRegion.forEach(city => {
      addLink(good.id, city.id)
    })
  })

  // 5. Connect events to their related cities (limit connections)
  const eventEntities = allEntities.filter(e => e.type === "Event")
  eventEntities.forEach(event => {
    (event.relatedEntities || []).forEach(relId => {
      if (!relId.startsWith('route-')) {
        addLink(event.id, relId)
      }
    })
    // Also connect to top 3 nearest cities by region to avoid too many edges
    const citiesInRegion = cityEntities
      .filter(city => city.region === event.region)
      .slice(0, 3)

    citiesInRegion.forEach(city => {
      addLink(event.id, city.id)
    })
  })

  return { nodes, links }
}

export function RelationshipGraph({
  onSelectEntity,
  focusId,
  isDark,
  mode,
  centuryYear,
}: RelationshipGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null)
  const nodesRef = useRef<GraphNode[]>([])
  const graphBuiltRef = useRef(false)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [apiEntities, setApiEntities] = useState<SilkRoadEntity[]>(ALL_ENTITIES)
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })

  /* Try Flask API for entity data, fall back to static */
  useEffect(() => {
    let cancelled = false
    fetchAllEntities().then((entities) => {
      if (!cancelled) setApiEntities(entities)
    })
    return () => { cancelled = true }
  }, [])

  /* Resize observer to handle panel open/close with debouncing */
  useEffect(() => {
    if (!containerRef.current) return

    let resizeTimeout: NodeJS.Timeout
    const resizeObserver = new ResizeObserver((entries) => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect
          if (width > 0 && height > 0) {
            setDimensions({ width, height })
          }
        }
      }, 150) // Debounce resize updates
    })

    resizeObserver.observe(containerRef.current)
    return () => {
      clearTimeout(resizeTimeout)
      resizeObserver.disconnect()
    }
  }, [])

  // Use ref to store click handler to avoid triggering graph rebuild when callback changes
  const onSelectEntityRef = useRef(onSelectEntity)
  const apiEntitiesRef = useRef(apiEntities)
  onSelectEntityRef.current = onSelectEntity
  apiEntitiesRef.current = apiEntities

  const handleClick = useCallback((nodeId: string) => {
    const entity = apiEntitiesRef.current.find((e) => e.id === nodeId)
    if (entity) onSelectEntityRef.current(entity)
  }, [])

  // Main effect - builds graph ONCE, does NOT depend on centuryYear
  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()
    graphBuiltRef.current = false

    const width = dimensions.width
    const height = dimensions.height

    const { nodes, links } = buildGraphData(apiEntities)
    if (nodes.length === 0) return

    const g = svg.append("g")

  const zoom = d3
  .zoom<SVGSVGElement, unknown>()
  .scaleExtent(mode === "temporal" ? [1, 1] : [0.3, 5])
  .filter((event) => {
    // Allow all zoom events (wheel, dblclick, touch) unless in temporal mode
    if (mode === "temporal") return false
    // Allow wheel zoom always
    if (event.type === "wheel") return true
    // Allow double-click zoom
    if (event.type === "dblclick") return true
    // For other events (drag pan), require not clicking on a node
    return !event.target.closest(".node-group")
  })
  .on("zoom", (event) => {
    if (mode !== "temporal") {
      g.attr("transform", event.transform)
    }
  })

  // Enable zoom for modes other than temporal and geographic (geographic is locked for click-only interaction)
  if (mode !== "temporal" && mode !== "geographic") {
    svg.call(zoom)
    // Ensure wheel events work for zooming
    svg.on("wheel.zoom", function(event) {
      event.preventDefault()
      const currentTransform = d3.zoomTransform(this)
      const direction = event.deltaY < 0 ? 1.1 : 0.9
      const newK = Math.max(0.3, Math.min(5, currentTransform.k * direction))
      const newTransform = currentTransform.scale(newK / currentTransform.k)
      svg.call(zoom.transform, newTransform)
    })
  } else {
    svg.on(".zoom", null)
  }

    /* Simulation */
    const simulation = d3.forceSimulation(nodes)

    // Type hierarchy for hierarchical layout
    const typeOrder: Record<string, number> = { City: 0, Route: 1, Person: 2, Good: 3, Event: 4, Inscription: 5 }

  // Geographic approximations for geographic layout - includes region for grouping
  const geoPositions: Record<string, { x: number; y: number; region: string }> = {
    // Mediterranean (West)
    constantinople: { x: 0.1, y: 0.25, region: "Mediterranean" },
    istanbul: { x: 0.1, y: 0.25, region: "Mediterranean" },
    alexandria: { x: 0.1, y: 0.55, region: "Mediterranean" },
    antioch: { x: 0.1, y: 0.4, region: "Mediterranean" },
    trabzon: { x: 0.1, y: 0.3, region: "Mediterranean" },

    // Middle East
    baghdad: { x: 0.35, y: 0.45, region: "Middle East" },
    damascus: { x: 0.35, y: 0.35, region: "Middle East" },
    aleppo: { x: 0.35, y: 0.28, region: "Middle East" },
    tabriz: { x: 0.35, y: 0.55, region: "Middle East" },
    hormuz: { x: 0.35, y: 0.7, region: "Middle East" },
    muscat: { x: 0.35, y: 0.8, region: "Middle East" },

    // Central Asia
    samarkand: { x: 0.6, y: 0.3, region: "Central Asia" },
    bukhara: { x: 0.6, y: 0.4, region: "Central Asia" },
    merv: { x: 0.6, y: 0.5, region: "Central Asia" },
    kashgar: { x: 0.6, y: 0.6, region: "Central Asia" },
    ferghana: { x: 0.6, y: 0.7, region: "Central Asia" },
    turfan: { x: 0.6, y: 0.25, region: "Central Asia" },

    // East Asia
    xian: { x: 0.85, y: 0.35, region: "East Asia" },
    changan: { x: 0.85, y: 0.35, region: "East Asia" },
    dunhuang: { x: 0.85, y: 0.5, region: "East Asia" },
    quanzhou: { x: 0.85, y: 0.65, region: "East Asia" },
  }

    if (mode === "radial") {
      // Radial layout - concentric circles by entity type
      const centerX = width / 2
      const centerY = height / 2

      // If there's a focus, put it in center
      if (focusId) {
        const focusNode = nodes.find((n) => n.id === focusId)
        if (focusNode) {
          focusNode.fx = centerX
          focusNode.fy = centerY
        }
      }

      // Group nodes by type and arrange in concentric rings
      const typeRings: Record<string, number> = { City: 1, Route: 1.5, Good: 2, Event: 2.5, Person: 3, Inscription: 3.5 }
      const typeGroups = new Map<string, GraphNode[]>()
      nodes.filter(n => n.id !== focusId).forEach(n => {
        const group = typeGroups.get(n.type) || []
        group.push(n)
        typeGroups.set(n.type, group)
      })

      const baseRadius = Math.min(width, height) * 0.12
      typeGroups.forEach((groupNodes, type) => {
        const ringRadius = baseRadius * (typeRings[type] || 2)
        groupNodes.forEach((node, i) => {
          const angle = (2 * Math.PI * i) / groupNodes.length - Math.PI / 2
          node.fx = centerX + Math.cos(angle) * ringRadius
          node.fy = centerY + Math.sin(angle) * ringRadius
        })
      })

      simulation
        .force("link", d3.forceLink<GraphNode, GraphLink>(links).id((d) => d.id).distance(50).strength(0.1))
        .force("charge", d3.forceManyBody().strength(-30))

    } else if (mode === "hierarchical") {
      // Hierarchical layout - clean horizontal tiers by type
      const typeGroups = new Map<string, GraphNode[]>()
      nodes.forEach(n => {
        const group = typeGroups.get(n.type) || []
        group.push(n)
        typeGroups.set(n.type, group)
      })

      const types = Array.from(typeGroups.keys()).sort((a, b) => (typeOrder[a] || 99) - (typeOrder[b] || 99))
      const tierHeight = height / (types.length + 1)
      const padding = 60

      types.forEach((type, tierIndex) => {
        const nodesInTier = typeGroups.get(type) || []
        // Sort nodes alphabetically for consistency
        nodesInTier.sort((a, b) => a.name.localeCompare(b.name))
        const availableWidth = width - padding * 2
        const spacing = Math.min(availableWidth / (nodesInTier.length + 1), 80)
        const startX = (width - spacing * (nodesInTier.length - 1)) / 2

        nodesInTier.forEach((node, i) => {
          node.fx = startX + spacing * i
          node.fy = tierHeight * (tierIndex + 1)
        })
      })

      simulation
        .force("link", d3.forceLink<GraphNode, GraphLink>(links).id((d) => d.id).distance(60).strength(0.05))
        .force("charge", d3.forceManyBody().strength(-20))

    } else if (mode === "geographic") {
      // Geographic layout - ONLY show cities, positioned West to East
      const padding = 100
      const cities = nodes.filter(n => n.type === "City")
      const nonCities = nodes.filter(n => n.type !== "City")

      // Hide non-city nodes in geographic view
      nonCities.forEach(n => {
        n.fx = -1000
        n.fy = -1000
      })

      // Define regions with x positions (West to East)
      const regionX: Record<string, number> = {
        "Mediterranean": 0.1,
        "Middle East": 0.35,
        "Central Asia": 0.6,
        "East Asia": 0.85,
        "South Asia": 0.5
      }

      // Group cities by region
      const regionGroups = new Map<string, GraphNode[]>()
      cities.forEach(n => {
        const geo = geoPositions[n.id]
        const region = geo?.region || "Central Asia"
        const group = regionGroups.get(region) || []
        group.push(n)
        regionGroups.set(region, group)
      })

      // Position cities within their region columns
      regionGroups.forEach((regionCities, region) => {
        const xPos = regionX[region] || 0.5
        const regionWidth = 0.15
        regionCities.forEach((node, i) => {
          const geo = geoPositions[node.id]
          const yPos = geo?.y || (0.2 + (i / regionCities.length) * 0.6)
          const xOffset = (i % 3 - 1) * 0.04
          node.fx = padding + (xPos + xOffset) * (width - padding * 2)
          node.fy = padding + yPos * (height - padding * 2)
        })
      })

      // Add region labels to SVG
      const regions = ["Mediterranean", "Middle East", "Central Asia", "East Asia"]
      const regionLabelGroup = svg.append("g").attr("class", "region-labels")

      // Title
      regionLabelGroup.append("text")
        .attr("x", width / 2)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .attr("fill", isDark ? "#C6A75E" : "#7a6f5a")
        .attr("font-size", "12px")
        .attr("font-weight", "700")
        .attr("letter-spacing", "1px")
        .text("SILK ROAD CITIES BY REGION")

      regions.forEach(region => {
        const xPos = regionX[region] || 0.5
        regionLabelGroup.append("text")
          .attr("x", padding + xPos * (width - padding * 2))
          .attr("y", 45)
          .attr("text-anchor", "middle")
          .attr("fill", isDark ? "#a1977a" : "#7a6f5a")
          .attr("font-size", "10px")
          .attr("font-weight", "600")
          .attr("letter-spacing", "0.5px")
          .text(region.toUpperCase())

        // Add subtle vertical divider line
        if (region !== "East Asia") {
          const dividerX = padding + (xPos + 0.125) * (width - padding * 2)
          regionLabelGroup.append("line")
            .attr("x1", dividerX)
            .attr("y1", 55)
            .attr("x2", dividerX)
            .attr("y2", height - 40)
            .attr("stroke", isDark ? "rgba(161,151,122,0.15)" : "rgba(122,111,90,0.1)")
            .attr("stroke-dasharray", "4,4")
        }
      })

      // Note at bottom
      regionLabelGroup.append("text")
        .attr("x", width / 2)
        .attr("y", height - 15)
        .attr("text-anchor", "middle")
        .attr("fill", isDark ? "#7a7060" : "#9a8a7a")
        .attr("font-size", "9px")
        .attr("font-style", "italic")
        .text("Only cities are shown in Geographic view - arranged from West (left) to East (right)")

      simulation
        .force("link", null)
        .force("charge", d3.forceManyBody().strength(-30))
        .force("collision", d3.forceCollide().radius(35))

    } else if (mode === "commodity") {
      // Trade flow - goods on left, cities on right, connections between
      const goods = nodes.filter(n => n.type === "Good")
      const cities = nodes.filter(n => n.type === "City")
      const others = nodes.filter(n => n.type !== "Good" && n.type !== "City")

      const padding = 100
      const goodsX = padding
      const citiesX = width - padding

      // Position goods in a vertical column on the left
      goods.sort((a, b) => a.name.localeCompare(b.name))
      const goodSpacing = (height - padding * 2) / (goods.length + 1)
      goods.forEach((node, i) => {
        node.fx = goodsX
        node.fy = padding + goodSpacing * (i + 1)
      })

      // Position cities in a vertical column on the right
      cities.sort((a, b) => a.name.localeCompare(b.name))
      const citySpacing = (height - padding * 2) / (cities.length + 1)
      cities.forEach((node, i) => {
        node.fx = citiesX
        node.fy = padding + citySpacing * (i + 1)
      })

      // Others float in the middle
      others.forEach(node => {
        node.x = width / 2 + (Math.random() - 0.5) * 100
        node.y = height / 2 + (Math.random() - 0.5) * 200
      })

      simulation
        .force("link", d3.forceLink<GraphNode, GraphLink>(links).id((d) => d.id).distance(100).strength(0.1))
        .force("charge", d3.forceManyBody().strength(-30))
        .force("collision", d3.forceCollide().radius(20))

    } else if (mode === "temporal") {
      // Timeline - structured horizontal layout with 6 entity-type lanes
      const padding = 140 // Increased left padding for lane labels
      const topPadding = 60
      const bottomPadding = 100
      const availableWidth = width - padding - 40
      const availableHeight = height - topPadding - bottomPadding

      const minYear = -200
      const maxYear = 1500
      const yearRange = maxYear - minYear

      // Add timeline structure group
      const timelineGroup = svg.append("g").attr("class", "timeline-structure")

      // Define lanes for each entity type
      const lanes = [
        { type: "City", label: "Cities", y: 0.08 },
        { type: "Route", label: "Routes", y: 0.24 },
        { type: "Good", label: "Goods", y: 0.40 },
        { type: "Event", label: "Events", y: 0.56 },
        { type: "Person", label: "Persons", y: 0.72 },
        { type: "Inscription", label: "Inscriptions", y: 0.88 },
      ]

      // Draw vertical grid lines at key centuries (0 CE, 500 CE, 1000 CE)
      const gridYears = [0, 500, 1000]
      gridYears.forEach(gridYear => {
        const x = padding + ((gridYear - minYear) / yearRange) * availableWidth
        timelineGroup.append("line")
          .attr("x1", x)
          .attr("y1", topPadding)
          .attr("x2", x)
          .attr("y2", height - bottomPadding + 20)
          .attr("stroke", isDark ? "rgba(198,167,94,0.15)" : "rgba(100,80,40,0.1)")
          .attr("stroke-width", 1)
          .attr("stroke-dasharray", "4,3")
      })

      // Draw lane backgrounds (alternate subtle colors for visual separation)
      lanes.forEach((lane, idx) => {
        const laneY = topPadding + lane.y * availableHeight
        const laneHeight = availableHeight / lanes.length

        if (idx % 2 === 0) {
          timelineGroup.append("rect")
            .attr("x", padding - 10)
            .attr("y", laneY - laneHeight / 2)
            .attr("width", availableWidth + 50)
            .attr("height", laneHeight)
            .attr("fill", isDark ? "rgba(198,167,94,0.03)" : "rgba(100,80,40,0.02)")
            .attr("rx", 2)
        }

        // Lane label on the left (outside the plotting area)
        timelineGroup.append("text")
          .attr("x", padding - 20)
          .attr("y", laneY + 4)
          .attr("text-anchor", "end")
          .attr("fill", isDark ? "#a1977a" : "#7a6f5a")
          .attr("font-size", "10px")
          .attr("font-weight", "600")
          .attr("letter-spacing", "0.5px")
          .text(lane.label.toUpperCase())
      })

      // Draw main timeline axis
      timelineGroup.append("line")
        .attr("x1", padding)
        .attr("y1", height - bottomPadding + 20)
        .attr("x2", width - 40)
        .attr("y2", height - bottomPadding + 20)
        .attr("stroke", isDark ? "#a1977a" : "#7a6f5a")
        .attr("stroke-width", 2.5)

      // Add year markers with better spacing
      const yearMarkers = [-200, 0, 200, 500, 800, 1000, 1200, 1400]
      yearMarkers.forEach(year => {
        const x = padding + ((year - minYear) / yearRange) * availableWidth

        // Tick mark - longer for major centuries
        const isMajor = year === 0 || year === 500 || year === 1000
        const tickHeight = isMajor ? 12 : 6
        timelineGroup.append("line")
          .attr("x1", x)
          .attr("y1", height - bottomPadding + 20)
          .attr("x2", x)
          .attr("y2", height - bottomPadding + 20 + tickHeight)
          .attr("stroke", isDark ? "#a1977a" : "#7a6f5a")
          .attr("stroke-width", isMajor ? 2 : 1)

        // Year label
        const label = year < 0 ? `${Math.abs(year)} BCE` : year === 0 ? "0 CE" : `${year} CE`
        timelineGroup.append("text")
          .attr("x", x)
          .attr("y", height - bottomPadding + 35 + tickHeight)
          .attr("text-anchor", "middle")
          .attr("fill", isDark ? "#a1977a" : "#7a6f5a")
          .attr("font-size", isMajor ? "9px" : "8px")
          .attr("font-weight", isMajor ? "600" : "400")
          .text(label)
      })

      // Group nodes by type to track importance ranking
      const nodesByType = new Map<string, GraphNode[]>()
      nodes.forEach(n => {
        if (!nodesByType.has(n.type)) nodesByType.set(n.type, [])
        nodesByType.get(n.type)!.push(n)
      })

      // Sort each type by importance for label priority
      const importanceOrder = { Major: 0, Significant: 1, Moderate: 2, Minor: 3 }
      nodesByType.forEach(group => {
        group.sort((a, b) =>
          (importanceOrder[a.importance as keyof typeof importanceOrder] || 99) -
          (importanceOrder[b.importance as keyof typeof importanceOrder] || 99)
        )
      })

      // Track which nodes should show persistent labels (top 5-7 total)
      const labelCount = 6
      let labelsShown = 0
      const nodesToLabel = new Set<string>()

      // Collect top entities across all types
      nodesByType.forEach((group) => {
        for (const node of group) {
          if (labelsShown < labelCount) {
            nodesToLabel.add(node.id)
            labelsShown++
          }
        }
      })

      // Position nodes on the timeline
      nodes.forEach(n => {
        const yearNorm = Math.max(0, Math.min(1, (n.startYear - minYear) / yearRange))
        const lane = lanes.find(l => l.type === n.type)
        const laneY = topPadding + (lane?.y || 0.5) * availableHeight

        // Find nodes in same type+50year bin to spread them vertically
        const typeGroup = nodesByType.get(n.type) || []
        const yearBin = Math.floor(n.startYear / 50)
        const sameYearBin = typeGroup.filter(node => Math.floor(node.startYear / 50) === yearBin)
        const indexInBin = sameYearBin.indexOf(n)

        // Vertical spread within lane
        const spreadAmount = Math.min(availableHeight / lanes.length * 0.35, 18)
        const yOffset = (indexInBin - (sameYearBin.length - 1) / 2) *
                       (spreadAmount / Math.max(sameYearBin.length - 1, 1))

        // Set initial position for temporal layout
        n.x = padding + yearNorm * availableWidth
        n.y = laneY + yOffset

        // Mark if this node should show persistent label
        ;(n as any).showLabel = nodesToLabel.has(n.id)
      })

      simulation
        .force("link", null)
        .force("charge", d3.forceManyBody().strength(-4))
        .force("collision", d3.forceCollide().radius(14))
        .force("x", d3.forceX((d: GraphNode) => {
          // Keep nodes pinned to their calculated x position (year position)
          const yearNorm = Math.max(0, Math.min(1, (d.startYear - minYear) / yearRange))
          return padding + yearNorm * availableWidth
        }).strength(1))
        .force("y", d3.forceY((d: GraphNode) => {
          // Keep nodes near their lane y position with some jitter room for collisions
          const lane = lanes.find(l => l.type === d.type)
          return topPadding + (lane?.y || 0.5) * availableHeight
        }).strength(0.5))

    } else {
      // Default force-directed - clean clustered layout
      simulation
        .force("link", d3.forceLink<GraphNode, GraphLink>(links).id((d) => d.id).distance(60).strength(0.7))
        .force("charge", d3.forceManyBody().strength(-120).distanceMax(200))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("x", d3.forceX(width / 2).strength(0.1))
        .force("y", d3.forceY(height / 2).strength(0.1))
        .force("collision", d3.forceCollide().radius(30))
    }

    /* Links */
    const linkColor = isDark ? "rgba(198,167,94,0.12)" : "rgba(100,80,40,0.1)"
    const linkHighlight = isDark ? "#C6A75E" : "#9a7b3c"

    const linkGroup = g.append("g").attr("opacity", 0)

    // Fade in the link group after a delay
    linkGroup.transition().duration(400).delay(100).attr("opacity", 1)

    const link = linkGroup
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("class", "relationship-link")
      .attr("stroke", linkColor)
      .attr("stroke-width", 1.5)

    /* Nodes */
    const node = g
      .append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("class", "node-group")
      .attr("cursor", "pointer")
      .call(
        d3
          .drag<SVGGElement, GraphNode>()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart()
            d.fx = d.x
            d.fy = d.y
          })
          .on("drag", (event, d) => {
            d.fx = event.x
            d.fy = event.y
          })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0)
            d.fx = null
            d.fy = null
          })
      )

    /* Node circles with smooth fade-in */
    node
      .append("circle")
      .attr("r", 0)
      .attr("fill", (d) => TYPE_COLORS[d.type] || "#666")
      .attr("stroke", (d) =>
        focusId && d.id === focusId
          ? isDark ? "#fff" : "#1a2744"
          : isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"
      )
      .attr("stroke-width", (d) => (focusId && d.id === focusId ? 3 : 1))
      .attr("opacity", 0)
      .transition()
      .duration(400)
      .delay((_d, i) => i * 15)
      .attr("r", (d) => (d.importance === "Major" ? 13 : 8))
      .attr("opacity", 0.85)

    // Add diamond shapes for events in temporal mode
    if (mode === "temporal") {
      node
        .filter((d) => d.type === "Event")
        .select("circle")
        .remove()

      node
        .filter((d) => d.type === "Event")
        .append("path")
        .attr("d", (d) => {
          const r = d.importance === "Major" ? 11 : 6.5
          return `M 0 ${-r} L ${r} 0 L 0 ${r} L ${-r} 0 Z`
        })
        .attr("fill", TYPE_COLORS.Event)
        .attr("stroke", (d) =>
          focusId && d.id === focusId
            ? isDark ? "#fff" : "#1a2744"
            : isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"
        )
        .attr("stroke-width", (d) => (focusId && d.id === focusId ? 3 : 1))
        .attr("opacity", 0)
        .transition()
        .duration(400)
        .delay((_d, i) => i * 15)
        .attr("opacity", 0.85)
    }

    /* Glow ring for focused node */
    if (focusId) {
      node
        .filter((d) => d.id === focusId)
        .append("circle")
        .attr("r", (d) => {
          // Larger glow for diamonds (events in temporal mode)
          if (mode === "temporal" && d.type === "Event") return 20
          return 22
        })
        .attr("fill", "none")
        .attr("stroke", "#C6A75E")
        .attr("stroke-width", 1.5)
        .attr("opacity", 0.4)
        .attr("stroke-dasharray", "4 4")
    }

    /* Labels with smart visibility */
    node
      .append("text")
      .text((d) => d.name)
      .attr("x", 0)
      .attr("y", (d) => (d.importance === "Major" ? -20 : -14))
      .attr("text-anchor", "middle")
      .attr("fill", isDark ? "rgba(230,194,122,0.8)" : "rgba(60,45,20,0.7)")
      .attr("font-size", (d) => (d.importance === "Major" ? "11px" : "9px"))
      .attr("font-weight", (d) => (d.importance === "Major" ? "600" : "400"))
      .attr("pointer-events", "none")
      .attr("opacity", (d) => {
        // In temporal mode, only show persistent labels for top entities
        if (mode === "temporal") {
          return (d as any).showLabel ? 0.9 : 0
        }
        return 0
      })
      .transition()
      .duration(400)
      .delay((_d, i) => 200 + i * 15)
      .attr("opacity", (d) => {
        if (mode === "temporal") {
          return (d as any).showLabel ? 0.9 : 0
        }
        return 1
      })

    /* Interactions */
    node
      .on("mouseenter", function (_event, d) {
        setHoveredNode(d.id)

        // Show label on hover in temporal mode
        if (mode === "temporal") {
          d3.select(this).select("text")
            .transition()
            .duration(150)
            .attr("opacity", 0.9)
        }

        // Handle hover opacity for both circles and diamonds
        if (mode === "temporal" && d.type === "Event") {
          // For events in temporal mode, highlight the diamond
          d3.select(this).select("path").attr("opacity", 1)
        } else {
          // For all other nodes, highlight the circle
          d3.select(this).select("circle").attr("opacity", 1)
        }

        link
          .attr("stroke", (l) => {
            const src = typeof l.source === "object" ? (l.source as GraphNode).id : l.source
            const tgt = typeof l.target === "object" ? (l.target as GraphNode).id : l.target
            return src === d.id || tgt === d.id ? linkHighlight : isDark ? "rgba(198,167,94,0.05)" : "rgba(100,80,40,0.04)"
          })
          .attr("stroke-width", (l) => {
            const src = typeof l.source === "object" ? (l.source as GraphNode).id : l.source
            const tgt = typeof l.target === "object" ? (l.target as GraphNode).id : l.target
            return src === d.id || tgt === d.id ? 3 : 1
          })
      })
      .on("mouseleave", function (d: any) {
        setHoveredNode(null)

        // Hide label on leave if not in persistent show list (temporal mode)
        if (mode === "temporal") {
          const shouldShow = (d as any).showLabel
          d3.select(this).select("text")
            .transition()
            .duration(150)
            .attr("opacity", shouldShow ? 0.9 : 0)
        }

        // Reset opacity for both circles and diamonds
        if (mode === "temporal" && d.type === "Event") {
          d3.select(this).select("path").attr("opacity", 0.85)
        } else {
          d3.select(this).select("circle").attr("opacity", 0.85)
        }

        link.attr("stroke", linkColor).attr("stroke-width", 1.5)
      })
      .on("click", (event, d) => {
        event.stopPropagation()
        handleClick(d.id)
      })
      .style("cursor", "pointer")
      .style("pointer-events", "auto")

    /* Run simulation synchronously to settle positions instantly */
    simulation.stop()
    for (let i = 0; i < 300; i++) {
      simulation.tick()
    }

    // Apply bounds constraint after settling
    const padding = 50
    nodes.forEach(n => {
      if (n.fx === undefined) n.x = Math.max(padding, Math.min(width - padding, n.x || width / 2))
      if (n.fy === undefined) n.y = Math.max(padding, Math.min(height - padding, n.y || height / 2))
    })

    // Update positions immediately
    link
      .attr("x1", (d) => (d.source as GraphNode).x ?? 0)
      .attr("y1", (d) => (d.source as GraphNode).y ?? 0)
      .attr("x2", (d) => (d.target as GraphNode).x ?? 0)
      .attr("y2", (d) => (d.target as GraphNode).y ?? 0)

    node.attr("transform", (d) => `translate(${d.x ?? 0},${d.y ?? 0})`)

    /* Tick handler for drag interactions */
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => (d.source as GraphNode).x ?? 0)
        .attr("y1", (d) => (d.source as GraphNode).y ?? 0)
        .attr("x2", (d) => (d.target as GraphNode).x ?? 0)
        .attr("y2", (d) => (d.target as GraphNode).y ?? 0)

      node.attr("transform", (d) => `translate(${d.x ?? 0},${d.y ?? 0})`)
    })

    // Store refs for zoom effect
    zoomRef.current = zoom
    nodesRef.current = nodes
    graphBuiltRef.current = true

    // Apply temporal filtering immediately after graph is built
    const centuryStart = Math.floor(centuryYear / 100) * 100
    const centuryEnd = centuryStart + 99

    node.attr("visibility", (d) => {
      if (!d || d.startYear === undefined || d.endYear === undefined) return "visible"
      const isActive = d.startYear <= centuryEnd && d.endYear >= centuryStart
      return isActive ? "visible" : "hidden"
    })
    .style("pointer-events", (d) => {
      if (!d || d.startYear === undefined || d.endYear === undefined) return "auto"
      const isActive = d.startYear <= centuryEnd && d.endYear >= centuryStart
      return isActive ? "auto" : "none"
    })

    link.attr("visibility", (d) => {
      const source = d.source as GraphNode
      const target = d.target as GraphNode
      if (!source || !target) return "hidden"
      const sourceActive = source.startYear !== undefined && source.startYear <= centuryEnd && source.endYear !== undefined && source.endYear >= centuryStart
      const targetActive = target.startYear !== undefined && target.startYear <= centuryEnd && target.endYear !== undefined && target.endYear >= centuryStart
      return (sourceActive && targetActive) ? "visible" : "hidden"
    })

    return () => { simulation.stop() }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDark, mode, apiEntities, dimensions])

  // Effect for temporal filtering when year changes (without rebuilding graph)
  useEffect(() => {
    if (!svgRef.current || !graphBuiltRef.current) return

    const svg = d3.select(svgRef.current)
    const centuryStart = Math.floor(centuryYear / 100) * 100
    const centuryEnd = centuryStart + 99

    svg.selectAll<SVGGElement, GraphNode>("g.node-group")
      .attr("visibility", (d) => {
        if (!d || d.startYear === undefined || d.endYear === undefined) return "visible"
        const isActive = d.startYear <= centuryEnd && d.endYear >= centuryStart
        return isActive ? "visible" : "hidden"
      })
      .style("pointer-events", (d) => {
        if (!d || d.startYear === undefined || d.endYear === undefined) return "auto"
        const isActive = d.startYear <= centuryEnd && d.endYear >= centuryStart
        return isActive ? "auto" : "none"
      })

    svg.selectAll<SVGLineElement, GraphLink>(".relationship-link")
      .attr("visibility", (d) => {
        if (!d || !d.source || !d.target) return "hidden"

        const source = d.source as GraphNode
        const target = d.target as GraphNode
        if (!source || !target) return "hidden"

        const sourceActive = source.startYear !== undefined && source.startYear <= centuryEnd && source.endYear !== undefined && source.endYear >= centuryStart
        const targetActive = target.startYear !== undefined && target.startYear <= centuryEnd && target.endYear !== undefined && target.endYear >= centuryStart
        return (sourceActive && targetActive) ? "visible" : "hidden"
      })
  }, [centuryYear])

  // Separate effect for zooming to focus node - doesn't rebuild the graph
  useEffect(() => {
    if (!svgRef.current || !zoomRef.current || !focusId) return
    
    // Delay to allow simulation to settle nodes into position
    const timeoutId = setTimeout(() => {
      if (!svgRef.current || !zoomRef.current) return
      
      const svg = d3.select(svgRef.current)
      const zoom = zoomRef.current
      const nodes = nodesRef.current
      const { width, height } = dimensions
      
      const focusNode = nodes.find((n) => n.id === focusId)
      if (focusNode && focusNode.x !== undefined && focusNode.y !== undefined) {
        svg
          .transition()
          .duration(600)
          .call(
            zoom.transform,
            d3.zoomIdentity
              .translate(width / 2, height / 2)
              .scale(1.5)
              .translate(-focusNode.x, -focusNode.y)
          )
        
        // Update visual highlight for focused node
        svg.selectAll<SVGCircleElement, GraphNode>("circle")
          .attr("stroke", (d) =>
            d.id === focusId
              ? isDark ? "#fff" : "#1a2744"
              : isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"
          )
          .attr("stroke-width", (d) => (d.id === focusId ? 3 : 1))
      }
    }, 800) // Wait for simulation to settle
    
    return () => clearTimeout(timeoutId)
  }, [focusId, dimensions, isDark])

  return (
    <div ref={containerRef} className="relative h-full w-full">
      <svg ref={svgRef} className="h-full w-full" />

      {hoveredNode && (
        <div className="absolute right-4 top-4 rounded-md border border-border bg-card/90 px-3 py-2 text-xs backdrop-blur-sm">
          <span className="text-muted-foreground">Hover: </span>
          <span className="font-medium text-foreground">
            {apiEntities.find((e) => e.id === hoveredNode)?.name || hoveredNode}
          </span>
        </div>
      )}
    </div>
  )
}
