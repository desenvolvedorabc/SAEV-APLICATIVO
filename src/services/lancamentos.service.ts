import axios from "axios";
import { parseCookies } from "nookies";
import qs from "qs";
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
  series: ItemSubjectLancamento;
  itens: {
    id: string;
    name: string;
    grouped: number;
    reading: number;
    portuguese: number;
    math: number;
    general: number;
    subjects: {
      id: string;
      name: string;
      percentageFinished?: number;
      isRelease?: boolean;
      grouped?: number;
    }[];
    inep: number;
    classe: string;
    reading_type: string;
    portuguese_type: string;
    math_type: string;
    general_type: string;
  }[];
  meta: {
    totalPerPage: number;
    totalItems: number;
    itemCount: number;
    totalPages: number;
  };
}

export async function getItens(
  serie: string[],
  year: string,
  edition: string,
  county: string,
  school: string,
  schoolClass: string
): Promise<ItemEdition> {
  let params = {
    page: 1,
    limit: 999,
    order: "ASC",
    serie: serie?.toString(),
    year,
    edition,
    county,
    school,
    schoolClass,
  };

  const response = await api.get("/reports/releases", {
    params,
  });

  let typeSelect = "edition";
  if (edition) typeSelect = "county";
  if (county) typeSelect = "school";
  if (school) typeSelect = "schoolClass";
  if (schoolClass) typeSelect = "student";

  return {
    type: typeSelect,
    itens: response.data.items,
    meta: response.data.meta,
    series: response.data.series,
  };
}
