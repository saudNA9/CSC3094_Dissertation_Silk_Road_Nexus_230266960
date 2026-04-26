/**
 * silk-road-data.ts
 * Silk Road Nexus — Curated Dataset v1.0
 * Creator: Saud Najem S Alnajem (230266960)
 * Newcastle University, CSC3094 Final Year Project
 * Supervisor: Dr Rouaa Yassin Kassab | Published: March 2026
 * DOI: https://doi.org/10.5281/zenodo.19684922
 * License: CC BY-NC 4.0
 */

// ─── Types ──────────────────────────────────────────────────────────────────

export type EntityType = 'City' | 'Route' | 'Person' | 'Good' | 'Event' | 'Inscription';
export type Region = 'China' | 'Central Asia' | 'Persia' | 'Levant' | 'Anatolia' | 'Arabia' | 'India' | 'East Africa';
export type Importance = 'Major' | 'Regional' | 'Minor';
export type CityRole = 'Trade Hub' | 'Religious Centre' | 'Political Capital' | 'Port City' | 'Oasis Town' | 'Cultural Centre' | 'Military Outpost';
export type RelationshipType = 'visited' | 'traded_via' | 'established' | 'connects' | 'occurred_at' | 'part_of';

export interface SilkRoadEntity {
  id: string;
  name: string;
  type: EntityType;
  region: Region;
  lat: number;
  lng: number;
  startYear: number;
  endYear: number;
  description: string;
  importance: Importance;
  source: string;
  relatedEntities?: string[];
  relatedGoods?: string[];
  relatedEvents?: string[];
  roles?: CityRole[];
  centuryNotes?: Record<string, string>;
  heroImage?: string;
  facts?: Record<string, string>;
}

export interface Relationship {
  id: string;
  sourceId: string;
  targetId: string;
  type: RelationshipType;
  historicalContext: string;
  source: string;
}

export interface RouteSegment {
  id: string;
  name: string;
  type: 'primary' | 'secondary';
  routeKind: 'land' | 'maritime';
  coordinates: [number, number][];
  startYear: number;
  endYear: number;
  description: string;
  primaryCommodities: string[];
  source: string;
}

// ─── Entities ───────────────────────────────────────────────────────────────
// Columns: entity_id, entity_type, entity_name, region, latitude, longitude,
//          start_year, end_year, short_description, image_url, primary_source

