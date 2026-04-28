# The Silk Road Nexus

**A Coordinated Multi-View Data-Driven Platform for Integrated Spatial, Temporal, and Semantic Exploration of Silk Roads Cultural Heritage**

---

## Academic Context

| Field            | Detail                                              |
|------------------|-----------------------------------------------------|
| Module           | CSC3094 Software Engineering Project                |
| Institution      | School of Computing, Newcastle University           |
| Author           | Saud Najem S. Alnajem (230266960)                   |
| Supervisor       | Dr. Rouaa Yassin Kassab                             |
| Academic Year    | 2025-2026                                           |
| Dataset DOI      | https://doi.org/10.5281/zenodo.19684922             |
| Dataset License  | CC BY-NC 4.0                                        |

---

## Overview

I built the Silk Road Nexus as an interactive platform that enables historians, researchers, and curious explorers to understand the ancient Silk Roads through three coordinated analytical perspectives—each complementing the others to reveal patterns that a single view could not expose:

- **Spatial Exploration (Map View)** — I integrated Mapbox GL to render the Silk Road network spatially. Users can see 3D architectural city markers I designed and animated trade route paths that evolve across centuries, transforming how people understand where commerce and culture flowed.

- **Temporal Analysis (Timeline Slider)** — I built a century-based filter covering 300 BCE to 1500 CE. This reveals how networks rose, flourished, declined, and sometimes revived-allowing users to see history not as static facts, but as living processes.

- **Semantic Networks (Knowledge Graph)** — I implemented a D3.js force-directed graph with six layout modes to visualise how cities, goods, people, and events connected. This semantic view exposes relationships that raw data alone cannot convey.

---

## Why I Built This

During my research, I realised that existing Silk Road tools treated the network as either purely geographic (maps with no context) or purely textual (lists and tables). None offered *coordinated* exploration—where selecting an entity in one view automatically highlights it in all others.

I set out to change that. Every design decision in this platform prioritises **coherence across views**:
- Select a city on the map -> it highlights in the graph and shows its full details
- Advance the timeline -> all three views animate simultaneously, showing how everything evolved
- Search for a merchant -> you can follow their entire journey, then explore all the cities they visited

This triadic approach transforms the Silk Road from a historical curiosity into an explorable, *interactive* network.

---

## Research Foundation

This platform addresses a documented gap in existing digital heritage systems. While platforms like UNESCO Silk Roads Map and Europeana provide valuable resources, they typically implement spatial, temporal, and semantic exploration as isolated components. This fragmentation increases cognitive load—users must manually cross-reference between map, timeline, and entity pages.

I designed the Silk Road Nexus based on research into:
- **Exploratory Search** — Users learn through iterative, non-linear interaction; rigid workflows inhibit discovery
- **Coordinated Visualisation** — Linked views help users recognise patterns and relationships more effectively than isolated perspectives
- **Entity-Based Modelling** — Explicit semantic relationships between cities, goods, events, and figures support meaningful navigation

The result is a unified architecture where actions in any view instantly propagate to all others, enabling researchers to follow hunches across temporal, spatial, and relational dimensions simultaneously.

---

## Features

I implemented the following core features:

- **Interactive Mapbox map** with custom 3D architectural city markers, animated trade route overlays, and century-based entity filtering
- **D3.js knowledge graph** with six layout modes (force-directed, hierarchical, radial, cluster, timeline, geographic) to reveal different structural patterns
- **Traveller Mode** — follow the documented journeys of Marco Polo, Ibn Battuta, Xuanzang, Zhang Qian, Fa Xian, and Zheng He, with animated route playback and journey statistics
- **Full-text semantic search** with weighted field importance (name, region, type, goods, figures, events) and ranked results
- **Dark / light theme support** for accessibility across different user preferences and lighting conditions
- **Architecture documentation page** explaining the data model, entity relationships, and system design decisions
- **Dual data mode**: static TypeScript dataset by default (zero-latency fallback) or live Flask/MySQL backend for production deployments
- **Responsive design** that scales from mobile exploration to large-screen research workflows

---

## Tech Stack

