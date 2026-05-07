# The Silk Roads Nexus

**A Coordinated Multi-View Data-Driven Platform for Integrated Spatial, Temporal, and Semantic Exploration of Silk Roads Cultural Heritage**

---

## Academic Context

| Field | Detail |
|---|---|
| Module | CSC3094 Major Project Dissertation |
| Institution | School of Computing, Newcastle University |
| Author | Saud Najem S. Alnajem (230266960) |
| Supervisor | Dr. Rouaa Yassin Kassab |
| Academic Year | 2025–2026 |
| Dataset DOI | https://doi.org/10.5281/zenodo.19684922 |
| Dataset License | CC BY-NC 4.0 |

---

## Overview

The Silk Roads Nexus is a full-stack interactive digital heritage platform developed as the CSC3094 Major Project. It enables users to explore Silk Roads cultural heritage through three coordinated views that update together in response to user actions:

- **Spatial View** — an interactive Mapbox GL JS map displaying 16 cities and 13 trade routes with custom zoom-triggered 3D architectural city markers.
- **Temporal View** — a century-based timeline slider filtering entities across historical periods from 300 BCE to 1500 CE, with playback controls.
- **Semantic View** — a D3.js force-directed graph rendering all 77 entities as colour-coded nodes across six switchable layout modes (Force, Radial, Hierarchy, Geographic, Trade, Timeline).

The platform addresses a structural gap identified in existing digital heritage systems: spatial, temporal, and semantic information are typically fragmented across separate components. The Silk Roads Nexus links all three views through a shared backend API and a single-response dual-update mechanism, supporting coordinated, non-linear historical exploration.

---

## Evaluation Results

The platform was evaluated through a structured mixed-method usability study:

- **SUS (System Usability Scale):** mean score of **83.5 / 100** across 10 participants — grade A, *Best Imaginable* band (Lewis and Sauro), exceeding the industry benchmark of 68 and the predefined success criterion of 70.
- **Think-Aloud:** 2 participants completed all 12 structured tasks. No task was abandoned and no facilitator intervention was required.
- **Functional Testing:** 37 manual test cases and 5 pytest backend tests — all passed.
- **Security:** SonarQube Cloud SAST scan across 22k lines returned Security Rating A with zero open issues.
- **Code Quality:** Pylint score improved from 8.28 to 9.86/10 across two iterations.

---

## Dataset

The platform is powered by an original curated Silk Roads micro-dataset constructed for this project and published on Zenodo.

**Published dataset DOI:** https://doi.org/10.5281/zenodo.19684922
**License:** CC BY-NC 4.0

### Conceptual dataset (published on Zenodo)

| Metric | Count |
|---|---|
| Entity records | 81 |
| Entity types | 6 (City, Route, Good, Event, Person, Inscription) |
| Typed relationship records | 50 |
| Century-level temporal annotations | 45 |
| Temporal coverage | 300 BCE – 1500 CE |

### Operational database (after seeding)

| Table | Count |
|---|---|
| `entity` | 77 |
| `route_segment` | 14 |
| `entity_relation` | 113 |
| `century_note` | 90 |

The difference between conceptual and operational counts reflects implementation-level entity merging and derived relationship associations generated during seeding from embedded fields such as `relatedEntities` and `connectedRoutes`.

### Dataset Pipeline

```
Curated Silk Roads Dataset (Excel, published on Zenodo)
        |
        v
Shared JSON Dataset
data/silk-road-data.json
        |
        +---> Frontend
        |     lib/silk-road-data.ts
        |
        +---> Backend
              backend/seed.py
                    |
                    v
              Relational Database
              SQLite (development) / MySQL (production)
```

This pipeline prevents frontend/backend data divergence and ensures both layers are derived from the same curated source.

---

## Features

