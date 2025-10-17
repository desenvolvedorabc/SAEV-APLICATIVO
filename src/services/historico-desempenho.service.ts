import { api } from "./api";
import { Pagination } from "./pagination";

export async function getPerformanceHistory(
  page: number,
  limit: number,
  serie: string,
  year: string,
  isEpvPartner: 0 | 1,
  stateId: string,
  county: string,
  school: string,
  schoolClass: string
): Promise<Pagination<PerformanceHistoryItem>> {
  const params = {
    page,
    limit,
    serie,
    year,
    isEpvPartner,
    stateId,
    county,
    school,
    schoolClass,
  };

  const response = await api.get("/reports/performance-history", {
    params,
  });

  return response.data;
}

export async function getPerformanceHistoryCSV(
  serie: string,
  year: string,
  isEpvPartner: 0 | 1,
  stateId: string,
  county: string,
  school: string,
  schoolClass: string
) {
  const params = {
    serie,
    year,
    isEpvPartner,
    stateId,
    county,
    school,
    schoolClass,
  };

  const response = await api.get("/reports/performance-history/csv", {
    params,
  });

  return response;
}

export interface PerformanceHistoryItem {
  id: string;
  name: string;
  tests: PerformanceHistoryTest[];
}
export interface PerformanceHistoryTest {
  id: number;
  subject: string;
  students: {
    id: number;
    name: string;
    avg: number;
    type: string;
  }[];
}
