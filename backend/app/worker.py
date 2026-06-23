from datetime import UTC, datetime
from typing import Any

from redis import Redis
from rq import Queue

from app.config import get_settings


settings = get_settings()
redis_connection = Redis.from_url(settings.redis_url)
default_queue = Queue("makerfinder", connection=redis_connection)


def crawl_website(place_id: str, website_url: str) -> dict[str, Any]:
    """Background-job boundary for an official-site crawl.

    The web endpoint can enqueue this function when Redis is available. The
    extraction pipeline must review and validate claims before publishing them,
    so a completed crawl never changes equipment facts by itself.
    """

    return {
        "place_id": place_id,
        "website_url": website_url,
        "status": "ready_for_extraction",
        "finished_at": datetime.now(UTC).isoformat(),
    }


def normalize_dimensions_job(source_document_id: str) -> dict[str, str]:
    """Queue boundary for deterministic machine-dimension normalization."""

    return {
        "source_document_id": source_document_id,
        "status": "ready",
    }


def update_confidence_scores(place_id: str) -> dict[str, str]:
    """Queue boundary for recomputing a place after source changes."""

    return {
        "place_id": place_id,
        "status": "ready",
    }


def enqueue_weekly_refresh(place_id: str, website_url: str) -> str:
    """Enqueue the official-site refresh used by a weekly scheduler."""

    job = default_queue.enqueue(
        crawl_website,
        place_id,
        website_url,
        job_timeout="5m",
        result_ttl=86400,
    )
    return job.id

