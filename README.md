# The Silk Road Nexus

**A Coordinated Multi-View Data-Driven Platform for Integrated Spatial, Temporal, and Semantic Exploration of Silk Roads Cultural Heritage**

---

## Academic Context

| Field | Detail |
|---|---|
| Module | CSC3094 Software Engineering Project |
| Institution | School of Computing, Newcastle University |
| Author | Saud Najem S. Alnajem (230266960) |
| Supervisor | Dr. Rouaa Yassin Kassab |
| Academic Year | 2025–2026 |
| Dataset DOI | https://doi.org/10.5281/zenodo.19684922 |
| Dataset License | CC BY-NC 4.0 |

---

## Overview

The Silk Road Nexus is an interactive digital heritage platform developed for CSC3094. It enables users to explore Silk Roads cultural heritage through three coordinated views:

- **Spatial View** — an interactive Mapbox map showing cities, routes, and custom 3D city markers.
- **Temporal View** — a century-based timeline that filters entities and routes across historical periods.
- **Semantic View** — a relationship graph showing how cities, routes, goods, persons, events, and inscriptions connect.

The platform addresses fragmentation in existing digital heritage systems by linking map, timeline, and graph interactions through a shared dataset and backend API.

---

## Core Contribution

Existing Silk Roads resources often separate historical information across maps, text, timelines, and databases. This increases the effort required to understand where events happened, when they occurred, and how entities were connected.

The Silk Road Nexus was designed to reduce this fragmentation by coordinating:

- geographic exploration,
- temporal filtering,
- semantic relationship navigation,
- contextual entity details,
- traveller journey exploration.

Selecting or filtering data in one part of the system updates the wider exploration experience, supporting non-linear historical discovery.

---

## Features

- Interactive Mapbox map with Silk Roads cities and route overlays
- Custom 3D architectural city markers
- Century-based temporal filtering from ancient to late medieval periods
- D3.js semantic relationship graph
- Entity detail panels and entity pages
- Traveller mode for historical figures such as Marco Polo, Ibn Battuta, Xuanzang, Zhang Qian, and Zheng He
- Search functionality for entities and historical content
- Dark and light theme support
- Flask backend API for entities, routes, and search
- SQLAlchemy ORM database layer
- SQLite support for local development
- MySQL support for Docker/production-style deployment
- Docker Compose setup with frontend, backend, MySQL, and Nginx
- Nginx reverse proxy configuration
- Shared JSON dataset used by both frontend and backend

---

## Dataset

The platform is powered by a curated Silk Roads micro-dataset created for this CSC3094 project.

The academic dataset was first constructed in Excel and published on Zenodo. For implementation, it was transformed into a shared JSON dataset located at:

```
data/silk-road-data.json
```

This JSON file is the operational source used by both layers of the system:

- the frontend consumes it through `lib/silk-road-data.ts`
- the backend seeding script `backend/seed.py` reads it to populate the database

The published dataset defines:

- 81 conceptual entity records
- 50 typed relationship records
- 45 century-level temporal annotations
- six entity types: City, Route, Good, Event, Person, and Inscription
- temporal coverage from approximately 300 BCE to 1500 CE

During database seeding, the operational MySQL database stores:

- 77 entity records after implementation-level merging
- 113 relationship rows after deriving additional entity-level associations
- 90 century-note rows after normalising embedded and explicit annotations
- 14 route segments

**Published dataset DOI:** https://doi.org/10.5281/zenodo.19684922  
**License:** CC BY-NC 4.0

### Dataset Pipeline

```
Curated Silk Roads Dataset (Excel)
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
              SQLite / MySQL
```

This structure prevents frontend/backend data divergence and ensures that both the interface and database are derived from the same curated source.

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | Next.js 15 | App Router, page routing, frontend architecture |
| Language | TypeScript | Type safety and structured frontend development |
| Styling | Tailwind CSS + shadcn/ui | Responsive interface and reusable UI components |
| Map | Mapbox GL JS | Spatial visualisation and interactive map rendering |
| Graph | D3.js | Semantic relationship graph visualisation |
| Backend | Flask | REST API layer |
| ORM | SQLAlchemy | Database abstraction and safer queries |
| Database | SQLite / MySQL | Local and production-style persistence |
| Deployment | Docker Compose | Multi-service container orchestration |
| Proxy | Nginx | Reverse proxy and routing |

---

