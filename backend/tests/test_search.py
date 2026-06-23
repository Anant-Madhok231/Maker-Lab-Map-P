from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_large_cnc_search_ranks_verified_places() -> None:
    response = client.post(
        "/api/search",
        json={
            "location": "UC Davis",
            "radius_miles": 50,
            "filters": {
                "cnc_router": True,
                "min_bed_width_in": 48,
                "min_bed_length_in": 48,
                "show_maybe_matches": False,
            },
        },
    )
    assert response.status_code == 200
    names = [item["name"] for item in response.json()["results"]]
    assert names[:2] == [
        "UC Davis Design Makerspace",
        "Sacramento City College Makerspace",
    ]


def test_every_equipment_claim_has_provenance() -> None:
    response = client.get("/api/places")
    assert response.status_code == 200
    for place in response.json():
        for item in place["equipment"]:
            assert item["source_url"]
            assert item["evidence_text"]
            assert item["fetched_at"]
            assert 0 <= item["confidence"] <= 1

