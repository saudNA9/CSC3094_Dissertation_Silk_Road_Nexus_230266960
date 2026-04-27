/*
 * components/explore/filter-panel.tsx
 * Left-side control panel for the spatial exploration map view.
 * It will:
 * - Present a century timeline slider with play/pause auto-advance controls
 * - Allow toggling entity types (City, Good, Event, Person, Inscription) on/off
 * - Allow toggling between land and maritime trade route visibility
 * - Display live counts of currently visible entities by type
 * - Collapse into a compact overlay on mobile viewports
 */

"use client"

import {
  RotateCcw,
  MapPin,
  ChevronDown,
  ChevronUp,
  Compass,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { SearchCommand } from "@/components/search-command"
import {
  getCenturyWindow,
  type EntityType,
  type Region,
  type SilkRoadEntity,
} from "@/lib/silk-road-data"
import { useState, useEffect, useRef, useCallback } from "react"

const TIMELINE_MIN = -300
const TIMELINE_MAX = 1500
const STEP_SMALL = 10   // step forward/back
const STEP_CENTURY = 100 // skip forward/back
const PLAYBACK_SPEEDS = [
  { label: "0.5x", interval: 400, step: 5 },
  { label: "1x", interval: 200, step: 5 },
  { label: "2x", interval: 100, step: 5 },
  { label: "4x", interval: 80, step: 10 },
]

const ENTITY_TYPES: EntityType[] = [
  "City",
  "Route",
  "Person",
  "Good",
  "Event",
  "Inscription",
]

const REGIONS: Region[] = [
  "Anatolia",
  "Levant",
  "Persia",
  "Central Asia",
  "China",
  "India",
  "Arabia",
  "East Africa",
]

interface FilterPanelProps {
  year: number
  onYearChange: (year: number) => void
  selectedTypes: EntityType[]
  onToggleType: (type: EntityType) => void
  selectedRegions: Region[]
  onToggleRegion: (region: Region) => void
  onResetView: () => void
  onJumpToIstanbul: () => void
  onSearchSelect?: (entity: SilkRoadEntity) => void
}

export function FilterPanel({
  year,
  onYearChange,
  selectedTypes,
  onToggleType,
  selectedRegions,
  onToggleRegion,
  onResetView,
  onJumpToIstanbul,
  onSearchSelect,
}: FilterPanelProps) {
  const century = getCenturyWindow(year)
  const [showRegions, setShowRegions] = useState(false)

  /* ── Timeline playback state ── */
  const [isPlaying, setIsPlaying] = useState(false)
  const [speedIdx, setSpeedIdx] = useState(1) // default 1x
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const speed = PLAYBACK_SPEEDS[speedIdx]

  const clampYear = useCallback(
    (y: number) => Math.max(TIMELINE_MIN, Math.min(TIMELINE_MAX, y)),
    []
  )

  /* Track year in a ref so the interval always sees latest value */
  const yearRef = useRef(year)
  useEffect(() => {
    yearRef.current = year
  }, [year])

  /* Auto-advance when playing */
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        const next = yearRef.current + speed.step
        if (next >= TIMELINE_MAX) {
          onYearChange(TIMELINE_MAX)
          setIsPlaying(false)
        } else {
          onYearChange(next)
        }
      }, speed.interval)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPlaying, speed, onYearChange])

  const togglePlay = useCallback(() => {
    if (year >= TIMELINE_MAX) {
      // If at end, restart from beginning
      onYearChange(TIMELINE_MIN)
      setIsPlaying(true)
    } else {
      setIsPlaying((p) => !p)
    }
  }, [year, onYearChange])

  const stepBack = useCallback(() => {
    setIsPlaying(false)
    onYearChange(clampYear(year - STEP_SMALL))
  }, [year, onYearChange, clampYear])

  const stepForward = useCallback(() => {
    setIsPlaying(false)
    onYearChange(clampYear(year + STEP_SMALL))
  }, [year, onYearChange, clampYear])

  const skipBack = useCallback(() => {
    setIsPlaying(false)
    onYearChange(clampYear(year - STEP_CENTURY))
  }, [year, onYearChange, clampYear])

  const skipForward = useCallback(() => {
    setIsPlaying(false)
    onYearChange(clampYear(year + STEP_CENTURY))
  }, [year, onYearChange, clampYear])

  const cycleSpeed = useCallback(() => {
    setSpeedIdx((prev) => (prev + 1) % PLAYBACK_SPEEDS.length)
  }, [])

  return (
    <div className="flex h-full flex-col parchment-bg">
      {/* Scrollable content area */}
      <div className="silk-scrollbar flex-1 flex flex-col gap-5 overflow-y-auto p-4">
        {/* Ornamental header */}
        <div className="flex items-center gap-2">
          <Compass className="h-4 w-4 text-accent" />
          <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-accent">
            Navigation
          </h2>
        </div>

      {/* Inline Search */}
      <div>
        <h3 className="heritage-divider mb-3">
          <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.15em] text-accent">
            Find on Map
          </span>
        </h3>
        <SearchCommand compact onSelectEntity={onSearchSelect} />
        <p className="mt-2 text-[11px] text-muted-foreground">
          Find and display entities on the map with details.
        </p>
      </div>

      {/* Timeline */}
      <div className="gold-corners rounded-lg border border-border bg-card/50 p-4">
        <h3 className="heritage-divider mb-2">
          <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.15em] text-accent">
            Timeline
          </span>
        </h3>

        {/* BCE/CE Note */}
        <p className="mb-3 text-center text-[9px] text-muted-foreground">
          <span className="font-medium">BCE</span> = Before Common Era | <span className="font-medium">CE</span> = Common Era
        </p>

        {/* Year display */}
        <div className="mb-3 text-center">
          <span className="font-mono text-3xl font-bold tabular-nums text-accent">
            {year < 0 ? `${Math.abs(year)}` : `${year}`}
          </span>
          <span className="ml-1 text-sm text-muted-foreground">
            {year < 0 ? "BCE" : "CE"}
          </span>
        </div>

        {/* Manual slider */}
        <Slider
          value={[year]}
          onValueChange={([v]) => {
            setIsPlaying(false)
            onYearChange(v)
          }}
          min={TIMELINE_MIN}
          max={TIMELINE_MAX}
          step={1}
          className="my-3"
        />

        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <span>300 BCE</span>
          <span>1500 CE</span>
        </div>

        {/* Playback controls */}
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

        {/* Speed selector */}
        <div className="mt-2 flex items-center justify-center">
          <button
            onClick={cycleSpeed}
            className="rounded-md px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:bg-accent/10 hover:text-accent"
            title="Click to cycle playback speed"
          >
            Speed: {speed.label}
          </button>
        </div>

        {/* Progress bar (subtle) */}
        <div className="mt-2 h-0.5 w-full overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-accent transition-all duration-200"
            style={{
              width: `${((year - TIMELINE_MIN) / (TIMELINE_MAX - TIMELINE_MIN)) * 100}%`,
            }}
          />
        </div>

        {/* Century window */}
        <div className="mt-3 rounded-md border border-accent/20 bg-accent/5 px-3 py-2 text-center">
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Active Century Window
          </span>
          <p className="mt-0.5 font-mono text-xs font-semibold text-foreground">
            {century.label}
          </p>
        </div>
      </div>

      {/* Entity Type Filter */}
      <div>
        <h3 className="heritage-divider mb-3">
          <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.15em] text-accent">
            Entity Type
          </span>
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {ENTITY_TYPES.map((type) => {
            const active = selectedTypes.includes(type)
            return (
              <Badge
                key={type}
                variant={active ? "default" : "outline"}
                className={`cursor-pointer text-xs transition-colors ${
                  active
                    ? "bg-accent text-accent-foreground hover:bg-accent/80"
                    : "border-border hover:border-accent/30 hover:bg-accent/5"
                }`}
                onClick={() => onToggleType(type)}
              >
                {type}
              </Badge>
            )
          })}
        </div>
      </div>

      {/* Region Filter */}
      <div>
        <button
          className="heritage-divider mb-3 flex w-full items-center justify-between"
          onClick={() => setShowRegions(!showRegions)}
        >
          <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.15em] text-accent">
            Region
          </span>
          {showRegions ? (
            <ChevronUp className="h-3 w-3 text-accent" />
          ) : (
            <ChevronDown className="h-3 w-3 text-accent" />
          )}
        </button>
        {showRegions && (
          <div className="flex flex-wrap gap-1.5">
            {REGIONS.map((region) => {
              const active = selectedRegions.includes(region)
              return (
                <Badge
                  key={region}
                  variant={active ? "default" : "outline"}
                  className={`cursor-pointer text-xs transition-colors ${
                    active
                      ? "bg-accent text-accent-foreground hover:bg-accent/80"
                      : "border-border hover:border-accent/30 hover:bg-accent/5"
                  }`}
                  onClick={() => onToggleRegion(region)}
                >
                  {region}
                </Badge>
              )
            })}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-auto border-t border-border pt-4">
        <h3 className="heritage-divider mb-3">
          <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.15em] text-accent">
            Quick Actions
          </span>
        </h3>
        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2 text-xs"
            onClick={onResetView}
          >
            <RotateCcw className="h-3 w-3 text-accent" />
            Reset View
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2 text-xs"
            onClick={onJumpToIstanbul}
          >
            <MapPin className="h-3 w-3 text-accent" />
            Start from Constantinople
          </Button>
        </div>
      </div>
      </div>

      {/* Footer - outside scrollable area */}
      <div className="border-t border-border px-4 py-2 text-center">
        <span className="text-[9px] text-muted-foreground">
          Designed and Developed by <span className="text-accent">Saud Najem S Alnajem</span>
        </span>
      </div>
    </div>
  )
}
