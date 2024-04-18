import PageContainer from "src/components/pageContainer";
import { TopFilterSerie } from "src/components/topFilterSerie";
import { useState, useEffect, useRef } from "react";
import Layout from "src/components/layout";
import type { ReactElement } from "react";
import { ReportFilter } from "src/components/reportFilter";
import { TableAnswers } from "src/components/tables/TableAnswers";
import { TableNotesReading } from "src/components/tables/TableNotesReading";
import { ContainerScore } from "src/components/containerScore";
import { GraphStudentsReading } from "src/components/GraphStudentsReading";
import { TableClassReading } from "src/components/tables/TableClassReading";
import { ReportBreadcrumb } from "src/components/reportBreadcrumb";
import {
  ItemSubject,
  StudentsAnswers,
  getGeneralSynthesis,
  getGeneralSynthesisCSV,
} from "src/services/sintese-geral.service";
import { SectionContentItensSubject } from "src/components/templates/SectionContentItensSubject";
import { useBreadcrumbContext } from "src/context/breadcrumb.context";
import { useGenearePdf } from "src/utils/generatePdf";
import { CSVLink } from "react-csv";
import { withSSRAuth } from "src/utils/withSSRAuth";
import { ContentOptionsExams } from "../src/components/contentOptionsExams/index";
import { FooterTable } from "src/components/tables/TableAnswers/FooterTable";
import { useAuth } from "src/context/AuthContext";

interface DataLeitura {
  NOME: string;
  MATERIA: string;
  NIVEL: string;
}

function createDataLeitura(NOME: string, MATERIA: string, NIVEL: string): DataLeitura {
  return {
    NOME,
    MATERIA,
    NIVEL,
  };
}

interface DataTable {
  NOME_ALUNO: string;
  MATERIA: string;
  MEDIA: number;
  QUESTAO: number;
  RESPOSTA: string;
  ACERTO: string;
  DESCRITOR: string;
}

function createDataTable(
  NOME_ALUNO: string,
  MATERIA: string,
  MEDIA: number,
  QUESTAO: number,
  RESPOSTA: string,
  ACERTO: string,
  DESCRITOR: string
): DataTable {
  return {
    NOME_ALUNO,
    MATERIA,
    MEDIA,
    QUESTAO,
    RESPOSTA,
    ACERTO,
    DESCRITOR,
  };
}

