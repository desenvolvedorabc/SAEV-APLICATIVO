import axios from "axios";
import { parseCookies } from "nookies";
import { api } from "./api";

const cookies = parseCookies();
const token = cookies["__session"];

export type SubjectDescriptor = {
  subject: string;
  topics: {
    id: string;
    name: string;
    value: number;
    descritores: {
      id: string;
      name: string;
      cod: string;
      value: number;
    }[];
  }[];
};

export async function getDescriptorReport(
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
  schoolClass: string
) {
  const params = {
    page: 1,
    params: 9999,
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
  };

  const response = await api.get("/reports/result-by-descriptors", { params })
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

  const items = response.data?.items?.filter((data) => !!data.topics.length);

  return items;
}
