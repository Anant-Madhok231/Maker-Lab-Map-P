"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { PinIcon, SearchIcon } from "@/components/icons";

type SearchBoxProps = {
  initialLocation?: string;
  compact?: boolean;
};

export function SearchBox({
  initialLocation = "UC Davis",
  compact = false,
}: SearchBoxProps) {
  const router = useRouter();
  const [location, setLocation] = useState(initialLocation);
  const [radius, setRadius] = useState("25");

  function submit(event: FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams({
      location: location.trim() || "UC Davis",
      radius,
      cnc: "false",
      large: "false",
    });
    router.push(`/results?${params.toString()}`);
  }

  return (
    <form
      className={`grid gap-2 rounded-[24px] border border-[#172a20]/10 bg-white p-2 shadow-[0_24px_60px_rgba(36,49,40,.13)] ${
        compact ? "md:grid-cols-[1fr_130px_auto]" : "md:grid-cols-[1fr_150px_auto]"
      }`}
      onSubmit={submit}
    >
      <label className="flex min-h-14 items-center gap-3 rounded-[18px] px-4 transition focus-within:bg-[#f6f4ec]">
        <PinIcon className="h-5 w-5 shrink-0 text-[#df6f48]" />
        <span className="sr-only">Enter your location</span>
        <input
          className="w-full bg-transparent text-base font-semibold text-[#172a20] outline-none placeholder:text-[#90978f]"
          onChange={(event) => setLocation(event.target.value)}
          placeholder="Enter your location"
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
        className="flex min-h-14 items-center justify-center gap-2 rounded-[18px] bg-[#172a20] px-6 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-[#244333]"
        type="submit"
      >
        <SearchIcon className="h-5 w-5" />
        Find maker labs
      </button>
    </form>
  );
}
