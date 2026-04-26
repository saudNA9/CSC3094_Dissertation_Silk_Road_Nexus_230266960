/*
 * components/explore/entity-panel.tsx
 * Right-side detail panel that slides in when an entity is selected on the map.
 * It will:
 * - Display the entity's name, type, region, and active date range
 * - Show a city photograph from lib/city-images.ts when available
 * - List related goods, events, notable figures, and connected routes
 * - Provide a link to the full entity detail page (/entity/[id])
 * - Offer a "View in Graph" button to jump to the network view with this entity focused
 * - Close via the X button or by clicking an empty map area
 */

"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ExternalLink,
  GitBranch,
  MapPin,
  X,
  Crown,
  Anchor,
  Building2,
  Church,
  Palmtree,
  Shield,
  BookOpen,
  Package,
  Route,
  User,
  Clock,
  Scroll,
  ChevronRight,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ALL_ENTITIES,
  getCenturyKey,
  type SilkRoadEntity,
  type CityRole,
} from "@/lib/silk-road-data"
import {
  getCityEvents,
  getCityStateForYear,
  getCityStateVisuals,
  type CityHistoricalEvent,
} from "@/lib/city-historical-events"
import { getCityImage as getCityImageData } from "@/lib/city-images"

/* ── City hero image fallback ── */
const DEFAULT_CITY_IMAGE = "/cities/default.jpg"

function getCityImage(id: string): string {
  const cityData = getCityImageData(id)
  return cityData?.url || DEFAULT_CITY_IMAGE
}

interface EntityPanelProps {
  entity: SilkRoadEntity | null
  onClose: () => void
  onSelectEntity: (entity: SilkRoadEntity) => void
  onZoomTo: () => void
  currentYear?: number
}

function yearLabel(y: number) {
  return y < 0 ? `${Math.abs(y)} BCE` : `${y} CE`
}

const TYPE_COLORS: Record<string, string> = {
  City: "bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/20",
  Route: "bg-blue-500/15 text-blue-800 dark:text-blue-300 border-blue-500/20",
  Person: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/20",
  Good: "bg-orange-500/15 text-orange-800 dark:text-orange-300 border-orange-500/20",
  Event: "bg-rose-500/15 text-rose-800 dark:text-rose-300 border-rose-500/20",
  Inscription: "bg-purple-500/15 text-purple-800 dark:text-purple-300 border-purple-500/20",
}

const ROLE_ICONS: Record<CityRole, typeof Crown> = {
  "Trade Hub": Package,
  "Religious Centre": Church,
  "Political Capital": Crown,
  "Port City": Anchor,
  "Oasis Town": Palmtree,
  "Cultural Centre": BookOpen,
  "Military Outpost": Shield,
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="heritage-divider mb-3">
      <h4 className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.15em] text-accent">
        {children}
      </h4>
    </div>
  )
}

