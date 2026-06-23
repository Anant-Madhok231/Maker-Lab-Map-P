import type { Place, SearchResponse } from "@/lib/types";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function searchPlaces(payload: {
  location: string;
  radius_miles: number;
  filters: {
    cnc_router: boolean;
    min_bed_width_in: number | null;
    min_bed_length_in: number | null;
    public_access: boolean | null;
    staff_assisted: boolean | null;
    show_maybe_matches: boolean;
    equipment_types: string[];
  };
}): Promise<SearchResponse> {
  return request("/api/search", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getPlace(placeId: string): Promise<Place> {
  return request(`/api/places/${placeId}`);
}

export function getPlaces(): Promise<Place[]> {
  return request("/api/places");
}

export function recrawlPlace(placeId: string): Promise<Record<string, unknown>> {
  return request(`/api/admin/crawl/${placeId}`, { method: "POST" });
}

export function verifyPlace(
  placeId: string,
  qualificationStatus: string,
  confidenceScore: number,
): Promise<Record<string, unknown>> {
  return request(`/api/admin/verify/${placeId}`, {
    method: "POST",
    body: JSON.stringify({
      qualification_status: qualificationStatus,
      confidence_score: confidenceScore,
      note: "Manual review completed from the verification dashboard.",
    }),
  });
}

