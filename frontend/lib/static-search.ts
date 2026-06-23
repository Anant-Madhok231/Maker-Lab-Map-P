import type { Place, SearchResponse, SearchResult } from "@/lib/types";

const fetchedAt = "2026-06-23T14:00:00Z";

const localLocations = {
  "uc davis": {
    address: "University of California, Davis, Davis, CA",
    lat: 38.5382,
    lng: -121.7617,
  },
  davis: { address: "Davis, CA, USA", lat: 38.5449, lng: -121.7405 },
  "davis ca": { address: "Davis, CA, USA", lat: 38.5449, lng: -121.7405 },
  woodland: { address: "Woodland, CA, USA", lat: 38.6785, lng: -121.7733 },
  "woodland ca": {
    address: "Woodland, CA, USA",
    lat: 38.6785,
    lng: -121.7733,
  },
  sacramento: {
    address: "Sacramento, CA, USA",
    lat: 38.5816,
    lng: -121.4944,
  },
  "sacramento ca": {
    address: "Sacramento, CA, USA",
    lat: 38.5816,
    lng: -121.4944,
  },
} as const;

export const staticPlaces: Place[] = [
  {
    id: "ucd-design-makerspace",
    name: "UC Davis Design Makerspace",
    category: "university_makerspace",
    description:
      "Design fabrication labs in Cruess Hall with wood, metal, laser, 3D printing, and electronics equipment.",
    address: "Cruess Hall, One Shields Avenue",
    city: "Davis",
    state: "CA",
    postal_code: "95616",
    lat: 38.5388,
    lng: -121.7489,
    website_url: "https://designmakerspace.ucdavis.edu/",
    phone: null,
    email: null,
    access_type: "university",
    access_notes:
      "University design facilities; confirm course, training, and project eligibility before visiting.",
    hours_text: "Hours vary by lab and academic schedule.",
    business_status: "OPERATIONAL",
    qualification_status: "verified_cnc_capable",
    confidence_score: 98,
    last_checked_at: fetchedAt,
    staff_assisted: null,
    public_access: false,
    student_only: true,
    member_only: false,
    equipment: [
      {
        id: "ucd-cnc",
        equipment_type: "cnc_router",
        equipment_name: "CNC table",
        brand_or_model: "Laguna Smartshop II",
        bed_width_in: 48,
        bed_length_in: 96,
        bed_height_in: null,
        passes_48x48: true,
        materials: ["wood", "plywood", "sheet goods"],
        file_formats: [],
        requires_training: true,
        staff_assisted: null,
        self_service: null,
        reservation_required: null,
        evidence_text: "CNC table (4'x8\"): Laguna Smartshop II",
        source_url: "https://designmakerspace.ucdavis.edu/woodshop.html",
        source_type: "official_website",
        fetched_at: fetchedAt,
        confidence: 0.99,
      },
      {
        id: "ucd-laser",
        equipment_type: "laser_cutter",
        equipment_name: "Universal Laser Cutter ILS 12.75",
        brand_or_model: "Universal ILS 12.75",
        bed_width_in: 24,
        bed_length_in: 48,
        bed_height_in: null,
        passes_48x48: false,
        materials: [],
        file_formats: ["AI"],
        requires_training: true,
        staff_assisted: null,
        self_service: null,
        reservation_required: null,
        evidence_text: 'Universal Laser Cutter ILS 12.75 (24"x 48")',
        source_url: "https://designmakerspace.ucdavis.edu/equipment.html",
        source_type: "official_website",
        fetched_at: fetchedAt,
        confidence: 0.98,
      },
      {
        id: "ucd-3d",
        equipment_type: "3d_printer",
        equipment_name: "3D printers",
        brand_or_model: "Ultimaker 2+ family",
        bed_width_in: null,
        bed_length_in: null,
        bed_height_in: null,
        passes_48x48: false,
        materials: [],
        file_formats: ["STL"],
        requires_training: true,
        staff_assisted: null,
        self_service: null,
        reservation_required: null,
        evidence_text:
          "3D printers: Ultimaker 2+Connect, Ultimaker 2+, Ultimaker 2+ extended",
        source_url: "https://designmakerspace.ucdavis.edu/equipment.html",
        source_type: "official_website",
        fetched_at: fetchedAt,
        confidence: 0.98,
      },
      {
        id: "ucd-woodshop",
        equipment_type: "woodshop",
        equipment_name: "Woodshop",
        brand_or_model: null,
        bed_width_in: null,
        bed_length_in: null,
        bed_height_in: null,
        passes_48x48: false,
        materials: ["wood", "plywood"],
        file_formats: [],
        requires_training: true,
        staff_assisted: null,
        self_service: null,
        reservation_required: null,
        evidence_text:
          "The official equipment page lists a SawStop, CNC table, sanders, miter saw, routers, bandsaw, and panel saw.",
        source_url: "https://designmakerspace.ucdavis.edu/equipment.html",
        source_type: "official_website",
        fetched_at: fetchedAt,
        confidence: 0.98,
      },
    ],
  },
  {
    id: "scc-makerspace",
    name: "Sacramento City College Makerspace",
    category: "university_makerspace",
    description:
      "A fabrication and prototyping space with large-format CNC, laser, 3D printing, textiles, and electronics.",
    address: "3835 Freeport Boulevard",
    city: "Sacramento",
    state: "CA",
    postal_code: "95822",
    lat: 38.5419,
    lng: -121.4854,
    website_url: "https://scc.losrios.edu/student-resources/makerspace",
    phone: null,
    email: "makerspace@scc.losrios.edu",
    access_type: "students_faculty_staff",
    access_notes:
      "Free and open to currently enrolled SCC students, faculty, and staff.",
    hours_text: "Spring: Monday 10–4; Tuesday–Thursday 10–7.",
    business_status: "OPERATIONAL",
    qualification_status: "verified_cnc_capable",
    confidence_score: 97,
    last_checked_at: fetchedAt,
    staff_assisted: true,
    public_access: false,
    student_only: true,
    member_only: false,
    equipment: [
      {
        id: "scc-cnc",
        equipment_type: "cnc_router",
        equipment_name: "CNC Router",
        brand_or_model: null,
        bed_width_in: 48,
        bed_length_in: 96,
        bed_height_in: null,
        passes_48x48: true,
        materials: ["wood", "sheet goods"],
        file_formats: ["3D file formats"],
        requires_training: true,
        staff_assisted: true,
        self_service: null,
        reservation_required: null,
        evidence_text:
          "The Fabrication and Prototyping Space equipment includes a 4’ x 8’ CNC Router.",
        source_url: "https://scc.losrios.edu/student-resources/makerspace",
        source_type: "official_website",
        fetched_at: fetchedAt,
        confidence: 0.99,
      },
      {
        id: "scc-laser",
        equipment_type: "laser_cutter",
        equipment_name: "Universal Systems Laser Cutter",
        brand_or_model: null,
        bed_width_in: null,
        bed_length_in: null,
        bed_height_in: null,
        passes_48x48: false,
        materials: ["wood", "acrylic", "card stock", "fabric", "paper"],
        file_formats: ["PDF", "DXF", "SVG"],
        requires_training: true,
        staff_assisted: true,
        self_service: null,
        reservation_required: null,
        evidence_text:
          "The Fabrication and Prototyping Space equipment includes a Universal Systems Laser Cutter.",
        source_url: "https://scc.losrios.edu/student-resources/makerspace",
        source_type: "official_website",
        fetched_at: fetchedAt,
        confidence: 0.98,
      },
      {
        id: "scc-vacuum",
        equipment_type: "vacuum_former",
        equipment_name: "Vacuum Former",
        brand_or_model: null,
        bed_width_in: null,
        bed_length_in: null,
        bed_height_in: null,
        passes_48x48: false,
        materials: [],
        file_formats: [],
        requires_training: true,
        staff_assisted: true,
        self_service: null,
        reservation_required: null,
        evidence_text: "The official SCC equipment list includes a Vacuum Former.",
        source_url: "https://scc.losrios.edu/student-resources/makerspace",
        source_type: "official_website",
        fetched_at: fetchedAt,
        confidence: 0.98,
      },
      {
        id: "scc-3d",
        equipment_type: "3d_printer",
        equipment_name: "3D printers",
        brand_or_model: null,
        bed_width_in: null,
        bed_length_in: null,
        bed_height_in: null,
        passes_48x48: false,
        materials: [],
        file_formats: ["STL"],
        requires_training: true,
        staff_assisted: null,
        self_service: null,
        reservation_required: null,
        evidence_text:
          "The Flex Space equipment list includes a Formlabs Form 2 SLA printer and eight 3D printers.",
        source_url: "https://scc.losrios.edu/student-resources/makerspace",
        source_type: "official_website",
        fetched_at: fetchedAt,
        confidence: 0.98,
      },
      {
        id: "scc-electronics",
        equipment_type: "electronics",
        equipment_name: "Electronics and soldering tools",
        brand_or_model: null,
        bed_width_in: null,
        bed_length_in: null,
        bed_height_in: null,
        passes_48x48: false,
        materials: [],
        file_formats: [],
        requires_training: true,
        staff_assisted: null,
        self_service: null,
        reservation_required: null,
        evidence_text:
          "The Flex Space equipment list includes electronics, soldering guns, and Arduinos.",
        source_url: "https://scc.losrios.edu/student-resources/makerspace",
        source_type: "official_website",
        fetched_at: fetchedAt,
        confidence: 0.98,
      },
    ],
  },
  {
    id: "yololab",
    name: "Yolo County Library yololab",
    category: "library_makerspace",
    description:
      "A public-library makerspace for guided and independent learning, workshops, and repair cafés.",
    address: "315 E. 14th Street",
    city: "Davis",
    state: "CA",
    postal_code: "95616",
    lat: 38.5566,
    lng: -121.7388,
    website_url: "https://yolocountylibrary.org/yololab/",
    phone: null,
    email: null,
    access_type: "library_card",
    access_notes:
      "Requires an active Yolo County Library card and completed registration packet.",
    hours_text: "Monday 6–8; Tuesday 6–8; Thursday 9:30–11:30; Friday 3–5.",
    business_status: "OPERATIONAL",
    qualification_status: "possible_match_needs_verification",
    confidence_score: 63,
    last_checked_at: fetchedAt,
    staff_assisted: true,
    public_access: true,
    student_only: false,
    member_only: true,
    equipment: [
      {
        id: "yolo-3d",
        equipment_type: "3d_printer",
        equipment_name: "3D Printers",
        brand_or_model: null,
        bed_width_in: null,
        bed_length_in: null,
        bed_height_in: null,
        passes_48x48: false,
        materials: [],
        file_formats: [],
        requires_training: true,
        staff_assisted: null,
        self_service: true,
        reservation_required: null,
        evidence_text: "The official yololab equipment list links to 3D Printers.",
        source_url: "https://yolocountylibrary.org/yololab/",
        source_type: "official_website",
        fetched_at: fetchedAt,
        confidence: 0.95,
      },
      {
        id: "yolo-vinyl",
        equipment_type: "vinyl_cutter",
        equipment_name: "Cricut",
        brand_or_model: null,
        bed_width_in: null,
        bed_length_in: null,
        bed_height_in: null,
        passes_48x48: false,
        materials: [],
        file_formats: [],
        requires_training: true,
        staff_assisted: null,
        self_service: true,
        reservation_required: null,
        evidence_text: "The official yololab equipment list links to Cricut equipment.",
        source_url: "https://yolocountylibrary.org/yololab/",
        source_type: "official_website",
        fetched_at: fetchedAt,
        confidence: 0.95,
      },
    ],
  },
  {
    id: "ucd-prototyping-lab",
    name: "UC Davis Prototyping Lab",
    category: "university_makerspace",
    description:
      "A design-student lab for laser cutting, 3D printing, and electronics coursework.",
    address: "Cruess Hall, Room 1102, One Shields Avenue",
    city: "Davis",
    state: "CA",
    postal_code: "95616",
    lat: 38.5387,
    lng: -121.7487,
    website_url: "https://arts.ucdavis.edu/prototyping-lab",
    phone: "(530) 752-0105",
    email: "mlrojasvaldez@ucdavis.edu",
    access_type: "design_students",
    access_notes:
      "Reserved for design classes and coursework; required training must be completed first.",
    hours_text: "M/W/F 9–5; T/Th 9–7, subject to the academic schedule.",
    business_status: "OPERATIONAL",
    qualification_status: "strong_match",
    confidence_score: 88,
    last_checked_at: fetchedAt,
    staff_assisted: true,
    public_access: false,
    student_only: true,
    member_only: false,
    equipment: [
      {
        id: "proto-laser",
        equipment_type: "laser_cutter",
        equipment_name: "Universal Laser Cutters",
        brand_or_model: null,
        bed_width_in: 24,
        bed_length_in: 48,
        bed_height_in: null,
        passes_48x48: false,
        materials: [],
        file_formats: ["AI"],
        requires_training: true,
        staff_assisted: null,
        self_service: null,
        reservation_required: null,
        evidence_text: "Laser Cutters: Universal (32” × 18”) and (48” × 24”).",
        source_url: "https://arts.ucdavis.edu/prototyping-lab",
        source_type: "official_website",
        fetched_at: fetchedAt,
        confidence: 0.99,
      },
      {
        id: "proto-3d",
        equipment_type: "3d_printer",
        equipment_name: "3D printers",
        brand_or_model: "Ultimaker 2+ Connect and Bambu Lab X1 Carbon",
        bed_width_in: null,
        bed_length_in: null,
        bed_height_in: null,
        passes_48x48: false,
        materials: [],
        file_formats: ["STL"],
        requires_training: true,
        staff_assisted: null,
        self_service: null,
        reservation_required: null,
        evidence_text: "3D printers: Ultimaker 2+ Connect | Bambu Lab X1 Carbon.",
        source_url: "https://arts.ucdavis.edu/prototyping-lab",
        source_type: "official_website",
        fetched_at: fetchedAt,
        confidence: 0.99,
      },
      {
        id: "proto-electronics",
        equipment_type: "electronics",
        equipment_name: "Soldering iron",
        brand_or_model: null,
        bed_width_in: null,
        bed_length_in: null,
        bed_height_in: null,
        passes_48x48: false,
        materials: [],
        file_formats: [],
        requires_training: true,
        staff_assisted: null,
        self_service: null,
        reservation_required: null,
        evidence_text: "The official equipment list includes a soldering iron.",
        source_url: "https://arts.ucdavis.edu/prototyping-lab",
        source_type: "official_website",
        fetched_at: fetchedAt,
        confidence: 0.98,
      },
    ],
  },
  {
    id: "ucd-tech-foundry",
    name: "UC Davis Tech Foundry",
    category: "commercial_fabrication_shop",
    description:
      "A university device-development facility that designs and manufactures research and prototype devices.",
    address: "451 Health Sciences Drive",
    city: "Davis",
    state: "CA",
    postal_code: "95616",
    lat: 38.5344,
    lng: -121.7647,
    website_url: "https://bme.ucdavis.edu/about/tech-foundry",
    phone: null,
    email: null,
    access_type: "service",
    access_notes:
      "Supports UC Davis faculty, private companies, and individuals through a service model.",
    hours_text: "Contact the Tech Foundry for project intake and scheduling.",
    business_status: "OPERATIONAL",
    qualification_status: "strong_match",
    confidence_score: 82,
    last_checked_at: fetchedAt,
    staff_assisted: true,
    public_access: true,
    student_only: false,
    member_only: false,
    equipment: [
      {
        id: "foundry-cnc",
        equipment_type: "cnc_mill",
        equipment_name: "Computer numerical control mills",
        brand_or_model: null,
        bed_width_in: null,
        bed_length_in: null,
        bed_height_in: null,
        passes_48x48: false,
        materials: [],
        file_formats: [],
        requires_training: null,
        staff_assisted: true,
        self_service: null,
        reservation_required: null,
        evidence_text:
          "The Aggie Square facility features modern 3D printers and computer numerical control mills.",
        source_url: "https://bme.ucdavis.edu/about/tech-foundry",
        source_type: "official_website",
        fetched_at: fetchedAt,
        confidence: 0.96,
      },
      {
        id: "foundry-3d",
        equipment_type: "3d_printer",
        equipment_name: "Modern 3D printers",
        brand_or_model: null,
        bed_width_in: null,
        bed_length_in: null,
        bed_height_in: null,
        passes_48x48: false,
        materials: [],
        file_formats: [],
        requires_training: null,
        staff_assisted: true,
        self_service: null,
        reservation_required: null,
        evidence_text:
          "The Aggie Square facility features modern 3D printers and computer numerical control mills.",
        source_url: "https://bme.ucdavis.edu/about/tech-foundry",
        source_type: "official_website",
        fetched_at: fetchedAt,
        confidence: 0.96,
      },
    ],
  },
  {
    id: "sac-state-stingerstudio",
    name: "Sac State StingerStudio Makerspace",
    category: "university_makerspace",
    description:
      "A university-library makerspace with CNC, 3D printing, laser/vinyl cutting, sewing, and electronics.",
    address: "2000 State University Drive",
    city: "Sacramento",
    state: "CA",
    postal_code: "95819",
    lat: 38.5592,
    lng: -121.4235,
    website_url: "https://library.csus.edu/makerspace",
    phone: null,
    email: null,
    access_type: "university",
    access_notes:
      "Software and support information is directed to the Sacramento State community; verify visitor access.",
    hours_text: "See the current library makerspace schedule.",
    business_status: "OPERATIONAL",
    qualification_status: "possible_match_needs_verification",
    confidence_score: 72,
    last_checked_at: fetchedAt,
    staff_assisted: true,
    public_access: null,
    student_only: true,
    member_only: false,
    equipment: [
      {
        id: "stinger-cnc",
        equipment_type: "cnc_router",
        equipment_name: "CNC Router",
        brand_or_model: null,
        bed_width_in: null,
        bed_length_in: null,
        bed_height_in: null,
        passes_48x48: false,
        materials: [],
        file_formats: [],
        requires_training: true,
        staff_assisted: true,
        self_service: null,
        reservation_required: null,
        evidence_text:
          "The official equipment page says its CNC machine can create signs, plaques, topology maps, and complex shapes.",
        source_url: "https://library.csus.edu/makerspace",
        source_type: "official_website",
        fetched_at: fetchedAt,
        confidence: 0.96,
      },
      {
        id: "stinger-laser",
        equipment_type: "laser_cutter",
        equipment_name: "Laser Cutter",
        brand_or_model: null,
        bed_width_in: null,
        bed_length_in: null,
        bed_height_in: null,
        passes_48x48: false,
        materials: [],
        file_formats: [],
        requires_training: true,
        staff_assisted: null,
        self_service: null,
        reservation_required: null,
        evidence_text:
          "The official page says its laser cutter can etch designs or cut shapes from a range of materials.",
        source_url: "https://library.csus.edu/makerspace",
        source_type: "official_website",
        fetched_at: fetchedAt,
        confidence: 0.96,
      },
      {
        id: "stinger-3d",
        equipment_type: "3d_printer",
        equipment_name: "3D Printers",
        brand_or_model: null,
        bed_width_in: null,
        bed_length_in: null,
        bed_height_in: null,
        passes_48x48: false,
        materials: [],
        file_formats: ["3D model"],
        requires_training: null,
        staff_assisted: null,
        self_service: null,
        reservation_required: null,
        evidence_text:
          "The official equipment page lists 3D printers that construct objects from a digital model.",
        source_url: "https://library.csus.edu/makerspace",
        source_type: "official_website",
        fetched_at: fetchedAt,
        confidence: 0.96,
      },
      {
        id: "stinger-sewing",
        equipment_type: "sewing",
        equipment_name: "Sewing and embroidery machines",
        brand_or_model: null,
        bed_width_in: null,
        bed_length_in: null,
        bed_height_in: null,
        passes_48x48: false,
        materials: [],
        file_formats: [],
        requires_training: null,
        staff_assisted: null,
        self_service: null,
        reservation_required: null,
        evidence_text:
          "The official page lists manual sewing machines and programmable digital embroidery devices.",
        source_url: "https://library.csus.edu/makerspace",
        source_type: "official_website",
        fetched_at: fetchedAt,
        confidence: 0.96,
      },
    ],
  },
];