- Interactive Mapbox GL JS map with Silk Roads cities and route polylines
- Zoom-triggered 3D architectural city markers with progressive disclosure
- Century-based timeline slider spanning 300 BCE to 1500 CE with play, pause, step, and speed controls
- D3.js semantic relationship graph with six layout modes and 300-tick pre-settling
- Single-response dual-update: one API call updates both map markers and graph nodes simultaneously
- Contextual entity panels as inline overlays with related entity navigation
- Full entity detail pages with four tabs: Overview, Relationships, Timeline, Sources
- Traveller Journey mode for five historical figures: Marco Polo, Ibn Battuta, Xuanzang, Zhang Qian, and Zheng He — with gamification completion modal
- Global search overlay accessible from all views
- Dark and light theme toggle
- Architecture page exposing dataset metadata, data model, and technology stack within the running application
- Flask REST API with temporal overlap predicate for accurate century-window filtering
- SQLAlchemy ORM with partial denormalisation strategy for read-dominant performance
- Dual API client with static JSON fallback
- Docker Compose orchestration with Nginx HTTPS reverse proxy
- GitHub Actions CI/CD pipeline: pytest → Docker build → GHCR image publish
- Content Security Policy headers via Next.js middleware
- XSS, SQL injection, and path traversal blocking at request level

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | Next.js 15 + React | App Router, page routing, shared state management |
| Language | TypeScript | Type safety across shared data structures |
| Styling | Tailwind CSS + shadcn/ui | Responsive interface and accessible components |
| Map | Mapbox GL JS | Spatial visualisation and interactive map rendering |
| Graph | D3.js | Force-directed semantic relationship graph |
| Backend | Python Flask | REST API with blueprint registration |
| ORM | SQLAlchemy | Database abstraction, parameterised queries, NFR9 |
| Database | SQLite / MySQL 8.0 | Local development and production-style deployment |
| Deployment | Docker Compose | Four-service container orchestration |
| Proxy | Nginx | HTTPS termination and reverse proxy routing |
| CI/CD | GitHub Actions | Automated test, build, and image publish pipeline |
| SAST | SonarQube Cloud | Static analysis — Security Rating A, zero open issues |
| Formatting | Black + Pylint | Deterministic formatting and code quality (9.86/10) |

---

## Project Structure

```
CSC3094-silk-roads-nexus-230266960/
├── app/                            # Next.js App Router pages
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout and metadata
│   ├── explore/                    # Coordinated spatial + temporal view
│   ├── graph/                      # Semantic graph view
│   ├── traveller/                  # Traveller journey mode
│   ├── entity/[id]/                # Entity detail pages
│   └── architecture/               # Live architecture documentation page
│
├── backend/                        # Flask REST API
│   ├── app.py                      # Flask factory and blueprint registration
│   ├── config.py                   # Database configuration (DATABASE_URL)
│   ├── models.py                   # SQLAlchemy ORM models
│   ├── seed.py                     # Seeds database from shared JSON dataset
│   ├── requirements.txt            # Python dependencies
│   ├── Dockerfile                  # Backend Docker image
│   ├── silk_road.db                # Local SQLite development database
│   ├── routes/
│   │   ├── entities.py             # Entity API routes with temporal overlap predicate
│   │   ├── routes.py               # Trade-route API routes
│   │   └── search.py               # Case-insensitive entity search
│   └── tests/
│       └── test_api.py             # Backend API tests (5 passing)
│
├── components/
│   ├── explore/
│   │   ├── silk-road-map.tsx       # Mapbox map, route polylines, 3D markers
│   │   ├── city-3d-marker.tsx      # Zoom-triggered 3D architectural markers
│   │   ├── entity-panel.tsx        # Contextual entity overlay panel
│   │   └── filter-panel.tsx        # Timeline slider and type filter toggles
│   ├── graph/
│   │   └── relationship-graph.tsx  # D3.js force-directed graph, six layout modes
│   ├── ui/                         # shadcn/ui components
│   ├── search-command.tsx          # Global search overlay
│   ├── theme-provider.tsx          # Dark/light theme provider
│   └── top-nav.tsx                 # Persistent global navigation bar
│
├── data/
│   └── silk-road-data.json         # Shared operational dataset (single source of truth)
│
├── lib/
│   ├── silk-road-data.ts           # TypeScript access layer for shared dataset
│   ├── api-client.ts               # Dual-mode API client with static fallback
│   ├── city-architectures.ts       # 3D marker definitions per city
│   ├── city-historical-events.ts   # City timeline annotation data
│   ├── city-images.ts              # Wikimedia Commons image references
│   ├── firewall.ts                 # XSS, SQL injection, path traversal blocking
│   ├── security.ts                 # Input sanitisation utilities
│   ├── traveller-data.ts           # Traveller journey route data
│   └── utils.ts                    # Shared utility functions
│
├── nginx/
│   └── default.conf                # HTTPS termination and proxy routing
│
├── certificates/
│   ├── localhost.pem               # mkcert local HTTPS certificate
│   └── localhost-key.pem           # mkcert local HTTPS key
│
├── .github/workflows/
│   └── ci-cd.yml                   # GitHub Actions: pytest → Docker build → GHCR publish
│
├── docker-compose.yml              # Nginx, Next.js, Flask, MySQL 8.0 services
├── Dockerfile.frontend             # Frontend Docker image
├── middleware.ts                   # CSP headers, X-Frame-Options, security directives
├── next.config.mjs                 # Next.js configuration
├── package.json                    # Frontend dependencies
├── tailwind.config.ts              # Tailwind configuration
├── tsconfig.json                   # TypeScript configuration
└── README.md
```

---

## Three-Tier Architecture