export default function SinteseGeral() {
  const {user} = useAuth()
  const [_answersStudents, setAnswersStudents] = useState<StudentsAnswers>({} as StudentsAnswers);
  const [isLoading, setIsLoading] = useState(false);
  const [examId, setExamId] = useState(undefined);
  const [orderBy, setOrderBy] = useState("porNome");
  const [listScore, setListScore] = useState<ItemSubject>({} as ItemSubject);
  const [items, setItems] = useState<ItemSubject[]>([]);
  const [selectedItem, setSelectedItem] = useState<ItemSubject>({} as ItemSubject);
  const [leituraItem, setLeituraItem] = useState<ItemSubject>({} as ItemSubject);
  const [csv, setCsv] = useState([]);
  const csvLink = useRef(undefined);
  const [level, setLevel] = useState(null);

  const { handlePrint, componentRef } = useGenearePdf();

  const {
    changeSerie,
    changeYear,
    changeCounty,
    changeEdition,
    changeSchool,
    changeSchoolClass,
    serie,
    mapBreadcrumb,
    schoolClass,
    year,
    edition,
    county,
    school,
    resetBreadcrumbs,
    isUpdateData,
    setIsUpdateData,
    hideBreadcrumbs,
    clickBar,
    handleUnClickBar,
    visibleBreadcrumbs,
    handleClickBreadcrumb,
    clickBreadcrumb,
  } = useBreadcrumbContext();

  const loadGeneralSynthesis = async (
    serieLoad,
    yearLoad,
    editionLoad,
    countyLoad,
    schoolLoad,
    schoolClassLoad
  ) => {
    setIsLoading(true);
    const resp = await getGeneralSynthesis(
      serieLoad,
      yearLoad,
      editionLoad,
      countyLoad,
      schoolLoad,
      schoolClassLoad
    );

    setIsLoading(false);

    setItems(resp?.items ?? []);

    let level = "";

    if(!resp?.items)
      return

    if (resp?.items[0]?.level === "school") level = "Escola";
    if (resp?.items[0]?.level === "schoolClass") level = "Turma";
    setLevel(level);

    if (resp?.items[0]?.level === "county") setLevel("county");

    let list = [];
    let tempCsv = [];
    let listCSV = [];

    if (!level) {
      resp?.items?.forEach((x) => {
        if (x.subject === "Leitura") {
          x.students?.forEach((student) => {
            list.push(createDataLeitura(student.name, x.subject, student.type));
          });

          tempCsv.push(["NOME_ALUNO", "MATÉRIA", "NIVEL"]);
          listCSV = JSON.parse(JSON.stringify(list));
          listCSV.forEach((item) => {
            tempCsv.push(Object.values(item));
          });
          tempCsv.push([]);
          tempCsv.push([]);
          tempCsv.push([]);
        } else {
          x.students?.forEach((student) => {
            student?.quests?.forEach((item, index) => {
              let descritor = x.quests.descriptors[index];
              let type = item.type === "right" ? "certo" : "errado";
              list.push(
                createDataTable(
                  student.name,
                  x.subject,
                  student.avg,
                  index,
                  item.letter,
                  type,
                  descritor?.description
                )
              );
            });
          });

          tempCsv.push([
            "NOME_ALUNO",
            "MATÉRIA",
            "MÉDIA",
            "QUESTÃO",
            "RESPOSTA",
            "ACERTO",
            "DESCRITOR",
          ]);
          listCSV = JSON.parse(JSON.stringify(list));
          listCSV.forEach((item) => {
            tempCsv.push(Object.values(item));
          });
          tempCsv.push([]);
          tempCsv.push([]);
          tempCsv.push([]);
        }

        listCSV = [];
        list = [];
      });
    }

    setCsv(tempCsv);
  };

  const downloadCsv = async () => {
    if (level) {
      const _school = mapBreadcrumb.find((data) => data.level === "school");
      const _schoolClass = mapBreadcrumb.find((data) => data.level === "schoolClass");
      const _mun = mapBreadcrumb.find((data) => data.level === "county");
      const _year = mapBreadcrumb.find((data) => data.level === "year");
      const _edition = mapBreadcrumb.find((data) => data.level === "edition");

      const resp = await getGeneralSynthesisCSV(
        serie?.SER_ID,
        _year?.id,
        _edition?.id,
        _mun?.id,
        _school?.id,
        _schoolClass?.id
      );

      setCsv(resp.data);
    }

    csvLink.current.link.click();
  };

  useEffect(() => {
    resetBreadcrumbs();
    handleUnClickBar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const findItem = items.find((data) => data.id === examId);

    setSelectedItem(findItem ?? ({} as ItemSubject));

    const findLeitura = items.find((data) => data.subject === "Leitura");

    setLeituraItem(findLeitura ?? ({} as ItemSubject));
  }, [examId, items]);

  useEffect(() => {
    if (isUpdateData || clickBar || visibleBreadcrumbs) {
      const _school = mapBreadcrumb.find((data) => data.level === "school");
      const _schoolClass = mapBreadcrumb.find((data) => data.level === "schoolClass");
      const _mun = mapBreadcrumb.find((data) => data.level === "county");
      const _year = mapBreadcrumb.find((data) => data.level === "year");
      const _edition = mapBreadcrumb.find((data) => data.level === "edition");

      if (!!_year?.id) {
        loadGeneralSynthesis(
          serie?.SER_ID,
          _year?.id,
          _edition?.id,
          _mun?.id,
          _school?.id,
          _schoolClass?.id
        );
      } else {
        setItems([]);
        setSelectedItem({} as ItemSubject);
      }

      handleUnClickBar();
      hideBreadcrumbs();
      setIsUpdateData(false);
    }
  }, [
    year,
    edition,
    handleUnClickBar,
    county,
    setIsUpdateData,
    hideBreadcrumbs,
    mapBreadcrumb,
    clickBar,
    visibleBreadcrumbs,
    isUpdateData,
    serie,
  ]);

  useEffect(() => {
    setExamId((value: number) => (!!value ? value : items[0]?.id));
  }, [items]);

  const handleChangeSerie = (e) => {
    changeSerie(e ? e.target.value : null);
    changeYear(null);
    changeEdition(null);
    changeCounty(null);
    changeSchool(null);
    changeSchoolClass(null);
    resetBreadcrumbs();
    handleUnClickBar();
    handleClickBreadcrumb(null);
  };

  function handleSelectExamId(examId: number) {
    setExamId(examId);
  }

  function handleChangeOrderBy(e) {
    setOrderBy(e.target.id);
  }

  const onPressBreadcrumb = () => {
    handleClickBreadcrumb(!clickBreadcrumb);
  };

  function onDisableReportFilter(): boolean {
    switch (user?.USU_SPE?.SPE_PER?.PER_NOME) {
      case "Município":
        return !(!!county)
      case "Escola":
        return !(!!school)
      case "SAEV":
        return !(!!edition)
      default:
        return false
    }
  }

  return (
    <>
      <PageContainer>
        <TopFilterSerie title={"Síntese Geral >"} serie={serie} changeSerie={handleChangeSerie} />
        <ReportFilter isDisableYear={!serie} isDisable={onDisableReportFilter()} />

        {isLoading ? (
          <div className="d-flex align-items-center flex-column mt-5">
            <div className="spinner-border" role="status"></div>
          </div>
        ) : (
          <section>
            <ReportBreadcrumb onPress={onPressBreadcrumb} />
            {!!items.length && (
              <ContentOptionsExams
                isSchoolClass={!!schoolClass?.id}
                examId={examId}
                handlePrint={handlePrint}
                items={items}
                handleCsv={downloadCsv}
                selectExamId={handleSelectExamId}
                orderBy={orderBy}
                changeOrderBy={handleChangeOrderBy}
              />
            )}

            {!!selectedItem.subject && (
              <>
                {selectedItem.subject !== "Leitura" ? (
                  <>
                    {selectedItem.type !== "table" && (
                      <SectionContentItensSubject
                        orderBy={orderBy}
                        listScore={selectedItem}
                        setOrderListScore={setListScore}
                      />
                    )}

                    {selectedItem.type === "table" && (
                      <TableAnswers order={orderBy} classe={selectedItem} leitura={leituraItem} />
                    )}
                  </>
                ) : (
                  <ContainerScore>
                    <GraphStudentsReading selectedItem={selectedItem} />
                    {selectedItem.type !== "table" ? (
                      <TableClassReading orderBy={orderBy} selectedItem={selectedItem} />
                    ) : (
                      <TableNotesReading orderBy={orderBy} selectedItem={selectedItem} />
                    )}
                  </ContainerScore>
                )}
              </>
            )}
          </section>
        )}

        <GeneratePdfPage
          componentRef={componentRef}
          orderBy={orderBy}
          items={items}
          schoolClass={schoolClass}
          leituraItem={leituraItem}
          serie={serie}
        />
        <CSVLink
          data={csv}
          filename="sintese_geral.csv"
          className="hidden"
          ref={csvLink}
          target="_blank"
        />
      </PageContainer>
    </>
  );
}

