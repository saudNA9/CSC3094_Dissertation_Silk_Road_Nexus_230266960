"use client"

import { use, useState, useEffect } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import Image from "next/image"
import {
  ArrowLeft,
  MapPin,
  GitBranch,
  Clock,
  ExternalLink,
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
  Map,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TopNav } from "@/components/top-nav"
import { ALL_ENTITIES, SILK_ROAD_RELATIONSHIPS, type SilkRoadEntity, type CityRole } from "@/lib/silk-road-data"
import { TRAVELLERS } from "@/lib/traveller-data"
import { fetchEntity } from "@/lib/api-client"
import { getCityImage } from "@/lib/city-images"

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

export default function EntityPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)

  /* Start with static data (instant), then try Flask API */
  const staticEntity = ALL_ENTITIES.find((e) => e.id === id)
  const [entity, setEntity] = useState<SilkRoadEntity | undefined>(staticEntity)

  useEffect(() => {
    let cancelled = false
    fetchEntity(id).then((e) => {
      if (!cancelled && e) setEntity(e)
    })
    return () => { cancelled = true }
  }, [id])

  if (!entity) return notFound()

  // Get relationships from both the entity's relatedEntities field AND the SILK_ROAD_RELATIONSHIPS array
  const directRelatedIds = entity.relatedEntities || []

  // Find relationships where this entity is source or target
  const relationshipConnections = SILK_ROAD_RELATIONSHIPS
    .filter(rel => rel.sourceId === entity.id || rel.targetId === entity.id)
    .map(rel => rel.sourceId === entity.id ? rel.targetId : rel.sourceId)

  // Combine and deduplicate
  const allRelatedIds = [...new Set([...directRelatedIds, ...relationshipConnections])]

  const relatedEntities = allRelatedIds
    .map((rid) => ALL_ENTITIES.find((e) => e.id === rid))
    .filter(Boolean) as SilkRoadEntity[]

  const cityImage = entity.type === "City" ? getCityImage(entity.id) : null

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopNav />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 lg:px-6">
        {/* Back navigation */}
        <Link href="/explore">
          <Button
            variant="ghost"
            size="sm"
            className="mb-6 gap-1.5 text-muted-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Explorer
          </Button>
        </Link>

        {/* ENTITY HEADER CARD */}
        <div className="ornamental-border mb-8 rounded-xl border border-border bg-card p-6">
          {/* Title and Type */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  {entity.name}
                </h1>
                <Badge
                  variant="outline"
                  className={TYPE_COLORS[entity.type] || ""}
                >
                  {entity.type}
                </Badge>
              </div>
              <div className="mt-2 flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{entity.region}</span>
              </div>
            </div>
          </div>

          {/* Active Period Box */}
          <div className="mt-5 inline-flex items-center gap-3 rounded-lg border border-border bg-muted/50 px-4 py-3">
            <Clock className="h-5 w-5 text-accent" />
            <div>
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-accent">
                Active Period
              </span>
              <p className="font-mono text-lg font-semibold text-foreground">
                {yearLabel(entity.startYear)} &ndash; {yearLabel(entity.endYear)}
              </p>
            </div>
          </div>

          {/* Role badges */}
          {entity.roles && entity.roles.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {entity.roles.map((role) => {
                const Icon = ROLE_ICONS[role] || Building2
                return (
                  <div
                    key={role}
                    className="flex items-center gap-1.5 rounded-md border border-accent/20 bg-accent/10 px-3 py-1.5 text-sm font-medium text-accent"
                  >
                    <Icon className="h-4 w-4" />
                    {role}
                  </div>
                )
              })}
            </div>
          )}

          {/* Overview Text */}
          <div className="mt-5">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-accent">
              Overview
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {entity.description}
            </p>
          </div>

          {/* Actions */}
          <div className="mt-6">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-accent">
              Actions
            </h3>
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <Link href={`/explore?focus=${entity.id}`} className="flex-1 min-w-[140px]">
                <Button variant="outline" className="w-full justify-between">
                  <span className="flex items-center gap-2">
                    <Map className="h-4 w-4" />
                    View on Map
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href={`/graph?focus=${entity.id}`} className="flex-1 min-w-[140px]">
                <Button variant="outline" className="w-full justify-between">
                  <span className="flex items-center gap-2">
                    <GitBranch className="h-4 w-4" />
                    View in Graph
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
              {entity.type === "Person" && TRAVELLERS.some(t => t.id === entity.id) && (
                <Link href={`/traveller/${entity.id}`} className="flex-1 min-w-[140px]">
                  <Button variant="default" className="w-full justify-between bg-accent text-accent-foreground hover:bg-accent/90">
                    <span className="flex items-center gap-2">
                      <Route className="h-4 w-4" />
                      Travel With {(entity.name ?? '').split(" ")[0]}
                    </span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Hero Image for Cities */}
        {cityImage && (
          <div className="mb-8 relative aspect-[20/9] overflow-hidden rounded-xl border border-border">
            <Image
              src={cityImage.url}
              alt={cityImage.alt}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-xs text-white/80">{cityImage.caption}</p>
            </div>
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid gap-8 lg:grid-cols-[1fr,320px]">
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="mb-6 w-full justify-start">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="relationships">Relationships</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="sources">Sources</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                {!entity.tradeSignificance && !entity.connectedRoutes?.length && !entity.relatedGoods?.length && !entity.facts && !entity.notableFigures?.length && !entity.relatedEvents?.length && (
                  <div className="rounded-xl border border-border bg-card p-6">
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {entity.description}
                    </p>
                  </div>
                )}

                {entity.tradeSignificance && (
                  <div>
                    <h3 className="heritage-divider mb-3">
                      <span className="shrink-0 text-xs font-semibold uppercase tracking-[0.15em] text-accent">
                        Trade Significance
                      </span>
                    </h3>
                    <div className="gold-corners rounded-xl border border-accent/20 bg-accent/5 p-5">
                      <p className="text-sm leading-relaxed text-foreground/80">
                        {entity.tradeSignificance}
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid gap-6 sm:grid-cols-2">
                  {entity.connectedRoutes && entity.connectedRoutes.length > 0 && (
                    <div>
                      <h3 className="heritage-divider mb-3">
                        <span className="shrink-0 text-xs font-semibold uppercase tracking-[0.15em] text-accent">
                          Connected Routes
                        </span>
                      </h3>
                      <ul className="space-y-1.5">
                        {entity.connectedRoutes.map((r) => (
                          <li key={r} className="flex items-center gap-2 text-sm text-foreground">
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {entity.relatedGoods && entity.relatedGoods.length > 0 && (
                    <div>
                      <h3 className="heritage-divider mb-3">
                        <span className="shrink-0 text-xs font-semibold uppercase tracking-[0.15em] text-accent">
                          Traded Goods
                        </span>
                      </h3>
                      <ul className="space-y-1.5">
                        {entity.relatedGoods.map((g) => (
                          <li key={g} className="flex items-center gap-2 text-sm text-foreground">
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                            {g}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {entity.facts && (
                  <div>
                    <h3 className="heritage-divider mb-3">
                      <span className="shrink-0 text-xs font-semibold uppercase tracking-[0.15em] text-accent">
                        Key Facts
                      </span>
                    </h3>
                    <div className="grid gap-3 sm:grid-cols-3">
                      {Object.entries(entity.facts).map(([key, value]) => (
                        <div
                          key={key}
                          className="rounded-lg border border-border bg-card p-4 text-center"
                        >
                          <span className="block text-2xl font-bold text-foreground">{value}</span>
                          <span className="mt-1 block text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                            {key}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {entity.notableFigures && entity.notableFigures.length > 0 && (
                  <div>
                    <h3 className="heritage-divider mb-3">
                      <span className="shrink-0 text-xs font-semibold uppercase tracking-[0.15em] text-accent">
                        Notable Figures
                      </span>
                    </h3>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {entity.notableFigures.map((fig) => (
                        <div key={fig.name} className="rounded-lg border border-border bg-card p-4">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-accent" />
                            <span className="text-sm font-semibold text-foreground">{fig.name}</span>
                          </div>
                          <span className="mt-1 block font-mono text-xs text-muted-foreground">{fig.era}</span>
                          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{fig.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {entity.relatedEvents && entity.relatedEvents.length > 0 && (
                  <div>
                    <h3 className="heritage-divider mb-3">
                      <span className="shrink-0 text-xs font-semibold uppercase tracking-[0.15em] text-accent">
                        Key Events
                      </span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {entity.relatedEvents.map((e) => (
                        <Badge key={e} variant="outline" className="border-rose-500/20 bg-rose-500/5 text-sm text-foreground">
                          {e}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Relationships Tab */}
              <TabsContent value="relationships" className="space-y-6">
                {relatedEntities.length > 0 ? (
                  <>
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                        Connected Entities ({relatedEntities.length})
                      </h3>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {relatedEntities.map((rel) => (
                        <Link
                          key={rel.id}
                          href={`/entity/${rel.id}`}
                          className="gold-corners group flex items-start gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-accent/30"
                        >
                          <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-accent" />
                          <div className="flex-1">
                            <span className="block text-sm font-medium text-foreground group-hover:text-accent">
                              {rel.name}
                            </span>
                            <div className="mt-1 flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className={`text-[10px] ${TYPE_COLORS[rel.type] || ""}`}
                              >
                                {rel.type}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {rel.region}
                              </span>
                            </div>
                            <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">
                              {rel.description}
                            </p>
                          </div>
                          <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <GitBranch className="mb-3 h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      No direct relationships recorded for this entity.
                    </p>
                  </div>
                )}
              </TabsContent>

              {/* Timeline Tab */}
              <TabsContent value="timeline" className="space-y-4">
                {entity.centuryNotes && Object.keys(entity.centuryNotes).length > 0 ? (
                  <div className="space-y-3">
                    {Object.entries(entity.centuryNotes)
                      .sort(([a], [b]) => parseInt(a) - parseInt(b))
                      .map(([period, note]) => (
                        <div
                          key={period}
                          className="flex gap-4 rounded-lg border border-border bg-card p-4"
                        >
                          <div className="flex flex-col items-center">
                            <span className="font-mono text-xs font-bold text-accent">
                              {period.replace("-", "\u2013")}
                            </span>
                            <span className="text-[10px] text-muted-foreground">CE</span>
                            <div className="mt-2 h-full w-px bg-accent/20" />
                          </div>
                          <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                            {note}
                          </p>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-border bg-card p-6">
                    <div className="mb-4 flex items-center gap-3">
                      <Clock className="h-6 w-6 text-accent" />
                      <h3 className="text-lg font-semibold text-foreground">Historical Period</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                        <span className="text-sm text-muted-foreground">Active Period</span>
                        <span className="font-mono text-sm font-semibold text-foreground">
                          {entity.startYear < 0 ? `${Math.abs(entity.startYear)} BCE` : `${entity.startYear} CE`}
                          {" — "}
                          {entity.endYear < 0 ? `${Math.abs(entity.endYear)} BCE` : `${entity.endYear} CE`}
                        </span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                        <span className="text-sm text-muted-foreground">Duration</span>
                        <span className="font-mono text-sm font-semibold text-foreground">
                          {entity.endYear - entity.startYear} years
                        </span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                        <span className="text-sm text-muted-foreground">Type</span>
                        <span className="text-sm font-medium text-accent">{entity.type}</span>
                      </div>
                      {entity.region && (
                        <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                          <span className="text-sm text-muted-foreground">Region</span>
                          <span className="text-sm font-medium text-foreground">{entity.region}</span>
                        </div>
                      )}
                    </div>
                    <p className="mt-4 text-xs text-muted-foreground text-center">
                      Century-by-century notes are available for major cities in this dataset.
                    </p>
                  </div>
                )}
              </TabsContent>

              {/* Sources Tab — FIXED: entity.source may be undefined */}
              <TabsContent value="sources" className="space-y-4">
                <div className="rounded-xl border border-border bg-card p-6">
                  <h3 className="mb-4 text-lg font-semibold text-foreground">Primary Sources</h3>
                  <div className="space-y-3">
                    {(entity.source ?? '').split(';').filter(Boolean).map((src, idx) => (
                      <div key={idx} className="flex items-start gap-3 rounded-lg border border-border/50 bg-muted/30 p-3">
                        <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-medium text-accent">
                          {idx + 1}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{src.trim()}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {src.toLowerCase().includes('pleiades') && 'Ancient Places Database - Peer-reviewed geographical reference for ancient world locations'}
                            {src.toLowerCase().includes('frankopan') && 'Peter Frankopan, "The Silk Roads: A New History of the World" (2015) - Academic monograph'}
                            {src.toLowerCase().includes('hansen') && 'Valerie Hansen - Academic research on Central Asian archaeology and Silk Road history'}
                            {src.toLowerCase().includes('unesco') && 'UNESCO World Heritage documentation - Official heritage site records'}
                            {src.toLowerCase().includes('whitfield') && 'Susan Whitfield - Specialist research on Silk Road artifacts and manuscripts'}
                            {src.toLowerCase().includes('iranica') && 'Encyclopaedia Iranica - Scholarly reference for Iranian and Persian studies'}
                            {src.toLowerCase().includes('otgonbaatar') && 'Mongolian historical research on Pax Mongolica period'}
                            {src.toLowerCase().includes('wheelis') && 'Mark Wheelis - Academic research on biological history and disease transmission'}
                            {!src.toLowerCase().includes('pleiades') && !src.toLowerCase().includes('frankopan') && !src.toLowerCase().includes('hansen') && !src.toLowerCase().includes('unesco') && !src.toLowerCase().includes('whitfield') && !src.toLowerCase().includes('iranica') && !src.toLowerCase().includes('otgonbaatar') && !src.toLowerCase().includes('wheelis') && 'Academic reference'}
                          </p>
                        </div>
                      </div>
                    ))}
                    {!entity.source && (
                      <p className="text-sm text-muted-foreground">
                        Source information is available in the published dataset.
                      </p>
                    )}
                  </div>

                  {/* Dataset Attribution */}
                  <div className="mt-6 space-y-4">
                    <div className="rounded-lg border border-accent/20 bg-accent/5 p-4">
                      <h4 className="text-sm font-medium text-accent">Dataset Information</h4>
                      <p className="mt-2 text-xs text-muted-foreground">
                        This entity is part of the <strong>Silk Roads Nexus Curated Dataset v1.0</strong>,
                        compiled by <strong>Saud Najem S. Alnajem</strong> (Student ID: 230266960) for the
                        CSC3094 Final Year Dissertation at Newcastle University.
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Supervisor: <strong>Dr Rouaa Yassin Kassab</strong> | Published: March 2026
                      </p>
                    </div>

                    <div className="rounded-lg border border-border bg-muted/30 p-4">
                      <h4 className="text-sm font-medium text-foreground">Data Verification Declaration</h4>
                      <p className="mt-2 text-xs text-muted-foreground">
                        All data in this dataset has been manually curated and cross-referenced against
                        peer-reviewed academic publications, archaeological reports, and authoritative
                        historical databases. Geographic coordinates have been verified against the
                        Pleiades gazetteer of ancient places where applicable.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 rounded-lg border border-border bg-card p-3">
                      <ExternalLink className="h-4 w-4 text-accent" />
                      <div className="flex-1">
                        <p className="text-xs font-medium text-foreground">Dataset DOI</p>
                        <a
                          href="https://doi.org/10.5281/zenodo.19684922"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-accent hover:underline"
                        >
                          https://doi.org/10.5281/zenodo.19684922
                        </a>
                      </div>
                    </div>

                    <p className="text-[10px] text-muted-foreground">
                      License: CC BY-NC 4.0 (Creative Commons Attribution-NonCommercial 4.0 International)
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-4 lg:sticky lg:top-4 lg:self-start">
            {relatedEntities.length > 0 && (
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-accent">
                  Related Entities
                </h3>
                <ul className="space-y-2">
                  {relatedEntities.slice(0, 5).map((rel) => (
                    <li key={rel.id}>
                      <Link
                        href={`/entity/${rel.id}`}
                        className="flex items-center gap-2 text-sm text-foreground hover:text-accent"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                        {rel.name}
                      </Link>
                    </li>
                  ))}
                </ul>
                {relatedEntities.length > 5 && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    +{relatedEntities.length - 5} more in Relationships tab
                  </p>
                )}
              </div>
            )}

            {entity.relatedGoods && entity.relatedGoods.length > 0 && (
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-accent">
                  Traded Goods
                </h3>
                <ul className="space-y-1.5">
                  {entity.relatedGoods.map((g) => (
                    <li key={g} className="flex items-center gap-2 text-sm text-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                      {g}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {entity.facts && (
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-accent">
                  Key Facts
                </h3>
                <div className="space-y-3">
                  {Object.entries(entity.facts).slice(0, 3).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <span className="block text-xl font-bold text-foreground">{value}</span>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{key}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}