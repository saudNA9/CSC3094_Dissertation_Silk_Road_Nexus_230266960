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

# backend/seed.py

import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.app import create_app
from backend.models import db, Entity, NotableFigure, CenturyNote, RouteSegment

DATA_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "data",
    "silk-road-data.json",
)


def load_dataset():
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def seed():
    app = create_app()

    with app.app_context():
        db.drop_all()
        db.create_all()

        dataset = load_dataset()

        entities = dataset.get("entities", [])
        routes = dataset.get("routes", [])
        relationships = dataset.get("relationships", [])
        century_notes = dataset.get("centuryNotes", [])

        entity_map = {}

        # 1. I've done this to seed all entities
        for d in entities:
            entity = Entity(
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

            db.session.add(entity)
            entity_map[d["id"]] = entity

            # Optional embedded century notes from entity object
            for key, note in d.get("centuryNotes", {}).items():
                db.session.add(
                    CenturyNote(
                        entity_id=d["id"],
                        century_key=key,
                        note=note,
                    )
                )

        db.session.flush()

        # 2. Seed explicit century notes from JSON
        existing_notes = set()

        for note in century_notes:
            key = (note["entityId"], note["centuryRange"], note["note"])

            if key in existing_notes:
                continue

            if note["entityId"] in entity_map:
                db.session.add(
                    CenturyNote(
                        entity_id=note["entityId"],
                        century_key=note["centuryRange"],
                        note=note["note"],
                    )
                )
                existing_notes.add(key)

        # 3. Seed typed relationships into the existing many-to-many relation table
        for rel in relationships:
            source_id = rel.get("sourceId")
            target_id = rel.get("targetId")

            if source_id in entity_map and target_id in entity_map:
                source = entity_map[source_id]
                target = entity_map[target_id]

                if target not in source.related_entities:
                    source.related_entities.append(target)

        # 4. Also seed relatedEntities listed inside each entity
        for d in entities:
            source = entity_map.get(d["id"])
            if not source:
                continue

            for target_id in d.get("relatedEntities", []):
                target = entity_map.get(target_id)

                if target and target not in source.related_entities:
                    source.related_entities.append(target)

        # 5. Seed route segments
        for r in routes:
            db.session.add(
                RouteSegment(
                    id=r["id"],
                    name=r["name"],
                    type=r["type"],
                    route_kind=r["routeKind"],
                    start_year=r["startYear"],
                    end_year=r["endYear"],
                    coordinates=json.dumps(r.get("coordinates", [])),
                )
            )

        db.session.commit()

        print("Seed complete.")
        print(f"Entities seeded: {len(entities)}")
        print(f"Route segments seeded: {len(routes)}")
        print(f"Relationships processed: {len(relationships)}")
        print(f"Century notes processed: {len(century_notes)}")


if __name__ == "__main__":
    seed()
