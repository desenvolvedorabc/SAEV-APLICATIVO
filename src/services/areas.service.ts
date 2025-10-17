import axios from "axios";
import { parseCookies } from "nookies";
import { api } from "./api";

const cookies = parseCookies();
const token = cookies["__session"];

export async function getAllAreas() {
  const params = { token };
  return await axios.get("/api/area", { params });
}

export async function getAreasByPerfil(perfil: string) {
  return await api.get(`/area/all/${perfil}`)
  .then((response) => {
    console.log("response: ", response);
    return response;
  })
  .catch((error) => {
    console.log("error: ", error);
    return {
      status: 401,
      data: {
        message: error.response?.data?.message,
      },
    };
  });
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
