/*
 * components/search-command.tsx
 * Global search palette accessible from the navigation bar on every page.
 * It will:
 * - Open on click or keyboard shortcut (Ctrl/Cmd + K)
 * - Debounce input so the backend is not queried on every keystroke
 * - Try the Flask API first; fall back to the local static dataset if unreachable
 * - Display results grouped with entity-type icons (city, good, person, event, inscription)
 * - Navigate to the entity detail page when a result is selected
 */

"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Search, MapPin, Package, User, Calendar, Scroll, X } from "lucide-react"
import { searchEntities, type SilkRoadEntity } from "@/lib/silk-road-data"
import { fetchSearchResults } from "@/lib/api-client"
import { Badge } from "@/components/ui/badge"

const TYPE_ICONS: Record<string, typeof MapPin> = {
  City: MapPin,
  Good: Package,
  Person: User,
  Event: Calendar,
  Route: MapPin,
  Inscription: Scroll,
}

const TYPE_COLORS: Record<string, string> = {
  City: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  Route: "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  Person: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  Good: "bg-orange-500/15 text-orange-700 dark:text-orange-300",
  Event: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
  Inscription: "bg-purple-500/15 text-purple-700 dark:text-purple-300",
}

interface SearchCommandProps {
  /** If provided, selecting an entity calls this instead of navigating */
  onSelectEntity?: (entity: SilkRoadEntity) => void
  /** Compact mode for use inside explore page */
  compact?: boolean
}

export function SearchCommand({ onSelectEntity, compact }: SearchCommandProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SilkRoadEntity[]>([])
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  /* Debounced search -- tries Flask API first, falls back to static */
  useEffect(() => {
    let cancelled = false
    const timeout = setTimeout(() => {
      if (query.trim().length >= 2) {
        fetchSearchResults(query).then((found) => {
          if (!cancelled) {
            setResults(found.slice(0, 8))
            setOpen(found.length > 0)
            setActiveIndex(0)
          }
        })
      } else {
        setResults([])
        setOpen(false)
      }
    }, 150)
    return () => {
      cancelled = true
      clearTimeout(timeout)
    }
  }, [query])

  /* Close on outside click */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelect = useCallback(
    (entity: SilkRoadEntity) => {
      setQuery("")
      setOpen(false)
      if (onSelectEntity) {
        onSelectEntity(entity)
      } else {
        router.push(`/explore?select=${entity.id}`)
      }
    },
    [onSelectEntity, router]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!open || results.length === 0) return
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setActiveIndex((prev) => (prev + 1) % results.length)
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setActiveIndex((prev) => (prev - 1 + results.length) % results.length)
      } else if (e.key === "Enter") {
        e.preventDefault()
        handleSelect(results[activeIndex])
      } else if (e.key === "Escape") {
        setOpen(false)
      }
    },
    [open, results, activeIndex, handleSelect]
  )

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Search cities, goods, people, events..."
          className={`w-full rounded-md border border-input bg-background/60 pl-9 pr-8 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 ${
            compact ? "h-8 text-xs" : "h-9"
          }`}
        />
        {query && (
          <button
            onClick={() => {
              setQuery("")
              setResults([])
              setOpen(false)
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Results dropdown */}
      {open && results.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute left-0 top-full z-50 mt-1 w-full min-w-[320px] overflow-hidden rounded-lg border border-border bg-card shadow-xl"
        >
          <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {results.length} result{results.length !== 1 ? "s" : ""}
          </div>
          <div className="max-h-[320px] overflow-y-auto">
            {results.map((entity, i) => {
              const Icon = TYPE_ICONS[entity.type] || MapPin
              return (
                <button
                  key={entity.id}
                  onClick={() => handleSelect(entity)}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={`flex w-full items-start gap-3 px-3 py-2.5 text-left transition-colors ${
                    i === activeIndex
                      ? "bg-accent/10"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border bg-muted/50">
                    <Icon className="h-3.5 w-3.5 text-accent" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium text-foreground">
                        {entity.name}
                      </span>
                      <Badge
                        variant="outline"
                        className={`shrink-0 text-[9px] ${TYPE_COLORS[entity.type] || ""}`}
                      >
                        {entity.type}
                      </Badge>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {entity.region}
                      {entity.relatedGoods && entity.relatedGoods.length > 0
                        ? ` \u00B7 ${entity.relatedGoods.slice(0, 3).join(", ")}`
                        : ""}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
