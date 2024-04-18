import axios from "axios";
import { parseCookies } from "nookies";
import { api } from "./api";

const cookies = parseCookies();
const token = cookies["__session"];

export async function getImportExports(
  search: string,
  page: number,
  limit: number,
  column: string,
  order: string
) {
  const params = {
    search,
    page,
    limit,
    order,
    column,
  };
  return await axios.get("/api/import-export", { params });
}

export async function ImportStudent(data: FormData) {

  // return await api.post(
  //   `/files/students`,
  //   data,
  //   {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //       Accept: "application/json",
  //       "Content-Type": "multipart/form-data",
  //     },
  //   }
  // );
  return await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL_IMPORT}/files/students`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    }
  );
}

export async function ImportUser(data: FormData) {
  // return await api.post(
  //   `/files/users`,
  //   data,
  //   {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //       Accept: "application/json",
  //       "Content-Type": "multipart/form-data",
  //     },
  //   }
  // );
  return await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL_IMPORT}/files/users`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    }
  );
}