export const SILK_ROAD_ENTITIES: SilkRoadEntity[] = [
  {
    id: "xian",
    name: "Chang'an (Xi'an)",
    type: "City",
    region: "China",
    lat: 34.27,
    lng: 108.95,
    startYear: -202,
    endYear: 1500,
    description: `Where the Silk Roads began. From this imperial capital, caravans loaded with precious silk departed through the Jade Gate, beginning a journey that would end months later in Rome or Constantinople. The world came to Chang'an: Sogdian merchants, Persian envoys, Buddhist monks from India, all drawn by the promise of trade and knowledge.`,
    importance: "Major",
    source: "Frankopan (2015) ; Pleiades (2025)",
    relatedEntities: ["route-northern"],
    roles: ["Political Capital", "Trade Hub", "Cultural Centre"],
    heroImage: "https://commons.wikimedia.org/wiki/File:2023-10-07_City_wall_of_Hsi-an_西安城牆_01.jpg",
    centuryNotes: {
      "-200 to -101": `Han Emperor Wu dispatches Zhang Qian westward 138 BCE, opening first diplomatic contacts with Central Asian kingdoms. Chang'an becomes eastern anchor of Silk Roads. Chinese silk begins its westward journey for the first time.`,
      "-100 to -1": `Chang'an consolidates role as Han imperial capital and primary Silk Roads eastern terminus. Silk exports reach Parthia and eventually Rome via intermediaries. First foreign embassies from Central Asian kingdoms arrive.`,
      "100 to 199": `Eastern Han Dynasty. Chinese paper-making invented under Cai Lun c.105 CE and begins westward journey. Silk production expands under imperial monopoly.`,
      "600 to 699": `Tang Dynasty golden age. Chang'an becomes world's largest city (1,000,000+ inhabitants). Permanent colonies of Sogdian, Persian, Arab, and Indian merchants. Xuanzang departs 629 CE; returns 645 CE with Buddhist scriptures.`,
      "700 to 799": `Battle of Talas 751 CE halts Tang westward expansion. Paper-making technology spreads west via captured Chinese artisans. Chang'an remains cosmopolitan heart of Tang empire.`,
      "900 to 999": `Tang collapse 907 CE leads to Five Dynasties period. Chang'an loses imperial capital status. Trade disruption along northern routes begins.`,
      "1300 to 1399": `Ming Dynasty established 1368 CE. Chang'an rebuilt and renamed Xi'an. Serves as regional administrative centre. Zheng He's voyages 1405–1433 signal maritime ambition.`,
    },
  },
  {
    id: "dunhuang",
    name: "Dunhuang",
    type: "City",
    region: "China",
    lat: 40.14,
    lng: 94.66,
    startYear: -200,
    endYear: 1400,
    description: `The last oasis before the desert. Here, travellers from Chang'an prepared for the treacherous journey ahead, while westbound merchants paused to offer prayers at the Mogao Caves. In those caves, 50,000 manuscripts sealed for a millennium tell stories of faith, trade, and the countless souls who passed through these gates between worlds.`,
    importance: "Major",
    source: "Frankopan (2015) ; Pleiades (2025)",
    roles: ["Military Outpost", "Oasis Town", "Cultural Centre"],
    heroImage: "https://commons.wikimedia.org/wiki/File:Mogao_Caves_Dunhuang.jpg",
    centuryNotes: {
      "-100 to -1": `Han garrison established at Dunhuang as gateway to Jade Gate pass. Critical military and commercial checkpoint for Silk Roads access.`,
      "300 to 399": `Sogdian Ancient Letters 313–314 CE written by merchants stranded in Dunhuang. Earliest documentary evidence of Sogdian commercial networks along Silk Roads.`,
      "400 to 499": `Mogao Caves (Caves of the Thousand Buddhas) actively constructed. Buddhist texts and artwork accumulate. Dunhuang becomes major Buddhist intellectual centre.`,
      "600 to 699": `Tang Dynasty control. Dunhuang at peak prosperity. Mogao library cave (Cave 17) accumulates thousands of manuscripts in Chinese, Tibetan, Sanskrit, Sogdian, Uighur.`,
      "900 to 999": `Manuscripts sealed in Cave 17 c.1000 CE, protecting one of history's most important archival collections from destruction.`,
    },
  },
  {
    id: "turfan",
    name: "Turfan (Gaochang)",
    type: "City",
    region: "China",
    lat: 42.95,
    lng: 89.19,
    startYear: -200,
    endYear: 1400,
    description: `A green miracle in the desert. Underground channels called karez brought life to this harsh land, and with it came travellers seeking rest on the northern route. Buddhists, Zoroastrians, Nestorian Christians, and Muslims all found sanctuary here, a crossroads where faiths met and mingled before continuing their separate journeys.`,
    importance: "Regional",
    source: "Pleiades (2025); Frankopan (2015)",
    roles: ["Oasis Town", "Cultural Centre"],
    heroImage: "https://commons.wikimedia.org/wiki/File:Turfan_emin_minaret.jpg",
  },
  {
    id: "kashgar",
    name: "Kashgar",
    type: "City",
    region: "Central Asia",
    lat: 39.45,
    lng: 75.98,
    startYear: -200,
    endYear: 1500,
    description: `The great crossroads. At Kashgar, travellers faced a choice: north around the deadly Taklamakan Desert, or south through its treacherous edges. For two thousand years, merchants have gathered at its legendary Sunday Bazaar, a tradition that connected East and West long before borders existed.`,
    importance: "Major",
    source: "Frankopan (2015) ; Encyclopaedia Iranica",
    relatedEntities: ["route-northern", "route-southern"],
    roles: ["Trade Hub", "Oasis Town"],
    heroImage: "https://commons.wikimedia.org/wiki/File:Kashgar_old_city.jpg",
    centuryNotes: {
      "-200 to -101": `Under Han influence following Zhang Qian's missions. Critical junction where Northern and Southern routes diverge — strategically most valuable oasis position.`,
      "700 to 799": `Tang Dynasty captures Kashgar 648 CE. Battle of Talas 751 CE fought in nearby region — Arab victory ends Chinese westward expansion.`,
      "900 to 999": `Karakhanid Khanate controls Kashgar and converts to Islam. City transforms from Buddhist to Islamic centre.`,
      "1200 to 1299": `Mongol conquest integrates Kashgar into Mongol Empire. Marco Polo visits c.1273 CE and describes it as a great trading city.`,
    },
  },
  {
    id: "samarkand",
    name: "Samarkand",
    type: "City",
    region: "Central Asia",
    lat: 39.65,
    lng: 66.96,
    startYear: -300,
    endYear: 1500,
    description: `The heart of the Silk Roads. Alexander conquered it, Genghis Khan destroyed it, and Timur rebuilt it into a wonder. Through every conquest, the caravans kept coming, for Samarkand was too vital to abandon. Here, Sogdian merchants brokered deals between China and Rome, and scholars like Ibn Sina pursued knowledge that would transform the world.`,
    importance: "Major",
    source: "Frankopan (2015) ; Encyclopaedia Iranica",
    relatedEntities: ["route-northern", "bukhara"],
    roles: ["Trade Hub", "Cultural Centre", "Political Capital"],
    heroImage: "https://commons.wikimedia.org/wiki/File:Registan,_main_square_in_Samarkand.JPG",
    centuryNotes: {
      "-300 to -201": `Alexander the Great captures Samarkand (Maracanda) 329 BCE, integrating it into the Hellenistic world. Junction of multiple trade routes.`,
      "300 to 399": `Sogdian merchants based in Samarkand operate networks stretching from China to Byzantine Empire. Sogdian language becomes lingua franca of Silk Roads commerce.`,
      "700 to 799": `Arab Muslim armies conquer Samarkand 710 CE. Paper production begins following Talas 751 CE. Chinese prisoners teach paper-making; Samarkand paper becomes famous across Islamic world.`,
      "900 to 999": `Samanid Dynasty capital. Ibn Sina educated here. City is Islamic intellectual rival of Baghdad.`,
      "1200 to 1299": `Genghis Khan sacks Samarkand 1220 CE. Marco Polo visits c.1273 CE and describes great trading city.`,
      "1300 to 1399": `Timur makes Samarkand capital 1370 CE. Brings artisans from conquered territories. Registan complex constructed. City experiences cultural and architectural renaissance.`,
    },
  },
  {
    id: "bukhara",
    name: "Bukhara",
    type: "City",
    region: "Central Asia",
    lat: 39.77,
    lng: 64.42,
    startYear: -300,
    endYear: 1500,
    description: `Where knowledge was the most precious cargo. Under the Samanids, Bukhara rivalled Baghdad itself as a centre of Islamic learning. The young Ibn Sina studied in its legendary library before carrying its wisdom westward. Merchants came for silk and spices, but left carrying something far more valuable: ideas that would reshape civilisation.`,
    importance: "Major",
    source: "Frankopan (2015) ; Encyclopaedia Iranica",
    roles: ["Trade Hub", "Religious Centre", "Cultural Centre"],
    heroImage: "https://commons.wikimedia.org/wiki/File:Bukhara_old_city.jpg",
    centuryNotes: {
      "800 to 899": `Samanid Dynasty. Bukhara becomes Islamic intellectual rival to Baghdad. Persian literature flourishes. Rudaki, father of Persian poetry, active here.`,
      "900 to 999": `Ibn Sina (Avicenna) born 980 CE nearby; educated in Bukhara under Samanid patronage. Library is one of greatest in Islamic world. City at cultural zenith.`,
      "1200 to 1299": `Genghis Khan sacks Bukhara 1220 CE. Khan reportedly rides horse into main mosque. Much of population killed or enslaved.`,
    },
  },
  {
    id: "merv",
    name: "Merv (Mary)",
    type: "City",
    region: "Central Asia",
    lat: 37.66,
    lng: 62.17,
    startYear: -300,
    endYear: 1300,
    description: `A city that saw four thousand years of caravans pass through its gates. At its peak under the Seljuks, Merv was among the five greatest cities in the Islamic world, until Genghis Khan's armies silenced it forever. Its ruins now whisper of merchants, scholars, and countless journeys between Samarkand to the east and Baghdad to the west.`,
    importance: "Major",
    source: "Frankopan (2015) ; Encyclopaedia Iranica",
    relatedEntities: ["route-northern", "silk", "samarkand", "bukhara", "baghdad"],
    relatedGoods: ["Silk", "Cotton", "Carpets", "Metalwork"],
    roles: ["Trade Hub", "Political Capital"],
    heroImage: "https://commons.wikimedia.org/wiki/File:Merv_archaeological_site.jpg",
    centuryNotes: {
    "-200 to -101": `Parthian Empire makes Merv major administrative and commercial centre. Silk caravans from China pass through regularly.`,
    "600 to 699": `Arab Muslim conquest of Merv 651 CE. City becomes major centre of early Islamic world and base for eastward expansion.`,
    "1000 to 1099": `Seljuk Turks make Merv their capital. City reaches medieval peak as centre of Islamic scholarship and trade — among top 5 Islamic cities in the world.`,
    "1200 to 1299": `Genghis Khan's son Tolui destroys Merv 1221 CE in catastrophic massacre. Contemporary sources claim 1,000,000+ killed. City never fully recovers.`,
    },
  },
  {
    id: "tabriz",
    name: "Tabriz",
    type: "City",
    region: "Persia",
    lat: 38.1,
    lng: 46.29,
    startYear: 400,
    endYear: 1500,
    description: `Where East truly met West. In Tabriz's legendary bazaar, Venetian and Genoese merchants haggled alongside Chinese, Indian, and Persian traders. Both Marco Polo and Ibn Battuta marvelled at its splendour, a city where silk from China, spices from India, and gold from Africa all changed hands beneath the same ancient arches.`,
    importance: "Major",
    source: "Frankopan (2015); Encyclopaedia Iranica",
    relatedEntities: ["silk", "spices", "person-marco-polo", "person-ibn-battuta", "istanbul", "baghdad"],
    relatedGoods: ["Silk", "Spices", "Gemstones", "Textiles", "Metalwork"],
    roles: ["Trade Hub", "Political Capital"],
    heroImage: "https://commons.wikimedia.org/wiki/File:Tabriz_bazaar.jpg",
    centuryNotes: {
      "1200 to 1299": `Mongol Ilkhanate makes Tabriz capital of their Persian territories. Most cosmopolitan city in medieval world: Genoese, Venetian, Muslim, Jewish, Armenian, Chinese communities.`,
      "1300 to 1399": `Tabriz reaches medieval peak under Ilkhanate. Major terminus for goods from China, India, Mediterranean. Ibn Battuta marvels at commercial activity.`,
    },
  },
  {
    id: "baghdad",
    name: "Baghdad",
    type: "City",
    region: "Persia",
    lat: 33.34,
    lng: 44.4,
    startYear: 762,
    endYear: 1450,
    description: `The City of Peace, where all roads converged. In the House of Wisdom, scholars translated Greek philosophy, Indian mathematics, and Persian astronomy, knowledge that would one day spark Europe's Renaissance. When Mongol armies sacked Baghdad in 1258, the Tigris ran black with ink from countless burned books, ending an age of enlightenment.`,
    importance: "Major",
    source: "Frankopan (2015)",
    relatedEntities: ["merv"],
    roles: ["Political Capital", "Trade Hub", "Cultural Centre"],
    heroImage: "https://commons.wikimedia.org/wiki/File:Baghdad_Clock_Tower.jpg",
    centuryNotes: {
      "700 to 799": `Caliph al-Mansur founds Baghdad (Madinat al-Salam) 762 CE. Circular city design. Abbasid Caliphate capital.`,
      "800 to 899": `Golden Age under Harun al-Rashid and al-Ma'mun. Baghdad reaches 800,000+ population — world's largest city outside China. House of Wisdom (Bayt al-Hikma) global centre of science and translation.`,
      "1200 to 1299": `Mongol army under Hulagu Khan sacks Baghdad 1258 CE. Caliph al-Musta'sim executed. House of Wisdom destroyed. Contemporary accounts describe Tigris running black with ink from burned books.`,
    },
  },
  {
    id: "antioch",
    name: "Antioch (Antakya)",
    type: "City",
    region: "Levant",
    lat: 36.2,
    lng: 36.16,
    startYear: -300,
    endYear: 1268,
    description: `Gateway between empires. Founded by Alexander's generals, Antioch became a frontier where Byzantine and Islamic worlds collided and traded in equal measure. Silk and spices from the East passed through its markets on their way to Mediterranean ports, while Crusaders later fought to control this vital link between Constantinople and the Holy Land.`,
    importance: "Regional",
    source: "Frankopan (2015); Pleiades (2025)",
    relatedEntities: ["route-northern", "istanbul", "damascus", "alexandria"],
    relatedGoods: ["Silk", "Spices", "Incense", "Glassware"],
    roles: ["Trade Hub", "Religious Centre"],
    heroImage: "https://commons.wikimedia.org/wiki/File:Antakya_Gate.JPG",
  },
  {
    id: "istanbul",
    name: "Constantinople (Istanbul)",
    type: "City",
    region: "Anatolia",
    lat: 41.01,
    lng: 28.98,
    startYear: 330,
    endYear: 1500,
    description: `Where continents meet. Straddling Europe and Asia, Constantinople controlled the gateway that every merchant from the East had to pass. Here, Byzantine agents smuggled silkworm eggs from China, ending centuries of monopoly. When it fell to the Ottomans in 1453, European powers desperately sought new sea routes to the East, and accidentally discovered the Americas.`,
    importance: "Major",
    source: "Frankopan (2015) ; Pleiades (2025)",
    relatedEntities: ["route-northern"],
    roles: ["Political Capital", "Trade Hub", "Religious Centre"],
    heroImage: "https://commons.wikimedia.org/wiki/File:Galata_Bridge,_Constantinople,_from_HMS_Caesar_Art.IWMART4996.jpg",
    centuryNotes: {
      "300 to 399": `Emperor Constantine I founds Constantinople 330 CE as new Roman capital. Position at junction of Europe and Asia creates immediate commercial dominance.`,
      "500 to 599": `Golden age under Justinian I 527–565 CE. Byzantine agents smuggle silkworm eggs from China c.552 CE, ending Chinese silk monopoly. Hagia Sophia constructed 532–537 CE.`,
      "1200 to 1299": `Fourth Crusade sacks Constantinople 1204 CE, establishing Latin Empire. Byzantine merchants lose commercial advantages to Venetian and Genoese traders. Trebizond emerges as alternative Black Sea Silk Roads terminus.`,
      "1400 to 1499": `Ottoman Sultan Mehmed II captures Constantinople 29 May 1453 CE, ending Byzantine Empire. City renamed Istanbul. Fall triggers European search for alternative sea routes — age of exploration begins.`,
    },
  },
  {
    id: "trabzon",
    name: "Trebizond (Trabzon)",
    type: "City",
    region: "Anatolia",
    lat: 41.0,
    lng: 39.72,
    startYear: 1204,
    endYear: 1461,
    description: `The Black Sea's hidden gateway. When Crusaders sacked Constantinople in 1204, merchants found an alternative route through Trebizond. Genoese traders established colonies here, connecting Tabriz and the eastern routes to European markets while the Byzantine Empire crumbled around them.`,
    importance: "Minor",
    source: "Frankopan (2015); Encyclopaedia Iranica",
    relatedEntities: ["istanbul", "tabriz", "route-northern"],
    relatedGoods: ["Silk", "Spices", "Furs", "Slaves"],
    roles: ["Port City", "Trade Hub"],
    heroImage: "https://commons.wikimedia.org/wiki/File:Sumela_Monastery_near_Trabzon.jpg",
  },
  {
    id: "alexandria",
    name: "Alexandria",
    type: "City",
    region: "Levant",
    lat: 31.2,
    lng: 29.92,
    startYear: -330,
    endYear: 1500,
    description: `Where the Maritime Silk Road met the Mediterranean. Ships laden with Indian spices and Chinese porcelain sailed up the Red Sea to reach Alexandria's legendary harbour, guided by the Pharos Lighthouse. In its great Library, the wisdom of the ancient world was gathered, a fitting symbol for a city that connected three continents.`,
    importance: "Major",
    source: "Frankopan (2015) ; Pleiades (2025)",
    relatedEntities: ["route-maritime"],
    roles: ["Port City", "Trade Hub", "Cultural Centre"],
    heroImage: "https://commons.wikimedia.org/wiki/File:Alexandria_harbour_Egypt.jpg",
    centuryNotes: {
      "-300 to -201": `Alexander the Great founds Alexandria 331 BCE. Library and Lighthouse (Pharos) constructed. Becomes intellectual capital of Hellenistic world.`,
      "0 to 99": `Roman conquest 30 BCE. Primary source of grain and luxury goods for Rome. Indian and Arabian merchants bring spices, incense, and silk via Red Sea.`,
      "600 to 699": `Arab Muslim conquest 642 CE. City transitions from Greek-Christian to Arabic-Islamic centre.`,
      "1300 to 1399": `Under Mamluk Sultanate. Handles massive volumes of spice trade between Indian Ocean and Europe.`,
    },
  },
  {
    id: "quanzhou",
    name: "Quanzhou (Zayton)",
    type: "City",
    region: "China",
    lat: 24.87,
    lng: 118.68,
    startYear: 700,
    endYear: 1500,
    description: `The world's greatest port. During the Yuan Dynasty, more ships passed through Quanzhou than any harbour on Earth. Arab, Persian, Jewish, and Indian merchants lived side by side, their children speaking a pidgin of a dozen languages. It was from here that Marco Polo finally departed for home, his ships heavy with the treasures of Cathay.`,
    importance: "Major",
    source: "Frankopan (2015) ; Silk Road Seattle Project",
    relatedEntities: ["route-maritime"],
    roles: ["Port City", "Trade Hub"],
    heroImage: "https://commons.wikimedia.org/wiki/File:Quanzhou_harbour_coast.jpg",
    centuryNotes: {
      "900 to 999": `Growing importance as maritime trade hub. Arab and Persian merchant communities establish permanent colonies.`,
      "1200 to 1299": `Marco Polo visits c.1291 CE and describes it as one of the two greatest ports in the world. Ibn Battuta later visits and is astonished by its scale.`,
      "1300 to 1399": `Yuan (Mongol) Dynasty. Quanzhou flourishes as part of Pax Mongolica. Muslim, Nestorian Christian, Hindu, and Buddhist communities coexist. Among world's wealthiest cities.`,
    },
  },
  {
    id: "hormuz",
    name: "Hormuz",
    type: "City",
    region: "Arabia",
    lat: 27.09,
    lng: 56.46,
    startYear: 100,
    endYear: 1500,
    description: `The chokepoint of empires. Every ship carrying spices, silk, or pearls from the Indian Ocean to the Persian Gulf had to pass through Hormuz's narrow strait. Whoever controlled this rocky island controlled the flow of Eastern wealth to Western markets, a prize that Portuguese, Persian, and Arab powers fought over for centuries.`,
    importance: "Minor",
    source: "Frankopan (2015); Encyclopaedia Iranica",
    relatedEntities: ["route-maritime"],
    roles: ["Port City", "Trade Hub"],
    heroImage: "https://commons.wikimedia.org/wiki/File:Hormuz_island_strait.jpg",
  },
  {
    id: "muscat",
    name: "Muscat",
    type: "City",
    region: "Arabia",
    lat: 23.61,
    lng: 58.59,
    startYear: 100,
    endYear: 1500,
    description: `Where merchants waited for the winds. The monsoon dictated everything in Muscat — Arab, Persian, and Indian sailors gathered each season, waiting for nature's signal to set sail for distant shores. From here, ships carried frankincense and pearls to India, returning months later with spices and textiles that would travel onward to the Mediterranean world.`,
    importance: "Minor",
    source: "Frankopan (2015); Pleiades (2025)",
    relatedEntities: ["route-maritime", "hormuz", "spices", "incense"],
    relatedGoods: ["Spices", "Incense", "Pearls", "Dates", "Horses"],
    roles: ["Port City", "Trade Hub"],
    heroImage: "https://commons.wikimedia.org/wiki/File:Muscat_harbour.jpg",
  },
  {
    id: "silk",
    name: "Silk",
    type: "Good",
    region: "China",
    lat: 34.27,
    lng: 108.95,
    startYear: -200,
    endYear: 1500,
    description: `Namesake commodity of the network. Chinese production monopoly held until ~550 CE Byzantine espionage. Price in Roman markets: equivalent weight in gold. Exported via Northern, Southern, and Maritime routes.`,
    importance: "Major",
    source: "Frankopan (2015)",
    relatedEntities: ["xian", "samarkand", "istanbul", "tabriz", "route-northern", "route-southern"],
  },
  {
    id: "spices",
    name: "Spices (Pepper, Cinnamon, Nutmeg)",
    type: "Good",
    region: "India",
    lat: 10.85,
    lng: 76.27,
    startYear: -300,
    endYear: 1500,
    description: `Premium South/Southeast Asian commodities. Primary driver of maritime route development. European demand motivates age of exploration post-1453 CE.`,
    importance: "Major",
    source: "Frankopan (2015)",
    relatedEntities: ["route-maritime", "quanzhou", "hormuz", "alexandria", "tabriz", "muscat"],
  },
  {
    id: "paper",
    name: "Paper",
    type: "Good",
    region: "China",
    lat: 34.27,
    lng: 108.95,
    startYear: 100,
    endYear: 1500,
    description: `Chinese monopoly technology. Spreads westward after Battle of Talas (751 CE) via captured artisans. Enables Islamic House of Wisdom manuscript culture.`,
    importance: "Major",
    source: "Frankopan (2015)",
    relatedEntities: ["xian", "samarkand", "baghdad", "event-talas-battle"],
  },
  {
    id: "lapis",
    name: "Lapis Lazuli",
    type: "Good",
    region: "Central Asia",
    lat: 36.71,
    lng: 70.81,
    startYear: -3000,
    endYear: 1500,
    description: `Mined in Badakhshan (Afghanistan). Ultra-long-duration trade commodity: 3,000+ years documented. Used for pigment, jewellery, and luxury objects across all civilisations.`,
    importance: "Major",
    source: "Encyclopaedia Iranica",
  },
  {
    id: "glassware",
    name: "Glassware",
    type: "Good",
    region: "Levant",
    lat: 36.2,
    lng: 36.16,
    startYear: -200,
    endYear: 1500,
    description: `Roman and Islamic glass production exported eastward to Chinese courts. Demonstrates westward-to-east commodity flow, countering silk's east-to-west dominance.`,
    importance: "Major",
    source: "Frankopan (2015)",
  },
  {
    id: "porcelain",
    name: "Porcelain (Ceramics)",
    type: "Good",
    region: "China",
    lat: 24.87,
    lng: 118.68,
    startYear: 600,
    endYear: 1500,
    description: `Tang and Song dynasty ceramics. Exceptionally valued in Islamic courts. Primary driver of Song-era maritime Silk Road development. Traded via Maritime route exclusively.`,
    importance: "Major",
    source: "Frankopan (2015)",
    relatedEntities: ["quanzhou", "route-maritime", "alexandria"],
  },
  {
    id: "cotton",
    name: "Cotton",
    type: "Good",
    region: "India",
    lat: 28.66,
    lng: 77.23,
    startYear: -300,
    endYear: 1500,
    description: `Indian woven cotton cloth. Competes with Chinese silk in various markets. Drives South Asian trade network development.`,
    importance: "Major",
    source: "Frankopan (2015)",
  },
  {
    id: "ivory",
    name: "Ivory",
    type: "Good",
    region: "Central Asia",
    lat: -1.29,
    lng: 36.82,
    startYear: 100,
    endYear: 1500,
    description: `East African elephant ivory. Luxury carving material for Islamic and Chinese markets. Demonstrates integration of sub-Saharan African networks into Silk Roads.`,
    importance: "Major",
    source: "Frankopan (2015)",
  },
  {
    id: "horses",
    name: "Ferghana Horses",
    type: "Good",
    region: "Central Asia",
    lat: 40.38,
    lng: 71.78,
    startYear: -200,
    endYear: 800,
    description: `Legendary 'heavenly horses' from Ferghana Valley observed by Zhang Qian (-138 BCE). Premium military commodity for Han Dynasty campaigns. Primary motivation for Han westward expansion.`,
    importance: "Major",
    source: "Frankopan (2015)",
  },
  {
    id: "incense",
    name: "Frankincense",
    type: "Good",
    region: "Arabia",
    lat: 17.02,
    lng: 54.1,
    startYear: -300,
    endYear: 1500,
    description: `Arabian frankincense and myrrh. High-value ritual commodity for Islamic, Christian, and Buddhist ceremony. Primary commodity of Incense Route.`,
    importance: "Major",
    source: "Frankopan (2015)",
    relatedEntities: ["muscat", "alexandria", "antioch", "route-maritime"],
  },
  {
    id: "tea",
    name: "Tea",
    type: "Good",
    region: "China",
    lat: 30.0,
    lng: 102.0,
    startYear: 600,
    endYear: 1500,
    description: `Becomes major commodity post-Tang period. Drives Tea Horse Road (Chamadao) development. Exchanged for Tibetan horses — strategic barter commodity.`,
    importance: "Major",
    source: "Frankopan (2015)",
  },
  {
    id: "gold",
    name: "Gold",
    type: "Good",
    region: "Central Asia",
    lat: 33.34,
    lng: 44.4,
    startYear: -300,
    endYear: 1500,
    description: `Universal currency of exchange across entire Silk Roads period. West African gold travels trans-Saharan routes to Mediterranean Silk Roads termini.`,
    importance: "Major",
    source: "Frankopan (2015)",
  },
  {
    id: "gemstones",
    name: "Precious Stones (Rubies, Emeralds)",
    type: "Good",
    region: "Central Asia",
    lat: 38.56,
    lng: 68.77,
    startYear: -300,
    endYear: 1500,
    description: `Afghan and Central Asian gem mines. Rubies, emeralds, and sapphires traded alongside lapis lazuli. Premium luxury commodity for courts across Eurasia.`,
    importance: "Major",
    source: "Encyclopaedia Iranica",
  },
  {
    id: "manuscripts",
    name: "Manuscripts and Texts",
    type: "Good",
    region: "Central Asia",
    lat: 40.14,
    lng: 94.66,
    startYear: 300,
    endYear: 1400,
    description: `Buddhist texts, Islamic treatises, Chinese administrative records. Documents knowledge transmission as Silk Roads commodity alongside physical goods. Dunhuang library primary evidence.`,
    importance: "Major",
    source: "Silk Road Seattle Project",
  },
  {
    id: "event-zhang-qian",
    name: "Zhang Qian's Diplomatic Mission",
    type: "Event",
    region: "China",
    lat: 34.27,
    lng: 108.95,
    startYear: -138,
    endYear: -125,
    description: `Han Emperor Wu sends Zhang Qian westward to forge anti-Xiongnu alliances. Captured 10 years by Xiongnu; continues to Ferghana. Returns with intelligence on Central Asian kingdoms. Formally opens Silk Roads.`,
    importance: "Major",
    source: "Frankopan (2015)",
    relatedEntities: ["xian"],
  },
  {
    id: "event-silk-reaches-rome",
    name: "Silk Reaches Rome",
    type: "Event",
    region: "Central Asia",
    lat: 41.9,
    lng: 12.5,
    startYear: -50,
    endYear: -50,
    description: `Archaeological evidence of Chinese silk in Roman contexts. Confirms operational transcontinental trade network. Motivates Roman efforts to find direct routes to China.`,
    importance: "Major",
    source: "Frankopan (2015)",
  },
  {
    id: "event-buddhism-spread",
    name: "Spread of Buddhism via Silk Roads",
    type: "Event",
    region: "China",
    lat: 40.14,
    lng: 94.66,
    startYear: 50,
    endYear: 400,
    description: `Buddhism transmits from India through Central Asia to China. Monks and merchants carry texts along trade routes. Dunhuang becomes primary documentary archive of this process.`,
    importance: "Major",
    source: "Frankopan (2015)",
  },
  {
    id: "event-baghdad-founded",
    name: "Foundation of Baghdad",
    type: "Event",
    region: "Persia",
    lat: 33.34,
    lng: 44.4,
    startYear: 762,
    endYear: 762,
    description: `Caliph al-Mansur founds circular city 'Madinat al-Salam' on Tigris River. Designed as cosmopolitan commercial and intellectual capital. House of Wisdom established under al-Ma'mun.`,
    importance: "Major",
    source: "Frankopan (2015)",
  },
  {
    id: "event-xuanzang-pilgrimage",
    name: "Xuanzang's Pilgrimage to India",
    type: "Event",
    region: "China",
    lat: 34.27,
    lng: 108.95,
    startYear: 629,
    endYear: 645,
    description: `Buddhist monk departs Chang'an for Nalanda Monastery, India. Returns with Sanskrit texts after 16 years. Demonstrates knowledge as Silk Roads commodity; religious pilgrimage paralleling merchant travel.`,
    importance: "Major",
    source: "Frankopan (2015)",
  },
  {
    id: "event-talas-battle",
    name: "Battle of Talas",
    type: "Event",
    region: "Central Asia",
    lat: 42.52,
    lng: 72.23,
    startYear: 751,
    endYear: 751,
    description: `Tang Chinese forces defeated by Abbasid Arabs. Ends Chinese westward expansion; establishes Islamic Central Asian dominance. Paper-making technology spreads west via captured Chinese artisans.`,
    importance: "Major",
    source: "Frankopan (2015)",
    relatedEntities: ["paper", "kashgar"],
  },
  {
    id: "event-arab-conquest",
    name: "Arab Conquest of Persia",
    type: "Event",
    region: "Persia",
    lat: 33.34,
    lng: 44.4,
    startYear: 637,
    endYear: 651,
    description: `Sassanid Persian Empire conquered by Arab Muslim forces. Integrates Persian Silk Roads infrastructure into Islamic world. Establishes Islamic dominance over central Silk Roads routes.`,
    importance: "Major",
    source: "Frankopan (2015)",
  },
  {
    id: "event-mongol-pax",
    name: "Pax Mongolica",
    type: "Event",
    region: "Central Asia",
    lat: 39.65,
    lng: 66.96,
    startYear: 1250,
    endYear: 1350,
    description: `Mongol Empire maintains unprecedented security across Eurasian trade networks for ~100 years. Relay stations (yams), golden plaques (paiza), standardised weights. Peak Silk Roads trade volume.`,
    importance: "Major",
    source: "Frankopan (2015) ; Otgonbaatar (2023)",
    relatedEntities: ["route-northern"],
  },
  {
    id: "event-marco-polo-journey",
    name: "Marco Polo's Journey to Kublai Khan",
    type: "Event",
    region: "Central Asia",
    lat: 39.65,
    lng: 66.96,
    startYear: 1271,
    endYear: 1295,
    description: `Venetian merchant family travels to Yuan court; serves Khan ~17 years. Narrative (dictated to Rustichello da Pisa) documents Pax Mongolica Silk Roads in unparalleled detail.`,
    importance: "Major",
    source: "Frankopan (2015)",
  },
  {
    id: "event-ibn-battuta-journey",
    name: "Ibn Battuta's Grand Journey",
    type: "Event",
    region: "Arabia",
    lat: 21.39,
    lng: 39.86,
    startYear: 1325,
    endYear: 1354,
    description: `Moroccan jurist travels ~120,000 km across Islamic and Silk Roads networks. Serves as qadi in Delhi 1333–1341 CE. Rihla (dictated to Ibn Juzayy) is longest documented Silk Roads account.`,
    importance: "Major",
    source: "Frankopan (2015)",
  },
  {
    id: "event-mongol-sack-baghdad",
    name: "Mongol Sack of Baghdad",
    type: "Event",
    region: "Persia",
    lat: 33.34,
    lng: 44.4,
    startYear: 1258,
    endYear: 1258,
    description: `Hulagu Khan destroys Baghdad; executes Caliph al-Musta'sim. House of Wisdom destroyed. Symbolic end of Islamic golden age; paradoxically opens Pax Mongolica trade expansion.`,
    importance: "Major",
    source: "Frankopan (2015)",
    relatedEntities: ["baghdad"],
  },
  {
    id: "event-black-death-spread",
    name: "Black Death Spreads via Silk Roads",
    type: "Event",
    region: "Anatolia",
    lat: 45.03,
    lng: 35.37,
    startYear: 1346,
    endYear: 1352,
    description: `Plague spreads from Central Asia along trade routes to Caffa (Genoese Black Sea colony) and Mediterranean. Kills 75–200 million. Demonstrates negative externality of connected networks.`,
    importance: "Major",
    source: "Frankopan (2015) ; Wheelis (2002)",
    relatedEntities: ["route-maritime"],
  },
  {
    id: "event-tamerlane-campaign",
    name: "Tamerlane's Campaigns and Samarkand Renaissance",
    type: "Event",
    region: "Central Asia",
    lat: 39.65,
    lng: 66.96,
    startYear: 1370,
    endYear: 1405,
    description: `Timur conquers vast empire; makes Samarkand his showcase capital. Registan complex built. Temporarily restores overland Silk Roads security after Mongol fragmentation and plague disruption.`,
    importance: "Major",
    source: "Frankopan (2015)",
  },
  {
    id: "event-zheng-he-voyages",
    name: "Zheng He's Maritime Voyages",
    type: "Event",
    region: "China",
    lat: 24.87,
    lng: 118.68,
    startYear: 1405,
    endYear: 1433,
    description: `Seven voyages; 300+ ships; 27,000+ personnel. Chinese maritime dominance over Indian Ocean. Abrupt programme termination 1433 CE creates power vacuum later filled by European maritime powers.`,
    importance: "Major",
    source: "Frankopan (2015)",
    relatedEntities: ["quanzhou"],
  },
  {
    id: "event-fall-constantinople",
    name: "Fall of Constantinople",
    type: "Event",
    region: "Anatolia",
    lat: 41.01,
    lng: 28.98,
    startYear: 1453,
    endYear: 1453,
    description: `Ottoman Sultan Mehmed II captures Constantinople 29 May 1453 CE. Ends Byzantine Empire after 1,123 years. Triggers European search for alternative sea routes to Asia — age of exploration begins.`,
    importance: "Major",
    source: "Frankopan (2015)",
    relatedEntities: ["istanbul"],
  },
  {
    id: "person-zhang-qian",
    name: "Zhang Qian",
    type: "Person",
    region: "China",
    lat: 34.27,
    lng: 108.95,
    startYear: -164,
    endYear: -114,
    description: `Han diplomat and explorer. Dispatched 138 BCE by Emperor Wu. Captured by Xiongnu 10 years. Reaches Ferghana and Central Asian kingdoms. Returns 125 BCE. Formally opens Silk Roads.`,
    importance: "Major",
    source: "Frankopan (2015)",
    relatedEntities: ["route-northern", "kashgar"],
  },
  {
    id: "person-xuanzang",
    name: "Xuanzang",
    type: "Person",
    region: "China",
    lat: 34.27,
    lng: 108.95,
    startYear: 602,
    endYear: 664,
    description: `Tang Buddhist monk. Pilgrimage to India 629–645 CE via Kashgar, Samarkand. Studies at Nalanda. Returns with Sanskrit texts. Translations transform Chinese Buddhism.`,
    importance: "Major",
    source: "Frankopan (2015)",
    relatedEntities: ["kashgar", "samarkand", "turfan"],
  },
  {
    id: "person-marco-polo",
    name: "Marco Polo",
    type: "Person",
    region: "Levant",
    lat: 38.1,
    lng: 46.29,
    startYear: 1254,
    endYear: 1324,
    description: `Venetian merchant. Travels with father and uncle to Kublai Khan's court 1271–1295 CE. Serves Khan ~17 years. Narrative dictated to Rustichello da Pisa. Primary European source for Silk Roads geography.`,
    importance: "Major",
    source: "Frankopan (2015)",
    relatedEntities: ["kashgar", "samarkand", "tabriz", "quanzhou"],
  },
  {
    id: "person-ibn-battuta",
    name: "Ibn Battuta",
    type: "Person",
    region: "Central Asia",
    lat: 35.76,
    lng: -5.8,
    startYear: 1304,
    endYear: 1368,
    description: `Moroccan jurist. Departs Tangier 1325 CE for Hajj; extends journey to ~120,000 km. Delhi qadi 1333–1341 CE. Rihla (dictated to Ibn Juzayy) — longest documented Silk Roads journey.`,
    importance: "Major",
    source: "Frankopan (2015)",
    relatedEntities: ["city-mecca", "baghdad", "quanzhou", "istanbul"],
  },
  {
    id: "person-al-masudi",
    name: "Al-Masudi",
    type: "Person",
    region: "Central Asia",
    lat: 33.34,
    lng: 44.4,
    startYear: 896,
    endYear: 956,
    description: `Arab geographer and historian. Writes Meadows of Gold (Muruj al-dhahab). Comprehensive documentation of Islamic-era Silk Roads geography, trade networks, and cultural geography.`,
    importance: "Regional",
    source: "Encyclopaedia Iranica",
  },
  {
    id: "person-genghis",
    name: "Genghis Khan",
    type: "Person",
    region: "Central Asia",
    lat: 48.02,
    lng: 106.92,
    startYear: 1162,
    endYear: 1227,
    description: `Founder and first Khan of Mongol Empire. Unifies Mongol tribes; conquests create political framework enabling Pax Mongolica. Samarkand and Merv sacked; millions killed.`,
    importance: "Major",
    source: "Frankopan (2015)",
    relatedEntities: ["samarkand"],
  },
  {
    id: "person-kublai",
    name: "Kublai Khan",
    type: "Person",
    region: "Central Asia",
    lat: 34.27,
    lng: 108.95,
    startYear: 1215,
    endYear: 1294,
    description: `Grandson of Genghis Khan. Establishes Yuan Dynasty in China. Rules during peak Pax Mongolica. Marco Polo serves at his court ~17 years. Quanzhou Maritime Silk Road flourishes under his reign.`,
    importance: "Major",
    source: "Frankopan (2015)",
  },
  {
    id: "person-tamerlane",
    name: "Timur (Tamerlane)",
    type: "Person",
    region: "Central Asia",
    lat: 39.65,
    lng: 66.96,
    startYear: 1336,
    endYear: 1405,
    description: `Timurid conqueror and cultural patron. Makes Samarkand showcase capital. Registan complex. Temporarily restores Silk Roads security. Sacks Delhi 1398 CE, Baghdad 1401 CE.`,
    importance: "Major",
    source: "Frankopan (2015)",
    relatedEntities: ["samarkand"],
  },
  {
    id: "person-zheng-he",
    name: "Zheng He",
    type: "Person",
    region: "China",
    lat: 24.87,
    lng: 118.68,
    startYear: 1371,
    endYear: 1433,
    description: `Chinese Muslim admiral. Commands seven treasure fleet voyages (1405–1433 CE). 300+ ships; reaches East Africa. Programme terminates abruptly 1433 CE — Chinese withdrawal from maritime expansion.`,
    importance: "Major",
    source: "Frankopan (2015)",
    relatedEntities: ["route-maritime"],
  },
  {
    id: "person-rabban-sauma",
    name: "Rabban Sauma",
    type: "Person",
    region: "Central Asia",
    lat: 34.27,
    lng: 108.95,
    startYear: 1220,
    endYear: 1294,
    description: `Nestorian Christian monk from Central Asia. Travels to Rome as Mongol-era diplomatic emissary. Documents religious pluralism and multi-faith coexistence on Silk Roads.`,
    importance: "Major",
    source: "Silk Road Seattle Project",
  },
  {
    id: "person-al-idrisi",
    name: "Al-Idrisi",
    type: "Person",
    region: "Central Asia",
    lat: 35.76,
    lng: -5.8,
    startYear: 1100,
    endYear: 1165,
    description: `Arab-Sicilian cartographer at Norman court in Palermo. Produces detailed world map (Tabula Rogeriana, 1154 CE). Documents Mediterranean-Silk Roads geographic interface.`,
    importance: "Regional",
    source: "Encyclopaedia Iranica",
  },
  {
    id: "person-william",
    name: "William of Rubruck",
    type: "Person",
    region: "Levant",
    lat: 51.18,
    lng: 71.45,
    startYear: 1220,
    endYear: 1293,
    description: `Flemish Franciscan friar. Travels to Mongol court as diplomatic mission 1253–1255 CE. Documents Mongol political structures and Silk Roads logistics from Christian European perspective.`,
    importance: "Minor",
    source: "Silk Road Seattle Project",
  },
  {
    id: "person-cosmas",
    name: "Cosmas Indicopleustes",
    type: "Person",
    region: "Levant",
    lat: 29.92,
    lng: 31.2,
    startYear: 490,
    endYear: 550,
    description: `Alexandrian merchant-turned-monk. Writes Christian Topography documenting Red Sea–Indian Ocean trade routes. Pre-Islamic primary source for early maritime Silk Roads structure.`,
    importance: "Minor",
    source: "Encyclopaedia Iranica",
  },
  {
    id: "person-avicenna",
    name: "Ibn Sina (Avicenna)",
    type: "Person",
    region: "Persia",
    lat: 39.77,
    lng: 64.42,
    startYear: 980,
    endYear: 1037,
    description: `Persian polymath educated in Bukhara. Canon of Medicine (al-Qanun). Philosopher, physician, scientist. Exemplifies knowledge networks enabled by Silk Roads intellectual exchange.`,
    importance: "Major",
    source: "Encyclopaedia Iranica",
    relatedEntities: ["bukhara"],
  },
  {
    id: "inscr-sogdian",
    name: "Sogdian Ancient Letters",
    type: "Inscription",
    region: "China",
    lat: 40.14,
    lng: 94.66,
    startYear: 313,
    endYear: 314,
    description: `Four merchant letters on wood sealed in Dunhuang, discovered by Aurel Stein 1907. Written 313–314 CE by stranded merchants. Earliest documentary evidence of Sogdian commercial networks.`,
    importance: "Major",
    source: "Encyclopaedia Iranica; Sogdians (Smithsonian 2025)",
    relatedEntities: ["dunhuang"],
  },
  {
    id: "inscr-dunhuang",
    name: "Dunhuang Manuscripts",
    type: "Inscription",
    region: "China",
    lat: 40.14,
    lng: 94.66,
    startYear: 400,
    endYear: 1000,
    description: `~50,000 manuscripts in Cave 17, sealed c.1000 CE. Languages: Chinese, Tibetan, Sanskrit, Sogdian, Uighur. World's largest medieval Silk Roads documentary archive. Opened by Stein 1907, Pelliot 1906.`,
    importance: "Major",
    source: "Silk Road Seattle Project; Encyclopaedia Iranica",
    relatedEntities: ["dunhuang"],
  },
  {
    id: "inscr-orkhon",
    name: "Orkhon Inscriptions (Kultegin)",
    type: "Inscription",
    region: "Central Asia",
    lat: 47.55,
    lng: 102.83,
    startYear: 732,
    endYear: 735,
    description: `Bilingual stone inscriptions (Old Turkic + Chinese) for Turkic Khagan Kultegin. Earliest Turkic writing system. Documents Turkic Khaganate political history and trade relationships.`,
    importance: "Minor",
    source: "Encyclopaedia Iranica",
  },
  {
    id: "inscr-bezeklik",
    name: "Bezeklik Cave Inscriptions",
    type: "Inscription",
    region: "China",
    lat: 42.95,
    lng: 89.19,
    startYear: 700,
    endYear: 900,
    description: `Uyghur, Sogdian, and Chinese inscriptions in Bezeklik cave system near Turfan. Documents Uyghur Khanate administration and Buddhist monastery operations under multilingual coexistence.`,
    importance: "Minor",
    source: "Silk Road Seattle Project; Encyclopaedia Iranica",
    relatedEntities: ["turfan"],
  },
  {
    id: "inscr-nishapur",
    name: "Nishapur Pottery Inscriptions",
    type: "Inscription",
    region: "Persia",
    lat: 36.21,
    lng: 58.8,
    startYear: 900,
    endYear: 1100,
    description: `Arabic and Persian Kufic-script inscriptions on Nishapur ceramics. Documents pottery production, trade markings, and merchant names. Evidence of non-elite artisan participation in Silk Roads.`,
    importance: "Minor",
    source: "Encyclopaedia Iranica",
  },
  // ─── Routes as Entities ─────────────────────────────────────────────────────
  {
    id: "route-northern",
    name: "Northern Silk Road",
    type: "Route",
    region: "Central Asia",
    lat: 41.0,
    lng: 75.0,
    startYear: -200,
    endYear: 1400,
    description: `The primary overland artery of the Silk Roads, stretching from Chang'an through the Tarim Basin, across Central Asian oases, to Constantinople. Continuously documented from Han Dynasty to late medieval period. Peak trade volume during Pax Mongolica (1250–1350 CE). Known for silk, paper, ceramics, horses, and spices.`,
    importance: "Major",
    source: "Frankopan (2015)",
    relatedEntities: ["changan", "turfan", "kashgar", "samarkand", "constantinople"],
  },
  {
    id: "route-southern",
    name: "Southern Silk Road",
    type: "Route",
    region: "South Asia",
    lat: 35.0,
    lng: 70.0,
    startYear: -100,
    endYear: 1400,
    description: `Southern Tarim Basin route connecting Chinese production centres to the Indian subcontinent and Arabian Sea maritime networks. Critical for cotton, indigo, and spice trade. Linked the wealth of India with Chinese luxury goods.`,
    importance: "Major",
    source: "Frankopan (2015)",
    relatedEntities: ["changan", "kashgar", "hormuz", "baghdad"],
  },
  {
    id: "route-maritime",
    name: "Maritime Silk Road",
    type: "Route",
    region: "Maritime",
    lat: 15.0,
    lng: 80.0,
    startYear: 700,
    endYear: 1500,
    description: `The great sea route across the Indian Ocean, connecting China's southern ports to India, Arabia, and Africa. Monsoon-dependent sailing patterns. Dominated post-Song period trade. Enabled extraordinary porcelain and spice trade volumes during Yuan Dynasty. Zheng He's treasure fleets sailed these waters.`,
    importance: "Major",
    source: "Frankopan (2015)",
    relatedEntities: ["quanzhou", "hormuz", "alexandria", "zheng-he"],
  },
  {
    id: "route-steppe",
    name: "Great Steppe Route",
    type: "Route",
    region: "Central Asia",
    lat: 50.0,
    lng: 70.0,
    startYear: 200,
    endYear: 1350,
    description: `Nomadic pastoralist routes across the vast Central Asian steppes. Critical under Pax Mongolica for connecting Mongol power centres to main Silk Roads. Carried silk, furs, horses, and slaves. The highway of the Mongol Empire.`,
    importance: "Minor",
    source: "Frankopan (2015)",
    relatedEntities: ["samarkand", "kublai-khan", "pax-mongolica"],
  },
  {
    id: "route-persian",
    name: "Persian Royal Road",
    type: "Route",
    region: "Middle East",
    lat: 35.0,
    lng: 45.0,
    startYear: -500,
    endYear: 330,
    description: `Achaemenid-era overland route predating the Silk Roads. Built by Darius I for rapid communication across the Persian Empire. This infrastructure was later repurposed by Silk Roads merchants, demonstrating how ancient administrative networks enabled later trade.`,
    importance: "Minor",
    source: "Encyclopaedia Iranica",
    relatedEntities: ["baghdad", "antioch"],
  },
  {
    id: "route-incense",
    name: "Incense Route",
    type: "Route",
    region: "Arabia",
    lat: 20.0,
    lng: 45.0,
    startYear: -300,
    endYear: 600,
    description: `Southern Arabian Peninsula route carrying frankincense and myrrh northward to Mediterranean markets. Demonstrates non-textile trade motivations for long-distance exchange. Arabian merchants grew wealthy controlling this precious aromatic trade.`,
    importance: "Minor",
    source: "Frankopan (2015)",
    relatedEntities: ["frankincense", "antioch"],
  },
  {
    id: "route-lapis",
    name: "Lapis Lazuli Route",
    type: "Route",
    region: "Central Asia",
    lat: 36.0,
    lng: 68.0,
    startYear: -3000,
    endYear: 500,
    description: `One of humanity's oldest trade routes, carrying the brilliant blue lapis lazuli from Afghan mines to Mesopotamia and Egypt since 3000 BCE. Pre-dates formal Silk Roads by millennia, demonstrating ancient humanity's desire for precious materials.`,
    importance: "Minor",
    source: "Encyclopaedia Iranica",
    relatedEntities: ["lapis-lazuli", "baghdad"],
  },
  {
    id: "route-tea",
    name: "Tea Horse Road (Chamadao)",
    type: "Route",
    region: "China",
    lat: 30.0,
    lng: 100.0,
    startYear: 600,
    endYear: 1400,
    description: `Southwestern commodity-specific route where Chinese tea was exchanged for Tibetan war horses. One of the world's highest and most treacherous trade routes, crossing mountains above 4,000 meters. Documents internal Chinese Silk Roads networks.`,
    importance: "Minor",
    source: "Frankopan (2015)",
    relatedEntities: ["tea", "changan"],
  },
  {
    id: "route-amber",
    name: "Amber Road",
    type: "Route",
    region: "Europe",
    lat: 52.0,
    lng: 18.0,
    startYear: -1000,
    endYear: 500,
    description: `Northern European route connecting Baltic amber deposits to Mediterranean and Silk Roads markets. Demonstrates how regional exchange networks integrated with trans-Eurasian trade, creating a truly global ancient economy.`,
    importance: "Minor",
    source: "Hansen (2012)",
    relatedEntities: ["constantinople"],
  },
  {
    id: "route-trans-saharan",
    name: "Trans-Saharan Route",
    type: "Route",
    region: "Africa",
    lat: 25.0,
    lng: 5.0,
    startYear: 300,
    endYear: 1500,
    description: `African caravan routes connecting sub-Saharan gold, slaves, and ivory to Mediterranean markets. Integrated African wealth into broader Silk Roads economy. Timbuktu emerged as a major terminus and center of Islamic learning.`,
    importance: "Minor",
    source: "Frankopan (2015)",
    relatedEntities: ["alexandria", "gold"],
  },
  {
    id: "route-jade",
    name: "Jade Road",
    type: "Route",
    region: "China",
    lat: 38.0,
    lng: 80.0,
    startYear: -2000,
    endYear: 200,
    description: `Ancient route bringing precious nephrite jade from Khotan to Chinese imperial courts. Jade held supreme spiritual and political significance in Chinese civilization. This prehistoric trade laid foundations for later Silk Roads networks.`,
    importance: "Minor",
    source: "Hansen (2012)",
    relatedEntities: ["changan", "kashgar"],
  },
  {
    id: "route-spice",
    name: "Spice Trade Route",
    type: "Route",
    region: "Maritime",
    lat: 10.0,
    lng: 100.0,
    startYear: 100,
    endYear: 1500,
    description: `Maritime routes bringing pepper, cinnamon, cloves, and nutmeg from Southeast Asian spice islands to global markets. These precious aromatics were worth more than gold. Spice trade motivated European Age of Exploration.`,
    importance: "Minor",
    source: "Frankopan (2015)",
    relatedEntities: ["spices", "quanzhou", "hormuz"],
  },
  {
    id: "route-paper",
    name: "Paper Road",
    type: "Route",
    region: "Central Asia",
    lat: 39.0,
    lng: 66.0,
    startYear: 751,
    endYear: 1200,
    description: `Route of knowledge transmission after the Battle of Talas (751 CE), when Chinese papermaking secrets spread westward. Samarkand became a major paper production center. This technology transfer revolutionized Islamic and European civilization.`,
    importance: "Minor",
    source: "Frankopan (2015)",
    relatedEntities: ["paper", "samarkand", "baghdad", "battle-of-talas"],
  },
];

