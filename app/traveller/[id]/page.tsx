"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Clock,
  Compass,
  BookOpen,
  Users,
  Mountain,
  Globe,
  Scroll,
  ChevronDown,
  ChevronUp,
  Map,
  GitBranch,
  Package,
  Calendar,
  Quote,
  X,
  Trophy,
} from "lucide-react"
import { getTravellerById, type Traveller, type JourneyStop, type TravellerInsight, TRAVELLERS } from "@/lib/traveller-data"
import { TopNav } from "@/components/top-nav"
import { Button } from "@/components/ui/button"

/* Icon mapping for insights */
const INSIGHT_ICONS = {
  scroll: Scroll,
  compass: Compass,
  mountain: Mountain,
  users: Users,
  book: BookOpen,
  globe: Globe,
}

/* Silk Road Divider - consistent with landing page */
function SilkRoadDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
      <svg width="24" height="12" viewBox="0 0 24 12" className="text-accent">
        <path d="M0 6 L6 0 L12 6 L6 12 Z" fill="currentColor" fillOpacity="0.3" />
        <path d="M12 6 L18 0 L24 6 L18 12 Z" fill="currentColor" fillOpacity="0.3" />
      </svg>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
    </div>
  )
}

/* Pattern background - subtle geometric like landing page */
function GeometricPattern() {
  return (
    <svg className="absolute inset-0 h-full w-full opacity-[0.03]" viewBox="0 0 100 100">
      <pattern id="journey-pattern" x="0" y="0" width="25" height="25" patternUnits="userSpaceOnUse">
        <path d="M12.5 0 L15 5 L20 5 L16 8 L17.5 13 L12.5 10 L7.5 13 L9 8 L5 5 L10 5 Z"
          fill="none" stroke="currentColor" strokeWidth="0.5" className="text-accent" />
      </pattern>
      <rect width="100%" height="100%" fill="url(#journey-pattern)" />
    </svg>
  )
}

/* Progress bar component */
function JourneyProgressBar({
  stops,
  currentIndex,
  onSelectStop,
}: {
  stops: JourneyStop[]
  currentIndex: number
  onSelectStop: (index: number) => void
}) {
  const progress = ((currentIndex + 1) / stops.length) * 100

  return (
    <div className="sticky top-14 z-40 border-b border-border bg-card/95 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-6 py-4">
        {/* Progress bar */}
        <div className="relative mb-4 h-1 overflow-hidden rounded-full bg-muted">
          <div
            className="absolute left-0 top-0 h-full bg-accent transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Stop indicators */}
        <div className="flex items-center justify-between gap-1">
          {stops.map((stop, idx) => {
            const isActive = idx === currentIndex
            const isPast = idx < currentIndex
            return (
              <button
                key={stop.id}
                onClick={() => onSelectStop(idx)}
                className="group flex flex-1 flex-col items-center"
              >
                <div
                  className={`h-3 w-3 rounded-full border-2 transition-all ${
                    isActive
                      ? "border-accent bg-accent shadow-lg"
                      : isPast
                      ? "border-accent/50 bg-accent/50"
                      : "border-muted-foreground/30 bg-transparent hover:border-accent/60"
                  }`}
                />
                <span className={`mt-1 hidden text-[9px] font-medium sm:block ${isActive ? "text-accent" : "text-muted-foreground"}`}>
                  {stop.cityName}
                </span>
              </button>
            )
          })}
        </div>

        {/* Current stop info */}
        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="font-medium text-accent">
            {stops[currentIndex].cityName}
          </span>
          <span className="text-muted-foreground">
            {stops[currentIndex].year} • Stop {currentIndex + 1} of {stops.length}
          </span>
        </div>
      </div>
    </div>
  )
}