```
User Browser
    |
    v
Nginx (HTTPS termination, HTTP → HTTPS redirect)
    |
    +---> Next.js Frontend (port 3000)
    |     Shared state, Mapbox GL JS, D3.js
    |
    +---> Flask Backend API (port 5000)
                |
                v
        SQLite (development) / MySQL 8.0 (production)
```

The single-response dual-update mechanism is the architectural centrepiece: one `GET /api/entities?century_year={n}` call updates both the Mapbox map markers and the D3.js graph nodes within the same render cycle, directly realising cross-view synchronisation (FR16).

---

## API Endpoints

| Endpoint | Description |
|---|---|
| `GET /api/entities` | All entities, optional `?century_year=` temporal filter |
| `GET /api/entities/<id>` | Single entity with relationships |
| `GET /api/routes` | All routes for Mapbox polyline rendering |
| `GET /api/search?q=<query>` | Case-insensitive entity search by name, type, region |

The temporal filter uses a window overlap predicate (`start_year ≤ windowEnd AND end_year ≥ windowStart`) to correctly return entities active across multi-century periods.

---

## Database Setup

### Local SQLite

```bash
cd backend
pip install -r requirements.txt
python seed.py
python app.py
```

### Docker MySQL (production-style)

```bash
docker compose up --build
```

Seed the database if needed:

```bash
docker exec -it silkroad_backend sh
cd backend
python seed.py
```

Verify seeding with MySQL Workbench:

```sql
USE silkroad_db;
SELECT COUNT(*) FROM entity;           -- 77
SELECT COUNT(*) FROM entity_relation;  -- 113
SELECT COUNT(*) FROM century_note;     -- 90
SELECT COUNT(*) FROM route_segment;    -- 14
```

---

## Running the Project

### Frontend only

```bash
npm install
npm run dev
```

Open: `http://localhost:3000`

### Backend only

```bash
cd backend
pip install -r requirements.txt
python seed.py
python app.py
```

API: `http://localhost:5000/api/entities`

### Full Docker stack

```bash
docker compose up --build
```

| Service | URL | Port |
|---|---|---|
| Nginx | https://localhost | 80 / 443 |
| Frontend | http://localhost:3000 | 3000 |
| Backend | http://localhost:5000 | 5000 |
| MySQL | localhost | 3306 |

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Yes | Mapbox public token for map rendering |
| `NEXT_PUBLIC_API_URL` | Recommended | Backend API base URL |
| `MYSQL_DATABASE` | Docker | MySQL database name |
| `MYSQL_USER` | Docker | MySQL username |
| `MYSQL_PASSWORD` | Docker | MySQL password |
| `MYSQL_ROOT_PASSWORD` | Docker | MySQL root password |
| `DATABASE_URL` | Backend | SQLAlchemy connection string (MySQL or SQLite) |

Sensitive values are managed via `.env` files excluded from version control via `.gitignore`.

---

## Security

| Measure | Implementation |
|---|---|
| SQL injection prevention | SQLAlchemy ORM parameterisation |
| XSS and path traversal blocking | `lib/firewall.ts` at request level |
| HTTPS enforcement | Nginx with mkcert self-signed certificate |
| Content Security Policy | `middleware.ts` — `default-src 'self'`, `frame-ancestors 'none'` |
| Credential management | Environment variables, excluded from version control |
| SAST | SonarQube Cloud — Security Rating A, zero open issues |

---

## Testing

### Backend tests

```bash
pytest backend/tests
```

5 tests covering entity, route, and search endpoints — all passing.

### Functional tests

37 manual test cases covering all functional and non-functional requirements — all passing.

### Code quality

```bash
cd backend
black .        # deterministic formatting
pylint .       # score: 9.86/10
```

---

## Dataset Citation

```bibtex
@dataset{alnajem2026silkroads,
  title        = {The Silk Roads Nexus: Curated Micro-Dataset of Cultural Heritage Entities, Relationships, and Historical Annotations},
  author       = {Alnajem, Saud Najem S.},
  year         = {2026},
  organization = {Newcastle University},
  doi          = {10.5281/zenodo.19684922},
  url          = {https://doi.org/10.5281/zenodo.19684922},
  license      = {CC BY-NC 4.0}
}
```

## Platform Citation

```bibtex
@software{alnajem2026silkroadnexus,
  title        = {The Silk Roads Nexus: A Coordinated Multi-View Platform for Integrated Spatial, Temporal, and Semantic Exploration of Silk Roads Cultural Heritage},
  author       = {Alnajem, Saud Najem S.},
  year         = {2026},
  organization = {Newcastle University},
  url          = {https://github.com/saudNA9/CSC3094-silk-roads-nexus}
}
```

---

## License and Attribution

Code developed as part of CSC3094 Major Project Dissertation at Newcastle University, 2025–2026.
Dataset license: CC BY-NC 4.0.

*Built by Saud Najem S. Alnajem, 2026.*