// ─���─ Routes ────────────────────────────────────────────────────────────────
export const SILK_ROAD_ROUTES: RouteSegment[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // PRIMARY ROUTES - The main arteries of the Silk Roads
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "route-northern",
    name: "Northern Silk Road",
    type: "primary",
    routeKind: "land",
    // All coordinates MUST match city entity lat/lng exactly: [lng, lat]
    coordinates: [
      [108.95, 34.27], // Chang'an (Xi'an) - xian entity
      [94.66, 40.14],  // Dunhuang - dunhuang entity
      [89.19, 42.95],  // Turfan - turfan entity
      [75.98, 39.45],  // Kashgar - kashgar entity
      [66.96, 39.65],  // Samarkand - samarkand entity
      [64.42, 39.77],  // Bukhara - bukhara entity
      [62.17, 37.66],  // Merv - merv entity
      [46.29, 38.1],   // Tabriz - tabriz entity
      [44.4, 33.34],   // Baghdad - baghdad entity
      [36.16, 36.2],   // Antioch - antioch entity
      [28.98, 41.01],  // Constantinople - istanbul entity
    ],
    startYear: -200,
    endYear: 1400,
    description: `Primary overland artery from China to the Mediterranean. Continuously documented from Han Dynasty to late medieval period.`,
    primaryCommodities: ["Silk", "paper", "ceramics", "horses", "spices"],
    source: "Frankopan (2015)",
  },
  {
    id: "route-southern",
    name: "Southern Silk Road",
    type: "primary",
    routeKind: "land",
    // Chang'an → Dunhuang → Khotan → Kabul → Peshawar → Delhi → connects to maritime
    // Coordinates MUST match city entity positions exactly
    coordinates: [
      [108.95, 34.27], // Chang'an - matches xian entity
      [94.66, 40.14],  // Dunhuang - matches dunhuang entity
      [79.93, 37.11],  // Khotan - matches khotan entity
      [69.17, 34.53],  // Kabul
      [71.58, 34.01],  // Peshawar
      [77.21, 28.61],  // Delhi
      [72.88, 19.08],  // Mumbai area
    ],
    startYear: -100,
    endYear: 1400,
    description: `Southern route through the Tarim Basin to India. Key connection to South Asian trade networks.`,
    primaryCommodities: ["Silk", "spices", "cotton", "indigo", "gems"],
    source: "Frankopan (2015)",
  },
  {
    id: "route-maritime",
    name: "Maritime Silk Road",
    type: "primary",
    routeKind: "maritime",
    // All coordinates MUST match city entity lat/lng exactly: [lng, lat]
    coordinates: [
      [118.68, 24.87], // Quanzhou - quanzhou entity
      [110.35, 20.02], // Hainan
      [103.82, 1.35],  // Singapore/Malacca
      [80.23, 6.03],   // Sri Lanka (Colombo)
      [72.88, 19.08],  // Mumbai
      [58.59, 23.61],  // Muscat - muscat entity
      [56.46, 27.09],  // Hormuz - hormuz entity
      [45.02, 12.79],  // Aden
      [29.92, 31.2],   // Alexandria - alexandria entity
    ],
    startYear: 700,
    endYear: 1500,
    description: `Indian Ocean sea route connecting China to Arabia and Africa. Monsoon-dependent sailing.`,
    primaryCommodities: ["Porcelain", "spices", "pearls", "silk", "aromatics"],
    source: "Frankopan (2015)",
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // SECONDARY ROUTES - Regional and specialized trade routes
  // ═════════════════════���═════════════════════════════════════════════════════
  {
    id: "route-steppe",
    name: "Great Steppe Route",
    type: "secondary",
    routeKind: "land",
    // Across the Eurasian Steppe grasslands - horizontal band ~45-50°N
    coordinates: [
      [116.4, 39.9],   // Beijing
      [111.5, 43.8],   // Inner Mongolia
      [106.9, 47.9],   // Ulaanbaatar, Mongolia
      [87.6, 43.8],    // Urumqi
      [76.9, 43.2],    // Almaty, Kazakhstan
      [69.0, 41.3],    // Tashkent
      [66.96, 39.65],  // Samarkand
    ],
    startYear: 200,
    endYear: 1350,
    description: `Nomadic pastoralist routes across Central Asian steppes. Critical during Mongol Empire.`,
    primaryCommodities: ["Silk", "furs", "horses", "slaves"],
    source: "Frankopan (2015)",
  },
  {
    id: "route-persian",
    name: "Persian Royal Road",
    type: "secondary",
    routeKind: "land",
    // Susa → Babylon → across Anatolia → Sardis
    coordinates: [
      [48.26, 32.19],  // Susa, Iran
      [44.4, 33.34],   // Baghdad/Babylon
      [43.0, 36.34],   // Mosul/Nineveh
      [39.72, 39.9],   // Eastern Anatolia
      [32.86, 39.93],  // Ankara
      [28.22, 38.41],  // Sardis
    ],
    startYear: -500,
    endYear: 330,
    description: `Achaemenid Persian Empire's royal highway. Pre-dates formal Silk Roads.`,
    primaryCommodities: ["Luxury goods", "administrative dispatches", "precious metals"],
    source: "Encyclopaedia Iranica",
  },
  {
    id: "route-incense",
    name: "Incense Route",
    type: "secondary",
    routeKind: "land",
    // Yemen/Oman → up Arabian Peninsula → Petra → Gaza
    coordinates: [
      [49.0, 16.0],    // Hadramaut, Yemen (frankincense region)
      [45.32, 17.02],  // Sana'a area
      [44.2, 21.4],    // Mecca area
      [39.0, 27.5],    // Medina area
      [35.48, 30.33],  // Petra, Jordan
      [34.47, 31.50],  // Gaza
    ],
    startYear: -300,
    endYear: 600,
    description: `Southern Arabian Peninsula route for frankincense and myrrh to Mediterranean.`,
    primaryCommodities: ["Frankincense", "myrrh", "aromatics", "spices"],
    source: "Frankopan (2015)",
  },
  {
    id: "route-lapis",
    name: "Lapis Lazuli Route",
    type: "secondary",
    routeKind: "land",
    // Badakhshan → Balkh → Merv → Mesopotamia
    coordinates: [
      [70.81, 36.71],  // Badakhshan, Afghanistan (lapis mines)
      [66.9, 36.76],   // Balkh
      [62.17, 37.66],  // Merv
      [44.4, 33.34],   // Baghdad/Babylon
    ],
    startYear: -3000,
    endYear: 500,
    description: `Prehistoric mineral route from Afghan mines. Pre-dates Silk Roads by millennia.`,
    primaryCommodities: ["Lapis lazuli", "gemstones"],
    source: "Encyclopaedia Iranica",
  },
  {
    id: "route-tea",
    name: "Tea Horse Road",
    type: "secondary",
    routeKind: "land",
    // Chengdu → through Sichuan mountains → Lhasa → Nepal
    coordinates: [
      [104.07, 30.67], // Chengdu
      [102.27, 27.90], // Lijiang
      [100.23, 26.87], // Dali
      [91.17, 29.65],  // Lhasa
      [85.32, 27.72],  // Kathmandu
    ],
    startYear: 600,
    endYear: 1400,
    description: `Southwestern route through Tibet. Tea exchanged for horses.`,
    primaryCommodities: ["Tea", "horses", "salt"],
    source: "Frankopan (2015)",
  },
  {
    id: "route-volga",
    name: "Volga Trade Route",
    type: "secondary",
    routeKind: "land",
    // Scandinavia → Novgorod → down Volga River → Caspian → Persia
    coordinates: [
      [18.07, 59.33],  // Stockholm
      [31.27, 58.52],  // Novgorod
      [44.0, 56.32],   // Nizhny Novgorod
      [49.1, 53.2],    // Kazan
      [51.53, 46.35],  // Astrakhan (Volga delta)
      [49.87, 40.41],  // Baku
      [51.42, 35.7],   // Tehran
    ],
    startYear: 800,
    endYear: 1400,
    description: `Viking-era route from Scandinavia via Volga River to Caspian Sea and Persia.`,
    primaryCommodities: ["Furs", "amber", "slaves", "silver"],
    source: "Frankopan (2015)",
  },
  {
    id: "route-indian-ocean",
    name: "Red Sea Route",
    type: "secondary",
    routeKind: "maritime",
    // Egypt → Red Sea → Aden → India (early Roman-era route)
    coordinates: [
      [32.55, 29.97],  // Suez/Alexandria
      [34.45, 27.23],  // Hurghada
      [38.5, 21.5],    // Jeddah
      [45.02, 12.79],  // Aden
      [56.27, 25.29],  // Hormuz
    ],
    startYear: 100,
    endYear: 700,
    description: `Early Roman-era maritime route connecting Egypt to India via Red Sea.`,
    primaryCommodities: ["Spices", "cotton", "ivory", "incense"],
    source: "Frankopan (2015)",
  },
  {
    id: "route-trans-saharan",
    name: "Trans-Saharan Route",
    type: "secondary",
    routeKind: "land",
    // Timbuktu → across Sahara → Morocco → Mediterranean
    coordinates: [
      [-3.0, 16.77],   // Timbuktu
      [-5.0, 22.0],    // Sahara crossing
      [-6.84, 34.02],  // Fez, Morocco
      [10.18, 36.81],  // Tunis
      [29.92, 31.2],   // Alexandria
    ],
    startYear: 300,
    endYear: 1500,
    description: `Sub-Saharan gold and salt routes connecting West Africa to Mediterranean.`,
    primaryCommodities: ["Gold", "salt", "ivory", "slaves"],
    source: "Frankopan (2015)",
  },
  {
    id: "route-black-sea",
    name: "Black Sea Route",
    type: "secondary",
    routeKind: "land",
    // Tabriz → Trabzon → Constantinople (Black Sea trade corridor)
    // All coordinates MUST match city entity lat/lng exactly: [lng, lat]
    coordinates: [
      [46.29, 38.1],   // Tabriz - tabriz entity
      [39.72, 41.0],   // Trebizond - trabzon entity
      [28.98, 41.01],  // Constantinople - istanbul entity
    ],
    startYear: 1204,
    endYear: 1461,
    description: `Black Sea trade route via Trebizond. Key corridor during Mongol period when direct overland routes were disrupted.`,
    primaryCommodities: ["Silk", "spices", "gems", "slaves"],
    source: "Frankopan (2015)",
  },
  {
    id: "route-via-egnatia",
    name: "Via Egnatia",
    type: "secondary",
    routeKind: "land",
    // Constantinople → Thessaloniki → across Macedonia → Durrës (Adriatic)
    coordinates: [
      [28.98, 41.01],  // Constantinople - istanbul entity
      [22.94, 40.64],  // Thessaloniki
      [20.8, 39.65],   // Ioannina
      [19.45, 41.33],  // Durrës, Albania
    ],
    startYear: -146,
    endYear: 1200,
    description: `Roman road from Constantinople to the Adriatic. Western terminus of Silk Roads.`,
    primaryCommodities: ["All Silk Roads commodities"],
    source: "Pleiades (2025)",
  },
  {
    id: "route-amber",
    name: "Amber Road",
    type: "secondary",
    routeKind: "land",
    // Baltic → through Central Europe → Aquileia (Adriatic)
    coordinates: [
      [19.42, 54.35],  // Gdansk (Baltic amber source)
      [17.03, 51.11],  // Wroclaw
      [14.44, 50.08],  // Prague
      [16.37, 48.21],  // Vienna
      [13.77, 45.65],  // Aquileia, Italy
    ],
    startYear: -300,
    endYear: 400,
    description: `Northern European route for Baltic amber to the Mediterranean.`,
    primaryCommodities: ["Amber", "tin", "furs"],
    source: "Pleiades (2025)",
  },
];

