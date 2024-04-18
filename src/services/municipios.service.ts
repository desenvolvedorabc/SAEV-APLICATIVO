import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { parseCookies } from "nookies";
import CacheControl from "src/utils/cache-request";
import { getBase64 } from "src/utils/get-base64";
import { api } from "./api";

const cookies = parseCookies();
const token = cookies["__session"];
const ONE_HOUR = 60;

export async function getCounties(
  search: string,
  page: number,
  limit: number,
  column: string,
  order: string,
  status: string,
  active?: "0" | "1"
) {
  const params = { search, page, limit, order, status, column, active };

  // const cache = new CacheControl(ONE_HOUR, "get_api_county");

  // return await cache.get("/api/county", params);
  return await api.get("counties", { params });
}

export function useGetCounties(
  search: string,
  page: number,
  limit: number,
  column: string,
  order: string,
  status: string,
  active?: "0" | "1",
  enabled = true as boolean
) {
  const params = { search, page, limit, order, status, column, active };

  const { data, isLoading } = useQuery({
    queryKey: ["counties", params],
    queryFn: async () => {
      const response = await api.get("counties", { params });

      return response.data;
    },
    staleTime: 1000 * 60 * 1, // 1 minutes,
    enabled: enabled,
  });

  return {
    data,
    isLoading,
  };
}

export function useGetCountiesReport(
  search: string,
  page: number,
  limit: number,
  column: string,
  order: string,
  status: string
) {
  const params = { search, page, limit, order, status, column };

  const { data, isLoading } = useQuery({
    queryKey: ["counties_report", params],
    queryFn: async () => {
      // const response = await axios.get("/api/county/report", { params });

      const response = await api.get(`/counties/report`, {
        params,
      });

      return response.data;
    },
    staleTime: 1000 * 60 * 1, // 1 minutes,
  });

  return {
    data,
    isLoading,
  };
}

export async function getAllCounties() {
  return await axios.get("/api/county/all");
}

export async function findAllDistricts() {
  return await axios.get("/api/county/districts");
}

export async function findDistricts(uf) {
  return await axios.get(`/api/county/districts/${uf}`);
}

export async function createCounty(data: any, logo: File, file: File) {
  data = {
    ...data,
    token,
  };
  const response = await axios.post("/api/county/create", { data });
  if (logo !== null) {
    const result = await getBase64(logo);

    const resplogo = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/counties/avatar/upload`,
      {
        MUN_ID: response.data.MUN_ID,
        filename: logo.name,
        base64: result,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  if (file !== null) {
    const result = await getBase64(file);

    const respfile = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/counties/file/upload`,
      {
        MUN_ID: response.data.MUN_ID,
        filename: file.name,
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

export async function editCounty(
  id: string,
  data: any,
  avatar: File,
  file: File
) {
  if (avatar !== null) {
    const result = await getBase64(avatar);

    const respavatar = await api.post(`/counties/avatar/upload`, {
      MUN_ID: id,
      filename: avatar.name,
      base64: result,
    });
  }

  if (file !== null) {
    const result = await getBase64(file);

    const respfile = await api.post(`/counties/file/upload`, {
      MUN_ID: id,
      filename: file.name,
      base64: result,
    });
  }
  data = {
    ...data,
    token,
  };

  const resp = await api
    .put(`/counties/${id}`, data)
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
  return resp;
}

export async function getCounty(id) {
  return await axios.get(`/api/county/${id}?token=${token}`);
}

export function useGetCounty(id, url = "") {
  const { data, isLoading } = useQuery({
    queryKey: ["county", id],
    queryFn: async () => {
      const response = await axios.get(`/api/county/${id}?token=${token}`);

      return response.data;
    },
    staleTime: 1000 * 60,
  });

  const formattedData = {
    ...data,
    MUN_LOGO_URL: `${url}/counties/avatar/${data?.MUN_LOGO}`,
  };

  return {
    data: formattedData,
    isLoading,
  };
}

export function useGetCountyReport(id, url = "") {
  const { data, isLoading } = useQuery({
    queryKey: ["county-report", id],
    queryFn: async () => {
      const response = await axios.get(
        `/api/county/report/${id}`
      );

      return response.data;
    },
    staleTime: 1000 * 60,
  });

  const formattedData = {
    ...data,
    MUN_LOGO_URL: `${url}/counties/avatar/${data?.MUN_LOGO}`,
  };

  return {
    data: formattedData,
    isLoading,
  };
}
