import Link from "next/link";

import {
  ArrowIcon,
  MachineIcon,
  PinIcon,
  ShieldIcon,
} from "@/components/icons";
import { SearchBox } from "@/components/search-box";
import { SiteHeader } from "@/components/site-header";

const quickChoices = [
  ["Near UC Davis", "Davis, Woodland, Sacramento"],
  ["Brooklyn", "SJSW, Newlab, NYC Resistor"],
  ["CNC + shops", "Routers, mills, waterjet, wood, metal"],
  ["Student labs", "UC Davis, SCC, NYU, Pratt"],
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden">
      <SiteHeader />

      <section className="relative mx-auto max-w-[1440px] px-5 pb-20 pt-16 sm:px-8 lg:pb-28 lg:pt-24">
        <div className="pointer-events-none absolute right-[-8rem] top-6 hidden h-[430px] w-[430px] animate-float-soft rounded-full border-[70px] border-[#e8dfca]/60 lg:block" />
        <div className="pointer-events-none absolute right-16 top-20 hidden h-32 w-32 rotate-12 rounded-[32px] bg-[#df6f48]/10 lg:block" />
        <div className="pointer-events-none absolute left-[-10rem] top-[24rem] h-80 w-80 rounded-full bg-[#6fa9b6]/10 blur-3xl" />

        <div className="relative max-w-4xl animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#172a20]/10 bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#526057] shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[#3f9766]" />
            Source-backed maker labs
          </span>
          <h1 className="mt-8 max-w-4xl text-[clamp(3.2rem,8vw,7.4rem)] font-black leading-[0.86] tracking-[-0.075em] text-[#172a20]">
            Find the shop
            <span className="block text-[#df6f48]">that can make it.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-[#566259] sm:text-xl">
            Find maker labs, fab shops, hackerspaces, school labs, and guided
            workshops by documented capability. Use your exact pin to see
            distance and open driving or walking directions in Google Maps.
          </p>
        </div>

        <div className="relative mt-10 max-w-4xl animate-fade-up [animation-delay:140ms]">
          <SearchBox />
          <p className="mt-3 pl-3 text-xs font-semibold text-[#7c857e]">
            Try “UC Davis,” “Sacramento,” “Woodland,” “Brooklyn,” or “Sunset Park”
          </p>
        </div>

        <div className="relative mt-20 grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
          <div className="animate-card-in sheen-on-hover rounded-[34px] bg-[#172a20] p-7 text-white sm:p-9 [animation-delay:220ms]">
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#ffb85c]">
              Built for real trips
            </p>
            <h2 className="mt-4 max-w-xl text-3xl font-black leading-tight tracking-[-0.045em] sm:text-4xl">
              Drop a pin, compare capability, then open the route.
            </h2>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                ["18 places", "California plus Brooklyn"],
                ["Google Maps", "Drive and walk links"],
                ["Source links", "Evidence for each claim"],
              ].map(([value, label]) => (
                <div
                  className="hover-lift rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10"
                  key={value}
                >
                  <p className="text-lg font-black text-white">{value}</p>
                  <p className="mt-1 text-xs leading-5 text-[#b7c4bb]">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {quickChoices.map(([title, subtitle], index) => (
              <Link
                className="animate-card-in hover-lift group flex min-h-40 flex-col justify-between rounded-[26px] border border-[#172a20]/10 bg-white p-5 hover:border-[#df6f48]/50 hover:shadow-xl"
                href={
                  index === 0
                    ? "/results?location=UC+Davis&radius=50&cnc=false&large=false"
                    : index === 1
                      ? "/results?location=Brooklyn%2C+NY&radius=25&cnc=false&large=false"
                      : index === 2
                        ? "/results?location=UC+Davis&radius=50&cnc=true&large=false"
                        : "/results?location=UC+Davis&radius=50&cnc=false&large=false"
                }
                key={title}
                style={{ animationDelay: `${300 + index * 80}ms` }}
              >
                <span
                  className={`grid h-10 w-10 place-items-center rounded-xl transition duration-300 group-hover:rotate-3 group-hover:scale-110 ${
                    index === 0
                      ? "bg-[#df6f48] text-white"
                      : "bg-[#eff0e8] text-[#172a20]"
                  }`}
                >
                  <MachineIcon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-base font-black text-[#172a20]">
                    {title}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-[#748078]">
                    {subtitle}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#172a20]/8 bg-[#efece3]">
        <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-14 sm:px-8 md:grid-cols-3">
          {[
            [PinIcon, "Search locally", "Start with any location and choose a practical travel radius."],
            [MachineIcon, "Match capability", "Filter by machine type, bed size, material, files, and access."],
            [ShieldIcon, "Inspect evidence", "Open the exact official source behind every equipment claim."],
          ].map(([Icon, title, text], index) => (
            <div
              className="animate-card-in flex gap-4"
              key={String(title)}
              style={{ animationDelay: `${120 + index * 90}ms` }}
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-[#df6f48] shadow-sm transition duration-300 hover:rotate-3 hover:scale-105">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-black text-[#172a20]">{String(title)}</h3>
                <p className="mt-1 text-sm leading-6 text-[#68736b]">
                  {String(text)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="mx-auto flex max-w-[1440px] flex-col gap-4 px-5 py-10 text-sm text-[#6f7972] sm:px-8 md:flex-row md:items-center md:justify-between">
        <p>Maker Lab Map P</p>
        <Link className="inline-flex items-center gap-2 font-black text-[#172a20]" href="/results">
          Browse maker labs
          <ArrowIcon className="h-4 w-4" />
        </Link>
      </footer>
    </main>
  );
}