## Project Structure

```
CSC3094-silk-road-nexus-230266960/
├── app/                            # Next.js App Router pages
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout and metadata
│   ├── explore/                    # Coordinated exploration interface
│   ├── graph/                      # Semantic graph page
│   ├── traveller/                  # Traveller mode pages
│   ├── entity/[id]/                # Entity detail pages
│   └── architecture/               # Architecture documentation page
│
├── backend/                        # Flask API backend
│   ├── app.py                      # Flask app factory and blueprint registration
│   ├── config.py                   # Database configuration
│   ├── models.py                   # SQLAlchemy ORM models
│   ├── seed.py                     # Seeds database from shared JSON dataset
│   ├── requirements.txt            # Python dependencies
│   ├── Dockerfile                  # Backend Docker image
│   ├── silk_road.db                # Local SQLite development database
│   ├── routes/
│   │   ├── entities.py             # Entity API routes
│   │   ├── routes.py               # Trade-route API routes
│   │   └── search.py               # Search API routes
│   └── tests/
│       └── test_api.py             # Backend API tests
│
├── components/
│   ├── explore/
│   │   ├── silk-road-map.tsx       # Mapbox map and route rendering
│   │   ├── city-3d-marker.tsx      # Custom 3D city markers
│   │   ├── entity-panel.tsx        # Selected entity panel
│   │   └── filter-panel.tsx        # Timeline/type filters
│   ├── graph/
│   │   └── relationship-graph.tsx  # D3 relationship graph
│   ├── ui/                         # shadcn/ui components
│   ├── search-command.tsx          # Search command component
│   ├── theme-provider.tsx          # Theme provider
│   └── top-nav.tsx                 # Main navigation
│
├── data/
│   └── silk-road-data.json         # Shared operational dataset source
│
├── lib/
│   ├── silk-road-data.ts           # TypeScript access layer for shared dataset
│   ├── api-client.ts               # Frontend API client
│   ├── city-architectures.ts       # 3D marker definitions
│   ├── city-historical-events.ts   # City timeline/event data
│   ├── city-images.ts              # Image references
│   ├── firewall.ts                 # Firewall/security helper logic
│   ├── security.ts                 # Input/security utilities
│   ├── traveller-data.ts           # Traveller route data
│   └── utils.ts                    # Shared utility functions
│
├── public/
│   └── images/                     # Static images and traveller portraits
│
├── scripts/
│   └── export-dataset-to-json.ts   # Dataset export/transformation script
│
├── nginx/
│   └── default.conf                # Nginx reverse proxy configuration
│
├── styles/
│   └── globals.css                 # Global styling
│
├── certificates/
│   ├── localhost.pem               # Local HTTPS certificate
│   └── localhost-key.pem           # Local HTTPS key
│
├── docker-compose.yml              # Frontend, backend, MySQL, Nginx services
├── Dockerfile.frontend             # Frontend Docker image
├── middleware.ts                   # Next.js middleware/security headers
├── next.config.mjs                 # Next.js configuration
├── package.json                    # Frontend dependencies and scripts
├── package-lock.json               # npm lock file
├── pnpm-lock.yaml                  # pnpm lock file
├── postcss.config.mjs              # PostCSS configuration
├── tailwind.config.ts              # Tailwind configuration
├── tsconfig.json                   # TypeScript configuration
├── components.json                 # shadcn/ui configuration
├── DATABASE_SETUP.md               # Database setup notes
├── FIREWALL_RULES.md               # Firewall/security notes
├── .env                            # Environment variables
├── .env.local                      # Local environment variables
├── .gitignore
├── .dockerignore
└── README.md
```

---

## Three-Tier Architecture

The system follows a three-tier client-server architecture:

```
User Browser
    |
    v
Nginx Reverse Proxy
    |
    +---> Next.js Frontend
    |
    +---> Flask Backend API
                |
                v
        SQLite / MySQL Database
```

The frontend handles visual interaction and coordinated views. The backend exposes API endpoints and manages database access. The database stores the operational dataset used by the platform.

---

## API Endpoints

The Flask backend provides API routes for the frontend:

```
GET /api/entities
GET /api/entities/<id>
GET /api/routes
GET /api/search?q=<query>
```

The frontend can use the backend API when available, while the shared dataset also supports frontend rendering during development.

---

## Database Setup

The backend supports both SQLite and MySQL through SQLAlchemy.

