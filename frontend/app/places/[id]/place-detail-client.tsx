"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  ArrowIcon,
  ClockIcon,
  ExternalIcon,
  PinIcon,
  ShieldIcon,
} from "@/components/icons";
import { SiteHeader } from "@/components/site-header";
import { ToolPill, equipmentLabel } from "@/components/tool-icon";
import { getPlace } from "@/lib/api";
import type { Place } from "@/lib/types";

type PlaceDetailClientProps = {
  placeId: string;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function PlaceDetailClient({ placeId }: PlaceDetailClientProps) {
  const [place, setPlace] = useState<Place | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getPlace(placeId).then(setPlace).catch(() => setError("Place not found."));
  }, [placeId]);

  if (error) {
    return (
      <main>
        <SiteHeader />
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <h1 className="text-3xl font-black">{error}</h1>
          <Link className="mt-6 inline-block font-black text-[#b64f31]" href="/results">
            Back to results
          </Link>
        </div>
      </main>
    );
  }

  if (!place) {
    return (
      <main>
        <SiteHeader />
        <div className="mx-auto max-w-6xl animate-pulse px-6 py-12">
          <div className="h-96 rounded-[34px] bg-white" />
        </div>
      </main>
    );
  }

  const largeCnc = place.equipment.find(
    (item) => item.equipment_type === "cnc_router" && item.passes_48x48,
  );

  return (
    <main className="min-h-screen bg-[#f8f5ed]">
      <SiteHeader />
      <div className="mx-auto max-w-[1220px] px-5 py-8 sm:px-8">
        <Link
          className="inline-flex items-center gap-2 text-sm font-black text-[#667169]"
          href="/results"
        >
          <ArrowIcon className="h-4 w-4 rotate-180" />
          Back to results
        </Link>

        <section className="mt-6 overflow-hidden rounded-[34px] bg-[#172a20] text-white">
          <div className="grid lg:grid-cols-[1fr_360px]">
            <div className="p-7 sm:p-10">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#dceee4] px-3 py-1.5 text-[11px] font-black text-[#1e6944]">
                  {place.qualification_status.replaceAll("_", " ")}
                </span>
                <span className="rounded-full border border-white/15 px-3 py-1.5 text-[11px] font-black text-[#c4d1c8]">
                  {place.confidence_score}% source confidence
                </span>
              </div>
              <p className="mt-7 text-[11px] font-black uppercase tracking-[0.17em] text-[#ffb85c]">
                {place.category.replaceAll("_", " ")}
              </p>
              <h1 className="mt-2 max-w-3xl text-4xl font-black leading-tight tracking-[-0.055em] sm:text-6xl">
                {place.name}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[#c5d0c8]">
                {place.description}
              </p>
              <div className="mt-7 flex flex-wrap gap-2">
                {place.equipment.map((item) => (
                  <ToolPill key={item.id} type={item.equipment_type} />
                ))}
              </div>
            </div>

            <div className="border-t border-white/10 bg-white/5 p-7 lg:border-l lg:border-t-0">
              {largeCnc ? (
                <div className="rounded-[24px] bg-[#ffb85c] p-6 text-[#172a20]">
                  <p className="text-[10px] font-black uppercase tracking-[0.16em]">
                    Confirmed CNC capacity
                  </p>
                  <p className="mt-2 text-4xl font-black tracking-[-0.05em]">
                    {largeCnc.bed_width_in}&quot; × {largeCnc.bed_length_in}&quot;
                  </p>
                  <p className="mt-2 text-sm font-bold">
                    Fits a 48&quot; × 48&quot; sheet requirement
                  </p>
                </div>
              ) : (
                <div className="rounded-[24px] border border-white/15 p-6">
                  <p className="text-sm font-black">Large CNC size unconfirmed</p>
                  <p className="mt-2 text-xs leading-5 text-[#bdc9c0]">
                    This place is not presented as meeting the 48&quot; ×
                    48&quot; requirement until an official source confirms it.
                  </p>
                </div>
              )}
              <div className="mt-6 space-y-4 text-sm">
                <div className="flex gap-3">
                  <PinIcon className="h-5 w-5 shrink-0 text-[#ffb85c]" />
                  <span className="leading-6 text-[#d1dad3]">
                    {place.address}, {place.city}, {place.state} {place.postal_code}
                  </span>
                </div>
                <div className="flex gap-3">
                  <ClockIcon className="h-5 w-5 shrink-0 text-[#ffb85c]" />
                  <span className="leading-6 text-[#d1dad3]">{place.hours_text}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_330px]">
          <section className="space-y-5">
            <div className="rounded-[28px] border border-[#172a20]/10 bg-white p-6 sm:p-8">
              <h2 className="text-2xl font-black tracking-[-0.035em] text-[#172a20]">
                Equipment and source evidence
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#68736b]">
                Every machine below is tied to a source. Unknown dimensions and
                unsupported materials stay blank.
              </p>

              <div className="mt-6 space-y-4">
                {place.equipment.map((item) => (
                  <article
                    className="rounded-[22px] border border-[#172a20]/10 bg-[#fbfaf5] p-5"
                    key={item.id}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#df6f48]">
                          {equipmentLabel(item.equipment_type)}
                        </p>
                        <h3 className="mt-1 text-lg font-black text-[#172a20]">
                          {item.equipment_name}
                        </h3>
                        {item.brand_or_model && (
                          <p className="mt-1 text-xs font-semibold text-[#768078]">
                            {item.brand_or_model}
                          </p>
                        )}
                      </div>
                      <span className="rounded-full bg-[#dceee4] px-3 py-1.5 text-[11px] font-black text-[#1e6944]">
                        {Math.round(item.confidence * 100)}% confidence
                      </span>
                    </div>

                    {(item.bed_width_in ||
                      item.materials.length > 0 ||
                      item.file_formats.length > 0) && (
                      <div className="mt-4 grid gap-3 sm:grid-cols-3">
                        {item.bed_width_in && item.bed_length_in && (
                          <div className="rounded-xl bg-white p-3">
                            <p className="text-[10px] font-black uppercase tracking-wider text-[#8a928c]">
                              Work area
                            </p>
                            <p className="mt-1 text-sm font-black">
                              {item.bed_width_in}&quot; × {item.bed_length_in}&quot;
                            </p>
                          </div>
                        )}
                        {item.materials.length > 0 && (
                          <div className="rounded-xl bg-white p-3">
                            <p className="text-[10px] font-black uppercase tracking-wider text-[#8a928c]">
                              Materials
                            </p>
                            <p className="mt-1 text-sm font-bold capitalize">
                              {item.materials.join(", ")}
                            </p>
                          </div>
                        )}
                        {item.file_formats.length > 0 && (
                          <div className="rounded-xl bg-white p-3">
                            <p className="text-[10px] font-black uppercase tracking-wider text-[#8a928c]">
                              Files
                            </p>
                            <p className="mt-1 text-sm font-bold">
                              {item.file_formats.join(", ")}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    <blockquote className="mt-4 border-l-2 border-[#df6f48] pl-4 text-sm leading-6 text-[#4d5951]">
                      {item.evidence_text}
                    </blockquote>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#172a20]/8 pt-4">
                      <span className="text-xs font-semibold text-[#7b847e]">
                        Official source · fetched {formatDate(item.fetched_at)}
                      </span>
                      <a
                        className="inline-flex items-center gap-1.5 text-xs font-black text-[#b64f31]"
                        href={item.source_url}
                        rel="noreferrer"
                        target="_blank"
                      >
                        Open source
                        <ExternalIcon className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <aside className="space-y-5">
            <div className="rounded-[26px] border border-[#172a20]/10 bg-white p-6">
              <h2 className="text-lg font-black text-[#172a20]">Access</h2>
              <p className="mt-3 text-sm leading-6 text-[#59655d]">
                {place.access_notes}
              </p>
              <div className="mt-5 space-y-3 border-t border-[#172a20]/8 pt-5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[#78817b]">Public access</span>
                  <span className="font-black">
                    {place.public_access === null
                      ? "Unclear"
                      : place.public_access
                        ? "Yes"
                        : "No"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#78817b]">Staff assistance</span>
                  <span className="font-black">
                    {place.staff_assisted === null
                      ? "Unclear"
                      : place.staff_assisted
                        ? "Available"
                        : "Not listed"}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-[26px] border border-[#172a20]/10 bg-[#efece3] p-6">
              <div className="flex gap-3">
                <ShieldIcon className="h-6 w-6 shrink-0 text-[#3b7455]" />
                <div>
                  <h2 className="font-black text-[#172a20]">Evidence policy</h2>
                  <p className="mt-2 text-sm leading-6 text-[#626d65]">
                    No equipment claim is displayed without a source URL,
                    evidence snippet, fetch date, source type, and confidence.
                  </p>
                </div>
              </div>
            </div>

            <a
              className="flex items-center justify-between rounded-[22px] bg-[#df6f48] px-5 py-4 font-black text-white transition hover:bg-[#c85e3d]"
              href={place.website_url}
              rel="noreferrer"
              target="_blank"
            >
              Visit official website
              <ExternalIcon className="h-5 w-5" />
            </a>
          </aside>
        </div>
      </div>
    </main>
  );
}
