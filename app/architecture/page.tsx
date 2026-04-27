/*
 * app/architecture/page.tsx
 * System architecture documentation page.
 * It will:
 * - Document the data model entities (City, Route, Person, Good, Event, Inscription)
 * - Describe the three coordinated views and their technology stack
 * - Display the frontend and backend technology layers
 * - Provide a reference section linking to the dataset and related resources
 */

"use client"

import {
  Database,
  Layers,
  Map,
  Clock,
  GitBranch,
  Monitor,
  Server,
  Users,
  ArrowRight,
  FileJson,
  ExternalLink,
} from "lucide-react"
import { TopNav } from "@/components/top-nav"

const DATA_MODEL_ENTITIES = [
  {
    name: "City",
    description: "Geographic locations along Silk Road routes with coordinates, roles, and century notes",
    fields: ["name", "region", "lat/lng", "importance", "startYear", "endYear", "roles[]", "centuryNotes{}"],
    count: "16 cities",
  },
  {
    name: "Route",
    description: "Trade routes connecting cities as polyline segments with commodities",
    fields: ["name", "type", "routeKind", "coordinates[][]", "primaryCommodities[]"],
    count: "14 routes (3 primary, 11 secondary)",
  },
  {
    name: "Good",
    description: "Traded commodities with origins and cultural significance",
    fields: ["name", "origin", "description", "relatedEntities[]"],
    count: "14 commodities",
  },
  {
    name: "Event",
    description: "Historical events with spatial context and relationships",
    fields: ["name", "location", "description", "year", "relatedEntities[]"],
    count: "17 events",
  },
  {
    name: "Person",
    description: "Notable individuals in Silk Road history",
    fields: ["name", "role", "activeYears", "relatedEntities[]"],
    count: "14 figures",
  },
  {
    name: "Inscription",
    description: "Epigraphic and textual primary sources including manuscripts and stone inscriptions",
    fields: ["text", "location", "language", "date"],
    count: "5 inscriptions",
  },
]

const TECH_STACK = [
  {
    icon: Monitor,
    label: "Frontend",
    items: ["Next.js 16 (App Router)", "React 19", "Tailwind CSS", "shadcn/ui", "TypeScript"],
  },
  {
    icon: Server,
    label: "Backend",
    items: ["Flask (Python)", "SQLAlchemy ORM", "Flask-Migrate", "Flask-CORS", "RESTful API"],
  },
  {
    icon: Database,
    label: "Database",
    items: [
      "SQLite (development)",
      "Entity / RouteSegment / Relationship tables",
      "Many-to-many entity relations",
      "JSON fields for flexible data",
    ],
  },
  {
    icon: Map,
    label: "Map Engine",
    items: ["Mapbox GL JS", "Custom markers with city images", "Route polylines", "Subtle pattern overlay"],
  },
  {
    icon: GitBranch,
    label: "Graph Visualization",
    items: ["D3.js force simulation", "Interactive drag & zoom", "Hover path highlighting", "Click-to-inspect"],
  },
  {
    icon: Clock,
    label: "Temporal Logic",
    items: [
      "Year-by-year slider + playback controls",
      "100-year century window snap",
      "Auto-play with speed control",
      "Cross-view synchronization",
    ],
  },
]

const EVALUATION_AREAS = [
  {
    title: "Usability (SUS)",
    description:
      "System Usability Scale (SUS) evaluation, task completion rates, and time-on-task metrics across representative user scenarios.",
  },
  {
    title: "Think Aloud",
    description:
      "Concurrent verbalization protocol capturing users' cognitive processes, navigation strategies, and comprehension challenges during exploration tasks.",
  },
  {
    title: "Engagement & Discovery",
    description:
      "Session duration, entity interactions, filter usage patterns, and how effectively users discover relationships through spatial, temporal, and semantic exploration pathways.",
  },
]

