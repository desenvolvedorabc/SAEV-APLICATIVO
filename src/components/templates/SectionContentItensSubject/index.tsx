import { useMemo } from "react";
import { ContainerScore } from "src/components/containerScore";
import { GeneralAverage } from "src/components/generalAverage";
import { TableClassSubject } from "src/components/tables/TableClassSubject";
import { ItemSubject } from "src/services/sintese-geral.service";

type Props = {
  orderBy: string;
  listScore: ItemSubject;
  componentRef?: any;
  setOrderListScore: (item: ItemSubject) => void;
  isPdf?: boolean;
};

enum Niveis {
  regional = 'Regionais Estaduais',
  county = "Municípios",
  regionalSchool = 'Regionais Municipais/Únicas',
  school = "Escolas",
  schoolClass = "Turmas",
};

export function SectionContentItensSubject({
  orderBy,
  listScore,
  componentRef,
  isPdf = false,
  }: Props) {
  // Removida lógica de ordenação - agora é feita apenas pelas setas da tabela
  const dataMapping = useMemo(() => {
    return listScore;
  }, [listScore]);

  return (
    <div ref={componentRef}>
      <ContainerScore>
        <GeneralAverage
          title={Niveis[dataMapping?.level]}
          min={dataMapping?.min}
          media={dataMapping?.avg}
          max={dataMapping?.max}
        />
        <TableClassSubject orderBy={orderBy} selectedItem={dataMapping} isPdf={isPdf} />
      </ContainerScore>
    </div>
  );
}
