import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { parseCookies } from "nookies";
import { getBase64 } from "src/utils/get-base64";
import { api } from "./api";

const cookies = parseCookies();
const token = cookies["__session"];

export async function getUsers(
  search: string,
  page: number,
  limit: number,
  column: string,
  order: string,
  county: string,
  school: string,
  profileBase: string,
  subProfile: string
) {
  const params = {
    search,
    page,
    limit,
    order,
    column,
    county,
    school,
    profileBase,
    subProfile,
  };
  const resp = await api.get("/users", { params });
  return resp;
}

export function useGetUsers(
  search: string,
  page: number,
  limit: number,
  column: string,
  order: string,
  county: string,
  school: string,
  profileBase: string,
  subProfile: string
) {
  const params = {
    search,
    page,
    limit,
    order,
    column,
    county,
    school,
    profileBase,
    subProfile,
  };

  const { data, isLoading } = useQuery({
    queryKey: ["users", params],
    queryFn: async () => {
      const response = await api.get("/users", { params });

      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes,
  });

  return {
    data,
    isLoading,
  };
}

export async function createUser(data: any, avatar: File) {
  data = {
    ...data,
    token,
  };
  const response = await axios.post("/api/user/create", { data })
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

  if (avatar !== null) {
    const result = await getBase64(avatar);

    const respAvatar = await api.post(`/users/avatar/upload`, {
      USU_ID: response.data.USU_ID,
      filename: avatar.name,
      base64: result,
    });
  }
  return response;
}

export async function editUser(id: string, data: any, avatar: File) {
  const responseUpdate = await api
    .put(`/users/${id}`, data)
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

  if (avatar !== null) {
    const result = await getBase64(avatar);

    const respAvatar = await api.post(`/users/avatar/upload`, {
      USU_ID: id,
      filename: avatar.name,
      base64: result,
    });
  }

  return responseUpdate;
}

export async function getUser(id) {
  return await api.get(`/users/${id}`);
}

export async function resendEmailPassword(id: string) {
  const response = await axios.post(`/api/user/resendEmail/${id}`);
  return response;
}
