import { api } from "./api";

export async function getEvolutionaryLineReading(
  page: number,
  limit: number,
  serie: string,
  year: string,
  isEpvPartner: 0 | 1,
  typeSchool: string,
  stateId: string,
  stateRegionalId: string,
  county: string,
  municipalityOrUniqueRegionalId: string,
  school: string,
  schoolClass: string,
) {
  const params = {
    page,
    limit,
    serie,
    year,
    isEpvPartner,
    typeSchool,
    stateId,
    stateRegionalId,
    municipalityOrUniqueRegionalId,
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
  isEpvPartner: 0 | 1,
  typeSchool: string,
  stateId: string,
  stateRegionalId: string,
  county: string,
  municipalityOrUniqueRegionalId: string,
  school: string,
  schoolClass: string,
) {
  const params = {
    page,
    limit,
    serie,
    year,
    isEpvPartner,
    typeSchool,
    stateId,
    stateRegionalId,
    municipalityOrUniqueRegionalId,
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
