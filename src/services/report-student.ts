import axios from "axios";

interface Params {
  assessmentId: string | string[];
  studentId: string | string[];
  token: string | string[]
}

export type ReportStudentDescriptor = {
  id: number;
  cod: string;
  description: string;
  TEG_ORDEM: number;
}

export type ReportStudentData = {
  id: number;
  quests: {
    descriptors: ReportStudentDescriptor[];
    total: number;
  },
  student: {
    ALU_ID: number;
    ALU_NOME: string;
    ESC_NOME: string;
    MUN_NOME: string;
    TUR_NOME: string;
    avg: number;
    type: string;
    quests: {
      id: number;
      letter: string;
      type: string;
      questionId: number;
    }[];
  },
  subject: string;
  type: string;
}


export async function getReportStudent(params: Params) {
  const resp = await axios
    .get(`${process.env.NEXT_PUBLIC_API_URL}/reports/student-result`, {
      params,
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return {
        status: 400,
        data: {
          message: error.response.data.message,
        },
      };
    });

  return resp;
}