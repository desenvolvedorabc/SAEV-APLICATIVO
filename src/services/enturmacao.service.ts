import axios from "axios";
import { parseCookies } from "nookies";
import { api } from "./api";

const cookies = parseCookies();
const token = cookies["__session"];

export interface ItemSubjectLancamento {
  type: string;
  level: string;
  total_schools: number;
  total_mun: number;
  items: {
    id: string;
    name: string;
    value: number;
  }[];
}

export interface ItemEdition {
  type: string;
  TOTAL_ALUNOS: number;
  TOTAL_MUN: number;
  TOTAL_SCHOOLS: number;
  qntPage: number;
  TOTAL_ENTURMADO: number;
  TOTAL_NAO_ENTURMADO: number;
  itens: {
    id: string;
    name: string;
    grouped: number;
    not_grouped: number;
    total: number;
    inep: number;
    cpf?: string;
    nasc?: string;
    mae?: string;
    type?: string;
  }[];
}

export async function getItensGrouping(
  typeTable: string,
  order: string,
  page: number,
  limit: number,
  serie: string,
  isEpvPartner: 0 | 1,
  typeSchool: string,
  stateId: string,
  stateRegionalId: string,
  county: string,
  municipalityOrUniqueRegionalId: string,
  school: string,
  schoolClass: string,
  search: string,
) {
  let params = {
    page,
    limit,
    order,
    search,
    serie,
    isEpvPartner,
    typeSchool,
    stateId,
    stateRegionalId,
    county,
    municipalityOrUniqueRegionalId,
    school,
    schoolClass,
  };

  const response = await api.get("/reports/grouping", { params });
  console.log('response :', response);

  let formattedData = [];
  let type = typeTable;

  if (!stateRegionalId) {
    formattedData = response?.data?.items?.map((reg) => {
      type='regional'
      return {
        id: reg.id,
        name: reg.name,
        inep: null,
        grouped: reg.TOTAL_ENTURMADO,
        not_grouped: reg.TOTAL_NAO_ENTURMADO,
        total: reg.TOTAL_ALUNOS,
      };
    });
  } else if (!county) {
    formattedData = response?.data?.items?.map((mun) => {
      type='county'
      return {
        id: mun.MUN_ID,
        name: mun.MUN_NOME,
        inep: null,
        grouped: mun.TOTAL_ENTURMADO,
        not_grouped: mun.TOTAL_NAO_ENTURMADO,
        total: mun.TOTAL_ALUNOS,
      };
    });
  } else if (!municipalityOrUniqueRegionalId) {
    formattedData = response?.data?.items?.map((reg) => {
      type = "regionalSchool"
      return {
        id: reg.id,
        name: reg.name,
        inep: null,
        grouped: reg.TOTAL_ENTURMADO,
        not_grouped: reg.TOTAL_NAO_ENTURMADO,
        total: reg.TOTAL_ALUNOS,
      };
    });
  } else {
    formattedData = response?.data?.items?.map((item) => {
      if (!!schoolClass) {
        type = "student";
        return {
          id: item.ALU_ID,
          name: item.ALU_NOME,
          cpf: item?.ALU_CPF,
          mae: item?.ALU_NOME_MAE,
          nasc: item?.ALU_DT_NASC,
        };
      }
      if (!!serie) {
        type = "schoolClass";
        return {
          id: item.TUR_ID,
          name: item.TUR_NOME,
          inep: null,
          grouped: item?.TOTAL_ENTURMADO,
          not_grouped: item?.TOTAL_NAO_ENTURMADO,
          total: item?.TOTAL_ALUNOS,
        };
      } else if (!!school) {
        type = "serie";

        return {
          id: item.SER_ID,
          name: item.SER_NOME,
          inep: item?.ESC_INEP,
          grouped: item?.TOTAL_ENTURMADO,
          not_grouped: item?.TOTAL_NAO_ENTURMADO,
          total: item?.TOTAL_ALUNOS,
        };
      } else if (!!county) {
        type = "school";
        return {
          id: item.ESC_ID,
          name: item.ESC_NOME,
          inep: item?.ESC_INEP,
          grouped: item?.TOTAL_ENTURMADO,
          not_grouped: item?.TOTAL_NAO_ENTURMADO,
          total: item?.TOTAL_ALUNOS,
          type: item?.ESC_TIPO,
        };
      }
    });
  }

  let TOTAL_SCHOOLS = 0;
  let TOTAL_MUN = 0;

  const TOTAL_ALUNOS = response?.data?.totalStudents ?? 0;
  const TOTAL_ENTURMADO = response?.data?.totalGrouped ?? 0;
  const TOTAL_NAO_ENTURMADO = response?.data?.totalNotGrouped ?? 0;

  if (type === "county") {
    TOTAL_SCHOOLS = response?.data?.items?.reduce(
      (acc, obj) => acc + obj?.TOTAL_ESCOLAS,
      0
    );
    TOTAL_MUN = response.data?.meta?.totalItems ?? 0;
  } else if (type === "school") {
    TOTAL_SCHOOLS = response.data?.meta?.totalItems ?? 0;
    TOTAL_MUN = formattedData?.length ? 1 : 0;
  } else {
    TOTAL_SCHOOLS = formattedData?.length ? 1 : 0;
    TOTAL_MUN = formattedData?.length ? 1 : 0;
  }

  const totalPages = response.data?.meta?.totalPages;

  return {
    type,
    qntPage: totalPages,
    TOTAL_SCHOOLS,
    TOTAL_MUN,
    TOTAL_ALUNOS,
    TOTAL_ENTURMADO,
    TOTAL_NAO_ENTURMADO,
    itens: formattedData,
  };
}

export async function createGroup(data: any) {
  data = {
    ...data,
    token,
  };
  const response = await axios.post("/api/grouping/create", { data });
  return response;
}
