import axios from "axios";
import { parseCookies } from "nookies";
import { api } from "./api";

const cookies = parseCookies();
const token = cookies["__session"];

export async function getAllMessages() {
  return await axios.get("/api/message/all");
}

export async function getMessages(
  search: string,
  page: number,
  limit: number,
  column: string,
  order: string
) {
  const params = { token, search, page, limit, column, order };

  return await axios.get("/api/message", { params });
}

export async function createMessage(data: any) {
  const response = await api.post("/messages", data);
  return response;
}

export async function editMessage(id: string, data: any) {
  data = {
    ...data,
    token,
  };
  return await axios.put(`/api/message/edit/${id}`, { data });
}

export async function deleteMessage(id: string) {
  const data = {
    token,
  };
  return await axios.delete(`/api/message/${id}`, { data });
}

export async function getMessage(id) {
  return await axios.get(`/api/message/${id}?token=${token}`);
}
