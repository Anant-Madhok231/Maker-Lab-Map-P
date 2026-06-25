import { FilterIcon } from "@/components/icons";

export type Filters = {
  cnc: boolean;
  large: boolean;
  publicAccess: boolean;
  staffAssisted: boolean;
  showMaybe: boolean;
  equipment: string[];
};

type FilterPanelProps = {
  filters: Filters;
  setFilters: (filters: Filters) => void;
  radius: number;
  setRadius: (radius: number) => void;
};

const equipmentOptions = [
  ["laser_cutter", "Laser cutter"],
  ["3d_printer", "3D printer"],
  ["woodshop", "Woodshop"],
  ["metal_shop", "Metal shop"],
  ["electronics", "Electronics"],
  ["sewing", "Sewing / textiles"],
  ["bio_lab", "Bio lab"],
  ["training", "Classes / training"],
] as const;

function Toggle({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 py-2 text-sm font-semibold text-[#465249]">
      {label}
      <input
        checked={checked}
        className="peer sr-only"
        onChange={(event) => onChange(event.target.checked)}
        type="checkbox"
      />
      <span className="relative h-6 w-10 shrink-0 rounded-full bg-[#d8d9d2] transition peer-checked:bg-[#df6f48] after:absolute after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow after:transition peer-checked:after:translate-x-4" />
    </label>
  );
}

export function FilterPanel({
  filters,
  setFilters,
  radius,
  setRadius,
}: FilterPanelProps) {
  function toggleEquipment(type: string, checked: boolean) {
    setFilters({
      ...filters,
      equipment: checked
        ? [...filters.equipment, type]
        : filters.equipment.filter((item) => item !== type),
    });
  }

  return (
    <aside className="animate-card-in rounded-[24px] border border-[#172a20]/10 bg-white p-5">
      <div className="flex items-center gap-2">
        <FilterIcon className="h-5 w-5 text-[#df6f48]" />
        <h2 className="text-base font-black text-[#172a20]">Refine capability</h2>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#7a837c]">
            Distance
          </p>
          <span className="text-xs font-black text-[#172a20]">{radius} mi</span>
        </div>
        <input
          className="mt-3 w-full accent-[#df6f48]"
          max="100"
          min="5"
          onChange={(event) => setRadius(Number(event.target.value))}
          step="5"
          type="range"
          value={radius}
        />
      </div>

      <div className="mt-6 border-t border-[#172a20]/8 pt-5">
        <p className="mb-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#7a837c]">
          Priority requirement
        </p>
        <Toggle
          checked={filters.cnc}
          label="CNC router"
          onChange={(checked) =>
            setFilters({
              ...filters,
              cnc: checked,
              equipment: filters.equipment.filter((item) => item !== "cnc_router"),
            })
          }
        />
        <Toggle
          checked={filters.large}
          label={'Bed at least 48" × 48"'}
          onChange={(checked) => setFilters({ ...filters, large: checked })}
        />
      </div>

      <div className="mt-5 border-t border-[#172a20]/8 pt-5">
        <p className="mb-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#7a837c]">
          Access
        </p>
        <Toggle
          checked={filters.publicAccess}
          label="Public access"
          onChange={(checked) =>
            setFilters({ ...filters, publicAccess: checked })
          }
        />
        <Toggle
          checked={filters.staffAssisted}
          label="Staff-assisted"
          onChange={(checked) =>
            setFilters({ ...filters, staffAssisted: checked })
          }
        />
      </div>

      <div className="mt-5 border-t border-[#172a20]/8 pt-5">
        <p className="mb-3 text-[11px] font-black uppercase tracking-[0.16em] text-[#7a837c]">
          Other equipment
        </p>
        <div className="space-y-2">
          {equipmentOptions.map(([type, label]) => (
            <label
              className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-[#465249] transition hover:translate-x-1 hover:text-[#172a20]"
              key={type}
            >
              <input
                checked={filters.equipment.includes(type)}
                className="h-4 w-4 rounded border-[#bbc1bb] accent-[#df6f48]"
                onChange={(event) => toggleEquipment(type, event.target.checked)}
                type="checkbox"
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      <div className="mt-5 border-t border-[#172a20]/8 pt-5">
        <Toggle
          checked={filters.showMaybe}
          label="Show possible matches"
          onChange={(checked) => setFilters({ ...filters, showMaybe: checked })}
        />
      </div>
    </aside>
  );
}
