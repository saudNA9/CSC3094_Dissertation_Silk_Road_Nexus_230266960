/*
 * app/graph/page.tsx
 * Semantic network graph view — the D3.js knowledge graph interface.
 * It will:
 * - Render entities and their relationships as a force-directed network
 * - Switch between six graph layout modes (force, hierarchical, radial, cluster, timeline, geographic)
 * - Filter nodes by entity type using the left sidebar
 * - Advance through time with the century timeline slider and play/pause controls
 * - Open an entity detail panel when a node is selected
 */

"use client"

import { useState, useCallback, useMemo, useEffect, useRef, Suspense } from "react"
import { useTheme } from "next-themes"
import { useSearchParams, useRouter } from "next/navigation"
import {
  Network,
  CircleDot,
  GitBranch,
  MapPin,
  Package,
  Clock,
  PanelLeftClose,
  PanelLeftOpen,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
import { TopNav } from "@/components/top-nav"
import { MemoizedRelationshipGraph, type GraphMode } from "@/components/graph/relationship-graph"
import { EntityPanel } from "@/components/explore/entity-panel"
import { SearchCommand } from "@/components/search-command"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import {
  getCenturyWindow,
  type SilkRoadEntity,
  CITIES,
  ROUTES,
  EVENTS,
  GOODS,
  PERSONS,
  INSCRIPTIONS,
} from "@/lib/silk-road-data"

// Graph mode definitions with descriptions
const GRAPH_MODES: { id: GraphMode; label: string; icon: typeof Network; description: string }[] = [
  { id: "force", label: "Force", icon: Network, description: "Entities cluster naturally based on their connections - closely related items group together" },
  { id: "radial", label: "Radial", icon: CircleDot, description: "Concentric circles by type: Cities at center, then Routes, Goods, Events, People, Inscriptions" },
  { id: "hierarchical", label: "Hierarchy", icon: GitBranch, description: "Horizontal rows organized by entity type - scroll down to see all categories" },
  { id: "geographic", label: "Geographic", icon: MapPin, description: "Cities arranged West to East across regions: Mediterranean, Middle East, Central Asia, East Asia" },
  { id: "commodity", label: "Trade", icon: Package, description: "Trade goods on the left, cities on the right - lines show which goods were traded where" },
  { id: "temporal", label: "Timeline", icon: Clock, description: "Historical timeline from 200 BCE to 1500 CE - entities positioned by when they first appeared" },
]

// Color palette
const COLORS = {
  city: "#C6A75E",
  route: "#5B8FB9",
  good: "#f97316",
  event: "#f43f5e",
  person: "#10b981",
  inscription: "#a855f7",
}

// Timeline constants
const TIMELINE_MIN = -300
const TIMELINE_MAX = 1500
const STEP_SMALL = 10
const STEP_CENTURY = 100
const PLAYBACK_SPEEDS = [
  { label: "0.5x", interval: 400, step: 5 },
  { label: "1x", interval: 200, step: 5 },
  { label: "2x", interval: 100, step: 5 },
  { label: "4x", interval: 80, step: 10 },
]

// Era presets
const ERA_PRESETS = [
  { label: "Classical", start: -300, end: 300 },
  { label: "Medieval", start: 500, end: 1000 },
  { label: "Islamic Golden Age", start: 750, end: 1258 },
  { label: "Mongol Era", start: 1206, end: 1368 },
]

// Regional distribution
const REGIONS = [
  { name: "Mediterranean", minLng: 25, maxLng: 45, color: "#6366f1" },
  { name: "Middle East", minLng: 45, maxLng: 60, color: "#C6A75E" },
  { name: "Central Asia", minLng: 60, maxLng: 80, color: "#d946ef" },
  { name: "East Asia", minLng: 80, maxLng: 120, color: "#f97316" },
]

function computeRegionalData() {
  return REGIONS.map(({ name, minLng, maxLng, color }) => ({
    name,
    count: CITIES.filter((c) => c.lng >= minLng && c.lng < maxLng).length,
    color,
  }))
}

// Left Panel Component - Clean design inspired by reference
function LeftPanel({
  centuryYear,
  onCenturyChange,
  collapsed,
  onToggle,
  mode,
  onSelectEntity,
}: {
  centuryYear: number
  onCenturyChange: (year: number) => void
  collapsed: boolean
  onToggle: () => void
  mode: GraphMode
  onSelectEntity: (entity: SilkRoadEntity) => void
}) {
  const century = getCenturyWindow(centuryYear)
  const regionalData = useMemo(() => computeRegionalData(), [])

  /* ── Timeline playback state ── */
  const [isPlaying, setIsPlaying] = useState(false)
  const [speedIdx, setSpeedIdx] = useState(1)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const speed = PLAYBACK_SPEEDS[speedIdx]

  const clampYear = useCallback(
    (y: number) => Math.max(TIMELINE_MIN, Math.min(TIMELINE_MAX, y)),
    []
  )

  const yearRef = useRef(centuryYear)
  useEffect(() => {
    yearRef.current = centuryYear
  }, [centuryYear])

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        const next = yearRef.current + speed.step
        if (next >= TIMELINE_MAX) {
          onCenturyChange(TIMELINE_MAX)
          setIsPlaying(false)
        } else {
          onCenturyChange(next)
        }
      }, speed.interval)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPlaying, speed, onCenturyChange])

  const togglePlay = useCallback(() => {
    if (centuryYear >= TIMELINE_MAX) {
      onCenturyChange(TIMELINE_MIN)
      setIsPlaying(true)
    } else {
      setIsPlaying((p) => !p)
    }
  }, [centuryYear, onCenturyChange])

  const stepBack = useCallback(() => {
    setIsPlaying(false)
    onCenturyChange(clampYear(centuryYear - STEP_SMALL))
  }, [centuryYear, onCenturyChange, clampYear])

  const stepForward = useCallback(() => {
    setIsPlaying(false)
    onCenturyChange(clampYear(centuryYear + STEP_SMALL))
  }, [centuryYear, onCenturyChange, clampYear])

  const skipBack = useCallback(() => {
    setIsPlaying(false)
    onCenturyChange(clampYear(centuryYear - STEP_CENTURY))
  }, [centuryYear, onCenturyChange, clampYear])

  const skipForward = useCallback(() => {
    setIsPlaying(false)
    onCenturyChange(clampYear(centuryYear + STEP_CENTURY))
  }, [centuryYear, onCenturyChange, clampYear])

  const cycleSpeed = useCallback(() => {
    setSpeedIdx((prev) => (prev + 1) % PLAYBACK_SPEEDS.length)
  }, [])
  const maxRegionCount = Math.max(...regionalData.map((r) => r.count))

  if (collapsed) {
    return (
      <div className="flex h-full w-12 flex-col items-center border-r border-border bg-card py-3">
        <Button variant="ghost" size="icon" onClick={onToggle} className="h-8 w-8">
          <PanelLeftOpen className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="flex h-full w-72 flex-col border-r border-border bg-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-accent">
          Graph Controls
        </span>
        <Button variant="ghost" size="icon" onClick={onToggle} className="h-7 w-7">
          <PanelLeftClose className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Search Section */}
        <div>
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-accent">
            Locate on Graph
          </div>
          <SearchCommand compact onSelectEntity={onSelectEntity} />
          <p className="mt-2 text-[11px] text-muted-foreground">
            Highlight entities and see their connections on the graph.
          </p>
        </div>

        {/* Dataset Overview Section */}
        <div className="text-[8px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
          Dataset Overview
        </div>

        {/* Stats Grid - WITH TOOLTIPS */}
        <div className="mb-6 grid grid-cols-3 gap-2">
          {[
            { icon: "o", value: CITIES.length, label: "Cities", color: COLORS.city, tooltip: "Trade hubs and settlements on the Silk Road" },
            { icon: "=", value: ROUTES.length, label: "Routes", color: COLORS.route, tooltip: "Trade routes connecting cities" },
            { icon: "[]", value: GOODS.length, label: "Goods", color: COLORS.good, tooltip: "Commodities traded (silk, spices, etc.)" },
            { icon: "o", value: EVENTS.length, label: "Events", color: COLORS.event, tooltip: "Historical events and milestones" },
            { icon: "o", value: PERSONS.length, label: "Persons", color: COLORS.person, tooltip: "Historical figures and merchants" },
            { icon: "o", value: INSCRIPTIONS.length, label: "Inscriptions", color: COLORS.inscription, tooltip: "Historical texts and inscriptions" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="group relative flex cursor-help flex-col items-center gap-1 rounded-lg border border-border bg-muted/30 p-2 transition-colors hover:bg-muted/50"
              title={stat.tooltip}
            >
              <span className="text-lg" style={{ color: stat.color }}>
                {stat.icon === "o" ? "◉" : stat.icon === "=" ? "≡" : "▢"}
              </span>
              <div className="text-center">
                <div className="text-lg font-bold text-foreground">{stat.value}</div>
                <div className="text-[9px] text-muted-foreground">{stat.label}</div>
              </div>
              <div className="invisible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max rounded bg-black/80 px-2 py-1 text-white text-[8px] whitespace-nowrap group-hover:visible z-10">
                {stat.tooltip}
              </div>
            </div>
          ))}
        </div>

        {/* Regional Distribution - NOW CLEARLY FOR CITIES */}
        <div className="mb-6 rounded-lg border border-border bg-muted/20 p-3">
          <h3 className="mb-1 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
            Cities by Region
          </h3>
          <p className="mb-3 text-[8px] text-muted-foreground italic">
            Distribution of cities across geographic regions (West to East)
          </p>
          <div className="space-y-2.5">
            {regionalData.map((region) => (
              <div key={region.name} className="flex items-center justify-between">
                <span className="text-xs text-foreground">{region.name}</span>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted group/bar relative">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(region.count / maxRegionCount) * 100}%`,
                        backgroundColor: region.color,
                      }}
                    />
                    <div className="invisible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 rounded bg-black/80 px-1.5 py-0.5 text-white text-[8px] whitespace-nowrap group-hover/bar:visible z-10">
                      {region.count} cities
                    </div>
                  </div>
                  <span className="w-6 text-right text-xs font-semibold text-foreground">{region.count}</span>
                </div>
              </div>
              ))}
            </div>
          </div>

        {/* Temporal Filter / Timeline - AT THE BOTTOM */}
        <div className="rounded-lg border border-border bg-muted/20 p-3">
          <h3 className="mb-2 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
            Timeline
          </h3>

          {/* BCE/CE Note */}
          <p className="mb-2 text-center text-[8px] text-muted-foreground">
            <span className="font-medium">BCE</span> = Before Common Era | <span className="font-medium">CE</span> = Common Era
          </p>

          {/* Year Display */}
          <div className="mb-3 text-center">
            <span className="font-mono text-3xl font-bold tabular-nums text-accent">
              {centuryYear < 0 ? `${Math.abs(centuryYear)}` : `${centuryYear}`}
            </span>
            <span className="ml-1 text-sm text-muted-foreground">
              {centuryYear < 0 ? "BCE" : "CE"}
            </span>
          </div>

          {/* Slider */}
          <Slider
            value={[centuryYear]}
            onValueChange={([v]) => {
              setIsPlaying(false)
              onCenturyChange(v)
            }}
            min={TIMELINE_MIN}
            max={TIMELINE_MAX}
            step={1}
            className="my-3 [&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
          />

          <div className="flex items-center justify-between text-[9px] text-muted-foreground">
            <span>300 BCE</span>
            <span>1500 CE</span>
          </div>

          {/* Playback Controls - Only show in temporal mode */}
          {mode === "temporal" && (
            <>
              <div className="mt-3 flex items-center justify-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={skipBack}
                  aria-label="Skip back 100 years"
                  title="Back 100 years"
                >
                  <ChevronsLeft className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={stepBack}
                  aria-label="Step back 10 years"
                  title="Back 10 years"
                >
                  <SkipBack className="h-3 w-3" />
                </Button>
                <Button
                  variant={isPlaying ? "default" : "outline"}
                  size="icon"
                  className={`h-8 w-8 ${
                    isPlaying
                      ? "bg-accent text-accent-foreground hover:bg-accent/80"
                      : "border-accent/30 hover:bg-accent/10"
                  }`}
                  onClick={togglePlay}
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <Pause className="h-3.5 w-3.5" />
                  ) : (
                    <Play className="h-3.5 w-3.5 ml-0.5" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={stepForward}
                  aria-label="Step forward 10 years"
                  title="Forward 10 years"
                >
                  <SkipForward className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={skipForward}
                  aria-label="Skip forward 100 years"
                  title="Forward 100 years"
                >
                  <ChevronsRight className="h-3.5 w-3.5" />
                </Button>
              </div>

              {/* Speed Selector */}
              <div className="mt-2 flex items-center justify-center">
                <button
                  onClick={cycleSpeed}
                  className="rounded-md px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:bg-accent/10 hover:text-accent"
                  title="Click to cycle playback speed"
                >
                  Speed: {speed.label}
                </button>
              </div>

              {/* Progress bar */}
              <div className="mt-2 h-0.5 w-full overflow-hidden rounded-full bg-border">
                <div
                  className="h-full rounded-full bg-accent transition-all duration-200"
                  style={{
                    width: `${((centuryYear - TIMELINE_MIN) / (TIMELINE_MAX - TIMELINE_MIN)) * 100}%`,
                  }}
                />
              </div>
            </>
          )}

          {/* Century window */}
          <div className="mt-3 rounded-md border border-accent/20 bg-accent/5 px-3 py-2 text-center">
            <span className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
              Active Century
            </span>
            <p className="mt-0.5 font-mono text-xs font-semibold text-foreground">
              {century.label}
            </p>
          </div>

          {/* Era Presets */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            {ERA_PRESETS.map((era) => {
              const isActive = centuryYear >= era.start && centuryYear <= era.end
              return (
                <button
                  key={era.label}
                  onClick={() => {
                    setIsPlaying(false)
                    onCenturyChange(Math.floor((era.start + era.end) / 2))
                  }}
                  className={`rounded-md px-2 py-1.5 text-[10px] font-medium transition-colors ${
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                  }`}
                >
                  {era.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border px-4 py-2 text-center">
        <span className="text-[9px] text-muted-foreground">
          Designed and Developed by <span className="text-accent">Saud Najem S Alnajem</span>
        </span>
      </div>
    </div>
  )
}

function GraphContent() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlFocusId = searchParams.get("focus")

  const [selectedEntity, setSelectedEntity] = useState<SilkRoadEntity | null>(null)
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false)
  const [mode, setMode] = useState<GraphMode>(urlFocusId ? "radial" : "force")
  const [centuryYear, setCenturyYear] = useState(900)
  const [activeFocusId, setActiveFocusId] = useState<string | null>(urlFocusId)

  const handleSelectEntity = useCallback((entity: SilkRoadEntity) => {
    setSelectedEntity(entity)
    // In geographic mode, don't change focus (no zoom) - just show the panel
    if (mode !== "geographic") {
      setActiveFocusId(entity.id)
    }
  }, [mode])

  const handleSearchSelect = useCallback((entity: SilkRoadEntity) => {
    setSelectedEntity(entity)
    setActiveFocusId(entity.id)
    setMode("radial")
  }, [])

  const handleClosePanel = useCallback(() => {
    setSelectedEntity(null)
  }, [])

  const handleZoomToMap = useCallback(() => {
    if (selectedEntity) {
      // Navigate to explore page with the entity focused
      router.push(`/explore?focus=${selectedEntity.id}`)
    }
  }, [selectedEntity, router])

  return (
    <div className="flex h-screen flex-col bg-background">
      <TopNav />

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT: Controls Panel */}
        <LeftPanel
          centuryYear={centuryYear}
          onCenturyChange={setCenturyYear}
          collapsed={leftPanelCollapsed}
          onToggle={() => setLeftPanelCollapsed(!leftPanelCollapsed)}
          mode={mode}
          onSelectEntity={handleSearchSelect}
        />

        {/* CENTER: Graph Canvas */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Top Toolbar */}
          <div className="flex items-center justify-between border-b border-border bg-card px-4 py-2">
            {/* Graph Mode Toggles - Centered */}
            <div className="flex items-center gap-1 rounded-lg bg-muted/50 p-1">
              {GRAPH_MODES.map((m) => {
                const Icon = m.icon
                const active = mode === m.id
                return (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    title={m.description}
                    className={`group relative flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs transition-all ${
                      active
                        ? "bg-accent font-medium text-accent-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-background hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{m.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Spacer for balance */}
            <div className="w-48" />
          </div>

          {/* Mode Description Bar */}
          <div className="border-b border-border bg-muted/30 px-4 py-2">
            <p className="text-center text-xs text-muted-foreground">
              <span className="font-medium text-foreground">{GRAPH_MODES.find(m => m.id === mode)?.label}:</span>{" "}
              {GRAPH_MODES.find(m => m.id === mode)?.description}
            </p>
          </div>

          {/* Graph Area */}
          <div className="relative flex-1 parchment-bg">
            <MemoizedRelationshipGraph
              onSelectEntity={handleSelectEntity}
              focusId={activeFocusId}
              isDark={isDark}
              mode={mode}
              centuryYear={centuryYear}
            />

            {/* Legend - Position changes based on mode to avoid overlapping timeline dates */}
            <div className={`absolute left-1/2 flex -translate-x-1/2 items-center gap-4 rounded-lg border border-border bg-card/95 px-4 py-2 shadow-sm backdrop-blur-sm ${
              mode === "temporal" ? "bottom-20" : "bottom-4"
            }`}>
              {[
                { type: "City", color: COLORS.city },
                { type: "Route", color: COLORS.route },
                { type: "Good", color: COLORS.good },
                { type: "Event", color: COLORS.event },
                { type: "Person", color: COLORS.person },
                { type: "Inscription", color: COLORS.inscription },
              ].map(({ type, color }) => (
                <div key={type} className="flex items-center gap-1.5">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-[10px] text-muted-foreground">{type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Entity Panel (conditional, overlays) */}
        {selectedEntity && (
          <div className="relative w-80 shrink-0 border-l border-border bg-card shadow-lg">
            <EntityPanel
              entity={selectedEntity}
              onClose={handleClosePanel}
              onSelectEntity={handleSearchSelect}
              onZoomTo={handleZoomToMap}
              currentYear={centuryYear}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default function GraphPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-background">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        </div>
      }
    >
      <GraphContent />
    </Suspense>
  )
}
