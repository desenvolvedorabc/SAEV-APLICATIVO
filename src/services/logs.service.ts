import { api } from "./api";

export async function getLogs(
  search: string,
  page: number,
  limit: number,
  column: string,
  order: string,
  initialDate: string,
  finalDate: string,
  method: string,
  entity: string,
  county: string,
  school: string
) {
  const params = {
    search,
    page,
    limit,
    column,
    order,
    initialDate,
    finalDate,
    method,
    entity,
    county,
    school
  };

  return await api.get("/system-logs", { params });
}

export async function getLog(id) {
  return await api.get(`/system-logs/${id}`);
}
