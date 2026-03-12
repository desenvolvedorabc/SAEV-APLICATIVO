import { useQuery } from "@tanstack/react-query";
import { api } from "./api";

export async function getAllYears() {
  return await api.get("/school-year/all")
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
}

export function useGetYears(
  search: string,
  page: number,
  limit: number,
  column: string,
  order: string,
  status: boolean,
  enabled = true as boolean
) {
  const params = { search, page, limit, order, column, status };

  const { data, isLoading } = useQuery({
    queryKey: ["years", params],
    queryFn: async () => {
      const response = await api.get("/school-year", { params })
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

      return response.data;
    },
    staleTime: 1000 * 60 * 15, // 15 minutes,
    enabled: enabled,
  });

  return {
    data,
    isLoading,
  };
}

export async function createYear(data: any) {
  const response = await api.post("/school-year", data)
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
  return response;
}

export async function editYear(id: string, data: any) {
  return await api.put(`/school-year/${id}`, data)
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
}

export async function getYear(id) {
  return await api.get(`/school-year/${id}`)
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
}
