import httpx

from app.config import Settings
from app.schemas import GeocodeResponse


# These stable local aliases keep the MVP useful before an API key is added.
LOCAL_LOCATIONS = {
    "uc davis": ("University of California, Davis, Davis, CA", 38.5382, -121.7617, "Davis"),
    "davis": ("Davis, CA, USA", 38.5449, -121.7405, "Davis"),
    "davis ca": ("Davis, CA, USA", 38.5449, -121.7405, "Davis"),
    "woodland": ("Woodland, CA, USA", 38.6785, -121.7733, "Woodland"),
    "woodland ca": ("Woodland, CA, USA", 38.6785, -121.7733, "Woodland"),
    "sacramento": ("Sacramento, CA, USA", 38.5816, -121.4944, "Sacramento"),
    "sacramento ca": ("Sacramento, CA, USA", 38.5816, -121.4944, "Sacramento"),
}


async def geocode(location: str, settings: Settings) -> GeocodeResponse:
    """Resolve a typed location with Google, falling back to the MVP city aliases."""

    normalized_key = " ".join(location.lower().replace(",", " ").split())
    if settings.google_maps_api_key:
        async with httpx.AsyncClient(timeout=12) as client:
            response = await client.get(
                "https://maps.googleapis.com/maps/api/geocode/json",
                params={"address": location, "key": settings.google_maps_api_key},
            )
            response.raise_for_status()
            data = response.json()
            if data.get("results"):
                result = data["results"][0]
                point = result["geometry"]["location"]
                city = next(
                    (
                        part["long_name"]
                        for part in result["address_components"]
                        if "locality" in part["types"]
                    ),
                    "",
                )
                return GeocodeResponse(
                    input_text=location,
                    normalized_address=result["formatted_address"],
                    lat=point["lat"],
                    lng=point["lng"],
                    city=city,
                    state="CA",
                )

    match = LOCAL_LOCATIONS.get(normalized_key)
    if not match:
        # Unknown locations stay centered on the initial service area until
        # Google Geocoding is configured, instead of pretending to know them.
        match = LOCAL_LOCATIONS["uc davis"]
    address, lat, lng, city = match
    return GeocodeResponse(
        input_text=location,
        normalized_address=address,
        lat=lat,
        lng=lng,
        city=city,
        state="CA",
    )