// ─── Relationships ─────────────────────────────────────────────────────────
export const SILK_ROAD_RELATIONSHIPS: Relationship[] = [
  {
    id: "rel-001",
    sourceId: "person-zhang-qian",
    targetId: "route-northern",
    type: "established",
    historicalContext: `Zhang Qian's 138 BCE mission formally initiates Han diplomatic protocols on Northern Route.`,
    source: "Frankopan (2015)",
  },
  {
    id: "rel-002",
    sourceId: "person-zhang-qian",
    targetId: "kashgar",
    type: "visited",
    historicalContext: `Zhang Qian reaches Kashgar as westernmost point of 138 BCE mission — first documented Han contact with Tarim Basin.`,
    source: "Frankopan (2015)",
  },
  {
    id: "rel-003",
    sourceId: "person-marco-polo",
    targetId: "kashgar",
    type: "visited",
    historicalContext: `Marco Polo passes through Kashgar en route to Kublai Khan's court, c.1273 CE.`,
    source: "Frankopan (2015)",
  },
  {
    id: "rel-004",
    sourceId: "person-marco-polo",
    targetId: "samarkand",
    type: "visited",
    historicalContext: `Marco Polo passes through Samarkand, c.1273 CE. Describes it in his narrative.`,
    source: "Frankopan (2015)",
  },
  {
    id: "rel-005",
    sourceId: "person-marco-polo",
    targetId: "tabriz",
    type: "visited",
    historicalContext: `Marco Polo visits Tabriz; describes it as a great commercial city — 'merchandise of great value.'`,
    source: "Frankopan (2015)",
  },
  {
    id: "rel-006",
    sourceId: "person-marco-polo",
    targetId: "quanzhou",
    type: "visited",
    historicalContext: `Marco Polo departs China via Quanzhou c.1291 CE, escorting Mongol princess to Persia by sea.`,
    source: "Frankopan (2015)",
  },
  {
    id: "rel-007",
    sourceId: "person-ibn-battuta",
    targetId: "city-mecca",
    type: "visited",
    historicalContext: `Ibn Battuta departs Tangier 1325 CE for Hajj to Mecca; returns multiple times across his 29-year journey.`,
    source: "Frankopan (2015)",
  },
  {
    id: "rel-008",
    sourceId: "person-ibn-battuta",
    targetId: "baghdad",
    type: "visited",
    historicalContext: `Ibn Battuta visits Baghdad during his Mesopotamian travels.`,
    source: "Frankopan (2015)",
  },
  {
    id: "rel-009",
    sourceId: "person-ibn-battuta",
    targetId: "quanzhou",
    type: "visited",
    historicalContext: `Ibn Battuta visits Quanzhou and marvels at the scale of its harbour and merchant activity.`,
    source: "Frankopan (2015)",
  },
  {
    id: "rel-010",
    sourceId: "person-ibn-battuta",
    targetId: "istanbul",
    type: "visited",
    historicalContext: `Ibn Battuta visits Constantinople c.1332 CE at invitation of Byzantine Empress.`,
    source: "Frankopan (2015)",
  },
  {
    id: "rel-011",
    sourceId: "person-xuanzang",
    targetId: "kashgar",
    type: "visited",
    historicalContext: `Xuanzang passes through Kashgar c.630 CE en route to India on Buddhist pilgrimage.`,
    source: "Frankopan (2015)",
  },
  {
    id: "rel-012",
    sourceId: "person-xuanzang",
    targetId: "samarkand",
    type: "visited",
    historicalContext: `Xuanzang passes through Samarkand region c.630 CE en route to India.`,
    source: "Frankopan (2015)",
  },
  {
    id: "rel-013",
    sourceId: "person-xuanzang",
    targetId: "turfan",
    type: "visited",
    historicalContext: `Xuanzang visits Turfan c.629 CE; king delays him several months before allowing passage.`,
    source: "Frankopan (2015)",
  },
  {
    id: "rel-014",
    sourceId: "silk",
    targetId: "route-northern",
    type: "traded_via",
    historicalContext: `Silk exported via Northern Route to Central Asia and Mediterranean from 200 BCE onwards.`,
    source: "Frankopan (2015)",
  },
  {
    id: "rel-015",
    sourceId: "silk",
    targetId: "route-maritime",
    type: "traded_via",
    historicalContext: `Silk increasingly exported via Maritime Route post-Song Dynasty (from 700 CE).`,
    source: "Frankopan (2015)",
  },
  {
    id: "rel-016",
    sourceId: "silk",
    targetId: "route-southern",
    type: "traded_via",
    historicalContext: `Silk traded via Southern Route to Indian subcontinent.`,
    source: "Frankopan (2015)",
  },
  {
    id: "rel-017",
    sourceId: "spices",
    targetId: "route-southern",
    type: "traded_via",
    historicalContext: `Indian spices imported via Southern overland route from 100 BCE onwards.`,
    source: "Frankopan (2015)",
  },
  {
    id: "rel-018",
    sourceId: "spices",
    targetId: "route-maritime",
    type: "traded_via",
    historicalContext: `Spices dominate Maritime Route post-Song (700 CE onwards). Primary driver of maritime expansion.`,
    source: "Frankopan (2015)",
  },
  {
    id: "rel-019",
    sourceId: "paper",
    targetId: "route-northern",
    type: "traded_via",
    historicalContext: `Paper spreads westward via Northern Route after Battle of Talas (751 CE).`,
    source: "Frankopan (2015)",
  },
  {
    id: "rel-020",
    sourceId: "lapis",
    targetId: "route-lapis",
    type: "traded_via",
    historicalContext: `Lapis lazuli traded via Lapis Lazuli Route from Afghan mines to Mesopotamia (3000 BCE onwards).`,
    source: "Encyclopaedia Iranica",
  },
  {
    id: "rel-021",
    sourceId: "horses",
    targetId: "route-northern",
    type: "traded_via",
    historicalContext: `Ferghana horses traded via Northern Route to Han China. Primary military commodity.`,
    source: "Frankopan (2015)",
  },
  {
    id: "rel-022",
    sourceId: "incense",
    targetId: "route-incense",
    type: "traded_via",
    historicalContext: `Arabian frankincense traded via Incense Route from Yemen to Mediterranean.`,
    source: "Frankopan (2015)",
  },
  {
    id: "rel-023",
    sourceId: "tea",
    targetId: "route-tea",
    type: "traded_via",
    historicalContext: `Tea traded via Tea Horse Road (Chamadao) to Tibet and Indian borderlands.`,
    source: "Frankopan (2015)",
  },
  {
    id: "rel-024",
    sourceId: "gold",
    targetId: "route-trans-saharan",
    type: "traded_via",
    historicalContext: `West African gold traded via trans-Saharan routes to Mediterranean Silk Roads termini.`,
    source: "Frankopan (2015)",
  },
  {
    id: "rel-025",
    sourceId: "porcelain",
    targetId: "route-maritime",
    type: "traded_via",
    historicalContext: `Chinese porcelain exclusively exported via Maritime Route to Islamic and Southeast Asian markets.`,
    source: "Frankopan (2015)",
  },
  {
    id: "rel-026",
    sourceId: "xian",
    targetId: "route-northern",
    type: "connects",
    historicalContext: `Chang'an is eastern terminus of Northern Silk Road (200 BCE – 1400 CE).`,
    source: "Frankopan (2015)",
  },
  {
    id: "rel-027",
    sourceId: "kashgar",
    targetId: "route-northern",
    type: "connects",
    historicalContext: `Kashgar is critical junction of Northern Silk Road.`,
    source: "Frankopan (2015)",
  },
  {
    id: "rel-028",
    sourceId: "kashgar",
    targetId: "route-southern",
    type: "connects",
    historicalContext: `Kashgar is junction of Southern Silk Road.`,
    source: "Frankopan (2015)",
  },
  {
    id: "rel-029",
    sourceId: "samarkand",
    targetId: "route-northern",
    type: "connects",
    historicalContext: `Samarkand is central hub on Northern Silk Road.`,
    source: "Frankopan (2015)",
  },
  {
    id: "rel-030",
    sourceId: "samarkand",
    targetId: "bukhara",
    type: "connects",
    historicalContext: `Direct commercial connection between adjacent Samarkand and Bukhara. Both Samanid-era hubs.`,
    source: "Frankopan (2015)",
  },
  {
    id: "rel-031",
    sourceId: "istanbul",
    targetId: "route-northern",
    type: "connects",
    historicalContext: `Constantinople is western terminus of Northern Silk Road.`,
    source: "Frankopan (2015)",
  },
  {
    id: "rel-032",
    sourceId: "quanzhou",
    targetId: "route-maritime",
    type: "connects",
    historicalContext: `Quanzhou is eastern terminus of Maritime Silk Road (700–1500 CE).`,
    source: "Frankopan (2015)",
  },
  {
    id: "rel-033",
    sourceId: "alexandria",
    targetId: "route-maritime",
    type: "connects",
    historicalContext: `Alexandria is western Mediterranean terminus of Maritime Silk Road.`,
    source: "Frankopan (2015)",
  },
  {
    id: "rel-034",
    sourceId: "baghdad",
    targetId: "merv",
    type: "connects",
    historicalContext: `Baghdad–Merv route is western section of Northern Silk Road.`,
    source: "Frankopan (2015)",
  },
  {
    id: "rel-035",
    sourceId: "event-talas-battle",
    targetId: "paper",
    type: "connects",
    historicalContext: `Battle of Talas (751 CE) directly enables westward transmission of paper-making technology via captured artisans.`,
    source: "Frankopan (2015)",
  },
  {
    id: "rel-036",
    sourceId: "event-mongol-pax",
    targetId: "route-northern",
    type: "connects",
    historicalContext: `Pax Mongolica (1250–1350 CE) enables peak trade volumes on Northern Route via yam relay stations.`,
    source: "Frankopan (2015) ; Otgonbaatar (2023)",
  },
  {
    id: "rel-037",
    sourceId: "event-black-death-spread",
    targetId: "route-maritime",
    type: "connects",
    historicalContext: `Black Death spreads via Maritime Silk Road from Central Asia to Caffa (Crimea) to Mediterranean (1346–1347 CE).`,
    source: "Wheelis (2002)",
  },
  {
    id: "rel-038",
    sourceId: "inscr-sogdian",
    targetId: "dunhuang",
    type: "part_of",
    historicalContext: `Sogdian Ancient Letters sealed in Dunhuang Mogao Cave 17 and form part of that archive.`,
    source: "Encyclopaedia Iranica",
  },
  {
    id: "rel-039",
    sourceId: "inscr-dunhuang",
    targetId: "dunhuang",
    type: "part_of",
    historicalContext: `Dunhuang Manuscripts are the primary archive of Mogao Cave 17, sealed c.1000 CE.`,
    source: "Silk Road Seattle Project",
  },
  {
    id: "rel-040",
    sourceId: "hormuz",
    targetId: "route-maritime",
    type: "connects",
    historicalContext: `Hormuz controls Persian Gulf entrance; mandatory waypoint on Maritime Silk Road.`,
    source: "Frankopan (2015)",
  },
  {
    id: "rel-041",
    sourceId: "event-zhang-qian",
    targetId: "xian",
    type: "occurred_at",
    historicalContext: `Zhang Qian's mission departs from and returns to Chang'an as Han imperial capital.`,
    source: "Frankopan (2015)",
  },
  {
    id: "rel-042",
    sourceId: "event-talas-battle",
    targetId: "kashgar",
    type: "occurred_at",
    historicalContext: `Battle of Talas fought in region near Kashgar (Talas River valley, modern Kazakhstan).`,
    source: "Frankopan (2015)",
  },
  {
    id: "rel-043",
    sourceId: "event-mongol-sack-baghdad",
    targetId: "baghdad",
    type: "occurred_at",
    historicalContext: `Mongol sack of Baghdad 1258 CE occurs at Baghdad — city destroyed by Hulagu Khan.`,
    source: "Frankopan (2015)",
  },
  {
    id: "rel-044",
    sourceId: "event-fall-constantinople",
    targetId: "istanbul",
    type: "occurred_at",
    historicalContext: `Fall of Constantinople 1453 CE occurs at Constantinople/Istanbul.`,
    source: "Frankopan (2015)",
  },
  {
    id: "rel-045",
    sourceId: "event-zheng-he-voyages",
    targetId: "quanzhou",
    type: "occurred_at",
    historicalContext: `Zheng He's treasure fleet voyages depart from Quanzhou and nearby ports 1405–1433 CE.`,
    source: "Frankopan (2015)",
  },
  {
    id: "rel-046",
    sourceId: "person-genghis",
    targetId: "samarkand",
    type: "visited",
    historicalContext: `Genghis Khan sacks Samarkand 1220 CE. Frankopan documents Khan riding horse into main mosque.`,
    source: "Frankopan (2015)",
  },
  {
    id: "rel-047",
    sourceId: "person-tamerlane",
    targetId: "samarkand",
    type: "visited",
    historicalContext: `Timur makes Samarkand capital of his empire 1370 CE; invests in Registan complex.`,
    source: "Frankopan (2015)",
  },
  {
    id: "rel-048",
    sourceId: "person-avicenna",
    targetId: "bukhara",
    type: "visited",
    historicalContext: `Ibn Sina educated in Bukhara under Samanid patronage; serves as court physician.`,
    source: "Encyclopaedia Iranica",
  },
  {
    id: "rel-049",
    sourceId: "inscr-bezeklik",
    targetId: "turfan",
    type: "part_of",
    historicalContext: `Bezeklik cave inscriptions are part of the Turfan oasis cave complex.`,
    source: "Silk Road Seattle Project",
  },
  {
    id: "rel-050",
    sourceId: "person-zheng-he",
    targetId: "route-maritime",
    type: "established",
    historicalContext: `Zheng He's seven voyages (1405–1433 CE) demonstrate and temporarily establish Chinese maritime dominance.`,
    source: "Frankopan (2015)",
  },
];

