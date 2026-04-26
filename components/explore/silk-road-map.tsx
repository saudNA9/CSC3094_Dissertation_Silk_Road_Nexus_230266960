/*
 * components/explore/silk-road-map.tsx
 * Interactive Mapbox GL map that renders the Silk Road network spatially.
 * It will:
 * - Initialise a Mapbox map with the custom antique-style base layer
 * - Draw trade route polylines as animated dashed lines coloured by route type
 * - Place 3D architectural city markers at each entity's geographic coordinate
 * - Update visible entities and routes whenever the century slider changes
 * - Fire the onEntitySelect callback when a city marker or popup link is clicked
 */

"use client"

import { useRef, useEffect, useCallback } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import {
  CITIES,
  ALL_ENTITIES,
  type SilkRoadEntity,
  type RouteSegment,
} from "@/lib/silk-road-data"
import {
  getCityArchitecture,
  needsVisibilityBoost,
  type CityArchitecture,
  type BuildingShape,
} from "@/lib/city-architectures"
import {
  getCityStateForYear,
  getActiveEventAnnotation,
  getCityStateVisuals,
  type CityState,
  type CityHistoricalEvent,
} from "@/lib/city-historical-events"

/* ── Colour palette ── */
const GOLD = "#C6A75E"
const GOLD_DIM = "rgba(198,167,94,0.45)"
const MARITIME = "#5B8FB9"

/* ── Bounds: Silk Road geographic region (Mediterranean to China) ── */
const SILK_ROAD_BOUNDS: mapboxgl.LngLatBoundsLike = [
  [15, 10], // SW corner
  [120, 55], // NE corner
]

