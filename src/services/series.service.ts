import { useQuery } from "@tanstack/react-query";
import { api } from "./api";

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
  const params: any = { search, page, limit, order, column, school };
  
  if (active !== undefined) {
    params.active = active;
  }

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
  const params: any = { search, page, limit, order, column, school };
  
  if (active !== undefined) {
    params.active = active;
  }

  const { data, isLoading } = useQuery({
    queryKey: ["series", params],
    queryFn: async () => {
      const response = await api.get("/serie", { params });

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
  const response = await api.post("/serie",  data)
  .then((response) => {
    return response;
  })
  .catch((error) => {
    console.log("error: ", error);
    return {
      status: 400,
      data: {
        message: error.response.data.message,
      },
    };
  });
  return response;
}

export async function editSerie(id: string, data: any) {
  return await api.put(`/serie/${id}`, data)
  .then((response) => {
    return response;
  })
  .catch((error) => {
    console.log("error: ", error);
    return {
      status: 400,
      data: {
        message: error.response.data.message,
      },
    };
  });
}

export async function getSerie(id) {
  return await api.get(`/serie/${id}`);
}

export async function getSerieReport(id) {
  return await api.get(`/serie/reports/${id}`);
}

export function useGetAllSeries(active?: "0" | "1") {
  const { data, isLoading } = useQuery({
    queryKey: ["allSeries", active],
    queryFn: async () => {
      const response = await getAllSeries(active);
      return response.data;
    },
    staleTime: 1000 * 60 * 15,
  });

  return { data, isLoading };
}

export function useGetSerieReport(id) {
  const { data, isLoading } = useQuery({
    queryKey: ["serie_report", id],
    queryFn: async () => {
      const response = await api.get(
        `/serie/reports/${id}`
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
