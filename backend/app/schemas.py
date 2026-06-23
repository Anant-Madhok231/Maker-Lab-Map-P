from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field, HttpUrl, model_validator


SourceType = Literal[
    "official_website",
    "official_pdf",
    "directory",
    "google_places",
    "yelp",
    "osm",
    "social",
    "review",
    "inferred",
]


class Equipment(BaseModel):
    id: str
    equipment_type: str
    equipment_name: str
    brand_or_model: str | None = None
    bed_width_in: float | None = None
    bed_length_in: float | None = None
    bed_height_in: float | None = None
    passes_48x48: bool = False
    materials: list[str] = Field(default_factory=list)
    file_formats: list[str] = Field(default_factory=list)
    requires_training: bool | None = None
    staff_assisted: bool | None = None
    self_service: bool | None = None
    reservation_required: bool | None = None
    evidence_text: str
    source_url: HttpUrl
    source_type: SourceType
    fetched_at: datetime
    confidence: float = Field(ge=0, le=1)

    @model_validator(mode="after")
    def equipment_claim_must_be_sourced(self) -> "Equipment":
        """Reject equipment records that cannot show where the claim came from."""

        if not self.evidence_text.strip():
            raise ValueError("Every equipment claim requires evidence_text")
        return self


class Place(BaseModel):
    id: str
    name: str
    category: str
    description: str
    address: str
    city: str
    state: str
    postal_code: str
    lat: float
    lng: float
    website_url: HttpUrl
    phone: str | None = None
    email: str | None = None
    access_type: str
    access_notes: str
    hours_text: str
    business_status: str = "OPERATIONAL"
    qualification_status: str
    confidence_score: int = Field(ge=0, le=100)
    last_checked_at: datetime
    staff_assisted: bool | None = None
    public_access: bool | None = None
    student_only: bool | None = None
    member_only: bool | None = None
    equipment: list[Equipment]


class SearchFilters(BaseModel):
    cnc_router: bool = False
    min_bed_width_in: float | None = None
    min_bed_length_in: float | None = None
    public_access: bool | None = None
    staff_assisted: bool | None = None
    open_now: bool | None = None
    show_maybe_matches: bool = True
    equipment_types: list[str] = Field(default_factory=list)


class SearchRequest(BaseModel):
    location: str = "UC Davis"
    radius_miles: float = Field(default=50, ge=1, le=250)
    filters: SearchFilters = Field(default_factory=SearchFilters)


class SearchResult(Place):
    distance_miles: float
    final_score: float
    why_matched: list[str]


class SearchResponse(BaseModel):
    query: str
    normalized_address: str
    center_lat: float
    center_lng: float
    radius_miles: float
    total: int
    results: list[SearchResult]


class GeocodeRequest(BaseModel):
    location: str = Field(min_length=2)


class GeocodeResponse(BaseModel):
    input_text: str
    normalized_address: str
    lat: float
    lng: float
    city: str
    state: str


class DiscoverRequest(BaseModel):
    location: str = "UC Davis"
    radius_miles: float = Field(default=50, ge=1, le=250)


class VerificationRequest(BaseModel):
    qualification_status: str
    confidence_score: int = Field(ge=0, le=100)
    note: str = ""


class CorrectionRequest(BaseModel):
    place_id: str | None = None
    reporter_email: str | None = None
    message: str = Field(min_length=10, max_length=4000)

