import axios from "axios";
import { parseCookies } from "nookies";
import { api } from "./api";

const cookies = parseCookies();
const token = cookies["__session"];

export async function getEvolutionaryLine(
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
  schoolClass: string
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
    county,
    municipalityOrUniqueRegionalId,
    school,
    schoolClass,
  };

  const result = await api.get("/reports/evolutionary-line", { params })
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
  return result;
}

export async function getEvolutionaryLineStudent(
  serie: string,
  year: string,
  idStudent: string
) {
  const params = {
    serie,
    year,
    idStudent,
  };

  let resp = await api.get(`/reports/evolutionary-line-student/${idStudent}/${year}`, {
    params,
  })
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
  if (resp.data.status === 401) resp = null;
  return resp;
}