// ─── Century Notes ─────────────────────────────────────────────────────────
export interface CenturyNote {
  noteId: string;
  entityId: string;
  entityName: string;
  centuryRange: string;
  note: string;
  source: string;
}

export const SILK_ROAD_CENTURY_NOTES: CenturyNote[] = [
  {
    noteId: "cn-001",
    entityId: "xian",
    entityName: "Chang'an (Xi'an)",
    centuryRange: "-200 to -101",
    note: `Han Emperor Wu dispatches Zhang Qian westward 138 BCE, opening first diplomatic contacts with Central Asian kingdoms. Chang'an becomes eastern anchor of Silk Roads. Chinese silk begins its westward journey for the first time.`,
    source: "Frankopan (2015)",
  },
  {
    noteId: "cn-002",
    entityId: "xian",
    entityName: "Chang'an (Xi'an)",
    centuryRange: "-100 to -1",
    note: `Chang'an consolidates role as Han imperial capital and primary Silk Roads eastern terminus. Silk exports reach Parthia and eventually Rome via intermediaries. First foreign embassies from Central Asian kingdoms arrive.`,
    source: "Frankopan (2015)",
  },
  {
    noteId: "cn-003",
    entityId: "xian",
    entityName: "Chang'an (Xi'an)",
    centuryRange: "100 to 199",
    note: `Eastern Han Dynasty. Chinese paper-making invented under Cai Lun c.105 CE and begins westward journey. Silk production expands under imperial monopoly.`,
    source: "Frankopan (2015)",
  },
  {
    noteId: "cn-004",
    entityId: "xian",
    entityName: "Chang'an (Xi'an)",
    centuryRange: "600 to 699",
    note: `Tang Dynasty golden age. Chang'an becomes world's largest city (1,000,000+ inhabitants). Permanent colonies of Sogdian, Persian, Arab, and Indian merchants. Xuanzang departs 629 CE; returns 645 CE with Buddhist scriptures.`,
    source: "Frankopan (2015)",
  },
  {
    noteId: "cn-005",
    entityId: "xian",
    entityName: "Chang'an (Xi'an)",
    centuryRange: "700 to 799",
    note: `Battle of Talas 751 CE halts Tang westward expansion. Paper-making technology spreads west via captured Chinese artisans. Chang'an remains cosmopolitan heart of Tang empire.`,
    source: "Frankopan (2015)",
  },
  {
    noteId: "cn-006",
    entityId: "xian",
    entityName: "Chang'an (Xi'an)",
    centuryRange: "900 to 999",
    note: `Tang collapse 907 CE leads to Five Dynasties period. Chang'an loses imperial capital status. Trade disruption along northern routes begins.`,
    source: "Frankopan (2015)",
  },
  {
    noteId: "cn-007",
    entityId: "xian",
    entityName: "Chang'an (Xi'an)",
    centuryRange: "1300 to 1399",
    note: `Ming Dynasty established 1368 CE. Chang'an rebuilt and renamed Xi'an. Serves as regional administrative centre. Zheng He's voyages 1405–1433 signal maritime ambition.`,
    source: "Frankopan (2015)",
  },
  {
    noteId: "cn-008",
    entityId: "samarkand",
    entityName: "Samarkand",
    centuryRange: "-300 to -201",
    note: `Alexander the Great captures Samarkand (Maracanda) 329 BCE, integrating it into the Hellenistic world. Junction of multiple trade routes.`,
    source: "Frankopan (2015)",
  },
  {
    noteId: "cn-009",
    entityId: "samarkand",
    entityName: "Samarkand",
    centuryRange: "300 to 399",
    note: `Sogdian merchants based in Samarkand operate networks stretching from China to Byzantine Empire. Sogdian language becomes lingua franca of Silk Roads commerce.`,
    source: "Encyclopaedia Iranica",
  },
  {
    noteId: "cn-010",
    entityId: "samarkand",
    entityName: "Samarkand",
    centuryRange: "700 to 799",
    note: `Arab Muslim armies conquer Samarkand 710 CE. Paper production begins following Talas 751 CE. Chinese prisoners teach paper-making; Samarkand paper becomes famous across Islamic world.`,
    source: "Frankopan (2015)",
  },
  {
    noteId: "cn-011",
    entityId: "samarkand",
    entityName: "Samarkand",
    centuryRange: "900 to 999",
    note: `Samanid Dynasty capital. Ibn Sina educated here. City is Islamic intellectual rival of Baghdad.`,
    source: "Frankopan (2015); Encyclopaedia Iranica",
  },
  {
    noteId: "cn-012",
    entityId: "samarkand",
    entityName: "Samarkand",
    centuryRange: "1200 to 1299",
    note: `Genghis Khan sacks Samarkand 1220 CE. Marco Polo visits c.1273 CE and describes great trading city.`,
    source: "Frankopan (2015)",
  },
  {
    noteId: "cn-013",
    entityId: "samarkand",
    entityName: "Samarkand",
    centuryRange: "1300 to 1399",
    note: `Timur makes Samarkand capital 1370 CE. Brings artisans from conquered territories. Registan complex constructed. City experiences cultural and architectural renaissance.`,
    source: "Frankopan (2015)",
  },
  {
    noteId: "cn-014",
    entityId: "dunhuang",
    entityName: "Dunhuang",
    centuryRange: "-100 to -1",
    note: `Han garrison established at Dunhuang as gateway to Jade Gate pass. Critical military and commercial checkpoint for Silk Roads access.`,
    source: "Frankopan (2015)",
  },
  {
    noteId: "cn-015",
    entityId: "dunhuang",
    entityName: "Dunhuang",
    centuryRange: "300 to 399",
    note: `Sogdian Ancient Letters 313–314 CE written by merchants stranded in Dunhuang. Earliest documentary evidence of Sogdian commercial networks along Silk Roads.`,
    source: "Encyclopaedia Iranica",
  },
  {
    noteId: "cn-016",
    entityId: "dunhuang",
    entityName: "Dunhuang",
    centuryRange: "400 to 499",
    note: `Mogao Caves (Caves of the Thousand Buddhas) actively constructed. Buddhist texts and artwork accumulate. Dunhuang becomes major Buddhist intellectual centre.`,
    source: "Silk Road Seattle Project",
  },
  {
    noteId: "cn-017",
    entityId: "dunhuang",
    entityName: "Dunhuang",
    centuryRange: "600 to 699",
    note: `Tang Dynasty control. Dunhuang at peak prosperity. Mogao library cave (Cave 17) accumulates thousands of manuscripts in Chinese, Tibetan, Sanskrit, Sogdian, Uighur.`,
    source: "Frankopan (2015)",
  },
  {
    noteId: "cn-018",
    entityId: "dunhuang",
    entityName: "Dunhuang",
    centuryRange: "900 to 999",
    note: `Manuscripts sealed in Cave 17 c.1000 CE, protecting one of history's most important archival collections from destruction.`,
    source: "Silk Road Seattle Project",
  },
  {
    noteId: "cn-019",
    entityId: "baghdad",
    entityName: "Baghdad",
    centuryRange: "700 to 799",
    note: `Caliph al-Mansur founds Baghdad (Madinat al-Salam) 762 CE. Circular city design. Abbasid Caliphate capital.`,
    source: "Frankopan (2015)",
  },
  {
    noteId: "cn-020",
    entityId: "baghdad",
    entityName: "Baghdad",
    centuryRange: "800 to 899",
    note: `Golden Age under Harun al-Rashid and al-Ma'mun. Baghdad reaches 800,000+ population — world's largest city outside China. House of Wisdom (Bayt al-Hikma) global centre of science and translation.`,
    source: "Frankopan (2015)",
  },
  {
    noteId: "cn-021",
    entityId: "baghdad",
    entityName: "Baghdad",
    centuryRange: "1200 to 1299",
    note: `Mongol army under Hulagu Khan sacks Baghdad 1258 CE. Caliph al-Musta'sim executed. House of Wisdom destroyed. Contemporary accounts describe Tigris running black with ink from burned books.`,
    source: "Frankopan (2015)",
  },
  {
    noteId: "cn-022",
    entityId: "istanbul",
    entityName: "Constantinople",
    centuryRange: "300 to 399",
    note: `Emperor Constantine I founds Constantinople 330 CE as new Roman capital. Position at junction of Europe and Asia creates immediate commercial dominance.`,
    source: "Frankopan (2015)",
  },
  {
    noteId: "cn-023",
    entityId: "istanbul",
    entityName: "Constantinople",
    centuryRange: "500 to 599",
    note: `Golden age under Justinian I 527–565 CE. Byzantine agents smuggle silkworm eggs from China c.552 CE, ending Chinese silk monopoly. Hagia Sophia constructed 532–537 CE.`,
    source: "Frankopan (2015)",
  },
  {
    noteId: "cn-024",
    entityId: "istanbul",
    entityName: "Constantinople",
    centuryRange: "1200 to 1299",
    note: `Fourth Crusade sacks Constantinople 1204 CE, establishing Latin Empire. Byzantine merchants lose commercial advantages to Venetian and Genoese traders. Trebizond emerges as alternative Black Sea Silk Roads terminus.`,
    source: "Frankopan (2015)",
  },
  {
    noteId: "cn-025",
    entityId: "istanbul",
    entityName: "Constantinople",
    centuryRange: "1400 to 1499",
    note: `Ottoman Sultan Mehmed II captures Constantinople 29 May 1453 CE, ending Byzantine Empire. City renamed Istanbul. Fall triggers European search for alternative sea routes — age of exploration begins.`,
    source: "Frankopan (2015)",
  },
  {
    noteId: "cn-026",
    entityId: "kashgar",
    entityName: "Kashgar",
    centuryRange: "-200 to -101",
    note: `Under Han influence following Zhang Qian's missions. Critical junction where Northern and Southern routes diverge — strategically most valuable oasis position.`,
    source: "Frankopan (2015)",
  },
  {
    noteId: "cn-027",
    entityId: "kashgar",
    entityName: "Kashgar",
    centuryRange: "700 to 799",
    note: `Tang Dynasty captures Kashgar 648 CE. Battle of Talas 751 CE fought in nearby region — Arab victory ends Chinese westward expansion.`,
    source: "Frankopan (2015)",
  },
  {
    noteId: "cn-028",
    entityId: "kashgar",
    entityName: "Kashgar",
    centuryRange: "900 to 999",
    note: `Karakhanid Khanate controls Kashgar and converts to Islam. City transforms from Buddhist to Islamic centre.`,
    source: "Encyclopaedia Iranica",
  },
  {
    noteId: "cn-029",
    entityId: "kashgar",
    entityName: "Kashgar",
    centuryRange: "1200 to 1299",
    note: `Mongol conquest integrates Kashgar into Mongol Empire. Marco Polo visits c.1273 CE and describes it as a great trading city.`,
    source: "Frankopan (2015)",
  },
  {
    noteId: "cn-030",
    entityId: "merv",
    entityName: "Merv",
    centuryRange: "-200 to -101",
    note: `Parthian Empire makes Merv major administrative and commercial centre. Silk caravans from China pass through regularly.`,
    source: "Frankopan (2015)",
  },
  {
    noteId: "cn-031",
    entityId: "merv",
    entityName: "Merv",
    centuryRange: "600 to 699",
    note: `Arab Muslim conquest of Merv 651 CE. City becomes major centre of early Islamic world and base for eastward expansion.`,
    source: "Frankopan (2015)",
  },
  {
    noteId: "cn-032",
    entityId: "merv",
    entityName: "Merv",
    centuryRange: "1000 to 1099",
    note: `Seljuk Turks make Merv their capital. City reaches medieval peak as centre of Islamic scholarship and trade — among top 5 Islamic cities in the world.`,
    source: "Frankopan (2015)",
  },
  {
    noteId: "cn-033",
    entityId: "merv",
    entityName: "Merv",
    centuryRange: "1200 to 1299",
    note: `Genghis Khan's son Tolui destroys Merv 1221 CE in catastrophic massacre. Contemporary sources claim 1,000,000+ killed. City never fully recovers.`,
    source: "Frankopan (2015)",
  },
  {
    noteId: "cn-034",
    entityId: "quanzhou",
    entityName: "Quanzhou",
    centuryRange: "900 to 999",
    note: `Growing importance as maritime trade hub. Arab and Persian merchant communities establish permanent colonies.`,
    source: "Frankopan (2015)",
  },
  {
    noteId: "cn-035",
    entityId: "quanzhou",
    entityName: "Quanzhou",
    centuryRange: "1200 to 1299",
    note: `Marco Polo visits c.1291 CE and describes it as one of the two greatest ports in the world. Ibn Battuta later visits and is astonished by its scale.`,
    source: "Frankopan (2015)",
  },
  {
    noteId: "cn-036",
    entityId: "quanzhou",
    entityName: "Quanzhou",
    centuryRange: "1300 to 1399",
    note: `Yuan (Mongol) Dynasty. Quanzhou flourishes as part of Pax Mongolica. Muslim, Nestorian Christian, Hindu, and Buddhist communities coexist. Among world's wealthiest cities.`,
    source: "Frankopan (2015)",
  },
  {
    noteId: "cn-037",
    entityId: "tabriz",
    entityName: "Tabriz",
    centuryRange: "1200 to 1299",
    note: `Mongol Ilkhanate makes Tabriz capital of their Persian territories. Most cosmopolitan city in medieval world: Genoese, Venetian, Muslim, Jewish, Armenian, Chinese communities.`,
    source: "Frankopan (2015)",
  },
  {
    noteId: "cn-038",
    entityId: "tabriz",
    entityName: "Tabriz",
    centuryRange: "1300 to 1399",
    note: `Tabriz reaches medieval peak under Ilkhanate. Major terminus for goods from China, India, Mediterranean. Ibn Battuta marvels at commercial activity.`,
    source: "Frankopan (2015)",
  },
  {
    noteId: "cn-039",
    entityId: "bukhara",
    entityName: "Bukhara",
    centuryRange: "800 to 899",
    note: `Samanid Dynasty. Bukhara becomes Islamic intellectual rival to Baghdad. Persian literature flourishes. Rudaki, father of Persian poetry, active here.`,
    source: "Encyclopaedia Iranica",
  },
  {
    noteId: "cn-040",
    entityId: "bukhara",
    entityName: "Bukhara",
    centuryRange: "900 to 999",
    note: `Ibn Sina (Avicenna) born 980 CE nearby; educated in Bukhara under Samanid patronage. Library is one of greatest in Islamic world. City at cultural zenith.`,
    source: "Encyclopaedia Iranica",
  },
  {
    noteId: "cn-041",
    entityId: "bukhara",
    entityName: "Bukhara",
    centuryRange: "1200 to 1299",
    note: `Genghis Khan sacks Bukhara 1220 CE. Khan reportedly rides horse into main mosque. Much of population killed or enslaved.`,
    source: "Frankopan (2015)",
  },
  {
    noteId: "cn-042",
    entityId: "alexandria",
    entityName: "Alexandria",
    centuryRange: "-300 to -201",
    note: `Alexander the Great founds Alexandria 331 BCE. Library and Lighthouse (Pharos) constructed. Becomes intellectual capital of Hellenistic world.`,
    source: "Frankopan (2015)",
  },
  {
    noteId: "cn-043",
    entityId: "alexandria",
    entityName: "Alexandria",
    centuryRange: "0 to 99",
    note: `Roman conquest 30 BCE. Primary source of grain and luxury goods for Rome. Indian and Arabian merchants bring spices, incense, and silk via Red Sea.`,
    source: "Frankopan (2015)",
  },
  {
    noteId: "cn-044",
    entityId: "alexandria",
    entityName: "Alexandria",
    centuryRange: "600 to 699",
    note: `Arab Muslim conquest 642 CE. City transitions from Greek-Christian to Arabic-Islamic centre.`,
    source: "Frankopan (2015)",
  },
  {
    noteId: "cn-045",
    entityId: "alexandria",
    entityName: "Alexandria",
    centuryRange: "1300 to 1399",
    note: `Under Mamluk Sultanate. Handles massive volumes of spice trade between Indian Ocean and Europe.`,
    source: "Frankopan (2015)",
  },
];

