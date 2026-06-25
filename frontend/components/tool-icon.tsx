import { MachineIcon } from "@/components/icons";

const labels: Record<string, string> = {
  cnc_router: "CNC router",
  cnc_mill: "CNC mill",
  laser_cutter: "Laser cutter",
  "3d_printer": "3D printer",
  woodshop: "Woodshop",
  metal_shop: "Metal shop",
  electronics: "Electronics",
  vinyl_cutter: "Vinyl cutter",
  sewing: "Textiles",
  waterjet: "Waterjet",
  vacuum_former: "Vacuum former",
  design_lab: "Design lab",
  training: "Training",
  bio_lab: "Bio lab",
  rapid_prototyping: "Rapid prototyping",
  ceramics: "Ceramics",
  leatherwork: "Leatherwork",
  stained_glass: "Stained glass",
  arts_fabrication: "Arts fabrication",
  industrial_design: "Industrial design",
  "3d_scanning": "3D scanning",
};

export function equipmentLabel(type: string) {
  return labels[type] || type.replaceAll("_", " ");
}

export function ToolPill({ type }: { type: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f1eee5] px-3 py-1.5 text-xs font-bold text-[#47544b]">
      <MachineIcon className="h-3.5 w-3.5 text-[#df6f48]" />
      {equipmentLabel(type)}
    </span>
  );
}
