/*
 * lib/api-client.ts
 * Dual-mode data access layer for the Silk Road Nexus platform.
 * It will:
 * - Attempt to fetch live data from the Flask/MySQL backend (NEXT_PUBLIC_API_URL)
 * - Fall back silently to the static TypeScript dataset if the backend is unreachable
 * - Apply a 1.5-second abort timeout so the UI never hangs waiting for a dead server
 * - Export typed wrappers for every data operation used across the app
 */

import {
  ALL_ENTITIES,
  ROUTES,
  getEntitiesForCentury,
  getRoutesForCentury,
  searchEntities,
  type SilkRoadEntity,
  type RouteSegment,
} from "@/lib/silk-road-data"

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api"

/** Simple fetch wrapper with a tight timeout so fallback is near-instant */
async function apiFetch<T>(path: string): Promise<T | null> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 1500)
    const res = await fetch(`${API_BASE}${path}`, {
      signal: controller.signal,
    })
    clearTimeout(timeout)
    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    return null
  }
}

/* ── Public API ── */

export async function fetchAllEntities(): Promise<SilkRoadEntity[]> {
  const data = await apiFetch<SilkRoadEntity[]>("/entities")
  return data ?? ALL_ENTITIES
}

export async function fetchEntity(
  id: string
): Promise<SilkRoadEntity | undefined> {
  const data = await apiFetch<SilkRoadEntity>(`/entities/${id}`)
  return data ?? ALL_ENTITIES.find((e) => e.id === id)
}

export async function fetchEntitiesForCentury(
  year: number
): Promise<SilkRoadEntity[]> {
  const data = await apiFetch<SilkRoadEntity[]>(
    `/entities?century_year=${year}`
  )
  return data ?? getEntitiesForCentury(year)
}

export async function fetchRoutesForCentury(
  year: number
): Promise<RouteSegment[]> {
  const data = await apiFetch<RouteSegment[]>(
    `/routes?century_year=${year}`
  )
  return data ?? getRoutesForCentury(year)
}

export async function fetchSearchResults(
  query: string
): Promise<SilkRoadEntity[]> {
  const data = await apiFetch<SilkRoadEntity[]>(
    `/search?q=${encodeURIComponent(query)}`
  )
  return data ?? searchEntities(query)
}
