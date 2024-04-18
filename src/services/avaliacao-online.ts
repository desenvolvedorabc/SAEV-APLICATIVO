import { useQuery } from "@tanstack/react-query";
import { api } from "./api";

export function useAssessmentsOnline(
  search: string,
  page: number,
  limit: number,
  column: string,
  order: string,
  serie: string
) {
  const params = { search, page, limit, order, column, serie };

  const { data, isLoading } = useQuery({
    queryKey: ["tests-assessments-online", params],
    queryFn: async () => {
      const response = await api.get("/tests/with-assessment-online", {
        params,
      });

      return response.data;
    },
    staleTime: 1000 * 60 * 15, // 15 minutes,
  });

  return {
    data,
    isLoading,
  };
}

export async function getAssessmentOnline(id) {
  const resp = await api
    .get(`/assessment-online/${id}`)
    .then((response) => {
      console.log("response: ", response);
      return response;
    })
    .catch((error) => {
      console.log("error: ", error);
      return {
        status: 401,
        data: {
          message: error.response?.data?.message,
        },
      };
    });
  return resp?.data;
}

export async function createAssessmentOnline(data) {
  const resp = await api
    .post("/assessment-online", data)
    .then((response) => {
      console.log("response: ", response);
      return response;
    })
    .catch((error) => {
      console.log("error: ", error);
      return {
        status: 401,
        data: {
          message: error.response?.data?.message,
        },
      };
    });
  return resp?.data;
}

export async function updateAssessmentOnline(id, data, questionsDelete) {
  const respQuestions = await questionsDelete.map(async (questionId) => {
    const respQuestion = await api
      .delete(`/assessment-online/${questionId}/question`)
      .then((response) => {
        console.log("response: ", response);
        return response;
      })
      .catch((error) => {
        console.log("error: ", error);
        return {
          status: 401,
          data: {
            message: error.response?.data?.message + "question",
          },
        };
      });
    return respQuestion?.data;
  });

  const resp = await api
    .put(`/assessment-online/${id}`, data)
    .then((response) => {
      console.log("response: ", response);
      return response;
    })
    .catch((error) => {
      console.log("error: ", error);
      return {
        status: 401,
        data: {
          message: error.response?.data?.message,
        },
      };
    });
  return resp?.data;
}

export async function toggleActiveAssessmentOnline(id) {
  const resp = await api
    .patch(`/assessment-online/${id}/toggle-active`)
    .then((response) => {
      console.log("response: ", response);
      return response;
    })
    .catch((error) => {
      console.log("error: ", error);
      return {
        status: 401,
        data: {
          message: error.response?.data?.message,
        },
      };
    });
  return resp?.data;
}

export async function deleteAssessmentOnlinePage(id) {
  const resp = await api
    .delete(`/assessment-online/${id}/page`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log("error: ", error);
      return {
        status: 401,
        data: {
          message: error.response?.data?.message,
        },
      };
    });
  return resp?.data;
}

export async function deleteAssessmentOnlineQuestion(id) {
  const resp = await api
    .delete(`/assessment-online/${id}/question`)
    .then((response) => {
      console.log("response: ", response);
      return response;
    })
    .catch((error) => {
      console.log("error: ", error);
      return {
        status: 401,
        data: {
          message: error.response?.data?.message,
        },
      };
    });
  return resp?.data;
}

export async function updateAssessmentOnlineImage(data) {
  const resp = await api
    .post("/assessment-online/upload", data, {
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      console.log("response: ", response);
      return response;
    })
    .catch((error) => {
      console.log("error: ", error);
      return {
        status: 401,
        data: {
          message: error.response.data.message,
        },
      };
    });
  return resp?.data;
}

export function useAssessmentsOnlineStudent(
  search: string,
  page: number,
  limit: number,
  column: string,
  order: string,
  id: string,
  schoolClass: string
) {
  const params = { search, page, limit, order, column, id, schoolClass };

  const { data, isLoading } = useQuery({
    queryKey: ["students-assessments-online", params],
    queryFn: async () => {
      const response = await api.get(`/assessment-online/${id}/students`, {
        params,
      });

      return response.data;
    },
    staleTime: 1000 * 60 * 15, // 15 minutes,
  });

  return {
    data,
    isLoading,
  };
}

export async function realizeAssessmentOnline(data) {
  const resp = await api
    .post(`release-results/assessment-online`, data)
    .then((response) => {
      console.log("response: ", response);
      return response;
    })
    .catch((error) => {
      console.log("error: ", error);
      return {
        status: 401,
        data: {
          message: error.response?.data?.message,
        },
      };
    });
  return resp?.data;
}
