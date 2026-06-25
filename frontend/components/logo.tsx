import Link from "next/link";

export function Logo() {
  return (
    <Link className="group flex items-center gap-3" href="/">
      <span className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-xl bg-[#172a20] text-[#f4f0e6] shadow-[0_7px_18px_rgba(23,42,32,.16)]">
        <span className="absolute left-2 top-2 h-2 w-2 rounded-sm bg-[#ffb85c]" />
        <span className="absolute bottom-2 right-2 h-2 w-2 rounded-sm bg-[#df6f48]" />
        <span className="text-lg font-black tracking-[-0.1em]">MF</span>
      </span>
      <span>
        <span className="block text-[17px] font-black leading-none tracking-[-0.035em] text-[#172a20]">
          Maker Lab Map P
        </span>
        <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.2em] text-[#6d786f]">
          Maker lab finder
        </span>
      </span>
    </Link>
  );
}