### Local SQLite

SQLite is used for lightweight local development.

```bash
cd backend
python seed.py
python app.py
```

### Docker MySQL

The production-style setup uses MySQL 8.0 through Docker Compose.

```bash
docker compose up --build
```

Seed the database inside the backend container if needed:

```bash
docker exec -it silkroad_backend sh
cd backend
python seed.py
```

The MySQL database can be inspected through MySQL Workbench using:

```sql
USE silkroad_db;
SELECT COUNT(*) FROM entity;
SELECT type, COUNT(*) FROM entity GROUP BY type;
SELECT COUNT(*) FROM entity_relation;
SELECT COUNT(*) FROM route_segment;
SELECT COUNT(*) FROM century_note;
```

Expected operational results after seeding:

```
entity:           77
route_segment:    14
entity_relation:  113
century_note:     90
```

The seeding script also prints:

```
Seed complete.
Entities seeded: 77
Route segments seeded: 14
Relationships processed: 50
Century notes processed: 45
```

The difference between processed source relationships and stored relationship rows is caused by implementation-level derived associations from embedded fields such as `relatedEntities`.

---

## Running the Project

### Frontend Development

```bash
npm install
npm run dev
```

Open: `http://localhost:3000`

### Backend Development

```bash
cd backend
pip install -r requirements.txt
python seed.py
python app.py
```

Backend API: `http://localhost:5000/api/entities`

### Full Docker Stack

```bash
docker compose up --build
```

Services:

```
frontend:  http://localhost:3000
backend:   http://localhost:5000
mysql:     localhost:3306
nginx:     http://localhost
```

---

## Docker Services

| Service | Purpose | Port |
|---|---|---|
| nginx | Reverse proxy | 80 / 443 |
| frontend | Next.js frontend | 3000 |
| backend | Flask API | 5000 |
| mysql | MySQL 8.0 database | 3306 |

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Yes | Public Mapbox token for map rendering |
| `NEXT_PUBLIC_API_URL` | Yes/Recommended | Backend API URL |
| `MYSQL_DATABASE` | Docker | MySQL database name |
| `MYSQL_USER` | Docker | MySQL user |
| `MYSQL_PASSWORD` | Docker | MySQL password |
| `MYSQL_ROOT_PASSWORD` | Docker | MySQL root password |
| `DATABASE_URL` | Backend | SQLAlchemy database connection string |

Sensitive values should not be committed to version control.

---

## Security and DevSecOps Measures

The project includes several security-focused implementation decisions:

- SQLAlchemy ORM used for all database queries
- Environment variables used for database credentials and API keys
- `.env` and `.env.local` excluded from version control
- Nginx reverse proxy separates public routing from internal services
- Docker Compose isolates frontend, backend, and database services
- Input/security helper utilities included in `lib/security.ts`
- Middleware support for request-level security handling

---

## Testing

Backend tests are stored in:

```
backend/tests/test_api.py
```

Run backend tests from the project root or backend environment:

```bash
pytest backend/tests
```

Frontend quality checks can be run with:

```bash
npm run lint
npm run typecheck
```

Available scripts depend on the final `package.json` configuration.

---

## Dataset Citation

If using the dataset, cite:

```bibtex
@dataset{alnajem2026silkroads,
  title     = {The Silk Road Nexus Dataset: Curated Entity and Route Data for Integrated Spatial, Temporal, and Semantic Analysis},
  author    = {Alnajem, Saud Najem S.},
  year      = {2026},
  organization = {Newcastle University},
  doi       = {10.5281/zenodo.19684922},
  url       = {https://doi.org/10.5281/zenodo.19684922},
  license   = {CC BY-NC 4.0}
}
```

---

## Platform Citation

```bibtex
@software{alnajem2026silkroadnexus,
  title     = {The Silk Road Nexus: A Coordinated Multi-View Platform for Integrated Spatial, Temporal, and Semantic Exploration of Silk Roads Cultural Heritage},
  author    = {Alnajem, Saud Najem S.},
  year      = {2026},
  organization = {Newcastle University},
  url       = {https://github.com/saudNA9/CSC3094-silk-road-nexus}
}
```

---

## License and Attribution

Code developed as part of CSC3094 at Newcastle University, 2025–2026.  
Dataset license: CC BY-NC 4.0.

---

*Built by Saud Najem S. Alnajem, 2026.*