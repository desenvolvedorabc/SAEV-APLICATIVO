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

export interface Item2 {
  id: number
  name: string
  total: number
  total_percent: number
  races: Race[]
}

export interface Race {
  id: number
  name: string
  total: number
  total_percent: number
  fluente: number
  nao_fluente: number
  frases: number
  palavras: number
  silabas: number
  nao_leitor: number
  nao_avaliado: number
  nao_informado: number
  totalGradesStudents: number
  countPresentStudents: number
}

interface IGetReporRaceParamsProps {
  school?: number
  schoolClass?: number
  year?: string
  county?: number
  serie?: number
}

export async function getReportRace(params: IGetReporRaceParamsProps) {
  const resp = await api
    .get('/reports/report-race', { params })
  
  const data: RootObject = resp.data

  return data
}

export async function getExportReportRace(params: IGetReporRaceParamsProps) {

  const resp = await api
    .get(`/reports/report-race/csv`, {
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