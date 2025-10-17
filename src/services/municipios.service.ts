import { UseInfiniteQueryOptions, UseQueryOptions, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { parseCookies } from "nookies";
import { getBase64 } from "src/utils/get-base64";
import { api } from "./api";
import { Pagination } from "./pagination";

const cookies = parseCookies();
const token = cookies["__session"];

export type IGetCounties = {
  search?: string,
  page?: number,
  limit?: number,
  column?: string,
  order?: string,
  status?: string,
  stateId?: number,
  stateRegionalId?: number,
  active?: "0" | "1",
  enabled?: boolean,
  verifyExistsRegional?: 0 | 1
}

export async function getCounties(
  search: string,
  page: number,
  limit: number,
  column: string,
  order: string,
  status: string,
  stateId: number,
  active?: "0" | "1"
) {
  const params = { search, page, limit, order, status, column, stateId, active };

  // const cache = new CacheControl(ONE_HOUR, "get_api_county");

  // return await cache.get("/api/county", params);
  return await api.get("/counties", { params });
}


export type IGetCountiesPag = {
  search: string,
  limit: number,
  column: string,
  order: string,
  stateId: number,
  active?: "0" | "1",
  isEpvPartner?: 0 | 1
  options?: UseInfiniteQueryOptions<Pagination<any>>
}

export function useGetCountiesPag({
  search,
  limit,
  column,
  order,
  stateId,
  active,
  isEpvPartner,
  options,
}: IGetCountiesPag) {
  const params = { search, limit, order, active, column, stateId, isEpvPartner };

  const query = useInfiniteQuery<Pagination<any>>({
    queryKey: ["counties-pag", search, limit, column, order, active, stateId, isEpvPartner],
    queryFn: async ({ pageParam }) => {
      const response = await api.get("/counties", { params: { ...params, page: pageParam }});
      return response.data;
    },
    staleTime: 1000 * 60 * 1,
    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } = lastPage.meta;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    ...options,
  });

  const flatData = query.data?.pages.map((page) => page.items).flat() ?? [];

  return {
    query,
    flatData,
  };
}

export function useGetCounties({
  search,
  page,
  limit,
  column,
  order,
  active,
  stateId,
  stateRegionalId,
  verifyExistsRegional,
  enabled = true,
}: IGetCounties) {
  const params = { search, page, limit, order, column, active, verifyExistsRegional, stateId, stateRegionalId };

  const { data, isLoading } = useQuery({
    queryKey: ["counties", params],
    queryFn: async () => {
      const response = await api.get("/counties", { params });

      return response.data;
    },
    staleTime: 1000 * 60 * 1, // 1 minutes,
    enabled: enabled,
  });

  return {
    data,
    isLoading,
  };
}

export function useGetCountiesReport(
  search: string,
  page: number,
  limit: number,
  column: string,
  order: string,
  status: string
) {
  const params = { search, page, limit, order, status, column };

  const { data, isLoading } = useQuery({
    queryKey: ["counties_report", params],
    queryFn: async () => {
      // const response = await axios.get("/api/county/report", { params });

      const response = await api.get(`/counties/report`, {
        params,
      });

      return response.data;
    },
    staleTime: 1000 * 60 * 1, // 1 minutes,
  });

  return {
    data,
    isLoading,
  };
}

export async function getAllCounties() {
  return await axios.get("/api/county/all");
}

export async function findAllDistricts() {
  return await axios.get("/api/county/districts");
}

export async function findDistricts(uf) {
  return await axios.get(`/api/county/districts/${uf}`);
}

export async function createCounty(data: any, logo: File, file: File) {
  const response = await api.post("/counties", data)
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

  if (logo !== null) {
    const result = await getBase64(logo);

    const resplogo = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/counties/avatar/upload`,
      {
        MUN_ID: response.data.MUN_ID,
        filename: logo.name,
        base64: result,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  if (file !== null) {
    const result = await getBase64(file);

    const respfile = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/counties/file/upload`,
      {
        MUN_ID: response.data.MUN_ID,
        filename: file.name,
        base64: result,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
  return response;
}


export async function changeShareData(id){
  return await api
    .patch(`/counties/${id}/change-share-data`)
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

export async function editCounty(
  id: string,
  data: any,
  avatar: File,
  file: File
) {
  if (avatar !== null) {
    const result = await getBase64(avatar);

    const respavatar = await api.post(`/counties/avatar/upload`, {
      MUN_ID: id,
      filename: avatar.name,
      base64: result,
    });
  }

  if (file !== null) {
    const result = await getBase64(file);

    const respfile = await api.post(`/counties/file/upload`, {
      MUN_ID: id,
      filename: file.name,
      base64: result,
    });
  }

  const resp = await api
    .put(`/counties/${id}`, data)
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
  return resp;
}

export async function getCounty(id) {
  return await api.get(`/counties/${id}`);
}

export function useGetCounty(id, url = "") {
  const { data, isLoading } = useQuery({
    queryKey: ["county", id],
    queryFn: async () => {
      const response = await api.get(`/counties/${id}`);
      return response.data
    },
    staleTime: 1000 * 60,
  });

  const formattedData = {
    ...data,
    MUN_LOGO_URL: `${url}/counties/avatar/${data?.MUN_LOGO}`,
  };

  return {
    data: formattedData,
    isLoading,
  };
}

export async function getCountyReport(id) {
  return await api.get(`/counties/${id}/report`);
}

export function useGetCountyReport(id, url = "") {
  const { data, isLoading } = useQuery({
    queryKey: ["county-report", id],
    queryFn: async () => {
      const response = await api.get(
        `/counties/${id}/report`
      );

      return {
        ...response.data,
        MUN_LOGO_URL: `${url}/counties/avatar/${data?.MUN_LOGO}`,
      };
    },
    staleTime: 1000 * 60,
  });

  const formattedData = {
    ...data,
    MUN_LOGO_URL: `${url}/counties/avatar/${data?.MUN_LOGO}`,
  };

  return {
    data,
    isLoading,
  };
}
