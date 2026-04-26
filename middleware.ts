/*
 * middleware.ts
 * Edge middleware that runs before every matched request.
 * It will:
 * - Attach a unique request ID to each response for tracing and audit logs
 * - Record a timestamp header so server logs can correlate requests
 * - Disable HTTP caching on API routes to prevent stale sensitive responses
 * - Exclude static assets and images from middleware processing
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Unique ID per request — useful for correlating logs and debugging
  const requestId = crypto.randomUUID()
  response.headers.set('X-Request-ID', requestId)

  // ISO timestamp so server logs can reconstruct request timelines
  response.headers.set('X-Request-Timestamp', new Date().toISOString())

  // Force no-cache on API routes so sensitive data is never served from cache
  if (request.nextUrl.pathname.startsWith('/api/')) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
  }

  return response
}

// Only run middleware on page and API routes — skip static files and images
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images/).*)'],
}
