import axios from "axios";
import { parseCookies } from "nookies";
import { api } from "./api";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Pagination } from "./pagination";

const cookies = parseCookies();
const token = cookies["__session"];

export async function getAllMessages() {
  return await axios.get("/api/message/all");
}

export function useGetTutorsMessage(
  search: string,
  page: number,
  limit: number,
  column: string,
  order: string,
  date: Date = null
) {
  const params = {
    search,
    page,
    limit,
    order,
    column,
    date
  };

  const { data, isLoading } = useQuery({
    queryKey: ["tutor-messages", params],
    queryFn: async () => {
      const response = await api.get("/tutor-messages", { params });

      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes,
  });

  return {
    data,
    isLoading,
  };
}


export async function createMessageTutor(data: any) {
  const response = await api.post("/tutor-messages", data)
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

export async function editMessageTutor(id: string, data: any) {
  data = {
    ...data,
    token,
  };
  return await axios.put(`/api/message/edit/${id}`, { data });
}

export async function deleteMessageTutor(id: string) {
  return await api.delete(`/message-templates/${id}`);
}

export async function getMessageTutor(id) {
  return await api.get(`/tutor-messages/${id}`);
}

export async function getSendMessageTutor({ page, limit, tutorMessageId }) {
  return await api.get(`/send-tutor-messages`, { params: { page, limit, tutorMessageId } });
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

export function useGetMessageTemplates(
  search: string,
  page: number,
  limit: number,
  column: string,
  order: string,
  date: Date = null
) {
  const params = {
    search,
    page,
    limit,
    order,
    column,
    date
  };

  const { data, isLoading } = useQuery({
    queryKey: ["message-templates", params],
    queryFn: async () => {
      const response = await api.get("/message-templates", { params });

      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes,
  });

  return {
    data,
    isLoading,
  };
}

export async function createMessageTemplate(data: any) {
  const response = await api.post("/message-templates", data)
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

export async function editMessageTemplate(id: string, data: any) {
  return await api.patch(`/message-templates/${id}`, data)
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

export async function deleteMessageTemplate(id: string) {
  return await api.delete(`/message-templates/${id}`);
}


export async function getMessageTemplate(id: string) {
  return await api.get(`/message-templates/${id}`);
}

export function useGetMessageTemplate(id: string) {
  const { data, isLoading } = useQuery({
    queryKey: ["message-template", id],
    queryFn: async () => {
      const response = await api.get(`/message-templates/${id}`)
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