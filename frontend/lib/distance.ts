export type GeoPoint = {
  lat: number;
  lng: number;
};

export function distanceMiles(from: GeoPoint, to: GeoPoint) {
  const earthRadiusMiles = 3958.8;
  const latDelta = ((to.lat - from.lat) * Math.PI) / 180;
  const lngDelta = ((to.lng - from.lng) * Math.PI) / 180;
  const fromLat = (from.lat * Math.PI) / 180;
  const toLat = (to.lat * Math.PI) / 180;

  const a =
    Math.sin(latDelta / 2) ** 2 +
    Math.cos(fromLat) * Math.cos(toLat) * Math.sin(lngDelta / 2) ** 2;

  return earthRadiusMiles * 2 * Math.asin(Math.sqrt(a));
}

export function roundedMiles(miles: number) {
  if (miles < 0.1) return "under 0.1 mi";
  return `${Math.round(miles * 10) / 10} mi`;
}

export function googleDirectionsUrl({
  destination,
  mode,
  origin,
}: {
  destination: GeoPoint;
  mode: "driving" | "walking" | "transit" | "bicycling";
  origin?: GeoPoint | string | null;
}) {
  const params = new URLSearchParams({
    api: "1",
    destination: `${destination.lat},${destination.lng}`,
    travelmode: mode,
  });

  if (origin) {
    params.set(
      "origin",
      typeof origin === "string" ? origin : `${origin.lat},${origin.lng}`,
    );
  }

  return `https://www.google.com/maps/dir/?${params.toString()}`;
}