export default function ArchitecturePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopNav />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12 lg:px-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            System Architecture
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-pretty text-muted-foreground">
            Technical overview of the Silk Roads Nexus data-driven exploration
            system, designed for the CSC3094 Software Engineering dissertation.
          </p>
        </div>

        {/* Dataset Information - NEW */}
        <section className="mb-16">
          <h2 className="mb-6 text-lg font-semibold text-foreground">
            Curated Dataset
          </h2>
          <div className="rounded-xl border border-accent/20 bg-accent/5 p-6 lg:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <FileJson className="h-6 w-6 text-accent" />
                  <h3 className="text-xl font-semibold text-foreground">
                    Silk Roads Nexus Dataset v1.0
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  A curated dataset of Silk Roads entities compiled specifically for this dissertation.
                  The dataset includes 16 major cities, 14 trade routes, 14 traded commodities, 17 historical
                  events, 14 notable figures, and 5 inscriptions, all with verified geographic coordinates, temporal ranges,
                  and inter-entity relationships.
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-border bg-card p-3">
                    <span className="text-2xl font-bold text-foreground">80+</span>
                    <span className="ml-2 text-sm text-muted-foreground">Total Entities</span>
                  </div>
                  <div className="rounded-lg border border-border bg-card p-3">
                    <span className="text-2xl font-bold text-foreground">60+</span>
                    <span className="ml-2 text-sm text-muted-foreground">Relationships</span>
                  </div>
                </div>
              </div>
              <div className="shrink-0 space-y-3 lg:w-64">
                <div className="rounded-lg border border-border bg-card p-4">
                  <p className="text-xs font-medium text-muted-foreground">Author</p>
                  <p className="text-sm font-semibold text-foreground">Saud Najem S. Alnajem</p>
                  <p className="text-xs text-muted-foreground">Student ID: 230266960</p>
                </div>
                <div className="rounded-lg border border-border bg-card p-4">
                  <p className="text-xs font-medium text-muted-foreground">Supervisor</p>
                  <p className="text-sm font-semibold text-foreground">Dr Rouaa Yassin Kassab</p>
                  <p className="text-xs text-muted-foreground">Newcastle University</p>
                </div>
                <a
                  href="https://doi.org/10.5281/zenodo.19684922"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/10 p-3 text-sm font-medium text-accent hover:bg-accent/20"
                >
                  <ExternalLink className="h-4 w-4" />
                  View on Zenodo (DOI)
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Attribution & Data Sources */}
        <section className="mb-16">
          <h2 className="mb-6 text-lg font-semibold text-foreground">
            Data Sources & Attribution
          </h2>
          <div className="space-y-4 rounded-xl border border-border/50 bg-card p-6 lg:p-8">
            <div>
              <h3 className="mb-2 font-medium text-foreground">Historical Images</h3>
              <p className="text-sm text-muted-foreground">
                All historical portraits, artifacts, and visual content used in this platform are sourced from <a href="https://commons.wikimedia.org/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Wikimedia Commons</a> and are available under free and open licenses (CC0, CC-BY, or similar). These images are in the public domain or freely licensed for educational and non-commercial use.
              </p>
            </div>
            <div className="border-t border-border pt-4">
              <h3 className="mb-2 font-medium text-foreground">Silk Road Data</h3>
              <p className="text-sm text-muted-foreground">
                Historical information, routes, cities, and cultural data are derived from academic sources and publicly available historical records. This dataset was curated for educational purposes as part of CSC3094 Software Engineering dissertation research.
              </p>
            </div>
          </div>
        </section>

        {/* Architecture diagram */}
        <section className="mb-16">
          <h2 className="mb-6 text-lg font-semibold text-foreground">
            High-Level Architecture
          </h2>
          <div className="rounded-xl border border-border bg-card p-6 lg:p-8">
            <div className="flex flex-col items-center gap-4 lg:flex-row lg:gap-6">
              {/* User */}
              <div className="flex flex-col items-center gap-2 rounded-lg border border-border bg-muted/50 px-6 py-4 text-center">
                <Users className="h-6 w-6 text-accent" />
                <span className="text-sm font-medium text-foreground">
                  User
                </span>
                <span className="text-[10px] text-muted-foreground">
                  Browser client
                </span>
              </div>

              <ArrowRight className="h-5 w-5 shrink-0 rotate-90 text-muted-foreground lg:rotate-0" />

              {/* Frontend */}
              <div className="flex flex-col items-center gap-2 rounded-lg border border-accent/30 bg-accent/5 px-6 py-4 text-center">
                <Monitor className="h-6 w-6 text-accent" />
                <span className="text-sm font-medium text-foreground">
                  Next.js Frontend
                </span>
                <span className="text-[10px] text-muted-foreground">
                  React + Tailwind + shadcn/ui
                </span>
              </div>

              <ArrowRight className="h-5 w-5 shrink-0 rotate-90 text-muted-foreground lg:rotate-0" />

              {/* API Layer */}
              <div className="flex flex-col items-center gap-2 rounded-lg border border-accent/30 bg-accent/5 px-6 py-4 text-center">
                <Server className="h-6 w-6 text-accent" />
                <span className="text-sm font-medium text-foreground">
                  Flask API
                </span>
                <span className="text-[10px] text-muted-foreground">
                  /api/entities, /api/routes, /api/search
                </span>
              </div>

              <ArrowRight className="h-5 w-5 shrink-0 rotate-90 text-muted-foreground lg:rotate-0" />

              {/* Database */}
              <div className="flex flex-col items-center gap-2 rounded-lg border border-border bg-muted/50 px-6 py-4 text-center">
                <Database className="h-6 w-6 text-accent" />
                <span className="text-sm font-medium text-foreground">
                  SQLite / DB
                </span>
                <span className="text-[10px] text-muted-foreground">
                  SQLAlchemy ORM
                </span>
              </div>
            </div>

            {/* Second row: integration libraries */}
            <div className="mt-6 flex flex-col items-center gap-3 lg:flex-row lg:justify-center lg:gap-4">
              <div className="flex flex-col items-center gap-2 rounded-lg border border-border bg-muted/50 px-4 py-3 text-center">
                <Map className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                <span className="text-xs font-medium text-foreground">Mapbox GL</span>
                <span className="text-[10px] text-muted-foreground">Spatial layer</span>
              </div>
              <div className="flex flex-col items-center gap-2 rounded-lg border border-border bg-muted/50 px-4 py-3 text-center">
                <GitBranch className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
                <span className="text-xs font-medium text-foreground">D3.js</span>
                <span className="text-[10px] text-muted-foreground">Graph engine</span>
              </div>
              <div className="flex flex-col items-center gap-2 rounded-lg border border-border bg-muted/50 px-4 py-3 text-center">
                <Clock className="h-5 w-5 text-amber-500 dark:text-amber-400" />
                <span className="text-xs font-medium text-foreground">Temporal Engine</span>
                <span className="text-[10px] text-muted-foreground">Century slices + playback</span>
              </div>
              <div className="flex flex-col items-center gap-2 rounded-lg border border-border bg-muted/50 px-4 py-3 text-center">
                <Layers className="h-5 w-5 text-violet-500 dark:text-violet-400" />
                <span className="text-xs font-medium text-foreground">Dual-Mode Client</span>
                <span className="text-[10px] text-muted-foreground">Flask API + static fallback</span>
              </div>
            </div>
          </div>
        </section>

        {/* Data Model */}
        <section className="mb-16">
          <h2 className="mb-6 text-lg font-semibold text-foreground">
            Data Model
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DATA_MODEL_ENTITIES.map((model) => (
              <div
                key={model.name}
                className="rounded-xl border border-border bg-card p-5"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">
                    {model.name}
                  </h3>
                  <span className="rounded-md bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">
                    {model.count}
                  </span>
                </div>
                <p className="mb-3 mt-1 text-xs text-muted-foreground">
                  {model.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {model.fields.map((field) => (
                    <span
                      key={field}
                      className="rounded-md bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
                    >
                      {field}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tech stack */}
        <section className="mb-16">
          <h2 className="mb-6 text-lg font-semibold text-foreground">
            Technology Stack
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TECH_STACK.map((tech) => {
              const Icon = tech.icon
              return (
                <div
                  key={tech.label}
                  className="rounded-xl border border-border bg-card p-5"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent/10">
                      <Icon className="h-4 w-4 text-accent" />
                    </div>
                    <h3 className="font-semibold text-foreground">
                      {tech.label}
                    </h3>
                  </div>
                  <ul className="space-y-1.5">
                    {tech.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2 text-xs text-muted-foreground"
                      >
                        <span className="h-1 w-1 shrink-0 rounded-full bg-accent/50" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </section>

        {/* Temporal Filtering Logic */}
        <section className="mb-16">
          <h2 className="mb-6 text-lg font-semibold text-foreground">
            Temporal Filtering Logic
          </h2>
          <div className="rounded-xl border border-border bg-card p-6 lg:p-8">
            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <h3 className="mb-3 text-sm font-semibold text-foreground">
                  How It Works
                </h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    The timeline slider allows year-by-year selection (smooth
                    scrolling), but the underlying dataset filters in 100-year
                    windows to maintain manageable data scope.
                  </p>
                  <p>
                    When a user selects year 847, the system internally
                    queries entities active during the 800-899 century window.
                    The UI clearly indicates both the selected year and the
                    active data range.
                  </p>
                </div>
              </div>
              <div className="rounded-lg border border-border bg-muted/50 p-4">
                <h3 className="mb-3 text-sm font-semibold text-foreground">
                  Example
                </h3>
                <div className="space-y-2 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">User selects:</span>
                    <span className="font-medium text-foreground">Year 847</span>
                  </div>
                  <div className="h-px bg-border" />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Century snap:</span>
                    <span className="font-medium text-foreground">800 - 899</span>
                  </div>
                  <div className="h-px bg-border" />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Label:</span>
                    <span className="font-medium text-accent">
                      {"800\u2013899 (9th Century)"}
                    </span>
                  </div>
                  <div className="h-px bg-border" />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Entities:</span>
                    <span className="font-medium text-foreground">
                      startYear {"<="} 899 AND endYear {">="} 800
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Evaluation */}
        <section className="mb-16">
          <h2 className="mb-6 text-lg font-semibold text-foreground">
            Evaluation Focus
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {EVALUATION_AREAS.map((area) => (
              <div
                key={area.title}
                className="rounded-xl border border-border bg-card p-5"
              >
                <h3 className="mb-2 font-semibold text-foreground">
                  {area.title}
                </h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {area.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-4 py-6">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 text-sm text-muted-foreground sm:flex-row">
          <span>
            Designed and Developed by Saud Najem S. Alnajem - Software
            Engineering (SWE)
          </span>
          <span className="text-xs">CSC3094 Final-Year Dissertation Project</span>
        </div>
      </footer>
    </div>
  )
}
