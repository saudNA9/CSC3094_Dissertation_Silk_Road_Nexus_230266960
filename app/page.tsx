"use client"

import Link from "next/link"
import Image from "next/image"
import { Clock, ArrowRight, Globe2, GitBranch, Map, Network, Calendar, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { TopNav } from "@/components/top-nav"

const CAPABILITIES = [
  {
    icon: Map,
    title: "Spatial Exploration",
    description:
      "Navigate historic trade routes spanning from Constantinople to Chang'an with interactive Mapbox-powered maps.",
    accent: "#C6A75E",
  },
  {
    icon: Clock,
    title: "Temporal Analysis",
    description:
      "Filter across 1,800 years of history. Watch networks evolve from the Han Dynasty through the Mongol Empire.",
    accent: "#B8860B",
  },
  {
    icon: GitBranch,
    title: "Semantic Networks",
    description:
      "Visualize connections between cities, goods, and events through force-directed and hierarchical graph layouts.",
    accent: "#8B7355",
  },
]

// Silk Road traded goods with icons
const TRADED_GOODS = [
  { name: "Silk", origin: "China", icon: "silk" },
  { name: "Spices", origin: "India", icon: "spice" },
  { name: "Porcelain", origin: "China", icon: "porcelain" },
  { name: "Gold", origin: "Persia", icon: "gold" },
  { name: "Incense", origin: "Arabia", icon: "incense" },
  { name: "Paper", origin: "Samarkand", icon: "paper" },
  { name: "Gems", origin: "India & Persia", icon: "gems" },
  { name: "Textiles", origin: "Byzantium", icon: "textiles" },
  { name: "Glass", origin: "Rome & Syria", icon: "glass" },
]

// Silk Road traded goods with real images for Artistry section
const TRADED_GOODS_IMAGES = [
  {
    name: "Persian Carpets",
    origin: "Persia & Central Asia",
    image: "/images/persian-rug.jpg",
    description: "Intricate weavings that carried artistic traditions across continents"
  },
  {
    name: "Porcelain",
    origin: "China",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-hiuAlJ4rODh0kz4kn2n5Hs2Dhqbawr.png",
    description: "Delicate ceramics prized from Baghdad to Rome"
  },
  {
    name: "Paper & Manuscripts",
    origin: "Samarkand",
    image: "/images/manuscript-paper.jpg",
    description: "Knowledge and writing spreading along the routes"
  },
]

// Persian Rug Pattern - Intricate geometric border
function PersianRugBorder({ className = "" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <svg className="w-full h-8" viewBox="0 0 1200 32" preserveAspectRatio="none">
        <defs>
          <pattern id="rug-pattern" x="0" y="0" width="80" height="32" patternUnits="userSpaceOnUse">
            {/* Main diamond chain */}
            <path d="M40 4 L52 16 L40 28 L28 16 Z" fill="none" stroke="#C6A75E" strokeWidth="1.5" />
            <path d="M40 8 L48 16 L40 24 L32 16 Z" fill="#C6A75E" opacity="0.15" />
            {/* Corner florettes */}
            <circle cx="16" cy="16" r="4" fill="none" stroke="#B8860B" strokeWidth="1" opacity="0.6" />
            <circle cx="64" cy="16" r="4" fill="none" stroke="#B8860B" strokeWidth="1" opacity="0.6" />
            {/* Small accent diamonds */}
            <path d="M8 16 L12 12 L16 16 L12 20 Z" fill="#C6A75E" opacity="0.3" />
            <path d="M64 16 L68 12 L72 16 L68 20 Z" fill="#C6A75E" opacity="0.3" />
            {/* Connecting lines */}
            <line x1="0" y1="16" x2="8" y2="16" stroke="#C6A75E" strokeWidth="1" opacity="0.4" />
            <line x1="72" y1="16" x2="80" y2="16" stroke="#C6A75E" strokeWidth="1" opacity="0.4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#rug-pattern)" />
      </svg>
    </div>
  )
}

// Persian Rug Corner Medallion
function RugCornerMedallion({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const positions = {
    tl: "top-4 left-4",
    tr: "top-4 right-4 scale-x-[-1]",
    bl: "bottom-4 left-4 scale-y-[-1]",
    br: "bottom-4 right-4 scale-[-1]",
  }

  return (
    <div className={`absolute ${positions[position]} pointer-events-none opacity-40`}>
      <svg width="80" height="80" viewBox="0 0 80 80" className="text-accent">
        {/* Outer octagonal frame */}
        <path
          d="M20 5 L60 5 L75 20 L75 60 L60 75 L20 75 L5 60 L5 20 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.5"
        />
        {/* Inner star pattern */}
        <path
          d="M40 15 L45 30 L60 30 L48 40 L53 55 L40 45 L27 55 L32 40 L20 30 L35 30 Z"
          fill="currentColor"
          opacity="0.1"
        />
        <path
          d="M40 15 L45 30 L60 30 L48 40 L53 55 L40 45 L27 55 L32 40 L20 30 L35 30 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          opacity="0.6"
        />
        {/* Central rosette */}
        <circle cx="40" cy="40" r="8" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
        <circle cx="40" cy="40" r="4" fill="currentColor" opacity="0.2" />
      </svg>
    </div>
  )
}

// Silk Fabric Texture Pattern
function SilkTextureOverlay() {
  return (
    <div
      className="absolute inset-0 opacity-[0.03] pointer-events-none"
      style={{
        backgroundImage: `repeating-linear-gradient(
          45deg,
          transparent,
          transparent 2px,
          currentColor 2px,
          currentColor 3px
        )`,
      }}
    />
  )
}

// Islamic Geometric Star Pattern (more intricate)
function IslamicStarPattern() {
  return (
    <svg className="absolute inset-0 h-full w-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="islamic-complex" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
          {/* 12-pointed star */}
          <g fill="none" stroke="currentColor" strokeWidth="0.5">
            {/* Outer dodecagon */}
            <path d="M60 10 L80 20 L95 40 L95 70 L80 90 L60 100 L40 90 L25 70 L25 40 L40 20 Z" />
            {/* 6-pointed star overlay */}
            <path d="M60 15 L75 50 L105 55 L75 70 L60 105 L45 70 L15 55 L45 50 Z" />
            {/* Inner hexagon */}
            <path d="M60 35 L75 45 L75 65 L60 75 L45 65 L45 45 Z" />
            {/* Central flower */}
            <circle cx="60" cy="60" r="10" />
            <circle cx="60" cy="60" r="5" />
          </g>
          {/* Corner connections */}
          <circle cx="0" cy="0" r="15" fill="none" stroke="currentColor" strokeWidth="0.3" />
          <circle cx="120" cy="0" r="15" fill="none" stroke="currentColor" strokeWidth="0.3" />
          <circle cx="0" cy="120" r="15" fill="none" stroke="currentColor" strokeWidth="0.3" />
          <circle cx="120" cy="120" r="15" fill="none" stroke="currentColor" strokeWidth="0.3" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#islamic-complex)" className="text-accent" />
    </svg>
  )
}

// Arabic/Persian Calligraphy-style Inscription Banner
function InscriptionBanner({ text }: { text: string }) {
  return (
    <div className="relative mx-auto max-w-md">
      {/* Decorative frame */}
      <div className="absolute -left-8 top-1/2 -translate-y-1/2">
        <svg width="24" height="60" viewBox="0 0 24 60" className="text-accent">
          <path d="M12 0 L24 10 L24 50 L12 60 L0 50 L0 10 Z" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4" />
          <path d="M12 10 L18 15 L18 45 L12 50 L6 45 L6 15 Z" fill="currentColor" opacity="0.1" />
        </svg>
      </div>
      <div className="absolute -right-8 top-1/2 -translate-y-1/2 scale-x-[-1]">
        <svg width="24" height="60" viewBox="0 0 24 60" className="text-accent">
          <path d="M12 0 L24 10 L24 50 L12 60 L0 50 L0 10 Z" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4" />
          <path d="M12 10 L18 15 L18 45 L12 50 L6 45 L6 15 Z" fill="currentColor" opacity="0.1" />
        </svg>
      </div>

      <div className="border-y border-accent/20 bg-accent/5 px-12 py-3 text-center">
        <span className="text-sm font-medium tracking-[0.2em] text-accent uppercase">{text}</span>
      </div>
    </div>
  )
}

// Traded Goods Icon Component
function GoodsIcon({ type }: { type: string }) {
  switch (type) {
    case "silk":
      return (
        <svg viewBox="0 0 40 40" className="h-12 w-12">
          <path d="M8 20 Q20 5, 32 20 Q20 35, 8 20" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M12 20 Q20 10, 28 20 Q20 30, 12 20" fill="currentColor" opacity="0.2" />
          <path d="M16 20 Q20 15, 24 20 Q20 25, 16 20" fill="currentColor" opacity="0.3" />
        </svg>
      )
    case "spice":
      return (
        <svg viewBox="0 0 40 40" className="h-12 w-12">
          <circle cx="20" cy="12" r="4" fill="currentColor" opacity="0.6" />
          <circle cx="12" cy="22" r="3" fill="currentColor" opacity="0.5" />
          <circle cx="28" cy="22" r="3" fill="currentColor" opacity="0.5" />
          <circle cx="16" cy="30" r="3.5" fill="currentColor" opacity="0.4" />
          <circle cx="24" cy="30" r="3.5" fill="currentColor" opacity="0.4" />
        </svg>
      )
    case "porcelain":
      return (
        <svg viewBox="0 0 40 40" className="h-12 w-12">
          <path d="M15 8 Q10 20, 12 32 L28 32 Q30 20, 25 8 Z" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1" />
          <ellipse cx="20" cy="8" rx="5" ry="2" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M16 18 Q20 15, 24 18" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
          <path d="M16 24 Q20 21, 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
        </svg>
      )
    case "gold":
      return (
        <svg viewBox="0 0 40 40" className="h-12 w-12">
          <circle cx="20" cy="20" r="12" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="20" cy="20" r="8" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <path d="M20 12 L20 28 M12 20 L28 20" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
        </svg>
      )
    case "incense":
      return (
        <svg viewBox="0 0 40 40" className="h-12 w-12">
          <path d="M20 32 L20 18" stroke="currentColor" strokeWidth="2" />
          <path d="M20 18 Q18 14, 20 10 Q22 6, 20 2" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6" />
          <path d="M18 16 Q16 12, 18 8" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
          <path d="M22 16 Q24 12, 22 8" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
          <ellipse cx="20" cy="34" rx="6" ry="2" fill="currentColor" opacity="0.3" />
        </svg>
      )
    case "paper":
      return (
        <svg viewBox="0 0 40 40" className="h-12 w-12">
          <rect x="10" y="8" width="20" height="26" rx="1" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1" />
          <line x1="14" y1="14" x2="26" y2="14" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
          <line x1="14" y1="18" x2="26" y2="18" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
          <line x1="14" y1="22" x2="24" y2="22" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
          <line x1="14" y1="26" x2="22" y2="26" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
        </svg>
      )
    case "gems":
      return (
        <svg viewBox="0 0 40 40" className="h-12 w-12">
          <polygon points="20,6 30,16 26,34 14,34 10,16" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1" />
          <line x1="20" y1="6" x2="20" y2="34" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
          <line x1="10" y1="16" x2="30" y2="16" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
          <line x1="14" y1="34" x2="30" y2="16" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
          <line x1="26" y1="34" x2="10" y2="16" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
        </svg>
      )
    case "textiles":
      return (
        <svg viewBox="0 0 40 40" className="h-12 w-12">
          <rect x="8" y="10" width="24" height="20" rx="1" fill="currentColor" opacity="0.1" stroke="currentColor" strokeWidth="1" />
          <path d="M8 15 L32 15 M8 20 L32 20 M8 25 L32 25" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
          <path d="M14 10 L14 30 M20 10 L20 30 M26 10 L26 30" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
        </svg>
      )
    case "glass":
      return (
        <svg viewBox="0 0 40 40" className="h-12 w-12">
          <ellipse cx="20" cy="20" rx="10" ry="12" fill="currentColor" opacity="0.1" stroke="currentColor" strokeWidth="1" />
          <ellipse cx="20" cy="20" rx="6" ry="8" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
          <path d="M16 14 Q18 12, 20 14" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
        </svg>
      )
    default:
      return null
  }
}

// Ornamental divider with Silk Road motif
function SilkRoadDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <div className="h-px w-16 bg-gradient-to-r from-transparent to-accent/40" />
      <div className="flex items-center gap-1.5">
        <div className="h-1.5 w-1.5 rotate-45 bg-accent/30" />
        <div className="h-2 w-2 rotate-45 border border-accent/50 bg-accent/10" />
        <div className="h-2.5 w-2.5 rotate-45 border-2 border-accent/60" />
        <div className="h-2 w-2 rotate-45 border border-accent/50 bg-accent/10" />
        <div className="h-1.5 w-1.5 rotate-45 bg-accent/30" />
      </div>
      <div className="h-px w-16 bg-gradient-to-l from-transparent to-accent/40" />
    </div>
  )
}

