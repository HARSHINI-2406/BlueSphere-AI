export interface Region {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

export interface OceanObservation {
  id: number;
  region_id: number;
  timestamp: string;
  sst: number;
  chlorophyll: number;
  salinity: number;
  current_u: number;
  current_v: number;
  anomaly_score: number;
  is_anomaly: boolean;
}

export interface FisheriesRecord {
  id: number;
  region_id: number;
  timestamp: string;
  catch_tonnes: number;
  predicted_abundance: number;
  abundance_level: string;
  recommendation: string;
  sst: number;
  chlorophyll: number;
  salinity: number;
}

export interface BiodiversityRecord {
  id: number;
  region_id: number;
  timestamp: string;
  species_name: string;
  category: string; // "Pelagic" | "Demersal" | "Coral" | "Microbial"
  count: number;
  conservation_status: string;
  risk_score: number;
  coral_bleaching_index: number;
  microbial_health_index: number;
}

export interface AIInsight {
  id: number;
  region_id: number;
  timestamp: string;
  category: string;
  content: string;
  confidence: number;
  suggested_action: string;
  risk_level: string;
  time_horizon: string;
}

export interface AbundancePredictRequest {
  sst: number;
  chlorophyll: number;
  salinity: number;
}

export interface AbundancePredictResponse {
  predicted_abundance: number;
  abundance_level: string;
  recommendation: string;
}
