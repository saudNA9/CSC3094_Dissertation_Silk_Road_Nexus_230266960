# backend/routes/search.py
# This is the Flask Blueprint I built for the full-text weighted search across my dataset.
# I use this file to:
# - Accept a query string (?q=) and return entity results ranked by the scoring I designed
# - Split multi-word queries so I score each entity against every individual term
# - Apply the field weights I chose: name (10+5), type (6), region (4),
#   goods/figures (5), events/routes (3-4), description/significance (2)
# - Return an empty list early when the query is shorter than two characters
# - Cap results at 20 so I keep my response payloads small and fast
#
# Endpoint I registered:
#   GET /api/search?q=<query>       – returns ranked entity search results

from flask import Blueprint, jsonify, request
from backend.models import Entity
import json

# Blueprint registered in app.py under the /api prefix
search_bp = Blueprint("search", __name__)


@search_bp.route("/search", methods=["GET"])
def search():
    query = request.args.get("q", "").strip().lower()

    # Reject very short queries to avoid returning the entire dataset
    if len(query) < 2:
        return jsonify([])

    # Split query into individual terms so multi-word searches score correctly
    terms = query.split()
    entities = Entity.query.all()
    scored = []

    for entity in entities:
        score = 0

        # Pre-process all searchable text fields to lowercase once per entity
        name = entity.name.lower()
        desc = (entity.description or "").lower()
        region = (entity.region or "").lower()
        etype = (entity.type or "").lower()
        goods = json.loads(entity.related_goods or "[]")
        events = json.loads(entity.related_events or "[]")
        routes_list = json.loads(entity.connected_routes or "[]")
        significance = (entity.trade_significance or "").lower()
        figures = [f.name.lower() for f in entity.notable_figures_rel]

        for term in terms:
            if term in name:
                score += 10       # Name substring match — highest weight
            if name.startswith(term):
                score += 5        # Prefix match bonus for autocomplete-style queries
            if etype == term:
                score += 6        # Exact type match (e.g. searching "city" or "good")
            if term in region:
                score += 4        # Region match (e.g. "persia", "china")
            if term in desc:
                score += 2        # Description match — lowest weight, very broad
            if any(term in g.lower() for g in goods):
                score += 5        # Traded goods match
            if any(term in e.lower() for e in events):
                score += 4        # Historical event match
            if any(term in f for f in figures):
                score += 5        # Notable figure match
            if any(term in r.lower() for r in routes_list):
                score += 3        # Connected route match
            if term in significance:
                score += 2        # Trade significance text match

        if score > 0:
            scored.append((entity, score))

    # Sort descending so the most relevant result appears first
    scored.sort(key=lambda x: x[1], reverse=True)
    return jsonify([e.to_dict() for e, _ in scored[:20]])
