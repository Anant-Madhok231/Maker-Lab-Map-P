CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS places (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    normalized_name text NOT NULL,
    category text NOT NULL,
    description text NOT NULL DEFAULT '',
    address text NOT NULL,
    city text NOT NULL,
    state text NOT NULL,
    postal_code text,
    country text NOT NULL DEFAULT 'US',
    lat double precision NOT NULL,
    lng double precision NOT NULL,
    geom geography(Point, 4326)
        GENERATED ALWAYS AS (ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography) STORED,
    google_place_id text UNIQUE,
    google_maps_uri text,
    website_url text,
    phone text,
    email text,
    business_status text NOT NULL DEFAULT 'OPERATIONAL',
    access_type text NOT NULL DEFAULT 'unknown',
    regular_hours jsonb NOT NULL DEFAULT '{}'::jsonb,
    current_hours jsonb NOT NULL DEFAULT '{}'::jsonb,
    rating numeric,
    user_rating_count integer,
    confidence_score integer NOT NULL DEFAULT 0 CHECK (confidence_score BETWEEN 0 AND 100),
    qualification_status text NOT NULL,
    last_checked_at timestamptz NOT NULL DEFAULT now(),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS places_geom_gix ON places USING gist (geom);
CREATE INDEX IF NOT EXISTS places_category_idx ON places (category);
CREATE INDEX IF NOT EXISTS places_qualification_idx ON places (qualification_status);

CREATE TABLE IF NOT EXISTS equipment (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    place_id uuid NOT NULL REFERENCES places(id) ON DELETE CASCADE,
    equipment_type text NOT NULL,
    equipment_name text NOT NULL,
    brand_or_model text,
    bed_width_in numeric,
    bed_length_in numeric,
    bed_height_in numeric,
    passes_48x48 boolean NOT NULL DEFAULT false,
    materials text[] NOT NULL DEFAULT '{}',
    file_formats text[] NOT NULL DEFAULT '{}',
    requires_training boolean,
    staff_assisted boolean,
    self_service boolean,
    reservation_required boolean,
    pricing_notes text,
    evidence_text text NOT NULL,
    source_url text NOT NULL,
    source_type text NOT NULL,
    confidence numeric NOT NULL CHECK (confidence BETWEEN 0 AND 1),
    fetched_at timestamptz NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT equipment_claim_has_evidence CHECK (
        length(trim(source_url)) > 0
        AND length(trim(evidence_text)) > 0
        AND fetched_at IS NOT NULL
    )
);

CREATE INDEX IF NOT EXISTS equipment_place_idx ON equipment (place_id);
CREATE INDEX IF NOT EXISTS equipment_type_idx ON equipment (equipment_type);

CREATE TABLE IF NOT EXISTS source_documents (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    place_id uuid NOT NULL REFERENCES places(id) ON DELETE CASCADE,
    source_url text NOT NULL,
    source_type text NOT NULL,
    title text,
    raw_html text,
    clean_text text,
    markdown text,
    content_hash text,
    fetched_at timestamptz NOT NULL,
    http_status integer,
    crawl_method text NOT NULL
);

CREATE TABLE IF NOT EXISTS place_sources (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    place_id uuid NOT NULL REFERENCES places(id) ON DELETE CASCADE,
    provider text NOT NULL,
    provider_id text,
    source_url text NOT NULL,
    raw_json jsonb NOT NULL DEFAULT '{}'::jsonb,
    fetched_at timestamptz NOT NULL
);

CREATE TABLE IF NOT EXISTS crawl_jobs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    place_id uuid REFERENCES places(id) ON DELETE CASCADE,
    status text NOT NULL,
    started_at timestamptz,
    finished_at timestamptz,
    error text,
    pages_crawled integer NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS correction_reports (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    place_id uuid REFERENCES places(id) ON DELETE SET NULL,
    reporter_email text,
    message text NOT NULL,
    status text NOT NULL DEFAULT 'new',
    created_at timestamptz NOT NULL DEFAULT now()
);

