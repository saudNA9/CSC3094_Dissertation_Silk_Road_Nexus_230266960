# backend/models.py
# These are the SQLAlchemy ORM models I designed for the Silk Road Nexus database.
# I use this file to:
# - Define the Entity table I created to store cities, goods, events, people, and inscriptions
# - Define the RouteSegment table I built for trade route polylines with temporal date ranges
# - Define the many-to-many entity_relation join table I added for self-referencing relationships
# - Define NotableFigure and CenturyNote as child tables I linked to Entity
# - Provide a to_dict() method on every model so my Flask routes can serialise records to JSON

from flask_sqlalchemy import SQLAlchemy

# Shared db instance — initialised in app.py via db.init_app(app)
db = SQLAlchemy()


# Association table linking entities to each other (e.g. city connected to another city)
entity_relation = db.Table(
    "entity_relation",
    db.Column("source_id", db.String, db.ForeignKey("entity.id"), primary_key=True),
    db.Column("target_id", db.String, db.ForeignKey("entity.id"), primary_key=True),
)


class Entity(db.Model):
    __tablename__ = "entity"

    id = db.Column(db.String, primary_key=True)
    name = db.Column(db.String, nullable=False)
    type = db.Column(db.String, nullable=False)  # City, Good, Event, Person, Inscription
    region = db.Column(db.String, nullable=False, default="")
    lat = db.Column(db.Float, nullable=False, default=0)
    lng = db.Column(db.Float, nullable=False, default=0)
    description = db.Column(db.Text, default="")
    start_year = db.Column(db.Integer, nullable=False, default=-300)
    end_year = db.Column(db.Integer, nullable=False, default=1500)
    importance = db.Column(db.String, default="Minor")  # Major / Minor

    # JSON-serialised arrays stored as text (simple for SQLite)
    related_goods = db.Column(db.Text, default="[]")
    related_events = db.Column(db.Text, default="[]")
    connected_routes = db.Column(db.Text, default="[]")
    city_roles = db.Column(db.Text, default="[]")
    trade_significance = db.Column(db.Text, default="")

    # Relationships
    related_entities = db.relationship(
        "Entity",
        secondary=entity_relation,
        primaryjoin=id == entity_relation.c.source_id,
        secondaryjoin=id == entity_relation.c.target_id,
        backref="related_from",
    )

    notable_figures_rel = db.relationship("NotableFigure", back_populates="entity", cascade="all, delete-orphan")
    century_notes_rel = db.relationship("CenturyNote", back_populates="entity", cascade="all, delete-orphan")

    def to_dict(self):
        import json
        return {
            "id": self.id,
            "name": self.name,
            "type": self.type,
            "region": self.region,
            "lat": self.lat,
            "lng": self.lng,
            "description": self.description,
            "startYear": self.start_year,
            "endYear": self.end_year,
            "importance": self.importance,
            "relatedGoods": json.loads(self.related_goods or "[]"),
            "relatedEvents": json.loads(self.related_events or "[]"),
            "connectedRoutes": json.loads(self.connected_routes or "[]"),
            "cityRoles": json.loads(self.city_roles or "[]"),
            "tradeSignificance": self.trade_significance or "",
            "relatedEntities": [e.id for e in self.related_entities],
            "notableFigures": [
                {"name": f.name, "role": f.role, "period": f.period}
                for f in self.notable_figures_rel
            ],
            "centuryNotes": {
                n.century_key: n.note for n in self.century_notes_rel
            },
        }


class NotableFigure(db.Model):
    __tablename__ = "notable_figure"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    entity_id = db.Column(db.String, db.ForeignKey("entity.id"), nullable=False)
    name = db.Column(db.String, nullable=False)
    role = db.Column(db.String, default="")
    period = db.Column(db.String, default="")

    entity = db.relationship("Entity", back_populates="notable_figures_rel")


class CenturyNote(db.Model):
    __tablename__ = "century_note"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    entity_id = db.Column(db.String, db.ForeignKey("entity.id"), nullable=False)
    century_key = db.Column(db.String, nullable=False)  # e.g. "800-899"
    note = db.Column(db.Text, default="")

    entity = db.relationship("Entity", back_populates="century_notes_rel")


class RouteSegment(db.Model):
    __tablename__ = "route_segment"

    id = db.Column(db.String, primary_key=True)
    name = db.Column(db.String, nullable=False)
    type = db.Column(db.String, default="primary")  # primary / secondary
    route_kind = db.Column(db.String, default="land")  # land / maritime
    start_year = db.Column(db.Integer, nullable=False, default=-300)
    end_year = db.Column(db.Integer, nullable=False, default=1500)
    coordinates = db.Column(db.Text, default="[]")  # JSON array of [lng, lat]

    def to_dict(self):
        import json
        return {
            "id": self.id,
            "name": self.name,
            "type": self.type,
            "routeKind": self.route_kind,
            "startYear": self.start_year,
            "endYear": self.end_year,
            "coordinates": json.loads(self.coordinates or "[]"),
        }
