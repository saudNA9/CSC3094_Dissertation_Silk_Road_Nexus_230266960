// City images mapping - high quality photographs for each Silk Road city

export interface CityImageData {
  url: string
  alt: string
  caption: string
  credit?: string
}

export const CITY_IMAGES: Record<string, CityImageData> = {
  // Bukhara - Kalyan Mosque with turquoise dome
  bukhara: {
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image.png-EkORFK2ANCwcg0CLBwuuPPWnoDqZSF.jpeg",
    alt: "Kalyan Mosque courtyard in Bukhara with intricate Islamic tilework and turquoise dome",
    caption: "The Kalyan Mosque courtyard featuring intricate Islamic geometric tilework and the iconic turquoise dome",
    credit: "Bukhara, Uzbekistan"
  },
  
  // Dunhuang - Mogao Caves
  dunhuang: {
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-PyhIwKjPszBMIOn9lFFFDCFgz8CVnO.png",
    alt: "Mogao Caves multi-tiered pagoda structure built into cliff face at Dunhuang",
    caption: "The Mogao Caves - a UNESCO World Heritage site housing centuries of Buddhist art and manuscripts",
    credit: "Mogao Caves, Dunhuang, China"
  },
  
  // Trabzon/Trebizond - Mountain village with lake
  trabzon: {
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-uDNXiPw8RsC6kSz1VvBoZyrOd8Sf4r.png",
    alt: "Trabzon region with green mountains, traditional village and mosque by the lake",
    caption: "The Black Sea region of Trebizond - gateway between Constantinople and Central Asia",
    credit: "Trabzon Region, Turkey"
  },
  
  // Merv - Ancient ruins
  merv: {
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Hn8rjy6TtolaQ59Rn6j9XnhxJrAzEh.png",
    alt: "Ancient ruins of Merv with camels in the foreground, Turkmenistan",
    caption: "The ancient ruins of Merv - once one of the largest cities in the world",
    credit: "Ancient Merv, Turkmenistan"
  },
  
  // Turfan - Emin Minaret
  turfan: {
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-aSd6cDpxnvevLTZ6IC1pxHFp8zo2Xo.png",
    alt: "Emin Minaret, distinctive conical tower with Islamic geometric patterns in Turfan",
    caption: "The Emin Minaret - showcasing the blend of Islamic and Central Asian architecture",
    credit: "Emin Minaret, Turfan, China"
  },
  
  // Xi'an/Chang'an - Pagoda with lotus
  xian: {
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-zeRxOB9zOkAPrqhqYHA6WnK91lmFKs.png",
    alt: "Traditional Chinese pagoda tower with lotus flowers in foreground, Xi'an",
    caption: "A Tang dynasty-style pagoda in Xi'an - the ancient capital and eastern terminus of the Silk Roads",
    credit: "Xi'an, China"
  },
  
  // Istanbul - Hagia Sophia
  istanbul: {
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-tqhAxyhAerZetWVio63IGxAxgMv69r.png",
    alt: "Hagia Sophia with its grand dome and minarets, Istanbul",
    caption: "Hagia Sophia - symbol of Constantinople's role as the western terminus of the Silk Roads",
    credit: "Hagia Sophia, Istanbul, Turkey"
  },
  
  // Antioch - Roman architecture
  antioch: {
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-2pmedl17zSFw20U3RMzQqEcKJc861F.png",
    alt: "Roman forum with columns and classical statues representing ancient Antioch",
    caption: "Classical Roman architecture representing Antioch's Hellenistic heritage",
    credit: "Roman Architecture, Ancient Antioch"
  },
  
  // Muscat - Coastal fortress
  muscat: {
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-sd1vsM8lfYojt40esqmSYeAUSwmHNh.png",
    alt: "Mutrah Fort overlooking the coastal road and sea in Muscat",
    caption: "Mutrah Fort guarding the approaches to Muscat - key port on the Maritime Silk Road",
    credit: "Mutrah Fort, Muscat, Oman"
  },
  
  // Alexandria - Qaitbay Citadel
  alexandria: {
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-7S6TsRSLXozuEpZiscJNRqJoAfiYKw.png",
    alt: "Aerial view of Qaitbay Citadel on the Mediterranean coast of Alexandria",
    caption: "The Citadel of Qaitbay, built on the site of the ancient Pharos Lighthouse",
    credit: "Citadel of Qaitbay, Alexandria, Egypt"
  },
  
  // Baghdad - Round City
  baghdad: {
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-2KR8JSdVlXVwBznrRctcYd7AIse2og.png",
    alt: "Artistic reconstruction of the Round City of Baghdad in the Abbasid era",
    caption: "The Round City of Baghdad - center of the Abbasid Caliphate and House of Wisdom",
    credit: "Round City of Baghdad, Historical Reconstruction"
  },
  
  // Kashgar - Old town with mosque
  kashgar: {
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Y9Ov9P2O2qvw9CBb5sZVLZAyPwgkHr.png",
    alt: "Kashgar old town with traditional adobe buildings and mosque minarets",
    caption: "The ancient oasis city of Kashgar - crossroads of the Northern and Southern Silk Roads",
    credit: "Old City, Kashgar, China"
  },
  
  // Tabriz - Grand Bazaar
  tabriz: {
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-9AeSgemB1eR7VZSUKFh60VCDYDw2M7.png",
    alt: "Tabriz Grand Bazaar with traditional Persian carpets on display",
    caption: "The Grand Bazaar of Tabriz - UNESCO World Heritage site and historic trading hub",
    credit: "Grand Bazaar, Tabriz, Iran"
  },
  
  // Hormuz - Colorful domes
  hormuz: {
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-ReW9hyibHySwkD6oxrBkbmpBCkwswe.png",
    alt: "Colorful dome structures on the coast of Hormuz Island",
    caption: "Hormuz Island - strategic gateway controlling Persian Gulf maritime trade",
    credit: "Hormuz Island, Iran"
  },
  
  // Samarkand - Registan Square
  samarkand: {
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-dyVkg7hescVzKTVte4uYld64cqW0U1.png",
    alt: "Registan Square at dusk with three illuminated madrasas, Samarkand",
    caption: "The Registan Square - jewel of Timurid architecture and heart of Samarkand",
    credit: "Registan Square, Samarkand, Uzbekistan"
  },
  
  // Quanzhou - Can use a similar style image or default
  quanzhou: {
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-zeRxOB9zOkAPrqhqYHA6WnK91lmFKs.png",
    alt: "Traditional Chinese pagoda architecture representing Quanzhou maritime heritage",
    caption: "Quanzhou (Zayton) - major port of the Maritime Silk Road described by Marco Polo",
    credit: "Quanzhou, China"
  },
}

// Get city image by ID, with fallback
export function getCityImage(cityId: string): CityImageData | null {
  return CITY_IMAGES[cityId] || null
}
