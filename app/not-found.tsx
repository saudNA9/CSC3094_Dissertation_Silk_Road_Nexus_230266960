/*
 * app/not-found.tsx
 * I designed this minimal 404 page to feel like part of the Silk Road Nexus experience.
 * I use the same design tokens and typography as the rest of the platform so it
 * integrates seamlessly rather than breaking the user experience with a jarring error page.
 */

import Link from 'next/link'
import { MapPin } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background">
      {/* Decorative top accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50" />

      {/* Main content */}
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="p-4 rounded-full bg-accent/10">
            <MapPin className="w-12 h-12 text-accent" strokeWidth={1.5} />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-5xl font-bold text-foreground mb-3">
          404
        </h1>
        
        {/* Subtitle */}
        <p className="text-lg text-muted-foreground mb-2">
          Route Not Found
        </p>
        
        {/* Description */}
        <p className="text-sm text-muted-foreground/80 mb-8 leading-relaxed">
          This path does not exist on the Silk Road. Like a caravan that has lost its way, 
          let's guide you back to the main trade routes.
        </p>

        {/* Navigation buttons */}
        <div className="flex justify-center">
          <Link
            href="/"
            className="px-6 py-2.5 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:bg-accent/90 transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>

      {/* Decorative bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50" />
    </div>
  )
}
