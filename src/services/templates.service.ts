import axios from "axios";
import { parseCookies } from "nookies";

const cookies = parseCookies();
const token = cookies["__session"];

export async function getAllTemplates() {
  const params = { token };

  return await axios.get("/api/template/all", { params });
}

export async function getTemplates(
  search: string,
  page: number,
  limit: number,
  column: string,
  order: string
) {
  const params = { token, search, page, limit, order, column };

  return await axios.get("/api/template", { params });
}

export async function createTemplate(data: any) {
  data = {
    ...data,
    token,
  };
  const response = await axios.post("/api/template/create", { data });
  return response;
}

export async function editTemplate(id: string, data: any) {
  data = {
    ...data,
    token,
  };
  return await axios.put(`/api/template/edit/${id}`, { data });
}

export async function getTemplate(id) {
  return await axios.get(`/api/template/${id}?token=${token}`);
}
