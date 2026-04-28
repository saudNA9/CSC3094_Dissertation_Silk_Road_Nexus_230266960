/*
 * app/traveller/page.tsx
 * Traveller Mode listing page — browse historical Silk Road travellers.
 * It will:
 * - Display all available historical travellers (Marco Polo, Ibn Battuta, Xuanzang, etc.)
 * - Show each traveller's origin, active years, and total route distance
 * - Link to the individual traveller detail page for route exploration
 */

"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, MapPin, Clock, Route, Globe } from "lucide-react"
import { TRAVELLERS, type Traveller } from "@/lib/traveller-data"
import { TopNav } from "@/components/top-nav"
import { Button } from "@/components/ui/button"

/* Decorative Silk Road divider - same as landing page */
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

/* Geometric pattern - consistent with landing page */
function GeometricPattern() {
  return (
    <svg className="absolute inset-0 h-full w-full opacity-[0.03]" viewBox="0 0 100 100">
      <pattern id="traveller-pattern" x="0" y="0" width="25" height="25" patternUnits="userSpaceOnUse">
        <path d="M12.5 0 L15 5 L20 5 L16 8 L17.5 13 L12.5 10 L7.5 13 L9 8 L5 5 L10 5 Z" 
          fill="none" stroke="currentColor" strokeWidth="0.5" className="text-accent" />
      </pattern>
      <rect width="100%" height="100%" fill="url(#traveller-pattern)" />
    </svg>
  )
}

/* Get image position based on traveller - each portrait has face in different location */
function getImagePosition(travellerId: string): string {
  switch (travellerId) {
    case "xuanzang":
      return "object-[center_45%]" // Face is in lower portion
    case "marco-polo":
      return "object-top" // Face is at top
    case "ibn-battuta":
      return "object-top" // Face is at top
    default:
      return "object-center"
  }
}

/* Traveller Card with platform-consistent styling */
function TravellerCard({ traveller, index }: { traveller: Traveller; index: number }) {
  const isEven = index % 2 === 0
  const imagePosition = getImagePosition(traveller.id)

  return (
    <div className={`group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-lg transition-all hover:shadow-xl hover:shadow-accent/5 lg:flex-row ${!isEven ? "lg:flex-row-reverse" : ""}`}>
      {/* Image side */}
      <div className="relative h-80 w-full lg:h-auto lg:w-2/5">
        {/* Decorative frame */}
        <div className="absolute inset-4 z-10 rounded-lg border border-accent/20" />
        <Image
          src={traveller.image}
          alt={`Portrait of ${traveller.name}`}
          fill
          className={`object-cover transition-transform duration-700 group-hover:scale-105 ${imagePosition}`}
        />
        {/* Subtle gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-${isEven ? "r" : "l"} from-transparent via-transparent to-card/80 hidden lg:block`} />
        <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent lg:hidden" />
        
        {/* Floating period badge */}
        <div className="absolute left-6 top-6 z-20 rounded-full border border-accent/30 bg-card/90 px-4 py-2 backdrop-blur-sm">
          <span className="text-sm font-semibold text-accent">{traveller.period}</span>
        </div>
      </div>
      
      {/* Content side */}
      <div className="relative flex w-full flex-col justify-center p-8 lg:w-3/5 lg:p-12">
        <GeometricPattern />
        
        <div className="relative z-10">
          {/* Subtitle */}
          <span className="mb-2 inline-block text-xs font-semibold uppercase tracking-widest text-accent">
            {traveller.subtitle}
          </span>
          
          {/* Name */}
          <h2 className="mb-2 text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
            {traveller.name}
          </h2>
          
          {/* Title */}
          <p className="mb-4 text-lg font-medium text-muted-foreground">
            {traveller.title}
          </p>
          
          <SilkRoadDivider className="my-6" />
          
          {/* Description */}
          <p className="mb-8 leading-relaxed text-muted-foreground">
            {traveller.shortDescription}
          </p>
          
          {/* Stats row */}
          <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <Route className="mb-1 h-4 w-4 text-accent" />
              <div className="text-lg font-bold text-foreground">{traveller.totalDistance}</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Distance</div>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <Clock className="mb-1 h-4 w-4 text-accent" />
              <div className="text-lg font-bold text-foreground">{traveller.totalDuration}</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Duration</div>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <MapPin className="mb-1 h-4 w-4 text-accent" />
              <div className="text-lg font-bold text-foreground">{traveller.stops.length}</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Key Stops</div>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <Globe className="mb-1 h-4 w-4 text-accent" />
              <div className="text-lg font-bold text-foreground">{traveller.regionsVisited.length}</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Regions</div>
            </div>
          </div>
          
          {/* Route info */}
          <div className="mb-8 flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              {traveller.origin}
            </span>
            <ArrowRight className="h-4 w-4 text-accent" />
            <span className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-red-500" />
              {traveller.destination}
            </span>
          </div>
          
          {/* CTA */}
          <Link href={`/traveller/${traveller.id}`}>
            <Button className="gap-2 bg-accent px-8 py-6 text-base font-semibold text-accent-foreground transition-all duration-300 hover:bg-accent/90">
              {traveller.ctaLabel}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function TravellerPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopNav />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-card to-background py-20">
        <GeometricPattern />
        
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-widest text-accent">
            Immersive Historical Journeys
          </span>
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Walk in the Footsteps of{" "}
            <span className="text-accent">
              Legendary Travellers
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Experience the Silk Road through the eyes of history&apos;s greatest explorers. 
            Follow their journeys, discover their stories, and understand the world they traversed.
          </p>
          <SilkRoadDivider className="mx-auto mt-8 max-w-xs" />
        </div>
      </section>
      
      {/* Traveller Cards */}
      <section className="relative py-16">
        <div className="mx-auto max-w-6xl space-y-12 px-6">
          {TRAVELLERS.map((traveller, index) => (
            <TravellerCard key={traveller.id} traveller={traveller} index={index} />
          ))}
        </div>
      </section>
      
      {/* Footer note */}
      <section className="border-t border-border bg-muted/30 py-12">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="text-sm text-muted-foreground">
            Each journey is carefully built from historical sources including first-hand accounts,
            archaeological evidence, and scholarly research. Experience history as it was lived.
          </p>
        </div>
      </section>
    </div>
  )
}