| Layer        | Technology                                  | Why I Chose It |
|--------------|---------------------------------------------|---|
| Framework    | Next.js 15 (App Router)                     | Server components + streaming for instant page loads; built-in optimisation |
| Language     | TypeScript                                  | Catches errors at compile time; self-documenting type safety |
| Styling      | Tailwind CSS + shadcn/ui                    | Rapid prototyping with consistency; fully customisable component library |
| Map          | Mapbox GL JS                                | GPU-accelerated rendering; 3D marker support; vector tiles for smooth zooming |
| Graph        | D3.js (force simulation)                    | Most powerful force-directed layout engine; full control over physics |
| Backend      | Flask (Python) + SQLAlchemy ORM             | Lightweight, flexible; easy to extend; excellent for rapid research prototyping |
| Database     | SQLite (dev) / MySQL (prod)                 | SQLite requires zero setup locally; MySQL scales for production |
| Containerisation | Docker + docker-compose + Nginx reverse proxy | Reproducible environments; three-tier architecture; platform-agnostic |
| Fonts        | Inter (body), JetBrains Mono (code)         | Readable at all sizes; monospace improves data table legibility |

---

## Project Structure

```
silk-road-nexus/
├── app/                        # Next.js App Router pages
│   ├── page.tsx                # Landing page with project overview
│   ├── layout.tsx              # Root layout; fonts, metadata, theme provider
│   ├── explore/page.tsx        # Spatial exploration view (interactive map)
│   ├── graph/page.tsx          # Semantic network graph view (D3 knowledge graph)
│   ├── traveller/page.tsx      # Historical traveller mode listing
│   ├── traveller/[id]/page.tsx # Individual traveller route detail + animation
│   ├── entity/[id]/page.tsx    # Entity detail page (city, good, person, etc.)
│   ├── architecture/page.tsx   # System architecture + data model documentation
│   ├── not-found.tsx           # Custom 404 page with caravan illustration
│   └── globals.css             # Global design tokens, Tailwind resets
│
├── components/
│   ├── top-nav.tsx             # Global navigation bar + dark/light toggle
│   ├── search-command.tsx      # Command palette for full-text search
│   ├── theme-provider.tsx      # next-themes dark mode context
│   ├── explore/                # Map view components
│   │   ├── silk-road-map.tsx   # Mapbox map wrapper + route/entity rendering
│   │   ├── filter-panel.tsx    # Century slider + entity type filters
│   │   ├── entity-panel.tsx    # Selected entity detail panel (slides in)
│   │   └── city-3d-marker.tsx  # Custom CSS 3D city marker component
│   ├── graph/
│   │   └── relationship-graph.tsx  # D3 force-directed network graph
│   └── ui/                     # shadcn/ui component library (buttons, inputs, etc.)
│
├── lib/
│   ├── silk-road-data.ts       # Master dataset (primary data source)
│   │   │                       # 16 cities, 14 routes, 6 traveller journeys
│   │   │                       # 300 BCE – 1500 CE temporal coverage
│   ├── api-client.ts           # Dual-mode API client (try Flask, fallback to static data)
│   ├── traveller-data.ts       # Historical traveller route data + journey metadata
│   ├── city-architectures.ts   # 3D city marker architectural definitions
│   ├── city-images.ts          # City photograph references + captions
│   ├── city-historical-events.ts # Event timelines + city state transitions per century
│   ├── security.ts             # XSS prevention, URL validation, CSRF tokens
│   ├── utils.ts                # Tailwind class merging utility
│   └── constants.ts            # Shared constants (breakpoints, timeouts, etc.)
│
├── hooks/
│   ├── use-mobile.tsx          # Mobile breakpoint detection hook
│   └── use-toast.ts            # Toast notification state manager
│
├── middleware.ts                # Request security headers + correlation IDs
│
├── backend/                     # Flask Python backend
│   ├── app.py                  # Flask factory + blueprint registration
│   ├── config.py               # SQLAlchemy config (SQLite dev, MySQL prod)
│   ├── models.py               # SQLAlchemy ORM models (Entity, Route, etc.)
│   ├── seed.py                 # One-time database seeding script
│   ├── requirements.txt        # Python dependencies (Flask, SQLAlchemy, etc.)
│   └── routes/
│       ├── entities.py         # GET /api/entities, GET /api/entities/<id>
│       ├── routes.py           # GET /api/routes (trade route segments)
│       └── search.py           # GET /api/search?q= (full-text search)
│
├── .github/workflows/
│   ├── ci-cd.yml               # GitHub Actions: build, lint, Docker push
│   └── code-quality.yml        # GitHub Actions: ESLint, Prettier, TypeScript
│
├── Dockerfile                  # Multi-stage production image (Alpine runtime)
├── Dockerfile.dev              # Development image with hot reload
├── docker-compose.yml          # Orchestration for dev + prod profiles
│
├── next.config.mjs             # Next.js config + HTTP security headers
├── tailwind.config.ts          # Tailwind CSS theme + design tokens
├── postcss.config.mjs          # PostCSS pipeline
├── tsconfig.json               # TypeScript strict mode + path aliases
│
├── .env.example                # Environment variable template
├── .eslintrc.json              # ESLint rules
├── .prettierrc                 # Prettier formatting config
└── README.md                   # This file
```

