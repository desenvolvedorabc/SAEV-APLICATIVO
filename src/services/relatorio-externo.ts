import { useQuery } from "@tanstack/react-query";
import { api } from "./api";

export function useGetExternalReport(
  search: string,
  page: number,
  limit: number,
  column: string,
  order: string,
  status: string,
  enabled = true as boolean
) {
  const params = { search, page, limit, order, column, status };

  const { data, isLoading } = useQuery({
    queryKey: ["external-reports", params],
    queryFn: async () => {
      const response = await api
        .get("/external-reports", { params })
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

export async function createExternalReport(data: any) {
  return await api
    .post("/external-reports", data)
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

export async function editExternalReport(id: string, data: any) {
  return await api
    .patch(`/external-reports/${id}`, data)
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

export async function activeExternalReport(id: string) {
  return await api
    .put(`/external-reports/${id}/toggle-active`)
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

export async function getExternalReport(id) {
  return await api
    .get(`/external-reports/${id}`)
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
