/**
 * 3D City Architecture Definitions - Historical Massing Models
 * Simplified architectural silhouettes resembling urban planning mass models.
 * Uses subtle, historically grounded material palette.
 */

export interface BuildingShape {
  type:
  | "dome"
  | "minaret"
  | "tower"
  | "wall"
  | "pagoda"
  | "fortress"
  | "gate"
  | "bazaar"
  | "columns"
  | "citadel"
  | "iwan"
  | "mausoleum"
  | "courtyard"
  | "conical"
  | "colorDome"
  | "caveTemple"
  width: number
  height: number
  depth?: number
  offsetX?: number
  offsetY?: number
  offsetZ?: number
  color?: string
  accent?: string
  roofColor?: string
  windows?: boolean
  arches?: number
  tiers?: number
  pattern?: string
}

export interface CityArchitecture {
  id: string
  name: string
  baseScale: number
  buildings: BuildingShape[]
  groundColor?: string
  groundShape?: "rect" | "circle" | "oval" | "hill"
  style: "byzantine" | "islamic" | "persian" | "central-asian" | "chinese" | "coastal" | "roman"
}

// Historical material palette - subtle, archaeological reconstruction colors
const SANDSTONE = "#C4A882"
const SANDSTONE_LIGHT = "#D4BFA6"
const SANDSTONE_DARK = "#A89068"
const CLAY = "#B8946E"
const CLAY_DARK = "#9A7A56"
const LIMESTONE = "#D6CFC0"
const LIMESTONE_DARK = "#B8B0A0"
const MARBLE = "#E0DCD4"
const AGED_STONE = "#9A9080"
const STONE_GREY = "#8A8478"
const COPPER_AGED = "#8B7355"
const TERRACOTTA = "#A67C52"
const SLATE = "#6B6B6B"
const TILE_BLUE = "#6A7A80"
const TILE_TURQUOISE = "#7A9090"
const BRICK_AGED = "#8B6B55"
const WOOD_DARK = "#5A4A3A"
const EARTH = "#9A8A70"

