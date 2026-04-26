# backend/routes/routes.py
# This is the Flask Blueprint I created to serve the trade route segment data.
# I use this file to:
# - Return all the route segments I stored in the database
# - Filter them to only those active within a given century when I receive a century_year param
# - Serialise each segment as a GeoJSON-ready dict with the coordinate arrays I stored
#
# Endpoint I registered:
#   GET /api/routes                 – returns all route segments (or century-filtered)

from flask import Blueprint, jsonify, request
from backend.models import RouteSegment

# Blueprint registered in app.py under the /api prefix
routes_bp = Blueprint("routes", __name__)


@routes_bp.route("/routes", methods=["GET"])
def list_routes():
    # Optional century filter — e.g. ?century_year=1200 returns segments active in 1200–1299
    century_year = request.args.get("century_year", type=int)

    query = RouteSegment.query

    if century_year is not None:
        # Convert any year to its century boundaries for overlap filtering
        century_start = (century_year // 100) * 100
        century_end = century_start + 99
        # A segment is included if its active range overlaps the requested century
        query = query.filter(
            RouteSegment.start_year <= century_end,
            RouteSegment.end_year >= century_start,
        )

    segments = query.all()
    return jsonify([s.to_dict() for s in segments])
