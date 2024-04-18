import axios from "axios";
import { parseCookies } from "nookies";

const cookies = parseCookies();
const token = cookies["__session"];

export function getAbsences(
  search: string,
  page: number,
  limit: number,
  column: string,
  order: string,
  schoolClass: string,
  year: string,
  month: number
) {
  const params = {
    token,
    search,
    page,
    limit,
    order,
    column,
    schoolClass,
    year,
    month,
  };

  return axios.get("/api/absence", { params });
}

export function saveAbsences(data: any) {
  data = {
    ...[data],
    token,
  };
  return axios.post("/api/absence/create", { data });
}
