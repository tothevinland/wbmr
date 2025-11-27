import { z } from 'zod';

export const signupSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be less than 50 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain alphanumeric characters and underscores'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export const locationSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export const personInvolvedSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  role: z.string().min(1, 'Role is required').max(200),
  image: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  contact: z.string().max(200).optional().or(z.literal('')),
  organization: z.string().max(200).optional().or(z.literal('')),
});

export const createRoadSchema = z.object({

  road_name: z.string().min(1, 'Road name is required').max(200),
  location: locationSchema,
  contractor: z.string().min(1, 'Contractor is required').max(200),
  approved_by: z.string().min(1, 'Approved by is required').max(200),
  total_cost: z.string().min(1, 'Total cost is required').max(100),
  promised_completion_date: z.string().min(1, 'Promised completion date is required'),
  actual_completion_date: z.string().min(1, 'Actual completion date is required'),
  maintenance_firm: z.string().min(1, 'Maintenance firm is required').max(200),
  status: z.string().min(1, 'Status is required').max(100),
  type: z.string().max(100).optional().or(z.literal('')),
  people_involved: z.array(personInvolvedSchema).optional().default([]),

  highway_number: z.string().max(50).optional().or(z.literal('')),
  corridor_name: z.string().max(200).optional().or(z.literal('')),
  states: z.array(z.string()).optional().default([]),
  districts: z.array(z.string()).optional().default([]),
  start_point: z.string().max(100).optional().or(z.literal('')),
  end_point: z.string().max(100).optional().or(z.literal('')),
  total_length_km: z.string().optional().or(z.literal('')),
  project_type: z.string().max(50).optional().or(z.literal('')),
  lane_configuration: z.string().max(20).optional().or(z.literal('')),
  pavement_type: z.string().max(20).optional().or(z.literal('')),

  promised_start_date: z.string().optional().or(z.literal('')),
  actual_start_date: z.string().optional().or(z.literal('')),
  progress_percentage: z.string().optional().or(z.literal('')),
  reason_for_delay: z.string().max(500).optional().or(z.literal('')),

  approved_project_cost: z.string().optional().or(z.literal('')),
  revised_cost: z.string().optional().or(z.literal('')),
  mode_of_financing: z.string().max(50).optional().or(z.literal('')),
  bid_price_winner: z.string().optional().or(z.literal('')),
  tender_estimate_govt: z.string().optional().or(z.literal('')),
  loan_providers: z.array(z.string()).optional().default([]),
  concession_period: z.string().max(50).optional().or(z.literal('')),
  annuity_details: z.string().max(500).optional().or(z.literal('')),
  tolling_model: z.string().max(200).optional().or(z.literal('')),

  ministry: z.string().max(100).optional().or(z.literal('')),
  approving_authority: z.string().max(200).optional().or(z.literal('')),
  executing_agency: z.string().max(200).optional().or(z.literal('')),
  project_director: z.string().max(200).optional().or(z.literal('')),
  design_consultant: z.string().max(200).optional().or(z.literal('')),
  pmc_consultant: z.string().max(200).optional().or(z.literal('')),

  contractor_company_name: z.string().max(200).optional().or(z.literal('')),
  contractor_cmd_ceo: z.string().max(200).optional().or(z.literal('')),
  contractor_project_manager: z.string().max(200).optional().or(z.literal('')),
  contractor_resident_engineer: z.string().max(200).optional().or(z.literal('')),
  contractor_site_engineers: z.array(z.string()).optional().default([]),
  contractor_quality_control_engineer: z.string().max(200).optional().or(z.literal('')),
  contractor_safety_engineer: z.string().max(200).optional().or(z.literal('')),
  contractor_type: z.string().max(50).optional().or(z.literal('')),

  total_land_required_ha: z.string().optional().or(z.literal('')),
  private_land_required: z.string().optional().or(z.literal('')),
  govt_land_required: z.string().optional().or(z.literal('')),
  num_affected_families: z.string().optional().or(z.literal('')),
  compensation_amount_paid: z.string().optional().or(z.literal('')),
  notification_3a_date: z.string().optional().or(z.literal('')),
  notification_3d_date: z.string().optional().or(z.literal('')),
  notification_3g_date: z.string().optional().or(z.literal('')),
  court_cases: z.string().max(1000).optional().or(z.literal('')),
  encroachment_issues: z.string().max(1000).optional().or(z.literal('')),
  relocation_details: z.string().max(1000).optional().or(z.literal('')),

  environmental_clearance_status: z.string().max(100).optional().or(z.literal('')),
  forest_clearance_stage_1: z.string().max(100).optional().or(z.literal('')),
  forest_clearance_stage_2: z.string().max(100).optional().or(z.literal('')),
  num_trees_to_cut: z.string().optional().or(z.literal('')),
  num_trees_replanted: z.string().optional().or(z.literal('')),
  wildlife_clearance: z.string().max(200).optional().or(z.literal('')),
  pollution_control_reports: z.array(z.string()).optional().default([]),

  alignment_type: z.string().max(50).optional().or(z.literal('')),
  carriageway_width: z.string().optional().or(z.literal('')),
  median_width: z.string().optional().or(z.literal('')),
  shoulder_width: z.string().optional().or(z.literal('')),
  embankment_height: z.string().optional().or(z.literal('')),
  soil_geotech_report: z.string().max(500).optional().or(z.literal('')),
  drainage_design: z.string().max(500).optional().or(z.literal('')),
  service_roads_plan: z.string().max(500).optional().or(z.literal('')),
  intersections_uturns: z.string().max(500).optional().or(z.literal('')),
  crash_barrier_specs: z.string().max(500).optional().or(z.literal('')),
  signage_plan: z.string().max(500).optional().or(z.literal('')),
  markings_plan: z.string().max(500).optional().or(z.literal('')),

  om_contractor: z.string().max(200).optional().or(z.literal('')),
  maintenance_period_dlp: z.string().max(100).optional().or(z.literal('')),
  maintenance_cost: z.string().optional().or(z.literal('')),

  extra_fields: z.record(z.any()).optional().default({}),
});

