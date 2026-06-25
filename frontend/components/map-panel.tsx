import type { SearchResult } from "@/lib/types";
import type { GeoPoint } from "@/lib/distance";

type MapPanelProps = {
  places: SearchResult[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  userLocation?: GeoPoint | null;
};

type MapBounds = {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
};

function getMapBounds(places: SearchResult[], userLocation?: GeoPoint | null): MapBounds {
  const points = [
    ...places.map((place) => ({ lat: place.lat, lng: place.lng })),
    ...(userLocation ? [userLocation] : []),
  ];

  if (points.length === 0) {
    return { minLat: 38.45, maxLat: 38.75, minLng: -121.9, maxLng: -121.45 };
  }

  const lats = points.map((point) => point.lat);
  const lngs = points.map((point) => point.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const latPadding = Math.max((maxLat - minLat) * 0.2, 0.02);
  const lngPadding = Math.max((maxLng - minLng) * 0.2, 0.02);

  return {
    minLat: minLat - latPadding,
    maxLat: maxLat + latPadding,
    minLng: minLng - lngPadding,
    maxLng: maxLng + lngPadding,
  };
}

function markerPosition(lat: number, lng: number, bounds: MapBounds) {
  const left =
    ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 100;
  const top =
    100 -
    ((lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * 100;
  return {
    left: `${Math.min(94, Math.max(6, left))}%`,
    top: `${Math.min(90, Math.max(10, top))}%`,
  };
}

export function MapPanel({ places, selectedId, onSelect, userLocation }: MapPanelProps) {
  const mapBounds = getMapBounds(places, userLocation);

  return (
    <div className="relative h-full min-h-[430px] overflow-hidden rounded-[28px] border border-[#172a20]/10 bg-[#e8e8d9] shadow-[0_24px_80px_rgba(23,42,32,.12)]">
      <div className="absolute inset-0 opacity-70 [background-image:linear-gradient(28deg,transparent_46%,rgba(255,255,255,.8)_47%,rgba(255,255,255,.8)_50%,transparent_51%),linear-gradient(118deg,transparent_46%,rgba(255,255,255,.9)_47%,rgba(255,255,255,.9)_50%,transparent_51%)] [background-size:90px_90px,120px_120px]" />
      <div className="absolute -left-10 top-[52%] h-14 w-[120%] -rotate-6 bg-[#b9d0ca]/80" />
      <div className="absolute right-[20%] top-0 h-full w-10 rotate-12 bg-white/80" />
      <div className="absolute inset-x-0 top-[32%] h-2 rotate-3 bg-[#d5cdb8]" />
      <div className="absolute bottom-[-7rem] right-[-4rem] h-60 w-60 rounded-full bg-[#7fa7b6]/20 blur-2xl" />
      <span className="absolute left-[16%] top-[68%] text-[11px] font-black uppercase tracking-[0.15em] text-[#7d887f]">
        Nearby labs
      </span>
      <span className="absolute right-[12%] top-[42%] text-[11px] font-black uppercase tracking-[0.15em] text-[#7d887f]">
        Workshops
      </span>
      <span className="absolute right-[20%] top-[12%] text-[11px] font-black uppercase tracking-[0.15em] text-[#7d887f]">
        Maker spaces
      </span>

      {places.map((place, index) => {
        const active = place.id === selectedId;
        return (
          <button
            aria-label={`Select ${place.name}`}
            className={`absolute z-10 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-[3px] border-white text-sm font-black shadow-[0_7px_18px_rgba(23,42,32,.28)] transition ${
              active
                ? "scale-125 bg-[#df6f48] text-white"
                : "bg-[#172a20] text-white hover:scale-110 hover:bg-[#244333]"
            }`}
            key={place.id}
            onClick={() => onSelect(place.id)}
            style={markerPosition(place.lat, place.lng, mapBounds)}
            type="button"
          >
            {index + 1}
          </button>
        );
      })}

      {userLocation && (
        <span
          className="absolute z-20 grid h-5 w-5 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#2f7bff] shadow-[0_0_0_8px_rgba(47,123,255,.18)]"
          style={markerPosition(userLocation.lat, userLocation.lng, mapBounds)}
          title="Your location"
        >
          <span className="h-2 w-2 rounded-full bg-white" />
        </span>
      )}

      <div className="absolute bottom-4 left-4 rounded-2xl border border-[#172a20]/10 bg-[#fffdf8]/90 px-4 py-3 shadow-lg backdrop-blur">
        <p className="text-xs font-black text-[#172a20]">Capability map</p>
        <p className="mt-1 text-[11px] leading-4 text-[#657168]">
          Pins show source-backed locations. Blue dot is your exact pin.
        </p>
      </div>
    </div>
  );
}
