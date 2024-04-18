import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { parseCookies } from "nookies";
import CacheControl from "src/utils/cache-request";
import { api } from "./api";

const cookies = parseCookies();
const token = cookies["__session"];
const HALF_HOUR = 30;

export async function getAllSeries(active?: "0" | "1") {
  const params = { active };

  return await api.get("/serie/all", { params });

  // const cache = new CacheControl(HALF_HOUR, "get_api_serie_all");

  // return await cache.get("/api/serie/all", params);
}

export async function getSeries(
  search: string,
  page: number,
  limit: number,
  column: string,
  order: string,
  school?: string,
  active?: "0" | "1"
) {
  const params = { token, search, page, limit, order, column, school, active };

  // const cache = new CacheControl(HALF_HOUR, "get_api_serie");

  return await api.get("/serie", { params });
}

export function useGetSeries(
  search: string,
  page: number,
  limit: number,
  column: string,
  order: string,
  school?: string,
  active?: "0" | "1",
  enabled = true as boolean
) {
  const params = { search, page, limit, order, column, school, active };

  const { data, isLoading } = useQuery({
    queryKey: ["series", params],
    queryFn: async () => {
      const response = await axios.get("/api/serie", { params });

      return response.data;
    },
    staleTime: 1000 * 60 * 15, // 15 minutes,
    enabled: enabled,
  });

  return {
    data,
    isLoading,
  };
}

export async function createSerie(data: any) {
  data = {
    ...data,
    token,
  };
  const response = await axios.post("/api/serie/create", { data });
  return response;
}

export async function editSerie(id: string, data: any) {
  data = {
    ...data,
    token,
  };
  return await axios.put(`/api/serie/edit/${id}`, { data });
}

export async function getSerie(id) {
  return await axios.get(`/api/serie/${id}?token=${token}`);
}

export async function getSerieReport(id) {
  return await axios.get(`/api/serie/report/${id}?token=${token}`);
}

export function useGetSerieReport(id) {
  const { data, isLoading } = useQuery({
    queryKey: ["serie_report", id],
    queryFn: async () => {
      const response = await axios.get(
        `/api/serie/report/${id}?token=${token}`
      );

      return response.data;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes,
  });

  return {
    data,
    isLoading,
  };
}
