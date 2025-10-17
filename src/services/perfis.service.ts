import { useQuery } from "@tanstack/react-query";
import { api } from "./api";

export enum RoleProfile {
  SAEV = 'Saev',
  ESTADO = 'Estado',
  MUNICIPIO_ESTADUAL = 'Município: Atuação Estadual',
  MUNICIPIO_MUNICIPAL = 'Município: Atuação Municipal',
  ESCOLA = 'Escola',
}

export async function getAllPerfis() {
  return await api.get("/profiles");
}

export function useGetProfiles(
  search: string,
  page: number,
  limit: number,
  column: string,
  order: string,
  roleProfile: RoleProfile,
  enabled?: boolean
) {
  const params = { search, page, limit, order, column, roleProfile};

  const { data, isLoading } = useQuery({
    queryKey: ["profiles", params],
    queryFn: async () => {
      // const response = await axios.get("/api/county/report", { params });

      const response = await api.get(`/profiles`, {
        params,
      });

      return response.data;
    },
    staleTime: 1000 * 60 * 1, // 1 minutes,
    enabled: enabled
  });

  return {
    data,
    isLoading,
  };
}

export async function getSubPerfis(
  search: string,
  page: number,
  limit: number,
  column: string,
  order: string
) {
  const params = { search, page, limit, order, column };
  const resp = await api.get("/api/sub-perfil", { params });
  return resp;
}

export function useGetAllPerfis() {
  const { data, isLoading } = useQuery({
    queryKey: ["perfis"],
    queryFn: async () => {
      const response = await api.get("/profiles");

      return response.data;
    },
    staleTime: 1000 * 60,
  });

  return {
    data,
    isLoading,
  };
}

export function useGetPerfil(id, enabled) {
  const { data, isLoading } = useQuery({
    queryKey: ["profile", id],
    queryFn: async () => {
      const response = await api.get(`/profiles/${id}`);

      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    enabled: enabled,
  });

  return {
    data,
    isLoading,
  };
}

export async function createPerfil(data: any) {
  const response = await api.post("/profiles", data)
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

export async function editPerfil(id: string, data: any) {
  return await api.put(`/profiles/${id}`, data )
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

export async function getPerfil(id) {
  return await api.get(`/profiles/${id}`)
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