// ─── Helper Functions ───────────────────────────────────────────────────────

export function getEntityById(id: string): SilkRoadEntity | undefined {
  return SILK_ROAD_ENTITIES.find(e => e.id === id);
}

export function getEntitiesByType(type: EntityType): SilkRoadEntity[] {
  return SILK_ROAD_ENTITIES.filter(e => e.type === type);
}

export function getEntitiesForCentury(year: number): SilkRoadEntity[] {
  const centuryStart = Math.floor(year / 100) * 100;
  const centuryEnd = centuryStart + 99;
  return SILK_ROAD_ENTITIES.filter(
    e => e.startYear <= centuryEnd && e.endYear >= centuryStart
  );
}

export function getRoutesForCentury(year: number): RouteSegment[] {
  const centuryStart = Math.floor(year / 100) * 100;
  const centuryEnd = centuryStart + 99;
  return SILK_ROAD_ROUTES.filter(
    r => r.startYear <= centuryEnd && r.endYear >= centuryStart
  );
}

export function getRelationshipsForEntity(entityId: string): Relationship[] {
  return SILK_ROAD_RELATIONSHIPS.filter(
    r => r.sourceId === entityId || r.targetId === entityId
  );
}

export function getCenturyNotesForEntity(entityId: string): CenturyNote[] {
  return SILK_ROAD_CENTURY_NOTES.filter(n => n.entityId === entityId);
}

