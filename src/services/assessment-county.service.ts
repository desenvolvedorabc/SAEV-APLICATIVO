import { useQuery } from "@tanstack/react-query";
import { api } from "./api";

export enum TypeAssessmentEnum {
  MUNICIPAL = "MUNICIPAL",
  ESTADUAL = "ESTADUAL",
}

export interface ConfigurePeriod {
  assessmentId: number;
  AVM_DT_INICIO: Date;
  AVM_DT_FIM: Date;
  AVM_DT_DISPONIVEL?: Date;
  AVM_TIPO: TypeAssessmentEnum;
}

export interface AssessmentForCounty {
  assessment: {
    AVA_ID: number;
    AVA_NOME: string;
    AVA_ANO: string;
    AVA_DT_INICIO: Date;
    AVA_DT_FIM: Date;
  };
  county: {
    MUN_ID: number;
    MUN_NOME: string;
    AVM_ID: number;
    AVM_TIPO: TypeAssessmentEnum;
    AVM_DT_INICIO: Date;
    AVM_DT_FIM: Date;
    AVM_DT_DISPONIVEL: Date;
  };
  tests: [
    {
      TES_ID: number;
      TES_NOME: string;
      TES_ANO: string;
      subject: string;
    }
  ];
}

interface AssessmentForCountyResponse {
  data: {
    items: {
      AVA_ID: number;
      AVA_NOME: string;
      AVA_ANO: string;
    }[];
    meta: {
      currentPage: number;
      itemCount: number;
      itemsPerPage: number;
      totalItems: number;
      totalPages: number;
    };
  };
  isLoading?: boolean;
}

export async function getAssessmentsForCounty(
  search: string,
  page: number,
  limit: number,
  year?: string
) {
  const params = {
    search,
    page,
    limit,
    year,
  };

  return await api.get("/assessments/county/available", { params });
}

export function useGetAssessmentsForCounty(
  search: string,
  page: number,
  limit: number,
  year?: string,
  enabled: boolean = true
): AssessmentForCountyResponse {
  const params = {
    search,
    page,
    limit,
    year,
  };

  const { data, isLoading } = useQuery({
    queryKey: ["assessments_for_county", params],
    queryFn: async () => {
      const response = await api.get("/assessments/county/available", {
        params,
      });

      return response.data;
    },
    staleTime: 1000 * 60 * 1,
    enabled,
  });

  return {
    data,
    isLoading,
  };
}

export async function getOneAssessmentForCounty(id: number) {
  return api.get(`/assessments/county/${id}`);
}

export async function configurePeriod(data: ConfigurePeriod) {
  return api.post(`/assessments/county/configure-period`, data);
}
