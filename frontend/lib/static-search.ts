import { distanceMiles } from "@/lib/distance";
import type { Equipment, Place, SearchResponse, SearchResult } from "@/lib/types";

const fetchedAt = "2026-06-24T18:00:00Z";

const localLocations = {
  brooklyn: { address: "Brooklyn, NY, USA", lat: 40.6782, lng: -73.9442 },
  "brooklyn ny": { address: "Brooklyn, NY, USA", lat: 40.6782, lng: -73.9442 },
  "sunset park": { address: "Sunset Park, Brooklyn, NY, USA", lat: 40.6527, lng: -74.0093 },
  "industry city": { address: "Industry City, Brooklyn, NY, USA", lat: 40.657, lng: -74.0067 },
  "downtown brooklyn": { address: "Downtown Brooklyn, NY, USA", lat: 40.6928, lng: -73.9903 },
  "brooklyn navy yard": { address: "Brooklyn Navy Yard, Brooklyn, NY, USA", lat: 40.6995, lng: -73.9716 },
  gowanus: { address: "Gowanus, Brooklyn, NY, USA", lat: 40.6782, lng: -73.9928 },
  "fort greene": { address: "Fort Greene, Brooklyn, NY, USA", lat: 40.6921, lng: -73.9742 },
} as const;

type EquipmentDraft = [
  type: string,
  name: string,
  sourceUrl: string,
  evidence: string,
  options?: Partial<Equipment>,
];

type PlaceDraft = Omit<Place, "equipment" | "last_checked_at" | "business_status"> & {
  equipment: EquipmentDraft[];
};

function makeEquipment(placeId: string, index: number, draft: EquipmentDraft): Equipment {
  const [equipment_type, equipment_name, source_url, evidence_text, options] = draft;
  return {
    id: `${placeId}-${index + 1}`,
    equipment_type,
    equipment_name,
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
    evidence_text,
    source_url,
    source_type: "official_website",
    fetched_at: fetchedAt,
    confidence: 0.92,
    ...options,
  };
}

function makePlace(draft: PlaceDraft): Place {
  return {
    ...draft,
    business_status: "OPERATIONAL",
    last_checked_at: fetchedAt,
    equipment: draft.equipment.map((item, index) => makeEquipment(draft.id, index, item)),
  };
}

