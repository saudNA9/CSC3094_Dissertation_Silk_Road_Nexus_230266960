/**
 * 3D City Marker Component
 * Renders a stylised miniature architectural model using CSS 3D transforms.
 * Each city has a unique silhouette reflecting its historical identity.
 */

import { type CityArchitecture, type BuildingShape } from "@/lib/city-architectures"

interface City3DMarkerProps {
  architecture: CityArchitecture
  isSelected: boolean
  isDark: boolean
  scale?: number // additional scale multiplier
}

const GOLD = "#C6A75E"

/**
 * Renders a single building shape as CSS 3D
 */
function Building({
  shape,
  isDark,
  baseScale,
}: {
  shape: BuildingShape
  isDark: boolean
  baseScale: number
}) {
  const scale = baseScale
  const w = shape.width * scale
  const h = shape.height * scale
  const x = (shape.offsetX || 0) * scale
  const z = (shape.offsetZ || 0) * scale
  const color = shape.color || (isDark ? "#C6A75E" : "#8a7a60")
  const accent = shape.accent || color

  // Darken color for shadow side
  const shadowColor = isDark
    ? adjustBrightness(color, -20)
    : adjustBrightness(color, -15)

  // Lighten for highlight
  const highlightColor = isDark
    ? adjustBrightness(color, 15)
    : adjustBrightness(color, 10)

  const commonStyle: React.CSSProperties = {
    position: "absolute",
    left: "50%",
    bottom: 0,
    transformStyle: "preserve-3d",
    transform: `translateX(calc(-50% + ${x}px)) translateZ(${z}px)`,
  }

  switch (shape.type) {
    case "dome":
      return (
        <div style={commonStyle}>
          {/* Dome base (cylindrical) */}
          <div
            style={{
              width: w,
              height: h * 0.3,
              background: `linear-gradient(90deg, ${shadowColor} 0%, ${color} 30%, ${highlightColor} 70%, ${shadowColor} 100%)`,
              borderRadius: "2px 2px 0 0",
            }}
          />
          {/* Dome top (hemispherical illusion) */}
          <div
            style={{
              position: "absolute",
              bottom: h * 0.3 - 1,
              left: "50%",
              transform: "translateX(-50%)",
              width: w,
              height: h * 0.7,
              background: `radial-gradient(ellipse 60% 80% at 40% 60%, ${highlightColor} 0%, ${color} 40%, ${shadowColor} 100%)`,
              borderRadius: "50% 50% 0 0",
              boxShadow: isDark
                ? `0 -2px 8px rgba(0,0,0,0.3), inset 0 -${h * 0.2}px ${h * 0.3}px rgba(0,0,0,0.2)`
                : `0 -1px 4px rgba(0,0,0,0.15), inset 0 -${h * 0.2}px ${h * 0.3}px rgba(0,0,0,0.1)`,
            }}
          />
          {/* Finial/crescent on top */}
          <div
            style={{
              position: "absolute",
              bottom: h - 2,
              left: "50%",
              transform: "translateX(-50%)",
              width: 4 * scale,
              height: 6 * scale,
              background: accent,
              borderRadius: "50%",
            }}
          />
        </div>
      )

    case "minaret":
      return (
        <div style={commonStyle}>
          {/* Minaret shaft */}
          <div
            style={{
              width: w,
              height: h * 0.85,
              background: `linear-gradient(90deg, ${shadowColor} 0%, ${color} 35%, ${highlightColor} 65%, ${shadowColor} 100%)`,
              borderRadius: "2px",
              clipPath: "polygon(10% 100%, 90% 100%, 85% 0%, 15% 0%)", // Slight taper
            }}
          />
          {/* Balcony */}
          <div
            style={{
              position: "absolute",
              bottom: h * 0.65,
              left: "50%",
              transform: "translateX(-50%)",
              width: w * 1.4,
              height: 3 * scale,
              background: accent || highlightColor,
              borderRadius: "1px",
            }}
          />
          {/* Conical top */}
          <div
            style={{
              position: "absolute",
              bottom: h * 0.85 - 1,
              left: "50%",
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: `${w * 0.6}px solid transparent`,
              borderRight: `${w * 0.6}px solid transparent`,
              borderBottom: `${h * 0.15}px solid ${accent || color}`,
            }}
          />
        </div>
      )

    case "tower":
      return (
        <div style={commonStyle}>
          {/* Tower body */}
          <div
            style={{
              width: w,
              height: h * 0.85,
              background: `linear-gradient(90deg, ${shadowColor} 0%, ${color} 40%, ${highlightColor} 60%, ${shadowColor} 100%)`,
              borderRadius: "2px 2px 0 0",
            }}
          />
          {/* Crenellations */}
          <div
            style={{
              position: "absolute",
              bottom: h * 0.85 - 1,
              left: 0,
              width: w,
              height: h * 0.15,
              background: `repeating-linear-gradient(90deg, ${color} 0px, ${color} ${w / 4}px, transparent ${w / 4}px, transparent ${w / 3}px)`,
            }}
          />
        </div>
      )

    case "wall":
      return (
        <div style={commonStyle}>
          <div
            style={{
              width: w,
              height: h,
              background: `linear-gradient(180deg, ${highlightColor} 0%, ${color} 50%, ${shadowColor} 100%)`,
              borderRadius: "1px",
              boxShadow: isDark
                ? "0 2px 4px rgba(0,0,0,0.3)"
                : "0 1px 2px rgba(0,0,0,0.15)",
            }}
          />
        </div>
      )

    case "fortress":
      return (
        <div style={commonStyle}>
          {/* Main fortress body */}
          <div
            style={{
              width: w,
              height: h * 0.7,
              background: `linear-gradient(180deg, ${color} 0%, ${shadowColor} 100%)`,
              borderRadius: "2px 2px 0 0",
              clipPath: "polygon(5% 100%, 95% 100%, 100% 0%, 0% 0%)", // Wider at top
            }}
          />
          {/* Top platform */}
          <div
            style={{
              position: "absolute",
              bottom: h * 0.7 - 1,
              left: "50%",
              transform: "translateX(-50%)",
              width: w * 1.05,
              height: h * 0.15,
              background: color,
              borderRadius: "1px",
            }}
          />
          {/* Crenellations */}
          <div
            style={{
              position: "absolute",
              bottom: h * 0.85 - 2,
              left: "50%",
              transform: "translateX(-50%)",
              width: w * 1.05,
              height: h * 0.15,
              background: `repeating-linear-gradient(90deg, ${highlightColor} 0px, ${highlightColor} ${w / 5}px, transparent ${w / 5}px, transparent ${w / 4}px)`,
            }}
          />
        </div>
      )

    case "pagoda":
      const tiers = 5
      return (
        <div style={commonStyle}>
          {Array.from({ length: tiers }).map((_, i) => {
            const tierH = (h / tiers) * 0.9
            const tierW = w * (1 - i * 0.12)
            const bottom = i * (h / tiers)
            return (
              <div key={i}>
                {/* Tier body */}
                <div
                  style={{
                    position: "absolute",
                    bottom,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: tierW,
                    height: tierH * 0.6,
                    background: `linear-gradient(180deg, ${highlightColor} 0%, ${color} 100%)`,
                  }}
                />
                {/* Roof overhang */}
                <div
                  style={{
                    position: "absolute",
                    bottom: bottom + tierH * 0.5,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: tierW * 1.3,
                    height: tierH * 0.5,
                    background: accent || shadowColor,
                    clipPath: "polygon(15% 100%, 85% 100%, 100% 0%, 0% 0%)",
                    borderRadius: "0 0 2px 2px",
                  }}
                />
              </div>
            )
          })}
          {/* Spire */}
          <div
            style={{
              position: "absolute",
              bottom: h - 2,
              left: "50%",
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: `${4 * scale}px solid transparent`,
              borderRight: `${4 * scale}px solid transparent`,
              borderBottom: `${8 * scale}px solid ${GOLD}`,
            }}
          />
        </div>
      )

    case "gate":
      return (
        <div style={commonStyle}>
          {/* Gate body */}
          <div
            style={{
              width: w,
              height: h,
              background: `linear-gradient(180deg, ${highlightColor} 0%, ${color} 60%, ${shadowColor} 100%)`,
              borderRadius: "4px 4px 0 0",
            }}
          />
          {/* Gate arch */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: w * 0.5,
              height: h * 0.5,
              background: isDark ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.4)",
              borderRadius: `${w * 0.25}px ${w * 0.25}px 0 0`,
            }}
          />
          {/* Roof/eaves for Chinese style */}
          <div
            style={{
              position: "absolute",
              bottom: h - 2,
              left: "50%",
              transform: "translateX(-50%)",
              width: w * 1.3,
              height: h * 0.2,
              background: accent || shadowColor,
              clipPath: "polygon(10% 100%, 90% 100%, 100% 0%, 0% 0%)",
              borderRadius: "2px",
            }}
          />
        </div>
      )

    case "bazaar":
      return (
        <div style={commonStyle}>
          {/* Long covered bazaar hall */}
          <div
            style={{
              width: w,
              height: h,
              background: `linear-gradient(180deg, ${color} 0%, ${shadowColor} 100%)`,
              borderRadius: `${h * 0.5}px ${h * 0.5}px 0 0`, // Barrel vault
              boxShadow: isDark
                ? "0 2px 4px rgba(0,0,0,0.3)"
                : "0 1px 2px rgba(0,0,0,0.15)",
            }}
          />
        </div>
      )

    default:
      return null
  }
}

