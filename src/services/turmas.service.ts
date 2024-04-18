import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { parseCookies } from "nookies";
import CacheControl from "src/utils/cache-request";
import { api } from "./api";

const cookies = parseCookies();
const token = cookies["__session"];
const HALF_HOUR = 30;

export async function getAllSchoolClass() {
  const params = { token };

  const cache = new CacheControl(HALF_HOUR, "get_api_schoolClass_all");

  return await cache.get("/api/schoolClass/all", params);
}

export async function getSchoolClasses(
  search: string,
  page: number,
  limit: number,
  column: string,
  order: string,
  serie: string,
  year: string,
  county: string,
  school: string,
  type: string,
  status: number
) {
  const params = {
    search,
    page,
    limit,
    order,
    column,
    serie,
    year,
    county,
    school,
    type,
    status,
  };

  // const cache = new CacheControl(HALF_HOUR, "get_api_schoolClass");

  return await api.get("/school-class", { params });
}

export function useGetSchoolClasses(
  search: string,
  page: number,
  limit: number,
  column: string,
  order: string,
  year: string,
  county: string,
  school: string,
  serie: string,
  type: string,
  status: number,
  enabled = true as boolean
) {
  const params = {
    search,
    page,
    limit,
    order,
    column,
    year,
    county,
    school,
    serie,
    type,
    status,
  };

  const { data, isLoading } = useQuery({
    queryKey: ["schoolClasses", params],
    queryFn: async () => {
      const response = await api.get("/school-class", { params });

      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes,
    enabled: enabled,
  });

  return {
    data,
    isLoading,
  };
}

export async function createSchoolClass(data: any) {
  const response = await api
    .post("/school-class", data)
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

export async function editSchoolClass(id: string, data: any) {
  const response = await api
    .put(`/school-class/${id}`, data)
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

export async function getSchoolClass(id) {
  return await axios.get(`/api/schoolClass/${id}?token=${token}`);
}

export async function getSerieSchool(idSchool) {
  return await axios.get(`/api/schoolClass/school/${idSchool}?token=${token}`);
}

export async function getSchoolClassSerie(
  idSchool,
  idSerie,
  year,
  active?: "0" | "1",
) {
  const params = {
    active,
    year,
  };

  // const cache = new CacheControl(HALF_HOUR, "get_api_schoolClass_school_serie");

  return await api.get(
    `/school-class/school/${idSchool}/serie/${idSerie}`,
    { params }
  );
}
