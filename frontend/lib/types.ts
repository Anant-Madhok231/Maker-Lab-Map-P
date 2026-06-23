export type Equipment = {
  id: string;
  equipment_type: string;
  equipment_name: string;
  brand_or_model: string | null;
  bed_width_in: number | null;
  bed_length_in: number | null;
  bed_height_in: number | null;
  passes_48x48: boolean;
  materials: string[];
  file_formats: string[];
  requires_training: boolean | null;
  staff_assisted: boolean | null;
  self_service: boolean | null;
  reservation_required: boolean | null;
  evidence_text: string;
  source_url: string;
  source_type: string;
  fetched_at: string;
  confidence: number;
};

export type Place = {
  id: string;
  name: string;
  category: string;
  description: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  lat: number;
  lng: number;
  website_url: string;
  phone: string | null;
  email: string | null;
  access_type: string;
  access_notes: string;
  hours_text: string;
  business_status: string;
  qualification_status: string;
  confidence_score: number;
  last_checked_at: string;
  staff_assisted: boolean | null;
  public_access: boolean | null;
  student_only: boolean | null;
  member_only: boolean | null;
  equipment: Equipment[];
};

export type SearchResult = Place & {
  distance_miles: number;
  final_score: number;
  why_matched: string[];
};

export type SearchResponse = {
  query: string;
  normalized_address: string;
  center_lat: number;
  center_lng: number;
  radius_miles: number;
  total: number;
  results: SearchResult[];
};

