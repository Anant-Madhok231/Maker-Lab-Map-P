# Maker Lab Map P

Maker Lab Map P is a location-based maker-lab finder for Brooklyn, New York. It ranks labs, workshops, hackerspaces, school labs, and fabrication hubs by documented capability, access notes, and source evidence.

The included MVP works immediately with a curated, evidence-backed Brooklyn dataset. Optional Google Places, Google Geocoding, and Firecrawl keys enable live discovery and official-site recrawls.

## What is included

- Location search for Brooklyn, Sunset Park, Industry City, Downtown Brooklyn, Gowanus, Fort Greene, and Brooklyn Navy Yard
- Radius controls from 5 to 100 miles
- CNC-router, equipment, access, and guided-support filters
- Browser location button for exact distance from the visitor's pin
- Google Maps driving and walking direction links for every listed lab
- Capability-weighted ranking that can outrank a closer but unverified space
- Official source, evidence snippet, fetch date, source type, and confidence on every equipment claim
- Detail pages for equipment, machine dimensions, materials, files, access, and hours
- Verification dashboard with recrawl and manual-review actions
- FastAPI endpoints matching the project specification
- PostgreSQL/PostGIS schema with geospatial and evidence indexes
- Redis/RQ background-job boundaries for crawling and confidence updates
- Google Places API (New) and Firecrawl integration points
- Automated tests for dimensions, ranking, and provenance

## Quick start

### 1. Start the backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The API is available at [http://localhost:8000](http://localhost:8000), with interactive documentation at [http://localhost:8000/docs](http://localhost:8000/docs).

### 2. Start the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### One-command container setup

If Docker is installed:

```bash
cp .env.example .env
docker compose up --build
```

This starts the frontend, backend, PostGIS, Redis, and an RQ worker.

## Optional live API configuration

Copy `.env.example` to `.env` and add the keys you want to use:

```dotenv
GOOGLE_MAPS_API_KEY=
FIRECRAWL_API_KEY=
YELP_API_KEY=
```

Without keys:

- Known Brooklyn locations use a transparent local geocoding fallback.
- Search uses the curated source-backed records.
- Live discovery and recrawl endpoints return a clear configuration message.

With keys:

- `/api/geocode` uses Google Geocoding.
- `/api/admin/discover` uses Google Places Text Search (New) with a field mask.
- `/api/admin/crawl/{place_id}` uses Firecrawl on the official website.

No Google Maps HTML is scraped.

## Main API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/geocode` | Convert typed location text to coordinates |
| `POST` | `/api/search` | Return ranked, filtered places with evidence |
| `GET` | `/api/places/{id}` | Return full place and equipment detail |
| `POST` | `/api/admin/discover` | Run live candidate discovery |
| `POST` | `/api/admin/crawl/{place_id}` | Recrawl an official website |
| `POST` | `/api/admin/verify/{place_id}` | Record a manual verification update |
| `POST` | `/api/report-correction` | Accept a user or owner correction |

## Data integrity rules

The API schema and PostgreSQL constraint both reject an equipment claim without:

- a source URL
- evidence text
- a fetch timestamp
- a source type
- a confidence value from 0 to 1

Unknown specifications remain `null`. A general “makerspace” description does not become a CNC claim. A CNC router with no official size evidence does not pass the 48 × 48 inch filter.

## Running checks

Backend:

```bash
cd backend
pytest
```

Frontend:

```bash
cd frontend
npm run typecheck
npm run lint
npm run build
```

## Project structure

```text
backend/
  app/
    main.py              API routes
    schemas.py           validated request and response models
    seed.py              evidence-backed MVP records
    services/            geocoding, providers, dimensions, and ranking
    worker.py            Redis/RQ job boundaries
  tests/
database/
  schema.sql             PostgreSQL + PostGIS schema
frontend/
  app/                   home, results, details, and verification pages
  components/            reusable interface building blocks
  lib/                   API client and shared types
```
