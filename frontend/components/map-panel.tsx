import type { SearchResult } from "@/lib/types";

type MapPanelProps = {
  places: SearchResult[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

const mapBounds = {
  minLat: 38.50,
  maxLat: 38.70,
  minLng: -121.80,
  maxLng: -121.38,
};

function markerPosition(lat: number, lng: number) {
  const left =
    ((lng - mapBounds.minLng) / (mapBounds.maxLng - mapBounds.minLng)) * 100;
  const top =
    100 -
    ((lat - mapBounds.minLat) / (mapBounds.maxLat - mapBounds.minLat)) * 100;
  return {
    left: `${Math.min(94, Math.max(6, left))}%`,
    top: `${Math.min(90, Math.max(10, top))}%`,
  };
}

export function MapPanel({ places, selectedId, onSelect }: MapPanelProps) {
  return (
    <div className="relative h-full min-h-[430px] overflow-hidden rounded-[28px] border border-[#172a20]/10 bg-[#e8e8d9]">
      <div className="absolute inset-0 opacity-70 [background-image:linear-gradient(28deg,transparent_46%,rgba(255,255,255,.8)_47%,rgba(255,255,255,.8)_50%,transparent_51%),linear-gradient(118deg,transparent_46%,rgba(255,255,255,.9)_47%,rgba(255,255,255,.9)_50%,transparent_51%)] [background-size:90px_90px,120px_120px]" />
      <div className="absolute -left-10 top-[38%] h-14 w-[120%] -rotate-6 bg-[#c4d8d3]/80" />
      <div className="absolute right-[14%] top-0 h-full w-10 rotate-12 bg-white/80" />
      <div className="absolute inset-x-0 top-[22%] h-2 rotate-3 bg-[#d5cdb8]" />
      <span className="absolute left-[18%] top-[26%] text-[11px] font-black uppercase tracking-[0.15em] text-[#7d887f]">
        Davis
      </span>
      <span className="absolute right-[12%] top-[45%] text-[11px] font-black uppercase tracking-[0.15em] text-[#7d887f]">
        Sacramento
      </span>
      <span className="absolute left-[22%] top-[7%] text-[11px] font-black uppercase tracking-[0.15em] text-[#7d887f]">
        Woodland
      </span>

      {places.map((place, index) => {
        const active = place.id === selectedId;
        return (
          <button
            aria-label={`Select ${place.name}`}
            className={`absolute z-10 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-[3px] border-white text-sm font-black shadow-[0_7px_18px_rgba(23,42,32,.28)] transition ${
              active
                ? "scale-125 bg-[#df6f48] text-white"
                : "bg-[#172a20] text-white hover:scale-110"
            }`}
            key={place.id}
            onClick={() => onSelect(place.id)}
            style={markerPosition(place.lat, place.lng)}
            type="button"
          >
            {index + 1}
          </button>
        );
      })}

      <div className="absolute bottom-4 left-4 rounded-2xl border border-[#172a20]/10 bg-[#fffdf8]/90 px-4 py-3 shadow-lg backdrop-blur">
        <p className="text-xs font-black text-[#172a20]">Capability map</p>
        <p className="mt-1 text-[11px] leading-4 text-[#657168]">
          Pins show evidence-backed locations.
        </p>
      </div>
    </div>
  );
}

