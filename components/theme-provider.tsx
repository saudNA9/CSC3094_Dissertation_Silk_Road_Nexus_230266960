/*
 * components/theme-provider.tsx
 * Thin wrapper around the next-themes ThemeProvider.
 * It will:
 * - Accept all next-themes props (attribute, defaultTheme, enableSystem, etc.)
 * - Make the current theme available to every child via the useTheme hook
 * - Enable the dark/light toggle in the top navigation bar
 */

'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'

// Re-exports next-themes' provider unchanged — keeps the import path internal
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
