import axios from "axios";
import { api } from "./api";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Pagination } from "./pagination";

export enum NotificationRuleType {
  BAIXO_RENDIMENTO = 'Baixo Rendimento',
  EXCESSO_FALTAS = 'Excesso Faltas',
  RESULTADO_TESTE = 'Resultado Teste',
}

export async function getAllMessages() {
  return await axios.get("/api/message/all");
}

export function useGetAutomaticMessage(
  search: string,
  page: number,
  limit: number,
  column: string,
  order: string,
  ruleType: string,
  date: Date = null
) {
  const params = {
    search,
    page,
    limit,
    order,
    column,
    ruleType,
    date
  };

  const { data, isLoading } = useQuery({
    queryKey: ["automatic-messages", params],
    queryFn: async () => {
      const response = await api.get("/automatic-notifications", { params });

      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes,
  });

  return {
    data,
    isLoading,
  };
}

export function useGetAutomaticMessageRules(
  search: string,
  page: number,
  limit: number,
  column: string,
  order: string,
) {
  const params = {
    search,
    page,
    limit,
    order,
    column,
  };

  const { data, isLoading } = useQuery({
    queryKey: ["notification-rules", params],
    queryFn: async () => {
      const response = await api.get("/notification-rules", { params });

      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes,
  });

  return {
    data,
    isLoading,
  };
}

export function useGetSendMessageTutorPag({
  limit,
  tutorMessageId,
  enabled,
  options
}) {
  const params = { limit, tutorMessageId };

  const query = useInfiniteQuery<Pagination<any>>({
    queryKey: ["send_message_tutor_pag", limit, tutorMessageId],
    queryFn: async ({ pageParam }) => {
      const response = await api.get("/send-tutor-messages", { params: { ...params, page: pageParam } });
      return response.data;
    },
    staleTime: 1000 * 60 * 1,
    enabled,
    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } = lastPage.meta;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    ...options,
  });

  const flatData = query.data?.pages.map((page) => page.items).flat() ?? [];

  return {
    query,
    flatData,
  };
}

export async function createNotificationRules(data: any) {
  const response = await api.post("/notification-rules", data)
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

export async function editNotificationRules(id: string, data: any) {
  return await api.put(`/notification-rules/${id}`, data)
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

export async function deleteNotificationRules(id: string) {
  return await api.delete(`/notification-rules/${id}`)
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

export async function activeNotificationRules(id: string) {
  return await api.patch(`/notification-rules/${id}/toggle-active`)
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



export async function getNotificationRules(id: string) {
  return await api.get(`/notification-rules/${id}`);
}

export function useGetNotificationRules(id: string) {
  const { data, isLoading } = useQuery({
    queryKey: ["notification-rule", id],
    queryFn: async () => {
      const response = await api.get(`/notification-rules/${id}`)
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
    staleTime: 1000 * 60 * 5, // 5 minutes,
  });

  return {
    data,
    isLoading,
  };
}