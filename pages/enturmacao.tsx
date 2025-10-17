import PageContainer from "src/components/pageContainer";
import { useState, useEffect, useRef, useCallback } from "react";
import Layout from "src/components/layout";
import type { ReactElement } from "react";
import { ReportFilter } from "src/components/reportFilter";
import { ContainerScore } from "src/components/containerScore";
import Top from "src/components/top";
import {
  ItemEdition,
  ItemSubjectLancamento,
  getItensGrouping,
} from "src/services/enturmacao.service";
import { ReportBreadcrumb } from "src/components/reportBreadcrumb";
import { TableGrouping } from "src/components/tables/TableGrouping";
import { ButtonMenu } from "src/components/ButtonMenu";
import { useGenearePdf } from "src/utils/generatePdf";
import { CSVLink } from "react-csv";

interface DataMun {
  LEVEL: string;
  NOME: string;
  ENTURMADOS: number;
  NAO_ENTURMADOS: number;
  TOTAL: number;
  PORCENTAGEM: string;
}

function createDataMun(
  LEVEL: string,
  NOME: string,
  ENTURMADOS: number,
  NAO_ENTURMADOS: number,
  TOTAL: number,
  PORCENTAGEM: string
): DataMun {
  return {
    LEVEL,
    NOME,
    ENTURMADOS,
    NAO_ENTURMADOS,
    TOTAL,
    PORCENTAGEM
  };
}

interface DataSchool {
  LEVEL: string;
  NOME: string;
  INEP: number;
  ENTURMADOS: number;
  NAO_ENTURMADOS: number;
  TOTAL: number;
  PORCENTAGEM: string;
}

function createDataSchool(
  LEVEL: string,
  NOME: string,
  INEP: number,
  ENTURMADOS: number,
  NAO_ENTURMADOS: number,
  TOTAL: number,
  PORCENTAGEM: string
): DataSchool {
  return {
    LEVEL,
    NOME,
    INEP,
    ENTURMADOS,
    NAO_ENTURMADOS,
    TOTAL,
    PORCENTAGEM
  };
}

interface DataSchoolClass {
  LEVEL: string;
  NOME: string;
  ENTURMADOS: number;
  PORCENTAGEM: string;
  SERIE: string;
}

function createDataSchoolClass(
  LEVEL: string,
  NOME: string,
  ENTURMADOS: number,
  PORCENTAGEM: string,
  SERIE: string
): DataSchoolClass {
  return {
    LEVEL,
    NOME,
    ENTURMADOS,
    PORCENTAGEM,
    SERIE
  };
}

interface DataStudent {
  LEVEL: string;
  NOME: string;
  CPF: string;
  MAE: string;
  NASC: string;
}

function createDataStudent(
  LEVEL: string,
  NOME: string,
  CPF: string,
  MAE: string,
  NASC: string
): DataStudent {
  return {
    LEVEL,
    NOME,
    CPF,
    MAE,
    NASC
  };
}
import { useBreadcrumbContext } from "src/context/breadcrumb.context";
import { withSSRAuth } from "src/utils/withSSRAuth";
import { format } from "date-fns";
import { useAuth } from "src/context/AuthContext";
import { useRouter } from "next/router";

