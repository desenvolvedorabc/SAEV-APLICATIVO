import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { parseCookies } from "nookies";

const cookies = parseCookies();
const token = cookies["__session"];

export async function getAllYears() {
  const params = { token };

  return await axios.get("/api/year/all", { params });
}

export function useGetYears(
  search: string,
  page: number,
  limit: number,
  column: string,
  order: string,
  status: boolean,
  enabled = true as boolean
) {
  const params = { token, search, page, limit, order, column, status };

  const { data, isLoading } = useQuery({
    queryKey: ["years", params],
    queryFn: async () => {
      const response = await axios.get("/api/year", { params });

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

export async function createYear(data: any) {
  data = {
    ...data,
    token,
  };
  const response = await axios.post("/api/year/create", { data });
  return response;
}

export async function editYear(id: string, data: any) {
  data = {
    ...data,
    token,
  };
  return await axios.put(`/api/year/edit/${id}`, { data });
}

export async function getYear(id) {
  return await axios.get(`/api/year/${id}?token=${token}`);
}
