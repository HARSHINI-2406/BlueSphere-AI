import { apiClient } from './client';
import {
  Region,
  OceanObservation,
  FisheriesRecord,
  BiodiversityRecord,
  AIInsight,
  AbundancePredictRequest,
  AbundancePredictResponse
} from '../types';

export const getRegions = async (): Promise<Region[]> => {
  const response = await apiClient.get<Region[]>('/ocean/regions');
  return response.data;
};

export const getOceanObservations = async (regionId?: number, days: number = 30): Promise<OceanObservation[]> => {
  const response = await apiClient.get<OceanObservation[]>('/ocean/observations', {
    params: { region_id: regionId, days }
  });
  return response.data;
};

export const getFisheriesRecords = async (regionId?: number, days: number = 30): Promise<FisheriesRecord[]> => {
  const response = await apiClient.get<FisheriesRecord[]>('/fisheries/records', {
    params: { region_id: regionId, days }
  });
  return response.data;
};

export const getBiodiversityRecords = async (regionId?: number, days: number = 30): Promise<BiodiversityRecord[]> => {
  const response = await apiClient.get<BiodiversityRecord[]>('/biodiversity/records', {
    params: { region_id: regionId, days }
  });
  return response.data;
};

export const getAIInsights = async (regionId?: number): Promise<AIInsight[]> => {
  const response = await apiClient.get<AIInsight[]>('/ai-insights/', {
    params: { region_id: regionId }
  });
  return response.data;
};

export const predictFishAbundance = async (payload: AbundancePredictRequest): Promise<AbundancePredictResponse> => {
  const response = await apiClient.post<AbundancePredictResponse>('/predict/', payload);
  return response.data;
};
