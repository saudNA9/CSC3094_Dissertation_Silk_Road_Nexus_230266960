# backend/seed.py
# This is the one-time seeding script I run to populate the database from my dataset.
# I use this file to:
# - Drop and recreate all tables so I always start from a clean known state
# - Insert every city, good, event, person, and inscription I curated
# - Insert all the trade route segments with the coordinate arrays I mapped
# - Link entities to each other via the entity_relation join table I defined
#
# I run it once with:
#   cd backend
#   python seed.py

import json
import sys
import os

# Add project root to the import path so `from backend.X import Y` resolves correctly
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.app import create_app
from backend.models import db, Entity, NotableFigure, CenturyNote, RouteSegment, entity_relation

# ─────────────────────────────────────────
# City data (mirrors lib/silk-road-data.ts)
# ─────────────────────────────────────────
CITIES = [
    {
        "id": "istanbul",
        "name": "Constantinople (Istanbul)",
        "type": "City",
        "region": "Anatolia",
        "lat": 41.0082,
        "lng": 28.9784,
        "startYear": 330,
        "endYear": 1453,
        "description": "The capital of the Byzantine Empire and a crucial western terminus of the Silk Road. Constantinople served as the bridge between Europe and Asia, facilitating trade in silk, spices, and precious goods.",
        "importance": "Major",
        "roles": ["Political Capital", "Trade Hub", "Religious Centre"],
        "tradeSignificance": "As the western anchor of the Silk Road, Constantinople was the primary gateway through which Eastern luxuries entered Europe. Its Golden Horn harbour and strategic position controlling the Bosphorus strait made it the most important trade city in the medieval world.",
        "connectedRoutes": ["Northern Silk Road", "Southern Silk Road", "Maritime Mediterranean"],
        "relatedGoods": ["Silk", "Spices", "Gold", "Ivory"],
        "relatedEvents": ["Fall of Constantinople", "Nika Riots"],
        "relatedEntities": ["baghdad", "antioch", "trabzon"],
        "notableFigures": [
            {"name": "Justinian I", "era": "527-565 CE", "description": "Byzantine Emperor who revitalised silk production and trade"},
            {"name": "Theodora", "era": "527-548 CE", "description": "Empress and co-regent who influenced trade policy"},
        ],
        "centuryNotes": {
            "300-399": "Newly founded as Nova Roma by Constantine I, rapidly growing as a trade centre.",
            "500-599": "Golden age under Justinian. Silk worms smuggled from China begin local production.",
            "900-999": "Peak of Byzantine trade dominance. The Book of the Eparch regulates markets.",
            "1200-1299": "Sacked during the Fourth Crusade (1204). Trade routes disrupted.",
            "1400-1499": "Falls to Ottoman Mehmed II in 1453. Silk Road fundamentally reshaped.",
        },
    },
    {
        "id": "baghdad",
        "name": "Baghdad",
        "type": "City",
        "region": "Persia",
        "lat": 33.3152,
        "lng": 44.3661,
        "startYear": 762,
        "endYear": 1258,
        "description": "The Abbasid capital and intellectual center of the Islamic world. Baghdad's House of Wisdom attracted scholars from across the Silk Road network, making it a hub for both commerce and knowledge exchange.",
        "importance": "Major",
        "roles": ["Political Capital", "Cultural Centre", "Trade Hub"],
        "tradeSignificance": "Baghdad sat at the nexus of overland and riverine trade networks. The Tigris River connected it to Persian Gulf ports, while caravan routes linked it to Persia, Central Asia, and the Levant. Its famous bazaars were the largest markets in the medieval world.",
        "connectedRoutes": ["Southern Silk Road", "Persian Gulf Maritime Route", "Tabriz-Baghdad Corridor"],
        "relatedGoods": ["Paper", "Textiles", "Books", "Spices"],
        "relatedEvents": ["Founding of Baghdad", "Mongol Siege"],
        "relatedEntities": ["istanbul", "samarkand", "damascus"],
        "notableFigures": [
            {"name": "Al-Mansur", "era": "754-775 CE", "description": "Caliph who founded the Round City of Baghdad"},
            {"name": "Harun al-Rashid", "era": "786-809 CE", "description": "Caliph whose reign marked Baghdad's golden age"},
            {"name": "Al-Khwarizmi", "era": "780-850 CE", "description": "Mathematician whose work spread along trade routes"},
        ],
        "centuryNotes": {
            "700-799": "Founded in 762 CE as the Round City. Rapidly becomes the world's largest city.",
            "800-899": "Golden Age of the Abbasid Caliphate. House of Wisdom established.",
            "1200-1299": "Devastated by the Mongol siege of 1258. Libraries and infrastructure destroyed.",
        },
    },
    {
        "id": "samarkand",
        "name": "Samarkand",
        "type": "City",
        "region": "Central Asia",
        "lat": 39.6542,
        "lng": 66.9597,
        "startYear": -700,
        "endYear": 1500,
        "description": "One of the oldest continuously inhabited cities in Central Asia. Samarkand sat at the crossroads of Chinese, Indian, Persian, and Western trade routes, renowned for its paper-making and blue-tiled architecture.",
        "importance": "Major",
        "roles": ["Trade Hub", "Cultural Centre", "Political Capital"],
        "tradeSignificance": "The jewel of the Silk Road, Samarkand was the quintessential crossroads city where Chinese, Indian, Persian, and Western traders met. Its paper mills revolutionised communication across the Islamic world after capturing Chinese paper-makers in 751 CE.",
        "connectedRoutes": ["Northern Silk Road", "Southern Silk Road"],
        "relatedGoods": ["Paper", "Silk", "Horses", "Lapis Lazuli"],
        "relatedEvents": ["Timur's Capital", "Arab Conquest"],
        "relatedEntities": ["bukhara", "baghdad", "kashgar"],
        "notableFigures": [
            {"name": "Timur (Tamerlane)", "era": "1370-1405 CE", "description": "Conqueror who made Samarkand his magnificent capital"},
            {"name": "Ulugh Beg", "era": "1394-1449 CE", "description": "Astronomer-prince who built the famous observatory"},
        ],
        "centuryNotes": {
            "700-799": "Conquered by Arabs. Chinese paper-makers captured at Battle of Talas (751 CE).",
            "1200-1299": "Devastated by Mongol invasion under Genghis Khan.",
            "1300-1399": "Rebuilt magnificently by Timur as capital of his empire.",
        },
    },
    {
        "id": "bukhara",
        "name": "Bukhara",
        "type": "City",
        "region": "Central Asia",
        "lat": 39.7681,
        "lng": 64.4556,
        "startYear": -500,
        "endYear": 1500,
        "description": "A major center of Islamic learning and trade on the Silk Road. Bukhara's madrasas and bazaars made it a cultural and commercial crossroads for centuries.",
        "importance": "Major",
        "roles": ["Religious Centre", "Cultural Centre", "Trade Hub"],
        "tradeSignificance": "Known as the 'Pillar of Islam', Bukhara was as important for its scholarly output as its commercial activity.",
        "connectedRoutes": ["Northern Silk Road"],
        "relatedGoods": ["Carpets", "Silk", "Cotton"],
        "relatedEvents": ["Mongol Invasion", "Samanid Dynasty"],
        "relatedEntities": ["samarkand", "merv", "kashgar"],
        "notableFigures": [
            {"name": "Ibn Sina (Avicenna)", "era": "980-1037 CE", "description": "Polymath whose Canon of Medicine spread along trade routes"},
        ],
        "centuryNotes": {
            "900-999": "Capital of the Samanid dynasty. Peak of cultural and scholarly output.",
            "1200-1299": "Surrendered to Genghis Khan in 1220. Population massacred.",
        },
    },
    {
        "id": "kashgar",
        "name": "Kashgar",
        "type": "City",
        "region": "Central Asia",
        "lat": 39.4547,
        "lng": 75.9797,
        "startYear": -200,
        "endYear": 1500,
        "description": "A vital oasis city at the junction of the northern and southern Silk Road branches.",
        "importance": "Major",
        "roles": ["Trade Hub", "Oasis Town"],
        "tradeSignificance": "Kashgar was the great junction where the northern and southern branches of the Silk Road merged.",
        "connectedRoutes": ["Northern Silk Road", "Southern Silk Road"],
        "relatedGoods": ["Jade", "Silk", "Horses", "Dried Fruits"],
        "relatedEvents": ["Buddhist Missions", "Uyghur Kingdom"],
        "relatedEntities": ["samarkand", "dunhuang", "bukhara"],
    },
    {
        "id": "dunhuang",
        "name": "Dunhuang",
        "type": "City",
        "region": "China",
        "lat": 40.1421,
        "lng": 94.6622,
        "startYear": -100,
        "endYear": 1400,
        "description": "A major stop on the Silk Road, famous for the Mogao Caves containing centuries of Buddhist art.",
        "importance": "Major",
        "roles": ["Religious Centre", "Oasis Town", "Cultural Centre"],
        "tradeSignificance": "Dunhuang guarded the western gate of China.",
        "connectedRoutes": ["Northern Silk Road"],
        "relatedGoods": ["Silk", "Buddhist texts", "Ceramics"],
        "relatedEvents": ["Mogao Cave Construction", "Tang Dynasty Peak"],
        "relatedEntities": ["kashgar", "xian", "turfan"],
        "notableFigures": [
            {"name": "Xuanzang", "era": "602-664 CE", "description": "Buddhist monk whose pilgrimage passed through Dunhuang"},
        ],
    },
    {
        "id": "xian",
        "name": "Chang'an (Xi'an)",
        "type": "City",
        "region": "China",
        "lat": 34.2658,
        "lng": 108.9541,
        "startYear": -200,
        "endYear": 1400,
        "description": "The eastern terminus of the Silk Road and capital of multiple Chinese dynasties.",
        "importance": "Major",
        "roles": ["Political Capital", "Trade Hub", "Cultural Centre"],
        "tradeSignificance": "The origin and eastern terminus of the Silk Road.",
        "connectedRoutes": ["Northern Silk Road", "Southern Silk Road"],
        "relatedGoods": ["Silk", "Porcelain", "Tea", "Lacquerware"],
        "relatedEvents": ["Tang Dynasty Trade Peak", "An Lushan Rebellion"],
        "relatedEntities": ["dunhuang", "luoyang"],
        "notableFigures": [
            {"name": "Emperor Taizong", "era": "626-649 CE", "description": "Tang emperor who opened the Silk Road to unprecedented trade"},
        ],
        "centuryNotes": {
            "600-699": "Tang Dynasty capital. Population exceeds 1 million.",
            "700-799": "An Lushan Rebellion (755) marks the beginning of decline.",
        },
    },
    {
        "id": "antioch",
        "name": "Antioch",
        "type": "City",
        "region": "Levant",
        "lat": 36.2,
        "lng": 36.1503,
        "startYear": -300,
        "endYear": 1268,
        "description": "A major Silk Road gateway connecting the Mediterranean world with Mesopotamian and Persian trade networks.",
        "importance": "Regional",
        "roles": ["Trade Hub", "Religious Centre"],
        "tradeSignificance": "Antioch's silk looms produced some of the finest fabrics in the Roman and Byzantine worlds.",
        "connectedRoutes": ["Levantine Corridor"],
        "relatedGoods": ["Silk", "Glass", "Wine"],
        "relatedEvents": ["Crusader State", "Earthquake of 526"],
        "relatedEntities": ["istanbul", "damascus", "aleppo"],
    },
    {
        "id": "damascus",
        "name": "Damascus",
        "type": "City",
        "region": "Levant",
        "lat": 33.5138,
        "lng": 36.2765,
        "startYear": -3000,
        "endYear": 1500,
        "description": "One of the world's oldest continuously inhabited cities, famous for its steel and textiles.",
        "importance": "Major",
        "roles": ["Political Capital", "Trade Hub", "Cultural Centre"],
        "tradeSignificance": "Damascus gave its name to Damask fabric and Damascus steel.",
        "connectedRoutes": ["Southern Silk Road", "Levantine Corridor"],
        "relatedGoods": ["Damascus steel", "Textiles", "Fruits"],
        "relatedEvents": ["Umayyad Capital", "Mongol Sack"],
        "relatedEntities": ["baghdad", "antioch", "aleppo"],
        "notableFigures": [
            {"name": "Mu'awiya I", "era": "661-680 CE", "description": "First Umayyad caliph who made Damascus his capital"},
        ],
    },
    {
        "id": "merv",
        "name": "Merv",
        "type": "City",
        "region": "Central Asia",
        "lat": 37.6639,
        "lng": 62.17,
        "startYear": -500,
        "endYear": 1221,
        "description": "Once the largest city in the world, Merv was a major oasis city in present-day Turkmenistan.",
        "importance": "Major",
        "roles": ["Trade Hub", "Oasis Town", "Cultural Centre"],
        "tradeSignificance": "At its peak under the Seljuks, Merv was the largest city in the world.",
        "connectedRoutes": ["Northern Silk Road"],
        "relatedGoods": ["Cotton", "Silk", "Melons"],
        "relatedEvents": ["Mongol Destruction", "Seljuk Capital"],
        "relatedEntities": ["bukhara", "baghdad", "samarkand"],
        "centuryNotes": {
            "1100-1199": "Capital of the Seljuk Empire. Possibly the world's largest city.",
            "1200-1299": "Utterly destroyed by the Mongols in 1221.",
        },
    },
    {
        "id": "trabzon",
        "name": "Trabzon (Trebizond)",
        "type": "City",
        "region": "Anatolia",
        "lat": 41.0027,
        "lng": 39.7168,
        "startYear": -700,
        "endYear": 1461,
        "description": "A Black Sea port city that served as an alternate terminus for the Silk Road.",
        "importance": "Regional",
        "roles": ["Port City", "Trade Hub"],
        "tradeSignificance": "Trabzon offered an alternative western terminus for Silk Road goods.",
        "connectedRoutes": ["Northern Silk Road"],
        "relatedGoods": ["Silk", "Silver", "Hazelnuts"],
        "relatedEvents": ["Empire of Trebizond", "Genoese Trade"],
        "relatedEntities": ["istanbul", "tabriz"],
    },
    {
        "id": "tabriz",
        "name": "Tabriz",
        "type": "City",
        "region": "Persia",
        "lat": 38.0962,
        "lng": 46.2738,
        "startYear": -500,
        "endYear": 1500,
        "description": "A major trading city in northwestern Persia, key hub on the northern Silk Road branch.",
        "importance": "Major",
        "roles": ["Trade Hub", "Political Capital"],
        "tradeSignificance": "Under the Ilkhanate, Tabriz became the commercial capital of the Mongol Empire's western territories.",
        "connectedRoutes": ["Northern Silk Road", "Tabriz-Baghdad Corridor"],
        "relatedGoods": ["Carpets", "Silk", "Spices", "Gems"],
        "relatedEvents": ["Ilkhanate Capital", "Marco Polo Visit"],
        "relatedEntities": ["trabzon", "baghdad", "istanbul"],
        "notableFigures": [
            {"name": "Marco Polo", "era": "1271-1295 CE", "description": "Venetian traveller who praised Tabriz's Grand Bazaar"},
        ],
        "centuryNotes": {
            "1200-1299": "Capital of the Mongol Ilkhanate. Described by Marco Polo as having the world's finest bazaar.",
        },
    },
    {
        "id": "aleppo",
        "name": "Aleppo",
        "type": "City",
        "region": "Levant",
        "lat": 36.2021,
        "lng": 37.1343,
        "startYear": -3000,
        "endYear": 1500,
        "description": "One of the oldest cities in the world, with the world's longest covered market.",
        "importance": "Major",
        "roles": ["Trade Hub", "Cultural Centre"],
        "tradeSignificance": "Aleppo's Al-Madina Souq was the commercial heart of the Levantine Silk Road.",
        "connectedRoutes": ["Levantine Corridor"],
        "relatedGoods": ["Soap", "Silk", "Pistachio", "Cotton"],
        "relatedEvents": ["Mamluk Rule", "Crusader Battles"],
        "relatedEntities": ["damascus", "antioch", "baghdad"],
    },
    {
        "id": "turfan",
        "name": "Turfan",
        "type": "City",
        "region": "China",
        "lat": 42.9513,
        "lng": 89.1895,
        "startYear": -200,
        "endYear": 1400,
        "description": "An oasis city on the northern branch of the Silk Road, in the Turfan Depression.",
        "importance": "Regional",
        "roles": ["Oasis Town", "Trade Hub"],
        "tradeSignificance": "Located in the world's second-lowest depression, Turfan's karez sustained a vital oasis stop.",
        "connectedRoutes": ["Northern Silk Road"],
        "relatedGoods": ["Grapes", "Wine", "Cotton"],
        "relatedEvents": ["Uyghur Kingdom", "Tang Administration"],
        "relatedEntities": ["dunhuang", "kashgar"],
    },
    {
        "id": "hormuz",
        "name": "Hormuz",
        "type": "City",
        "region": "Persia",
        "lat": 27.0858,
        "lng": 56.4608,
        "startYear": 300,
        "endYear": 1500,
        "description": "A strategic port city controlling access to the Persian Gulf.",
        "importance": "Regional",
        "roles": ["Port City", "Trade Hub"],
        "tradeSignificance": "Hormuz controlled the narrow strait connecting the Persian Gulf to the Indian Ocean.",
        "connectedRoutes": ["Persian Gulf Maritime Route"],
        "relatedGoods": ["Pearls", "Spices", "Horses"],
        "relatedEvents": ["Portuguese Capture", "Maritime Trade Peak"],
        "relatedEntities": ["baghdad", "muscat"],
    },
    {
        "id": "muscat",
        "name": "Muscat",
        "type": "City",
        "region": "Arabia",
        "lat": 23.588,
        "lng": 58.3829,
        "startYear": -300,
        "endYear": 1500,
        "description": "An ancient port city on the Arabian Sea.",
        "importance": "Regional",
        "roles": ["Port City", "Trade Hub"],
        "tradeSignificance": "Muscat's natural harbour made it an ideal port for dhow trade across the Indian Ocean.",
        "connectedRoutes": ["Persian Gulf Maritime Route"],
        "relatedGoods": ["Frankincense", "Dates", "Pearls"],
        "relatedEvents": ["Portuguese Colonization", "Omani Maritime Empire"],
        "relatedEntities": ["hormuz", "aden"],
    },
]

