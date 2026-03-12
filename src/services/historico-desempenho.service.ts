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
  municipalityOrUniqueRegionalId: string,
  school: string,
  schoolClass: string,
  type: string,
): Promise<Pagination<PerformanceHistoryItem>> {
  let level = "regional";

  const params = {
    page,
    limit,
    serie,
    year,
    isEpvPartner,
    stateId,
    county,
    municipalityOrUniqueRegionalId,
    school,
    schoolClass,
    type,
  };

  if (schoolClass) {
    level = "students";
  } else if (school) {
    level = type === 'general' ? "schoolClass" : 'students';
  } else if (municipalityOrUniqueRegionalId) {
    level = "school";
  }

  const response = await api.get("/reports/performance-history", {
    params,
  });

  return { ...response.data, level };
}

export async function getPerformanceHistoryCSV(
  serie: string,
  year: string,
  isEpvPartner: 0 | 1,
  stateId: string,
  county: string,
  municipalityOrUniqueRegionalId: string,
  school: string,
  schoolClass: string,
  type: string,
) {
  const params = {
    serie,
    year,
    isEpvPartner,
    stateId,
    county,
    municipalityOrUniqueRegionalId,
    school,
    schoolClass,
    type
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
  data: {
    id: number;
    name: string;
    avg: number;
    type: string;
  }[];
}
