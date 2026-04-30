/*
 * app/attack-detected/page.tsx
 * Simple, Silk Road-themed security page for blocked requests.
 */

"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { AlertTriangle } from "lucide-react"

type AttackType = "sql_injection" | "xss" | "path_traversal" | "unknown"

function AttackDetectedContent() {
  const searchParams = useSearchParams()
  const attack = (searchParams.get("attack") || "unknown") as AttackType

  const attackInfo: Record<
    AttackType,
    { displayType: string; heading: string; description: string }
  > = {
    sql_injection: {
      displayType: "SQL Injection",
      heading: "SQL Injection Detected",
      description:
        "Your request contained patterns commonly used in SQL injection attacks. Like merchants checking for counterfeit goods, we have inspected your passage and found it unsafe. The gates remain closed.",
    },
    xss: {
      displayType: "Cross-Site Scripting (XSS)",
      heading: "Cross-Site Scripting (XSS) Detected",
      description:
        "Your request contained script tags or other XSS patterns. The caravan inspectors detected dangerous goods trying to enter the trade route. Your passage has been blocked.",
    },
    path_traversal: {
      displayType: "Path Traversal",
      heading: "Path Traversal Detected",
      description:
        "Your request contained path traversal patterns. Some paths along the Silk Road are forbidden for good reason. This route is protected.",
    },
    unknown: {
      displayType: "Security Attack",
      heading: "Request Blocked",
      description:
        "Your request did not meet our security standards. The gates remain closed to protect the caravan.",
    },
  }

  const info = attackInfo[attack] ?? attackInfo.unknown

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background">
      <div className="text-center max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="p-4 rounded-full bg-accent/10">
            <AlertTriangle className="w-12 h-12 text-accent" strokeWidth={1.5} />
          </div>
        </div>

        <div className="mb-4 inline-block">
          <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent bg-accent/10 rounded-full">
            Security Alert
          </span>
        </div>

        <h1 className="text-4xl font-bold text-foreground mb-3">
          {info.heading}
        </h1>

        <p className="text-sm text-muted-foreground/80 mb-8 leading-relaxed">
          {info.description}
        </p>

        <Link
          href="/"
          className="inline-block px-6 py-2.5 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:bg-accent/90 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  )
}

export default function AttackDetected() {
  return (
    <Suspense fallback={<div className="p-6">Loading security page...</div>}>
      <AttackDetectedContent />
    </Suspense>
  )
}