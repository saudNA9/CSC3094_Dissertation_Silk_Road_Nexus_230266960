# backend/routes/entities.py
# This is the Flask Blueprint I wrote to handle all entity-related API endpoints.
# I use this file to:
# - Return all entities from my database, with optional filtering to a specific century
# - Return a single entity by the string ID I assigned it, or a 404 JSON error if it does not exist
#
# Endpoints I registered:
#   GET /api/entities               – lists all (or century-filtered) entities
#   GET /api/entities/<id>          – fetches one entity by its ID

from flask import Blueprint, jsonify, request
from backend.models import db, Entity

# Blueprint registered in app.py under the /api prefix
entities_bp = Blueprint("entities", __name__)


@entities_bp.route("/entities", methods=["GET"])
def list_entities():
    # Optional query param — e.g. ?century_year=700 returns entities active in 700–799
    century_year = request.args.get("century_year", type=int)

    query = Entity.query

    if century_year is not None:
        # Map any year to the start and end of its century for range filtering
        century_start = (century_year // 100) * 100
        century_end = century_start + 99
        # Include entities whose active period overlaps with this century
        query = query.filter(
            Entity.start_year <= century_end,
            Entity.end_year >= century_start,
        )

    entities = query.all()
    return jsonify([e.to_dict() for e in entities])


@entities_bp.route("/entities/<entity_id>", methods=["GET"])
def get_entity(entity_id):
    entity = db.session.get(Entity, entity_id)
    if not entity:
        # Return a structured error so the frontend can display a meaningful message
        return jsonify({"error": "Entity not found"}), 404
    return jsonify(entity.to_dict())
