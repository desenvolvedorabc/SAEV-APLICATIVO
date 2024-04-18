import axios from "axios";
import { parseCookies } from "nookies";
import { api } from "./api";

const cookies = parseCookies();
const token = cookies["__session"];

export async function getTransfers(
  page: number,
  limit: number,
  school: string,
  county: string,
  order: string,
  status: string,
  student: string
) {
  const params = { page, limit, school, county, order, status, student };
  return await api.get("/transfer", { params });
}

export async function createTransfer(data: any) {
  data = {
    ...data,
    token,
  };
  return await axios.post("/api/transfer/create", { data });
}

export function cancelTransfer(id: string) {
  let data = {
    token,
  };
  axios.delete(`/api/transfer/cancel/${id}`, { data });
}

export async function editTransfer(id: string, data: any) {
  data = {
    ...data,
    token,
  };
  return await axios.put(`/api/transfer/edit/${id}`, { data });
}
