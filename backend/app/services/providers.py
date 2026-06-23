from typing import Any

import httpx

from app.config import Settings


GOOGLE_FIELD_MASK = ",".join(
    (
        "places.id",
        "places.displayName",
        "places.formattedAddress",
        "places.location",
        "places.businessStatus",
        "places.websiteUri",
        "places.googleMapsUri",
        "places.nationalPhoneNumber",
        "places.regularOpeningHours",
        "places.currentOpeningHours",
        "places.types",
    )
)


async def discover_google_places(
    query: str,
    lat: float,
    lng: float,
    radius_meters: float,
    settings: Settings,
) -> list[dict[str, Any]]:
    """Discover candidates through Google Places Text Search (New)."""

    if not settings.google_maps_api_key:
        return []
    payload = {
        "textQuery": query,
        "locationBias": {
            "circle": {
                "center": {"latitude": lat, "longitude": lng},
                "radius": min(radius_meters, 50000),
            }
        },
    }
    headers = {
        "X-Goog-Api-Key": settings.google_maps_api_key,
        "X-Goog-FieldMask": GOOGLE_FIELD_MASK,
        "Content-Type": "application/json",
    }
    async with httpx.AsyncClient(timeout=20) as client:
        response = await client.post(
            "https://places.googleapis.com/v1/places:searchText",
            headers=headers,
            json=payload,
        )
        response.raise_for_status()
        return response.json().get("places", [])


async def scrape_with_firecrawl(url: str, settings: Settings) -> dict[str, Any]:
    """Fetch clean official-page content when Firecrawl is configured."""

    if not settings.firecrawl_api_key:
        return {"configured": False, "url": url}
    headers = {
        "Authorization": f"Bearer {settings.firecrawl_api_key}",
        "Content-Type": "application/json",
    }
    async with httpx.AsyncClient(timeout=45) as client:
        response = await client.post(
            "https://api.firecrawl.dev/v1/scrape",
            headers=headers,
            json={
                "url": url,
                "formats": ["markdown"],
                "onlyMainContent": True,
            },
        )
        response.raise_for_status()
        return response.json()