export const staticPlaces: Place[] = [
  makePlace({
    id: "sjsw-st-joseph-studio-workshop",
    name: "SJSW — St. Joseph Studio Workshop",
    category: "community_design_workshop",
    description: "Sunset Park nonprofit design studio, workshop, and design lab focused on making, experimentation, technical training, and youth/community workshops.",
    address: "67 35th Street, Unit C251",
    city: "Brooklyn",
    state: "NY",
    postal_code: "11232",
    lat: 40.6569405,
    lng: -74.0069057,
    website_url: "https://sjsw.org/",
    phone: "+1 (347) 350-4084",
    email: "info@sjsw.org",
    access_type: "contact_first",
    access_notes: "Contact SJSW before visiting. The workshop is listed at Industry City, Building 5, Unit C251.",
    hours_text: "Tuesday–Friday, 10:00 AM–5:00 PM.",
    qualification_status: "strong_match",
    confidence_score: 98,
    staff_assisted: true,
    public_access: null,
    student_only: false,
    member_only: false,
    equipment: [
      ["design_lab", "Design studio and workshop", "https://sjsw.org/", "SJSW describes itself as a studio, workshop, and design lab that designs, makes, and experiments.", { confidence: 0.98, staff_assisted: true }],
      ["training", "Technical training and youth workshops", "https://sjsw.org/", "The official site lists Technical Training and Youth Engagement Workshops as services.", { confidence: 0.98, staff_assisted: true }],
      ["cnc_router", "Workshop CNC capability", "https://sjsw.org/tag/sjsw/", "An SJSW post describes receiving a BCAMCNC machine and preparing to teach others how to use it.", { confidence: 0.82, requires_training: true, staff_assisted: true }],
    ],
  }),
  makePlace({
    id: "makerspace-nyc-brooklyn-army-terminal",
    name: "MakerSpace NYC — Brooklyn Army Terminal",
    category: "community_makerspace",
    description: "Large public/member makerspace at Brooklyn Army Terminal with industrial workspaces, classes, shops, and fabrication equipment.",
    address: "140 58th Street, Building B, Unit 1C",
    city: "Brooklyn",
    state: "NY",
    postal_code: "11220",
    lat: 40.6456748,
    lng: -74.0250124,
    website_url: "https://www.makerspace.nyc/",
    phone: null,
    email: null,
    access_type: "membership_classes_day_pass",
    access_notes: "Offers memberships, classes, studio space, and day-pass style access; check current class and shop requirements before going.",
    hours_text: "Shop hours vary by day; check the current MakerSpace NYC calendar before visiting.",
    qualification_status: "verified_cnc_capable",
    confidence_score: 96,
    staff_assisted: true,
    public_access: true,
    student_only: false,
    member_only: true,
    equipment: [
      ["cnc_router", "CNC equipment", "https://www.makerspace.nyc/", "The official homepage lists CNC among its industrial equipment.", { confidence: 0.96, requires_training: true, staff_assisted: true, passes_48x48: true }],
      ["waterjet", "Waterjet", "https://www.makerspace.nyc/", "The official homepage lists waterjet equipment.", { confidence: 0.95, requires_training: true, staff_assisted: true }],
      ["woodshop", "Woodshop", "https://www.makerspace.nyc/studios", "The studio page lists access to onsite wood shop space and equipment.", { confidence: 0.95, requires_training: true }],
      ["metal_shop", "Metal shop, welding, and blacksmithing", "https://www.makerspace.nyc/", "The official homepage lists welding, blacksmithing, and industrial shop access.", { confidence: 0.96, requires_training: true }],
      ["3d_printer", "3D printing", "https://www.makerspace.nyc/", "The official homepage lists 3D printing classes and equipment access.", { confidence: 0.95, requires_training: true }],
      ["sewing", "Sewing and textiles", "https://www.makerspace.nyc/", "The official homepage lists sewing among the skills and shop offerings.", { confidence: 0.94, requires_training: true }],
      ["ceramics", "Pottery and ceramics", "https://www.makerspace.nyc/", "The official homepage lists pottery throwing among its class offerings.", { confidence: 0.92, requires_training: true }],
    ],
  }),
  makePlace({
    id: "nyc-resistor",
    name: "NYC Resistor",
    category: "hackerspace",
    description: "Downtown Brooklyn community hackerspace for electronics, code, laser cutting, 3D printing, talks, and hands-on open nights.",
    address: "87 3rd Avenue, 4th Floor",
    city: "Brooklyn",
    state: "NY",
    postal_code: "11217",
    lat: 40.6835887,
    lng: -73.9816241,
    website_url: "https://www.nycresistor.com/",
    phone: null,
    email: null,
    access_type: "membership_events_classes",
    access_notes: "Community space with memberships, classes, and public events; check the event calendar for open nights and class access.",
    hours_text: "Event and class based; check the NYC Resistor calendar.",
    qualification_status: "strong_match",
    confidence_score: 94,
    staff_assisted: false,
    public_access: true,
    student_only: false,
    member_only: true,
    equipment: [
      ["laser_cutter", "Laser cutter", "https://www.nycresistor.com/", "NYC Resistor publishes laser cutter classes and describes itself as a Brooklyn makerspace.", { confidence: 0.93, requires_training: true }],
      ["3d_printer", "3D printing station", "https://www.nycresistor.com/", "NYC Resistor materials reference member/shared 3D printing access.", { confidence: 0.9, requires_training: true }],
      ["electronics", "Electronics benches", "https://www.nycresistor.com/", "The hackerspace focuses on learning, sharing, electronics, code, and making projects.", { confidence: 0.9 }],
    ],
  }),
  makePlace({
    id: "genspace-community-biolab",
    name: "Genspace",
    category: "community_bio_lab",
    description: "Sunset Park community biology lab where people learn and work on biotechnology through classes, membership, and guided lab projects.",
    address: "132 32nd Street, Suite 108",
    city: "Brooklyn",
    state: "NY",
    postal_code: "11232",
    lat: 40.6568049,
    lng: -74.0029213,
    website_url: "https://www.genspace.org/",
    phone: "+1 (929) 387-8100",
    email: "info@genspace.org",
    access_type: "classes_membership_appointment",
    access_notes: "Visits are by appointment. Lab projects require training, classes, membership, or prior biology experience depending on the program.",
    hours_text: "By appointment and scheduled programming.",
    qualification_status: "strong_match",
    confidence_score: 96,
    staff_assisted: true,
    public_access: true,
    student_only: false,
    member_only: true,
    equipment: [
      ["bio_lab", "Community biology lab", "https://www.genspace.org/", "The official site calls Genspace the world's first community biology lab.", { confidence: 0.97, requires_training: true, staff_assisted: true }],
      ["training", "Biotech classes and project training", "https://www.genspace.org/join-the-lab", "Genspace lists classes, membership, and community bio safety expectations.", { confidence: 0.95, requires_training: true, staff_assisted: true }],
    ],
  }),
  makePlace({
    id: "newlab-brooklyn",
    name: "Newlab Brooklyn",
    category: "professional_prototyping_hub",
    description: "Brooklyn Navy Yard startup and prototyping hub with workshops, labs, product-realization support, and pilot-site access.",
    address: "Brooklyn Navy Yard, Building 128",
    city: "Brooklyn",
    state: "NY",
    postal_code: "11205",
    lat: 40.6996,
    lng: -73.9718,
    website_url: "https://www.newlab.com/locations/brooklyn",
    phone: null,
    email: null,
    access_type: "member_startup_platform",
    access_notes: "Primarily for member companies and teams using Newlab's workspace, labs, and product-realization support.",
    hours_text: "Flexible 24/7+365 member access is listed for the Brooklyn location.",
    qualification_status: "strong_match",
    confidence_score: 95,
    staff_assisted: true,
    public_access: false,
    student_only: false,
    member_only: true,
    equipment: [
      ["rapid_prototyping", "Rapid prototyping", "https://www.newlab.com/locations/brooklyn", "Newlab lists state-of-the-art prototyping equipment and an onsite product-realization team.", { confidence: 0.96, staff_assisted: true }],
      ["bio_lab", "Biolab", "https://www.newlab.com/locations/brooklyn", "Newlab's Brooklyn product-realization list includes a biolab.", { confidence: 0.94, requires_training: true, staff_assisted: true }],
      ["metal_shop", "Metals and plastics workshop", "https://www.newlab.com/locations/brooklyn", "Newlab's Brooklyn list includes a metals/plastics workshop.", { confidence: 0.94, requires_training: true, staff_assisted: true }],
      ["3d_printer", "FDM 3D printing", "https://www.newlab.com/locations/brooklyn", "Newlab's Brooklyn list includes FDM 3D printing.", { confidence: 0.94, requires_training: true, staff_assisted: true }],
      ["electronics", "Electronics lab", "https://www.newlab.com/locations/brooklyn", "Newlab's Brooklyn list includes an electronics lab.", { confidence: 0.94, requires_training: true, staff_assisted: true }],
      ["sewing", "Textiles lab", "https://www.newlab.com/locations/brooklyn", "Newlab's Brooklyn list includes a textiles lab.", { confidence: 0.93, requires_training: true, staff_assisted: true }],
      ["woodshop", "Wood shop", "https://www.newlab.com/locations/brooklyn", "Newlab's Brooklyn list includes a wood shop.", { confidence: 0.93, requires_training: true, staff_assisted: true }],
    ],
  }),
  makePlace({
    id: "nyu-tandon-makerspace",
    name: "NYU Tandon MakerSpace",
    category: "university_makerspace",
    description: "NYU Tandon's Downtown Brooklyn makerspace with advanced software, milling, 3D printing, rapid prototyping, and integrated manufacturing facilities.",
    address: "6 MetroTech Center, Jacobs Hall, Room 118",
    city: "Brooklyn",
    state: "NY",
    postal_code: "11201",
    lat: 40.694542,
    lng: -73.9867908,
    website_url: "https://engineering.nyu.edu/life-tandon/makerspace",
    phone: null,
    email: "tandon-makerspace@nyu.edu",
    access_type: "nyu_students_faculty_staff",
    access_notes: "Free for NYU students, faculty, and staff after required trainings and reservations.",
    hours_text: "Academic schedule varies; check NYU MakerSpace hours before visiting.",
    qualification_status: "strong_match",
    confidence_score: 95,
    staff_assisted: true,
    public_access: false,
    student_only: true,
    member_only: false,
    equipment: [
      ["cnc_mill", "Milling machines", "https://engineering.nyu.edu/life-tandon/makerspace", "NYU Tandon lists tools from advanced software and milling machines to 3D printers.", { confidence: 0.95, requires_training: true, staff_assisted: true }],
      ["3d_printer", "3D printers", "https://makerspace.engineering.nyu.edu/machines/", "NYU MakerSpace's machine list includes 3D printers.", { confidence: 0.95, requires_training: true }],
      ["laser_cutter", "Laser cutters", "https://makerspace.engineering.nyu.edu/machines/", "NYU MakerSpace's machine list includes laser cutters.", { confidence: 0.94, requires_training: true }],
      ["electronics", "PCB and electronics tools", "https://makerspace.engineering.nyu.edu/machines/", "NYU MakerSpace's list includes PCB construction and related shop tools.", { confidence: 0.92, requires_training: true }],
    ],
  }),
  makePlace({
    id: "nyu-makergarage",
    name: "NYU MakerGarage",
    category: "university_makerspace",
    description: "NYU Tandon companion makerspace at 325 Gold Street, tied to the campus maker ecosystem and project prototyping.",
    address: "325 Gold Street, 2nd Floor",
    city: "Brooklyn",
    state: "NY",
    postal_code: "11201",
    lat: 40.6945308,
    lng: -73.9831384,
    website_url: "https://engineering.nyu.edu/life-tandon/makerspace",
    phone: null,
    email: "tandon-makerspace@nyu.edu",
    access_type: "nyu_students_faculty_staff",
    access_notes: "NYU campus access; the MakerGarage is listed as a second floor space at 325 Gold Street and may operate by request.",
    hours_text: "Academic schedule varies; check NYU MakerSpace hours before visiting.",
    qualification_status: "strong_match",
    confidence_score: 90,
    staff_assisted: true,
    public_access: false,
    student_only: true,
    member_only: false,
    equipment: [["rapid_prototyping", "Project prototyping space", "https://engineering.nyu.edu/life-tandon/makerspace", "NYU lists MakerGarage as part of the MakerSpace ecosystem at 325 Gold Street.", { confidence: 0.9, staff_assisted: true }]],
  }),
  makePlace({
    id: "craftsman-ave",
    name: "Craftsman Ave",
    category: "hands_on_workshop",
    description: "Industry City workshop studio offering guided classes in woodworking, welding, knife making, leatherwork, stained glass, and more.",
    address: "68 34th Street, Building 6, 1st Floor, Suite B124",
    city: "Brooklyn",
    state: "NY",
    postal_code: "11232",
    lat: 40.6571256,
    lng: -74.0064921,
    website_url: "https://craftsmanave.com/",
    phone: "+1 (929) 266-3494",
    email: null,
    access_type: "ticketed_workshops",
    access_notes: "Access is through paid guided workshops/classes rather than open independent shop use.",
    hours_text: "Workshop schedule varies; check the calendar for current classes.",
    qualification_status: "strong_match",
    confidence_score: 94,
    staff_assisted: true,
    public_access: true,
    student_only: false,
    member_only: false,
    equipment: [
      ["woodshop", "Woodworking workshops", "https://craftsmanave.com/", "Craftsman Ave lists woodworking workshops taught by experienced makers.", { confidence: 0.94, requires_training: true, staff_assisted: true }],
      ["metal_shop", "Welding and knife making", "https://craftsmanave.com/", "Craftsman Ave lists welding and knife making classes.", { confidence: 0.94, requires_training: true, staff_assisted: true }],
      ["leatherwork", "Leather-working", "https://craftsmanave.com/", "Craftsman Ave lists leather-working workshops.", { confidence: 0.93, requires_training: true, staff_assisted: true }],
      ["stained_glass", "Stained glass", "https://craftsmanave.com/", "Craftsman Ave lists stained glass workshops.", { confidence: 0.93, requires_training: true, staff_assisted: true }],
    ],
  }),
  makePlace({
    id: "powerhouse-arts",
    name: "Powerhouse Arts",
    category: "arts_fabrication_hub",
    description: "Gowanus nonprofit creative production center with fabrication studios, artist programs, community workshops, exhibitions, and rentals.",
    address: "322 3rd Avenue",
    city: "Brooklyn",
    state: "NY",
    postal_code: "11215",
    lat: 40.6763323,
    lng: -73.9882201,
    website_url: "https://powerhousearts.org/",
    phone: "+1 (718) 522-1400",
    email: "info@powerhousearts.org",
    access_type: "programs_rentals_workshops",
    access_notes: "Access depends on public programs, classes, artist services, rentals, and partnerships; not an open drop-in makerspace.",
    hours_text: "Weekdays 9:00 AM–7:30 PM; weekends 10:00 AM–6:00 PM.",
    qualification_status: "strong_match",
    confidence_score: 91,
    staff_assisted: true,
    public_access: true,
    student_only: false,
    member_only: false,
    equipment: [
      ["arts_fabrication", "Fabrication studios", "https://powerhousearts.org/", "Powerhouse Arts describes a Brooklyn arts facility and fabrication hub with fabrication studios and community workshops.", { confidence: 0.91, staff_assisted: true }],
      ["training", "Classes and workshops", "https://powerhousearts.org/contact", "The contact page lists classes and workshops contact information and public hours.", { confidence: 0.9, staff_assisted: true }],
    ],
  }),
  makePlace({
    id: "pratt-makerspaces-and-labs",
    name: "Pratt Institute Makerspaces and Labs",
    category: "university_labs",
    description: "Pratt's Brooklyn campus shops, labs, and studios for design, architecture, laser cutting, materials, and student making.",
    address: "200 Willoughby Avenue",
    city: "Brooklyn",
    state: "NY",
    postal_code: "11205",
    lat: 40.6913383,
    lng: -73.9630163,
    website_url: "https://www.pratt.edu/academics/makerspaces-and-labs/",
    phone: null,
    email: null,
    access_type: "pratt_students_faculty_staff",
    access_notes: "Pratt campus labs are primarily for Pratt students, faculty, and approved academic work.",
    hours_text: "Academic lab hours vary by shop and semester.",
    qualification_status: "strong_match",
    confidence_score: 92,
    staff_assisted: true,
    public_access: false,
    student_only: true,
    member_only: false,
    equipment: [
      ["laser_cutter", "Laser Lab", "https://www.pratt.edu/design/homepage/school-of-design-labs-and-studios/", "Pratt's School of Design says the Laser Lab contains six laser cutters.", { confidence: 0.94, requires_training: true, staff_assisted: true }],
      ["woodshop", "Shops, labs, and studios", "https://www.pratt.edu/academics/makerspaces-and-labs/", "Pratt says its shops, labs, and studios offer space, tools, and resources for making.", { confidence: 0.9, requires_training: true, staff_assisted: true }],
    ],
  }),
  makePlace({
    id: "city-tech-arch-fab-labs",
    name: "City Tech Architectural Technology Fabrication Labs",
    category: "college_fabrication_lab",
    description: "CUNY City Tech academic fabrication labs supporting laser cutting, 3D printing, CNC machining, scanning, and architectural prototypes.",
    address: "186 Jay Street",
    city: "Brooklyn",
    state: "NY",
    postal_code: "11201",
    lat: 40.6990375,
    lng: -73.9873826,
    website_url: "https://www.citytech.cuny.edu/architecture/technology.aspx",
    phone: null,
    email: null,
    access_type: "city_tech_students_faculty",
    access_notes: "Academic support labs for City Tech Architectural Technology students and coursework.",
    hours_text: "Academic lab hours vary by semester.",
    qualification_status: "strong_match",
    confidence_score: 93,
    staff_assisted: true,
    public_access: false,
    student_only: true,
    member_only: false,
    equipment: [
      ["laser_cutter", "Laser cutting", "https://www.citytech.cuny.edu/architecture/technology.aspx", "City Tech lists laser cutting among the fabrication strategies taught in the labs.", { confidence: 0.94, requires_training: true, staff_assisted: true }],
      ["3d_printer", "3D printing", "https://www.citytech.cuny.edu/architecture/technology.aspx", "City Tech lists 3D printing among the fabrication strategies taught in the labs.", { confidence: 0.94, requires_training: true, staff_assisted: true }],
      ["cnc_mill", "CNC machining", "https://www.citytech.cuny.edu/architecture/technology.aspx", "City Tech lists CNC machining among the fabrication strategies taught in the labs.", { confidence: 0.94, requires_training: true, staff_assisted: true }],
      ["3d_scanning", "3D scanning and digitizing", "https://www.citytech.cuny.edu/architecture/technology.aspx", "City Tech lists 3D scanning and digitizing among the fabrication lab capabilities.", { confidence: 0.93, requires_training: true, staff_assisted: true }],
    ],
  }),
  makePlace({
    id: "brooklyn-steam-center",
    name: "Brooklyn STEAM Center",
    category: "career_technical_education",
    description: "Brooklyn Navy Yard career and technical education center with design, engineering, manufacturing, multimedia, and hands-on industry pathways.",
    address: "141 Flushing Avenue, Building 77, Suite 301",
    city: "Brooklyn",
    state: "NY",
    postal_code: "11205",
    lat: 40.6985851,
    lng: -73.9711478,
    website_url: "https://steamcenter.nyc/locations/",
    phone: "+1 (347) 464-3680",
    email: "Info@BrooklynSTEAMcenter.org",
    access_type: "partner_high_school_students",
    access_notes: "Restricted to students from partner high schools through Brooklyn STEAM Center programs.",
    hours_text: "School program schedule.",
    qualification_status: "strong_match",
    confidence_score: 90,
    staff_assisted: true,
    public_access: false,
    student_only: true,
    member_only: false,
    equipment: [
      ["industrial_design", "Design and engineering pathway", "https://steamcenter.nyc/locations/", "The STEAM Center is listed at Building 77 and offers career-focused hands-on pathways.", { confidence: 0.9, requires_training: true, staff_assisted: true }],
      ["training", "Career and technical training", "https://brooklynsteamcenter.org/", "Brooklyn STEAM Center describes industry-informed experiences that empower students.", { confidence: 0.88, requires_training: true, staff_assisted: true }],
    ],
  }),
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
  return (
    localLocations[normalizeLocation(location) as keyof typeof localLocations] ||
    localLocations.brooklyn
  );
}

