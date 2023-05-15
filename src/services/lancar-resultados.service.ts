import axios from "axios";
import { parseCookies } from "nookies";
import { api } from "./api";

const cookies = parseCookies();
const token = cookies["__session"];
const USU_ID = cookies["USU_ID"];

type Subjects = {
  DIS_NOME: string;
  DIS_TIPO: string;
  TE_SER_ID: string;
  TES_NOME: string;
  TES_ID: string;
  students: {
    ALU_ID: string;
    ALU_AVATAR: string;
    ALU_ESC: {
      ESC_NOME: string;
    };
    ALU_INEP: string;
    ALU_MUN: {
      MUN_NOME: string;
    };
    ALU_NOME: string;
    ALU_SER: {
      SER_NOME: string;
    };
    ALU_TUR: {
      TUR_NOME: string;
      TUR_PERIODO: string;
    };
    answers: {
      ALT_FINALIZADO: number;
      ATR_ALT_ID: string;
      ATR_CERTO: number;
      ATR_RESPOSTA: string;
      ATR_ID: number;
      ATR_MTI_ID: number;
      ATR_TEG_ID: number;
      questionTemplateTEGID: number;
      ALT_JUSTIFICATIVA: string;
      USU_NOME: string;
    }[];
    template: {
      TEG_ID: number;
      TEG_MTI_ID: number;
      TEG_ORDEM: number;
    }[];
  }[];

  total: {
    students: number;
    percentageFinished: string;
    finished: number;
  };
};

export type ReleasesResults = {
  AVA_NOME: string;
  AVM_DT_FIM: string;
  AVM_DT_INICIO: string;
  subjects: Subjects[];
};

export async function getReleasesResults(
  page: number,
  limit: number,
  column: string,
  order: string,
  county: string,
  school: string,
  schoolClass: string,
  status: string,
  edition: string,
  serie: string
) {
  const params = {
    page,
    limit,
    column,
    order,
    county,
    school,
    schoolClass,
    status,
    edition,
    serie,
  };

  const resp = await api.get(`/release-results/edition/${edition}`, { params });
  return resp;
}

export async function sendReleasesResults(results: any) {
  const data = {
    ALT_USU: USU_ID,
    ...results,
  };

  return await api.post("/release-results", data);
}

export async function deleteReleasesResults(results: any) {
  const data = {
    ALT_USU: USU_ID,
    ...results,
  };

  return await api.delete("/release-results", {
    data,
  });
}
