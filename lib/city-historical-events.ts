/**
 * Historical Events and City State Transitions
 * Each city has a timeline of events that affect its visual state on the map.
 * States: flourishing | active | declining | damaged | destroyed | rebuilt | revived
 */

export type CityState = 
  | "flourishing"  // Peak period - full, complete architecture, enhanced vibrancy
  | "active"       // Normal operation - standard rendering
  | "declining"    // Beginning to fade - slightly reduced scale/opacity
  | "damaged"      // Partially destroyed - fragmented appearance
  | "destroyed"    // Devastated - ruins, very low opacity, broken forms
  | "rebuilt"      // Reconstructed - restored with subtle emphasis
  | "revived"      // Major revival - enhanced like flourishing

export interface CityHistoricalEvent {
  year: number
  state: CityState
  label: string
  description?: string
}

export interface CityHistoricalData {
  id: string
  name: string
  events: CityHistoricalEvent[]
}

/**
 * Get the city state for a specific year based on historical events
 */
export function getCityStateForYear(cityId: string, year: number): { state: CityState; event: CityHistoricalEvent | null } {
  const cityData = CITY_HISTORICAL_EVENTS.find(c => c.id === cityId)
  if (!cityData || cityData.events.length === 0) {
    return { state: "active", event: null }
  }

  // Find the most recent event at or before the current year
  let currentState: CityState = "active"
  let currentEvent: CityHistoricalEvent | null = null
  
  for (const event of cityData.events) {
    if (event.year <= year) {
      currentState = event.state
      currentEvent = event
    } else {
      break // Events are sorted by year
    }
  }

  return { state: currentState, event: currentEvent }
}

/**
 * Get active event annotation for a city at a specific year
 * Returns the event if it occurred within the last 50 years of the current view
 */
export function getActiveEventAnnotation(cityId: string, year: number): CityHistoricalEvent | null {
  const cityData = CITY_HISTORICAL_EVENTS.find(c => c.id === cityId)
  if (!cityData) return null

  // Find events that occurred within the display window (50 years before current year)
  const recentEvents = cityData.events.filter(e => 
    e.year <= year && e.year > year - 50
  )

  // Return the most recent one
  return recentEvents.length > 0 ? recentEvents[recentEvents.length - 1] : null
}

/**
 * Get all events for a specific city
 */
export function getCityEvents(cityId: string): (CityHistoricalEvent & { stateTo: CityState })[] {
  const cityData = CITY_HISTORICAL_EVENTS.find((c) => c.id === cityId)
  if (!cityData) return []

  // Map events to include stateTo for compatibility with entity panel
  return cityData.events.map((e) => ({
    ...e,
    stateTo: e.state,
  }))
}

/**
 * Visual state parameters for rendering
 */
export interface CityStateVisuals {
  opacity: number
  scale: number
  saturation: number
  brightness: number
  fragmentLevel: number // 0 = complete, 1 = fully fragmented
  glowIntensity: number
  stateColor: string
}

export function getCityStateVisuals(state: CityState): CityStateVisuals {
  switch (state) {
    case "flourishing":
      return { opacity: 1.0, scale: 1.15, saturation: 1.1, brightness: 1.1, fragmentLevel: 0, glowIntensity: 0.3, stateColor: "#4caf50" }
    case "active":
      return { opacity: 1.0, scale: 1.0, saturation: 1.0, brightness: 1.0, fragmentLevel: 0, glowIntensity: 0, stateColor: "#c6a75e" }
    case "declining":
      return { opacity: 0.85, scale: 0.95, saturation: 0.85, brightness: 0.9, fragmentLevel: 0.1, glowIntensity: 0, stateColor: "#ff9800" }
    case "damaged":
      return { opacity: 0.7, scale: 0.85, saturation: 0.7, brightness: 0.8, fragmentLevel: 0.4, glowIntensity: 0, stateColor: "#f44336" }
    case "destroyed":
      return { opacity: 0.4, scale: 0.6, saturation: 0.4, brightness: 0.6, fragmentLevel: 0.8, glowIntensity: 0, stateColor: "#b71c1c" }
    case "rebuilt":
      return { opacity: 0.95, scale: 1.05, saturation: 1.0, brightness: 1.05, fragmentLevel: 0, glowIntensity: 0.15, stateColor: "#2196f3" }
    case "revived":
      return { opacity: 1.0, scale: 1.1, saturation: 1.05, brightness: 1.08, fragmentLevel: 0, glowIntensity: 0.25, stateColor: "#8bc34a" }
    default:
      return { opacity: 1.0, scale: 1.0, saturation: 1.0, brightness: 1.0, fragmentLevel: 0, glowIntensity: 0, stateColor: "#c6a75e" }
  }
}