/**
 * Adjust hex color brightness
 */
function adjustBrightness(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16)
  const amt = Math.round(2.55 * percent)
  const R = Math.max(0, Math.min(255, (num >> 16) + amt))
  const G = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amt))
  const B = Math.max(0, Math.min(255, (num & 0x0000ff) + amt))
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`
}

export function City3DMarker({
  architecture,
  isSelected,
  isDark,
  scale = 1,
}: City3DMarkerProps) {
  const baseScale = architecture.baseScale * scale * 0.65 // Adjust base size for map

  return (
    <div
      className="city-3d-marker"
      style={{
        position: "relative",
        width: 0,
        height: 0,
        transformStyle: "preserve-3d",
        transform: "rotateX(25deg)", // Slight tilt for 3D perspective
        transition: "transform 0.3s ease",
      }}
    >
      {/* Ground platform */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: -2,
          transform: "translateX(-50%) rotateX(90deg)",
          width: 60 * baseScale,
          height: 30 * baseScale,
          background: architecture.groundColor || "#D4C4A8",
          borderRadius: "50%",
          opacity: 0.6,
          boxShadow: isDark
            ? "0 0 12px rgba(0,0,0,0.5)"
            : "0 0 8px rgba(0,0,0,0.2)",
        }}
      />

      {/* Buildings - render back to front for proper layering */}
      {[...architecture.buildings]
        .sort((a, b) => (a.offsetZ || 0) - (b.offsetZ || 0))
        .map((building, i) => (
          <Building
            key={i}
            shape={building}
            isDark={isDark}
            baseScale={baseScale}
          />
        ))}

      {/* Selection glow */}
      {isSelected && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: -4,
            transform: "translateX(-50%)",
            width: 70 * baseScale,
            height: 35 * baseScale,
            background: `radial-gradient(ellipse, ${GOLD}40 0%, transparent 70%)`,
            borderRadius: "50%",
            animation: "city-glow 2s ease-in-out infinite",
          }}
        />
      )}
    </div>
  )
}

export default City3DMarker
