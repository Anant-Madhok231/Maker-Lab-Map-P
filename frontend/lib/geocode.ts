import type { GeoPoint } from "@/lib/distance";

export type AddressPoint = GeoPoint & {
  address: string;
};

const knownLocations: Record<string, AddressPoint> = {
  "uc davis": {
    address: "University of California, Davis, Davis, CA",
    lat: 38.5382,
    lng: -121.7617,
  },
  davis: { address: "Davis, CA, USA", lat: 38.5449, lng: -121.7405 },
  "davis ca": { address: "Davis, CA, USA", lat: 38.5449, lng: -121.7405 },
  woodland: { address: "Woodland, CA, USA", lat: 38.6785, lng: -121.7733 },
  "woodland ca": { address: "Woodland, CA, USA", lat: 38.6785, lng: -121.7733 },
  sacramento: { address: "Sacramento, CA, USA", lat: 38.5816, lng: -121.4944 },
  "sacramento ca": { address: "Sacramento, CA, USA", lat: 38.5816, lng: -121.4944 },
  brooklyn: { address: "Brooklyn, NY, USA", lat: 40.6782, lng: -73.9442 },
  "brooklyn ny": { address: "Brooklyn, NY, USA", lat: 40.6782, lng: -73.9442 },
  "sunset park": { address: "Sunset Park, Brooklyn, NY, USA", lat: 40.6527, lng: -74.0093 },
  "industry city": { address: "Industry City, Brooklyn, NY, USA", lat: 40.657, lng: -74.0067 },
  "downtown brooklyn": { address: "Downtown Brooklyn, NY, USA", lat: 40.6928, lng: -73.9903 },
  gowanus: { address: "Gowanus, Brooklyn, NY, USA", lat: 40.6782, lng: -73.9928 },
  "fort greene": { address: "Fort Greene, Brooklyn, NY, USA", lat: 40.6921, lng: -73.9742 },
  "brooklyn navy yard": {
    address: "Brooklyn Navy Yard, Brooklyn, NY, USA",
    lat: 40.6995,
    lng: -73.9716,
  },
};

function normalizeAddress(value: string) {
  return value.trim().toLowerCase().replace(/,\s*/g, " ").replace(/\s+/g, " ");
}

function readableAddress(result: Record<string, unknown>, fallback: string) {
  const displayName = typeof result.display_name === "string" ? result.display_name : "";
  return displayName || fallback.trim();
}

export async function geocodeAddress(value: string): Promise<AddressPoint | null> {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const known = knownLocations[normalizeAddress(trimmed)];
  if (known) return known;

  const params = new URLSearchParams({
    format: "jsonv2",
    q: trimmed,
    limit: "1",
    countrycodes: "us",
  });

  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) return null;

    const results = (await response.json()) as Record<string, unknown>[];
    const first = results[0];
    if (!first || typeof first.lat !== "string" || typeof first.lon !== "string") return null;

    const lat = Number(first.lat);
    const lng = Number(first.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

    return {
      address: readableAddress(first, trimmed),
      lat,
      lng,
    };
  } catch {
    return null;
  }
}