/* Journey step card */
function JourneyStepCard({
  stop,
  index,
  isExpanded,
  onToggle,
  traveller,
}: {
  stop: JourneyStop
  index: number
  isExpanded: boolean
  onToggle: () => void
  traveller: Traveller
}) {
  return (
    <div className="relative">
      {/* Timeline connector */}
      {index > 0 && (
        <div className="absolute left-6 top-0 h-8 w-px -translate-y-full bg-gradient-to-b from-transparent to-accent/30" />
      )}

      <div
        className={`rounded-xl border bg-card transition-all duration-300 ${
          isExpanded ? "border-accent/30 shadow-lg shadow-accent/5" : "border-border hover:border-accent/20"
        }`}
      >
        {/* Header - always visible */}
        <button
          onClick={onToggle}
          className="flex w-full items-start gap-4 p-6 text-left"
        >
          {/* Step number */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-accent bg-accent/10 text-lg font-bold text-accent">
            {index + 1}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-foreground">{stop.cityName}</h3>
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                {stop.year}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{stop.region}</p>

            {/* Duration badge */}
            <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-accent" />
                {stop.duration}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-accent" />
                {stop.region}
              </span>
            </div>
          </div>

          <div className="text-muted-foreground">
            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </div>
        </button>

        {/* Expanded content */}
        {isExpanded && (
          <div className="border-t border-border px-6 pb-6 pt-4">
            {/* Quote/Narrative */}
            <div className="mb-6 rounded-lg bg-accent/5 p-4">
              <Quote className="mb-2 h-5 w-5 text-accent/50" />
              <p className="italic text-foreground/80">{stop.narrative}</p>
            </div>

            {/* Historical context */}
            <p className="mb-6 text-sm leading-relaxed text-muted-foreground">{stop.historicalContext}</p>

            {/* Related entities grid */}
            <div className="grid gap-4 sm:grid-cols-3">
              {/* Events */}
              {stop.events && stop.events.length > 0 && (
                <div className="rounded-lg border border-border bg-muted/30 p-3">
                  <h4 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5 text-accent" />
                    Events Witnessed
                  </h4>
                  <ul className="space-y-1">
                    {stop.events.map((event, i) => (
                      <li key={i} className="text-sm text-foreground">{event}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Goods */}
              {stop.goodsTraded && stop.goodsTraded.length > 0 && (
                <div className="rounded-lg border border-border bg-muted/30 p-3">
                  <h4 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <Package className="h-3.5 w-3.5 text-accent" />
                    Goods Observed
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {stop.goodsTraded.map((good, i) => (
                      <span key={i} className="rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent">
                        {good}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* People */}
              {stop.peopleEncountered && stop.peopleEncountered.length > 0 && (
                <div className="rounded-lg border border-border bg-muted/30 p-3">
                  <h4 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <Users className="h-3.5 w-3.5 text-accent" />
                    People Met
                  </h4>
                  <ul className="space-y-1">
                    {stop.peopleEncountered.map((person, i) => (
                      <li key={i} className="text-sm text-foreground">{person}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Cross-view links */}
            <div className="mt-6 flex gap-2">
              <Link href={`/explore?city=${encodeURIComponent(stop.cityName)}`}>
                <Button variant="outline" size="sm" className="gap-2 border-accent/30 text-accent hover:bg-accent/10">
                  <Map className="h-4 w-4" />
                  View on Map
                </Button>
              </Link>
              <Link href={`/graph?entity=${encodeURIComponent(stop.cityName)}`}>
                <Button variant="outline" size="sm" className="gap-2 border-accent/30 text-accent hover:bg-accent/10">
                  <GitBranch className="h-4 w-4" />
                  Explore Connections
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* Insight card */
function InsightCard({ insight }: { insight: TravellerInsight }) {
  const Icon = INSIGHT_ICONS[insight.icon as keyof typeof INSIGHT_ICONS] || Scroll

  return (
    <div className="rounded-xl border border-border bg-card p-5 transition-all hover:border-accent/30 hover:shadow-md">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
        <Icon className="h-5 w-5 text-accent" />
      </div>
      <h4 className="mb-2 font-semibold text-foreground">{insight.title}</h4>
      <p className="text-sm leading-relaxed text-muted-foreground">{insight.description}</p>
    </div>
  )
}

/* Journey Completion Modal Component */
function JourneyCompletionModal({ traveller, onClose }: { traveller: Traveller; onClose: () => void }) {
  const router = useRouter()

  // Get other travellers dynamically from the TRAVELLERS array
  const relatedTravellers = TRAVELLERS
    .filter(t => t.id !== traveller.id)
    .slice(0, 2)
    .map(t => ({
      id: t.id,
      name: t.name,
      journey: `${t.origin} to ${t.destination}`,
      overlap: t.totalDuration,
    }))

  const suggestedCities = traveller.stops.slice(0, 3).map(stop => ({
    name: stop.cityName,
    region: stop.region,
  }))

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-accent/30 bg-card shadow-2xl animate-in fade-in zoom-in-95 duration-300">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-accent transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Completion Content */}
          <div className="space-y-8 p-8">
            {/* Celebration header */}
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <Trophy className="h-16 w-16 text-accent animate-bounce" />
              </div>

              <h2 className="text-4xl font-bold bg-gradient-to-r from-accent via-accent/80 to-accent/60 bg-clip-text text-transparent">
                Journey Complete!
              </h2>

              <p className="text-lg text-muted-foreground">
                You&apos;ve followed {traveller.name} across {traveller.stops.length} extraordinary stops through history.
              </p>
            </div>

            {/* Journey Summary */}
            <div className="grid grid-cols-3 gap-4 rounded-lg border border-border bg-muted/50 p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{traveller.totalDistance}</div>
                <div className="text-xs text-muted-foreground">Distance Traveled</div>
              </div>
              <div className="text-center border-x border-border">
                <div className="text-2xl font-bold text-accent">{traveller.totalDuration}</div>
                <div className="text-xs text-muted-foreground">Years of Journey</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{traveller.stops.length}</div>
                <div className="text-xs text-muted-foreground">Stops Explored</div>
              </div>
            </div>

            {/* What You Discovered */}
            <div className="space-y-3">
              <h3 className="font-semibold text-accent">What You Discovered</h3>
              <div className="grid gap-2">
                {suggestedCities.map((city) => (
                  <div key={city.name} className="flex items-center gap-2 text-sm rounded-lg border border-border/50 bg-background/50 p-3">
                    <MapPin className="h-4 w-4 text-accent/60 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-foreground">{city.name}</div>
                      <div className="text-xs text-muted-foreground">{city.region}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Related Explorations */}
            <div className="space-y-3 border-t border-border pt-6">
              <h3 className="font-semibold text-accent">Keep Exploring</h3>
              <p className="text-sm text-muted-foreground">Challenge yourself with another traveller&apos;s journey:</p>

              <div className="space-y-2">
                {relatedTravellers.map((related) => (
                  <button
                    key={related.id}
                    onClick={() => {
                      onClose()
                      router.push(`/traveller/${related.id}`)
                    }}
                    className="w-full text-left rounded-lg border border-border/50 bg-background/50 hover:bg-accent/10 hover:border-accent/50 transition-colors p-3 group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-foreground group-hover:text-accent transition-colors">{related.name}</div>
                        <div className="text-xs text-muted-foreground">{related.journey}</div>
                        <div className="text-xs text-accent/60">{related.overlap}</div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-4 border-t border-border">
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1"
              >
                Continue Exploring
              </Button>
              <Button
                onClick={() => router.push("/traveller")}
                className="flex-1 bg-accent hover:bg-accent/90 text-foreground"
              >
                Browse All Travelers
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default function JourneyPage() {
  const params = useParams()
  const router = useRouter()
  const [traveller, setTraveller] = useState<Traveller | null>(null)
  const [currentStopIndex, setCurrentStopIndex] = useState(0)
  const [expandedStops, setExpandedStops] = useState<Set<number>>(new Set([0]))
  const [showCompletion, setShowCompletion] = useState(false)
  const [hasViewedCompletion, setHasViewedCompletion] = useState(false)

  useEffect(() => {
    const id = params.id as string
    const found = getTravellerById(id)
    if (found) {
      setTraveller(found)
    } else {
      router.push("/traveller")
    }
  }, [params.id, router])

  // Show completion modal when user reaches the final stop
  useEffect(() => {
    if (traveller && currentStopIndex === traveller.stops.length - 1 && !hasViewedCompletion) {
      const timer = setTimeout(() => {
        setShowCompletion(true)
        setHasViewedCompletion(true)
      }, 800) // Delay slightly for dramatic effect
      return () => clearTimeout(timer)
    }
  }, [currentStopIndex, traveller, hasViewedCompletion])

  if (!traveller) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    )
  }

  const toggleStop = (index: number) => {
    setExpandedStops((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
    setCurrentStopIndex(index)
  }

  const goToStop = (index: number) => {
    setCurrentStopIndex(index)
    setExpandedStops((prev) => new Set([...prev, index]))
    // Scroll to the stop
    const element = document.getElementById(`stop-${index}`)
    element?.scrollIntoView({ behavior: "smooth", block: "center" })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Journey Completion Modal */}
      {showCompletion && (
        <JourneyCompletionModal
          traveller={traveller}
          onClose={() => setShowCompletion(false)}
        />
      )}

      <TopNav />

      {/* Hero section with traveller portrait - FULL WIDTH */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-card to-background">
        <GeometricPattern />

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-12">
          <Link
            href="/traveller"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Travellers
          </Link>

          {/* Centered portrait section */}
          <div className="flex flex-col items-center gap-12">
            {/* Circular Portrait - CENTERED */}
            <div className="relative mx-auto flex justify-center">
              {/* Outer decorative ring */}
              <div className="absolute -inset-4 rounded-full border-2 border-accent/20" />
              <div className="absolute -inset-2 rounded-full border border-accent/10" />

              {/* Circular portrait */}
              <div className="relative h-64 w-64 overflow-hidden rounded-full border-4 border-accent/30 shadow-2xl shadow-accent/20 sm:h-80 sm:w-80">
                <Image
                  src={traveller.image}
                  alt={traveller.name}
                  fill
                  className={`object-cover ${traveller.id === "xuanzang" ? "object-[center_45%]" : "object-top"}`}
                  priority
                />
              </div>

              {/* Decorative corner elements */}
              <div className="absolute -left-8 top-1/2 h-16 w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-accent/40 to-transparent" />
              <div className="absolute -right-8 top-1/2 h-16 w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-accent/40 to-transparent" />
              <div className="absolute left-1/2 -top-8 h-px w-16 -translate-x-1/2 bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
              <div className="absolute left-1/2 -bottom-8 h-px w-16 -translate-x-1/2 bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
            </div>

            {/* Info - CENTERED BELOW PORTRAIT */}
            <div className="max-w-2xl text-center">
              <span className="mb-3 inline-block rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                {traveller.period}
              </span>
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                {traveller.name}
              </h1>
              <p className="mt-2 text-xl text-muted-foreground">{traveller.subtitle}</p>
              
              <SilkRoadDivider className="my-6" />
              
              <p className="text-lg leading-relaxed text-muted-foreground">
                {traveller.fullDescription}
              </p>
              
              {/* Journey stats */}
              <div className="mt-8 grid grid-cols-3 gap-4">
                <div className="rounded-lg border border-border bg-muted/30 p-4 text-center">
                  <div className="text-2xl font-bold text-accent">{traveller.totalDistance}</div>
                  <div className="mt-1 text-xs text-muted-foreground">Distance</div>
                </div>
                <div className="rounded-lg border border-border bg-muted/30 p-4 text-center">
                  <div className="text-2xl font-bold text-accent">{traveller.totalDuration}</div>
                  <div className="mt-1 text-xs text-muted-foreground">Duration</div>
                </div>
                <div className="rounded-lg border border-border bg-muted/30 p-4 text-center">
                  <div className="text-2xl font-bold text-accent">{traveller.stops.length}</div>
                  <div className="mt-1 text-xs text-muted-foreground">Key Stops</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Progress bar */}
      <JourneyProgressBar
        stops={traveller.stops}
        currentIndex={currentStopIndex}
        onSelectStop={goToStop}
      />
      
      {/* Journey timeline */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold text-foreground">The Journey</h2>
            <p className="mt-2 text-muted-foreground">Follow the path through history</p>
          </div>
          
          <div className="space-y-6">
            {traveller.stops.map((stop, index) => (
              <div key={stop.id} id={`stop-${index}`}>
                <JourneyStepCard
                  stop={stop}
                  index={index}
                  isExpanded={expandedStops.has(index)}
                  onToggle={() => toggleStop(index)}
                  traveller={traveller}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Journey Themes & Regions */}
      <section className="border-t border-border bg-muted/30 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Journey Themes */}
            <div>
              <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold text-foreground">
                <BookOpen className="h-5 w-5 text-accent" />
                Journey Themes
              </h3>
              <div className="flex flex-wrap gap-2">
                {traveller.keyThemes.map((theme, index) => (
                  <span
                    key={index}
                    className="rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-sm font-medium text-accent"
                  >
                    {theme}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Regions Visited */}
            <div>
              <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold text-foreground">
                <Globe className="h-5 w-5 text-accent" />
                Regions Visited
              </h3>
              <div className="flex flex-wrap gap-2">
                {traveller.regionsVisited.map((region, index) => (
                  <span
                    key={index}
                    className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground"
                  >
                    {region}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Insights section */}
      <section className="border-t border-border bg-card py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-accent">
              Key Insights
            </span>
            <h2 className="text-2xl font-bold text-foreground">What We Learn</h2>
            <SilkRoadDivider className="mx-auto mt-4 max-w-xs" />
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {traveller.insights.map((insight, index) => (
              <InsightCard key={index} insight={insight} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Navigation to other travellers */}
      <section className="border-t border-border py-12">
        <div className="mx-auto max-w-4xl px-6">
          <div className="flex items-center justify-between">
            <Link href="/traveller">
              <Button variant="outline" className="gap-2 border-accent/30 text-accent hover:bg-accent/10">
                <ArrowLeft className="h-4 w-4" />
                All Travellers
              </Button>
            </Link>
            <Link href="/explore">
              <Button className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
                Explore the Silk Road
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
