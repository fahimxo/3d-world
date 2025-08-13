import { useState } from "react";
import api from "../config/axios";
import { API_ENDPOINTS } from "../config/endpoint";
import { showToast } from "../config/toastService";

export interface PublicClubFilter {
  sportId?: number;
  sectorId?: number;
  countryId?: number;
  city?: string;
  reimaginedName?: string;
  currentName?: string;
}

export type DataType = {
  id: number;
  reImaginedName: string;
  originalClubName: string;
  lore: string;
  city: string;
  latitude: number;
  longitude: number;
  logoUrl: string;
  videoUrl: string;
  status: number;
  isActive: boolean;
  displayOrder: number;
  sportId: number;
  sportName: string;
  sectorId: number;
  sectorName: string;
  sectorColorCode: string;
  countryId: number;
  countryName: string;
  anthemUrl: string;
  kitImageUrl: string;
  kitVideoUrl: string;
  stadiumImageUrl: string;
  stadiumVideoUrl: string;
  bestPlayerImageUrl: string;
  bestPlayerVideoUrl: string;
  coachImageUrl: string;
  coachVideoUrl: string;
  vehicleImageUrl: string;
  vehicleVideoUrl: string;
  symbolImageUrl: string;
  symbolVideoUrl: string;
  averageRating: number;
  totalRatings: number;
  created: string;
  lastModified: string;
};

export interface PublicClubResult {
  [key: string]: any;
}

export function usePublicClubs() {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClubs = async (filter: PublicClubFilter = {}) => {
    setLoading(true);
    setError(null);
    try {
      const payload = { filter };
      const response = await api.post(
        API_ENDPOINTS.WORLD_MAP.GET_PUBLIC_CLUB,
        payload
      );

      if (response?.code === 0) {
        showToast("با موفقیت انجام شد", "success");

        setData(response?.result || []);
      } else {
        setData([]);
        setError("No data found");
      }
    } catch (err: any) {
      setError(err.message || "Unknown error");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchClubs };
}
