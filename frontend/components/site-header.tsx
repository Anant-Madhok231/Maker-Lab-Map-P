import Link from "next/link";

import { Logo } from "@/components/logo";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#172a20]/10 bg-[#f8f5ed]/90 backdrop-blur transition-shadow duration-300">
      <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 sm:px-8">
        <Logo />
        <nav className="flex items-center gap-2 text-sm font-bold text-[#526057]">
          <Link className="rounded-full px-4 py-2 transition hover:-translate-y-0.5 hover:bg-white hover:text-[#172a20]" href="/results">
            Explore
          </Link>
          <Link className="rounded-full px-4 py-2 transition hover:-translate-y-0.5 hover:bg-white hover:text-[#172a20]" href="/admin">
            Verify data
          </Link>
        </nav>
      </div>
    </header>
  );
}