function GeneratePdfPage({
  componentRef,
  items,
  leituraItem,
  schoolClass,
  orderBy,
  serie,
}) {
  return (
    <div className="pdf">
      <div ref={componentRef} className="print-container">
        <PageContainer>
          <div className="d-flex justify-content-center mt-3">
            <strong>Serie: {serie?.SER_NOME}</strong>
          </div>
          <ReportBreadcrumb onPress={() => {}} />
          {!schoolClass ? (
            <>
              {items.map((item, index) => (
                <>
                  {String(item.subject).toLowerCase() !== "leitura" ? (
                    <>
                      <h3 className="pdf--title">{item.subject}</h3>

                      <SectionContentItensSubject
                        key={index}
                        orderBy={orderBy}
                        listScore={item}
                        setOrderListScore={() => {}}
                      />
                    </>
                  ) : (
                    <>
                      <h3 className="pdf--title">Leitura</h3>

                      <GraphStudentsReading selectedItem={item} />

                      {item.type !== "table" ? (
                        <TableClassReading orderBy={orderBy} selectedItem={item} isPdf={true} />
                      ) : (
                        <TableNotesReading orderBy={orderBy} selectedItem={item} isPdf={true} />
                      )}
                    </>
                  )}
                  <div className="page-break" />
                </>
              ))}
            </>
          ) : (
            <>
              {items.map((item, index) => (
                <>
                  {String(item.subject).toLowerCase() !== "leitura" ? (
                    <>
                      <h3 className="pdf--title">{item.subject}</h3>
                      <FooterTable />

                      <TableAnswers order={orderBy} classe={item} leitura={leituraItem} isPdf={true} />
                      <div className="page-break" />
                      {index !== items.length - 1 &&
                        <div className="page-break" />
                      }
                    </>
                  ) : (
                    <>
                      <h3 className="pdf--title">Leitura</h3>

                      <GraphStudentsReading selectedItem={item} />

                      {item.type !== "table" ? (
                        <TableClassReading orderBy={orderBy} selectedItem={item} isPdf={true} />
                      ) : (
                        <TableNotesReading orderBy={orderBy} selectedItem={item} isPdf={true} />
                      )}
                    </>
                  )}
                  <div className="page-break" />
                </>
              ))}
            </>
          )}
        </PageContainer>
      </div>
    </div>
  );
}

SinteseGeral.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={"Síntese Geral"}>{page}</Layout>;
};

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    return {
      props: {},
    };
  },
  {
    roles: ["REL", "SINT_GER"],
  }
);
