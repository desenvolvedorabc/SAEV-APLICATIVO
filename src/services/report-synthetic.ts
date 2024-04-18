import { api } from "./api"

export interface RootObject {
  items: SubjectProps[]
}

export interface SubjectProps {
  id: number
  subject: string
  typeSubject: string
  level: string
  items: Item2[]
}

export interface ReadingPercentage {
  fluente: number
  nao_fluente: number
  frases: number
  palavras: number
  silabas: number
  nao_leitor: number
  nao_avaliado: number
  nao_informado: number
}

export interface Item2 {
  id: number
  descriptor: string
  option: string
  options: Options[]
  order: number
  reportReadingCorrect: ReadingPercentage
}

export interface Options {
  id: number
  option: string
  totalCorrect: number
  value: string
}

interface IGetReportSyntheticParams {
  year?: string
  edition?: number
  county?: number
  school?: number
  schoolClass?: number
  serie?: number
}

export async function getReportSynthetic(params: IGetReportSyntheticParams) {
  const resp = await api
    .get('/reports/report-synthetic', { params })
  
  const data: RootObject = resp.data

  return data
}

export async function getExportReportSynthetic(params: IGetReportSyntheticParams) {

  const resp = await api
    .get(`/reports/report-synthetic/csv`, {
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