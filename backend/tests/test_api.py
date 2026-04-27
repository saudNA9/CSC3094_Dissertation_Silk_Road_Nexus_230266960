# backend/tests/test_api.py

import pytest
from backend.app import app


@pytest.fixture
def client():
    app.config.update({
        "TESTING": True,
    })

    with app.test_client() as client:
        yield client


def test_entities_endpoint_returns_200(client):
    response = client.get("/api/entities")

    assert response.status_code == 200
    assert response.is_json


def test_entities_endpoint_returns_list(client):
    response = client.get("/api/entities")
    data = response.get_json()

    assert isinstance(data, list)


def test_routes_endpoint_returns_200(client):
    response = client.get("/api/routes")

    assert response.status_code == 200
    assert response.is_json


def test_routes_endpoint_returns_list(client):
    response = client.get("/api/routes")
    data = response.get_json()

    assert isinstance(data, list)


def test_missing_entity_returns_404(client):
    response = client.get("/api/entities/non-existing-entity-id")

    assert response.status_code == 404
    assert response.is_json
    assert response.get_json()["error"] == "Entity not found"