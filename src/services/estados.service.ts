import { useQuery } from "@tanstack/react-query";
import { api } from "./api";

export function useGetStates() {

  const { data, isLoading } = useQuery({
    queryKey: ["states"],
    queryFn: async () => {
      const response = await api.get("/states");

      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes,
  });

  return {
    data,
    isLoading,
  };
}

export function useGetState(id) {
  const { data, isLoading } = useQuery({
    queryKey: ["state", id],
    queryFn: async () => {
      const response = await api.get(`/states/${id}`);

      return response.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  return {
    data,
    isLoading,
  };
}