export const updateRoadSchema = createRoadSchema.partial();

export const feedbackSchema = z.object({
  comment: z.string().min(1, 'Comment is required').max(1000, 'Comment must be less than 1000 characters'),
});

export const searchSchema = z.object({
  q: z.string().min(2, 'Search query must be at least 2 characters'),
  limit: z.number().min(1).max(50).optional().default(10),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateRoadInput = z.infer<typeof createRoadSchema>;
export type UpdateRoadInput = z.infer<typeof updateRoadSchema>;
export type FeedbackInput = z.infer<typeof feedbackSchema>;
export type SearchInput = z.infer<typeof searchSchema>;

export interface User {
  id: string;
  username: string;
}

export interface AuthResponse {
  status: string;
  message: string;
  data: {
    access_token: string;
    token_type: string;
    user: User;
  };
}

export interface DateTimeFormat {
  iso: string;
  timestamp: number;
  timezone: string;
}

export interface Road {
  id: string;
  segment_id?: string;
  road_name: string;
  road_slug?: string;
  segment_slug?: string;
  road_group_id?: string;
  location: {
    lat: number;
    lng: number;
  };
  contractor: string;
  approved_by: string;
  total_cost: string;
  promised_completion_date: string;
  actual_completion_date: string;
  maintenance_firm: string;
  status: string;
  type?: string | null;
  images: string[];
  added_by_user: string;
  approved: boolean;
  extra_fields: Record<string, any>;
  created_at: DateTimeFormat;
  updated_at: DateTimeFormat;
  osm_way_id?: string;
  geometry?: {
    type: 'LineString' | 'Point';
    coordinates: number[][] | [number, number];
  };
  has_osm_data?: boolean;
}

export interface Feedback {
  id: string;
  road_id: string;
  user: string;
  comment: string;
  date: DateTimeFormat;
}

export interface RoadsResponse {
  status: string;
  message: string;
  data: {
    roads: Road[];
    total: number;
    skip: number;
    limit: number;
  };
}

export interface GroupedRoad {
  road_name: string;
  road_slug: string;
  segment_count: number;
  sample_id: string;
  sample_location: {
    lat: number;
    lng: number;
  };
  sample_status: string;
  sample_contractor: string;
  sample_type?: string | null;
  has_osm_data: boolean;
}

export interface GroupedRoadsResponse {
  status: string;
  message: string;
  data: {
    roads: GroupedRoad[];
    total: number;
    skip: number;
    limit: number;
    grouped: boolean;
  };
}

export interface RoadImage {
  url: string;
  uploaded_by: string;
  uploaded_at: string;
}

export interface PersonInvolved {
  name: string;
  role: string;
  image?: string;
  contact?: string;
  organization?: string;
}

export interface EditHistoryChange {
  old: string | null;
  new: string | null;
}

export interface EditHistoryEntry {
  edited_by: string;
  edited_at: DateTimeFormat;
  changes: Record<string, EditHistoryChange>;
  action: 'created' | 'updated' | 'approved';
}

export interface EditHistoryResponse {
  status: string;
  message: string;
  data: {
    road_name: string;
    road_slug: string;
    total_edits: number;
    edit_history: EditHistoryEntry[];
  };
}

export interface SegmentEditHistoryResponse {
  status: string;
  message: string;
  data: {
    road_name: string;
    segment_slug: string;
    total_edits: number;
    edit_history: EditHistoryEntry[];
  };
}

export interface MainRoad {
  road_slug: string;
  road_name: string;
  contractor: string;
  approved_by: string;
  total_cost: string;
  promised_completion_date: string;
  actual_completion_date: string;
  maintenance_firm: string;
  status: string;
  type?: string | null;
  images: (string | RoadImage)[];
  people_involved?: PersonInvolved[];
  added_by_user: string;
  approved: boolean;
  extra_fields: Record<string, any>;
  segment_count: number;
  created_at: DateTimeFormat;
  updated_at: DateTimeFormat;
}

export interface MainRoadResponse {
  status: string;
  message: string;
  data: {
    road: MainRoad;
    geojson?: {
      type: 'FeatureCollection';
      features: Array<{
        type: 'Feature';
        geometry: {
          type: 'LineString' | 'Point';
          coordinates: number[][] | [number, number];
        };
        properties: {
          segment_slug: string;
          osm_way_id?: string;
        };
      }>;
    };
  };
}

export interface RoadSegmentsResponse {
  status: string;
  message: string;
  data: {
    geojson: {
      type: 'FeatureCollection';
      features: Array<{
        type: 'Feature';
        geometry: {
          type: 'LineString' | 'Point';
          coordinates: number[][] | [number, number];
        };
        properties: {
          segment_slug: string;
          segment_id: string;
          contractor: string;
          status: string;
          type?: string | null;
          total_cost: string;
          promised_completion_date: string;
          actual_completion_date: string;
          approved_by: string;
          maintenance_firm: string;
          has_osm_data: boolean;
          osm_way_id?: string;
          images: string[];
        };
      }>;
    };
    pagination: {
      skip: number;
      limit: number;
      total: number;
    };
  };
}

export interface RoadResponse {
  status: string;
  message: string;
  data: {
    road: Road;
  };
}

export interface RoadSegmentResponse {
  status: string;
  message: string;
  data: {
    geojson: {
      type: 'Feature';
      geometry: {
        type: 'LineString' | 'Point';
        coordinates: number[][] | [number, number];
      };
      properties: {
        id: string;
        road_name: string;
        contractor: string;
        status: string;
        type?: string | null;
        total_cost: string;
        promised_completion_date: string;
        actual_completion_date: string;
        approved_by: string;
        maintenance_firm: string;
        has_osm_data: boolean;
        osm_way_id?: string;
      };
    };
  };
}

export interface FeedbackResponse {
  status: string;
  message: string;
  data: {
    feedback: Feedback[];
    total: number;
    skip: number;
    limit: number;
  };
}

export interface SearchResult {
  display_name: string;
  lat: number;
  lon: number;
  type: string;
  importance: number;
}

export interface SearchResponse {
  status: string;
  message: string;
  data: {
    results: SearchResult[];
  };
}

export interface RoadSearchResult {
  road_name: string;
  road_slug: string;
  segment_count: number;
  location: {
    lat: number;
    lng: number;
  };
  has_osm_data: boolean;
}

export interface RoadSearchResponse {
  status: string;
  message: string;
  data: {
    roads: RoadSearchResult[];
    total: number;
  };
}

export interface StatusOptionsResponse {
  status: string;
  message: string;
  data: {
    status_options: string[];
  };
}

