import PageContainer from "src/components/pageContainer";
import { TopFilterSerie } from "src/components/topFilterSerie";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Layout from "src/components/layout";
import type { ReactElement } from "react";
import { ContentOptionsSubjects } from "src/components/contentOptionsSubjects";
import { ReportFilter } from "src/components/reportFilter";
import { ContainerScore } from "src/components/containerScore";
import { ReportBreadcrumb } from "src/components/reportBreadcrumb";
import { TopicScore } from "src/components/topicScore";
import {
  getDescriptorReport,
  SubjectDescriptor,
} from "src/services/descritores.service";
import { useGenearePdf } from "src/utils/generatePdf";
import { CSVLink } from "react-csv";
import { useBreadcrumbContext } from "src/context/breadcrumb.context";
import { withSSRAuth } from "src/utils/withSSRAuth";
import { useAuth } from "src/context/AuthContext";

interface Data {
  DESCRITOR: string;
  RESULTADO: number;
  TOPICO: string;
  RESULTADO_TOPICO: number;
}

function createData(
  DESCRITOR: string,
  RESULTADO: number,
  TOPICO: string,
  RESULTADO_TOPICO: number
): Data {
  return {
    DESCRITOR,
    RESULTADO,
    TOPICO,
    RESULTADO_TOPICO,
  };
}

