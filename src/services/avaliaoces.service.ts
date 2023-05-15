import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { parseCookies } from "nookies";
import CacheControl from "src/utils/cache-request";
import { api } from "./api";

const cookies = parseCookies();
const token = cookies["__session"];
const HALF_HOUR = 30;

export async function getAssessments(
  search: string,
  page: number,
  limit: number,
  column: string,
  order: string,
  county: string,
  school: string,
  serie: string,
  schoolClass: string
) {
  const params = {
    search,
    page,
    limit,
    order,
    column,
    county,
    school,
    serie,
    schoolClass,
  };

  // const cache = new CacheControl(HALF_HOUR, "get_api_assessment");

  // return cache.get("/api/assessment", params);

  return await api.get("/assessments", { params });
}

export function useGetAssessments(
  search: string,
  page: number,
  limit: number,
  column: string,
  order: string,
  county: string,
  school: string,
  serie: string,
  schoolClass: string,
  year: string,
  enabled = true as boolean
) {
  const params = {
    search,
    page,
    limit,
    order,
    column,
    county,
    school,
    serie,
    schoolClass,
    year,
  };

  const { data, isLoading } = useQuery({
    queryKey: ["assessments", params],
    queryFn: async () => {
      const response = await api.get("/assessments", { params });

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

export function useGetAssessmentsRelease(
  search: string,
  page: number,
  limit: number,
  column: string,
  order: string,
  county: string,
  school: string,
  serie: string,
  schoolClass: string,
  year: string,
  active: string,
  enabled = true as boolean
) {
  const params = {
    search,
    page,
    limit,
    order,
    column,
    county,
    school,
    serie,
    schoolClass,
    year,
    active,
  };

  const { data, isLoading } = useQuery({
    queryKey: ["assessments_release", params],
    queryFn: async () => {
      const response = await api.get("/assessments/release-results", {
        params,
      });

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

export async function getAssessmentsDownload(
  search: string,
  page: number,
  limit: number,
  column: string,
  order: string,
  county: string,
  school: string
) {
  const params = {
    token,
    search,
    page,
    limit,
    order,
    column,
    county,
    school,
  };
  return axios.get("/api/assessment/download", { params });
}

export async function getAllAssessments() {
  return api.get("/assessments/all");
}

export async function createAssessment(data: any) {
  return axios.post("/api/assessment/create", { data });
}

export async function editAssessment(id: string, data: any) {
  return axios.put(`/api/assessment/edit/${id}`, {
    data,
  });
}

export async function getAssessment(id) {
  return axios.get(`/api/assessment/${id}?token=${token}`);
}

export async function getAllYearsAssessments() {
  const params = { token };
  return axios.get("/api/assessment/year/all", { params });
}

export async function getYearAssessment(ano) {
  return axios.get(`/api/assessment/year/${ano}?token=${token}`);
}

export async function prorrogationAssessment(id: string, data: any) {
  return api.put(`/assessments/change-valuation-date/${id}`, data);
}