export function getCenturyNoteForYear(entityId: string, year: number): string | undefined {
  const centuryStart = Math.floor(year / 100) * 100;
  const centuryEnd = centuryStart + 99;
  const entity = getEntityById(entityId);
  if (!entity?.centuryNotes) return undefined;
  const key = Object.keys(entity.centuryNotes).find(k => {
    const parts = k.split(" to ").map(Number);
    return parts[0] <= centuryEnd && parts[1] >= centuryStart;
  });
  return key ? entity.centuryNotes[key] : undefined;
}

// Graph node/link generators for D3.js
export function generateGraphData(entities: SilkRoadEntity[]) {
  const entityIds = new Set(entities.map(e => e.id));
  const nodes = entities.map(e => ({
    id: e.id,
    name: e.name,
    type: e.type,
    importance: e.importance,
  }));
  const links = SILK_ROAD_RELATIONSHIPS
    .filter(r => entityIds.has(r.sourceId) && entityIds.has(r.targetId))
    .map(r => ({
      source: r.sourceId,
      target: r.targetId,
      type: r.type,
    }));
  return { nodes, links };
}

// Dataset statistics
export const DATASET_STATS = {
  totalEntities: 77,
  cities: 16,
  routes: 13,
  goods: 14,
  events: 15,
  persons: 14,
  inscriptions: 5,
  routeEntities: 13,
  relationships: 50,
  centuryNotes: 45,
  temporalScope: { start: -300, end: 1500 },
  version: "1.0",
  doi: "https://doi.org/10.5281/zenodo.19684922",
  creator: "Saud Najem S Alnajem (230266960)",
  institution: "Newcastle University, CSC3094",
} as const;