export default function ResultadosDescritores() {
  const {user} = useAuth()
  const [subject, setSubject] = useState("Português");
  const [orderBy, setOrderBy] = useState("porNome");
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<SubjectDescriptor[]>([]);
  const [selectItem, setSelectItem] = useState({} as SubjectDescriptor);
  const [csv, setCsv] = useState([]);
  const csvLink = useRef(undefined);
  const [expandAll, setExpandAll] = useState(false);

  const {
    changeSerie,
    changeYear,
    changeCounty,
    changeEdition,
    changeSchool,
    changeSchoolClass,
    serie,
    year,
    edition,
    county,
    school,
    hideBreadcrumbs,
    setIsUpdateData,
    resetBreadcrumbs,
    mapBreadcrumb,
    isUpdateData,
    handleUnClickBar,
    visibleBreadcrumbs,
    handleClickBreadcrumb,
    clickBreadcrumb,
  } = useBreadcrumbContext();

  const { handlePrint, componentRef } = useGenearePdf();

  const loadInfos = async () => {
    setIsLoading(true);
    const year = mapBreadcrumb.find((data) => data.level === "year");
    const edition = mapBreadcrumb.find((data) => data.level === "edition");
    const county = mapBreadcrumb.find((data) => data.level === "county");
    const school = mapBreadcrumb.find((data) => data.level === "school");
    const schoolClass = mapBreadcrumb.find(
      (data) => data.level === "schoolClass"
    );

    const resp: SubjectDescriptor[] = await getDescriptorReport(
      serie?.SER_ID,
      year?.id,
      edition?.id,
      county?.id,
      school?.id,
      schoolClass?.id
    );
    setIsLoading(false);
    setItems(resp ?? []);

    let isExictsSubject = false;
    resp?.forEach((resp) => {
      if (resp.subject === subject) {
        isExictsSubject = true;
      }
    });

    if (!isExictsSubject) {
      setSubject(resp[0]?.subject);
    }
  };

  const downloadCsv = () => {
    csvLink.current.link.click();
  };

  useEffect(() => {
    const findItem = items.find((data) => data.subject === subject);

    if (findItem) {
      let list = [];

      findItem.topics.forEach((item) => {
        item.descritores.forEach((descritor) => {
          list.push(
            createData(descritor.name, descritor.value, item.name, item.value)
          );
        });
      });

      const tempCsv = [];
      tempCsv.push(["DESCRITOR", "RESULTADO", "TÓPICO", "RESULTADO_TÓPICO"]);
      const listCSV = JSON.parse(JSON.stringify(list));
      listCSV.forEach((item) => {
        tempCsv.push(Object.values(item));
      });
      setCsv(tempCsv);

      setSelectItem(findItem);
    } else {
      setSelectItem({} as any);
    }
  }, [subject, items]);

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

  const onPressBreadcrumb = useCallback(() => {
    handleClickBreadcrumb(!clickBreadcrumb);
    setIsUpdateData(true);
  }, [handleClickBreadcrumb, clickBreadcrumb, setIsUpdateData]);

  useEffect(() => {
    if (isUpdateData || visibleBreadcrumbs) {
      loadInfos();

      hideBreadcrumbs();
      setIsUpdateData(false);
    }
  }, [
    visibleBreadcrumbs,
    isUpdateData,
    hideBreadcrumbs,
    setIsUpdateData,
    loadInfos,
  ]);

  useEffect(() => {
    resetBreadcrumbs();
    handleUnClickBar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSelectSubject(type: string) {
    setSubject(type);
  }

  const dataMapping = useMemo(() => {
    let data = selectItem.topics;
    if (orderBy === "menorMedia") {
      data = data?.sort((a, b) => {
        return a.value - b.value;
      });
    } else if (orderBy === "maiorMedia") {
      data = data?.sort((a, b) => {
        return b.value - a.value;
      });
    } else if (orderBy === "porNome") {
      data = data?.sort((a, b) => {
        return ("" + a.name).localeCompare(b.name);
      });
    }

    return data;
  }, [orderBy, selectItem.topics]);

  function handleChangeOrderBy(e) {
    setOrderBy(e.target.id);
  }

  function handleExpandAll() {
    setExpandAll(!expandAll);
  }

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
        <TopFilterSerie
          title={"Resultados Por Descritores >"}
          serie={serie}
          changeSerie={handleChangeSerie}
        />
        <ReportFilter isDisableYear={!serie} isDisable={onDisableReportFilter()} />
        {isLoading ? (
          <div className="d-flex align-items-center flex-column mt-5">
            <div className="spinner-border" role="status"></div>
          </div>
        ) : (
          <>
            <section>
              <ReportBreadcrumb onPress={onPressBreadcrumb} />
              {!!items.length && (
                <ContentOptionsSubjects
                  handlePrint={handlePrint}
                  handleCsv={downloadCsv}
                  subject={subject}
                  selectSubject={handleSelectSubject}
                  items={items}
                  orderBy={orderBy}
                  changeOrderBy={handleChangeOrderBy}
                  leitura={false}
                  expand={true}
                  handleExpandAll={handleExpandAll}
                  expandAll={expandAll}
                />
              )}
              <ContainerScore>
                {dataMapping?.map((topic) => (
                  <>
                    <TopicScore
                      key={topic.id}
                      topico={topic}
                      expandAll={expandAll}
                      orderBy={orderBy}
                    />
                  </>
                ))}
              </ContainerScore>
              <GeneratePdfPage
                componentRef={componentRef}
                selectedItem={selectItem}
                serie={serie}
              />
              <CSVLink
                data={csv}
                filename="resultados_descritores.csv"
                className="hidden"
                ref={csvLink}
                target="_blank"
              />
            </section>
          </>
        )}
      </PageContainer>
    </>
  );
}

function GeneratePdfPage({ componentRef, selectedItem, serie }) {
  return (
    <div className="pdf">
      <div ref={componentRef} className="print-container">
        <PageContainer>
          <div className="d-flex justify-content-center mt-3"><strong>Serie: {serie?.SER_NOME}</strong></div>
          <ReportBreadcrumb onPress={() => {}} />
          <section>
            <h2 className="pdf--title">{selectedItem?.subject}</h2>
            <ContainerScore>
              {selectedItem?.topics?.map((topic) => (
                <TopicScore key={topic.id} topico={topic} expandAll={true} />
              ))}
            </ContainerScore>
          </section>
        </PageContainer>
      </div>
    </div>
  );
}

ResultadosDescritores.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={"Resultados Por Descritores"}>{page}</Layout>;
};

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    return {
      props: {},
    };
  },
  {
    roles: ["REL", "DESC"],
  }
);