type StaticFilters = {
  cnc_router: boolean;
  min_bed_width_in: number | null;
  min_bed_length_in: number | null;
  public_access: boolean | null;
  staff_assisted: boolean | null;
  show_maybe_matches: boolean;
  equipment_types: string[];
};

function normalizeLocation(location: string) {
  return location.toLowerCase().replaceAll(",", " ").trim().replace(/\s+/g, " ");
}

function resolveLocation(location: string) {
  return localLocations[normalizeLocation(location) as keyof typeof localLocations] || localLocations["uc davis"];
}

function distanceMiles(lat1: number, lng1: number, lat2: number, lng2: number) {
  const earthRadiusMiles = 3958.8;
  const latDelta = ((lat2 - lat1) * Math.PI) / 180;
  const lngDelta = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(latDelta / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(lngDelta / 2) ** 2;

  return earthRadiusMiles * 2 * Math.asin(Math.sqrt(a));
}

function hasEquipment(place: Place, equipmentType: string) {
  return place.equipment.some((item) => item.equipment_type === equipmentType);
}

function hasLargeCnc(place: Place, width: number, length: number) {
  return place.equipment.some(
    (item) =>
      item.equipment_type === "cnc_router" &&
      item.bed_width_in !== null &&
      item.bed_length_in !== null &&
      Math.min(item.bed_width_in, item.bed_length_in) >= Math.min(width, length) &&
      Math.max(item.bed_width_in, item.bed_length_in) >= Math.max(width, length),
  );
}

function passesFilters(place: Place, filters: StaticFilters) {
  if (filters.public_access !== null && place.public_access !== filters.public_access) {
    return false;
  }
  if (filters.staff_assisted !== null && place.staff_assisted !== filters.staff_assisted) {
    return false;
  }

  const requestedTypes = new Set(filters.equipment_types);
  if (filters.cnc_router) requestedTypes.add("cnc_router");
  if (requestedTypes.size > 0) {
    const allEquipmentMatches = [...requestedTypes].every((type) => hasEquipment(place, type));
    if (!allEquipmentMatches) {
      return filters.show_maybe_matches && place.qualification_status.startsWith("possible");
    }
  }

  if (filters.min_bed_width_in && filters.min_bed_length_in) {
    const hasCapacity = hasLargeCnc(place, filters.min_bed_width_in, filters.min_bed_length_in);
    if (!hasCapacity) {
      return filters.show_maybe_matches && place.qualification_status.startsWith("possible");
    }
  }

  return true;
}

function rankPlace(
  place: Place,
  centerLat: number,
  centerLng: number,
  radiusMiles: number,
  filters: StaticFilters,
): SearchResult {
  const distance = distanceMiles(centerLat, centerLng, place.lat, place.lng);
  const distanceScore = Math.max(0, 100 * (1 - distance / Math.max(radiusMiles, 1)));

  const requestedTypes = new Set(filters.equipment_types);
  if (filters.cnc_router) requestedTypes.add("cnc_router");
  const equipmentScore =
    requestedTypes.size > 0
      ? (100 * [...requestedTypes].filter((type) => hasEquipment(place, type)).length) /
        requestedTypes.size
      : Math.min(100, place.equipment.length * 20);

  const capacityRequired = Boolean(filters.min_bed_width_in && filters.min_bed_length_in);
  const capacityPasses = capacityRequired
    ? hasLargeCnc(place, filters.min_bed_width_in || 48, filters.min_bed_length_in || 48)
    : place.equipment.some((item) => item.passes_48x48);
  const capacityScore = capacityPasses ? 100 : hasEquipment(place, "cnc_router") ? 20 : 0;
  const accessScore = place.public_access ? 100 : place.access_type !== "unknown" ? 72 : 25;

  const whyMatched: string[] = [];
  if (capacityPasses) whyMatched.push("Confirmed CNC work area meets the requested sheet size");
  if (hasEquipment(place, "cnc_router")) whyMatched.push("Official source confirms a CNC router");
  if (place.staff_assisted) whyMatched.push("Staff-assisted fabrication is available");
  if (place.public_access) whyMatched.push("Public or member access is clearly explained");
  if (whyMatched.length === 0) whyMatched.push("Relevant fabrication equipment is documented");

  const finalScore =
    0.25 * distanceScore +
    0.3 * equipmentScore +
    0.2 * capacityScore +
    0.15 * accessScore +
    0.1 * place.confidence_score;

  return {
    ...place,
    distance_miles: Math.round(distance * 10) / 10,
    final_score: Math.round(finalScore * 10) / 10,
    why_matched: whyMatched,
  };
}

export function staticSearchPlaces(payload: {
  location: string;
  radius_miles: number;
  filters: StaticFilters;
}): SearchResponse {
  const center = resolveLocation(payload.location);
  const results = staticPlaces
    .filter((place) => distanceMiles(center.lat, center.lng, place.lat, place.lng) <= payload.radius_miles)
    .filter((place) => passesFilters(place, payload.filters))
    .map((place) =>
      rankPlace(place, center.lat, center.lng, payload.radius_miles, payload.filters),
    )
    .sort((left, right) => right.final_score - left.final_score);

  return {
    query: payload.location,
    normalized_address: center.address,
    center_lat: center.lat,
    center_lng: center.lng,
    radius_miles: payload.radius_miles,
    total: results.length,
    results,
  };
}

export function staticGetPlace(placeId: string) {
  const place = staticPlaces.find((item) => item.id === placeId);
  if (!place) throw new Error("Place not found.");
  return place;
}