export const CITY_HISTORICAL_EVENTS: CityHistoricalData[] = [
  {
    id: "istanbul",
    name: "Constantinople",
    events: [
      { year: 330, state: "flourishing", label: "Founded as Nova Roma", description: "Constantine I establishes the new capital of the Roman Empire" },
      { year: 532, state: "damaged", label: "Nika Riots devastation", description: "Half the city burned during the Nika Riots; Hagia Sophia destroyed" },
      { year: 537, state: "flourishing", label: "Hagia Sophia completed", description: "Justinian rebuilds the city; new Hagia Sophia consecrated" },
      { year: 717, state: "active", label: "Survives Arab siege", description: "Byzantine defenses hold against the Umayyad siege" },
      { year: 1071, state: "declining", label: "Post-Manzikert decline", description: "Loss of Anatolia begins economic decline" },
      { year: 1204, state: "destroyed", label: "Sacked by Crusaders", description: "Fourth Crusade devastates the city; Latin Empire established" },
      { year: 1261, state: "rebuilt", label: "Byzantine restoration", description: "Michael VIII Palaiologos recaptures Constantinople" },
      { year: 1350, state: "declining", label: "Ottoman pressure mounts", description: "Empire shrinks to Constantinople and surroundings" },
      { year: 1453, state: "destroyed", label: "Falls to Ottomans", description: "Mehmed II conquers the city; end of Byzantine Empire" },
    ],
  },
  {
    id: "trabzon",
    name: "Trabzon",
    events: [
      { year: 300, state: "active", label: "Byzantine trading port", description: "Important Black Sea trading center" },
      { year: 1204, state: "flourishing", label: "Empire of Trebizond founded", description: "Becomes capital of successor Byzantine state" },
      { year: 1300, state: "flourishing", label: "Peak of Trebizond trade", description: "Major terminus of overland Silk Road to Black Sea" },
      { year: 1461, state: "destroyed", label: "Falls to Ottomans", description: "Mehmed II conquers the last Byzantine state" },
    ],
  },
  {
    id: "antioch",
    name: "Antioch",
    events: [
      { year: 300, state: "flourishing", label: "Major Roman metropolis", description: "Third largest city in the Roman Empire" },
      { year: 526, state: "destroyed", label: "Devastating earthquake", description: "Great Antioch Earthquake kills 250,000" },
      { year: 540, state: "damaged", label: "Sacked by Persians", description: "Khosrow I captures and burns the city" },
      { year: 637, state: "active", label: "Arab conquest", description: "Rashidun Caliphate takes the city" },
      { year: 969, state: "revived", label: "Byzantine reconquest", description: "Nikephoros II Phokas recaptures Antioch" },
      { year: 1098, state: "active", label: "Crusader principality", description: "Bohemond establishes the Principality of Antioch" },
      { year: 1268, state: "destroyed", label: "Destroyed by Mamluks", description: "Baibars razes the city; never fully recovers" },
    ],
  },
  {
    id: "aleppo",
    name: "Aleppo",
    events: [
      { year: 300, state: "active", label: "Important trade center", description: "Key Silk Road junction between Mediterranean and Mesopotamia" },
      { year: 637, state: "active", label: "Arab conquest", description: "Integrated into the Rashidun Caliphate" },
      { year: 944, state: "flourishing", label: "Hamdanid golden age", description: "Sayf al-Dawla makes Aleppo a cultural capital" },
      { year: 1124, state: "active", label: "Crusader threat", description: "City withstands Crusader sieges" },
      { year: 1260, state: "destroyed", label: "Mongol devastation", description: "Hulagu's forces sack the city" },
      { year: 1317, state: "rebuilt", label: "Mamluk reconstruction", description: "City rebuilt under Mamluk rule" },
      { year: 1400, state: "damaged", label: "Timur's sack", description: "Tamerlane captures and loots the city" },
    ],
  },
  {
    id: "damascus",
    name: "Damascus",
    events: [
      { year: 300, state: "active", label: "Roman provincial capital", description: "Important city of Syria province" },
      { year: 635, state: "active", label: "Arab conquest", description: "Khalid ibn al-Walid captures Damascus" },
      { year: 661, state: "flourishing", label: "Umayyad capital", description: "Becomes capital of the Umayyad Caliphate" },
      { year: 705, state: "flourishing", label: "Umayyad Mosque completed", description: "One of the largest and oldest mosques in the world" },
      { year: 750, state: "declining", label: "Abbasid revolution", description: "Capital moves to Baghdad; Damascus loses prominence" },
      { year: 1076, state: "active", label: "Seljuk rule", description: "Tutush I establishes Seljuk rule" },
      { year: 1154, state: "flourishing", label: "Nur ad-Din's capital", description: "Major center of resistance to Crusaders" },
      { year: 1260, state: "damaged", label: "Mongol attack", description: "Brief Mongol occupation" },
      { year: 1400, state: "destroyed", label: "Timur devastates Damascus", description: "Tamerlane captures and sacks the city" },
      { year: 1450, state: "rebuilt", label: "Mamluk recovery", description: "City rebuilds under Mamluk rule" },
    ],
  },
  {
    id: "baghdad",
    name: "Baghdad",
    events: [
      { year: 762, state: "flourishing", label: "Founded as Abbasid capital", description: "Al-Mansur builds the Round City" },
      { year: 786, state: "flourishing", label: "Golden age under Harun al-Rashid", description: "World's largest and most prosperous city" },
      { year: 813, state: "damaged", label: "Civil war destruction", description: "Siege during war between al-Amin and al-Ma'mun" },
      { year: 833, state: "declining", label: "Samarra period begins", description: "Caliphs move to Samarra; Baghdad's role diminishes" },
      { year: 892, state: "revived", label: "Capital restored", description: "Caliphs return to Baghdad" },
      { year: 1055, state: "active", label: "Seljuk protectorate", description: "Seljuks take control; Caliph becomes figurehead" },
      { year: 1258, state: "destroyed", label: "Mongol destruction", description: "Hulagu's siege destroys the city; 200,000+ killed" },
      { year: 1401, state: "damaged", label: "Timur's sack", description: "Tamerlane captures and pillages Baghdad" },
    ],
  },
  {
    id: "tabriz",
    name: "Tabriz",
    events: [
      { year: 300, state: "active", label: "Ancient trading center", description: "Important stop on northern Silk Road" },
      { year: 791, state: "damaged", label: "Devastating earthquake", description: "Major earthquake damages the city" },
      { year: 1256, state: "flourishing", label: "Ilkhanate capital region", description: "Nearby Maragheh, then Tabriz, become Mongol capitals" },
      { year: 1295, state: "flourishing", label: "Ghazan Khan's capital", description: "Peak of Ilkhanate power and Silk Road trade" },
      { year: 1392, state: "damaged", label: "Timur conquers Tabriz", description: "City sacked by Tamerlane's forces" },
      { year: 1500, state: "flourishing", label: "Safavid capital", description: "Ismail I makes Tabriz his first capital" },
    ],
  },
  {
    id: "merv",
    name: "Merv",
    events: [
      { year: 300, state: "active", label: "Sasanian city", description: "Important oasis city on Silk Road" },
      { year: 651, state: "active", label: "Arab conquest", description: "Arabs capture the city" },
      { year: 813, state: "flourishing", label: "Capital of Khorasan", description: "Al-Ma'mun rules from Merv before becoming Caliph" },
      { year: 1040, state: "flourishing", label: "Seljuk capital", description: "Briefly serves as Seljuk capital" },
      { year: 1153, state: "flourishing", label: "World's largest city", description: "Population may have reached 200,000" },
      { year: 1221, state: "destroyed", label: "Mongol annihilation", description: "Genghis Khan's son Tolui massacres entire population" },
      { year: 1380, state: "declining", label: "Timurid period", description: "Never recovers former glory" },
    ],
  },
  {
    id: "bukhara",
    name: "Bukhara",
    events: [
      { year: 300, state: "active", label: "Ancient oasis city", description: "Important Silk Road stop" },
      { year: 709, state: "active", label: "Arab conquest", description: "Qutayba ibn Muslim captures Bukhara" },
      { year: 875, state: "flourishing", label: "Samanid capital", description: "Golden age of Persian culture; Ibn Sina born here" },
      { year: 999, state: "declining", label: "Qarakhanid conquest", description: "Samanid dynasty ends" },
      { year: 1220, state: "destroyed", label: "Mongol destruction", description: "Genghis Khan captures and burns the city" },
      { year: 1370, state: "rebuilt", label: "Timurid reconstruction", description: "City rebuilt under Timur" },
      { year: 1500, state: "flourishing", label: "Shaybanid capital", description: "Becomes capital of Uzbek Khanate" },
    ],
  },
  {
    id: "samarkand",
    name: "Samarkand",
    events: [
      { year: 300, state: "active", label: "Ancient Sogdian city", description: "Major Silk Road crossroads" },
      { year: 712, state: "active", label: "Arab conquest", description: "Qutayba ibn Muslim captures Samarkand" },
      { year: 751, state: "flourishing", label: "Paper-making begins", description: "Chinese prisoners introduce paper-making" },
      { year: 1220, state: "destroyed", label: "Mongol devastation", description: "Genghis Khan's forces destroy the city" },
      { year: 1370, state: "revived", label: "Timur's capital", description: "Tamerlane makes Samarkand his magnificent capital" },
      { year: 1405, state: "flourishing", label: "Ulugh Beg's golden age", description: "Astronomical observatory built; cultural renaissance" },
      { year: 1500, state: "declining", label: "Capital moves to Bukhara", description: "Loses status as regional capital" },
    ],
  },
  {
    id: "kashgar",
    name: "Kashgar",
    events: [
      { year: 300, state: "active", label: "Oasis trading hub", description: "Where northern and southern Silk Roads meet" },
      { year: 670, state: "active", label: "Tang protectorate", description: "Under Chinese influence" },
      { year: 840, state: "flourishing", label: "Uyghur kingdom center", description: "Important in Uyghur Khaganate" },
      { year: 1006, state: "flourishing", label: "Qarakhanid capital", description: "Islamic culture flourishes" },
      { year: 1219, state: "active", label: "Mongol conquest", description: "Incorporated into Mongol Empire" },
      { year: 1390, state: "active", label: "Timurid influence", description: "Under Timurid cultural sphere" },
    ],
  },
  {
    id: "turfan",
    name: "Turfan",
    events: [
      { year: 300, state: "active", label: "Desert oasis city", description: "Important stop below Flaming Mountains" },
      { year: 460, state: "flourishing", label: "Gaochang kingdom", description: "Capital of Gaochang; Buddhist center" },
      { year: 640, state: "active", label: "Tang conquest", description: "Becomes part of Tang Empire" },
      { year: 840, state: "flourishing", label: "Uyghur kingdom capital", description: "Center of Uyghur Buddhist culture" },
      { year: 1209, state: "active", label: "Mongol submission", description: "Peacefully submits to Genghis Khan" },
      { year: 1400, state: "declining", label: "Trade route shifts", description: "Maritime routes reduce overland trade" },
    ],
  },
  {
    id: "dunhuang",
    name: "Dunhuang",
    events: [
      { year: 300, state: "active", label: "Silk Road gateway", description: "Gateway to China from Central Asia" },
      { year: 366, state: "flourishing", label: "Mogao Caves begun", description: "First Buddhist caves carved" },
      { year: 618, state: "flourishing", label: "Tang Dynasty peak", description: "Height of cave construction and trade" },
      { year: 781, state: "active", label: "Tibetan conquest", description: "Falls under Tibetan control" },
      { year: 848, state: "revived", label: "Zhang Yichao's restoration", description: "Returned to Chinese control" },
      { year: 1036, state: "declining", label: "Tangut rule", description: "Falls to Western Xia" },
      { year: 1227, state: "damaged", label: "Mongol conquest", description: "Genghis Khan's forces capture the city" },
      { year: 1372, state: "active", label: "Ming garrison", description: "Serves as Ming Dynasty outpost" },
    ],
  },
  {
    id: "xian",
    name: "Chang'an (Xi'an)",
    events: [
      { year: 300, state: "active", label: "Former Han capital", description: "Recovers from past glory" },
      { year: 618, state: "flourishing", label: "Tang capital established", description: "World's most cosmopolitan city" },
      { year: 690, state: "flourishing", label: "Wu Zetian's reign", description: "Height of Tang prosperity" },
      { year: 755, state: "damaged", label: "An Lushan Rebellion", description: "City sacked during rebellion" },
      { year: 763, state: "damaged", label: "Tibetan occupation", description: "Briefly occupied by Tibetans" },
      { year: 783, state: "rebuilt", label: "Tang restoration", description: "Gradual recovery begins" },
      { year: 880, state: "destroyed", label: "Huang Chao Rebellion", description: "Devastating sack of the city" },
      { year: 907, state: "declining", label: "Tang Dynasty ends", description: "No longer a major capital" },
    ],
  },
  {
    id: "hormuz",
    name: "Hormuz",
    events: [
      { year: 300, state: "active", label: "Persian Gulf trading post", description: "Small trading settlement" },
      { year: 1100, state: "flourishing", label: "Kingdom of Hormuz rises", description: "Becomes major Gulf trading power" },
      { year: 1300, state: "flourishing", label: "Peak of Hormuz trade", description: "Controls Persian Gulf commerce" },
      { year: 1400, state: "flourishing", label: "Marco Polo describes Hormuz", description: "Famous as trading emporium" },
      { year: 1507, state: "damaged", label: "Portuguese conquest", description: "Afonso de Albuquerque captures the city" },
      { year: 1622, state: "destroyed", label: "Anglo-Persian capture", description: "Shah Abbas I with English help destroys Portuguese Hormuz" },
    ],
  },
  {
    id: "muscat",
    name: "Muscat",
    events: [
      { year: 300, state: "active", label: "Arabian coastal settlement", description: "Small fishing and trading port" },
      { year: 900, state: "active", label: "Arab maritime trade", description: "Part of Arab trading network" },
      { year: 1300, state: "flourishing", label: "Indian Ocean trade hub", description: "Important port for monsoon trade" },
      { year: 1507, state: "damaged", label: "Portuguese occupation", description: "Albuquerque captures Muscat" },
      { year: 1650, state: "revived", label: "Omani liberation", description: "Sultan bin Saif expels Portuguese" },
      { year: 1698, state: "flourishing", label: "Omani maritime empire", description: "Omanis capture Mombasa; empire expands" },
    ],
  },
  {
    id: "alexandria",
    name: "Alexandria",
    events: [
      { year: -331, state: "flourishing", label: "Alexander founds city", description: "Alexander the Great establishes Alexandria" },
      { year: -280, state: "flourishing", label: "Library and Lighthouse built", description: "Pharos Lighthouse and Great Library constructed" },
      { year: -30, state: "active", label: "Roman conquest", description: "Cleopatra's death; Egypt becomes Roman province" },
      { year: 48, state: "damaged", label: "Library partially destroyed", description: "Fire during Julius Caesar's siege damages library" },
      { year: 391, state: "damaged", label: "Serapeum destroyed", description: "Christian mobs destroy the temple complex" },
      { year: 642, state: "active", label: "Arab conquest", description: "Amr ibn al-As captures Alexandria for the Caliphate" },
      { year: 1200, state: "declining", label: "Trade shifts to Cairo", description: "Cairo becomes primary Egyptian trade center" },
      { year: 1365, state: "damaged", label: "Crusader sack", description: "Peter I of Cyprus raids and sacks the city" },
      { year: 1400, state: "active", label: "Mamluk trading port", description: "Continues as important spice trade terminus" },
    ],
  },
  {
    id: "quanzhou",
    name: "Quanzhou (Zayton)",
    events: [
      { year: 700, state: "active", label: "Tang trading port", description: "Begins development as maritime trade center" },
      { year: 879, state: "damaged", label: "Huang Chao Rebellion", description: "Foreign merchant communities massacred" },
      { year: 978, state: "flourishing", label: "Song Dynasty peak begins", description: "Designated as major foreign trade port" },
      { year: 1087, state: "flourishing", label: "Maritime Trade Office", description: "Government establishes Shibosi (trade office)" },
      { year: 1271, state: "flourishing", label: "Yuan Dynasty golden age", description: "World's largest port; Marco Polo visits" },
      { year: 1291, state: "flourishing", label: "Marco Polo departs", description: "Polo describes Zayton as one of world's greatest ports" },
      { year: 1357, state: "damaged", label: "Ispah Rebellion", description: "Persian garrison rebels; city damaged in fighting" },
      { year: 1368, state: "declining", label: "Ming restrictions begin", description: "Maritime trade restrictions reduce port activity" },
      { year: 1433, state: "declining", label: "Zheng He voyages end", description: "Ming closes down maritime expeditions" },
    ],
  },
]
