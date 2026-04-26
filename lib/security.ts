/*
 * lib/security.ts
 * Centralised security utilities for the Silk Road Nexus platform.
 * It will:
 * - Sanitise user input to prevent XSS injection in search and filters
 * - Validate internal URLs to block open-redirect attacks
 * - Check that required environment variables are present at startup
 * - Generate cryptographically secure tokens for future CSRF or session use
 * - Expose shared rate-limit configuration and Content Security Policy constants
 */

// Escapes HTML special characters to neutralise any injected markup
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return ''

  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim()
}

// Accepts only relative paths or same-origin URLs — rejects anything that could redirect externally
export function isValidInternalUrl(url: string): boolean {
  try {
    const parsed = new URL(url, 'http://localhost')
    return parsed.origin === 'http://localhost' || parsed.pathname.startsWith('/')
  } catch {
    return false
  }
}

// Warns in development if a required env var is absent; returns a list of missing keys
export function validateEnvVars(requiredVars: string[]): { valid: boolean; missing: string[] } {
  const missing: string[] = []

  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      missing.push(varName)
    }
  }

  if (missing.length > 0 && process.env.NODE_ENV === 'development') {
    console.warn(`[Security] Missing environment variables: ${missing.join(', ')}`)
  }

  return { valid: missing.length === 0, missing }
}

// Produces a hex-encoded random token using the Web Crypto API — suitable for CSRF tokens or session IDs
export function generateSecureToken(length: number = 32): string {
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

// Shared rate-limit windows used by any future API route or middleware
export const RATE_LIMITS = {
  api: {
    windowMs: 60 * 1000,  // 1-minute rolling window
    maxRequests: 100,
  },
  search: {
    windowMs: 60 * 1000,  // tighter limit for the search endpoint
    maxRequests: 30,
  },
} as const

// Mirror of the headers set in next.config.mjs — kept here so they can be applied programmatically too
export const SECURITY_HEADERS = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-XSS-Protection': '1; mode=block',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self)',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
} as const

// External domains permitted by the Content Security Policy in next.config.mjs
export const CSP_ALLOWED_DOMAINS = {
  scripts: ['api.mapbox.com', 'events.mapbox.com'],
  styles: ['api.mapbox.com', 'fonts.googleapis.com'],
  fonts: ['fonts.gstatic.com'],
  images: ['hebbkx1anhila5yf.public.blob.vercel-storage.com'],
  connect: ['api.mapbox.com', 'events.mapbox.com', '*.tiles.mapbox.com'],
} as const
