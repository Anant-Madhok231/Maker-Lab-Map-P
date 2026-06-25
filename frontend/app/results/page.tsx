"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

import { FilterPanel, type Filters } from "@/components/filter-panel";
import { MapPanel } from "@/components/map-panel";
import { ResultCard } from "@/components/result-card";
import { SearchBox } from "@/components/search-box";
import { SiteHeader } from "@/components/site-header";
import { searchPlaces } from "@/lib/api";
import type { GeoPoint } from "@/lib/distance";
import { geocodeAddress, type AddressPoint } from "@/lib/geocode";
import type { SearchResponse } from "@/lib/types";

function ResultsContent() {
  const params = useSearchParams();
  const location = params.get("location") || "UC Davis";
  const initialRadius = Number(params.get("radius") || 50);
  const [radius, setRadius] = useState(initialRadius);
  const [filters, setFilters] = useState<Filters>({
    cnc: params.get("cnc") === "true",
    large: params.get("large") === "true",
    publicAccess: false,
    staffAssisted: false,
    showMaybe: true,
    equipment: [],
  });
  const [data, setData] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<GeoPoint | null>(null);
  const [addressPoint, setAddressPoint] = useState<AddressPoint | null>(null);
  const [addressQuery, setAddressQuery] = useState("");
  const [locationStatus, setLocationStatus] = useState("");
  const addressReady = addressQuery === location;
  const activeOrigin = addressReady ? userLocation || addressPoint : null;
  const activeOriginLabel = userLocation ? "your pin" : addressPoint ? "your address" : null;

  const requestPayload = useMemo(
    () => ({
      location,
      location_center: activeOrigin
        ? {
            address: userLocation ? "Your exact location" : addressPoint?.address || location,
            lat: activeOrigin.lat,
            lng: activeOrigin.lng,
          }
        : null,
      radius_miles: radius,
      filters: {
        cnc_router: filters.cnc,
        min_bed_width_in: filters.large ? 48 : null,
        min_bed_length_in: filters.large ? 48 : null,
        public_access: filters.publicAccess ? true : null,
        staff_assisted: filters.staffAssisted ? true : null,
        show_maybe_matches: filters.showMaybe,
        equipment_types: filters.equipment,
      },
    }),
    [activeOrigin, addressPoint?.address, filters, location, radius, userLocation],
  );

  useEffect(() => {
    let active = true;

    geocodeAddress(location).then((point) => {
      if (!active) return;
      setUserLocation(null);
      setAddressPoint(point);
      setAddressQuery(location);
      setLocationStatus(
        point
          ? `Using ${point.address} as your starting point.`
          : "Could not read that address yet. Try a fuller address, or use your browser pin.",
      );
    });

    return () => {
      active = false;
    };
  }, [location]);

  useEffect(() => {
    if (!addressReady) return;

    let active = true;
    const timer = window.setTimeout(() => {
      setLoading(true);
      setError("");
      searchPlaces(requestPayload)
        .then((response) => {
          if (!active) return;
          setData(response);
          setSelectedId(response.results[0]?.id || null);
        })
        .catch(() => {
          if (active) {
            setError(
              "The search service is not running yet. Start the backend, then refresh this page.",
            );
          }
        })
        .finally(() => active && setLoading(false));
    }, 180);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [addressReady, requestPayload]);

  function useExactLocation() {
    if (!navigator.geolocation) {
      setLocationStatus("Your browser does not support location sharing.");
      return;
    }

    setLocationStatus("Asking your browser for your exact pin…");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationStatus("Exact pin added. The list, distances, and directions now use your pin.");
      },
      () => {
        setLocationStatus("Location was not shared. You can still open Google Maps directions.");
      },
      { enableHighAccuracy: true, maximumAge: 60000, timeout: 10000 },
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f5ed]">
      <SiteHeader />
      <div className="border-b border-[#172a20]/8 bg-[#efece3]">
        <div className="mx-auto max-w-[1440px] px-5 py-5 sm:px-8">
          <SearchBox compact initialLocation={location} initialRadius={radius} />
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-5 py-7 sm:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.17em] text-[#df6f48]">
              Maker lab map
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-[-0.045em] text-[#172a20]">
              Maker labs near {location}
            </h1>
            <p className="mt-2 text-sm text-[#68736b]">
              {data
                ? `${data.total} source-backed matches within ${radius} miles of ${data.normalized_address}`
                : "Checking labs, access notes, and source evidence…"}
            </p>
          </div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <button
              className="rounded-full border border-[#172a20]/10 bg-white px-4 py-2 text-xs font-black text-[#172a20] shadow-sm transition hover:-translate-y-0.5 hover:border-[#df6f48]/40 hover:shadow-md"
              onClick={useExactLocation}
              type="button"
            >
              Use my exact location
            </button>
            <p className="max-w-xs text-xs font-semibold leading-5 text-[#6b756e] sm:text-right">
              {locationStatus || "Adds distance from your pin plus driving and walking directions."}
            </p>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[244px_minmax(420px,620px)_1fr]">
          <FilterPanel
            filters={filters}
            radius={radius}
            setFilters={setFilters}
            setRadius={setRadius}
          />

          <section className="space-y-4">
            {loading &&
              Array.from({ length: 3 }).map((_, index) => (
                <div
                  className="h-72 animate-pulse rounded-[26px] border border-[#172a20]/8 bg-white/70"
                  key={index}
                />
              ))}

            {error && (
              <div className="rounded-[26px] border border-[#c96748]/30 bg-[#fff2ea] p-6">
                <h2 className="font-black text-[#8b3823]">Search unavailable</h2>
                <p className="mt-2 text-sm leading-6 text-[#7b5348]">{error}</p>
              </div>
            )}

            {!loading &&
              !error &&
              data?.results.map((place, index) => (
                <ResultCard
                  index={index}
                  key={place.id}
                  onSelect={() => setSelectedId(place.id)}
                  place={place}
                  selected={place.id === selectedId}
                  userLocation={activeOrigin}
                  userLocationLabel={activeOriginLabel}
                />
              ))}

            {!loading && !error && data?.results.length === 0 && (
              <div className="rounded-[26px] border border-[#172a20]/10 bg-white p-8 text-center">
                <h2 className="text-xl font-black text-[#172a20]">
                  No confirmed matches for every filter
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#68736b]">
                  Increase the radius or turn on possible matches to include
                  places whose machine size still needs verification.
                </p>
              </div>
            )}
          </section>

          <aside className="hidden min-h-[680px] xl:block">
            <div className="sticky top-6 h-[calc(100vh-3rem)] max-h-[860px]">
              <MapPanel
                onSelect={setSelectedId}
                places={data?.results || []}
                selectedId={selectedId}
                userLocation={activeOrigin}
              />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default function ResultsPage() {
  return (
    <Suspense>
      <ResultsContent />
    </Suspense>
  );
}
"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

import { FilterPanel, type Filters } from "@/components/filter-panel";
import { MapPanel } from "@/components/map-panel";
import { ResultCard } from "@/components/result-card";
import { SearchBox } from "@/components/search-box";
import { SiteHeader } from "@/components/site-header";
import { searchPlaces } from "@/lib/api";
import type { GeoPoint } from "@/lib/distance";
import type { SearchResponse } from "@/lib/types";

function ResultsContent() {
  const params = useSearchParams();
  const location = params.get("location") || "UC Davis";
  const initialRadius = Number(params.get("radius") || 50);
  const [radius, setRadius] = useState(initialRadius);
  const [filters, setFilters] = useState<Filters>({
    cnc: params.get("cnc") === "true",
    large: params.get("large") === "true",
    publicAccess: false,
    staffAssisted: false,
    showMaybe: true,
    equipment: [],
  });
  const [data, setData] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<GeoPoint | null>(null);
  const [locationStatus, setLocationStatus] = useState("");

  const requestPayload = useMemo(
    () => ({
      location,
      radius_miles: radius,
      filters: {
        cnc_router: filters.cnc,
        min_bed_width_in: filters.large ? 48 : null,
        min_bed_length_in: filters.large ? 48 : null,
        public_access: filters.publicAccess ? true : null,
        staff_assisted: filters.staffAssisted ? true : null,
        show_maybe_matches: filters.showMaybe,
        equipment_types: filters.equipment,
      },
    }),
    [filters, location, radius],
  );

  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(() => {
      setLoading(true);
      setError("");
      searchPlaces(requestPayload)
        .then((response) => {
          if (!active) return;
          setData(response);
          setSelectedId((current) => current || response.results[0]?.id || null);
        })
        .catch(() => {
          if (active) {
            setError(
              "The search service is not running yet. Start the backend, then refresh this page.",
            );
          }
        })
        .finally(() => active && setLoading(false));
    }, 180);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [requestPayload]);

  function useExactLocation() {
    if (!navigator.geolocation) {
      setLocationStatus("Your browser does not support location sharing.");
      return;
    }

    setLocationStatus("Asking your browser for your exact pin…");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationStatus("Exact pin added. Distances and directions are ready.");
      },
      () => {
        setLocationStatus("Location was not shared. You can still open Google Maps directions.");
      },
      { enableHighAccuracy: true, maximumAge: 60000, timeout: 10000 },
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f5ed]">
      <SiteHeader />
      <div className="border-b border-[#172a20]/8 bg-[#efece3]">
        <div className="mx-auto max-w-[1440px] px-5 py-5 sm:px-8">
          <SearchBox compact initialLocation={location} />
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-5 py-7 sm:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.17em] text-[#df6f48]">
              Maker lab map
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-[-0.045em] text-[#172a20]">
              Maker labs near {location}
            </h1>
            <p className="mt-2 text-sm text-[#68736b]">
              {data
                ? `${data.total} source-backed matches within ${radius} miles of ${data.normalized_address}`
                : "Checking labs, access notes, and source evidence…"}
            </p>
          </div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <button
              className="rounded-full border border-[#172a20]/10 bg-white px-4 py-2 text-xs font-black text-[#172a20] shadow-sm transition hover:-translate-y-0.5 hover:border-[#df6f48]/40 hover:shadow-md"
              onClick={useExactLocation}
              type="button"
            >
              Use my exact location
            </button>
            <p className="max-w-xs text-xs font-semibold leading-5 text-[#6b756e] sm:text-right">
              {locationStatus || "Adds distance from your pin plus driving and walking directions."}
            </p>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[244px_minmax(420px,620px)_1fr]">
          <FilterPanel
            filters={filters}
            radius={radius}
            setFilters={setFilters}
            setRadius={setRadius}
          />

          <section className="space-y-4">
            {loading &&
              Array.from({ length: 3 }).map((_, index) => (
                <div
                  className="h-72 animate-pulse rounded-[26px] border border-[#172a20]/8 bg-white/70"
                  key={index}
                />
              ))}

            {error && (
              <div className="rounded-[26px] border border-[#c96748]/30 bg-[#fff2ea] p-6">
                <h2 className="font-black text-[#8b3823]">Search unavailable</h2>
                <p className="mt-2 text-sm leading-6 text-[#7b5348]">{error}</p>
              </div>
            )}

            {!loading &&
              !error &&
              data?.results.map((place, index) => (
                <ResultCard
                  index={index}
                  key={place.id}
                  onSelect={() => setSelectedId(place.id)}
                  place={place}
                  selected={place.id === selectedId}
                  userLocation={userLocation}
                />
              ))}

            {!loading && !error && data?.results.length === 0 && (
              <div className="rounded-[26px] border border-[#172a20]/10 bg-white p-8 text-center">
                <h2 className="text-xl font-black text-[#172a20]">
                  No confirmed matches for every filter
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#68736b]">
                  Increase the radius or turn on possible matches to include
                  places whose machine size still needs verification.
                </p>
              </div>
            )}
          </section>

          <aside className="hidden min-h-[680px] xl:block">
            <div className="sticky top-6 h-[calc(100vh-3rem)] max-h-[860px]">
              <MapPanel
                onSelect={setSelectedId}
                places={data?.results || []}
                selectedId={selectedId}
                userLocation={userLocation}
              />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default function ResultsPage() {
  return (
    <Suspense>
      <ResultsContent />
    </Suspense>
  );
}
