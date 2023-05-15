import axios from "axios";
import { parseCookies } from "nookies";

const cookies = parseCookies();
const token = cookies["__session"];

export async function getEvolutionaryLine(
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

  const result = await axios.get("/api/reports/evolutionary-line", { params });
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

  let result = await axios.get("/api/reports/evolutionary-line/student", {
    params,
  });
  if (result.data.status === 401) result = null;
  return result;
}
