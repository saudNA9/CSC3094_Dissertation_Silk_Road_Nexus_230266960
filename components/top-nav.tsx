/*
 * components/top-nav.tsx
 * Persistent navigation bar rendered at the top of every page.
 * It will:
 * - Highlight the active route using Next.js usePathname
 * - Toggle between dark and light themes via next-themes
 * - Collapse into a hamburger menu on mobile viewports
 * - Embed the global SearchCommand palette accessible from any page
 */

"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import { Map, GitBranch, Info, Sun, Moon, Menu, X, Compass } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { SearchCommand } from "@/components/search-command"

const NAV_LINKS = [
  { href: "/explore", label: "Explore", icon: Map },
  { href: "/graph", label: "Graph", icon: GitBranch },
  { href: "/traveller", label: "Traveller", icon: Compass },
  { href: "/architecture", label: "Architecture", icon: Info },
]

export function TopNav() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => setMounted(true), [])

  return (
    <header className="ornamental-border sticky top-0 z-50 flex h-14 items-center border-b border-border bg-card/80 px-4 backdrop-blur-md lg:px-6">
      <Link
        href="/"
        className="mr-4 flex shrink-0 items-center text-foreground"
      >
        <Image
          src="/images/logo-full.png"
          alt="The Silk Roads Nexus - Cultural Heritage Exploration Platform"
          width={340}
          height={60}
          className="h-14 w-auto object-contain"
          priority
        />
      </Link>

      {/* Search bar - visible on non-home pages */}
      {pathname !== "/" && (
        <div className="mx-4 hidden max-w-md flex-1 md:flex">
          <div className="w-full">
            <SearchCommand />
          </div>
        </div>
      )}

      <nav className="ml-auto hidden items-center gap-1 md:flex">
        {NAV_LINKS.map((link) => {
          const Icon = link.icon
          const active = pathname === link.href
          return (
            <Link key={link.href} href={link.href}>
              <Button
                variant={active ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "gap-1.5 text-sm",
                  active && "border border-accent/20 bg-accent/10 text-accent"
                )}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Button>
            </Link>
          )
        })}
        <div className="mx-1 h-5 w-px bg-border" />
        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-accent" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
        )}
      </nav>

      {/* Mobile */}
      <div className="ml-auto flex items-center gap-2 md:hidden">
        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-accent" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {mobileOpen && (
        <div className="absolute left-0 top-14 z-50 w-full border-b border-border bg-card p-4 shadow-lg md:hidden">
          <div className="mb-3">
            <SearchCommand compact />
          </div>
          <nav className="flex flex-col gap-2">
            {NAV_LINKS.map((link) => {
              const Icon = link.icon
              const active = pathname === link.href
              return (
                <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}>
                  <Button
                    variant={active ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-2",
                      active && "border border-accent/20 bg-accent/10 text-accent"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Button>
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </header>
  )
}
