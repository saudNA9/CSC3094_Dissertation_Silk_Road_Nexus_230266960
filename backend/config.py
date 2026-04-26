# backend/config.py
# This is the central configuration file I set up for the Silk Road Nexus Flask backend.
# I use this file to:
# - Pull the secret key and database URL from environment variables I set per deployment
# - Fall back to a local SQLite file when DATABASE_URL is not set so I can develop without MySQL
# - Disable SQLAlchemy's event-tracking overhead since I do not use the event system

import os
from pathlib import Path

# Absolute path to the directory containing this file — used to build the SQLite path
BASE_DIR = Path(__file__).resolve().parent


class Config:
    # Secret key for session signing; override with a strong random value in production
    SECRET_KEY = os.getenv("SECRET_KEY", "silk-road-dev-key")

    # Primary database — expects a MySQL URL in production, falls back to SQLite locally
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        f"sqlite:///{BASE_DIR / 'silk_road.db'}",
    )

    # Disables the SQLAlchemy event system; saves memory as we do not use it
    SQLALCHEMY_TRACK_MODIFICATIONS = False