EVENTS = [
    {
        "id": "event-tang-peak",
        "name": "Tang Dynasty Trade Peak",
        "type": "Event",
        "region": "China",
        "lat": 34.2658,
        "lng": 108.9541,
        "startYear": 618,
        "endYear": 907,
        "description": "The Tang Dynasty presided over the golden age of Silk Road trade.",
        "importance": "Major",
        "relatedEntities": ["xian", "dunhuang"],
    },
    {
        "id": "event-mongol-pax",
        "name": "Pax Mongolica",
        "type": "Event",
        "region": "Central Asia",
        "lat": 39.6542,
        "lng": 66.9597,
        "startYear": 1206,
        "endYear": 1368,
        "description": "The Mongol Empire unified much of the Silk Road under a single political authority.",
        "importance": "Major",
        "relatedEntities": ["samarkand", "baghdad", "tabriz"],
    },
    {
        "id": "event-fall-constantinople",
        "name": "Fall of Constantinople",
        "type": "Event",
        "region": "Anatolia",
        "lat": 41.0082,
        "lng": 28.9784,
        "startYear": 1453,
        "endYear": 1453,
        "description": "The Ottoman conquest of Constantinople disrupted established Silk Road trade routes.",
        "importance": "Major",
        "relatedEntities": ["istanbul"],
    },
    {
        "id": "event-talas",
        "name": "Battle of Talas",
        "type": "Event",
        "region": "Central Asia",
        "lat": 42.52,
        "lng": 72.23,
        "startYear": 751,
        "endYear": 751,
        "description": "The battle resulting in paper technology spreading westward along the Silk Road.",
        "importance": "Major",
        "relatedEntities": ["samarkand", "xian"],
    },
]

