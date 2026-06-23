from datetime import UTC, datetime
from uuid import uuid4

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.schemas import (
    CorrectionRequest,
    DiscoverRequest,
    GeocodeRequest,
    GeocodeResponse,
    Place,
    SearchRequest,
    SearchResponse,
    VerificationRequest,
)
from app.seed import PLACES, get_place
from app.services.geocoding import geocode
from app.services.providers import discover_google_places, scrape_with_firecrawl
from app.services.ranking import distance_miles, place_passes_filters, rank_place


settings = get_settings()
app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    description="Evidence-backed fabrication capability search for the Sacramento region.",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin, "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CRAWL_JOBS: list[dict] = []
CORRECTIONS: list[dict] = []


@app.get("/api/health")
def health() -> dict:
    return {
        "status": "ok",
        "seed_places": len(PLACES),
        "google_places_configured": bool(settings.google_maps_api_key),
        "firecrawl_configured": bool(settings.firecrawl_api_key),
    }


@app.post("/api/geocode", response_model=GeocodeResponse)
async def geocode_location(payload: GeocodeRequest) -> GeocodeResponse:
    return await geocode(payload.location, settings)


@app.post("/api/search", response_model=SearchResponse)
async def search(payload: SearchRequest) -> SearchResponse:
    center = await geocode(payload.location, settings)
    ranked = []
    for place in PLACES:
        distance = distance_miles(center.lat, center.lng, place.lat, place.lng)
        if distance > payload.radius_miles:
            continue
        if not place_passes_filters(place, payload.filters):
            continue
        ranked.append(
            rank_place(
                place,
                center.lat,
                center.lng,
                payload.radius_miles,
                payload.filters,
            )
        )
    ranked.sort(key=lambda item: item.final_score, reverse=True)
    return SearchResponse(
        query=payload.location,
        normalized_address=center.normalized_address,
        center_lat=center.lat,
        center_lng=center.lng,
        radius_miles=payload.radius_miles,
        total=len(ranked),
        results=ranked,
    )


@app.get("/api/places", response_model=list[Place])
def list_places() -> list[Place]:
    return PLACES


@app.get("/api/places/{place_id}", response_model=Place)
def place_detail(place_id: str) -> Place:
    place = get_place(place_id)
    if not place:
        raise HTTPException(status_code=404, detail="Place not found")
    return place


@app.post("/api/admin/discover")
async def discover(payload: DiscoverRequest) -> dict:
    center = await geocode(payload.location, settings)
    queries = [
        f"makerspace near {payload.location}",
        f"fab lab near {payload.location}",
        f"CNC routing service near {payload.location}",
    ]
    discovered = []
    for query in queries:
        discovered.extend(
            await discover_google_places(
                query,
                center.lat,
                center.lng,
                payload.radius_miles * 1609.344,
                settings,
            )
        )
    return {
        "status": "complete" if settings.google_maps_api_key else "configuration_required",
        "provider": "Google Places API (New)",
        "candidates_found": len(discovered),
        "message": (
            "Discovery completed."
            if settings.google_maps_api_key
            else "Add GOOGLE_MAPS_API_KEY to enable live candidate discovery."
        ),
    }


@app.post("/api/admin/crawl/{place_id}")
async def crawl_place(place_id: str) -> dict:
    place = get_place(place_id)
    if not place:
        raise HTTPException(status_code=404, detail="Place not found")
    job = {
        "id": str(uuid4()),
        "place_id": place_id,
        "status": "running",
        "started_at": datetime.now(UTC).isoformat(),
        "pages_crawled": 0,
    }
    CRAWL_JOBS.append(job)
    result = await scrape_with_firecrawl(str(place.website_url), settings)
    if not result.get("configured", True):
        job.update(
            status="configuration_required",
            finished_at=datetime.now(UTC).isoformat(),
            message="Add FIRECRAWL_API_KEY to run official-site recrawls.",
        )
    else:
        job.update(
            status="complete",
            finished_at=datetime.now(UTC).isoformat(),
            pages_crawled=1,
            message="Official landing page recrawled. Review extracted claims before publishing.",
        )
    return job


@app.post("/api/admin/verify/{place_id}")
def verify_place(place_id: str, payload: VerificationRequest) -> dict:
    place = get_place(place_id)
    if not place:
        raise HTTPException(status_code=404, detail="Place not found")
    place.qualification_status = payload.qualification_status
    place.confidence_score = payload.confidence_score
    place.last_checked_at = datetime.now(UTC)
    return {
        "status": "updated",
        "place_id": place_id,
        "qualification_status": place.qualification_status,
        "confidence_score": place.confidence_score,
        "note": payload.note,
    }


@app.get("/api/admin/jobs")
def list_jobs() -> list[dict]:
    return list(reversed(CRAWL_JOBS))


@app.post("/api/report-correction")
def report_correction(payload: CorrectionRequest) -> dict:
    report = {
        "id": str(uuid4()),
        **payload.model_dump(),
        "status": "new",
        "created_at": datetime.now(UTC).isoformat(),
    }
    CORRECTIONS.append(report)
    return {"status": "received", "report_id": report["id"]}