// Caravan Silhouette
function CaravanSilhouette() {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none overflow-hidden opacity-[0.08]">
      <svg viewBox="0 0 1200 100" className="absolute bottom-0 w-full h-full" preserveAspectRatio="xMidYMax slice">
        {/* Ground line */}
        <path d="M0 85 Q300 80, 600 85 Q900 90, 1200 85" fill="none" stroke="currentColor" strokeWidth="1" className="text-accent" />

        {/* Camels and traders silhouettes */}
        <g className="text-accent" transform="translate(100, 40)">
          {/* First camel */}
          <path d="M0 40 L5 35 L8 20 L12 15 L15 20 L18 35 L25 38 L30 35 L35 40 L30 45 L5 45 Z" fill="currentColor" />
          <circle cx="10" cy="12" r="3" fill="currentColor" />
        </g>

        <g className="text-accent" transform="translate(200, 42)">
          {/* Trader figure */}
          <ellipse cx="5" cy="8" rx="4" ry="5" fill="currentColor" />
          <path d="M2 13 L2 35 M8 13 L8 35 M2 20 L8 20" stroke="currentColor" strokeWidth="2" />
        </g>

        <g className="text-accent" transform="translate(280, 38)">
          {/* Second camel with cargo */}
          <path d="M0 40 L5 35 L8 20 L12 15 L15 20 L18 35 L25 38 L30 35 L35 40 L30 45 L5 45 Z" fill="currentColor" />
          <circle cx="10" cy="12" r="3" fill="currentColor" />
          <rect x="15" y="22" width="10" height="8" rx="1" fill="currentColor" />
        </g>

        <g className="text-accent" transform="translate(850, 40)">
          <path d="M0 40 L5 35 L8 20 L12 15 L15 20 L18 35 L25 38 L30 35 L35 40 L30 45 L5 45 Z" fill="currentColor" />
          <circle cx="10" cy="12" r="3" fill="currentColor" />
        </g>

        <g className="text-accent" transform="translate(950, 42)">
          <ellipse cx="5" cy="8" rx="4" ry="5" fill="currentColor" />
          <path d="M2 13 L2 35 M8 13 L8 35 M2 20 L8 20" stroke="currentColor" strokeWidth="2" />
        </g>

        <g className="text-accent" transform="translate(1030, 38)">
          <path d="M0 40 L5 35 L8 20 L12 15 L15 20 L18 35 L25 38 L30 35 L35 40 L30 45 L5 45 Z" fill="currentColor" />
          <circle cx="10" cy="12" r="3" fill="currentColor" />
          <rect x="15" y="22" width="10" height="8" rx="1" fill="currentColor" />
        </g>
      </svg>
    </div>
  )
}

