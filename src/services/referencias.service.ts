import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { parseCookies } from "nookies";

const cookies = parseCookies();
const token = cookies["__session"];

export async function getReferences(
  search: string,
  page: number,
  limit: number,
  column: string,
  order: string,
  subject: string,
  serie: string,
  active?: "0" | "1"
) {
  const params = {
    token,
    search,
    page,
    limit,
    order,
    column,
    subject,
    serie,
    active,
  };
  return await axios.get("/api/referencia", { params });
}

export function useGetReferences(
  search: string,
  page: number,
  limit: number,
  column: string,
  order: string,
  subject: string,
  serie: string,
  active?: "0" | "1"
) {
  const params = {
    token,
    search,
    page,
    limit,
    order,
    column,
    subject,
    serie,
    active,
  };

  const { data, isLoading } = useQuery({
    queryKey: ["references", params],
    queryFn: async () => {
      const response = await axios.get("/api/referencia", { params });

      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes,
  });

  return {
    data,
    isLoading,
  };
}

export async function getAllSeries() {
  const params = { token };
  return await axios.get("/api/serie/all", { params });
}

export async function getAllDisciplinas() {
  const params = { token };
  return await axios.get("/api/disciplina", { params });
}

export async function getAllReferences() {
  const params = { token };
  return await axios.get("/api/referencia/all", { params });
}

export async function createReference(data: any) {
  data = {
    ...data,
    token,
  };
  const response = await axios.post("/api/referencia/create", { data });
  return response;
}

export async function editReference(id: string, data: any) {
  data = {
    ...data,
    token,
  };
  const resp = await axios.put(`/api/referencia/edit/${id}`, { data });
  return resp;
}

export async function getReference(id) {
  return await axios.get(`/api/referencia/${id}?token=${token}`);
}

export async function setActiveDescriptors(id) {
  return await axios.put(`/api/descriptor/active/${id}?token=${token}`);
}
