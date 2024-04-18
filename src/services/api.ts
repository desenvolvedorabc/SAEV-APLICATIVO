import axios, { AxiosError, AxiosInstance } from 'axios';
import { parseCookies } from "nookies";
import { signOut } from "src/context/AuthContext";

const cookies = parseCookies();

export function setupAPIClient(): {
  api: AxiosInstance;
} {
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      Authorization: `Bearer ${cookies["__session"]}`,
    },
  });

  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError) => {
      if (
        error?.response?.status === 401 &&
        error?.response?.statusText === 'Unauthorized'
      ) {
        signOut();
      }

      return Promise.reject(error);
    },
  );

  return {
    api,
  };
}

export const { api } = setupAPIClient();
