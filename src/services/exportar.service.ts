import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { api } from "./api";
import { parseCookies } from "nookies";

const cookies = parseCookies();
const token = cookies["__session"];

export async function getExportEvaluation(
  stateId: number,
  county: number,
  typeSchool: string,
  year: number,
  edition: string,
  exportFormat: string
) {
  const params = {
    stateId,
    county,
    typeSchool,
    year,
    edition,
    exportFormat,
  };
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL_IMPORT}/microdata/export-evaluation-data`,
    {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
        // Accept: "application/json",
        // "Content-Type": "multipart/form-data",
      },
    }
  );
}

export async function getExportEvaluationDataStandardized(
  stateId: number,
  county: number,
  typeSchool: string,
  year: number,
  edition: string,
  exportFormat: string
) {
  const params = {
    stateId,
    county,
    typeSchool,
    year,
    edition,
    exportFormat,
  };
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL_IMPORT}/microdata/export-evaluation-data-standardized`,
    {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
        // Accept: "application/json",
        // "Content-Type": "multipart/form-data",
      },
    }
  );
}

export async function getExportStudents(
  stateId: number,
  county: number,
  typeSchool: string,
  exportFormat: string
) {
  const params = {
    stateId,
    county,
    typeSchool,
    exportFormat,
  };
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL_IMPORT}/microdata/export-students`,
    {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
        // Accept: "application/json",
        // "Content-Type": "multipart/form-data",
      },
    }
  );
}

export async function getExportInfrequency(
  stateId: number,
  county: number,
  typeSchool: string,
  year: number,
  exportFormat: string
) {
  const params = {
    stateId,
    county,
    typeSchool,
    year,
    exportFormat,
  };
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL_IMPORT}/microdata/export-infrequency`,
    {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
        // Accept: "application/json",
        // "Content-Type": "multipart/form-data",
      },
    }
  );
}

export async function getExportTemplate(
  stateId: number,
  assessmentId: number,
  countyId: number,
  typeSchool: string,
  serieId: number
) {
  const params = {
    stateId,
    assessmentId,
    countyId,
    typeSchool,
    serieId,
  };
  const response = await api
    .get("/microdata/export-evaluation-template", { params })
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

export function useGetHistoryExport(
  page: number,
  limit: number,
  order: string
) {
  const params = {
    page,
    limit,
    order,
  };

  const { data, isLoading } = useQuery({
    queryKey: ["history-export", params],
    queryFn: async () => {
      const response = await api.get(`/microdata`, { params });

      return response.data;
    },
    staleTime: 1000 * 60 * 1, // 1 minutes,
  });

  return {
    data,
    isLoading,
  };
}
