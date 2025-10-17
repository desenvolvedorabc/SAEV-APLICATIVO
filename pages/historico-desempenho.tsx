import PageContainer from "src/components/pageContainer";
import { TopFilterSerie } from "src/components/topFilterSerie";
import { useState, useEffect, useRef } from "react";
import Layout from "src/components/layout";
import type { ReactElement } from "react";
import { ReportFilter } from "src/components/reportFilter";
import { ContainerScore } from "src/components/containerScore";
import { ReportBreadcrumb } from "src/components/reportBreadcrumb";
import { ItemSubject } from "src/services/sintese-geral.service";
import { useBreadcrumbContext } from "src/context/breadcrumb.context";
import { withSSRAuth } from "src/utils/withSSRAuth";
import { useAuth } from "src/context/AuthContext";
import {
  getPerformanceHistory,
  getPerformanceHistoryCSV,
  PerformanceHistoryItem,
} from "src/services/historico-desempenho.service";
import { TableClassReadingPerformanceHistory } from "src/components/tables/TableClassReadingPerformanceHistory";
import {
  Pagination,
  FormSelectStyled,
  ButtonPage,
} from "src/shared/styledTables";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { TableClassAveragesPerformanceHistory } from "src/components/tables/TableClassAveragesPerformanceHistory";
import { PerformanceHistorySubjectTabs } from "src/components/performanceHistorySubjectTabs";
import ButtonWhite from "src/components/buttons/buttonWhite";
import { CSVLink } from "react-csv";

export enum PerfHistoryNiveisReading {
  fluente = "Fluente",
  nao_fluente = "Não Fluente",
  frases = "Frases",
  palavras = "Palavras",
  silabas = "Sílabas",
  nao_leitor = "Não Leitor",
  nao_avaliado = "Não Avaliado",
  nao_informado = "Não Informado",
}

export enum PerfHistoryNiveisObjective {
  maior = "Maior desempenho",
  mediano = "Desempenho Mediano",
  abaixo = "Desempenho Abaixo da Média",
  menor = "Menor Desempenho",
  nao_avaliado = "Não Avaliado",
  nao_informado = "Não Informado",
}

export enum PerfHistoryNiveisReadingColor {
  fluente = "#11312B",
  nao_fluente = "#2D9B82",
  frases = "#51D0B2",
  palavras = "#5A9BD5",
  silabas = "#9DC3E7",
  nao_leitor = "#A4A4A4",
  nao_avaliado = "#666666",
  nao_informado = "#666666",
}

export enum PerfHistoryNiveisObjectiveColor {
  maior = "#3E8277",
  mediano = "#5EC2B1",
  abaixo = "#FAA036",
  menor = "#FF6868",
  nao_avaliado = "#666666",
  nao_informado = "#666666",
}

