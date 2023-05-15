import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { parseCookies } from "nookies";
import { api } from "./api";

const cookies = parseCookies();
const token = cookies["__session"];

export async function getAllNotifications() {
  const params = { token };

  return await axios.get("/api/notification/all", { params });
}

export async function getNotifications(page: number, limit: number) {
  const params = { token, page, limit };

  return await axios.get("/api/notification", { params });
}

export function useGetNotifications(page: number, limit: number) {
  const params = { page, limit };

  const { data, isLoading } = useQuery({
    queryKey: ["notifications", params],
    queryFn: async () => {
      const response = await api.get("/notifications", { params });

      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes,
  });

  return {
    data,
    isLoading,
  };
}

export async function createNotification(data: any) {
  data = {
    ...data,
    token,
  };
  const response = await axios.post("/api/notification/create", { data });
  return response;
}

export async function editNotification(id: string, data: any) {
  data = {
    ...data,
    token,
  };
  return await axios.put(`/api/notification/edit/${id}`, { data });
}

export async function deleteNotification(id: string) {
  const data = {
    token,
  };
  return await axios.delete(`/api/notification/${id}`, { data });
}

export async function getNotification(id) {
  return await axios.get(`/api/notification/${id}?token=${token}`);
}
