import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { parseCookies } from "nookies";

const cookies = parseCookies();
const token = cookies["__session"];

export async function getAllPerfis() {
  const params = { token };
  return await axios.get("/api/perfil", { params });
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
  return await axios.get(`/api/perfil/${id}?token=${token}`);
}
