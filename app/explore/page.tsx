/*
 * app/explore/page.tsx
 * Spatial exploration view — the interactive Mapbox map interface.
 * It will:
 * - Display Silk Road cities, routes, and entities on a Mapbox-powered map
 * - Filter visible entities by type, region, and century via the left panel
 * - Show a detail panel for any selected entity on the right
 * - Animate trade route paths and city markers based on the active century
 * - Fetch live data from the Flask backend if available, otherwise use the static dataset
 */

"use client"

import { useState, useCallback, useEffect, useRef, Suspense } from "react"
import { useTheme } from "next-themes"
import { useSearchParams } from "next/navigation"
import { PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TopNav } from "@/components/top-nav"
import { SilkRoadMap } from "@/components/explore/silk-road-map"
import { FilterPanel } from "@/components/explore/filter-panel"
import { EntityPanel } from "@/components/explore/entity-panel"

import {
  ALL_ENTITIES,
  getEntitiesForCentury,
  getRoutesForCentury,
  type SilkRoadEntity,
  type EntityType,
  type Region,
  type RouteSegment,
} from "@/lib/silk-road-data"
import {
  fetchEntitiesForCentury,
  fetchRoutesForCentury,
} from "@/lib/api-client"

function ExploreContent() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const searchParams = useSearchParams()

  const [year, setYear] = useState(900)
  const [selectedTypes, setSelectedTypes] = useState<EntityType[]>([
    "City",
    "Route",
    "Event",
    "Good",
  ])
  const [selectedRegions, setSelectedRegions] = useState<Region[]>([])
  const [selectedEntity, setSelectedEntity] = useState<SilkRoadEntity | null>(null)
  const [leftOpen, setLeftOpen] = useState(true)
  const [rightOpen, setRightOpen] = useState(true)
  const mapResizeRef = useRef<(() => void) | null>(null)

  const handleMapReady = useCallback((resizeFn: () => void) => {
    mapResizeRef.current = resizeFn
  }, [])

  const toggleLeftPanel = useCallback(() => {
    setLeftOpen((prev) => !prev)
    // Wait for CSS transition to start, then resize the map
    setTimeout(() => mapResizeRef.current?.(), 50)
    setTimeout(() => mapResizeRef.current?.(), 320)
  }, [])

  const toggleRightPanel = useCallback(() => {
    setRightOpen((prev) => !prev)
    setTimeout(() => mapResizeRef.current?.(), 50)
    setTimeout(() => mapResizeRef.current?.(), 320)
  }, [])

  /* ── Data for current year: immediate sync update + optional async enhancement ── */
  const [allEntities, setAllEntities] = useState<SilkRoadEntity[]>(
    () => getEntitiesForCentury(year)
  )
  const [routes, setRoutes] = useState<RouteSegment[]>(
    () => getRoutesForCentury(year)
  )

  // Immediately update data when year changes (sync - fast, for playback)
  useEffect(() => {
    setAllEntities(getEntitiesForCentury(year))
    setRoutes(getRoutesForCentury(year))
  }, [year])
  
  // Also try async fetch for potentially fresher API data (non-blocking)
  useEffect(() => {
    let cancelled = false
    const timeoutId = setTimeout(async () => {
      const [entities, segs] = await Promise.all([
        fetchEntitiesForCentury(year),
        fetchRoutesForCentury(year),
      ])
      if (!cancelled) {
        setAllEntities(entities)
        setRoutes(segs)
      }
    }, 300) // Debounce async fetch to avoid overwhelming during rapid playback
    
    return () => { 
      cancelled = true
      clearTimeout(timeoutId)
    }
  }, [year])

  /* Handle search param ?select=entityId to auto-select from search */
  useEffect(() => {
    const selectId = searchParams.get("select")
    if (selectId) {
      const entity = ALL_ENTITIES.find((e) => e.id === selectId)
      if (entity) {
        setSelectedEntity(entity)
        setRightOpen(true)
      }
    }
  }, [searchParams])

  const filteredEntities = allEntities.filter((e) => {
    const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(e.type)
    const regionMatch = selectedRegions.length === 0 || selectedRegions.includes(e.region)
    return typeMatch && regionMatch
  })

  const handleToggleType = useCallback((type: EntityType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    )
  }, [])

  const handleToggleRegion = useCallback((region: Region) => {
    setSelectedRegions((prev) =>
      prev.includes(region) ? prev.filter((r) => r !== region) : [...prev, region]
    )
  }, [])

  const handleResetView = useCallback(() => {
    setYear(900)
    setSelectedTypes(["City", "Route", "Event", "Good"])
    setSelectedRegions([])
    setSelectedEntity(null)
  }, [])

  const handleJumpToIstanbul = useCallback(() => {
    const istanbul = allEntities.find((e) => e.id === "istanbul")
    if (istanbul) setSelectedEntity(istanbul)
  }, [allEntities])

  const handleSearchSelect = useCallback(
    (entity: SilkRoadEntity) => {
      setSelectedEntity(entity)
      setRightOpen(true)
    },
    []
  )

  const handleZoomTo = useCallback(() => {
    /* Map handles fly-to when selectedEntity changes */
  }, [])

  return (
    <div className="flex h-screen flex-col bg-background">
      <TopNav />

      <div className="relative flex flex-1 overflow-hidden">
        {/* Left Filter Panel */}
        <aside
          className={`shrink-0 border-r border-border bg-card transition-all duration-300 ${
            leftOpen ? "w-64 lg:w-72" : "w-0"
          } overflow-hidden`}
        >
          <FilterPanel
            year={year}
            onYearChange={setYear}
            selectedTypes={selectedTypes}
            onToggleType={handleToggleType}
            selectedRegions={selectedRegions}
            onToggleRegion={handleToggleRegion}
            onResetView={handleResetView}
            onJumpToIstanbul={handleJumpToIstanbul}
            onSearchSelect={handleSearchSelect}
          />
        </aside>

        {/* Center Map */}
        <main className="relative flex-1">
          <SilkRoadMap
            entities={filteredEntities}
            routes={routes}
            selectedEntity={selectedEntity}
            onSelectEntity={handleSearchSelect}
            isDark={isDark}
            currentYear={year}
            onMapReady={handleMapReady}
          />
          


          {/* Panel toggle buttons */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-2 z-10 h-8 w-8 bg-card/80 shadow-sm backdrop-blur-sm"
            onClick={toggleLeftPanel}
            aria-label={leftOpen ? "Close filter panel" : "Open filter panel"}
          >
            {leftOpen ? (
              <PanelLeftClose className="h-4 w-4" />
            ) : (
              <PanelLeftOpen className="h-4 w-4" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 z-10 h-8 w-8 bg-card/80 shadow-sm backdrop-blur-sm"
            onClick={toggleRightPanel}
            aria-label={rightOpen ? "Close entity panel" : "Open entity panel"}
          >
            {rightOpen ? (
              <PanelRightClose className="h-4 w-4" />
            ) : (
              <PanelRightOpen className="h-4 w-4" />
            )}
          </Button>

          {/* Map overlay info */}
          <div className="absolute bottom-4 left-4 rounded-md border border-border bg-card/90 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur-sm">
            <span className="font-mono font-medium text-foreground">
              {filteredEntities.filter((e) => e.type === "City").length}
            </span>{" "}
            cities &middot;{" "}
            <span className="font-mono font-medium text-foreground">
              {routes.length}
            </span>{" "}
            routes visible
          </div>
        </main>

        {/* Right Entity Panel */}
        <aside
          className={`shrink-0 border-l border-border transition-all duration-300 ${
            rightOpen ? "w-80 lg:w-96" : "w-0"
          } overflow-hidden`}
        >
          <EntityPanel
            entity={selectedEntity}
            onClose={() => setSelectedEntity(null)}
            onSelectEntity={handleSearchSelect}
            onZoomTo={handleZoomTo}
            currentYear={year}
          />
        </aside>
      </div>
    </div>
  )
}

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-background">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        </div>
      }
    >
      <ExploreContent />
    </Suspense>
  )
}
