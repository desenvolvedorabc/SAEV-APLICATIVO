import { UseInfiniteQueryOptions, UseQueryOptions, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { parseCookies } from "nookies";
import { api } from "./api";
import { Pagination } from "./pagination";

const cookies = parseCookies();
const token = cookies["__session"];
const HALF_HOUR = 30;

export async function getSchools(
  search: string,
  page: number,
  limit: number,
  column: string,
  order: string,
  status: string,
  county: string,
  active?: "0" | "1"
) {
  const params = {
    search,
    page,
    limit,
    order,
    status,
    column,
    county,
    active,
  };

  // const cache = new CacheControl(HALF_HOUR, "get_api_school");

  // return await cache.get("/api/school", params);
  return await api.get("/school", { params });
}

export async function getSchoolsReport(
  search: string,
  page: number,
  limit: number,
  column: string,
  order: string,
  status: string,
  county: string
) {
  const params = { token, search, page, limit, order, status, column, county };

  return await axios.get("/api/school/report", { params });
}

export interface SchoolReportItem {
  ENTURMADOS: number;
  ESC_ATIVO: boolean;
  ESC_ID: number;
  ESC_INEP: string;
  ESC_NOME: string;
  ESC_STATUS: string;
  INFREQUENCIA: number;
}

export function useGetSchoolsReport(
  search: string,
  page: number,
  limit: number,
  column: string,
  order: string,
  active: string,
  county: string,
  options?: UseQueryOptions<Pagination<SchoolReportItem>>
) {
  const params = { search, page, limit, order, active, column, county };

  return useQuery<Pagination<SchoolReportItem>>({
    queryKey: ["schools_report", params],
    queryFn: async () => {
      const response = await api.get("/school/report", { params });
      return response.data;
    },
    staleTime: 1000 * 60 * 1, // 1 minute
    ...options,
  });
}
export interface SchoolItem {
  ESC_ID: number
  ESC_UF: string
  ESC_NOME: string
  ESC_INEP: string
  ESC_CIDADE: string
  ESC_ENDERECO: string
  ESC_NUMERO: string
  ESC_COMPLEMENTO: string
  ESC_BAIRRO: string
  ESC_CEP: string
  ESC_LOGO: string
  ESC_STATUS: string
  ESC_ATIVO: boolean
  ESC_INTEGRAL: boolean
  ESC_DT_CRIACAO: string
  ESC_DT_ATUALIZACAO: string
  ESC_OLD_ID: number
  ESC_MUN: EscMun
  ESC_MUN_ID: number
}

export interface EscMun {
  MUN_ID: number
  MUN_NOME: string
}

export function useGetSchools(
  search: string,
  limit: number,
  column: string,
  order: string,
  active: string,
  county: string,
  options?: UseInfiniteQueryOptions<Pagination<SchoolItem>>
) {
  const params = { search, limit, order, active, column, county };

  const query = useInfiniteQuery<Pagination<SchoolItem>>({
    queryKey: ["schools", search, limit, column, order, active, county],
    queryFn: async ({ pageParam }) => {
      const response = await api.get("/school", { params: { ...params, page: pageParam }});
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

export async function createSchool(data: any) {
  const response = await api
    .post("/school", data)
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

export async function editSchool(id: string, data: any) {
  console.log("id: ", id);
  const response = await api
    .put(`/school/${id}`, data)
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

export async function getSchool(id) {
  return await axios.get(`/api/school/${id}`);
}

export function useGetSchool(id, url = "") {
  const { data, isLoading } = useQuery({
    queryKey: ["school", id],
    queryFn: async () => {
      const response = await axios.get(`/api/school/${id}?token=${token}`);

      return response.data;
    },
    staleTime: 1000 * 60,
  });

  const formattedData = {
    ...data,
    ESC_LOGO_URL: `${url}/school/avatar/${data?.ESC_LOGO}`,
  };

  return {
    data: formattedData,
    isLoading,
  };
}

export function useGetSchoolReport(id, url = "") {
  const { data, isLoading } = useQuery({
    queryKey: ["school-report", id],
    queryFn: async () => {
      const response = await axios.get(`/api/school/report/${id}`);

      return response.data;
    },
    staleTime: 1000 * 60,
  });

  return {
    data,
    isLoading,
  };
}

export async function getAllSchools() {
  return await api.get("/school/all");
}

export async function getSchoolsTransfer(
  search: string,
  page: number,
  limit: number,
  column: string,
  order: string,
  active: string,
  county: string
) {
  const params = { search, page, limit, order, active, column, county };

  return await api.get("/school/transfer", { params });
}

export function useGetSchoolsTransfer(
  search: string,
  page: number,
  limit: number,
  column: string,
  order: string,
  active: string,
  county: string
) {
  const params = { search, page, limit, order, active, column, county };

  const { data, isLoading } = useQuery({
    queryKey: ["schools_transfer", params],
    queryFn: async () => {
      const response = await api.get("/school/transfer", { params });

      return response.data;
    },
    staleTime: 1000 * 60 * 1, // 1 minutes,
  });

  return {
    data,
    isLoading,
  };
}

export async function getAllSchoolsTransfer() {
  return await api.get("/school/all/transfer");
}

export async function getAllTransferSchools() {
  const params = { token };
  return await axios.get("/api/school/transfer", { params });
}

export async function getCountySchools(id) {
  return await axios.get(`/api/school/county/${id}?token=${token}`);
}
