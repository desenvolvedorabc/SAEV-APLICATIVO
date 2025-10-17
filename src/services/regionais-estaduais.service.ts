import { useQuery } from "@tanstack/react-query";
import { api } from "./api";

export enum TypeRegionalEnum {
  ESTADUAL = 'Estadual',
  MUNICIPAL = 'Municipal',
  UNICA = 'Única',
}

export function useGetRegional(id) {
  const { data, isLoading } = useQuery({
    queryKey: ["regional", id],
    queryFn: async () => {
      const response = await api.get(`/regional/${id}`);

      return response.data;
    },
    staleTime: 1000 * 60 * 1, // 1 minutes,
  });

  return {
    data,
    isLoading,
  };
}

export function useGetRegionais(
  search: string,
  page: number,
  limit: number,
  column: string,
  order: string,
  county: number,
  stateId: number,
  type: string,
  enabled = true
) {
  const params = { search, page, limit, order, column, county, stateId, type };

  const { data, isLoading } = useQuery({
    queryKey: ["regionais", params],
    queryFn: async () => {
      const response = await api.get(`/regional`, {
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

export function useGetRegionaisByFilter(
  search: string,
  page: number,
  limit: number,
  column: string,
  order: string,
  county: number,
  stateId: number,
  type: string,
  typeSchool?: string,
  enabled = true
) {
  const params = { search, page, limit, order, column, county, stateId, type, typeSchool };

  const { data, isLoading } = useQuery({
    queryKey: ["regionais-by-filter", params],
    queryFn: async () => {
      const response = await api.get(`/regional/by-filter`, {
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

export async function getExportRegionais(
  search: string,
  page: number,
  limit: number,
  column: string,
  order: string,
  county: number,
  stateId: number,
  type: string
) {
  const params = {
    search,
    page,
    limit,
    order,
    column,
    county,
    stateId,
    type
  };

  const resp = await api
    .get(`/regional/csv`, {
      params,
      responseType: "blob",
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return {
        status: 400,
        data: {
          message: error.response.data.message,
        },
      };
    });

  return resp;
}

export async function createRegionalEstadual(data: any) {
  const response = await api
    .post("/regional/state", data)
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

export async function editRegionalEstadual(id, data: any) {
  const response = await api
    .put(`/regional/state/${id}`, data)
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

export async function createRegionalMunicipal(data: any) {
  const response = await api
    .post("/regional/municipal", data)
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

export async function editRegionalMunicipal(id, data: any) {
  const response = await api
    .put(`/regional/municipal/${id}`, data)
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

export async function createRegionalUnica(data: any) {
  const response = await api
    .post("/regional/single", data)
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

export async function editRegionalUnica(id, data: any) {
  const response = await api
    .put(`/regional/single/${id}`, data)
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