GOODS = [
    {
        "id": "good-silk",
        "name": "Silk",
        "type": "Good",
        "region": "China",
        "lat": 34.2658,
        "lng": 108.9541,
        "startYear": -200,
        "endYear": 1500,
        "description": "The defining commodity of the Silk Road.",
        "importance": "Major",
        "relatedEntities": ["xian", "samarkand", "istanbul"],
    },
    {
        "id": "good-spices",
        "name": "Spices",
        "type": "Good",
        "region": "India",
        "lat": 23.588,
        "lng": 58.3829,
        "startYear": -300,
        "endYear": 1500,
        "description": "Pepper, cinnamon, cloves, and other spices traveled from South and Southeast Asia.",
        "importance": "Major",
        "relatedEntities": ["hormuz", "baghdad", "damascus"],
    },
    {
        "id": "good-paper",
        "name": "Paper",
        "type": "Good",
        "region": "Central Asia",
        "lat": 39.6542,
        "lng": 66.9597,
        "startYear": 751,
        "endYear": 1400,
        "description": "Chinese papermaking technology spread westward after the Battle of Talas in 751.",
        "importance": "Major",
        "relatedEntities": ["samarkand", "baghdad"],
    },
    {
        "id": "good-porcelain",
        "name": "Porcelain",
        "type": "Good",
        "region": "China",
        "lat": 34.2658,
        "lng": 108.9541,
        "startYear": 200,
        "endYear": 1500,
        "description": "Chinese porcelain was among the most sought-after luxury goods on the Silk Road.",
        "importance": "Major",
        "relatedEntities": ["xian", "hormuz", "istanbul"],
    },
]

