import axios from "axios";
import { parseCookies } from "nookies";
import { getBase64 } from "src/utils/get-base64";
import { api } from "./api";

const cookies = parseCookies();
const token = cookies["__session"];

export async function getTests(
  search: string,
  page: number,
  limit: number,
  column: string,
  order: string
) {
  const params = { token, search, page, limit, order, column };
  return await axios.get("/api/test", { params });
}

export async function findAllYears() {
  const params = { token };
  return await axios.get("/api/test/all", { params });
}

export async function findYears(ano) {
  const params = { token };
  return await axios.get(`/api/test/years/${ano}`, { params });
}

export async function getAllTests() {
  const params = { token };
  return await axios.get("/api/test/years", { params });
}

export async function createTest(data: any, teste: File, manual: File) {
  data = {
    ...data,
    TES_MAR: !!data?.TES_MAR ? data.TES_MAR : null,
    TES_TEG: !!data?.TES_MAR ? data.TES_TEG : [],
    token,
  };

  const response = await axios.post("/api/test/create", { data });

  if (teste !== null) {
    const result = await getBase64(teste);
    const respTeste = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/tests/file/upload`,
      {
        TES_ID: response.data.TES_ID,
        filename: teste.name,
        base64: result,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  if (manual !== null) {
    const result = await getBase64(manual);

    const respManual = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/tests/manual/upload`,
      {
        TES_ID: response.data.TES_ID,
        filename: manual.name,
        base64: result,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  return response;
}

export async function editTest(
  id: string,
  data: any,
  teste: File,
  manual: File
) {
  if (teste !== null) {
    const result = await getBase64(teste);
    const response = await api.post(`/tests/file/upload`, {
      TES_ID: id,
      filename: teste.name,
      base64: result,
    });

    data.TES_ARQUIVO = response.data;
  }
  data = {
    ...data,
    token,
  };

  if (manual !== null) {
    const result = await getBase64(manual);

    const response = await axios.post(`/tests/manual/upload`, {
      TES_ID: id,
      filename: manual.name,
      base64: result,
    });
    data.TES_MANUAL = response.data;
  }
  data = {
    ...data,
    token,
  };

  const responseUpdate = await axios.put(`/api/test/edit/${id}`, { data });
  return responseUpdate;
}

export async function getTest(id) {
  return await axios.get(`/api/test/${id}?token=${token}`);
}

export async function getTestFile(file) {
  const params = { file };
  return await axios.get(`/api/test/file`, { params });
}

export async function getTestManual(manual) {
  const params = { manual };
  return await axios.get(`/api/test/manual`, { params });
}

export async function getTestHerby(id, idCounty, idSchool) {
  const params = { id, idCounty, idSchool };
  const response = await axios.get(`/api/test/herby/infos`, { params });

  const data = response.data;

  return await axios.post(
    "https://herby-app.ch/api/v1/cartaoDeResposta2",
    data,
    {
      responseType: "arraybuffer",
      headers: {
        Accept: "application/pdf",
      },
    }
  );
}