export default function Enturmacao() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [order, setOrder] = useState("ASC");
  const [selectedColumn, setSelectedColumn] = useState("name");
  const [isLoading, setIsLoading] = useState(false);
  const [excelCreated, setExcelCreated] = useState(false);
  const router = useRouter();
  const {user} = useAuth()

  const [listScore, setListScore] = useState<ItemSubjectLancamento>(
    {} as ItemSubjectLancamento
  );
  const [itemsEdition, setItensEdition] = useState<ItemEdition>(
    {} as ItemEdition
  );
  const [csv, setCsv] = useState([]);
  const csvLink = useRef(undefined);

  const { componentRef, handlePrint } = useGenearePdf();
  const {
    handleClickBreadcrumb,
    mapBreadcrumb,
    isUpdateData,
    serie,
    epv,
    type,
    state,
    county,
    school,
    setIsUpdateData,
    clickBreadcrumb,
  } = useBreadcrumbContext();

  const downloadCsv = () => {
    generateDataImportExcel()
  };

  useEffect(() => {
    if(excelCreated){
      csvLink.current.link.click();
      setExcelCreated(false);
    }

  },[excelCreated]);

  // useEffect(() => {
  //   changeSerie(null);
  //   setIsUpdateData(true);
  // }, [changeSerie, setIsUpdateData]);

  function loadData(
    page: number,
    limit: number,
    order: string,
    selectedColumn: string,
    search: string
  ) {
    setPage(page);
    setLimit(limit);
    setOrder(order);
    setIsUpdateData(true);
    setSelectedColumn(selectedColumn);
    setSearch(search);
  }

  useEffect(() => {
    async function loadData() {
      const _state = mapBreadcrumb.find((data) => data.level === "state");
      const _stateRegional = mapBreadcrumb.find((data) => data.level === "regional");
      const _county = mapBreadcrumb.find((data) => data.level === "county");
      const _countyRegional = mapBreadcrumb.find((data) => data.level === "regionalSchool");
      const _school = mapBreadcrumb.find((data) => data.level === "school");
      const _serie = mapBreadcrumb.find((data) => data.level === "serie");
      const _schoolClass = mapBreadcrumb.find((data) => data.level === "schoolClass");

      // let newUrl = `${router.pathname}?`
        
      // if(serie) newUrl = newUrl.concat('serie=' + serie?.SER_ID)
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

      setIsLoading(true);

      const response_data = await getItensGrouping(
        "county",
        order,
        page,
        limit,
        _serie?.id,
        epv === 'Exclusivo Epv' ? 1 : 0,
        type,
        _state?.id,
        _stateRegional?.id,
        _county?.id,
        _countyRegional?.id,
        _school?.id,
        _schoolClass?.id,
        search,
      );

      setIsLoading(false);
      setIsUpdateData(false);

      setItensEdition(response_data);
    }

    if (isUpdateData && (mapBreadcrumb.length > 0)) {
      loadData();
      setIsUpdateData(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    order,
    page,
    mapBreadcrumb,
    limit,
    search,
    isUpdateData,
    setIsUpdateData,
  ]);

  const generateDataImportExcel = async () => {
    const _state = mapBreadcrumb.find((data) => data.level === "state");
    const _stateRegional = mapBreadcrumb.find((data) => data.level === "regional");
    const _county = mapBreadcrumb.find((data) => data.level === "county");
    const _countyRegional = mapBreadcrumb.find((data) => data.level === "regionalSchool");
    const _school = mapBreadcrumb.find((data) => data.level === "school");
    const _serie = mapBreadcrumb.find((data) => data.level === "serie");
    const _schoolClass = mapBreadcrumb.find((data) => data.level === "schoolClass");

    if (!_state) {
      return;
    }

    const response_grouping = await getItensGrouping(
      "county",
      order,
      1,
      999,
      _serie?.id,
      epv === 'Exclusivo Epv' ? 1 : 0,
      type === 'PUBLICA' ? null : type,
      _state?.id,
      _stateRegional?.id,
      _county?.id,
      _countyRegional?.id,
      _school?.id,
      _schoolClass?.id,
      search,
    );

    let list = [];
    let tempCsv = [];

    let level = "";
    if (response_grouping.type === "regional" || response_grouping.type === "county" || response_grouping.type === "regionalSchool") {
      if(response_grouping.type === "regional"){
        level = "Regional Estadual";
      } else if(response_grouping.type === "county"){
        level = "Município";
      } else if(response_grouping.type === "regionalSchool"){
        level = "Regional Municipal/Única";
      }
      response_grouping.itens?.map((x) => {
        list.push(
          createDataMun(level, x.name, x.grouped, x.not_grouped, x.total, 
          x.total === 0 ? '0' : (x.grouped*100 / x.total).toLocaleString("pt-BR"))
        );
      });

      tempCsv.push([
        "LEVEL",
        "NOME",
        "ENTURMADOS",
        "NAO_ENTURMADOS",
        "TOTAL",
        "PORCENTAGEM"
      ]);
    }

    if (response_grouping.type === "school") {
      level = "Escola";
      response_grouping.itens?.map((x) => {
        list.push(
          createDataSchool(
            level,
            x.name,
            x.inep,
            x.grouped,
            x.not_grouped, 
            x.total, 
            x.total === 0 ? '0' : (x.grouped*100 / x.total).toLocaleString("pt-BR")
          )
        );
      });
      tempCsv.push([
        "LEVEL",
        "NOME",
        "INEP",
        "ENTURMADOS",
        "NAO_ENTURMADOS",
        "TOTAL",
        "PORCENTAGEM"
      ]);
    }
    if (response_grouping.type === "schoolClass") {
      level = "Turma";
      response_grouping.itens?.map((x) => {
        list.push(createDataSchoolClass(level, x.name, x.grouped, x.total === 0 ? '0' : (x.grouped*100 / x.total).toLocaleString("pt-BR"), serie.name));
      });
      tempCsv.push(["LEVEL", "NOME", "ENTURMADOS", "PORCENTAGEM", "SÉRIE"]);
    }
    if (response_grouping.type === "serie") {
      level = "Série";
      response_grouping.itens.map((x) => {
        list.push(createDataSchoolClass(level, x.name, x.grouped, x.total === 0 ? '0' : (x.grouped*100 / x.total).toLocaleString("pt-BR"), null));
      });
      tempCsv.push(["LEVEL", "NOME", "ENTURMADOS", "PORCENTAGEM"]);
    }
    if (response_grouping.type === "student") {
      level = "Aluno";
      response_grouping.itens.map((x) => {
        list.push(createDataStudent(level, x.name, x.cpf ? x.cpf : '-', x.mae, format(new Date(x?.nasc), 'dd/MM/yyyy')));
      });
      tempCsv.push(["LEVEL", "NOME", "CPF", "NOME DA MAE", "DATA DE NASCIMENTO"]);
    }
    const listCSV = JSON.parse(JSON.stringify(list));

    listCSV.map((item) => {
      tempCsv.push(Object.values(item));
    });
    setCsv(tempCsv);
    setExcelCreated(true);
  }

  const onPressBreadcrumb = useCallback(() => {
    handleClickBreadcrumb(!clickBreadcrumb);
    setIsUpdateData(true);
    setPage(1)
  }, [handleClickBreadcrumb, clickBreadcrumb, setIsUpdateData]);

  // useEffect(() => {
  //   setIsUpdateData(true);
  // }, [mapBreadcrumb, setIsUpdateData]);

  function onDisableReportFilter(): boolean {
    switch (user?.USU_SPE?.role) {
      case "ESTADO":
        return !(!!state)
      case "MUNICIPIO_ESTADUAL":
        return !(!!county)
      case "MUNICIPIO_MUNICIPAL":
        return !(!!county)
      case "ESCOLA":
        return !(!!school)
      case "SAEV":
        return !(!!state)
      default:
        return false
    }
  }

  return (
    <>
      <PageContainer>
        <Top title="Enturmação" />
        <ReportFilter
          isDisable={onDisableReportFilter()}
          isYear={false}
          isEdition={false}
          isSerie={true}
          isSchoolClass={true}
          testActive="1"
          isPublic={false}
        />

        <>
          <ContainerScore>
            <ReportBreadcrumb onPress={onPressBreadcrumb} />

            <header>
              {!!itemsEdition?.itens?.length ? (
                <>
                  <div/>
                  {/* <p>
                    Lançamentos de{" "}
                    {itemsEdition.TOTAL_MUN?.toLocaleString("pt-BR")} municípios {
                      itemsEdition.TOTAL_SCHOOLS ? `e ${itemsEdition.TOTAL_SCHOOLS?.toLocaleString("pt-BR")} escolas` : null
                    }
                    :                   
                  </p> */}
                  <ButtonMenu
                    handlePrint={handlePrint}
                    handleCsv={downloadCsv}
                  />
                </>
              ) : (
                <p className="my-2">Nenhum lançamento encontrado!</p>
              )}
            </header>
          </ContainerScore>

          <TableGrouping
            loadData={loadData}
            setSearch={setSearch}
            isLoading={isLoading}
            item={itemsEdition}
          />
        </>

        <GeneratePdfPage
          componentRef={componentRef}
          listScore={listScore}
          itemsEdition={itemsEdition}
        />
        <CSVLink
          data={csv}
          filename="enturmação.csv"
          className="hidden"
          ref={csvLink}
          target="_blank"
        />
      </PageContainer>
    </>
  );
}

function GeneratePdfPage({ componentRef, listScore, itemsEdition }) {
  return (
    <div className="pdf">
      <div ref={componentRef} className="print-container">
        <PageContainer isPdf>
          <ContainerScore>
            <ReportBreadcrumb onPress={() => {}} />
          </ContainerScore>

          <TableGrouping
            loadData={() => {}}
            setSearch={() => {}}
            isPdf={true}
            item={itemsEdition}
          />
        </PageContainer>
      </div>
    </div>
  );
}

Enturmacao.getLayout = function getLayout(page: ReactElement) {
  return <Layout header="Enturmação">{page}</Layout>;
};

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    return {
      props: {},
    };
  },
  {
    roles: ["REL", "ENTU"],
  }
);