// ─── Backward Compatibility Layer ───────────────────────────────────────────
// These exports maintain compatibility with existing code that imports
// CITIES, EVENTS, GOODS, PERSONS, ROUTES, ALL_ENTITIES, etc.

export const ISTANBUL_CENTER: [number, number] = [28.98, 41.01];

// Filtered entity arrays for backward compatibility
export const CITIES: SilkRoadEntity[] = SILK_ROAD_ENTITIES.filter(e => e.type === "City");
export const EVENTS: SilkRoadEntity[] = SILK_ROAD_ENTITIES.filter(e => e.type === "Event");
export const GOODS: SilkRoadEntity[] = SILK_ROAD_ENTITIES.filter(e => e.type === "Good");
export const PERSONS: SilkRoadEntity[] = SILK_ROAD_ENTITIES.filter(e => e.type === "Person");
export const INSCRIPTIONS: SilkRoadEntity[] = SILK_ROAD_ENTITIES.filter(e => e.type === "Inscription");

// Alias for all entities
export const ALL_ENTITIES: SilkRoadEntity[] = SILK_ROAD_ENTITIES;

// Alias for routes
export const ROUTES: RouteSegment[] = SILK_ROAD_ROUTES;

// Century window helper (used by timeline)
export function getCenturyWindow(year: number): {
  start: number;
  end: number;
  label: string;
} {
  const centuryStart = Math.floor(year / 100) * 100;
  const centuryEnd = centuryStart + 99;
  const centuryNumber = Math.floor(centuryStart / 100) + 1;
  const suffix =
    centuryNumber === 1
      ? "st"
      : centuryNumber === 2
        ? "nd"
        : centuryNumber === 3
          ? "rd"
          : "th";
  return {
    start: centuryStart,
    end: centuryEnd,
    label: `${centuryStart}–${centuryEnd} (${centuryNumber}${suffix} Century)`,
  };
}

// Century key helper
export function getCenturyKey(year: number): string {
  const centuryStart = Math.floor(year / 100) * 100;
  const centuryEnd = centuryStart + 99;
  return `${centuryStart}-${centuryEnd}`;
}

/**
 * Semantic search across all entities.
 * Matches on name, description, type, region, related goods, events, and notable figures.
 * Returns results ranked by relevance (name match > description > metadata).
 */
export function searchEntities(query: string): SilkRoadEntity[] {
  if (!query || query.trim().length < 2) return [];

  const q = query.toLowerCase().trim();
  const terms = q.split(/\s+/);

  const scored: { entity: SilkRoadEntity; score: number }[] = [];

  SILK_ROAD_ENTITIES.forEach((entity) => {
    let score = 0;

    const name = entity.name.toLowerCase();
    const desc = entity.description.toLowerCase();
    const region = entity.region.toLowerCase();
    const type = entity.type.toLowerCase();

    terms.forEach((term) => {
      // Name match (highest weight)
      if (name.includes(term)) score += 10;
      // Exact name start
      if (name.startsWith(term)) score += 5;
      // Type match
      if (type === term) score += 6;
      // Region match
      if (region.includes(term)) score += 4;
      // Description match
      if (desc.includes(term)) score += 2;
      // Goods match
      if (entity.relatedGoods?.some((g) => g.toLowerCase().includes(term))) score += 5;
      // Events match
      if (entity.relatedEvents?.some((e) => e.toLowerCase().includes(term))) score += 4;
      // Roles match (for cities)
      if (entity.roles?.some((r) => r.toLowerCase().includes(term))) score += 4;
      // Source match
      if (entity.source?.toLowerCase().includes(term)) score += 2;
    });

    if (score > 0) scored.push({ entity, score });
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .map((s) => s.entity);
}