export default function HistoricoDesempenho() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [subjectId, setSubjectId] = useState(undefined);
  const [items, setItems] = useState<PerformanceHistoryItem[]>([]);
  const [subjectItems, setSubjectItems] = useState<ItemSubject[]>([]);
  const [selectedItem, setSelectedItem] = useState<ItemSubject>(
    {} as ItemSubject
  );

  const [csv, setCsv] = useState([]);
  const csvLink = useRef(undefined);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [qntPage, setQntPage] = useState(1);
  const [disablePrev, setDisablePrev] = useState(true);
  const [disableNext, setDisableNext] = useState(false);

  const {
    changeSerie,
    changeYear,
    changeEpv,
    changeType,
    changeState,
    changeStateRegional,
    changeCounty,
    changeCountyRegional,
    changeEdition,
    changeSchool,
    changeSchoolClass,
    mapBreadcrumb,
    serie,
    epv,
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

  const loadPerformanceHistory = async (
    _page,
    _limit,
    serieLoad,
    yearLoad,
    isEpvPartner,
    stateId,
    countyLoad,
    schoolLoad,
    schoolClassLoad
  ) => {
    setIsLoading(true);
    const resp = await getPerformanceHistory(
      _page,
      _limit,
      serieLoad,
      yearLoad,
      isEpvPartner,
      stateId,
      countyLoad,
      schoolLoad,
      schoolClassLoad
    );

    setIsLoading(false);

    let tests = [];
    for (const item of resp?.items) {
      for (const test of item.tests) {
        if (!tests.find((x) => x.subject === test.subject)) {
          tests.push(test);
        }
      }
    }
    setSubjectItems(tests);
    setItems(resp?.items);
    setQntPage(resp?.meta?.totalPages ?? 1);
  };

  const handleChangePage = (direction) => {
    if (direction === "prev") {
      setPage(page - 1);
    } else {
      setPage(page + 1);
    }
    setIsUpdateData(true);
  };
  const handleChangeLimit = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(parseInt(event.target.value));
    setPage(1);
    setIsUpdateData(true);
  };

  const downloadCsv = async () => {
    const _year = mapBreadcrumb.find((data) => data.level === "year");
    const _state = mapBreadcrumb.find((data) => data.level === "state");
    const _county = mapBreadcrumb.find((data) => data.level === "county");
    const _school = mapBreadcrumb.find((data) => data.level === "school");
    const _schoolClass = mapBreadcrumb.find(
      (data) => data.level === "schoolClass"
    );

    const resp = await getPerformanceHistoryCSV(
      serie?.SER_ID,
      _year?.id,
      epv === "Exclusivo Epv" ? 1 : 0,
      _state?.id,
      _county?.id,
      _school?.id,
      _schoolClass?.id
    );

    setCsv(resp.data);
    csvLink.current.link.click();
  };

  useEffect(() => {
    setDisablePrev(page === 1 ? true : false);
    setDisableNext(page >= qntPage ? true : false);
  }, [qntPage, page]);

  useEffect(() => {
    resetBreadcrumbs();
    handleUnClickBar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const findItem = subjectItems.find((data) => data.id === subjectId);

    setSelectedItem(findItem ?? ({} as ItemSubject));
  }, [subjectId, subjectItems]);

  useEffect(() => {
    if (isUpdateData || clickBar || visibleBreadcrumbs) {
      const _school = mapBreadcrumb.find((data) => data.level === "school");
      const _schoolClass = mapBreadcrumb.find(
        (data) => data.level === "schoolClass"
      );
      const _county = mapBreadcrumb.find((data) => data.level === "county");
      const _year = mapBreadcrumb.find((data) => data.level === "year");
      const _state = mapBreadcrumb.find((data) => data.level === "state");
      const _stateRegional = mapBreadcrumb.find(
        (data) => data.level === "regional"
      );
      const _countyRegional = mapBreadcrumb.find(
        (data) => data.level === "regionalSchool"
      );

      if (!!_school?.id) {
        loadPerformanceHistory(
          page,
          limit,
          serie?.SER_ID,
          _year?.id,
          epv === "Exclusivo Epv" ? 1 : 0,
          _state?.id,
          _county?.id,
          _school?.id,
          _schoolClass?.id
        );
      } else {
        setSubjectItems([]);
        setItems([]);
        setSelectedItem({} as ItemSubject);
      }

      handleUnClickBar();
      hideBreadcrumbs();
      setIsUpdateData(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    mapBreadcrumb,
    handleUnClickBar,
    setIsUpdateData,
    hideBreadcrumbs,
    clickBar,
    visibleBreadcrumbs,
    isUpdateData,
    page,
    limit,
  ]);

  useEffect(() => {
    setSubjectId((value: number) => (!!value ? value : subjectItems[0]?.id));
  }, [subjectItems]);

  const handleChangeSerie = (newValue, add = false) => {
    changeSerie(newValue);
    changeYear(null);
    changeEdition(null);
    changeEpv(null);
    changeType(null);
    changeState(null);
    changeStateRegional(null);
    changeCounty(null);
    changeCountyRegional(null);
    changeSchool(null);
    changeSchoolClass(null);

    if (add) {
      const url = window.location.href.split("?serie=");
      const newUrl = url[0].concat("?serie=" + newValue?.SER_ID);
      window.history.pushState({ path: newUrl }, "", newUrl);
    }

    resetBreadcrumbs();
    handleUnClickBar();
    handleClickBreadcrumb(null);
  };

  const onPressBreadcrumb = () => {
    handleClickBreadcrumb(!clickBreadcrumb);
  };

  return (
    <>
      <PageContainer>
        <TopFilterSerie
          title={"Histórico de Desempenho > "}
          serie={serie}
          changeSerie={handleChangeSerie}
        />
        <ReportFilter
          isEdition={false}
          isDisableYear={!serie}
          isDisable={!school}
          isSaev={user?.USU_SPE?.role === "SAEV"}
        />

        <section style={{ position: "relative" }}>
          {isLoading && !!items.length && (
            <div
              style={{
                position: "absolute",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(179, 179, 179, 0.4)",
              }}
            >
              <div className="d-flex align-items-center flex-column h-full mt-5">
                <div className="spinner-border" role="status"></div>
              </div>
            </div>
          )}

          {mapBreadcrumb.length > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#fff",
                padding: ".5rem",
              }}
            >
              <div style={{ display: "flex", flex: 1 }}>
                <ReportBreadcrumb
                  onPress={onPressBreadcrumb}
                  isDisabledCounty
                />
              </div>

              <div>
                <ButtonWhite onClick={downloadCsv} type="">
                  Exportar
                </ButtonWhite>
              </div>
            </div>
          )}

          {isLoading && !items.length && (
            <div className="d-flex flex-1 align-items-center flex-column mt-5">
              <div className="spinner-border" role="status"></div>
            </div>
          )}

          {!!subjectItems.length && (
            <PerformanceHistorySubjectTabs
              subjectId={subjectId}
              items={subjectItems}
              selectSubjectId={setSubjectId}
            />
          )}

          {!!selectedItem.subject && (
            <ContainerScore>
              {selectedItem.dis_tipo !== "Leitura" ? (
                <TableClassAveragesPerformanceHistory
                  items={items}
                  selectedSubject={selectedItem}
                />
              ) : (
                <TableClassReadingPerformanceHistory
                  items={items}
                  selectedSubject={selectedItem}
                />
              )}

              <Pagination>
                Linhas por página:
                <FormSelectStyled
                  data-test="limit"
                  value={limit}
                  onChange={handleChangeLimit}
                >
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </FormSelectStyled>
                <ButtonPage
                  data-test="previous"
                  onClick={() => handleChangePage("prev")}
                  disabled={disablePrev}
                >
                  <MdNavigateBefore size={24} />
                </ButtonPage>
                <ButtonPage
                  data-test="next"
                  onClick={() => handleChangePage("next")}
                  disabled={disableNext}
                >
                  <MdNavigateNext size={24} />
                </ButtonPage>
              </Pagination>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  margin: "1.5rem 0",
                }}
              >
                {Object.keys(selectedItem.dis_tipo === "Leitura" ? PerfHistoryNiveisReading : PerfHistoryNiveisObjective).map((key) => (
                  <div
                  key={key}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      width: selectedItem.dis_tipo === "Leitura" ? "70px" : "100px",
                    }}
                  >
                    <div
                      style={{
                        width: "12px",
                        height: "24px",
                        backgroundColor: selectedItem.dis_tipo === "Leitura" ? PerfHistoryNiveisReadingColor[key] : PerfHistoryNiveisObjectiveColor[key],
                      }}
                    />

                    <div
                      style={{
                        width: "3rem",
                        fontWeight: 500,
                        fontSize: "11px",
                      }}
                    >
                      {selectedItem.dis_tipo === "Leitura" ? PerfHistoryNiveisReading[key] : PerfHistoryNiveisObjective[key]}
                    </div>
                  </div>
                ))}
              </div>
            </ContainerScore>
          )}
        </section>

        <CSVLink
          data={csv}
          filename="historico_desempenho.csv"
          className="hidden"
          ref={csvLink}
          target="_blank"
        />
      </PageContainer>
    </>
  );
}

HistoricoDesempenho.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={"Histórico de Desempenho"}>{page}</Layout>;
};

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    return {
      props: {},
    };
  },
  {
    roles: ["REL", "HIST_DES"],
  }
);