/* ── Helper: Adjust hex color brightness ── */
function adjustBrightness(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16)
  const amt = Math.round(2.55 * percent)
  const R = Math.max(0, Math.min(255, (num >> 16) + amt))
  const G = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amt))
  const B = Math.max(0, Math.min(255, (num & 0x0000ff) + amt))
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`
}

/* ── Create 3D city model DOM element ── */
function create3DCityModel(
  architecture: CityArchitecture,
  isSelected: boolean,
  isDark: boolean,
  scaleMultiplier: number = 1
): HTMLDivElement {
  const baseScale = architecture.baseScale * scaleMultiplier * 0.6

  const container = document.createElement("div")
  container.className = "city-3d-marker"
  container.style.cssText = `
    position: relative;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    transform-style: preserve-3d;
    pointer-events: auto;
    transition: transform 0.2s ease, opacity 0.3s ease, filter 0.3s ease;
  `

  // Ground platform/shadow
  const ground = document.createElement("div")
  ground.style.cssText = `
    position: absolute;
    left: 50%;
    bottom: -3px;
    transform: translateX(-50%);
    width: ${55 * baseScale}px;
    height: ${20 * baseScale}px;
    background: radial-gradient(ellipse, ${isDark ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.15)"} 0%, transparent 70%);
    border-radius: 50%;
  `
  container.appendChild(ground)

  // Sort buildings back-to-front for proper layering
  const sortedBuildings = [...architecture.buildings].sort(
    (a, b) => (a.offsetZ || 0) - (b.offsetZ || 0)
  )

  sortedBuildings.forEach((building) => {
    const buildingEl = createBuilding(building, isDark, baseScale)
    if (buildingEl) container.appendChild(buildingEl)
  })

  // Selection glow effect
  if (isSelected) {
    const glow = document.createElement("div")
    glow.style.cssText = `
      position: absolute;
      left: 50%;
      bottom: -5px;
      transform: translateX(-50%);
      width: ${65 * baseScale}px;
      height: ${25 * baseScale}px;
      background: radial-gradient(ellipse, ${GOLD}50 0%, transparent 70%);
      border-radius: 50%;
      animation: city-glow 2s ease-in-out infinite;
    `
    container.appendChild(glow)
  }

  return container
}

/* ── Create individual building element ── */
function createBuilding(
  shape: BuildingShape,
  isDark: boolean,
  baseScale: number
): HTMLDivElement | null {
  const w = shape.width * baseScale
  const h = shape.height * baseScale
  const x = (shape.offsetX || 0) * baseScale
  const y = (shape.offsetY || 0) * baseScale
  const z = (shape.offsetZ || 0) * baseScale
  const color = shape.color || (isDark ? "#C6A75E" : "#8a7a60")
  const accent = shape.accent || color
  const shadowColor = isDark ? adjustBrightness(color, -25) : adjustBrightness(color, -20)
  const highlightColor = isDark ? adjustBrightness(color, 20) : adjustBrightness(color, 15)

  const wrapper = document.createElement("div")
  wrapper.style.cssText = `
    position: absolute;
    left: 50%;
    bottom: ${y}px;
    transform-style: preserve-3d;
    transform: translateX(calc(-50% + ${x}px)) translateZ(${z}px);
  `

  switch (shape.type) {
    case "dome": {
      // Dome base
      const base = document.createElement("div")
      base.style.cssText = `
        width: ${w}px;
        height: ${h * 0.3}px;
        background: linear-gradient(90deg, ${shadowColor} 0%, ${color} 30%, ${highlightColor} 70%, ${shadowColor} 100%);
        border-radius: 2px 2px 0 0;
      `
      wrapper.appendChild(base)

      // Dome hemisphere
      const dome = document.createElement("div")
      dome.style.cssText = `
        position: absolute;
        bottom: ${h * 0.3 - 1}px;
        left: 50%;
        transform: translateX(-50%);
        width: ${w}px;
        height: ${h * 0.7}px;
        background: radial-gradient(ellipse 60% 80% at 40% 60%, ${highlightColor} 0%, ${color} 40%, ${shadowColor} 100%);
        border-radius: 50% 50% 0 0;
        box-shadow: ${isDark ? "0 -2px 6px rgba(0,0,0,0.3)" : "0 -1px 3px rgba(0,0,0,0.15)"};
      `
      wrapper.appendChild(dome)

      // Finial
      const finial = document.createElement("div")
      finial.style.cssText = `
        position: absolute;
        bottom: ${h - 2}px;
        left: 50%;
        transform: translateX(-50%);
        width: ${4 * baseScale}px;
        height: ${5 * baseScale}px;
        background: ${accent};
        border-radius: 50%;
      `
      wrapper.appendChild(finial)
      break
    }

    case "minaret": {
      // Shaft
      const shaft = document.createElement("div")
      shaft.style.cssText = `
        width: ${w}px;
        height: ${h * 0.85}px;
        background: linear-gradient(90deg, ${shadowColor} 0%, ${color} 35%, ${highlightColor} 65%, ${shadowColor} 100%);
        border-radius: 2px;
        clip-path: polygon(10% 100%, 90% 100%, 85% 0%, 15% 0%);
      `
      wrapper.appendChild(shaft)

      // Balcony
      const balcony = document.createElement("div")
      balcony.style.cssText = `
        position: absolute;
        bottom: ${h * 0.65}px;
        left: 50%;
        transform: translateX(-50%);
        width: ${w * 1.4}px;
        height: ${3 * baseScale}px;
        background: ${accent};
        border-radius: 1px;
      `
      wrapper.appendChild(balcony)

      // Conical top
      const top = document.createElement("div")
      top.style.cssText = `
        position: absolute;
        bottom: ${h * 0.85 - 1}px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: ${w * 0.6}px solid transparent;
        border-right: ${w * 0.6}px solid transparent;
        border-bottom: ${h * 0.15}px solid ${accent};
      `
      wrapper.appendChild(top)
      break
    }

    case "tower": {
      const body = document.createElement("div")
      body.style.cssText = `
        width: ${w}px;
        height: ${h * 0.85}px;
        background: linear-gradient(90deg, ${shadowColor} 0%, ${color} 40%, ${highlightColor} 60%, ${shadowColor} 100%);
        border-radius: 2px 2px 0 0;
      `
      wrapper.appendChild(body)

      // Crenellations
      const cren = document.createElement("div")
      cren.style.cssText = `
        position: absolute;
        bottom: ${h * 0.85 - 1}px;
        left: 0;
        width: ${w}px;
        height: ${h * 0.15}px;
        background: repeating-linear-gradient(90deg, ${color} 0px, ${color} ${w / 4}px, transparent ${w / 4}px, transparent ${w / 3}px);
      `
      wrapper.appendChild(cren)
      break
    }

    case "wall": {
      const wall = document.createElement("div")
      wall.style.cssText = `
        width: ${w}px;
        height: ${h}px;
        background: linear-gradient(180deg, ${highlightColor} 0%, ${color} 50%, ${shadowColor} 100%);
        border-radius: 1px;
        box-shadow: ${isDark ? "0 2px 4px rgba(0,0,0,0.3)" : "0 1px 2px rgba(0,0,0,0.15)"};
      `
      wrapper.appendChild(wall)
      break
    }

    case "fortress": {
      // Main body
      const body = document.createElement("div")
      body.style.cssText = `
        width: ${w}px;
        height: ${h * 0.7}px;
        background: linear-gradient(180deg, ${color} 0%, ${shadowColor} 100%);
        border-radius: 2px 2px 0 0;
        clip-path: polygon(5% 100%, 95% 100%, 100% 0%, 0% 0%);
      `
      wrapper.appendChild(body)

      // Platform
      const platform = document.createElement("div")
      platform.style.cssText = `
        position: absolute;
        bottom: ${h * 0.7 - 1}px;
        left: 50%;
        transform: translateX(-50%);
        width: ${w * 1.05}px;
        height: ${h * 0.15}px;
        background: ${color};
        border-radius: 1px;
      `
      wrapper.appendChild(platform)

      // Crenellations
      const cren = document.createElement("div")
      cren.style.cssText = `
        position: absolute;
        bottom: ${h * 0.85 - 2}px;
        left: 50%;
        transform: translateX(-50%);
        width: ${w * 1.05}px;
        height: ${h * 0.15}px;
        background: repeating-linear-gradient(90deg, ${highlightColor} 0px, ${highlightColor} ${w / 5}px, transparent ${w / 5}px, transparent ${w / 4}px);
      `
      wrapper.appendChild(cren)
      break
    }

    case "pagoda": {
      const tiers = shape.tiers || 5
      for (let i = 0; i < tiers; i++) {
        const tierH = (h / tiers) * 0.9
        const tierW = w * (1 - i * 0.12)
        const bottom = i * (h / tiers)

        // Tier body
        const tierBody = document.createElement("div")
        tierBody.style.cssText = `
          position: absolute;
          bottom: ${bottom}px;
          left: 50%;
          transform: translateX(-50%);
          width: ${tierW}px;
          height: ${tierH * 0.6}px;
          background: linear-gradient(180deg, ${highlightColor} 0%, ${color} 100%);
        `
        wrapper.appendChild(tierBody)

        // Roof
        const roof = document.createElement("div")
        roof.style.cssText = `
          position: absolute;
          bottom: ${bottom + tierH * 0.5}px;
          left: 50%;
          transform: translateX(-50%);
          width: ${tierW * 1.3}px;
          height: ${tierH * 0.5}px;
          background: ${accent || shadowColor};
          clip-path: polygon(15% 100%, 85% 100%, 100% 0%, 0% 0%);
          border-radius: 0 0 2px 2px;
        `
        wrapper.appendChild(roof)
      }

      // Spire
      const spire = document.createElement("div")
      spire.style.cssText = `
        position: absolute;
        bottom: ${h - 2}px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: ${4 * baseScale}px solid transparent;
        border-right: ${4 * baseScale}px solid transparent;
        border-bottom: ${8 * baseScale}px solid ${GOLD};
      `
      wrapper.appendChild(spire)
      break
    }

    case "gate": {
      // Gate body
      const body = document.createElement("div")
      body.style.cssText = `
        width: ${w}px;
        height: ${h}px;
        background: linear-gradient(180deg, ${highlightColor} 0%, ${color} 60%, ${shadowColor} 100%);
        border-radius: 4px 4px 0 0;
      `
      wrapper.appendChild(body)

      // Arch
      const arch = document.createElement("div")
      arch.style.cssText = `
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: ${w * 0.5}px;
        height: ${h * 0.5}px;
        background: ${isDark ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.4)"};
        border-radius: ${w * 0.25}px ${w * 0.25}px 0 0;
      `
      wrapper.appendChild(arch)

      // Chinese-style roof
      const roof = document.createElement("div")
      roof.style.cssText = `
        position: absolute;
        bottom: ${h - 2}px;
        left: 50%;
        transform: translateX(-50%);
        width: ${w * 1.3}px;
        height: ${h * 0.2}px;
        background: ${accent || shadowColor};
        clip-path: polygon(10% 100%, 90% 100%, 100% 0%, 0% 0%);
        border-radius: 2px;
      `
      wrapper.appendChild(roof)
      break
    }

    case "bazaar": {
      const hall = document.createElement("div")
      hall.style.cssText = `
        width: ${w}px;
        height: ${h}px;
        background: linear-gradient(180deg, ${color} 0%, ${shadowColor} 100%);
        border-radius: ${h * 0.5}px ${h * 0.5}px 0 0;
        box-shadow: ${isDark ? "0 2px 4px rgba(0,0,0,0.3)" : "0 1px 2px rgba(0,0,0,0.15)"};
      `
      wrapper.appendChild(hall)
      break
    }

    case "columns": {
      // Roman-style colonnade with arches
      const numArches = shape.arches || 4
      const archWidth = w / numArches

      for (let i = 0; i < numArches; i++) {
        // Column
        const col = document.createElement("div")
        col.style.cssText = `
          position: absolute;
          bottom: 0;
          left: ${i * archWidth}px;
          width: ${archWidth * 0.2}px;
          height: ${h}px;
          background: linear-gradient(90deg, ${shadowColor} 0%, ${color} 50%, ${highlightColor} 100%);
          border-radius: 1px;
        `
        wrapper.appendChild(col)

        // Capital (top of column)
        const cap = document.createElement("div")
        cap.style.cssText = `
          position: absolute;
          bottom: ${h - 2}px;
          left: ${i * archWidth - archWidth * 0.05}px;
          width: ${archWidth * 0.3}px;
          height: ${4 * baseScale}px;
          background: ${highlightColor};
        `
        wrapper.appendChild(cap)
      }
      // Last column
      const lastCol = document.createElement("div")
      lastCol.style.cssText = `
        position: absolute;
        bottom: 0;
        right: 0;
        width: ${archWidth * 0.2}px;
        height: ${h}px;
        background: linear-gradient(90deg, ${shadowColor} 0%, ${color} 50%, ${highlightColor} 100%);
      `
      wrapper.appendChild(lastCol)
      break
    }

    case "citadel": {
      // Raised mound/hill for citadel
      const mound = document.createElement("div")
      mound.style.cssText = `
        width: ${w}px;
        height: ${h}px;
        background: linear-gradient(180deg, ${color} 0%, ${shadowColor} 100%);
        border-radius: 50% 50% 0 0 / 30% 30% 0 0;
        clip-path: polygon(10% 100%, 90% 100%, 100% 30%, 95% 0%, 5% 0%, 0% 30%);
      `
      wrapper.appendChild(mound)
      break
    }

    case "iwan": {
      // Persian/Islamic portal entrance
      const portal = document.createElement("div")
      const patternColor = shape.pattern || accent
      portal.style.cssText = `
        width: ${w}px;
        height: ${h}px;
        background: linear-gradient(180deg, ${color} 0%, ${shadowColor} 100%);
        border-radius: 2px;
        position: relative;
      `
      wrapper.appendChild(portal)

      // Pointed arch opening
      const arch = document.createElement("div")
      arch.style.cssText = `
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: ${w * 0.6}px;
        height: ${h * 0.7}px;
        background: ${isDark ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.5)"};
        border-radius: ${w * 0.3}px ${w * 0.3}px 0 0;
        clip-path: polygon(0% 100%, 50% 0%, 100% 100%);
      `
      wrapper.appendChild(arch)

      // Decorative tile band
      const band = document.createElement("div")
      band.style.cssText = `
        position: absolute;
        top: ${h * 0.1}px;
        left: 50%;
        transform: translateX(-50%);
        width: ${w * 0.9}px;
        height: ${h * 0.15}px;
        background: ${patternColor};
        border-radius: 1px;
      `
      wrapper.appendChild(band)
      break
    }

    case "mausoleum": {
      // Large ribbed dome (Sultan Sanjar style)
      const dome = document.createElement("div")
      dome.style.cssText = `
        width: ${w}px;
        height: ${h}px;
        background: radial-gradient(ellipse 60% 90% at 40% 80%, ${highlightColor} 0%, ${color} 40%, ${shadowColor} 100%);
        border-radius: 50% 50% 10% 10%;
        position: relative;
      `
      wrapper.appendChild(dome)

      // Ribbing effect (vertical lines)
      const ribs = document.createElement("div")
      ribs.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: repeating-linear-gradient(90deg, transparent 0px, transparent ${w / 12}px, rgba(0,0,0,0.1) ${w / 12}px, rgba(0,0,0,0.1) ${w / 11}px);
        border-radius: inherit;
      `
      wrapper.appendChild(ribs)
      break
    }

    case "courtyard": {
      // Open courtyard area
      const court = document.createElement("div")
      court.style.cssText = `
        width: ${w}px;
        height: ${h}px;
        background: ${color};
        border: 1px solid ${shadowColor};
      `
      wrapper.appendChild(court)
      break
    }

    case "conical": {
      // Conical minaret (Turfan Emin style) with texture
      const cone = document.createElement("div")
      cone.style.cssText = `
        width: ${w}px;
        height: ${h}px;
        background: linear-gradient(90deg, ${shadowColor} 0%, ${color} 30%, ${highlightColor} 70%, ${shadowColor} 100%);
        clip-path: polygon(20% 100%, 80% 100%, 55% 0%, 45% 0%);
        position: relative;
      `
      wrapper.appendChild(cone)

      // Geometric pattern texture
      const pattern = document.createElement("div")
      pattern.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: repeating-linear-gradient(
          45deg,
          transparent 0px,
          transparent 4px,
          rgba(0,0,0,0.08) 4px,
          rgba(0,0,0,0.08) 6px
        );
        clip-path: inherit;
      `
      wrapper.appendChild(pattern)
      break
    }

    case "colorDome": {
      // Colorful dome (Hormuz style)
      const colorDome = document.createElement("div")
      colorDome.style.cssText = `
        width: ${w}px;
        height: ${h}px;
        background: radial-gradient(ellipse 60% 80% at 35% 50%, ${adjustBrightness(color, 30)} 0%, ${color} 50%, ${adjustBrightness(color, -20)} 100%);
        border-radius: 50% 50% 20% 20%;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      `
      wrapper.appendChild(colorDome)
      break
    }

    case "caveTemple": {
      // Multi-story pagoda in cliff face (Dunhuang Mogao style)
      const tiers = shape.tiers || 5
      const tierHeight = h / tiers

      for (let i = 0; i < tiers; i++) {
        // Story body
        const story = document.createElement("div")
        story.style.cssText = `
          position: absolute;
          bottom: ${i * tierHeight}px;
          left: 50%;
          transform: translateX(-50%);
          width: ${w * (1 - i * 0.08)}px;
          height: ${tierHeight * 0.65}px;
          background: ${color};
          border: 1px solid ${shadowColor};
        `
        wrapper.appendChild(story)

        // Windows
        const windows = document.createElement("div")
        windows.style.cssText = `
          position: absolute;
          bottom: ${i * tierHeight + tierHeight * 0.15}px;
          left: 50%;
          transform: translateX(-50%);
          width: ${w * (1 - i * 0.08) * 0.7}px;
          height: ${tierHeight * 0.35}px;
          background: repeating-linear-gradient(90deg, ${isDark ? "rgba(255,200,100,0.3)" : "rgba(0,0,0,0.3)"} 0px, ${isDark ? "rgba(255,200,100,0.3)" : "rgba(0,0,0,0.3)"} 4px, transparent 4px, transparent 8px);
        `
        wrapper.appendChild(windows)

        // Roof overhang
        const roof = document.createElement("div")
        roof.style.cssText = `
          position: absolute;
          bottom: ${i * tierHeight + tierHeight * 0.55}px;
          left: 50%;
          transform: translateX(-50%);
          width: ${w * (1 - i * 0.08) * 1.2}px;
          height: ${tierHeight * 0.35}px;
          background: ${accent || "#8B4513"};
          clip-path: polygon(5% 100%, 95% 100%, 100% 30%, 50% 0%, 0% 30%);
        `
        wrapper.appendChild(roof)
      }
      break
    }

    default:
      return null
  }

  return wrapper
}

interface SilkRoadMapProps {
  entities: SilkRoadEntity[]
  routes: RouteSegment[]
  selectedEntity: SilkRoadEntity | null
  onSelectEntity: (entity: SilkRoadEntity) => void
  isDark: boolean
  /** Current year from timeline for historical state */
  currentYear: number
  /** Called with a resize fn so parent can trigger resize when panels toggle */
  onMapReady?: (resizeFn: () => void) => void
}

export function SilkRoadMap({
  entities,
  routes,
  selectedEntity,
  onSelectEntity,
  isDark,
  currentYear,
  onMapReady,
}: SilkRoadMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const markersRef = useRef<Map<string, { marker: mapboxgl.Marker; el: HTMLDivElement }>>(new Map())
  const annotationsRef = useRef<Map<string, HTMLDivElement>>(new Map())
  const markersInitialized = useRef(false)
  const onSelectEntityRef = useRef(onSelectEntity)
  const prevYearRef = useRef(currentYear)

  // Keep callback ref up to date
  useEffect(() => {
    onSelectEntityRef.current = onSelectEntity
  }, [onSelectEntity])

  const cities = entities.filter((e) => e.type === "City")

  const clearAllMarkers = useCallback(() => {
    markersRef.current.forEach(({ marker }) => marker.remove())
    markersRef.current.clear()
    markersInitialized.current = false
  }, [])

  /* ── Initialise flat Mercator map ── */
  useEffect(() => {
    if (!mapContainer.current) return

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ""

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      /* Use light-v11 as base and tint it ourselves */
      style: isDark
        ? "mapbox://styles/mapbox/dark-v11"
        : "mapbox://styles/mapbox/light-v11",
      center: [55, 35], // Central Silk Road region
      zoom: 3.5,
      minZoom: 2.5,
      maxZoom: 12,
      maxBounds: SILK_ROAD_BOUNDS,
      attributionControl: false,
      /* Force flat Mercator - no globe, no rotation, no tilt */
      projection: "mercator",
      pitchWithRotate: false,
      dragRotate: false,
      touchPitch: false,
      touchZoomRotate: true,
    })

    /* Disable rotation completely */
    map.current.keyboard.disableRotation()

    /* Expose resize function to parent for panel toggle */
    const m = map.current
    if (onMapReady) {
      onMapReady(() => {
        if (m) {
          setTimeout(() => m.resize(), 50)
        }
      })
    }

    map.current.addControl(
      new mapboxgl.NavigationControl({ showCompass: false, visualizePitch: false }),
      "bottom-right"
    )

    /* ── Apply custom heritage colour tinting + carpet land texture on style load ── */
    map.current.on("style.load", () => {
      if (!map.current) return
      const m = map.current
      const layers = m.getStyle().layers || []

      /* ── Step 1: Find the first water layer so we can insert carpet BELOW it ── */
      let firstWaterLayerId: string | undefined
      for (const layer of layers) {
        if (layer.id.includes("water") && layer.type === "fill") {
          firstWaterLayerId = layer.id
          break
        }
      }

      /* ─��� Step 2: Add the Persian carpet image as a georeferenced raster covering the Silk Road region ── */
      if (!m.getSource("carpet-land-texture")) {
        m.addSource("carpet-land-texture", {
          type: "image",
          url: "/silk-carpet-overlay.jpg",
          coordinates: [
            [-5, 57],    // top-left  [lng, lat] - sized to show decorative red border at edges
            [125, 57],   // top-right
            [125, 8],    // bottom-right
            [-5, 8],     // bottom-left
          ],
        })

        m.addLayer(
          {
            id: "carpet-land-texture",
            type: "raster",
            source: "carpet-land-texture",
            paint: {
              "raster-opacity": isDark ? 0.20 : 0.25,
              "raster-fade-duration": 300,
              "raster-saturation": isDark ? -0.3 : -0.15,
              "raster-contrast": isDark ? 0.05 : -0.1,
              "raster-brightness-max": isDark ? 0.5 : 1.0,
              "raster-brightness-min": isDark ? 0.0 : 0.2,
            },
          },
          firstWaterLayerId // insert below water so water renders on top
        )
      }

      /* ── Step 3: Tint base layers for warm heritage palette ── */
      layers.forEach((layer) => {
        try {
          /* Water: muted turquoise */
          if (layer.id.includes("water") && layer.type === "fill") {
            m.setPaintProperty(layer.id, "fill-color", isDark ? "#0e1f35" : "#a8bfc8")
            m.setPaintProperty(layer.id, "fill-opacity", 0.9)
          }

          /* Background: warm parchment base (carpet layer sits on top) */
          if (layer.type === "background") {
            m.setPaintProperty(layer.id, "background-color", isDark ? "#111b2c" : "#e8dcc8")
          }

          /* Landuse/landcover: semi-transparent so carpet texture shows through */
          if (
            (layer.id.includes("landuse") || layer.id.includes("landcover") || layer.id.includes("land")) &&
            layer.type === "fill"
          ) {
            m.setPaintProperty(layer.id, "fill-color", isDark ? "#131f30" : "#e4d7c0")
            m.setPaintProperty(layer.id, "fill-opacity", isDark ? 0.5 : 0.35)
          }

          /* Reduce modern political boundaries */
          if ((layer.id.includes("boundary") || layer.id.includes("admin")) && layer.type === "line") {
            m.setPaintProperty(layer.id, "line-color", isDark ? "rgba(60,80,110,0.2)" : "rgba(160,140,110,0.25)")
            m.setPaintProperty(layer.id, "line-width", 0.5)
          }

          /* Warm labels with reduced opacity */
          if (layer.type === "symbol" && layer.id.includes("label")) {
            m.setPaintProperty(layer.id, "text-color", isDark ? "#5a6d85" : "#8a7a60")
            m.setPaintProperty(layer.id, "text-opacity", 0.55)
          }

          /* Soften roads */
          if (layer.id.includes("road") && layer.type === "line") {
            m.setPaintProperty(layer.id, "line-color", isDark ? "rgba(40,55,80,0.3)" : "rgba(190,175,150,0.35)")
          }
        } catch {
          /* some layers may not support the property */
        }
      })
    })

    return () => {
      clearAllMarkers()
      routesInitialised.current = false
        prevRouteIds.current = new Set()
      map.current?.remove()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDark])

  /* ── Draw routes (create once, update data in-place to avoid blinking) ── */
  const routesInitialised = useRef(false)
  const prevRouteIds = useRef<Set<string>>(new Set())

  useEffect(() => {
    if (!map.current) return

    const m = map.current

    const draw = () => {
      if (!m) return

      // Get current route IDs
      const currentRouteIds = new Set(routes.map(r => r.id))
      
      // Check if routes changed (different IDs, not just count)
      const routeIdsChanged = 
        currentRouteIds.size !== prevRouteIds.current.size ||
        [...currentRouteIds].some(id => !prevRouteIds.current.has(id))
      
      const needsFullRebuild = !routesInitialised.current || routeIdsChanged

      if (needsFullRebuild) {
        /* Remove old layers / sources that are no longer needed */
        prevRouteIds.current.forEach(routeId => {
          try {
            if (m.getLayer(`${routeId}-glow`)) m.removeLayer(`${routeId}-glow`)
            if (m.getLayer(routeId)) m.removeLayer(routeId)
            if (m.getLayer(`${routeId}-dash`)) m.removeLayer(`${routeId}-dash`)
            if (m.getLayer(`${routeId}-label`)) m.removeLayer(`${routeId}-label`)
            if (m.getSource(`route-line-${routeId}`)) m.removeSource(`route-line-${routeId}`)
          } catch { /* ignore */ }
        })

        // Unique colors for each route - clearly differentiated
        const routeColors: Record<string, { main: string; glow: string; darkMain: string; darkGlow: string }> = {
          // PRIMARY ROUTES - bold, saturated colors
          "route-northern": { main: "#C6A75E", glow: "rgba(198,167,94,0.3)", darkMain: "#E6C27A", darkGlow: "rgba(230,194,122,0.35)" },
          "route-southern": { main: "#A67C52", glow: "rgba(166,124,82,0.3)", darkMain: "#C9956A", darkGlow: "rgba(201,149,106,0.35)" },
          "route-maritime": { main: "#2E7D9E", glow: "rgba(46,125,158,0.3)", darkMain: "#4AA3C9", darkGlow: "rgba(74,163,201,0.35)" },
          // SECONDARY ROUTES - more muted, distinct from each other
          "route-steppe": { main: "#6B8E4A", glow: "rgba(107,142,74,0.25)", darkMain: "#8AB86B", darkGlow: "rgba(138,184,107,0.3)" },
          "route-persian": { main: "#8B5A7A", glow: "rgba(139,90,122,0.25)", darkMain: "#A87A98", darkGlow: "rgba(168,122,152,0.3)" },
          "route-incense": { main: "#C98A5C", glow: "rgba(201,138,92,0.25)", darkMain: "#E0A87C", darkGlow: "rgba(224,168,124,0.3)" },
          "route-lapis": { main: "#4A5FA5", glow: "rgba(74,95,165,0.25)", darkMain: "#6B7FC5", darkGlow: "rgba(107,127,197,0.3)" },
          "route-tea": { main: "#5A7E4A", glow: "rgba(90,126,74,0.25)", darkMain: "#7AA872", darkGlow: "rgba(122,168,114,0.3)" },
          "route-volga": { main: "#7A6B3A", glow: "rgba(122,107,58,0.25)", darkMain: "#9A8B5A", darkGlow: "rgba(154,139,90,0.3)" },
          "route-indian-ocean": { main: "#3A7A8A", glow: "rgba(58,122,138,0.25)", darkMain: "#5A9AAA", darkGlow: "rgba(90,154,170,0.3)" },
          "route-trans-saharan": { main: "#A07958", glow: "rgba(160,121,88,0.25)", darkMain: "#C0996D", darkGlow: "rgba(192,153,109,0.3)" },
          "route-via-egnatia": { main: "#6A5A50", glow: "rgba(106,90,80,0.25)", darkMain: "#8A7A6A", darkGlow: "rgba(138,122,106,0.3)" },
          "route-amber": { main: "#C49844", glow: "rgba(196,152,68,0.25)", darkMain: "#E4B85C", darkGlow: "rgba(228,184,92,0.3)" },
          "route-black-sea": { main: "#5A6A7A", glow: "rgba(90,106,122,0.25)", darkMain: "#7A8A9A", darkGlow: "rgba(122,138,154,0.3)" },
        }

  routes.forEach((route, i) => {
  const isMaritime = route.routeKind === "maritime"
  const isPrimary = route.type === "primary"
  const sourceId = `route-line-${route.id}` // Use route ID for unique source naming

  // Get unique color for this route, or fall back to defaults
  const routePalette = routeColors[route.id]
  const routeColor = routePalette
            ? (isDark ? routePalette.darkMain : routePalette.main)
            : isMaritime
              ? isDark ? "#5B9FD9" : "#3d7ab0"
              : isPrimary
                ? isDark ? GOLD : "#9a7b3c"
                : isDark ? GOLD_DIM : "rgba(154,123,60,0.4)"

          const glowColor = routePalette
            ? (isDark ? routePalette.darkGlow : routePalette.glow)
            : isMaritime
              ? isDark ? "rgba(91,159,217,0.25)" : "rgba(61,122,176,0.2)"
              : isDark ? "rgba(198,167,94,0.2)" : "rgba(154,123,60,0.15)"

          // Skip if source already exists (prevents duplicates)
          if (m.getSource(sourceId)) return

          m.addSource(sourceId, {
            type: "geojson",
            data: {
              type: "Feature",
              properties: { name: route.name, id: route.id },
              geometry: { type: "LineString", coordinates: route.coordinates },
            },
          })

          const layerId = route.id // Use route ID for layer identification
          const glowLayerId = `${route.id}-glow`
          const dashLayerId = `${route.id}-dash`
          const labelLayerId = `${route.id}-label`

          // Outer glow layer for all primary routes
          if (isPrimary) {
            m.addLayer({
              id: glowLayerId,
              type: "line",
              source: sourceId,
              layout: { "line-join": "round", "line-cap": "round" },
              paint: {
                "line-color": glowColor,
                "line-width": isMaritime ? 14 : 12,
                "line-opacity": 1,
                "line-blur": isMaritime ? 10 : 8,
              },
            })
          }

          // Main route line - secondary routes are very subtle by default
          m.addLayer({
            id: layerId,
            type: "line",
            source: sourceId,
            layout: { "line-join": "round", "line-cap": "round" },
            paint: {
              "line-color": routeColor,
              "line-width": isPrimary ? 3 : 1,
              "line-dasharray": isPrimary ? [1] : [3, 3],
              "line-opacity": isPrimary ? 1 : 0.35,
            },
          })

          // Animated dash overlay for land routes
          if (isPrimary && !isMaritime) {
            m.addLayer({
              id: dashLayerId,
              type: "line",
              source: sourceId,
              layout: { "line-join": "round", "line-cap": "round" },
              paint: {
                "line-color": isDark ? "#E6C27A" : GOLD,
                "line-width": 1.5,
                "line-dasharray": [2, 6],
                "line-opacity": 0.6,
              },
            })
          }

          // Wave pattern for maritime routes
          if (isMaritime) {
            m.addLayer({
              id: dashLayerId,
              type: "line",
              source: sourceId,
              layout: { "line-join": "round", "line-cap": "round" },
              paint: {
                "line-color": isDark ? "#8FC4F2" : "#5B9FD9",
                "line-width": 1,
                "line-dasharray": [1, 4],
                "line-opacity": 0.7,
              },
            })
          }

          // Route labels - primary routes always visible, secondary on hover
          m.addLayer({
            id: labelLayerId,
            type: "symbol",
            source: sourceId,
            layout: {
              "symbol-placement": "line-center",
              "text-field": route.name,
              "text-font": ["DIN Pro Medium", "Arial Unicode MS Regular"],
              "text-size": isPrimary ? 12 : 10,
              "text-letter-spacing": 0.1,
              "text-max-angle": 30,
              "text-allow-overlap": false,
              "text-ignore-placement": false,
            },
            paint: {
              "text-color": isMaritime
                ? (isDark ? "#8FC4F2" : "#2d5a80")
                : (isDark ? "#E6C27A" : "#8a6b2c"),
              "text-halo-color": isDark ? "rgba(15,25,40,0.95)" : "rgba(255,252,245,0.95)",
              "text-halo-width": isPrimary ? 2.5 : 2,
              "text-halo-blur": 1,
              "text-opacity": isPrimary ? 1 : 0.3,
            },
          })
        })

        // Add hover highlighting and click handlers for routes
        routes.forEach((route) => {
          const layerId = route.id
          const glowLayerId = `${route.id}-glow`
          const dashLayerId = `${route.id}-dash`
          const labelLayerId = `${route.id}-label`
          const isPrimary = route.type === "primary"

          // Hover effect: highlight this route, dim others
          m.on("mouseenter", layerId, () => {
            m.getCanvas().style.cursor = "pointer"
            
            // Highlight the hovered route
            m.setPaintProperty(layerId, "line-width", isPrimary ? 5 : 4)
            if (m.getLayer(glowLayerId)) {
              m.setPaintProperty(glowLayerId, "line-width", 20)
              m.setPaintProperty(glowLayerId, "line-opacity", 1)
            }
            
            // Dim all other routes
            routes.forEach((otherRoute) => {
              if (otherRoute.id !== route.id) {
                m.setPaintProperty(otherRoute.id, "line-opacity", 0.15)
                if (m.getLayer(`${otherRoute.id}-glow`)) {
                  m.setPaintProperty(`${otherRoute.id}-glow`, "line-opacity", 0.1)
                }
                if (m.getLayer(`${otherRoute.id}-dash`)) {
                  m.setPaintProperty(`${otherRoute.id}-dash`, "line-opacity", 0.1)
                }
                if (m.getLayer(`${otherRoute.id}-label`)) {
                  m.setPaintProperty(`${otherRoute.id}-label`, "text-opacity", 0.2)
                }
              }
            })
          })
          
          m.on("mouseleave", layerId, () => {
            m.getCanvas().style.cursor = ""
            
            // Restore all routes to their default state
            routes.forEach((r) => {
              const rPrimary = r.type === "primary"
              m.setPaintProperty(r.id, "line-opacity", rPrimary ? 1 : 0.35)
              m.setPaintProperty(r.id, "line-width", rPrimary ? 3 : 1)
              if (m.getLayer(`${r.id}-glow`)) {
                m.setPaintProperty(`${r.id}-glow`, "line-width", r.routeKind === "maritime" ? 14 : 12)
                m.setPaintProperty(`${r.id}-glow`, "line-opacity", 1)
              }
              if (m.getLayer(`${r.id}-dash`)) {
                m.setPaintProperty(`${r.id}-dash`, "line-opacity", r.routeKind === "maritime" ? 0.7 : 0.6)
              }
              if (m.getLayer(`${r.id}-label`)) {
                m.setPaintProperty(`${r.id}-label`, "text-opacity", rPrimary ? 1 : 0.3)
              }
            })
          })

          // Click handler to select route entity
          m.on("click", layerId, () => {
            // Find the route entity in ALL_ENTITIES
            const routeEntity = ALL_ENTITIES.find(e => e.id === route.id)
            if (onSelectEntity) {
              if (routeEntity) {
                onSelectEntity(routeEntity)
              } else {
                // Create a basic entity from route data if not found in ALL_ENTITIES
                const fallbackEntity = {
                  id: route.id,
                  name: route.name,
                  type: "Route" as const,
                  region: "Central Asia",
                  lat: route.coordinates[Math.floor(route.coordinates.length / 2)][1],
                  lng: route.coordinates[Math.floor(route.coordinates.length / 2)][0],
                  startYear: route.startYear,
                  endYear: route.endYear,
                  description: route.description,
                  importance: route.type === "primary" ? "Major" as const : "Minor" as const,
                  source: route.source,
                }
                onSelectEntity(fallbackEntity)
              }
            }
          })
        })

        routesInitialised.current = true
        prevRouteIds.current = new Set(routes.map(r => r.id))
      } else {
        /* Just update the GeoJSON data on each existing source -- no remove/add */
        routes.forEach((route) => {
          const sourceId = `route-line-${route.id}`
          const src = m.getSource(sourceId) as mapboxgl.GeoJSONSource | undefined
          if (src) {
            src.setData({
              type: "Feature",
              properties: { name: route.name, id: route.id },
              geometry: { type: "LineString", coordinates: route.coordinates },
            })
          }
        })
      }
    }

    if (m.isStyleLoaded()) {
      draw()
    } else {
      m.on("load", draw)
    }
  }, [routes, isDark])

  /* ── Place city markers with 3D architectural styling (STABLE - create once) ── */
  useEffect(() => {
    if (!map.current) return

    const initMarkers = () => {
      if (!map.current || markersInitialized.current) return

      // Create markers for ALL cities using the static CITIES array (always available)
      CITIES.forEach((city) => {
        if (!map.current || markersRef.current.has(city.id)) return

        const isMajor = city.importance === "Major"
        const architecture = getCityArchitecture(city.id)

        // Create wrapper element - anchor point is at bottom center
        const el = document.createElement("div")
        el.className = "city-3d-wrapper"
        el.dataset.cityId = city.id

        el.style.cssText = `
          position: relative;
          width: 1px;
          height: 1px;
          cursor: pointer;
          overflow: visible;
          transition: opacity 0.3s ease;
        `

        // Circle marker - always visible, primary interaction point
        // Centered on the marker anchor point (0,0) so it sits exactly on coordinates
        const dotSize = isMajor ? 12 : 8
        const dot = document.createElement("div")
        dot.className = "city-dot"
        dot.style.cssText = `
          position: absolute;
          top: ${-dotSize / 2}px;
          left: ${-dotSize / 2}px;
          width: ${dotSize}px;
          height: ${dotSize}px;
          border-radius: 50%;
          background: ${isMajor ? (isDark ? GOLD : "#8a6b2c") : (isDark ? "rgba(198,167,94,0.6)" : "rgba(120,95,50,0.6)")};
          border: ${isMajor ? "1.5px solid" : "1px solid"};
          border-color: ${isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)"};
          box-shadow: 0 0 6px rgba(198,167,94,0.3);
          pointer-events: auto;
          transition: background 0.2s ease, box-shadow 0.2s ease;
          z-index: 10;
        `
        el.appendChild(dot)

        // Architecture model - offset above the marker center, hidden at low zoom
        if (architecture) {
          const modelWrapper = document.createElement("div")
          modelWrapper.className = "city-architecture"
          modelWrapper.style.cssText = `
            position: absolute;
            bottom: ${dotSize / 2 + 4}px;
            left: 0;
            transform: translateX(-50%);
            opacity: 0;
            transition: opacity 0.4s ease, transform 0.3s ease;
            pointer-events: none;
          `

          const model = create3DCityModel(architecture, false, isDark, 1)
          model.style.transformOrigin = "center bottom"
          modelWrapper.appendChild(model)
          el.appendChild(modelWrapper)
        }

        // City label - positioned above architecture or marker (relative to center anchor)
        const labelOffset = architecture ? 55 : 18
        const label = document.createElement("div")
        const fontSize = isMajor ? 11 : 10
        label.className = "city-label"
        label.style.cssText = `
          position: absolute;
          bottom: ${labelOffset}px;
          left: 0;
          transform: translateX(-50%);
          white-space: nowrap;
          font-size: ${fontSize}px;
          font-weight: ${isMajor ? 600 : 500};
          letter-spacing: 0.02em;
          color: ${isDark ? "rgba(230,194,122,0.95)" : "rgba(60,45,20,0.9)"};
          text-shadow: ${isDark ? "0 1px 4px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.5)" : "0 1px 3px rgba(255,255,255,0.9), 0 0 6px rgba(255,255,255,0.5)"};
          pointer-events: none;
          font-family: var(--font-inter), system-ui, sans-serif;
          transition: all 0.3s ease;
          opacity: 0;
        `
        label.textContent = city.name.split("(")[0].trim()
        el.appendChild(label)

        // Hover effects
        el.addEventListener("mouseenter", () => {
          el.style.zIndex = "100"
          dot.style.boxShadow = "0 0 12px rgba(198,167,94,0.6)"
          label.style.fontWeight = "700"
        })
        el.addEventListener("mouseleave", () => {
          el.style.zIndex = "auto"
          dot.style.boxShadow = "0 0 6px rgba(198,167,94,0.3)"
          label.style.fontWeight = isMajor ? "600" : "500"
        })

        el.addEventListener("click", (e) => {
          e.stopPropagation()
          onSelectEntityRef.current(city)
        })

        const marker = new mapboxgl.Marker({ element: el, anchor: "center" })
          .setLngLat([city.lng, city.lat])
          .addTo(map.current!)

        markersRef.current.set(city.id, { marker, el })
      })

      markersInitialized.current = true

      // Initial zoom-based visibility update
      if (map.current) {
        updateZoomBasedVisibility(map.current.getZoom())
      }
    }

    // Zoom-based visibility and scaling control
    const updateZoomBasedVisibility = (zoom: number) => {
      // Calculate scale factor based on zoom (grows from 0.6 at zoom 5 to 1.8 at zoom 10)
      const minZoom = 5
      const maxZoom = 10
      const minScale = 0.6
      const maxScale = 1.8
      const clampedZoom = Math.max(minZoom, Math.min(maxZoom, zoom))
      const zoomFactor = (clampedZoom - minZoom) / (maxZoom - minZoom)
      const archScale = minScale + (maxScale - minScale) * zoomFactor

      markersRef.current.forEach(({ el }) => {
        const label = el.querySelector('.city-label') as HTMLDivElement
        const architecture = el.querySelector('.city-architecture') as HTMLDivElement
        const model = architecture?.querySelector('.city-3d-marker') as HTMLDivElement

        // Labels visible at zoom >= 5
        if (label) {
          label.style.opacity = zoom >= 5 ? "1" : "0"
          // Adjust label position based on architecture visibility and scale
          if (zoom >= 5.5 && architecture) {
            const labelOffset = Math.round(40 * archScale + 15)
            label.style.bottom = `${labelOffset}px`
          } else {
            label.style.bottom = "18px"
          }
        }

        // Architecture visible at zoom >= 5.5 with progressive scaling
        if (architecture) {
          const isVisible = zoom >= 5.5
          architecture.style.opacity = isVisible ? "1" : "0"
          architecture.style.pointerEvents = isVisible ? "auto" : "none"

          // Apply zoom-based scale to the model
          if (model && isVisible) {
            model.style.transform = `scale(${archScale})`
          }
        }
      })
    }

    if (map.current.isStyleLoaded()) {
      initMarkers()
    } else {
      map.current.on("load", initMarkers)
    }

    // Add zoom listener for visibility updates
    const handleZoom = () => {
      if (map.current) {
        updateZoomBasedVisibility(map.current.getZoom())
      }
    }
    map.current.on("zoom", handleZoom)

    return () => {
      map.current?.off("zoom", handleZoom)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDark]) // Only recreate on theme change; cities/callback use refs

  /* ── Update marker selection state (no re-creation, just CSS updates) ── */
  useEffect(() => {
    markersRef.current.forEach(({ el }, cityId) => {
      const isSelected = selectedEntity?.id === cityId
      if (isSelected) {
        el.classList.add("selected")
      } else {
        el.classList.remove("selected")
      }
    })
  }, [selectedEntity])

  /* ─��� Update marker visibility based on filtered entities (type/region filters) ── */
  useEffect(() => {
    if (!markersInitialized.current) return

    // Get the IDs of cities that pass the current TYPE/REGION filters
    const filteredCityIds = new Set(entities.filter(e => e.type === "City").map(e => e.id))

    markersRef.current.forEach(({ el }, cityId) => {
      const isFilteredByTypeRegion = filteredCityIds.has(cityId)

      if (isFilteredByTypeRegion) {
        // Show the marker - timeline visibility is handled by the other effect
        el.dataset.filtered = "true"
        el.style.display = ""
      } else {
        // Hide completely when filtered out by type/region
        el.dataset.filtered = "false"
        el.style.display = "none"
      }
    })
  }, [entities])

  /* ── Helper: Apply city visual state based on timeline year ── */
  const applyCityTimelineState = useCallback((el: HTMLDivElement, cityId: string) => {
    const city = CITIES.find(c => c.id === cityId)
    if (!city) return

    // Skip if hidden by type/region filter
    if (el.dataset.filtered === "false") return

    const isBeforeEstablishment = currentYear < city.startYear
    const isAfterDestruction = currentYear > city.endYear

    const dot = el.querySelector('.city-dot') as HTMLDivElement
    const label = el.querySelector('.city-label') as HTMLDivElement
    const architectureWrapper = el.querySelector('.city-architecture') as HTMLDivElement
    const modelContainer = architectureWrapper?.querySelector('.city-3d-marker') as HTMLDivElement

    // Before establishment - city doesn't exist yet
    if (isBeforeEstablishment) {
      el.style.opacity = "0.15"
      el.style.pointerEvents = "none"
      if (dot) {
        dot.style.background = isDark ? "rgba(100,100,100,0.3)" : "rgba(150,150,150,0.3)"
        dot.style.borderColor = isDark ? "rgba(100,100,100,0.2)" : "rgba(150,150,150,0.2)"
        dot.style.boxShadow = "none"
      }
      if (label) label.style.opacity = "0"
      if (modelContainer) {
        modelContainer.style.opacity = "0"
        modelContainer.style.transform = "scale(0.3)"
      }
      return
    }

    // After destruction - show ruins
    if (isAfterDestruction) {
      el.style.opacity = "0.5"
      el.style.pointerEvents = "auto"
      if (dot) {
        dot.style.background = isDark ? "rgba(120,80,80,0.5)" : "rgba(100,70,70,0.5)"
        dot.style.borderColor = isDark ? "rgba(150,100,100,0.3)" : "rgba(120,80,80,0.3)"
        dot.style.boxShadow = `0 0 8px rgba(180,60,60,0.3)`
      }
      if (label) {
        label.style.opacity = "0.4"
        label.style.textDecoration = "line-through"
        label.style.color = isDark ? "rgba(180,140,140,0.7)" : "rgba(100,70,70,0.7)"
      }
      if (modelContainer) {
        modelContainer.style.opacity = "0.25"
        modelContainer.style.filter = "grayscale(0.8) sepia(0.3) brightness(0.5)"
        modelContainer.style.transform = "scale(0.5) rotateX(15deg)"
      }
      return
    }

    // City is active - restore normal appearance
    el.style.opacity = "1"
    el.style.pointerEvents = "auto"
    if (label) {
      label.style.textDecoration = "none"
      label.style.color = isDark ? "rgba(230,194,122,0.95)" : "rgba(60,45,20,0.9)"
    }

    const { state } = getCityStateForYear(cityId, currentYear)
    const visuals = getCityStateVisuals(state)

    // Update dot based on state
    if (dot) {
      const isMajor = city.importance === "Major"
      if (state === "destroyed" || state === "damaged") {
        dot.style.background = isDark ? "rgba(180,80,80,0.7)" : "rgba(150,60,60,0.7)"
        dot.style.borderColor = isDark ? "rgba(200,100,100,0.5)" : "rgba(180,80,80,0.4)"
        dot.style.boxShadow = `0 0 10px rgba(200,60,60,0.5)`
      } else if (state === "flourishing" || state === "revived") {
        dot.style.background = isDark ? GOLD : "#8a6b2c"
        dot.style.borderColor = isDark ? "rgba(255,220,150,0.5)" : "rgba(150,120,60,0.4)"
        dot.style.boxShadow = `0 0 12px rgba(198,167,94,0.6), 0 0 20px rgba(198,167,94,0.3)`
      } else {
        dot.style.background = isMajor ? (isDark ? GOLD : "#8a6b2c") : (isDark ? "rgba(198,167,94,0.6)" : "rgba(120,95,50,0.6)")
        dot.style.borderColor = isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)"
        dot.style.boxShadow = "0 0 6px rgba(198,167,94,0.3)"
      }
    }

    // Get the 3D model container (inside the architecture wrapper)
    if (modelContainer && architectureWrapper) {
      modelContainer.style.transition = "transform 0.5s ease, opacity 0.5s ease, filter 0.5s ease"
      modelContainer.style.opacity = String(visuals.opacity)

      // Apply damage/fragment effect using CSS filter
      if (visuals.fragmentLevel > 0) {
        modelContainer.style.filter = `grayscale(${visuals.fragmentLevel * 0.5}) sepia(${visuals.fragmentLevel * 0.2}) brightness(${visuals.brightness})`
      } else {
        modelContainer.style.filter = `brightness(${visuals.brightness}) saturate(${visuals.saturation})`
      }

      // Add glow for flourishing/revived states
      if (visuals.glowIntensity > 0) {
        modelContainer.style.boxShadow = `0 0 ${20 * visuals.glowIntensity}px rgba(198, 167, 94, ${visuals.glowIntensity})`
      } else if (state === "destroyed" || state === "damaged") {
        modelContainer.style.boxShadow = `0 0 15px rgba(200, 60, 60, 0.3)`
      } else {
        modelContainer.style.boxShadow = "none"
      }
    }
  }, [currentYear, isDark])

  /* ── Update city states and annotations based on timeline year ── */
  useEffect(() => {
    if (!markersInitialized.current) return

    markersRef.current.forEach(({ el }, cityId) => {
      // Apply visual state based on timeline
      applyCityTimelineState(el, cityId)

      // Find the city data for annotations
      const city = CITIES.find(c => c.id === cityId)
      if (!city) return

      const { state } = getCityStateForYear(cityId, currentYear)

      // Handle event annotation
      const activeEvent = getActiveEventAnnotation(cityId, currentYear)
      let annotationEl = annotationsRef.current.get(cityId)

      if (activeEvent) {
        if (!annotationEl) {
          // Create annotation element
          annotationEl = document.createElement("div")
          annotationEl.className = "city-event-annotation"
          annotationEl.style.cssText = `
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%) translateY(-8px);
            max-width: 180px;
            padding: 6px 10px;
            background: ${isDark ? "rgba(20, 25, 35, 0.95)" : "rgba(255, 252, 245, 0.95)"};
            border: 1px solid ${isDark ? "rgba(198, 167, 94, 0.4)" : "rgba(139, 115, 60, 0.3)"};
            border-radius: 6px;
            font-size: 10px;
            font-weight: 500;
            line-height: 1.35;
            color: ${isDark ? "rgba(230, 194, 122, 0.95)" : "rgba(80, 60, 30, 0.95)"};
            text-align: center;
            white-space: normal;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.4s ease;
            box-shadow: ${isDark ? "0 4px 12px rgba(0,0,0,0.4)" : "0 2px 8px rgba(0,0,0,0.1)"};
            z-index: 50;
            font-family: var(--font-inter), system-ui, sans-serif;
          `
          el.appendChild(annotationEl)
          annotationsRef.current.set(cityId, annotationEl)

          // Trigger fade-in
          requestAnimationFrame(() => {
            if (annotationEl) annotationEl.style.opacity = "1"
          })
        }

        // Update content
        const stateColor = state === "destroyed" || state === "damaged"
          ? (isDark ? "#e57373" : "#c62828")
          : state === "flourishing" || state === "revived"
            ? (isDark ? "#81c784" : "#2e7d32")
            : (isDark ? "rgba(230, 194, 122, 0.95)" : "rgba(80, 60, 30, 0.95)")

        annotationEl.innerHTML = `
          <div style="font-size: 9px; color: ${stateColor}; margin-bottom: 2px; text-transform: uppercase; letter-spacing: 0.05em;">
            ${activeEvent.year} CE
          </div>
          <div>${activeEvent.label}</div>
        `
        annotationEl.style.opacity = "1"
      } else if (annotationEl) {
        // Fade out annotation
        annotationEl.style.opacity = "0"
      }
    })

    prevYearRef.current = currentYear
  }, [currentYear, isDark, applyCityTimelineState])

  /* ── Fly to selected entity (only for Cities, not Routes) ── */
  useEffect(() => {
  if (!map.current || !selectedEntity) return
  // Only fly to Cities, not Routes (routes just show panel without moving map)
  if (selectedEntity.type === "Route") return
  map.current.flyTo({
  center: [selectedEntity.lng, selectedEntity.lat],
  zoom: Math.max(map.current.getZoom(), 5.5),
  duration: 1200,
  essential: true,
  })
  }, [selectedEntity])

  return (
    <div className="relative h-full w-full">
      <div ref={mapContainer} className="h-full w-full" />
      
      {/* Simple Route Legend */}
      <div className="absolute bottom-3 right-3 z-20 flex items-center gap-4 rounded-md border border-border/40 bg-card/80 px-3 py-1.5 backdrop-blur-sm">
        <div className="flex items-center gap-1.5">
          <div className="h-[3px] w-5 rounded-full bg-amber-600" />
          <span className="text-[9px] text-muted-foreground">Primary Route</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div 
            className="h-[2px] w-5 opacity-50" 
            style={{ 
              backgroundImage: "repeating-linear-gradient(90deg, #9a7b3c 0, #9a7b3c 3px, transparent 3px, transparent 5px)" 
            }} 
          />
          <span className="text-[9px] text-muted-foreground">Secondary Route</span>
        </div>

      </div>
      
      {/* Subtle vignette for immersive map edges */}
      <div className="silk-vignette" />
    </div>
  )
}
