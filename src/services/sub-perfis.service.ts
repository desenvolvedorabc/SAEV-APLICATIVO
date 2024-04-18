import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { parseCookies } from "nookies";
import { api } from "./api";

const cookies = parseCookies();
const token = cookies["__session"];

export async function getSubPerfis(
  search: string,
  page: number,
  limit: number,
  column: string,
  order: string
) {
  const params = { token, search, page, limit, order, column };
  const resp = await axios.get("/api/sub-perfil", { params });
  return resp;
}

export async function getAllSubPerfis() {
  const params = { token };
  return await axios.get("/api/sub-perfil", { params });
}

export async function createSubPerfil(data: any) {
  data = {
    ...data,
    token,
  };
  const response = await axios.post("/api/sub-perfil/create", { data });
  return response;
}

export async function editSubPerfil(id: string, data: any) {
  data = {
    ...data,
    token,
  };
  return await axios.put(`/api/sub-perfil/edit/${id}`, { data });
}

export async function getSubPerfil(id) {
  return await api.get(`/profiles/sub/${id}`);
}

type Area = {
  ARE_NOME: string;
  ARE_DESCRICAO: string;
  ARE_ID: string;
};

export function useGetSubPerfil(id, enabled) {
  const { data, isLoading } = useQuery<{ AREAS: Area[] }>({
    queryKey: ["sub_perfil", id],
    queryFn: async () => {
      const response = await api.get(`/profiles/sub/${id}`);

      return response.data;
    },
    staleTime: 1000 * 60 * 30,
    enabled: enabled,
  });

  return {
    data,
    isLoading,
  };
}

export function useGetSubBase(id, enabled = true as boolean) {
  const { data, isLoading } = useQuery({
    queryKey: ["sub_perfil_base", id],
    queryFn: async () => {
      const response = await api.get(`/profiles/sub/base/${id}`);

      return response.data;
    },
    staleTime: 1000 * 60 * 30,
    enabled: enabled,
  });

  return {
    data,
    isLoading,
  };
}

export async function getSubBase(id) {
  return await api.get(`/profiles/sub/base/${id}`);
}
