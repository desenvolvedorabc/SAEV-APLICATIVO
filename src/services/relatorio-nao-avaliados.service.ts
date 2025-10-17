import { api } from "./api";

export type JustificativasTypes = 'ausencia' | 'nao_participou' | 'recusa' | 'abandono' | 'transferencia' | 'deficiencia'

export interface IExportDataProps {
  items: ExportItem[];
}

export interface ExportItem {
  id:          number;
  subject:     'Leitura' | 'Língua Portuguesa' | 'Matemática' | string;
  typeSubject: string;
  level:       string;
  type:        string;
  items:       ItemProps[];
  min:         number;
  max:         number;
  avg:         null;
  dataGraph:   DataGraph;
}

interface DataGraph {
  recusa:               number;
  ausencia:             number;
  abandono:             number;
  transferencia:        number;
  deficiencia:          number;
  nao_participou:       number;
  total_enturmados:     number;
  total_nao_avaliados:  number;
  total_alunos:         number;
  total_lancados:       number;
}

interface ItemProps {
  id:                    number;
  name:                  string;
  type:                  string;
  countTotalStudents:    number;
  idStudents:            null;
  countStudentsLaunched: number;
  countPresentStudents:  number;
  recusa:                number;
  ausencia:              number;
  abandono:              number;
  transferencia:         number;
  deficiencia:           number;
  nao_participou:        number;
  createdAt:             string;
  updatedAt:             string;
  test:                  Test;
  value:                 number;
}

interface Test {
  TES_ID:             number;
  TES_NOME:           string;
  TES_ANO:            string;
  TES_ATIVO:          boolean;
  TES_ARQUIVO:        string;
  TES_MANUAL:         string;
  TES_DT_CRIACAO:     string;
  TES_DT_ATUALIZACAO: string;
  TES_OLD_ID:         null;
}

export interface SchemaStudentsProps {
  items: ItemStudents[];
}

export interface ItemStudents {
  id:           number;
  subject:      string;
  type:         string;
  quests?:      Quests;
  students:     Student[];
  numberSerie?: number;
  dataGraph?:   DataGraph;
}

export interface DataGraphStudents {
  recusa:           number;
  ausencia:         number;
  abandono:         number;
  transferencia:    number;
  deficiencia:      number;
  nao_participou:   number;
  total_enturmados: number;
  total_alunos:     number;
}

export interface Quests {
  total:       number;
  descriptors: Descriptor[];
}

export interface Descriptor {
  id:          number;
  TEG_ORDEM:   number;
  cod:         string;
  description: string;
}

export interface Student {
  id:             number;
  name:           string;
  justificativa?: JustificativasTypes | null;
  quests?:        Quest[];
  studentTest?:   StudentTest;
  avg?:           number | null;
  type?:          string;
}

export interface Quest {
  id:         number;
  letter:     string;
  type:       Type;
  questionId: number;
}

export enum Type {
  Right = "right",
  Wrong = "wrong",
}

export interface StudentTest {
  ALT_ID:             number;
  ALT_ATIVO:          boolean;
  ALT_FINALIZADO:     boolean;
  ALT_DT_CRIACAO:     string;
  ALT_DT_ATUALIZACAO: string;
  ALT_BY_HERBY:       boolean;
  ALT_BY_EDLER:       boolean;
  ALT_BY_AVA_ONLINE:  boolean;
  ALT_JUSTIFICATIVA:  string;
  ANSWERS_TEST:       AnswersTest[];
}

export interface AnswersTest {
  ATR_ID:           number;
  ATR_RESPOSTA:     string;
  ATR_CERTO:        boolean;
  questionTemplate: QuestionTemplate;
}

export interface QuestionTemplate {
  TEG_ID:               number;
  TEG_RESPOSTA_CORRETA: string;
  TEG_DT_CRIACAO:       string;
  TEG_DT_ATUALIZACAO:   string;
  TEG_ORDEM:            number;
  TEG_OLD_ID:           null;
}

export async function getNotEvaluated(
  serie: string,
  year: string,
  edition: string,
  isEpvPartner: 0 | 1,
  typeSchool: string,
  stateId: string,
  stateRegionalId: string,
  county: string,
  municipalityOrUniqueRegionalId: string,
  school: string,
  schoolClass: string,
) {
  const params = {
    serie,
    year,
    edition,
    isEpvPartner,
    typeSchool,
    stateId,
    stateRegionalId,
    county,
    municipalityOrUniqueRegionalId,
    school,
    schoolClass,
  }


  const response = await api.get("/reports/not-evaluated", { params });
  const data = response.data

  return data
}

export async function getExportReportNotEvaluated(
  serie: string,
  year: string,
  edition: string,
  isEpvPartner: 0 | 1,
  typeSchool: string,
  stateId: string,
  stateRegionalId: string,
  county: string,
  municipalityOrUniqueRegionalId: string,
  school: string,
  schoolClass: string,
) {
  const params = {
    serie,
    year,
    edition,
    isEpvPartner,
    typeSchool,
    stateId,
    stateRegionalId,
    county,
    municipalityOrUniqueRegionalId,
    school,
    schoolClass,
  }

  const resp = await api
    .get(`/reports/not-evaluated/csv`, {
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