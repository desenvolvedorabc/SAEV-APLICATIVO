import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { parseCookies } from "nookies";

const cookies = parseCookies();
const token = cookies["__session"];

export async function getAllSubjects() {
  const params = { token };

  return await axios.get("/api/subject/all", { params });
}

export function useGetSubjects(
  search: string,
  page: number,
  limit: number,
  column: string,
  order: string
) {
  const params = { token, search, page, limit, order, column };

  const { data, isLoading } = useQuery({
    queryKey: ["subjects", params],
    queryFn: async () => {
      const response = await axios.get("/api/subject", { params });

      return response.data;
    },
    staleTime: 1000 * 60 * 15, // 15 minutes,
  });

  return {
    data,
    isLoading,
  };
}

export async function createSubject(data: any) {
  data = {
    ...data,
    token,
  };
  const response = await axios.post("/api/subject/create", { data });
  return response;
}

export async function editSubject(id: string, data: any) {
  data = {
    ...data,
    token,
  };
  return await axios.put(`/api/subject/edit/${id}`, { data });
}

export async function getSubject(id) {
  return await axios.get(`/api/subject/${id}?token=${token}`);
}
