# backend/app.py
# This is the Flask application factory I wrote for the Silk Road Nexus backend.
# I use this file to:
# - Initialise the SQLAlchemy, Flask-Migrate, and Flask-CORS extensions I rely on
# - Register the entities, routes, and search blueprints I created under the /api prefix
# - Expose a /api/health endpoint I use in Docker and CI to confirm the server is running
# - Bind to the PORT environment variable so container orchestrators can control the port
#
# Run locally:
#   cd backend
#   pip install -r requirements.txt
#   python seed.py          # one-time: create tables and seed data
#   flask run --port 5000   # start the development server

import os
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from backend.models import db
from backend.routes.entities import entities_bp
from backend.routes.routes import routes_bp
from backend.routes.search import search_bp


def create_app():
    app = Flask(__name__)

    # Pull database URL, secret key, and other settings from backend/config.py
    app.config.from_object("backend.config.Config")

    # Bind SQLAlchemy to this app instance
    db.init_app(app)
    # Flask-Migrate manages Alembic database migrations via `flask db` commands
    Migrate(app, db)
    # Allow the Next.js dev server and production domain to call these endpoints
    CORS(app, origins=["http://localhost:3000", "http://localhost:3001", "*"])

    # Each blueprint owns a logical group of endpoints — all mounted under /api
    app.register_blueprint(entities_bp, url_prefix="/api")
    app.register_blueprint(routes_bp, url_prefix="/api")
    app.register_blueprint(search_bp, url_prefix="/api")

    # Lightweight health check used by Docker HEALTHCHECK and CI pipelines
    @app.route("/api/health")
    def health():
        return {"status": "ok", "service": "silk-road-nexus"}

    return app


# Module-level app instance required by `flask run` and gunicorn
app = create_app()

if __name__ == "__main__":
    # PORT env var lets container orchestrators control the bind port
    app.run(debug=True, port=int(os.getenv("PORT", 5000)))
