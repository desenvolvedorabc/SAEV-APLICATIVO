import { useQuery } from "@tanstack/react-query";
import { api } from "./api";

export async function getExportEvaluation(
  county: number,
  year: number,
  edition: string,
  exportFormat: string
) {
  const params = {
    county,
    year,
    edition,
    exportFormat,
  };
  return await api.get("/microdata/export-evaluation-data", { params });
}

export async function getExportStudents(county: number, exportFormat: string) {
  const params = {
    county,
    exportFormat,
  };
  return await api.get("/microdata/export-students", { params });
}

export async function getExportInfrequency(
  county: number,
  year: number,
  exportFormat: string
) {
  const params = {
    county,
    year,
    exportFormat,
  };
  return await api.get("/microdata/export-infrequency", { params });
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
      const response = await api.get("/microdata", { params });

      return response.data;
    },
    staleTime: 1000 * 60 * 1, // 1 minutes,
  });

  return {
    data,
    isLoading,
  };
}
