import { GraphStudentsReading } from "src/components/GraphStudentsReading";
import { TableClassReading } from "src/components/tables/TableClassReading";
import { SectionContentItensSubject } from "src/components/templates/SectionContentItensSubject";
import { ItemSubject } from "src/services/sintese-geral.service";

type PropsSectionPdf = {
  ref?: any;
  itens: ItemSubject[];
  orderBy: string;
};

export function SectionContentItensSubjectPdf({
  ref,
  itens,
  orderBy,
}: PropsSectionPdf) {
  return (
    <>
      {itens?.map((data, index) => {
        if (data.subject !== "Leitura") {
          return (
            <>
              <h3 className="pdf--title">{data.subject}</h3>
              <SectionContentItensSubject
                key={index}
                orderBy={orderBy}
                listScore={data}
                setOrderListScore={() => {}}
              />
            </>
          );
        }
      })}
    </>
  );
}
