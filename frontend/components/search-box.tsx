"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { PinIcon, SearchIcon } from "@/components/icons";

type SearchBoxProps = {
  initialLocation?: string;
  initialRadius?: number;
  initialPoint?: {
    lat: number;
    lng: number;
  } | null;
  compact?: boolean;
};

export function SearchBox({
  initialLocation = "UC Davis",
  initialRadius = 50,
  initialPoint = null,
  compact = false,
}: SearchBoxProps) {
  const router = useRouter();
  const [location, setLocation] = useState(initialLocation);
  const [radius, setRadius] = useState(String(initialRadius));
  const [currentPoint, setCurrentPoint] = useState(initialPoint);
  const [locationStatus, setLocationStatus] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams({
      location: location.trim() || "UC Davis",
      radius,
      cnc: "false",
      large: "false",
    });

    if (currentPoint) {
      params.set("lat", String(currentPoint.lat));
      params.set("lng", String(currentPoint.lng));
    }

    router.push(`/results?${params.toString()}`);
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setLocationStatus("Current location is not supported in this browser.");
      return;
    }

    setLocationStatus("Asking permission for your current location…");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentPoint({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocation("Current location");
        setLocationStatus("Current location added. Press search.");
      },
      () => {
        setLocationStatus("Location was not shared. You can type an address instead.");
      },
      { enableHighAccuracy: true, maximumAge: 60000, timeout: 10000 },
    );
  }

  return (
    <div>
      <form
        className={`grid gap-2 rounded-[24px] border border-[#172a20]/10 bg-white p-2 shadow-[0_24px_60px_rgba(36,49,40,.13)] ${
          compact
            ? "md:grid-cols-[1fr_150px_170px_auto]"
            : "md:grid-cols-[1fr_150px_180px_auto]"
        }`}
        onSubmit={submit}
      >
        <label className="flex min-h-14 items-center gap-3 rounded-[18px] px-4 transition focus-within:bg-[#f6f4ec]">
          <PinIcon className="h-5 w-5 shrink-0 text-[#df6f48]" />
          <span className="sr-only">Enter your location</span>
          <input
            className="w-full bg-transparent text-base font-semibold text-[#172a20] outline-none placeholder:text-[#90978f]"
            onChange={(event) => {
              setLocation(event.target.value);
              setCurrentPoint(null);
            }}
            placeholder="Enter address or use current location"
            value={location}
          />
        </label>
        <label className="flex min-h-14 items-center border-l-0 border-[#172a20]/10 px-4 md:border-l">
          <span className="sr-only">Search radius</span>
          <select
            className="w-full cursor-pointer bg-transparent text-sm font-bold text-[#526057] outline-none"
            onChange={(event) => setRadius(event.target.value)}
            value={radius}
          >
            {[5, 10, 25, 50, 100].map((value) => (
              <option key={value} value={value}>
                {value} miles
              </option>
            ))}
          </select>
        </label>
        <button
          className="flex min-h-14 items-center justify-center gap-2 rounded-[18px] border border-[#172a20]/10 bg-[#f1eee5] px-4 text-sm font-extrabold text-[#172a20] transition hover:-translate-y-0.5 hover:bg-[#e5dfd0]"
          onClick={useCurrentLocation}
          type="button"
        >
          <PinIcon className="h-5 w-5" />
          Use current
        </button>
        <button
          className="flex min-h-14 items-center justify-center gap-2 rounded-[18px] bg-[#172a20] px-6 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-[#244333]"
          type="submit"
        >
          <SearchIcon className="h-5 w-5" />
          Find maker labs
        </button>
      </form>
      {locationStatus && (
        <p className="mt-2 px-3 text-xs font-semibold text-[#6b756e]">{locationStatus}</p>
      )}
    </div>
  );
}