PERSONS = [
    {
        "id": "person-marco-polo",
        "name": "Marco Polo",
        "type": "Person",
        "region": "Persia",
        "lat": 38.0962,
        "lng": 46.2738,
        "startYear": 1254,
        "endYear": 1324,
        "description": "Venetian merchant-traveller whose account of his Silk Road journey was the most influential travelogue of the medieval period.",
        "importance": "Major",
        "relatedEntities": ["tabriz", "kashgar", "xian"],
    },
    {
        "id": "person-ibn-battuta",
        "name": "Ibn Battuta",
        "type": "Person",
        "region": "Arabia",
        "lat": 33.5138,
        "lng": 36.2765,
        "startYear": 1304,
        "endYear": 1369,
        "description": "Moroccan scholar and explorer who traversed the full extent of the Islamic world.",
        "importance": "Major",
        "relatedEntities": ["damascus", "baghdad", "istanbul"],
    },
]

ROUTE_SEGMENTS = [
    {
        "id": "route-northern",
        "name": "Northern Silk Road",
        "type": "primary",
        "routeKind": "land",
        "startYear": -200,
        "endYear": 1400,
        "coordinates": [
            [108.9541, 34.2658], [94.6622, 40.1421], [89.1895, 42.9513],
            [75.9797, 39.4547], [66.9597, 39.6542], [64.4556, 39.7681],
            [62.17, 37.6639], [46.2738, 38.0962], [39.7168, 41.0027],
            [28.9784, 41.0082],
        ],
    },
    {
        "id": "route-southern",
        "name": "Southern Silk Road",
        "type": "primary",
        "routeKind": "land",
        "startYear": -200,
        "endYear": 1400,
        "coordinates": [
            [108.9541, 34.2658], [94.6622, 40.1421], [75.9797, 39.4547],
            [66.9597, 39.6542], [62.17, 37.6639], [44.3661, 33.3152],
            [36.2765, 33.5138], [37.1343, 36.2021], [36.1503, 36.2],
            [28.9784, 41.0082],
        ],
    },
    {
        "id": "route-levant",
        "name": "Levantine Corridor",
        "type": "secondary",
        "routeKind": "land",
        "startYear": -300,
        "endYear": 1300,
        "coordinates": [[36.2765, 33.5138], [37.1343, 36.2021], [36.1503, 36.2]],
    },
    {
        "id": "route-persian-gulf",
        "name": "Persian Gulf Maritime Route",
        "type": "secondary",
        "routeKind": "maritime",
        "startYear": 300,
        "endYear": 1500,
        "coordinates": [
            [44.3661, 33.3152], [48.5, 30.0], [52.0, 27.5],
            [56.4608, 27.0858], [58.3829, 23.588],
        ],
    },
    {
        "id": "route-tabriz-baghdad",
        "name": "Tabriz-Baghdad Corridor",
        "type": "secondary",
        "routeKind": "land",
        "startYear": 700,
        "endYear": 1400,
        "coordinates": [[46.2738, 38.0962], [44.3661, 33.3152]],
    },
]


