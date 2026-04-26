export interface JourneyStop {
  id: string
  cityName: string
  region: string
  year: string
  duration: string
  significance: string
  narrative: string
  historicalContext: string
  relatedGoods?: string[]
  relatedPeople?: string[]
  relatedEvents?: string[]
  coordinates: [number, number]
}

export interface TravellerInsight {
  title: string
  description: string
  icon: "scroll" | "compass" | "mountain" | "users" | "book" | "globe"
}

export interface Traveller {
  id: string
  name: string
  title: string
  subtitle: string
  period: string
  startYear: number
  endYear: number
  origin: string
  destination: string
  purpose: string
  shortDescription: string
  fullDescription: string
  journeySummary: string
  totalDistance: string
  totalDuration: string
  regionsVisited: string[]
  keyThemes: string[]
  stops: JourneyStop[]
  insights: TravellerInsight[]
  tone: "scholarly" | "mercantile" | "exploratory"
  accentColor: string
  image: string
  ctaLabel: string
}

export const TRAVELLERS: Traveller[] = [
  {
    id: "xuanzang",
    name: "Xuanzang",
    title: "Buddhist Monk and Scholar",
    subtitle: "The Pilgrim of Enlightenment",
    period: "629–645 CE",
    startYear: 629,
    endYear: 645,
    origin: "Chang'an, China",
    destination: "Nalanda, India",
    purpose: "Religious Pilgrimage & Scholarly Quest",
    image: "/images/travellers/xuanzang.png",
    ctaLabel: "Follow the Scholar",
    shortDescription:
      "A Chinese Buddhist monk who travelled to India to obtain sacred texts, crossing the most treacherous terrain of the Silk Road in pursuit of spiritual enlightenment and knowledge.",
    fullDescription:
      "Xuanzang (602–664 CE) was a Chinese Buddhist monk, scholar, and translator who embarked on a seventeen-year overland journey to India. Defying an imperial travel ban, he crossed the Gobi Desert, traversed the Tian Shan mountains, and navigated the political complexities of Central Asian kingdoms to reach the great Buddhist university of Nalanda. His detailed records in 'Great Tang Records on the Western Regions' provide invaluable historical documentation of 7th-century Central and South Asia.",
    journeySummary:
      "Xuanzang's journey took him through the heart of the Silk Road, from the Tang capital of Chang'an westward through the Hexi Corridor, across the Gobi Desert, over the Tian Shan mountains, through the oasis cities of Central Asia, and finally into the Indian subcontinent. He spent years studying at Nalanda before returning with 657 Buddhist texts.",
    totalDistance: "~16,000 km",
    totalDuration: "17 years",
    regionsVisited: ["China", "Central Asia", "India", "Persia"],
    keyThemes: ["Buddhism", "Sacred Texts", "Philosophy", "Cultural Exchange"],
    tone: "scholarly",
    accentColor: "#8B4513",
    stops: [
      {
        id: "changan-start",
        cityName: "Chang'an",
        region: "China",
        year: "629 CE",
        duration: "Departure",
        significance: "Journey Origin",
        narrative:
          "Under cover of darkness, Xuanzang slipped past the guards at the Jade Gate. The Tang Emperor had forbidden foreign travel, but his quest for authentic Buddhist scriptures could not be denied. With only his faith and determination, he set forth into the unknown.",
        historicalContext:
          "Chang'an was the cosmopolitan capital of the Tang Dynasty, home to over a million people and the eastern terminus of the Silk Road. Despite its Buddhist temples, Xuanzang felt the available scriptures were incomplete and often contradictory.",
        relatedGoods: ["Silk", "Tea", "Porcelain"],
        coordinates: [108.9402, 34.2658],
      },
      {
        id: "dunhuang",
        cityName: "Dunhuang",
        region: "China",
        year: "629 CE",
        duration: "Several weeks",
        significance: "Last Chinese Outpost",
        narrative:
          "At the edge of the known world, Dunhuang marked the boundary between civilisation and the vast emptiness of the Gobi. The Mogao Caves, carved into cliffsides and filled with Buddhist art, offered Xuanzang spiritual preparation for the trials ahead.",
        historicalContext:
          "Dunhuang was the last major Chinese settlement before the desert crossing. The Mogao Caves had been under construction for over two centuries, serving as a repository of Buddhist art and a place of worship for Silk Road travellers.",
        relatedEvents: ["Mogao Caves Construction"],
        coordinates: [94.6618, 40.1421],
      },
      {
        id: "turpan",
        cityName: "Turpan",
        region: "Central Asia",
        year: "630 CE",
        duration: "2 months",
        significance: "Oasis Kingdom",
        narrative:
          "After surviving the Gobi's scorching days and freezing nights, Xuanzang reached the oasis kingdom of Gaochang. King Qu Wentai, a devout Buddhist, tried to detain the monk permanently, but Xuanzang's hunger strike convinced the king to provide supplies and letters of introduction instead.",
        historicalContext:
          "The Kingdom of Gaochang (Turpan) was a prosperous Buddhist state along the northern Silk Road. Its location in the Turpan Depression, below sea level, created extreme temperatures but also allowed agriculture through an ingenious underground irrigation system.",
        relatedGoods: ["Grapes", "Cotton"],
        coordinates: [89.1841, 42.9476],
      },
      {
        id: "samarkand-xu",
        cityName: "Samarkand",
        region: "Central Asia",
        year: "630 CE",
        duration: "1 month",
        significance: "Crossroads of Cultures",
        narrative:
          "The fabled Samarkand exceeded even Xuanzang's expectations. Though its ruler was initially suspicious of Buddhism, the monk's reputation as a scholar from the great Tang Empire earned him respect and safe passage through Sogdian territories.",
        historicalContext:
          "Samarkand under the Western Turkic Khaganate was a centre of Sogdian culture and commerce. The Sogdians were the great middlemen of the Silk Road, their caravans connecting China to Persia and beyond.",
        relatedGoods: ["Paper", "Glass", "Textiles"],
        relatedPeople: ["Sogdian Merchants"],
        coordinates: [66.9597, 39.6542],
      },
      {
        id: "balkh",
        cityName: "Balkh",
        region: "Central Asia",
        year: "630 CE",
        duration: "Several weeks",
        significance: "Buddhist Learning Centre",
        narrative:
          "In Balkh, Xuanzang found a thriving Buddhist community with over a hundred monasteries. The New Monastery housed magnificent Buddha statues, and the monk spent time studying with local scholars before continuing south.",
        historicalContext:
          "Balkh, known as the 'Mother of Cities', was an ancient centre of Zoroastrianism that had become a major Buddhist hub. The Nava Vihara monastery was famous throughout the Buddhist world.",
        relatedPeople: ["Buddhist Scholars"],
        coordinates: [66.8972, 36.7583],
      },
      {
        id: "bamiyan",
        cityName: "Bamiyan",
        region: "Central Asia",
        year: "630 CE",
        duration: "2 weeks",
        significance: "Giant Buddhas",
        narrative:
          "The colossal Buddha statues carved into the cliffsides of Bamiyan took Xuanzang's breath away. The 55-metre tall standing Buddha seemed to pierce the heavens. He recorded detailed descriptions that would become crucial historical documents.",
        historicalContext:
          "The Bamiyan Buddhas, carved in the 6th century, represented the height of Gandharan Buddhist art. The valley was a crucial passage connecting Central Asia to the Indian subcontinent.",
        relatedEvents: ["Bamiyan Buddha Construction"],
        coordinates: [67.8275, 34.8328],
      },
      {
        id: "nalanda",
        cityName: "Nalanda",
        region: "India",
        year: "631–641 CE",
        duration: "~10 years",
        significance: "Journey Destination",
        narrative:
          "At last, Xuanzang reached his ultimate destination: Nalanda, the greatest Buddhist university in the world. For nearly a decade, he studied under the aged master Śīlabhadra, mastering Sanskrit and Buddhist philosophy. He copied and collected 657 texts to bring back to China.",
        historicalContext:
          "Nalanda was a mahavihara (great monastery) that functioned as the world's first residential university. At its peak, it housed 10,000 students and 2,000 teachers, with a library of nine million manuscripts.",
        relatedPeople: ["Śīlabhadra", "Harsha"],
        relatedGoods: ["Buddhist Texts", "Manuscripts"],
        coordinates: [85.4426, 25.1360],
      },
      {
        id: "changan-return",
        cityName: "Chang'an",
        region: "China",
        year: "645 CE",
        duration: "Return",
        significance: "Triumphant Return",
        narrative:
          "Xuanzang returned to Chang'an a hero. Emperor Taizong, who had initially forbidden his journey, now welcomed him with imperial honours. The monk spent the rest of his life translating the 657 texts he had brought back, fundamentally shaping Chinese Buddhism.",
        historicalContext:
          "Xuanzang's return marked a golden age of Buddhist scholarship in China. His translations and his travel account 'Great Tang Records on the Western Regions' became invaluable historical and religious documents.",
        relatedGoods: ["Buddhist Texts", "Relics"],
        relatedPeople: ["Emperor Taizong"],
        coordinates: [108.9402, 34.2658],
      },
    ],
    insights: [
      {
        title: "Pursuit of Knowledge",
        description:
          "Xuanzang's journey exemplifies the Silk Road as a conduit for ideas. His quest for authentic Buddhist texts drove him across impossible terrain, demonstrating how religious devotion motivated some of history's greatest journeys.",
        icon: "book",
      },
      {
        title: "Diplomatic Navigation",
        description:
          "Throughout his travels, Xuanzang demonstrated remarkable diplomatic skill, earning protection from Turkic khans, Indian kings, and eventually the Tang Emperor himself through his reputation for learning and piety.",
        icon: "users",
      },
      {
        title: "Cultural Documentation",
        description:
          "His detailed observations of Central Asian and Indian societies, recorded in 'Great Tang Records on the Western Regions', provide irreplaceable historical documentation of 7th-century Asia.",
        icon: "scroll",
      },
    ],
  },
  {
    id: "marco-polo",
    name: "Marco Polo",
    title: "Venetian Merchant and Explorer",
    subtitle: "The Merchant of Wonders",
    period: "1271–1295 CE",
    startYear: 1271,
    endYear: 1295,
    origin: "Venice, Italy",
    destination: "Khanbaliq (Beijing), China",
    purpose: "Trade & Diplomatic Mission",
    image: "/images/travellers/marco-polo.png",
    ctaLabel: "Journey with the Merchant",
    shortDescription:
      "A Venetian merchant who spent 24 years travelling through Asia, serving in the court of Kublai Khan and documenting the wonders of the East in unprecedented detail.",
    fullDescription:
      "Marco Polo (1254–1324) was a Venetian merchant and explorer whose account of his travels through Asia became one of the most influential travel books in history. Accompanying his father Niccolò and uncle Maffeo on their second journey to the Mongol Empire, the young Marco spent seventeen years in the service of Kublai Khan. His book, 'Il Milione' (The Travels of Marco Polo), introduced Europeans to the advanced civilisations of the East.",
    journeySummary:
      "The Polo family journeyed overland through the Middle East, Persia, and Central Asia to reach the summer palace of Kublai Khan at Shangdu. Marco served as a diplomat and administrator throughout the Mongol Empire, travelling extensively in China and Southeast Asia. The return journey was by sea, escorting a Mongol princess to Persia.",
    totalDistance: "~24,000 km",
    totalDuration: "24 years",
    regionsVisited: ["Italy", "Persia", "Central Asia", "China", "Southeast Asia", "India"],
    keyThemes: ["Trade", "Mongol Empire", "Diplomacy", "Observation"],
    tone: "mercantile",
    accentColor: "#1E4D7B",
    stops: [
      {
        id: "venice-start",
        cityName: "Venice",
        region: "Italy",
        year: "1271 CE",
        duration: "Departure",
        significance: "Journey Origin",
        narrative:
          "From the canals of Venice, the great maritime republic, the Polo family set out on their second journey to the East. Young Marco, just seventeen, was about to embark on an adventure that would change his life and shape European understanding of Asia for centuries.",
        historicalContext:
          "Venice in the 13th century was one of Europe's wealthiest cities, its fortune built on trade with the East. The Polo brothers had already made one journey to the Mongol court and returned with a letter from Kublai Khan requesting Christian scholars and holy oil from Jerusalem.",
        relatedGoods: ["Glass", "Textiles", "Gold"],
        coordinates: [12.3155, 45.4408],
      },
      {
        id: "acre",
        cityName: "Acre",
        region: "Levant",
        year: "1271 CE",
        duration: "Several weeks",
        significance: "Crusader Port",
        narrative:
          "At Acre, the last major Crusader stronghold in the Holy Land, the Polos obtained the holy oil from Jerusalem that Kublai Khan had requested. They also received letters from the newly elected Pope Gregory X for the Great Khan.",
        historicalContext:
          "Acre was the capital of the remnant Crusader Kingdom of Jerusalem, a cosmopolitan port where European merchants traded with the Islamic world. It would fall to the Mamluks in 1291.",
        relatedGoods: ["Holy Oil", "Spices"],
        relatedEvents: ["Crusades"],
        coordinates: [35.0764, 32.9215],
      },
      {
        id: "tabriz-polo",
        cityName: "Tabriz",
        region: "Persia",
        year: "1272 CE",
        duration: "1 month",
        significance: "Persian Trading Hub",
        narrative:
          "Tabriz astounded Marco with its size and wealth. The bazaars overflowed with pearls, precious stones, and silk. He noted that merchants came from as far as India and Europe, making it one of the great commercial centres of the world.",
        historicalContext:
          "Under Ilkhanid rule, Tabriz had become the capital of the Mongol domains in Persia. The Pax Mongolica had made overland trade safer than it had been for centuries.",
        relatedGoods: ["Pearls", "Silk", "Precious Stones"],
        coordinates: [46.2919, 38.0800],
      },
      {
        id: "hormuz-polo",
        cityName: "Hormuz",
        region: "Persia",
        year: "1272 CE",
        duration: "2 weeks",
        significance: "Gateway to India",
        narrative:
          "At Hormuz, Marco observed ships arriving from India laden with spices, precious stones, and elephants. The Polos had intended to sail to China but found the ships too flimsy. They turned back to travel overland through Persia and Central Asia.",
        historicalContext:
          "Hormuz controlled the entrance to the Persian Gulf and was a crucial node in Indian Ocean trade. Merchants from India, Arabia, and East Africa met here to exchange goods.",
        relatedGoods: ["Spices", "Ivory", "Pearls"],
        coordinates: [56.4608, 27.0859],
      },
      {
        id: "balkh-polo",
        cityName: "Balkh",
        region: "Central Asia",
        year: "1273 CE",
        duration: "Several weeks",
        significance: "Ancient City",
        narrative:
          "Marco found Balkh a shadow of its former glory, devastated by Genghis Khan's armies fifty years earlier. Yet even in ruins, he could see traces of its magnificent past—crumbling palaces and empty caravanserais that spoke of former greatness.",
        historicalContext:
          "Balkh had been one of the great cities of the ancient world, but Genghis Khan's destruction in 1220 had reduced it to ruins. Under Mongol rule, it was slowly recovering.",
        relatedEvents: ["Mongol Conquest"],
        coordinates: [66.8972, 36.7583],
      },
      {
        id: "kashgar-polo",
        cityName: "Kashgar",
        region: "Central Asia",
        year: "1273 CE",
        duration: "1 month",
        significance: "Silk Road Oasis",
        narrative:
          "At Kashgar, Marco encountered a city of merchants where Muslims, Nestorian Christians, and Buddhists lived side by side. The bazaars were filled with cotton, flax, and other goods. He noted that the people were 'very fond of enjoyment'.",
        historicalContext:
          "Kashgar sat at the junction of routes around the Taklamakan Desert. It had been conquered by the Mongols but retained its character as a major trading centre with a predominantly Muslim population.",
        relatedGoods: ["Cotton", "Jade"],
        coordinates: [75.9891, 39.4547],
      },
      {
        id: "shangdu",
        cityName: "Shangdu (Xanadu)",
        region: "China",
        year: "1275 CE",
        duration: "First Meeting",
        significance: "Meeting the Khan",
        narrative:
          "After nearly four years of travel, the Polos finally reached Shangdu, Kublai Khan's magnificent summer palace. The Great Khan received them warmly, particularly fascinated by young Marco's intelligence and powers of observation. This meeting would begin seventeen years of service.",
        historicalContext:
          "Shangdu was Kublai Khan's summer capital, immortalised in Western imagination as Xanadu. The palace complex combined Mongol traditions with Chinese architecture, surrounded by a vast hunting park.",
        relatedPeople: ["Kublai Khan"],
        coordinates: [116.1819, 42.3585],
      },
      {
        id: "khanbaliq",
        cityName: "Khanbaliq (Beijing)",
        region: "China",
        year: "1275–1292 CE",
        duration: "~17 years",
        significance: "Service to the Khan",
        narrative:
          "In Khanbaliq, Marco entered the service of Kublai Khan. His linguistic abilities and curiosity made him valuable as an emissary. He travelled throughout the empire on official business, observing everything: paper money, coal, the imperial post system, and the grandeur of Chinese civilisation.",
        historicalContext:
          "Khanbaliq (modern Beijing) was Kublai Khan's winter capital and the heart of the Yuan Dynasty's administration. Marco's descriptions of its wealth and sophistication seemed so fantastic that many Europeans doubted his account.",
        relatedGoods: ["Silk", "Porcelain", "Paper Money"],
        relatedPeople: ["Kublai Khan"],
        coordinates: [116.3912, 39.9042],
      },
      {
        id: "venice-return",
        cityName: "Venice",
        region: "Italy",
        year: "1295 CE",
        duration: "Return",
        significance: "Return Home",
        narrative:
          "The Polos returned by sea, escorting a Mongol princess to Persia. When they finally reached Venice after 24 years, their family barely recognised them. Marco's tales of the East were so extraordinary that many dismissed them as fantasy—until he dictated them from a Genoese prison.",
        historicalContext:
          "Marco Polo's return coincided with a period of conflict between Venice and Genoa. Captured during a naval battle, he dictated his experiences to a fellow prisoner, Rustichello da Pisa, creating the book that would influence European exploration for centuries.",
        relatedGoods: ["Jewels", "Silk"],
        coordinates: [12.3155, 45.4408],
      },
    ],
    insights: [
      {
        title: "Mercantile Observation",
        description:
          "Marco's account is filled with detailed observations about trade goods, prices, currencies, and commercial practices. His merchant's eye captured the economic networks that connected East and West.",
        icon: "compass",
      },
      {
        title: "Pax Mongolica",
        description:
          "The Polo journeys were possible because the Mongol Empire had unified vast territories under a single administration. This 'Mongol Peace' created conditions for unprecedented East-West exchange.",
        icon: "globe",
      },
      {
        title: "Cultural Bridge",
        description:
          "Marco's book introduced Europeans to Chinese innovations like paper money, coal, and the postal system. It fired European imagination and contributed to the Age of Exploration.",
        icon: "scroll",
      },
    ],
  },
  {
    id: "ibn-battuta",
    name: "Ibn Battuta",
    title: "Islamic Scholar and Explorer",
    subtitle: "The Greatest Traveller of the Medieval World",
    period: "1325–1354 CE",
    startYear: 1325,
    endYear: 1354,
    origin: "Tangier, Morocco",
    destination: "The Islamic World and Beyond",
    purpose: "Pilgrimage, Scholarship & Exploration",
    image: "/images/travellers/ibn-battuta.png",
    ctaLabel: "Explore with the Scholar",
    shortDescription:
      "A Moroccan scholar who travelled further than any known explorer before him, journeying through the entire Islamic world and beyond over nearly thirty years.",
    fullDescription:
      "Ibn Battuta (1304–1368) was a Moroccan Berber scholar and explorer whose travels over nearly thirty years covered approximately 120,000 kilometres—more than any other explorer before the age of steam. Beginning as a pilgrimage to Mecca, his journeys expanded to encompass the entire Islamic world and beyond, from West Africa to China. His account, 'Rihla' (The Journey), provides unparalleled documentation of 14th-century Islamic civilisation.",
    journeySummary:
      "Ibn Battuta's travels began as a hajj to Mecca but evolved into a lifelong journey of exploration. He visited North Africa, the Middle East, East Africa, Central Asia, India, Southeast Asia, and China. He served as a qadi (judge) in Delhi and the Maldives, and witnessed both the splendour and turmoil of the Islamic world during the age of the Black Death.",
    totalDistance: "~120,000 km",
    totalDuration: "29 years",
    regionsVisited: ["North Africa", "Middle East", "East Africa", "Central Asia", "India", "Southeast Asia", "China", "West Africa"],
    keyThemes: ["Islam", "Legal Scholarship", "Cultural Diversity", "Social Observation"],
    tone: "exploratory",
    accentColor: "#2D5016",
    stops: [
      {
        id: "tangier-start",
        cityName: "Tangier",
        region: "North Africa",
        year: "1325 CE",
        duration: "Departure",
        significance: "Journey Origin",
        narrative:
          "At twenty-one years old, Ibn Battuta left his hometown of Tangier to perform the hajj to Mecca. Little did he know that this departure would begin nearly three decades of wandering across the known world. He left alone, 'with neither companion to delight in nor caravan to accompany'.",
        historicalContext:
          "Tangier in the 14th century was a port city under Marinid rule. Ibn Battuta came from a family of Islamic legal scholars, and his education would serve him well in the courts and mosques he would visit across the Islamic world.",
        coordinates: [-5.8326, 35.7595],
      },
      {
        id: "cairo-ibn",
        cityName: "Cairo",
        region: "Middle East",
        year: "1326 CE",
        duration: "1 month",
        significance: "Islamic Metropolis",
        narrative:
          "Cairo overwhelmed Ibn Battuta with its size and magnificence. He called it 'the mother of cities', marvelling at its mosques, markets, and madrasas. The Mamluk Sultanate was at its height, and Cairo was the intellectual and commercial heart of the Islamic world.",
        historicalContext:
          "Under Mamluk rule, Cairo was the largest city in the world outside China. It was a centre of Islamic learning, trade, and political power, controlling the lucrative spice trade between Asia and Europe.",
        relatedGoods: ["Spices", "Textiles", "Manuscripts"],
        coordinates: [31.2357, 30.0444],
      },
      {
        id: "mecca-ibn",
        cityName: "Mecca",
        region: "Arabia",
        year: "1326 CE",
        duration: "Several visits",
        significance: "Spiritual Centre",
        narrative:
          "Completing his first hajj, Ibn Battuta felt the pull that would define his travels: the desire to visit every corner of the Islamic world. He would return to Mecca multiple times, using it as a base for his expeditions and a place of spiritual renewal.",
        historicalContext:
          "Mecca was the holiest city in Islam, the destination of the annual hajj that brought together Muslims from across the world. These gatherings created networks of scholarship and trade that facilitated Ibn Battuta's later travels.",
        relatedEvents: ["Hajj Pilgrimage"],
        coordinates: [39.8579, 21.3891],
      },
      {
        id: "delhi-ibn",
        cityName: "Delhi",
        region: "India",
        year: "1334–1341 CE",
        duration: "~7 years",
        significance: "Sultanate Service",
        narrative:
          "In Delhi, Ibn Battuta entered the service of Sultan Muhammad bin Tughluq, one of the most controversial rulers of medieval India. He served as a qadi and eventually was appointed ambassador to China. His account of the Delhi Sultanate provides valuable historical documentation.",
        historicalContext:
          "The Delhi Sultanate under Muhammad bin Tughluq was one of the wealthiest states in the world but also one of the most unstable. The sultan's lavish gifts to scholars attracted Ibn Battuta, but his violent temper made service dangerous.",
        relatedPeople: ["Muhammad bin Tughluq"],
        relatedGoods: ["Textiles", "Jewels"],
        coordinates: [77.2090, 28.6139],
      },
      {
        id: "calicut",
        cityName: "Calicut",
        region: "India",
        year: "1342 CE",
        duration: "3 months",
        significance: "Spice Port",
        narrative:
          "At Calicut, Ibn Battuta witnessed the vast maritime trade of the Indian Ocean. Chinese junks, Arab dhows, and local vessels filled the harbour. He marvelled at the pepper trade and the wealthy merchants who controlled it.",
        historicalContext:
          "Calicut (Kozhikode) was one of the great spice ports of medieval India, where pepper and other spices were exchanged for gold, textiles, and horses. The Zamorin rulers maintained a cosmopolitan trading environment.",
        relatedGoods: ["Pepper", "Spices", "Textiles"],
        coordinates: [75.7804, 11.2588],
      },
      {
        id: "quanzhou",
        cityName: "Quanzhou",
        region: "China",
        year: "1345 CE",
        duration: "2 weeks",
        significance: "Chinese Port",
        narrative:
          "Ibn Battuta reached China during the declining years of Mongol Yuan rule. At Quanzhou, the great port that Marco Polo had called Zayton, he observed the enormous Chinese ships and the sophisticated urban life, though he found the land strange and uncomfortable for a Muslim.",
        historicalContext:
          "Quanzhou was one of the world's largest ports, the starting point of the Maritime Silk Road to Southeast Asia and beyond. It housed communities of Arab, Persian, and Indian merchants alongside Chinese traders.",
        relatedGoods: ["Silk", "Porcelain", "Tea"],
        coordinates: [118.5889, 24.9089],
      },
      {
        id: "timbuktu",
        cityName: "Timbuktu",
        region: "West Africa",
        year: "1352 CE",
        duration: "8 months",
        significance: "African Trading Post",
        narrative:
          "On his final great journey, Ibn Battuta crossed the Sahara to visit the Mali Empire. At Timbuktu, he found a thriving centre of Islamic learning and trans-Saharan trade, where salt from the north was exchanged for gold from the south.",
        historicalContext:
          "The Mali Empire under Mansa Sulayman was one of the wealthiest states in the world, controlling the trans-Saharan gold trade. Timbuktu was emerging as a centre of Islamic scholarship that would flourish for centuries.",
        relatedGoods: ["Gold", "Salt", "Manuscripts"],
        coordinates: [-3.0074, 16.7735],
      },
      {
        id: "tangier-return",
        cityName: "Tangier",
        region: "North Africa",
        year: "1354 CE",
        duration: "Return",
        significance: "Final Return",
        narrative:
          "After nearly thirty years of travel, Ibn Battuta finally returned home to Tangier. The Sultan of Morocco, impressed by his experiences, commanded him to dictate his travels to the scholar Ibn Juzayy. The resulting 'Rihla' preserved his extraordinary journey for posterity.",
        historicalContext:
          "Ibn Battuta returned to a Morocco ravaged by the Black Death, which had killed his mother during his absence. His account was completed in 1355 and provides one of the most comprehensive pictures of 14th-century Islamic civilisation.",
        relatedPeople: ["Ibn Juzayy"],
        coordinates: [-5.8326, 35.7595],
      },
    ],
    insights: [
      {
        title: "Islamic Network",
        description:
          "Ibn Battuta's travels demonstrate the remarkable connectivity of the 14th-century Islamic world. His credentials as a scholar and qadi opened doors from Morocco to China, revealing a shared culture spanning continents.",
        icon: "globe",
      },
      {
        title: "Social Documentation",
        description:
          "Unlike merchants focused on trade, Ibn Battuta observed daily life, customs, gender relations, and religious practices. His account provides invaluable documentation of medieval societies across three continents.",
        icon: "users",
      },
      {
        title: "Adaptability",
        description:
          "Ibn Battuta's success lay in his ability to adapt to diverse cultures while maintaining his Islamic identity. He served rulers from West Africa to Southeast Asia, each time adjusting to local customs while applying Islamic law.",
        icon: "compass",
      },
    ],
  },
]

export function getTravellerById(id: string): Traveller | undefined {
  return TRAVELLERS.find((t) => t.id === id)
}

export function getTravellerStopById(travellerId: string, stopId: string): JourneyStop | undefined {
  const traveller = getTravellerById(travellerId)
  return traveller?.stops.find((s) => s.id === stopId)
}
