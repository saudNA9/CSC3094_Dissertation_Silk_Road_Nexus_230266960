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
| Academic Year    | 2025–2026                                           |
| Dataset DOI      | https://doi.org/10.5281/zenodo.19684922             |
| Dataset License  | CC BY-NC 4.0                                        |

---

## Overview

I built the Silk Road Nexus as an interactive platform that enables historians, researchers, and curious explorers to understand the ancient Silk Roads through three coordinated analytical perspectives—each complementing the others to reveal patterns that a single view could not expose:

- **Spatial Exploration (Map View)** — I integrated Mapbox GL to render the Silk Road network spatially. Users can see 3D architectural city markers I designed and animated trade route paths that evolve across centuries, transforming how people understand where commerce and culture flowed.

- **Temporal Analysis (Timeline Slider)** — I built a century-based filter covering 300 BCE to 1500 CE. This reveals how networks rose, flourished, declined, and sometimes revived—allowing users to see history not as static facts, but as living processes.

- **Semantic Networks (Knowledge Graph)** — I implemented a D3.js force-directed graph with six layout modes to visualise how cities, goods, people, and events connected. This semantic view exposes relationships that raw data alone cannot convey.

---

## Why I Built This

During my research, I realised that existing Silk Road tools treated the network as either purely geographic (maps with no context) or purely textual (lists and tables). None offered *coordinated* exploration—where selecting an entity in one view automatically highlights it in all others.

I set out to change that. Every design decision in this platform prioritises **coherence across views**:
- Select a city on the map → it highlights in the graph and shows its full details
- Advance the timeline → all three views animate simultaneously, showing how everything evolved
- Search for a merchant → you can follow their entire journey, then explore all the cities they visited

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
| Containerisation | Docker + docker-compose                 | Reproducible environments; deployment-ready architecture; platform-agnostic |
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
├── .env.local               # Environment variable 
├── .eslintrc.json              # ESLint rules
├── .prettierrc                 # Prettier formatting config
└── README.md                   # This file
```

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
cp .env.local .env.local
# Add your NEXT_PUBLIC_MAPBOX_TOKEN to .env.local

# Start the dev server with hot reload
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000). The app uses the static dataset by default — zero backend needed.

### Full Stack Development (Frontend + Backend)

To run both the Next.js frontend and Flask API:

```bash
# Terminal 1: Start the frontend
npm run dev

# Terminal 2: Start the backend
cd backend
pip install -r requirements.txt
python seed.py              # one-time: create tables and seed data
flask run --port 5000
```

Set `NEXT_PUBLIC_API_URL=http://localhost:5000` in `.env.local` to use the live backend.

### Docker (Containerised Deployment)

I containerised the app for reproducible deployments:

```bash
# Production image
npm run docker:build
npm run docker:run

# Development with hot reload
npm run docker:dev

# Entire stack via docker-compose
docker-compose up
```

---

## Environment Variables

| Variable                  | Required | Default | Description |
|---------------------------|----------|---------|---|
| `NEXT_PUBLIC_MAPBOX_TOKEN`| Yes      | —       | Public Mapbox GL JS access token |
| `NEXT_PUBLIC_API_URL`     | No       | (static data) | Flask backend URL; if omitted, uses bundled TypeScript dataset |

---

## Dataset

I curated a comprehensive Silk Road dataset with:

- **16 historic cities** from Constantinople to Chang'an, each with coordinates, historical significance, and century-by-century narratives
- **14 trade routes** (3 primary networks, 11 secondary branches) with animated polylines and temporal date ranges
- **6 historical travellers** with documented routes: Marco Polo, Ibn Battuta, Xuanzang, Zhang Qian, Fa Xian, Zheng He
- **100+ entities** across 6 types: City, Route, Person, Good, Event, Inscription
- **Temporal range**: 300 BCE – 1500 CE, allowing exploration of 18 centuries of Silk Road evolution

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

1. **Code Quality** — ESLint, Prettier, and TypeScript type-checking ensure consistent style and catch errors before merge
2. **Build Verification** — Full Next.js build and Docker image build sanity-check on all branches
3. **Security Scanning** — Automated vulnerability scanning of Docker images using Trivy

---

## Deployment-Ready Architecture

I containerised the entire application for reproducible, portable deployments to any Docker-capable environment—whether a cloud server, on-premises infrastructure, or research institution. No vendor lock-in.

### Containerisation Strategy

```bash
# Frontend & Backend containerised
npm run docker:build      # Build production images
npm run docker:run        # Run containerised stack locally

# Development mode with hot reload
npm run docker:dev        # Containers with live source mounting

# Full orchestration
docker-compose up         # Spin up entire stack (dev + prod profiles)
```

### Deployment Instructions

**Frontend Container** — Build and run the Next.js app:
```bash
docker build -t silk-road-nexus .
docker run -p 3000:3000 --env-file .env silk-road-nexus
```

**Backend Container** — Build and run the Flask API:
```bash
docker build -f Dockerfile.backend -t silk-road-api .
docker run -p 5000:5000 --env-file .env silk-road-api
```

Set `NEXT_PUBLIC_API_URL=<your-backend-url>` in the frontend environment to connect to the backend. The architecture is flexible—deploy to AWS, Google Cloud, Azure, on-premises, or any Docker host that fits your institution's infrastructure.

---

## Performance Optimizations

I prioritised performance for researchers who need instant feedback:

- **Next.js Server Components** reduce client-side JavaScript
- **Mapbox vector tiles** enable GPU acceleration for smooth pans/zooms
- **D3 worker threads** prevent main thread blocking during force simulation
- **API fallback** — if backend is slow, the app instantly uses static data
- **Image optimisation** —  built-in Image component handles responsive serving

---

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

- **Machine learning clustering** — auto-discover route patterns humans missed
- **Real-time collaboration** — allow teams to annotate and share discoveries
- **Time-lapse animations** — let users scrub through 2000 years of trade in seconds
- **3D terrain** — add topography so users see how geography shaped routes
- **Export to academic formats** — PDF reports, GeoJSON, BibTeX citations

---

## License & Attribution

**Code**: Academic project, Newcastle University 2025–2026  
**Dataset**: CC BY-NC 4.0 — freely available for research and education

### Dataset Citation

If you publish work using this Silk Road dataset, please cite:

```bibtex
@dataset{alnajem2026silkroad,
  title = {The Silk Road Nexus Dataset: Curated Entity and Route Data for Integrated Spatial, Temporal, and Semantic Analysis (300 BCE – 1500 CE)},
  author = {Alnajem, Saud Najem S.},
  year = {2026},
  organization = {Newcastle University},
  doi = {10.5281/zenodo.19684922},
  url = {https://zenodo.org/records/19684922},
  license = {CC BY-NC 4.0}
}
```
```

---

## Support & Questions

For issues, feature requests, or questions:

1. **Check the Architecture page** — I documented design decisions at `/architecture`
2. **Read the inline comments** — every file has detailed headers explaining its purpose
3. **Open a GitHub issue** — describe what you found or what you'd like to build

---

**Built with curiosity and attention to detail.**  
*Saud Najem S. Alnajem, 2026*
