import axios from "axios";
import { parseCookies } from "nookies";

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

export async function getDescriptorReport(serie, year, edition, county, school, schoolClass) {
  const params = {
    token,
    serie,
    year,
    edition,
    county,
    school,
    schoolClass,
  };

  const response = await axios.get("/api/reports/descriptor", { params });

  const items = response.data?.items?.filter((data) => !!data.topics.length);

  return items;
}
