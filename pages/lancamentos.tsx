import PageContainer from "src/components/pageContainer";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Layout from "src/components/layout";
import ScoreBar from "src/components/scoreBar";
import type { ReactElement } from "react";
import { ReportFilter } from "src/components/reportFilter";
import { ContainerScore } from "src/components/containerScore";
import { useBreadcrumbContext } from "src/context/breadcrumb.context";
import { TableEditions } from "src/components/tables/TableEditions";
import {
  ItemEdition,
  ItemSubjectLancamento,
  getItens,
} from "src/services/lancamentos.service";
import { ReportBreadcrumb } from "src/components/reportBreadcrumb";
import { TableStudentsRelease } from "src/components/tables/TableStudentsRelease";
import { ButtonMenu } from "src/components/ButtonMenu";
import { useGenearePdf } from "src/utils/generatePdf";
import { CSVLink } from "react-csv";
import getLastPage from "src/utils/calculate-last-page";
import Top from "src/components/top";
import { useAuth } from "src/context/AuthContext";
import { useRouter } from "next/router";
import { withSSRAuth } from "src/utils/withSSRAuth";

interface DataEditions {
  LEVEL: string;
  NOME: string;
  GERAL: number;
  PORTUGUES: string;
  MATEMATICA: string;
  LEITURA: string;
  ENTURMADO: number;
}

function createDataEditions(
  LEVEL: string,
  NOME: string,
  GERAL: number,
  PORTUGUES: string,
  MATEMATICA: string,
  LEITURA: string,
  ENTURMADO: number
): DataEditions {
  return {
    LEVEL,
    NOME,
    GERAL,
    PORTUGUES,
    MATEMATICA,
    LEITURA,
    ENTURMADO,
  };
}

interface DataMun {
  LEVEL: string;
  NOME: string;
  GERAL: number;
  PORTUGUES: string;
  MATEMATICA: string;
  LEITURA: string;
  ENTURMADO: number;
}

function createDataMun(
  LEVEL: string,
  NOME: string,
  GERAL: number,
  PORTUGUES: string,
  MATEMATICA: string,
  LEITURA: string,
  ENTURMADO: number
): DataMun {
  return {
    LEVEL,
    NOME,
    GERAL,
    PORTUGUES,
    MATEMATICA,
    LEITURA,
    ENTURMADO,
  };
}

interface DataSchool {
  LEVEL: string;
  NOME: string;
  GERAL: number;
  PORTUGUES: string;
  MATEMATICA: string;
  LEITURA: string;
  ENTURMADO: number;
  INEP: number;
}

function createDataSchool(
  LEVEL: string,
  NOME: string,
  GERAL: number,
  PORTUGUES: string,
  MATEMATICA: string,
  LEITURA: string,
  ENTURMADO: number,
  INEP: number
): DataSchool {
  return {
    LEVEL,
    NOME,
    GERAL,
    PORTUGUES,
    MATEMATICA,
    LEITURA,
    ENTURMADO,
    INEP,
  };
}

interface DataSerie {
  LEVEL: string;
  NOME: string;
  TURMA: string;
  GERAL: number;
  PORTUGUES: string;
  MATEMATICA: string;
  LEITURA: string;
  ENTURMADO: number;
}

function createDataSerie(
  LEVEL: string,
  NOME: string,
  TURMA: string,
  GERAL: number,
  PORTUGUES: string,
  MATEMATICA: string,
  LEITURA: string,
  ENTURMADO: number
): DataSerie {
  return {
    LEVEL,
    NOME,
    TURMA,
    GERAL,
    PORTUGUES,
    MATEMATICA,
    LEITURA,
    ENTURMADO,
  };
}

interface DataAluno {
  LEVEL: string;
  NOME: string;
  ID: string;
  INEP: number;
  GERAL_ACERTO: string;
  PORTUGUES_ACERTO: string;
  MATEMATICA_ACERTO: string;
  LEITURA_ACERTO: string;
}

function createDataAluno(
  LEVEL: string,
  NOME: string,
  ID: string,
  INEP: number,
  GERAL_ACERTO: string,
  PORTUGUES_ACERTO: string,
  MATEMATICA_ACERTO: string,
  LEITURA_ACERTO: string
): DataAluno {
  return {
    LEVEL,
    NOME,
    ID,
    INEP,
    GERAL_ACERTO,
    PORTUGUES_ACERTO,
    MATEMATICA_ACERTO,
    LEITURA_ACERTO,
  };
}

