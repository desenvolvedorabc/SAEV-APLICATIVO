import { api } from "./api";

export async function getEvolutionaryLineReading(
  page: number,
  limit: number,
  serie: string,
  year: string,
  county: string,
  school: string,
  schoolClass: string
) {
  const params = {
    page,
    limit,
    serie,
    year,
    county,
    school,
    schoolClass,
  };

  const result = await api.get("/reports/evolutionary-line-of-reading", {
    params,
  });
  return result;
}

export async function getExportEvolutionaryLineReading(
  page: number,
  limit: number,
  serie: string,
  year: string,
  county: string,
  school: string,
  schoolClass: string
) {
  const params = {
    page,
    limit,
    serie,
    year,
    county,
    school,
    schoolClass,
  };

  const result = await api.get("/reports/evolutionary-line-of-reading/csv", {
    params,
    responseType: "blob",
  });
  return result;
}
