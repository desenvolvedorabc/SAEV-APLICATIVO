import axios from "axios";
import { parseCookies } from "nookies";

const cookies = parseCookies();
const token = cookies["__session"];

export async function getAllAreas() {
  const params = { token };
  return await axios.get("/api/area", { params });
}

export async function getAreasByPerfil(perfil: string) {
  const formattedPerfil = perfil === "Município" ? "Municipio" : perfil;
  const params = { perfil: formattedPerfil };
  return await axios.get("/api/area/perfil", { params });
}

export async function createArea(data: any) {
  data = {
    ...data,
    token,
  };
  const response = await axios.post("/api/area/create", { data });
  return response;
}

export async function editArea(id: string, data: any) {
  data = {
    ...data,
    token,
  };
  return await axios.put(`/api/area/edit/${id}`, { data });
}

export async function getArea(id) {
  return await axios.get(`/api/area/${id}?token=${token}`);
}