/* Theme Toggle Button */
function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="ml-2 h-9 w-9 p-0 text-muted-foreground hover:text-accent"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

export default function HomePage() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF8F5] dark:bg-[#1a1814]">
      {/* Hero Section */}
      <section className="relative flex min-h-screen flex-col overflow-hidden">
        {/* Warm gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#F5F0E8] via-[#FAF8F5] to-[#FFFDF9] dark:from-[#1a1814] dark:via-[#1e1b16] dark:to-[#1a1814]" />

        {/* Islamic geometric pattern overlay */}
        <IslamicStarPattern />

        {/* Silk texture overlay */}
        <SilkTextureOverlay />

        {/* Persian rug corner medallions */}
        <RugCornerMedallion position="tl" />
        <RugCornerMedallion position="tr" />
        <RugCornerMedallion position="bl" />
        <RugCornerMedallion position="br" />

        {/* Caravan silhouette at bottom */}
        <CaravanSilhouette />

        {/* Top navigation bar */}
        <TopNav />

        {/* Main hero content */}
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-20">
          {/* Main title */}
          <div className="relative mb-6">
            <h1 className="text-center text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Silk Roads
            </h1>
            <h2 className="mt-2 text-center text-5xl font-bold tracking-tight text-accent sm:text-6xl lg:text-7xl">
              Nexus
            </h2>
          </div>

          <SilkRoadDivider className="my-6" />

          {/* Inscription banner */}
          <InscriptionBanner text="Where East Meets West" />

          <p className="mt-8 max-w-2xl text-center text-lg leading-relaxed text-muted-foreground">
            An integrated platform for spatial, temporal, and semantic exploration
            of the ancient trade networks that connected civilizations across
            <span className="font-medium text-foreground"> three continents</span>.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <Link href="/explore">
              <Button size="lg" className="gap-2 bg-accent px-8 text-white shadow-lg shadow-accent/20 hover:bg-accent/90 hover:shadow-xl hover:shadow-accent/30">
                <Globe2 className="h-5 w-5" />
                Begin Exploration
              </Button>
            </Link>
          </div>

          {/* Scroll indicator */}
          <div className="mt-20 flex flex-col items-center gap-2 text-muted-foreground">
            <span className="text-xs uppercase tracking-widest">Scroll to discover</span>
            <div className="h-8 w-px animate-pulse bg-gradient-to-b from-accent/50 to-transparent" />
          </div>
        </div>

        {/* Persian rug border at bottom of hero */}
        <PersianRugBorder className="absolute bottom-0 left-0 right-0" />
      </section>

      {/* Traded Goods Icons Strip */}
      <section className="relative bg-[#FAF8F5] py-10 dark:bg-[#1a1814]">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-6 text-center">
            <h3 className="text-lg font-bold text-foreground">Commodities That Connected Continents</h3>
<p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
  Trade goods were more than economic items; they carried technologies, beliefs, artistic styles, and cultural practices across the Silk Roads.
</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-10">
            {TRADED_GOODS.map((good) => (
              <div key={good.name} className="flex flex-col items-center gap-2 text-accent/70 transition-colors hover:text-accent">
                <GoodsIcon type={good.icon} />
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">{good.name}</p>
                  <p className="text-[10px] text-muted-foreground">{good.origin}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Artistry of the Silk Road - Three Featured Goods */}
      <section className="relative border-y border-accent/10 bg-[#FFFDF9] py-14 dark:bg-[#1e1b16]">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-8 text-center">
            <h3 className="text-xl font-bold text-foreground">Artistry of the Silk Road</h3>
            <SilkRoadDivider className="mx-auto mt-3" />
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Beyond commerce, the Silk Road carried artistic traditions that transformed cultures.
              From Persian carpet weaving to Chinese porcelain and Samarkand papermaking, these crafts
              represent centuries of refined skill passed across generations and borders.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {TRADED_GOODS_IMAGES.map((good) => (
              <div
                key={good.name}
                className="group overflow-hidden rounded-lg border border-accent/10 bg-white shadow-sm transition-all hover:border-accent/30 hover:shadow-md dark:bg-[#252119]"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={good.image}
                    alt={good.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-3 text-center">
                  <h4 className="text-sm font-semibold text-foreground">{good.name}</h4>
                  <p className="mt-0.5 text-xs text-accent">{good.origin}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section - Exploration Modes */}
      <section id="about" className="relative border-y border-accent/10 bg-[#FFFDF9] py-12 dark:bg-[#1e1b16]">
        <div className="mx-auto max-w-4xl px-6">
          {/* Introduction to the three perspectives */}
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Understand the Silk Roads Through Multiple Lenses</h2>
            <p className="text-sm leading-relaxed text-muted-foreground max-w-2xl mx-auto mb-8">
              The Silk Roads were not just trade routes—they were networks of cultural exchange, technological innovation, and human connection.
              To truly understand this complexity, we present the data through three complementary analytical perspectives:
            </p>
          </div>

          {/* Three perspectives explanation */}
          <div className="grid gap-6 md:grid-cols-3 mb-12">
            {CAPABILITIES.map((cap) => {
              const Icon = cap.icon
              return (
                <div key={cap.title} className="rounded-lg border border-accent/10 bg-white p-4 dark:bg-[#252119]">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="h-5 w-5 text-accent" />
                    <h3 className="font-semibold text-foreground">{cap.title}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{cap.description}</p>
                </div>
              )
            })}
          </div>

          {/* Divider */}
          <SilkRoadDivider className="mb-12" />

          {/* Choose Your Exploration heading */}
          <div className="mb-8 text-center">
            <h3 className="text-lg font-bold text-foreground">Choose Your Exploration</h3>
          </div>

          {/* Exploration cards */}
          <div className="grid gap-4 sm:grid-cols-2 mb-12">
            {/* Map Card */}
            <Link
              href="/explore"
              className="group flex items-center gap-4 rounded-xl border border-accent/10 bg-white p-4 transition-all hover:border-accent/30 hover:shadow-md dark:bg-[#252119]"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                <Map className="h-6 w-6 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Interactive Map</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">Explore trade routes and cities spatially</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-accent" />
            </Link>

            {/* Graph Card */}
            <Link
              href="/graph"
              className="group flex items-center gap-4 rounded-xl border border-accent/10 bg-white p-4 transition-all hover:border-accent/30 hover:shadow-md dark:bg-[#252119]"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                <Network className="h-6 w-6 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Knowledge Graph</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">Discover entity relationships visually</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-accent" />
            </Link>
          </div>

          {/* Timeline */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Calendar className="h-4 w-4 text-accent" />
              <span className="text-sm text-muted-foreground">
                Spanning <span className="font-medium text-foreground">1,800 years</span> from 300 BCE to 1500 CE
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground">300 BCE</span>
              <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-accent/10">
                <div className="h-full w-full rounded-full bg-gradient-to-r from-accent/40 via-accent to-accent/40" />
              </div>
              <span className="text-[10px] text-muted-foreground">1500 CE</span>
            </div>
          </div>
        </div>
      </section>

      {/* Academic Footer */}
      <footer className="border-t border-accent/10 bg-[#F5F0E8] py-12 dark:bg-[#1e1b16]">
        <div className="mx-auto max-w-5xl px-6">
          {/* Logo - Bigger */}
          <div className="mb-8 flex justify-center">
            <Image
              src="/images/logo-full.png"
              alt="The Silk Roads Nexus"
              width={280}
              height={50}
              className="h-12 w-auto object-contain"
            />
          </div>

          {/* Project Title */}
          <div className="mb-8 text-center">
            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-muted-foreground">
              A Coordinated Multi-View Data-Driven Platform for Integrated Spatial, Temporal, and Semantic Exploration of Silk Roads Cultural Heritage
            </p>
          </div>

          <div className="grid gap-8 text-center md:grid-cols-3 md:text-left">
            {/* Project Info */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-accent">Academic Project</h4>
              <p className="mt-2 text-sm font-medium text-foreground">CSC3094 Software Engineering Project</p>
              <p className="mt-1 text-xs text-muted-foreground">School of Computing</p>
              <p className="text-xs text-muted-foreground">Newcastle University</p>
              <p className="mt-2 text-xs text-muted-foreground">2025-2026 Academic Year</p>
            </div>

            {/* Author */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-accent">Developed & Designed by</h4>
              <p className="mt-2 text-sm font-medium text-foreground">Saud Najem S. Alnajem</p>
              <p className="mt-1 text-xs text-muted-foreground">Student ID: 230266960</p>
              <p className="mt-2 text-xs text-muted-foreground">Supervised by</p>
              <p className="text-xs font-medium text-foreground">Dr. Rouaa Yassin Kassab</p>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-accent">Navigation</h4>
              <div className="mt-2 flex flex-col gap-1">
                <Link href="/explore" className="text-xs text-muted-foreground hover:text-accent">Explore Map</Link>
                <Link href="/graph" className="text-xs text-muted-foreground hover:text-accent">Knowledge Graph</Link>
                <Link href="/traveller" className="text-xs text-muted-foreground hover:text-accent">Traveller Mode</Link>
                <Link href="/architecture" className="text-xs text-muted-foreground hover:text-accent">Architecture</Link>
              </div>
            </div>
          </div>

          {/* Dataset & Copyright */}
          <div className="mt-8 border-t border-accent/10 pt-6">
            <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-accent/70">Dataset</p>
                <p className="mt-1 text-[10px] text-muted-foreground">
                  Original dataset created by Saud Najem S. Alnajem, available on Zenodo.{" "}
                  <a
                    href="https://zenodo.org/records/19684922"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-accent underline underline-offset-2 hover:text-accent/80"
                  >
                    Get access here
                  </a>
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground/60">
                  © 2025-2026 Newcastle University. Academic use only.
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
