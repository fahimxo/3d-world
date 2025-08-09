import { useState } from "react";
import api from "../config/axios";
import { API_ENDPOINTS } from "../config/endpoint";

export interface PublicClubFilter {
  sportId?: number;
  sectorId?: number;
  countryId?: number;
  city?: string;
  reimaginedName?: string;
  currentName?: string;
}

export interface PublicClubResult {
  [key: string]: any;
}

export function usePublicClubs() {
  const [data, setData] = useState<PublicClubResult[] | null>(null);
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
      if (response.data && response.data.code === 0) {
        setData(response.data.result || []);
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
