from math import asin, cos, radians, sin, sqrt

from app.schemas import Place, SearchFilters, SearchResult


def distance_miles(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """Calculate great-circle distance between two coordinates."""

    earth_radius_miles = 3958.8
    lat_delta = radians(lat2 - lat1)
    lng_delta = radians(lng2 - lng1)
    a = (
        sin(lat_delta / 2) ** 2
        + cos(radians(lat1)) * cos(radians(lat2)) * sin(lng_delta / 2) ** 2
    )
    return earth_radius_miles * 2 * asin(sqrt(a))


def _equipment_matches(place: Place, equipment_type: str) -> bool:
    return any(item.equipment_type == equipment_type for item in place.equipment)


def _large_cnc(place: Place, width: float, length: float) -> bool:
    return any(
        item.equipment_type == "cnc_router"
        and item.bed_width_in is not None
        and item.bed_length_in is not None
        and min(item.bed_width_in, item.bed_length_in) >= min(width, length)
        and max(item.bed_width_in, item.bed_length_in) >= max(width, length)
        for item in place.equipment
    )


def place_passes_filters(place: Place, filters: SearchFilters) -> bool:
    """Apply hard user filters while preserving optional possible matches."""

    if filters.public_access is not None and place.public_access != filters.public_access:
        return False
    if filters.staff_assisted is not None and place.staff_assisted != filters.staff_assisted:
        return False

    requested_types = set(filters.equipment_types)
    if filters.cnc_router:
        requested_types.add("cnc_router")
    if requested_types and not all(_equipment_matches(place, item) for item in requested_types):
        return filters.show_maybe_matches and place.qualification_status.startswith("possible")

    if filters.min_bed_width_in and filters.min_bed_length_in:
        has_capacity = _large_cnc(
            place,
            filters.min_bed_width_in,
            filters.min_bed_length_in,
        )
        if not has_capacity:
            return filters.show_maybe_matches and place.qualification_status.startswith("possible")

    return True


def rank_place(
    place: Place,
    center_lat: float,
    center_lng: float,
    radius_miles: float,
    filters: SearchFilters,
) -> SearchResult:
    """Combine distance, equipment, capacity, access, and source confidence."""

    distance = distance_miles(center_lat, center_lng, place.lat, place.lng)
    distance_score = max(0, 100 * (1 - distance / max(radius_miles, 1)))

    requested_types = set(filters.equipment_types)
    if filters.cnc_router:
        requested_types.add("cnc_router")
    if requested_types:
        confirmed = sum(_equipment_matches(place, item) for item in requested_types)
        equipment_score = 100 * confirmed / len(requested_types)
    else:
        equipment_score = min(100, len(place.equipment) * 20)

    capacity_required = bool(filters.min_bed_width_in and filters.min_bed_length_in)
    capacity_passes = (
        _large_cnc(
            place,
            filters.min_bed_width_in or 48,
            filters.min_bed_length_in or 48,
        )
        if capacity_required
        else any(item.passes_48x48 for item in place.equipment)
    )
    capacity_score = 100 if capacity_passes else 20 if _equipment_matches(place, "cnc_router") else 0

    access_score = 100 if place.public_access else 72 if place.access_type != "unknown" else 25
    source_confidence_score = place.confidence_score

    final_score = (
        0.25 * distance_score
        + 0.30 * equipment_score
        + 0.20 * capacity_score
        + 0.15 * access_score
        + 0.10 * source_confidence_score
    )

    why = []
    if capacity_passes:
        why.append("Confirmed CNC work area meets the requested sheet size")
    if _equipment_matches(place, "cnc_router"):
        why.append("Official source confirms a CNC router")
    if place.staff_assisted:
        why.append("Staff-assisted fabrication is available")
    if place.public_access:
        why.append("Public or member access is clearly explained")
    if not why:
        why.append("Relevant fabrication equipment is documented")

    return SearchResult(
        **place.model_dump(),
        distance_miles=round(distance, 1),
        final_score=round(final_score, 1),
        why_matched=why,
    )

