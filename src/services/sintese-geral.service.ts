import axios from "axios";
import { parseCookies } from "nookies";
import { api } from "./api";

const cookies = parseCookies();
const token = cookies["__session"];

export async function getGeneralSynthesis(
  serie: string,
  year: string,
  edition: string,
  county: string,
  school: string,
  schoolClass: string
) {
  const params = {
    page: 1,
    params: 9999,
    serie,
    year,
    edition,
    county,
    school,
    schoolClass,
  };

  const response = await api.get("/reports/general-synthesis", {
    params,
  });

  return response.data;
}

export async function getGeneralSynthesisCSV(
  serie: string,
  year: string,
  edition: string,
  county: string,
  school: string,
  schoolClass: string
) {
  const params = {
    page: 1,
    params: 9999,
    serie,
    year,
    edition,
    county,
    school,
    schoolClass,
  };

  const response = await api.get("/reports/general-synthesis/csv", {
    params,
  });

  return response;
}

export interface ItemSubject {
  id: number;
  type: string;
  level: string;
  subject: string;
  min: number;
  max: number;
  avg: number;
  optionsReading: string[];
  numberSerie: number;
  items: {
    id: string;
    name: string;
    value: number;
    totalStudents: number;
    countTotalStudents: number;
    fluente: number;
    nao_fluente: number;
    frases: number;
    palavras: number;
    silabas: number;
    nao_leitor: number;
    nao_avaliado: number;
    nao_informado: number;
  }[];
  quests: {
    total: number;
    descriptors: {
      id: number;
      TEG_ORDEM: number;
      description: string;
      cod: string;
    }[];
  };
  students: {
    id: number;
    name: string;
    avg: number;
    level: number;
    type: string;
    quests: {
      id: number;
      letter: string;
      type: string;
      questionId: number;
    }[];
  }[];
  dataGraph: {
    fluente: number;
    nao_fluente: number;
    frases: number;
    palavras: number;
    silabas: number;
    nao_leitor: number;
    nao_avaliado: number;
    nao_informado: number;
  };
}

export interface StudentsAnswers {
  type: string;
  totalStudents: number;
  subject: string;
  quests: {
    total: number;
    descriptors: {
      id: number;
      name: string;
    }[];
  };
  students: {
    id: number;
    name: string;
    avg: number;
    quests: {
      id: number;
      letter: string;
      type: string;
    }[];
  }[];
}

export async function getItensBySubject() {
  const items = [];

  for (let x = 0; x < 10; x++) {
    const item = {
      id: Math.floor(Math.random() * 9999999),
      name: `Escola ${x}`,
      value: Math.floor(Math.random() * 100),
    };

    items.push(item);
  }

  return {
    type: "bar",
    level: "school",
    subject: "Portugues",
    min: 70,
    max: 90,
    avg: 75,
    items,
  };
}
export async function getAnswersStudents(_schoolClass: string) {
  const OPTIONS = ["A", "B", "C", "D"];
  const errors = ["right", "wrong"];
  const niveis = [0, 1, 2, 3, 4];

  const arrayFake = [];
  const quests = [];

  for (let x = 0; x < 24; x++) {
    const quest = {
      id: Math.floor(Math.random() * 9999999),
      name: `${x} Lorem ipsum dolor`,
    };

    quests.push(quest);
  }

  for (let i = 0; i < 15; i++) {
    const _quests = [];
    for (let x = 0; x < 24; x++) {
      const quest = {
        letter: OPTIONS[Math.floor(Math.random() * OPTIONS.length)],
        type: errors[Math.floor(Math.random() * errors.length)],
      };

      _quests.push(quest);
    }
    const person = {
      id: Math.floor(Math.random() * 999999),
      name: `Ester Howard ${i}`,
      _quests,
      avg: Math.floor(Math.random() * 100),
      level: niveis[Math.floor(Math.random() * niveis.length)],
    };
    arrayFake.push(person);
  }

  return {
    totalStudents: 15,
    quests: {
      total: 24,
      descriptor: quests,
    },
    students: arrayFake,
  };
  // return await axios.get("/api/county/all", { params });
}