def seed():
    app = create_app()
    with app.app_context():
        db.drop_all()
        db.create_all()

        all_data = CITIES + EVENTS + GOODS + PERSONS
        entity_map = {}

        # Pass 1: create entities (without relations)
        for d in all_data:
            e = Entity(
                id=d["id"],
                name=d["name"],
                type=d["type"],
                region=d.get("region", ""),
                lat=d.get("lat", 0),
                lng=d.get("lng", 0),
                description=d.get("description", ""),
                start_year=d.get("startYear", -300),
                end_year=d.get("endYear", 1500),
                importance=d.get("importance", "Minor"),
                related_goods=json.dumps(d.get("relatedGoods", [])),
                related_events=json.dumps(d.get("relatedEvents", [])),
                connected_routes=json.dumps(d.get("connectedRoutes", [])),
                city_roles=json.dumps(d.get("roles", [])),
                trade_significance=d.get("tradeSignificance", ""),
            )
            db.session.add(e)
            entity_map[d["id"]] = (e, d)

            # Notable figures
            for fig in d.get("notableFigures", []):
                db.session.add(NotableFigure(
                    entity_id=d["id"],
                    name=fig["name"],
                    role=fig.get("description", ""),
                    period=fig.get("era", ""),
                ))

            # Century notes
            for key, note in d.get("centuryNotes", {}).items():
                db.session.add(CenturyNote(
                    entity_id=d["id"],
                    century_key=key,
                    note=note,
                ))

        db.session.flush()

        # Pass 2: entity relations
        for eid, (entity_obj, data) in entity_map.items():
            for rel_id in data.get("relatedEntities", []):
                if rel_id in entity_map:
                    rel_entity = entity_map[rel_id][0]
                    if rel_entity not in entity_obj.related_entities:
                        entity_obj.related_entities.append(rel_entity)

        # Route segments
        for r in ROUTE_SEGMENTS:
            db.session.add(RouteSegment(
                id=r["id"],
                name=r["name"],
                type=r["type"],
                route_kind=r["routeKind"],
                start_year=r["startYear"],
                end_year=r["endYear"],
                coordinates=json.dumps(r["coordinates"]),
            ))

        db.session.commit()
        print(f"Seeded {len(all_data)} entities and {len(ROUTE_SEGMENTS)} routes.")


if __name__ == "__main__":
    seed()
