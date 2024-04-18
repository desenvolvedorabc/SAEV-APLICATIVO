import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { parseCookies } from "nookies";
import { getBase64 } from "src/utils/get-base64";
import { api } from "./api";

const cookies = parseCookies();
const token = cookies["__session"];

export async function getTeachers(
  search: string,
  page: number,
  limit: number,
  column: string,
  order: string,
  county: string
) {
  const params = { token, search, page, limit, order, column, county };
  return await axios.get("/api/teacher", { params });
}

export function useGetTeachers(
  search: string,
  page: number,
  limit: number,
  column: string,
  order: string,
  county: string
) {
  const params = { token, search, page, limit, order, column, county };

  const { data, isLoading } = useQuery({
    queryKey: ["teachers", params],
    queryFn: async () => {
      const response = await axios.get("/api/teacher", { params });

      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes,
  });

  return {
    data,
    isLoading,
  };
}

export async function createTeacher(data: any, avatar: File) {
  data = {
    ...data,
    token,
  };
  const response = await axios.post("/api/teacher/create", { data });

  if (avatar !== null) {
    const result = await getBase64(avatar);

    const respAvatar = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/teachers/avatar/upload`,
      {
        PRO_ID: response.data.PRO_ID,
        filename: avatar.name,
        base64: result,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  return response;
}

export async function editTeacher(id: string, data: any, avatar: File) {
  if (avatar !== null) {
    const result = await getBase64(avatar);

    const respAvatar = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/teachers/avatar/upload`,
      {
        PRO_ID: id,
        filename: avatar.name,
        base64: result,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
  data = {
    ...data,
    token,
  };
  return await axios.put(`/api/teacher/edit/${id}`, { data });
}

export async function getTeacher(id, munId) {
  return await axios.get(`/api/teacher/${id}?token=${token}&munId=${munId}`);
}

export async function getAllTeachers() {
  const params = { token };
  return await axios.get("/api/teacher/all", { params });
}

export async function getCountyTeachers(munId) {
  return await axios.get(`/api/teacher/county/${munId}?token=${token}`);
}

export async function getAllGender() {
  const params = { token };
  return await axios.get("/api/teacher/gender", { params });
}

export async function getAllSkin() {
  const params = { token };
  return await axios.get("/api/teacher/skin", { params });
}

export async function getAllFormation() {
  return await api.get("/teachers/formation/all");
}
