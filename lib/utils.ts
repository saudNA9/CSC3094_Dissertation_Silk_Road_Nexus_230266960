/*
 * lib/utils.ts
 * Shared utility helpers used throughout the Silk Road Nexus codebase.
 * It will:
 * - Merge Tailwind CSS class names safely, resolving conflicts via tailwind-merge
 * - Provide a single cn() import so components never duplicate this logic
 */

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Combines conditional class arrays and resolves Tailwind conflicts in one step
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
