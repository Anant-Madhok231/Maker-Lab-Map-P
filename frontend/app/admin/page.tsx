"use client";

import { useEffect, useState } from "react";

import { ShieldIcon } from "@/components/icons";
import { SiteHeader } from "@/components/site-header";
import { getPlaces, recrawlPlace, verifyPlace } from "@/lib/api";
import type { Place } from "@/lib/types";

export default function AdminPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [status, setStatus] = useState<Record<string, string>>({});
  const [error, setError] = useState("");

  useEffect(() => {
    getPlaces().then(setPlaces).catch(() => setError("Start the backend to load verification records."));
  }, []);

  async function recrawl(place: Place) {
    setStatus((current) => ({ ...current, [place.id]: "Starting official-site recrawl…" }));
    const result = await recrawlPlace(place.id);
    setStatus((current) => ({
      ...current,
      [place.id]: String(result.message || result.status),
    }));
  }

  async function verify(place: Place) {
    setStatus((current) => ({ ...current, [place.id]: "Saving verification…" }));
    await verifyPlace(place.id, place.qualification_status, place.confidence_score);
    setStatus((current) => ({ ...current, [place.id]: "Verification saved." }));
  }

  return (
    <main className="min-h-screen bg-[#f8f5ed]">
      <SiteHeader />
      <div className="mx-auto max-w-[1180px] px-5 py-10 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.17em] text-[#df6f48]">
              Data operations
            </p>
            <h1 className="mt-2 text-4xl font-black tracking-[-0.05em] text-[#172a20]">
              Verification dashboard
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#68736b]">
              Recheck official pages, inspect stale claims, and record a manual
              review before changing what users see.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-[#172a20]/10 bg-white px-4 py-3">
            <ShieldIcon className="h-5 w-5 text-[#3b7455]" />
            <div>
              <p className="text-xs font-black">Evidence gate active</p>
              <p className="text-[11px] text-[#7b847e]">Unsourced claims are rejected</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-8 rounded-2xl border border-[#df6f48]/30 bg-[#fff1e9] p-5 text-sm font-bold text-[#8b3823]">
            {error}
          </div>
        )}

        <div className="mt-8 overflow-hidden rounded-[28px] border border-[#172a20]/10 bg-white">
          <div className="hidden grid-cols-[1.4fr_.7fr_.6fr_.7fr] gap-4 border-b border-[#172a20]/8 bg-[#efece3] px-6 py-4 text-[10px] font-black uppercase tracking-[0.15em] text-[#717b74] md:grid">
            <span>Place</span>
            <span>Status</span>
            <span>Confidence</span>
            <span>Actions</span>
          </div>
          {places.map((place) => (
            <div
              className="grid gap-4 border-b border-[#172a20]/8 px-6 py-5 last:border-0 md:grid-cols-[1.4fr_.7fr_.6fr_.7fr] md:items-center"
              key={place.id}
            >
              <div>
                <p className="font-black text-[#172a20]">{place.name}</p>
                <p className="mt-1 text-xs text-[#7a837c]">
                  {place.equipment.length} sourced equipment claims · checked{" "}
                  {new Date(place.last_checked_at).toLocaleDateString()}
                </p>
                {status[place.id] && (
                  <p className="mt-2 text-xs font-bold text-[#b64f31]">
                    {status[place.id]}
                  </p>
                )}
              </div>
              <span className="w-fit rounded-full bg-[#eef0e8] px-3 py-1.5 text-[11px] font-black capitalize text-[#536057]">
                {place.qualification_status.replaceAll("_", " ")}
              </span>
              <span className="text-sm font-black text-[#172a20]">
                {place.confidence_score}%
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  className="rounded-xl border border-[#172a20]/15 px-3 py-2 text-xs font-black text-[#465249] transition hover:bg-[#efece3]"
                  onClick={() => recrawl(place)}
                  type="button"
                >
                  Re-crawl
                </button>
                <button
                  className="rounded-xl bg-[#172a20] px-3 py-2 text-xs font-black text-white transition hover:bg-[#284536]"
                  onClick={() => verify(place)}
                  type="button"
                >
                  Verify
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