export const CITY_ARCHITECTURES: CityArchitecture[] = [
  // 1. Constantinople - Byzantine imperial city with domes and walls
  {
    id: "istanbul",
    name: "Constantinople",
    baseScale: 3.0,
    style: "byzantine",
    groundColor: LIMESTONE,
    buildings: [
      // Main Hagia Sophia dome
      { type: "dome", width: 22, height: 18, offsetX: 0, offsetY: 6, color: SLATE },
      // Semi-domes
      { type: "dome", width: 12, height: 10, offsetX: -14, offsetY: 3, color: SLATE },
      { type: "dome", width: 12, height: 10, offsetX: 14, offsetY: 3, color: SLATE },
      // Main building base
      { type: "fortress", width: 40, height: 12, offsetX: 0, color: BRICK_AGED },
      // Minarets
      { type: "minaret", width: 3, height: 26, offsetX: -24, color: MARBLE },
      { type: "minaret", width: 3, height: 26, offsetX: 24, color: MARBLE },
      // City walls
      { type: "wall", width: 50, height: 6, offsetX: 0, offsetZ: 10, color: STONE_GREY },
    ],
  },

  // 2. Trabzon - Black Sea trading post with covered bazaar
  {
    id: "trabzon",
    name: "Trabzon",
    baseScale: 3.0,
    style: "byzantine",
    groundColor: SANDSTONE_DARK,
    buildings: [
      // Stone arcade
      { type: "columns", width: 32, height: 12, offsetX: 0, color: LIMESTONE, arches: 5 },
      // Bazaar roof
      { type: "bazaar", width: 28, height: 4, offsetX: 0, offsetY: 12, color: AGED_STONE },
      // Small dome
      { type: "dome", width: 8, height: 6, offsetX: 16, color: COPPER_AGED },
    ],
  },

  // 3. Aleppo - Fortified citadel on elevated mound
  {
    id: "aleppo",
    name: "Aleppo",
    baseScale: 3.0,
    style: "islamic",
    groundColor: SANDSTONE,
    buildings: [
      // Citadel mound
      { type: "citadel", width: 50, height: 12, offsetX: 0, color: SANDSTONE_DARK },
      // Inner walls
      { type: "wall", width: 36, height: 8, offsetX: 0, offsetY: 12, color: SANDSTONE },
      // Central fortress
      { type: "fortress", width: 16, height: 8, offsetX: 0, offsetY: 20, color: STONE_GREY },
      // Minaret
      { type: "minaret", width: 3, height: 16, offsetX: 6, offsetY: 20, color: SANDSTONE_LIGHT },
      // Gate towers
      { type: "tower", width: 6, height: 10, offsetX: -22, color: SANDSTONE },
      { type: "tower", width: 6, height: 10, offsetX: 22, color: SANDSTONE },
    ],
  },

  // 4. Antioch - Greco-Roman city with temple
  {
    id: "antioch",
    name: "Antioch",
    baseScale: 3.0,
    style: "roman",
    groundColor: LIMESTONE,
    buildings: [
      // Temple base
      { type: "fortress", width: 36, height: 5, offsetX: 0, color: LIMESTONE },
      // Temple body
      { type: "fortress", width: 26, height: 14, offsetX: 0, offsetY: 5, color: MARBLE },
      // Colonnade
      { type: "columns", width: 34, height: 16, offsetX: 0, offsetY: 5, offsetZ: 8, color: MARBLE, arches: 6 },
      // Pediment
      { type: "gate", width: 34, height: 8, offsetX: 0, offsetY: 21, color: LIMESTONE },
    ],
  },

  // 5. Damascus - Umayyad Mosque complex
  {
    id: "damascus",
    name: "Damascus",
    baseScale: 3.0,
    style: "islamic",
    groundColor: LIMESTONE,
    buildings: [
      // Outer walls
      { type: "wall", width: 46, height: 7, offsetX: 0, color: LIMESTONE },
      // Prayer hall
      { type: "bazaar", width: 40, height: 10, offsetX: 0, offsetZ: -8, color: LIMESTONE },
      // Eagle dome
      { type: "dome", width: 12, height: 12, offsetX: 0, offsetY: 10, offsetZ: -8, color: LIMESTONE_DARK },
      // Minarets
      { type: "minaret", width: 4, height: 24, offsetX: 18, color: LIMESTONE },
      { type: "minaret", width: 4, height: 20, offsetX: -18, color: LIMESTONE },
      // Courtyard
      { type: "courtyard", width: 24, height: 2, offsetX: 0, offsetZ: 6, color: MARBLE },
    ],
  },

  // 6. Baghdad - Round city with concentric walls
  {
    id: "baghdad",
    name: "Baghdad",
    baseScale: 3.0,
    style: "islamic",
    groundColor: SANDSTONE,
    buildings: [
      // Outer wall (circular represented as oval)
      { type: "wall", width: 56, height: 5, offsetX: 0, color: SANDSTONE },
      // Inner wall
      { type: "wall", width: 40, height: 7, offsetX: 0, color: SANDSTONE_DARK },
      // Central palace
      { type: "wall", width: 24, height: 9, offsetX: 0, color: CLAY },
      // Central dome
      { type: "dome", width: 16, height: 14, offsetX: 0, offsetY: 9, color: TILE_TURQUOISE },
      // Gate towers
      { type: "tower", width: 6, height: 12, offsetX: 0, offsetZ: 22, color: SANDSTONE_LIGHT },
      { type: "tower", width: 6, height: 12, offsetX: 22, color: SANDSTONE_LIGHT },
      { type: "tower", width: 6, height: 12, offsetX: -22, color: SANDSTONE_LIGHT },
    ],
  },

  // 7. Tabriz - Persian mosque with blue tiles
  {
    id: "tabriz",
    name: "Tabriz",
    baseScale: 3.0,
    style: "persian",
    groundColor: CLAY,
    buildings: [
      // Main building
      { type: "fortress", width: 34, height: 12, offsetX: 0, color: CLAY },
      // Blue dome
      { type: "dome", width: 16, height: 14, offsetX: 8, offsetY: 12, color: TILE_TURQUOISE },
      // Iwan portal
      { type: "iwan", width: 14, height: 20, offsetX: -10, color: TILE_BLUE },
      // Small domes
      { type: "dome", width: 6, height: 5, offsetX: 18, offsetY: 12, color: CLAY_DARK },
    ],
  },

  // 8. Muscat - Coastal port with mosque
  {
    id: "muscat",
    name: "Muscat",
    baseScale: 3.0,
    style: "coastal",
    groundColor: LIMESTONE,
    buildings: [
      // White buildings
      { type: "fortress", width: 36, height: 10, offsetX: 0, color: MARBLE },
      // Dome
      { type: "dome", width: 14, height: 12, offsetX: 10, offsetY: 10, color: TILE_TURQUOISE },
      // Minaret
      { type: "minaret", width: 4, height: 24, offsetX: -8, color: TILE_TURQUOISE },
      // Smaller dome
      { type: "dome", width: 8, height: 7, offsetX: -16, offsetY: 10, color: TILE_TURQUOISE },
    ],
  },

  // 9. Hormuz - Island port with distinctive domes
  {
    id: "hormuz",
    name: "Hormuz",
    baseScale: 3.6,
    style: "coastal",
    groundColor: SANDSTONE,
    buildings: [
      // Clustered domed buildings (all in muted earth tones)
      { type: "colorDome", width: 10, height: 10, offsetX: -10, color: SANDSTONE },
      { type: "colorDome", width: 12, height: 11, offsetX: 0, color: CLAY },
      { type: "colorDome", width: 10, height: 10, offsetX: 10, color: SANDSTONE_DARK },
      { type: "colorDome", width: 8, height: 8, offsetX: -16, offsetY: 2, color: TERRACOTTA },
      { type: "colorDome", width: 9, height: 9, offsetX: 16, offsetY: 2, color: TILE_TURQUOISE },
      { type: "colorDome", width: 7, height: 7, offsetX: 6, offsetY: 4, color: AGED_STONE },
    ],
  },

  // 10. Merv - Great Seljuk mausoleum
  {
    id: "merv",
    name: "Merv",
    baseScale: 3.0,
    style: "central-asian",
    groundColor: SANDSTONE,
    buildings: [
      // Mausoleum base (octagonal represented as square)
      { type: "fortress", width: 32, height: 16, offsetX: 0, color: SANDSTONE },
      // Large ribbed dome
      { type: "mausoleum", width: 28, height: 22, offsetX: 0, offsetY: 16, color: SANDSTONE_LIGHT },
      // Arched gallery
      { type: "wall", width: 36, height: 4, offsetX: 0, offsetY: 12, color: SANDSTONE_DARK },
    ],
  },

  // 11. Bukhara - Madrasa with tall minaret
  {
    id: "bukhara",
    name: "Bukhara",
    baseScale: 3.0,
    style: "central-asian",
    groundColor: SANDSTONE,
    buildings: [
      // Madrasa facade
      { type: "iwan", width: 16, height: 22, offsetX: 0, color: TILE_BLUE },
      // Side wings
      { type: "fortress", width: 14, height: 14, offsetX: -14, color: SANDSTONE },
      { type: "fortress", width: 14, height: 14, offsetX: 14, color: SANDSTONE },
      // Domes on wings
      { type: "dome", width: 8, height: 7, offsetX: -14, offsetY: 14, color: TILE_TURQUOISE },
      { type: "dome", width: 8, height: 7, offsetX: 14, offsetY: 14, color: TILE_TURQUOISE },
      // Kalyan minaret (signature)
      { type: "minaret", width: 5, height: 30, offsetX: 22, color: SANDSTONE_LIGHT },
    ],
  },

  // 12. Samarkand - Registan with monumental iwans
  {
    id: "samarkand",
    name: "Samarkand",
    baseScale: 3.0,
    style: "central-asian",
    groundColor: SANDSTONE,
    buildings: [
      // Central iwan (Registan style)
      { type: "iwan", width: 18, height: 24, offsetX: 0, color: TILE_BLUE },
      // Large dome behind
      { type: "dome", width: 18, height: 16, offsetX: 0, offsetY: 8, offsetZ: -10, color: TILE_TURQUOISE },
      // Side minarets
      { type: "minaret", width: 4, height: 26, offsetX: -14, color: SANDSTONE },
      { type: "minaret", width: 4, height: 26, offsetX: 14, color: SANDSTONE },
      // Flanking buildings
      { type: "fortress", width: 12, height: 12, offsetX: -22, color: SANDSTONE },
      { type: "fortress", width: 12, height: 12, offsetX: 22, color: SANDSTONE },
    ],
  },

  // 13. Kashgar - Fortified oasis city
  {
    id: "kashgar",
    name: "Kashgar",
    baseScale: 3.0,
    style: "central-asian",
    groundColor: CLAY,
    buildings: [
      // City walls
      { type: "wall", width: 50, height: 8, offsetX: 0, color: CLAY_DARK },
      // Central fortress
      { type: "fortress", width: 24, height: 14, offsetX: 0, offsetY: 0, color: CLAY },
      // Watch towers
      { type: "tower", width: 8, height: 18, offsetX: -14, color: CLAY },
      { type: "tower", width: 8, height: 18, offsetX: 14, color: CLAY },
      // Gate tower
      { type: "tower", width: 10, height: 16, offsetX: 0, offsetZ: 16, color: CLAY_DARK },
      // Mosque dome
      { type: "dome", width: 10, height: 8, offsetX: 8, offsetY: 14, color: TILE_TURQUOISE },
    ],
  },

  // 14. Turfan - Emin Minaret and mosque
  {
    id: "turfan",
    name: "Turfan",
    baseScale: 3.0,
    style: "central-asian",
    groundColor: SANDSTONE,
    buildings: [
      // Mosque base with stairs
      { type: "fortress", width: 32, height: 10, offsetX: 4, color: SANDSTONE },
      // Entrance portal
      { type: "iwan", width: 12, height: 14, offsetX: 4, offsetY: 0, color: SANDSTONE_DARK },
      // Emin Minaret (conical, distinctive)
      { type: "conical", width: 10, height: 32, offsetX: -16, color: SANDSTONE_LIGHT },
    ],
  },

  // 15. Dunhuang - Mogao Caves pagoda
  {
    id: "dunhuang",
    name: "Dunhuang",
    baseScale: 3.0,
    style: "chinese",
    groundColor: SANDSTONE_DARK,
    buildings: [
      // Cliff face (background)
      { type: "citadel", width: 40, height: 10, offsetX: 0, color: SANDSTONE_DARK },
      // Multi-tier pagoda (Mogao Cave 96 style)
      { type: "caveTemple", width: 24, height: 36, offsetX: 0, offsetY: 0, color: SANDSTONE, accent: WOOD_DARK, tiers: 5 },
    ],
  },

  // 16. Chang'an (Xi'an) - Tang dynasty gate and walls
  {
    id: "xian",
    name: "Chang'an",
    baseScale: 3.0,
    style: "chinese",
    groundColor: EARTH,
    buildings: [
      // City wall base
      { type: "wall", width: 50, height: 10, offsetX: 0, color: AGED_STONE },
      // Gate tower base
      { type: "fortress", width: 26, height: 12, offsetX: 0, offsetY: 10, color: SANDSTONE },
      // Pagoda tower
      { type: "pagoda", width: 20, height: 28, offsetX: 0, offsetY: 22, color: SANDSTONE, accent: WOOD_DARK, tiers: 3 },
      // Corner towers
      { type: "tower", width: 8, height: 14, offsetX: -22, color: AGED_STONE },
      { type: "tower", width: 8, height: 14, offsetX: 22, color: AGED_STONE },
    ],
  },

  // 17. Alexandria - Pompey's Pillar and Roman Serapeum gateway
  {
    id: "alexandria",
    name: "Alexandria",
    baseScale: 3.0,
    style: "roman",
    groundColor: LIMESTONE,
    buildings: [
      // --- POMPEY'S PILLAR (main identity) ---
      { type: "fortress", width: 9, height: 5, offsetX: -16, color: LIMESTONE_DARK },
      { type: "tower", width: 5, height: 34, offsetX: -16, offsetY: 5, color: MARBLE },
      { type: "dome", width: 7, height: 5, offsetX: -16, offsetY: 39, color: MARBLE },

      // --- CLEAN ROMAN SERAPEUM GATEWAY ---
      // Main monumental arch body
      { type: "gate", width: 36, height: 22, offsetX: 8, offsetY: 0, color: LIMESTONE },

      // Central dark arch opening (simulated)
      { type: "gate", width: 18, height: 16, offsetX: 8, offsetY: 2, color: LIMESTONE_DARK },

      // Side supporting columns
      { type: "tower", width: 4, height: 22, offsetX: -10, offsetY: 0, color: MARBLE },
      { type: "tower", width: 4, height: 22, offsetX: 26, offsetY: 0, color: MARBLE },

      // Top entablature / roof line
      { type: "gate", width: 40, height: 5, offsetX: 8, offsetY: 22, color: LIMESTONE_DARK },

      // Small Alexandrian accent (subtle)
      { type: "dome", width: 8, height: 6, offsetX: 26, offsetY: 27, color: COPPER_AGED },
    ],
  },

  // 18. Quanzhou (Zayton) - Maritime Silk Road port with pagoda and mosque
  {
    id: "quanzhou",
    name: "Quanzhou",
    baseScale: 3.0,
    style: "chinese",
    groundColor: EARTH,
    buildings: [
      // Twin pagodas (Kaiyuan Temple style)
      { type: "pagoda", width: 12, height: 32, offsetX: -14, color: AGED_STONE, accent: WOOD_DARK, tiers: 5 },
      { type: "pagoda", width: 12, height: 32, offsetX: 14, color: AGED_STONE, accent: WOOD_DARK, tiers: 5 },
      // Temple hall
      { type: "fortress", width: 24, height: 10, offsetX: 0, color: SANDSTONE },
      // Mosque dome (Qingjing Mosque - Arab influence)
      { type: "dome", width: 10, height: 9, offsetX: 0, offsetY: 10, color: TILE_TURQUOISE },
      // Harbor wall
      { type: "wall", width: 40, height: 5, offsetX: 0, offsetZ: 12, color: AGED_STONE },
    ],
  },
]

/**
 * Get architecture for a specific city
 */
export function getCityArchitecture(cityId: string): CityArchitecture | undefined {
  return CITY_ARCHITECTURES.find((arch) => arch.id === cityId)
}

/**
 * Check if a city needs visibility boost (smaller cities that might be hard to see)
 */
export function needsVisibilityBoost(cityId: string): boolean {
  const smallerCities = ["trabzon", "hormuz", "turfan"]
  return smallerCities.includes(cityId)
}