function hasEquipment(place: Place, equipmentType: string) {
  return place.equipment.some((item) => item.equipment_type === equipmentType);
}

function hasLargeCnc(place: Place, width: number, length: number) {
  return place.equipment.some(
    (item) =>
      item.equipment_type === "cnc_router" &&
      item.passes_48x48 &&
      (item.bed_width_in === null ||
        item.bed_length_in === null ||
        (Math.min(item.bed_width_in, item.bed_length_in) >= Math.min(width, length) &&
          Math.max(item.bed_width_in, item.bed_length_in) >= Math.max(width, length))),
  );
}

function passesFilters(place: Place, filters: StaticFilters) {
  if (filters.public_access !== null && place.public_access !== filters.public_access) return false;
  if (filters.staff_assisted !== null && place.staff_assisted !== filters.staff_assisted) return false;

  const requestedTypes = new Set(filters.equipment_types);
  if (filters.cnc_router) requestedTypes.add("cnc_router");
  if (requestedTypes.size > 0 && ![...requestedTypes].every((type) => hasEquipment(place, type))) {
    return false;
  }

  if (filters.min_bed_width_in && filters.min_bed_length_in) {
    return hasLargeCnc(place, filters.min_bed_width_in, filters.min_bed_length_in);
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
  const distance = distanceMiles({ lat: centerLat, lng: centerLng }, { lat: place.lat, lng: place.lng });
  const distanceScore = Math.max(0, 100 * (1 - distance / Math.max(radiusMiles, 1)));
  const requestedTypes = new Set(filters.equipment_types);
  if (filters.cnc_router) requestedTypes.add("cnc_router");

  const equipmentScore =
    requestedTypes.size > 0
      ? (100 * [...requestedTypes].filter((type) => hasEquipment(place, type)).length) / requestedTypes.size
      : Math.min(100, place.equipment.length * 17);
  const accessScore = place.public_access ? 100 : place.public_access === null ? 58 : 42;
  const sjswBoost = place.id === "sjsw-st-joseph-studio-workshop" ? 8 : 0;

  const why_matched: string[] = [];
  if (place.id === "sjsw-st-joseph-studio-workshop") {
    why_matched.push("Featured Sunset Park workshop from SJSW.org with exact Industry City address.");
  }
  if (hasEquipment(place, "cnc_router")) why_matched.push("Source-backed CNC or router capability is listed.");
  if (place.staff_assisted) why_matched.push("Staff, instructors, or guided support are part of the access model.");
  if (place.public_access) why_matched.push("Public, class, event, or member access is clearly described.");
  if (why_matched.length === 0) why_matched.push("Relevant Brooklyn maker capability is documented by source links.");

  const finalScore =
    0.25 * distanceScore +
    0.3 * equipmentScore +
    0.15 * accessScore +
    0.22 * place.confidence_score +
    sjswBoost;

  return {
    ...place,
    distance_miles: Math.round(distance * 10) / 10,
    final_score: Math.round(finalScore * 10) / 10,
    why_matched,
  };
}

export function staticSearchPlaces(payload: {
  location: string;
  radius_miles: number;
  filters: StaticFilters;
}): SearchResponse {
  const center = resolveLocation(payload.location);
  const results = staticPlaces
    .filter((place) => distanceMiles(center, { lat: place.lat, lng: place.lng }) <= payload.radius_miles)
    .filter((place) => passesFilters(place, payload.filters))
    .map((place) => rankPlace(place, center.lat, center.lng, payload.radius_miles, payload.filters))
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
