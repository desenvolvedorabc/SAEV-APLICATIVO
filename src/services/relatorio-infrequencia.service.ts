import { api } from "./api";

export interface IReportAbsenceProps {
  graph: {
    months: {
      month: number,
      total: number
    }[],
    total_infrequency: number
    total_grouped: number
  },
  data: IDataReportAbsence
}


export interface IDataReportAbsence {
  items: IItemsReportAbsence[],
  meta: IMetaReportAbsence
}

export interface IItemsReportAbsence {
  graph: {
    months: [
      month: number,
      total: number
    ],
    total_grouped: number,
    total_infrequency: number
  },
  id: number,
  name: string,
}

export interface IMetaReportAbsence {
  currentPage: number,
  itemCount: number,
  itemsPerPage: number,
  totalItems: number,
  totalPages: number,
}


export async function getReportAbsences(
  page: number,
  limit: number,
  order: string,
  column: string,
  school: string,
  schoolClass: string,
  year: string,
  county: string,
  serie: string
): Promise<IReportAbsenceProps> {
  const params = {
    page,
    limit,
    order,
    column,
    school,
    schoolClass,
    year,
    county,
    serie
  }

  const response = await api.get("/school-absences/report", { params });
  const data: IReportAbsenceProps = response.data

  return data
}

export async function getExportReportAbsence(
  school: string,
  schoolClass: string,
  year: string,
  county: string,
  serie: string
) {
  const params = {
    school,
    schoolClass,
    year,
    county,
    serie
  };

  const resp = await api
    .get(`/school-absences/report/csv`, {
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