export function EntityPanel({
  entity,
  onClose,
  onSelectEntity,
  onZoomTo,
  currentYear = 900,
}: EntityPanelProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  if (!entity) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 text-center parchment-bg">
        <div className="gold-corners mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted p-1">
          <MapPin className="h-6 w-6 text-accent" />
        </div>
        <p className="text-sm font-semibold text-foreground">No Entity Selected</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Click a city marker on the map to explore its Silk Road heritage.
        </p>
      </div>
    )
  }

  const relatedEntities = (entity.relatedEntities || [])
    .map((id) => ALL_ENTITIES.find((e) => e.id === id))
    .filter(Boolean) as SilkRoadEntity[]

  const centuryKey = getCenturyKey(currentYear)
  const centuryNote = entity.centuryNotes?.[centuryKey]

  const toggle = (section: string) =>
    setExpandedSection((prev) => (prev === section ? null : section))

  const isCity = entity.type === "City"

  return (
    <div className="silk-scrollbar flex h-full flex-col overflow-y-auto parchment-bg">
      {/* ── Hero Section (Cities only) ── */}
      {isCity && (
        <div className="shrink-0">
          {/* Close button overlaid on image */}
          <div className="relative h-44 w-full overflow-hidden">
            <Image
              src={getCityImage(entity.id)}
              alt={`Historic illustration of ${entity.name}`}
              fill
              className="object-cover"
              sizes="400px"
              priority
            />
            <button
              className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-white/80 text-neutral-600 shadow-sm transition-all hover:bg-white hover:text-neutral-900"
              onClick={onClose}
              aria-label="Close panel"
            >
              <X className="h-3 w-3" strokeWidth={2.5} />
            </button>
          </div>
          {/* City name and info below image */}
          <div className="px-4 pb-3 pt-4">
            <h2 className="text-lg font-bold leading-tight text-foreground">
              {entity.name}
            </h2>
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              <Badge
                variant="outline"
                className={`text-xs ${TYPE_COLORS[entity.type] || ""}`}
              >
                {entity.type}
              </Badge>
              <span className="text-[10px] text-muted-foreground">
                {entity.region}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── Non-city header (no hero image) ── */}
      {!isCity && (
        <div className="ornamental-border border-b border-border px-4 pb-4 pt-5">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h2 className="text-lg font-bold leading-tight text-foreground">
                {entity.name}
              </h2>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <Badge
                  variant="outline"
                  className={`text-xs ${TYPE_COLORS[entity.type] || ""}`}
                >
                  {entity.type}
                </Badge>
                <span className="text-[10px] text-muted-foreground">
                  {entity.region}
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close panel</span>
            </Button>
          </div>
        </div>
      )}

      {/* ── Structured Content ── */}
      <div className="flex flex-col gap-4 px-4 py-4">
        {/* Role badges (City-specific) */}
        {entity.roles && entity.roles.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {entity.roles.map((role) => {
              const Icon = ROLE_ICONS[role] || Building2
              return (
                <div
                  key={role}
                  className="flex items-center gap-1 rounded-md border border-accent/20 bg-accent/10 px-2 py-1 text-[10px] font-medium text-accent"
                >
                  <Icon className="h-3 w-3" />
                  {role}
                </div>
              )
            })}
          </div>
        )}

        {/* Active period */}
        <div className="flex items-center gap-2 rounded-md border border-border bg-muted/60 px-3 py-2">
          <Clock className="h-3.5 w-3.5 text-accent" />
          <div>
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Active Period
            </span>
            <p className="font-mono text-xs font-semibold text-foreground">
              {yearLabel(entity.startYear)} &ndash; {yearLabel(entity.endYear)}
            </p>
          </div>
        </div>

        {/* Century Note (time-aware) */}
        {centuryNote && (
          <div className="gold-corners rounded-md border border-accent/25 bg-accent/5 p-3">
            <div className="mb-1 flex items-center gap-1.5">
              <Scroll className="h-3 w-3 text-accent" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-accent">
                {centuryKey.replace("-", "\u2013")} CE
              </span>
            </div>
            <p className="text-xs leading-relaxed text-foreground/80">
              {centuryNote}
            </p>
          </div>
        )}

        {/* Historical Events Timeline (Cities only) */}
        {isCity && (() => {
          const events = getCityEvents(entity.id)
          const { state: currentState } = getCityStateForYear(entity.id, currentYear)
          const visuals = getCityStateVisuals(currentState)
          
          if (events.length === 0) return null
          
          return (
            <div>
              <SectionHeader>Historical Timeline</SectionHeader>
              
              {/* Current state indicator */}
              <div 
                className="mb-3 flex items-center gap-2 rounded-md border px-3 py-2"
                style={{
                  borderColor: visuals.stateColor + "40",
                  backgroundColor: visuals.stateColor + "10",
                }}
              >
                <div 
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: visuals.stateColor }}
                />
                <div className="flex-1">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    Status in {currentYear < 0 ? Math.abs(currentYear) + " BCE" : currentYear + " CE"}
                  </span>
                  <p className="text-xs font-semibold capitalize" style={{ color: visuals.stateColor }}>
                    {currentState.replace("-", " ")}
                  </p>
                </div>
              </div>
              
              {/* Events list */}
              <div className="relative space-y-2 pl-3">
                {/* Timeline line */}
                <div className="absolute left-[5px] top-1 bottom-1 w-px bg-border" />
                
                {events.slice(0, expandedSection === "events" ? events.length : 4).map((event, idx) => {
                  const isPast = event.year <= currentYear
                  const isCurrent = Math.abs(event.year - currentYear) <= 25
                  const eventVisuals = getCityStateVisuals(event.stateTo)
                  
                  return (
                    <div 
                      key={idx}
                      className={`relative rounded-md border px-3 py-2 transition-all ${
                        isCurrent 
                          ? "border-accent/40 bg-accent/10 shadow-sm" 
                          : isPast 
                            ? "border-border bg-muted/30" 
                            : "border-border/50 bg-transparent opacity-60"
                      }`}
                    >
                      {/* Timeline dot */}
                      <div 
                        className={`absolute -left-3 top-3 h-2.5 w-2.5 rounded-full border-2 ${
                          isCurrent ? "border-accent" : "border-muted-foreground/30"
                        }`}
                        style={{ 
                          backgroundColor: isPast ? eventVisuals.stateColor : "transparent"
                        }}
                      />
                      
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span 
                              className="font-mono text-[10px] font-semibold"
                              style={{ color: isPast ? eventVisuals.stateColor : "inherit" }}
                            >
                              {event.year} CE
                            </span>
                            <span 
                              className="rounded px-1.5 py-0.5 text-[9px] font-medium uppercase"
                              style={{ 
                                backgroundColor: eventVisuals.stateColor + "20",
                                color: eventVisuals.stateColor
                              }}
                            >
                              {event.stateTo}
                            </span>
                          </div>
                          <p className="mt-1 text-xs leading-relaxed text-foreground/80">
                            {event.label}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
                
                {events.length > 4 && (
                  <button
                    onClick={() => toggle("events")}
                    className="ml-1 flex items-center gap-1 text-[10px] font-medium text-accent hover:underline"
                  >
                    {expandedSection === "events" ? "Show less" : `Show ${events.length - 4} more events`}
                    <ChevronRight className={`h-3 w-3 transition-transform ${expandedSection === "events" ? "rotate-90" : ""}`} />
                  </button>
                )}
              </div>
            </div>
          )
        })()}

        {/* Overview */}
        <div>
          <SectionHeader>Overview</SectionHeader>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {entity.description}
          </p>
        </div>

        {/* Trade Significance */}
        {entity.tradeSignificance && (
          <div>
            <SectionHeader>Trade Significance</SectionHeader>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {entity.tradeSignificance}
            </p>
          </div>
        )}

        {/* Connected Routes */}
        {entity.connectedRoutes && entity.connectedRoutes.length > 0 && (
          <div>
            <SectionHeader>Connected Routes</SectionHeader>
            <div className="flex flex-col gap-1">
              {entity.connectedRoutes.map((routeName) => (
                <div
                  key={routeName}
                  className="flex items-center gap-2 rounded-md border border-border px-2.5 py-1.5 text-xs text-foreground"
                >
                  <Route className="h-3 w-3 text-accent" />
                  {routeName}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Facts grid */}
        {entity.facts && (
          <div>
            <SectionHeader>Key Facts</SectionHeader>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(entity.facts).map(([key, value]) => (
                <div
                  key={key}
                  className="rounded-md border border-border bg-card p-2.5"
                >
                  <span className="block text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    {key}
                  </span>
                  <span className="mt-0.5 block text-xs font-semibold text-foreground">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key Goods */}
        {entity.relatedGoods && entity.relatedGoods.length > 0 && (
          <div>
            <SectionHeader>Key Goods</SectionHeader>
            <div className="flex flex-wrap gap-1.5">
              {entity.relatedGoods.map((g) => (
                <Badge
                  key={g}
                  variant="outline"
                  className="border-accent/20 bg-accent/5 text-xs text-foreground"
                >
                  {g}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Notable Figures (collapsible) */}
        {entity.notableFigures && entity.notableFigures.length > 0 && (
          <div>
            <button
              className="flex w-full items-center justify-between"
              onClick={() => toggle("figures")}
            >
              <SectionHeader>Notable Figures</SectionHeader>
              <ChevronRight
                className={`h-3 w-3 text-muted-foreground transition-transform ${
                  expandedSection === "figures" ? "rotate-90" : ""
                }`}
              />
            </button>
            {expandedSection === "figures" && (
              <div className="mt-1 flex flex-col gap-2">
                {entity.notableFigures.map((fig) => (
                  <div
                    key={fig.name}
                    className="rounded-md border border-border bg-card p-2.5"
                  >
                    <div className="flex items-center gap-1.5">
                      <User className="h-3 w-3 text-accent" />
                      <span className="text-xs font-semibold text-foreground">
                        {fig.name}
                      </span>
                    </div>
                    <span className="mt-0.5 block font-mono text-[10px] text-muted-foreground">
                      {fig.era}
                    </span>
                    <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                      {fig.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Related Events */}
        {entity.relatedEvents && entity.relatedEvents.length > 0 && (
          <div>
            <SectionHeader>Related Events</SectionHeader>
            <div className="flex flex-wrap gap-1.5">
              {entity.relatedEvents.map((ev) => (
                <Badge
                  key={ev}
                  variant="outline"
                  className="border-rose-500/20 bg-rose-500/5 text-xs text-foreground"
                >
                  {ev}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Related entities */}
        {relatedEntities.length > 0 && (
          <div>
            <SectionHeader>Related Entities</SectionHeader>
            <div className="flex flex-col gap-1">
              {relatedEntities.map((rel) => (
                <button
                  key={rel.id}
                  onClick={() => onSelectEntity(rel)}
                  className="flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-accent/10"
                >
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span className="flex-1 truncate text-foreground">
                    {rel.name}
                  </span>
                  <Badge
                    variant="outline"
                    className={`shrink-0 text-[10px] ${TYPE_COLORS[rel.type] || ""}`}
                  >
                    {rel.type}
                  </Badge>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="mt-2 flex flex-col gap-2 border-t border-border pt-4">
          <Link href={`/graph?focus=${entity.id}`}>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2 text-xs"
            >
              <GitBranch className="h-3 w-3 text-accent" />
              View Relationships
            </Button>
          </Link>
          <Link href={`/entity/${entity.id}`}>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2 text-xs"
            >
              <ExternalLink className="h-3 w-3 text-accent" />
              Open Full Page
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2 text-xs"
            onClick={onZoomTo}
          >
            <MapPin className="h-3 w-3 text-accent" />
            Zoom to on Map
          </Button>
        </div>
      </div>
    </div>
  )
}
