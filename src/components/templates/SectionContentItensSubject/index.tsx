import { useEffect, useMemo, useRef } from "react";
import { ContainerScore } from "src/components/containerScore";
import { GeneralAverage } from "src/components/generalAverage";
import ScoreBar from "src/components/scoreBar";
import { ItemSubject } from "src/services/sintese-geral.service";

type Props = {
  orderBy: string;
  listScore: ItemSubject;
  componentRef?: any;
  setOrderListScore: (item: ItemSubject) => void;
};

const levels = {
  school: "Escolas",
  schoolClass: "Turma",
};

const getTitle = (level) => {
  if (level === "school") return "Escola";
  if (level === 'schoolClass') return "Turma";
  if (level === "mun") return "Município";
  return "";
};

export function SectionContentItensSubject({
  orderBy,
  listScore,
  componentRef,
}: Props) {
  const dataMapping = useMemo(() => {
    let items = listScore?.items;

    if (orderBy === "menorMedia") {
      items = items?.sort((a, b) => {
        return a.value - b.value;
      });
    } else if (orderBy === "maiorMedia") {
      items = items?.sort((a, b) => {
        return b.value - a.value;
      });
    } else if (orderBy === "porNome") {
      items = items?.sort((a, b) => {
        return ("" + a.name).localeCompare(b.name);
      });
    }

    const data = {
      ...listScore,
      items,
    };

    return data;
  }, [listScore, orderBy]);

  return (
    <div ref={componentRef}>
      <ContainerScore>
        <GeneralAverage
          title={getTitle(dataMapping?.level)}
          min={dataMapping?.min}
          media={dataMapping?.avg}
          max={dataMapping?.max}
        />
        {dataMapping?.items?.map((data) => (
          <ScoreBar key={data.id} item={data} level={listScore?.level} />
        ))}
      </ContainerScore>
    </div>
  );
}