---

## Three-Tier Architecture

The Silk Road Nexus implements a production-grade three-tier architecture with containerisation and reverse proxy routing:

```
User Browser
    |
    v
Nginx Reverse Proxy (port 80/443)
    |
    +---> Frontend (Next.js, port 3000)
    |
    +---> Backend API (Flask, port 5000)
            |
            v
        SQLite/MySQL Database
```

**Architectural benefits**:
- Single entry point (no port management for users)
- SSL/TLS termination at Nginx layer
- Backend services hidden behind proxy (improved security)
- Horizontal scaling (add multiple backend instances behind Nginx load balancing)
- Service isolation (each tier can be deployed independently)

---

## Database Setup

### Development: SQLite (Zero Setup)

SQLite is the default local database - no installation required:

```bash
# Create .env.local with SQLite database URL
echo "DATABASE_URL=sqlite:./data/app.db" > .env.local

# Create tables and seed data
node scripts/migrate-data.js

# Backend will use SQLite automatically
python backend/seed.py
```

SQLite database file will be created at `/data/app.db`.

### Production: MySQL

For production deployments with Docker:

```bash
# 1. Start MySQL via docker-compose
docker-compose up mysql

# 2. Create .env with MySQL connection string
echo "DATABASE_URL=mysql://root:password@mysql:3306/silk_road_nexus" > .env

# 3. Run migrations
python backend/seed.py

# 4. Start backend
docker-compose up backend
```

**MySQL via docker-compose** automatically:
- Creates the `silk_road_nexus` database
- Sets root password from `MYSQL_ROOT_PASSWORD` env var
- Exposes port 3306 (accessible from other containers via hostname `mysql`)
- Mounts `/var/lib/mysql` volume (persistent data)

### ORM Protection

Both SQLite and MySQL queries use **SQLAlchemy ORM** for automatic SQL injection protection:

```python
# Safe - SQLAlchemy parameterizes automatically
entity = Entity.query.filter_by(id=entity_id).first()

# All queries use prepared statements, never raw string concatenation
```

---

## Docker & DevSecOps

### Hardened Container Images

Production containers follow security best practices:

**Backend (Python Flask)**:
- Non-root user (`appuser`) prevents privilege escalation
- Multi-stage build removes dev dependencies from runtime image
- Minimal `python:3.11-slim` base (Alpine-like footprint)
- Read-only filesystem (writable only `/tmp`, `/var/tmp`)
- Health checks with automatic restart on failure
- Dropped Linux capabilities (only NET_BIND_SERVICE retained)

**Frontend (Next.js)**:
- Non-root user (`nextjs`) for isolation
- Multi-stage build (builder -> runtime)
- Alpine runtime image (minimal attack surface)
- Read-only filesystem except `/app/.next/cache`
- Security headers enforced (CSP, X-Frame-Options, HSTS)

**Nginx Reverse Proxy**:
- Alpine base image (~10MB vs standard ~180MB)
- Non-root user for worker processes
- SSL/TLS termination with hardcoded ciphers
- Rate limiting (100 req/min API, 30 req/min search)
- Request correlation tracking (X-Request-ID, X-Request-Timestamp)

### Building Hardened Images

```bash
# Production build with security hardening
docker-compose -f docker-compose.hardened.yml up

# Individual images
docker build -f backend/Dockerfile -t silk-road-api:latest .
docker build -f Dockerfile.frontend -t silk-road-nexus:latest .
```

### Security Features

- **No root execution** - all processes run as non-root users
- **Read-only filesystem** - prevents runtime modifications
- **Capability dropping** - removes unnecessary Linux capabilities
- **Health checks** - automatic recovery on service failure
- **No new privileges** - processes cannot escalate permissions
- **Localhost-only binding** - services only accessible through Nginx, not directly exposed

For detailed hardening checklist, see `DOCKER_HARDENING.md`.

---

## DevSecOps Practices

The platform implements comprehensive security measures across all layers:

### Code Security
- **XSS Prevention** - `sanitizeInput()` utility escapes all user input
- **SQL Injection Protection** - SQLAlchemy ORM parameterized queries
- **CSRF Tokens** - generated per-request via middleware
- **Type Safety** - TypeScript strict mode catches errors at compile time

