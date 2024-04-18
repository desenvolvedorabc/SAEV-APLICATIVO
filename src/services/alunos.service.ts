import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { parseCookies } from "nookies";
import { getBase64 } from "src/utils/get-base64";
import { api } from "./api";

const cookies = parseCookies();
const token = cookies["__session"];

export type Student = {
  ALU_ID: string;
  ALU_AVATAR: string;
  ALU_INEP: string;
  ALU_NOME: string;
  ESC_NOME: string;
  SER_NOME: string;
  TUR_NOME: string;
};

export async function getStudents(
  search: string,
  page: number,
  limit: number,
  column: string,
  order: string,
  county: string,
  school: string,
  status: string,
  serie: string,
  active?: "0" | "1"
) {
  const params = {
    search,
    page,
    limit,
    order,
    column,
    county,
    school,
    status,
    serie,
    active,
  };

  const resp = await api.get("/student", { params });
  return resp;
}


export async function getStudentsGrouping(
  search: string,
  page: number,
  limit: number,
  column: string,
  order: string,
  county: string,
  school: string,
  status: string,
  serie: string,
  active?: "0" | "1"
) {
  const params = {
    search,
    page,
    limit,
    order,
    column,
    county,
    school,
    status,
    serie,
    active,
  };

  const resp = await api.get("/student/with-not-grouped", { params });
  return resp;
}

export async function getStudentsTransfer(
  search: string,
  page: number,
  limit: number,
  column: string,
  order: string,
  school: string,
  active?: "0" | "1"
) {
  const params = {
    search,
    page,
    limit,
    order,
    column,
    school,
    active,
  };

  const resp = await api.get("/student/transfer", { params });
  return resp;
}

export function useGetStudentsTransfer(
  search: string,
  page: number,
  limit: number,
  column: string,
  order: string,
  school: string
) {
  const params = {
    search,
    page,
    limit,
    order,
    column,
    school,
  };

  const { data, isLoading } = useQuery({
    queryKey: ["students-transfer", params],
    queryFn: async () => {
      const response = await api.get("/student/transfer", { params });

      return response.data;
    },
    staleTime: 1000 * 60 * 1, // 1 minutes,
  });

  return {
    data,
    isLoading,
  };
}

export async function getStudentsNames(
  search: string,
  page: number,
  limit: number,
  column: string,
  order: string,
  county: string,
  school: string,
  status: string,
  serie: string
) {
  const params = {
    search,
    page,
    limit,
    order,
    column,
    county,
    school,
    status,
    serie,
  };

  const resp = await api.get("/student/names", { params });
  return resp;
}

export function useGetStudents(
  search: string,
  page: number,
  limit: number,
  column: string,
  order: string,
  county: string,
  school: string,
  status: string,
  serie: string,
  active: string,
) {
  const params = {
    search,
    page,
    limit,
    order,
    column,
    county,
    school,
    status,
    serie,
    active
  };

  const { data, isLoading } = useQuery({
    queryKey: ["students", params],
    queryFn: async () => {
      const response = await api.get("/student", { params });

      return response.data;
    },
    staleTime: 1000 * 60 * 1, // 1 minutes,
  });

  return {
    data,
    isLoading,
  };
}

export async function createStudent(data: any, avatar: File) {
  data = {
    ...data,
  };
  const response = await axios.post("/api/student/create", { data });

  if (avatar !== null) {
    const result = await getBase64(avatar);

    const respAvatar = await api.post(`/student/avatar/upload`, {
      ALU_ID: response.data.ALU_ID,
      filename: avatar.name,
      base64: result,
    });
  }
  return response;
}

export async function editStudent(id: string, data: any, avatar: File) {
  const responseUpdate = await api
    .put(`/student/${id}`, data)
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

    const respAvatar = await api.post(`/student/avatar/upload`, {
      ALU_ID: id,
      filename: avatar.name,
      base64: result,
    });
  }

  return responseUpdate;
}

export async function getStudent(id) {
  const response = await axios.get(`/api/student/${id}`, {
    params: {
      id,
      token,
    },
  });

  return {
    ...response.data,
    ALU_LEITURA: 3,
    ALU_PORTUGUES: 55,
    ALU_MATEMATICA: 76,
    ALU_INFREQUENCIA: 68,
    ALU_NIVEL: 3,
    ALU_AVA: [
      {
        AVA_ID: "ava01",
        AVA_ANO: 2020,
        AVA_NOME: "1.2022",
        AVA_SERIE: "3º Ano EF",
        AVA_LEITURA: "Leitor",
        AVA_PORTUGUES: 44,
        AVA_MATEMATICA: 44,
      },
      {
        AVA_ID: "ava02",
        AVA_ANO: 2020,
        AVA_NOME: "2.2022",
        AVA_SERIE: "3º Ano EF",
        AVA_LEITURA: "Leitor",
        AVA_PORTUGUES: 40,
        AVA_MATEMATICA: 40,
      },
    ],
  };
}

export async function getStudentReports(id) {
  const response = await axios.get(`/api/student/reports/${id}`, {
    params: {
      id,
      token,
    },
  });

  return {
    ...response.data,
    ALU_NIVEL: 0,
    ALU_AVA: [
      {
        AVA_ID: "ava01",
        AVA_ANO: 2020,
        AVA_NOME: "1.2022",
        AVA_SERIE: "3º Ano EF",
        AVA_LEITURA: "Leitor",
        AVA_PORTUGUES: 44,
        AVA_MATEMATICA: 44,
      },
      {
        AVA_ID: "ava02",
        AVA_ANO: 2020,
        AVA_NOME: "2.2022",
        AVA_SERIE: "3º Ano EF",
        AVA_LEITURA: "Leitor",
        AVA_PORTUGUES: 40,
        AVA_MATEMATICA: 40,
      },
    ],
  };
}

export async function getStudentEvaluationHistory(
  id: string,
  page: number,
  limit: number,
  column: string,
  order: string,
  school: string
) {
  const params = {
    token,
    id,
    page,
    limit,
    order,
    column,
    school,
  };

  const resp = await axios.get("/api/student/evaluation-history", { params });
  return resp;
}

export async function getAllPcd() {
  const params = { token };
  return axios.get("/api/student/pcd", { params });
}

export async function getExportStudentsExcel(
  search: string,
  page: number,
  limit: number,
  column: string,
  order: string,
  county: string,
  school: string,
  status: string,
  serie: string,
  active?: "0" | "1"
) {
  const params = {
    search,
    page,
    limit,
    order,
    column,
    county,
    school,
    status,
    serie,
    active,
  };

  const resp = await api
    .get(`/student/generate-csv`, {
      params,
      responseType: "blob",
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return {
        status: 400,
        data: {
          message: "Erro ao gerar excel",
        },
      };
    });

  return resp;
}