interface DataValores {
  LEVEL: string;
  TOTAL_MUNICIPIOS: number;
  TOTAL_ESCOLAS: number;
  NOME: string;
  RESULTADO: number;
}

function createDataValores(
  LEVEL: string,
  TOTAL_MUNICIPIOS: number,
  TOTAL_ESCOLAS: number,
  NOME: string,
  RESULTADO: number
): DataValores {
  return {
    LEVEL,
    TOTAL_MUNICIPIOS,
    TOTAL_ESCOLAS,
    NOME,
    RESULTADO,
  };
}

export default function Lancamentos() {
  const {user} = useAuth()
  const router = useRouter()
  const [typeTable, setTypeTable] = useState("editions");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [order, setOrder] = useState("ASC");
  const [selectedColumn, setSelectedColumn] = useState("name");
  const [isLoading, setIsLoading] = useState(false);
  const [_serie, setSerie] = useState(null);
  const [listScore, setListScore] = useState<ItemSubjectLancamento>(
    {} as ItemSubjectLancamento
  );
  const [itemsEditionTotal, setItensEditionTotal] = useState<ItemEdition>(
    {} as ItemEdition
  );
  const [csv, setCsv] = useState([]);
  const csvLink = useRef(undefined);

  const { componentRef, handlePrint } = useGenearePdf();

  const {
    serieList,
    visibleBreadcrumbs,
    hideBreadcrumbs,
    mapBreadcrumb,
    year,
    state,
    epv,
    type,
    stateRegional,
    edition,
    county,
    countyRegional,
    school,
    resetBreadcrumbs,
    handleUnClickBar,
    handleClickBreadcrumb,
    isUpdateData,
    setIsUpdateData,
    clickBreadcrumb,
  } = useBreadcrumbContext();

  const getCerto = (type) => {
    return type === "right" ? "certo" : "errado";
  };

  function loadData(
    page: number,
    limit: number,
    order: string,
    selectedColumn: string
  ) {
    setPage(page);
    setLimit(limit);
    setOrder(order);
    setSelectedColumn(selectedColumn);
  }

  const loadInfos = useCallback(async () => {
    setIsLoading(true);
    setItensEditionTotal(null);
    const _year = mapBreadcrumb.find((data) => data.level === "year");
    const _edition = mapBreadcrumb.find((data) => data.level === "edition");
    const _state = mapBreadcrumb.find((data) => data.level === "state");
    const _stateRegional = mapBreadcrumb.find((data) => data.level === "regional");
    const _county = mapBreadcrumb.find((data) => data.level === "county");
    const _countyRegional = mapBreadcrumb.find((data) => data.level === "regionalSchool");
    const _school = mapBreadcrumb.find((data) => data.level === "school");
    const _schoolClass = mapBreadcrumb.find((data) => data.level === "schoolClass");
    let seriesIds = serieList.map((serie) => serie.SER_ID);

    // let newUrl = `${router.pathname}?`
        
    // if(seriesIds) newUrl = newUrl.concat('serie=' + seriesIds)
    // if(_year) newUrl = newUrl.concat('&year=' + _year?.id)
    // if(epv) newUrl = newUrl.concat('&epv=' + epv)
    // if(_edition) newUrl = newUrl.concat('&edition=' + _edition?.id)
    // if(type) newUrl = newUrl.concat('&type=' + type)
    // if(_state) newUrl = newUrl.concat('&state=' + _state?.id)
    // if(_stateRegional) newUrl = newUrl.concat('&stateRegional=' + _stateRegional?.id)
    // if(_county) {
    //   newUrl = newUrl.concat('&countyId=' + _county?.id + '&countyName=' + _county?.name)
    // }
    // if(_countyRegional) newUrl = newUrl.concat('&countyRegional=' + _countyRegional?.id)
    // if(_school) newUrl = newUrl.concat('&school=' + _school?.id)
    // if(_schoolClass) newUrl = newUrl.concat('&schoolClass=' + _schoolClass?.id)
     
    // window.history.pushState({ path: newUrl }, '', newUrl);

    const response = await getItens(
      seriesIds,
      _year?.id,
      _edition?.id,
      type === 'PUBLICA' ? null : type,
      _state?.id,
      _stateRegional?.id,
      _county?.id,
      _countyRegional?.id,
      _school?.id,
      _schoolClass?.id
    );
    setIsLoading(false);
    setPage(1);
    setSearch("");
    setItensEditionTotal(response);
    setListScore(response.series);

    if (response.series && response.itens) {
      let list = [];
      let tempCsv = [];
      let listCSV = [];

      response?.series?.items?.map((x) => {
        let level = "Serie";
        list.push(
          createDataValores(
            level,
            response?.series?.total_mun,
            response?.series?.total_schools,
            x.name,
            x.value
          )
        );
      });

      tempCsv.push([
        "LEVEL",
        "TOTAL_MUNICÍPIOS",
        "TOTAL_ESCOLAS",
        "NOME",
        "RESULTADO",
      ]);
      listCSV = JSON.parse(JSON.stringify(list));
      listCSV.map((item) => {
        tempCsv.push(Object.values(item));
      });

      tempCsv.push([]);
      tempCsv.push([]);
      tempCsv.push([]);
      list = [];
      let level = "";
      if (response?.type === "regional" || response?.type === "county" || response?.type === "regionalSchool") {
        level = response?.type === "regional" ? "Regionais Estaduais" : response?.type === "county" ? "Município" : "Regionais Municipais/Únicas"
        response?.itens?.map((x) => {
          list.push(
            createDataEditions(
              level,
              x.name,
              x.general,
              x.subjects.find(subject => subject.name === 'Língua Portuguesa')?.percentageFinished ? x.subjects.find(subject => subject.name === 'Língua Portuguesa')?.percentageFinished.toString() : '-',
              x.subjects.find(subject => subject.name === "Matemática")?.percentageFinished ? x.subjects.find(subject => subject.name === "Matemática")?.percentageFinished.toString() : '-',
              x.subjects.find(subject => subject.name === "Leitura")?.percentageFinished ? x.subjects.find(subject => subject.name === "Leitura")?.percentageFinished.toString() : '-',
              x.grouped
            )
          );
        });

        tempCsv.push([
          "LEVEL",
          "NOME",
          "GERAL",
          "PORTUGUES",
          "MATEMATICA",
          "LEITURA",
          "ENTURMADO",
        ]);
      }
      // if (response?.type === "editions") {
      //   level = "Edição";
      //   response?.itens.map((x) => {
      //     list.push(
      //       createDataMun(
      //         level,
      //         x.name,
      //         x.general,
      //         x.subjects.find(subject => subject.name === 'Língua Portuguesa')?.percentageFinished ? x.subjects.find(subject => subject.name === 'Língua Portuguesa')?.percentageFinished.toString() : '-',
      //         x.subjects.find(subject => subject.name === "Matemática")?.percentageFinished ? x.subjects.find(subject => subject.name === "Matemática")?.percentageFinished.toString() : '-',
      //         x.subjects.find(subject => subject.name === "Leitura")?.percentageFinished ? x.subjects.find(subject => subject.name === "Leitura")?.percentageFinished.toString() : '-',
      //         x.grouped
      //       )
      //     );
      //   });

      //   tempCsv.push([
      //     "LEVEL",
      //     "NOME",
      //     "GERAL",
      //     "PORTUGUES",
      //     "MATEMATICA",
      //     "LEITURA",
      //     "ENTURMADO",
      //   ]);
      // }

      if (response?.type === "school") {
        level = "Escola";
        response?.itens?.map((x) => {
          list.push(
            createDataSchool(
              level,
              x.name,
              x.general,
              x.subjects.find(subject => subject.name === 'Língua Portuguesa')?.percentageFinished ? x.subjects.find(subject => subject.name === 'Língua Portuguesa')?.percentageFinished.toString() : '-',
              x.subjects.find(subject => subject.name === "Matemática")?.percentageFinished ? x.subjects.find(subject => subject.name === "Matemática")?.percentageFinished.toString() : '-',
              x.subjects.find(subject => subject.name === "Leitura")?.percentageFinished ? x.subjects.find(subject => subject.name === "Leitura")?.percentageFinished.toString() : '-',
              x.grouped,
              x.inep
            )
          );
        });

        tempCsv.push([
          "LEVEL",
          "NOME",
          "GERAL",
          "PORTUGUES",
          "MATEMATICA",
          "LEITURA",
          "ENTURMADO",
          "INEP",
        ]);
      }

      if (response.type === "schoolClass") {
        level = "Turma";
        response?.itens?.map((x) => {
          list.push(
            createDataSerie(
              level,
              x.name,
              x.classe,
              x.general,
              x.subjects.find(subject => subject.name === 'Língua Portuguesa')?.percentageFinished ? x.subjects.find(subject => subject.name === 'Língua Portuguesa')?.percentageFinished.toString() : '-',
              x.subjects.find(subject => subject.name === "Matemática")?.percentageFinished ? x.subjects.find(subject => subject.name === "Matemática")?.percentageFinished.toString() : '-',
              x.subjects.find(subject => subject.name === "Leitura")?.percentageFinished ? x.subjects.find(subject => subject.name === "Leitura")?.percentageFinished.toString() : '-',
              x.grouped
            )
          );
        });

        tempCsv.push([
          "LEVEL",
          "NOME",
          "TURMA",
          "GERAL",
          "PORTUGUES",
          "MATEMATICA",
          "LEITURA",
          "ENTURMADO",
        ]);
      }
      if (response?.type === "student") {
        level = "Aluno";
        response?.itens?.map((x) => {
          list.push(
            createDataAluno(
              level,
              x.name,
              x.id,
              x.inep,
              getCerto(x.general_type),
              getCerto(x.portuguese_type),
              getCerto(x.math_type),
              getCerto(x.reading_type)
            )
          );
        });
        tempCsv.push([
          "LEVEL",
          "NOME",
          "ID",
          "INEP",
          "GERAL_ACERTO",
          "PORTUGUES_ACERTO",
          "MATEMATICA_ACERTO",
          "LEITURA_ACERTO",
        ]);
      }

      listCSV = JSON.parse(JSON.stringify(list));
      listCSV.map((item) => {
        tempCsv.push(Object.values(item));
      });

      setCsv(tempCsv);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapBreadcrumb]);

  const downloadCsv = (e) => {
    csvLink.current.link.click();
  };

  const onPressBreadcrumb = useCallback(() => {
    handleClickBreadcrumb(!clickBreadcrumb);
  }, [handleClickBreadcrumb, clickBreadcrumb]);

  useEffect(() => {
    resetBreadcrumbs();
    handleUnClickBar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const itemsEdition = useMemo(() => {
    let items: any[] = itemsEditionTotal?.itens ?? [];

    if (search) {
      items = items?.filter((data) =>
        data.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (order.toLowerCase() === "asc") {
      items = items?.sort((a, b) => {
        if (selectedColumn === "name" || selectedColumn === "classe") {
          return ("" + a[selectedColumn].toString()).localeCompare(
            b[selectedColumn].toString()
          );
        }

        return a[selectedColumn] - b[selectedColumn];
      });
    } else {
      items = items?.sort((a, b) => {
        if (selectedColumn === "name" || selectedColumn === "classe") {
          return ("" + b[selectedColumn].toString()).localeCompare(
            a[selectedColumn].toString()
          );
        }

        return b[selectedColumn] - a[selectedColumn];
      });
    }

    const total = items?.length ?? 0;
    const skippedItems = (+page - 1) * +limit;
    const totalPages = getLastPage(total, +limit);

    items = !!items ? items : [];

    const itemsFilter = items.filter(
      (message, index) => index >= skippedItems && index < skippedItems + +limit
    );
    const formatted = {
      type: itemsEditionTotal?.type,
      itens: itemsFilter,
      meta: {
        totalPerPage: limit,
        totalItems: total,
        itemCount: itemsFilter?.length,
        totalPages: totalPages ?? 0,
      },
      series: itemsEditionTotal?.series,
    };
    return formatted;
  }, [itemsEditionTotal, limit, order, page, search, selectedColumn]);

  useEffect(() => {
    if (isUpdateData || visibleBreadcrumbs) {
      if (mapBreadcrumb.length === 5) {
        setTypeTable("student");
      } else if (mapBreadcrumb.length === 4) {
        setTypeTable("schoolClass");
      } else if (mapBreadcrumb.length === 3) {
        setTypeTable("school");
      } else if (mapBreadcrumb.length === 2) {
        setTypeTable("county");
      } else {
        setTypeTable("editions");
      }
      loadInfos();

      hideBreadcrumbs();
      setIsUpdateData(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setIsUpdateData, isUpdateData, visibleBreadcrumbs, hideBreadcrumbs]);

  function onDisableReportFilter(): boolean {
    switch (user?.USU_SPE?.role) {
      case "MUNICIPIO_MUNICIPAL":
        return !(!!county)
      case "MUNICIPIO_ESTADUAL":
        return !(!!county)
      case "ESCOLA":
        return !(!!school)
      case "ESTADO":
        return !(!!state)
      case "SAEV":
        return !(!!state)
      default:
        return false
    }
  }

  return (
    <>
      <PageContainer>
        <Top
          title={"Lançamentos"}
          // serie={serie}
          // changeSerie={handleChangeSerie}
        />
        <ReportFilter isDisable={onDisableReportFilter()} isMultipleSeries={true} />
        {isLoading ? (
          <div className="d-flex align-items-center flex-column mt-5">
            <div className="spinner-border" role="status"></div>
          </div>
        ) : (
          <>
            <>
              <ContainerScore>
                <ReportBreadcrumb onPress={onPressBreadcrumb} />
                <header>
                  <p>
                    Lançamentos de {listScore?.total_mun} municípios e{" "}
                    {listScore?.total_schools} escolas:
                  </p>
                  {!!itemsEditionTotal?.itens?.length && (
                    <ButtonMenu
                      handlePrint={handlePrint}
                      handleCsv={downloadCsv}
                    />
                  )}
                </header>
                {!!listScore?.items?.length && (
                  <>
                    <h3>Lançamentos por série</h3>
                    {listScore?.items?.map((data) => (
                      <ScoreBar
                        key={data.id}
                        item={data}
                        level="schoolClass"
                        haveClick={false}
                      />
                    ))}
                  </>
                )}
              </ContainerScore>

              {!!itemsEditionTotal?.itens?.length && (
                <>
                  {itemsEdition.type === "student" ? (
                    <TableStudentsRelease
                      setSearch={setSearch}
                      loadData={loadData}
                      item={itemsEdition}
                    />
                  ) : (
                    <TableEditions
                      setSearch={setSearch}
                      setTypeTable={setTypeTable}
                      item={itemsEdition}
                      loadData={loadData}
                    />
                  )}
                </>
              )}
              <GeneratePdfPage
                itemsEditionTotal={itemsEditionTotal}
                componentRef={componentRef}
                listScore={listScore}
                itemsEdition={itemsEdition}
              />
              <CSVLink
                data={csv}
                filename="lancamentos.csv"
                className="hidden"
                ref={csvLink}
                target="_blank"
              />
            </>
          </>
        )}
      </PageContainer>
    </>
  );
}

function GeneratePdfPage({
  componentRef,
  listScore,
  itemsEdition,
  itemsEditionTotal,
}) {
  return (
    <div className="pdf">
      <div ref={componentRef} className="print-container">
        <PageContainer>
          <ContainerScore>
            <ReportBreadcrumb onPress={() => {}} />
            <header>
              <p>
                Lançamentos de {listScore?.total_mun ?? 0} municípios e{" "}
                {listScore?.total_schools ?? 0} escolas:
              </p>
            </header>
            <h3>Lançamentos por série</h3>
            {listScore?.items?.map((data) => (
              <ScoreBar key={data.id} item={data} level={"schoolClass"} />
            ))}
          </ContainerScore>

          <div className="page-break" />
          <div style={{ width: "100%" }}>
            {!!itemsEditionTotal?.itens?.length && (
              <>
                {itemsEdition?.type === "student" ? (
                  <TableStudentsRelease
                    setSearch={() => {}}
                    loadData={() => {}}
                    isPdf={true}
                    item={itemsEdition}
                  />
                ) : (
                  <TableEditions
                    setSearch={() => {}}
                    loadData={() => {}}
                    isPdf={true}
                    setTypeTable={() => {}}
                    item={itemsEdition}
                  />
                )}
              </>
            )}
          </div>
        </PageContainer>
      </div>
    </div>
  );
}

Lancamentos.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={"Lançamentos"}>{page}</Layout>;
};

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    return {
      props: {},
    };
  },
  {
    roles: ['LANC'],
  }
);
