import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { parseCookies } from "nookies";
import { api } from "./api";

const cookies = parseCookies();
const token = cookies["__session"];

export async function getAllPerfis() {
  return await api.get("/profiles/base/all");
}

export function useGetAllPerfis() {
  const { data, isLoading } = useQuery({
    queryKey: ["perfis"],
    queryFn: async () => {
      const response = await axios.get("/api/perfil");

      return response.data;
    },
    staleTime: 1000 * 60,
  });

  return {
    data,
    isLoading,
  };
}

export async function createPerfil(data: any) {
  data = {
    ...data,
    token,
  };
  const response = await axios.post("/api/perfil/create", { data });
  return response;
}

export async function editPerfil(id: string, data: any) {
  data = {
    ...data,
    token,
  };
  return await axios.put(`/api/perfil/edit/${id}`, { data });
}

export async function getPerfil(id) {
  return await api.get(`/profiles/base/${id}`);
}
