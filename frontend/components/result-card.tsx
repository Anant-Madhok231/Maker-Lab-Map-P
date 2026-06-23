import Link from "next/link";

import { ArrowIcon, PinIcon, ShieldIcon } from "@/components/icons";
import { ToolPill } from "@/components/tool-icon";
import type { SearchResult } from "@/lib/types";

type ResultCardProps = {
  place: SearchResult;
  index: number;
  selected: boolean;
  onSelect: () => void;
};

function confidence(place: SearchResult) {
  if (place.qualification_status === "verified_cnc_capable") {
    return { label: "Verified CNC", className: "bg-[#dceee4] text-[#1e6944]" };
  }
  if (place.qualification_status === "strong_match") {
    return { label: "Strong match", className: "bg-[#e7ebdd] text-[#536139]" };
  }
  return { label: "Needs size check", className: "bg-[#fff0cf] text-[#8a5a12]" };
}

export function ResultCard({
  place,
  index,
  selected,
  onSelect,
}: ResultCardProps) {
  const status = confidence(place);
  const largeCnc = place.equipment.find(
    (item) => item.equipment_type === "cnc_router" && item.passes_48x48,
  );

  return (
    <article
      className={`group rounded-[26px] border bg-white p-5 transition ${
        selected
          ? "border-[#df6f48] shadow-[0_18px_40px_rgba(37,52,43,.12)]"
          : "border-[#172a20]/10 hover:border-[#172a20]/25 hover:shadow-[0_16px_36px_rgba(37,52,43,.09)]"
      }`}
      onMouseEnter={onSelect}
    >
      <div className="flex items-start gap-4">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#172a20] text-xs font-black text-white">
          {index + 1}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#df6f48]">
                {place.category.replaceAll("_", " ")}
              </p>
              <h2 className="mt-1 text-xl font-black leading-tight tracking-[-0.035em] text-[#172a20]">
                {place.name}
              </h2>
            </div>
            <span className={`rounded-full px-3 py-1.5 text-[11px] font-black ${status.className}`}>
              {status.label}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-[#69736c]">
            <span className="inline-flex items-center gap-1.5">
              <PinIcon className="h-4 w-4 text-[#df6f48]" />
              {place.distance_miles} mi · {place.city}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldIcon className="h-4 w-4 text-[#3b7455]" />
              {place.confidence_score}% source confidence
            </span>
          </div>

          {largeCnc && (
            <div className="mt-4 rounded-2xl bg-[#172a20] px-4 py-3 text-white">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#b8c8bd]">
                    Confirmed CNC work area
                  </p>
                  <p className="mt-0.5 text-lg font-black">
                    {largeCnc.bed_width_in}&quot; × {largeCnc.bed_length_in}&quot;
                  </p>
                </div>
                <span className="rounded-full bg-[#ffb85c] px-3 py-1.5 text-[11px] font-black text-[#172a20]">
                  48&quot; × 48&quot; fits
                </span>
              </div>
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {place.equipment.slice(0, 4).map((item) => (
              <ToolPill key={item.id} type={item.equipment_type} />
            ))}
          </div>

          <div className="mt-4 border-t border-[#172a20]/8 pt-4">
            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#7a837c]">
              Why this matched
            </p>
            <p className="mt-1.5 text-sm leading-6 text-[#465249]">
              {place.why_matched[0]}
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between gap-4">
            <p className="line-clamp-1 text-xs font-semibold text-[#7b847e]">
              Access: {place.access_notes}
            </p>
            <Link
              className="inline-flex shrink-0 items-center gap-1 text-sm font-black text-[#b64f31] transition group-hover:gap-2"
              href={`/places/${place.id}`}
            >
              Details
              <ArrowIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

