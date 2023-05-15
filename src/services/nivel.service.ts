import { api } from "./api";

export interface ItemNivelDesempenho {
  id: string;
  name: string;
  nivel: number;
  nivelStage: string;
  descriptors: {
    id: string;
    cod: string;
    description: string;
    value: number;
  }[];
}

export interface DataNivelDesempenho {
  level: string;
  maxValue: number;
  maxPer: number;
  medValue: number;
  medPer: number;
  underValue: number;
  underPer: number;
  minValue: number;
  minPer: number;
  items: ItemNivelDesempenho[];
}

export async function getNivels(
  page: number,
  limit: number,
  order: string,
  serie: string,
  year: string,
  edition: string,
  county: string,
  school: string,
  schoolClass: string
) {
  const params = {
    page,
    limit,
    order,
    serie,
    year,
    edition,
    county,
    school,
    schoolClass,
  };

  let result = await api.get("/reports/municipality-level", { params });

  let newData = {
    items: [],
    meta: result?.data?.meta,
  };

  if (result?.data?.items?.length > 0) {
    if (!schoolClass) {
      result?.data?.items?.map((subject, index) => {
        let mediaNivel = 0;
        const qntItems = subject.items?.length;
        const qntDesc = subject?.items[0]?.descriptors?.length;
        let medias = [];
        for (let i = 0; i < qntDesc; i++) {
          medias.push(0);
        }
        subject?.items?.map((x) => {
          x.value ? (mediaNivel += x.value) : null;
          x.descriptors.map((desc, index) => {
            desc.value ? (medias[index] += desc.value) : null;
          });
        });
        medias = medias.map((x) => Math.round(x / qntItems));
        subject = {
          ...subject,
          media: {
            mediaNivel: Math.round(mediaNivel / qntItems),
            medias: medias,
          },
        };
        newData.items.push(subject);
      });
    } else {
      result?.data?.items?.map((subject) => {
        let mediaNivel = 0;
        const qntItems = subject?.items?.length;
        const qntDesc = subject?.items[0]?.descriptors?.length;
        let medias = [];
        for (let i = 0; i < qntDesc; i++) {
          medias.push(0);
        }
        subject?.items?.map((x) => {
          x.value ? (mediaNivel += x.value) : null;
          x.descriptors.map((desc, index) => {
            desc.value ? (medias[index] += desc.value) : null;
          });
        });
        medias = medias.map((x) => Math.round(x / qntItems));

        const data = subject?.items.reduce((acc, cur) => +acc + cur.value, 0);

        subject = {
          ...subject,
          media: {
            mediaNivel: Math.round(data / subject?.items.length),
            medias: medias,
          },
        };
        newData.items.push(subject);
      });
    }
  } else {
    return null;
  }

  return newData;
}