### API Security
- **Security Headers** - CSP, X-Frame-Options, HSTS, X-Content-Type-Options, etc. (via middleware)
- **Request Tracking** - X-Request-ID and X-Request-Timestamp for audit logs
- **Rate Limiting** - backend enforces 100 req/min for API, 30 req/min for search
- **Secrets Management** - all API keys and passwords loaded from environment variables

### Container Security
- **Image Scanning** - GitHub Actions runs Trivy vulnerability scanner on every build
- **Multi-stage builds** - removes dev dependencies from final images
- **Non-root users** - all containers run without root privileges
- **Minimal base images** - Alpine, Slim variants reduce CVE surface
- **Read-only filesystems** - prevents runtime modifications

### CI/CD Pipeline
- **Automated testing** - ESLint, TypeScript, Prettier on every push
- **Docker build validation** - ensures images build successfully
- **Security scanning** - Trivy scans for known vulnerabilities
- **GitHub Actions workflows** - `.github/workflows/` directory

---

## Getting Started

### Prerequisites

I built this project to run on modern Node.js and standard Python. You'll need:

- **Node.js 20+** (I recommend 22 LTS for stability)
- **Mapbox account** with a public access token — [get one free here](https://www.mapbox.com/account/tokens/)
- *Optional*: Python 3.11+ if you want to run the Flask backend locally

### Local Development (Frontend Only)

The fastest way to explore the platform:

```bash
# Clone the repository
git clone https://github.com/saudNA9/CSC3094-silk-road-nexus.git
cd CSC3094-silk-road-nexus

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Add your NEXT_PUBLIC_MAPBOX_TOKEN to .env.local

# Start the dev server with hot reload
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000). The app uses the static dataset by default - zero backend needed.

### Full Stack Development (Frontend + Backend + Database)

To run the complete three-tier stack with MySQL:

**Option A: Docker Compose (Recommended)**
```bash
# Start entire stack (frontend, backend, MySQL, Nginx)
docker-compose up

# Or hardened production stack
docker-compose -f docker-compose.hardened.yml up
```

Access via `http://localhost` through Nginx reverse proxy.

**Option B: Local Processes**
```bash
# Terminal 1: Start the frontend
npm run dev

# Terminal 2: Start the backend
cd backend
pip install -r requirements.txt
python seed.py              # one-time: create tables and seed data
python app.py               # or: flask run --port 5000
```

Set `NEXT_PUBLIC_API_URL=http://localhost:5000` in `.env.local` to use the live backend.

### Docker (Containerised Deployment)

Production-ready containerised deployment with hardening:

```bash
# Hardened production stack (security best practices)
docker-compose -f docker-compose.hardened.yml up

# Development stack with hot reload
docker-compose -f docker-compose.yml up

# Individual service builds
docker build -f backend/Dockerfile -t silk-road-api:latest .
docker build -f Dockerfile.frontend -t silk-road-nexus:latest .
docker build -f nginx/Dockerfile -t silk-road-nginx:latest nginx/
```

---

## Environment Variables

| Variable                  | Required | Default | Description |
|---------------------------|----------|---------|---|
| `NEXT_PUBLIC_MAPBOX_TOKEN`| Yes      | -       | Public Mapbox GL JS access token |
| `NEXT_PUBLIC_API_URL`     | No       | (static data) | Flask backend URL; if omitted, uses bundled TypeScript dataset |
| `DATABASE_URL`            | No       | sqlite:./data/app.db | Database connection string (SQLite for dev, MySQL for prod) |
| `MYSQL_ROOT_PASSWORD`     | No       | root    | MySQL root password (used in docker-compose) |
| `FLASK_APP`               | No       | backend.app | Flask application entry point |
| `FLASK_ENV`               | No       | production | Flask environment (development or production) |

---

## Dataset

I curated a comprehensive Silk Road dataset with:

- **16 historic cities** from Constantinople to Chang'an, each with coordinates, historical significance, and century-by-century narratives
- **14 trade routes** (3 primary networks, 11 secondary branches) with animated polylines and temporal date ranges
- **6 historical travellers** with documented routes: Marco Polo, Ibn Battuta, Xuanzang, Zhang Qian, Fa Xian, Zheng He
- **100+ entities** across 6 types: City, Route, Person, Good, Event, Inscription
- **Temporal range**: 300 BCE - 1500 CE, allowing exploration of 18 centuries of Silk Road evolution

**Published on Zenodo**: [https://zenodo.org/records/19684922](https://zenodo.org/records/19684922)  
**License**: CC BY-NC 4.0

---

## Code Quality & CI/CD Infrastructure

I implemented maintainability tools and continuous integration for code quality assurance. This infrastructure ensures consistency and catches issues early in development, making the codebase robust and ready for deployment to any environment.

### Local Scripts

```bash
npm run lint              # ESLint check on all files
npm run lint:fix          # Auto-fix linting errors
npm run typecheck         # TypeScript type checking
npm run format            # Prettier auto-format
npm run format:check      # Check format without writing
npm run quality           # Run all checks in series
```

### GitHub Actions Pipeline

On every push:

1. **Code Quality** - ESLint, Prettier, and TypeScript type-checking ensure consistent style and catch errors before merge
2. **Build Verification** - Full Next.js build and Docker image build sanity-check on all branches
3. **Security Scanning** - Automated vulnerability scanning of Docker images using Trivy

---

## Deployment Options

The containerised architecture supports multiple deployment targets without code changes:

### Cloud Platforms
- **AWS** - ECS (Elastic Container Service) or EKS (Kubernetes)
- **Google Cloud** - Cloud Run or GKE
- **Azure** - Container Instances or AKS
- **DigitalOcean** - App Platform or Kubernetes

### On-Premises
- **Docker Swarm** - native clustering with docker-compose
- **Kubernetes** - via provided Dockerfiles and manifests
- **VM deployment** - with docker-compose orchestration

### Deployment Checklist

Before deploying to production:

1. Update `docker-compose.hardened.yml` with your domain/SSL certificates
2. Set all environment variables in `.env.docker` (use Nginx SSL, database credentials, API keys)
3. Run `docker-compose -f docker-compose.hardened.yml up -d` to start services
4. Verify health checks: `docker ps` should show all services healthy
5. Access via your domain (Nginx handles SSL/TLS termination)
6. Monitor logs: `docker logs -f silk-road-nexus` (frontend), `docker logs -f silk-road-api` (backend)

For detailed deployment instructions, see `DOCKER_HARDENING.md` and `DATABASE_SETUP.md`.

---

## Performance Optimizations

I prioritised performance for researchers who need instant feedback:

- **Next.js Server Components** reduce client-side JavaScript
- **Mapbox vector tiles** enable GPU acceleration for smooth pans/zooms
- **D3 worker threads** prevent main thread blocking during force simulation
- **API fallback** - if backend is slow, the app instantly uses static data
- **Image optimisation** - Vercel's built-in Image component handles responsive serving

## Browser Support

I tested and support:

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Android)

WebGL (for Mapbox) is required. Older browsers will see a graceful degradation message.

---

## Future Enhancements

If I were to continue this project, I would explore:

- **Machine learning clustering** - auto-discover route patterns humans missed
- **Real-time collaboration** - allow teams to annotate and share discoveries
- **Time-lapse animations** - let users scrub through 2000 years of trade in seconds
- **3D terrain** - add topography so users see how geography shaped routes
- **Export to academic formats** - PDF reports, GeoJSON, BibTeX citations

---

## License & Attribution

**Code**: Academic project, Newcastle University 2025-2026  
**Dataset**: CC BY-NC 4.0 - freely available for research and education

### Dataset Citation

If you publish work using this Silk Road dataset, please cite:

```bibtex
@dataset{alnajem2026silkroad,
  title = {The Silk Road Nexus Dataset: Curated Entity and Route Data for Integrated Spatial, Temporal, and Semantic Analysis (300 BCE - 1500 CE)},
  author = {Alnajem, Saud Najem S.},
  year = {2026},
  organization = {Newcastle University},
  doi = {10.5281/zenodo.19684922},
  url = {https://zenodo.org/records/19684922},
  license = {CC BY-NC 4.0}
}
```

### Platform Citation

To cite the Silk Road Nexus platform itself:

```bibtex
@software{alnajem2026silkroadnexus,
  title = {The Silk Road Nexus: A Multi-View Platform for Integrated Spatial, Temporal, and Semantic Exploration},
  author = {Alnajem, Saud Najem S.},
  year = {2026},
  organization = {Newcastle University},
  url = {https://github.com/saudNA9/CSC3094-silk-road-nexus}
}
```

---

## Support & Questions

For issues, feature requests, or questions:

1. **Check the Architecture page** - I documented design decisions at `/architecture`
2. **Read the inline comments** - every file has detailed headers explaining its purpose
3. **Open a GitHub issue** - describe what you found or what you'd like to build
4. **Review documentation** - See `DOCKER_HARDENING.md` and `DATABASE_SETUP.md` for detailed configuration

---

**Built with curiosity and attention to detail.**  
*Saud Najem S. Alnajem, 2026*
