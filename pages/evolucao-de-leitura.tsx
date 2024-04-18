import PageContainer from "src/components/pageContainer";
import { useState, useEffect, useCallback, useRef } from "react";
import Layout from "src/components/layout";
import type { ReactElement } from "react";
import { ReportFilter } from "src/components/reportFilter";
import { ContainerScore } from "src/components/containerScore";
import { useBreadcrumbContext } from "src/context/breadcrumb.context";
import { ReportBreadcrumb } from "src/components/reportBreadcrumb";
import { ButtonMenu } from "src/components/ButtonMenu";
import { useGenearePdf } from "src/utils/generatePdf";
import { CSVLink } from "react-csv";
import { withSSRAuth } from "src/utils/withSSRAuth";
import Top from "src/components/top";
import { getEvolutionaryLineReading, getExportEvolutionaryLineReading } from "src/services/evolucao-leitura";
import { GraphEvolutionaryLineReading } from "src/components/evolucaoLeitura/GraphEvolutionaryLineReading";
import { TableEvolutionaryLineReading } from "src/components/evolucaoLeitura/TableEvolutionaryLineReading";
import { saveAs } from 'file-saver';
import { useAuth } from "src/context/AuthContext";

export default function EvolucaoLeitura() {
  const {user} = useAuth()
  const [csv, setCsv] = useState([]);
  const [infoList, setInfoList] = useState(null);
  const csvLink = useRef(undefined);
  const [isLoading, setIsLoading] = useState(false);
  // const [selectedYear, setSelectedYear] = useState(null);
  const [selectedSerie, setSelectedSerie] = useState(null);
  const {
    serie,
    resetBreadcrumbs,
    handleUnClickBar,
    handleClickBreadcrumb,
    clickBreadcrumb,
    mapBreadcrumb,
    year,
    county,
    school,
    visibleBreadcrumbs,
    isUpdateData,
    hideBreadcrumbs,
    setIsUpdateData,
  } = useBreadcrumbContext();

  const onPressBreadcrumb = useCallback(() => {
    handleClickBreadcrumb(!clickBreadcrumb);
  }, [handleClickBreadcrumb, clickBreadcrumb]);

  const { componentRef, handlePrint } = useGenearePdf();

  const loadInfos = useCallback(async () => {
    setIsLoading(true);
    let year = mapBreadcrumb.find((x) => x.level === "year");
    // setSelectedYear(year?.id);
    setSelectedSerie(serie)
    let county = mapBreadcrumb.find((x) => x.level === "county");
    let school = mapBreadcrumb.find((x) => x.level === "school");
    let schoolClass = mapBreadcrumb.find((x) => x.level === "schoolClass");

    let resp = null;
    
    resp = await getEvolutionaryLineReading(
      1,
      999999,
      serie?.SER_ID,
      year?.id,
      county?.id,
      school?.id,
      schoolClass?.id
    );

    setIsLoading(false);

    setInfoList(resp.data?.items);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapBreadcrumb]);

  function updateStudent() {
    loadInfos();
  }

  useEffect(() => {
    if (isUpdateData || visibleBreadcrumbs) {
      loadInfos();

      hideBreadcrumbs();
      setIsUpdateData(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleBreadcrumbs, isUpdateData, hideBreadcrumbs, setIsUpdateData]);

  useEffect(() => {
    resetBreadcrumbs();
    handleUnClickBar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const downloadCsv = async () => {
    setIsLoading(true);
    let year = mapBreadcrumb.find((x) => x.level === "year");
    let county = mapBreadcrumb.find((x) => x.level === "county");
    let school = mapBreadcrumb.find((x) => x.level === "school");
    let schoolClass = mapBreadcrumb.find((x) => x.level === "schoolClass");

    const resp = await getExportEvolutionaryLineReading(
      1,
      999999,
      serie?.SER_ID,
      year?.id,
      county?.id,
      school?.id,
      schoolClass?.id
    )
      console.log('resp :', resp);
      
    setIsLoading(false);

    saveAs(resp.data, 'Evolução de Leitura');

    // csvLink.current.link.click();
  };

  function onDisableReportFilter(): boolean {
    switch (user?.USU_SPE?.SPE_PER?.PER_NOME) {
      case "Município":
        return !(!!county)
      case "Escola":
        return !(!!school)
      case "SAEV":
        return !(!!year)
      default:
        return false
    }
  }

  return (
    <>
      <PageContainer>
        <Top
          title="Evolução de Leitura"
        />
        <ReportFilter isSerieFirst={true} isDisable={onDisableReportFilter()} isEdition={false} />
        {isLoading ? (
          <div className="d-flex align-items-center flex-column mt-5">
            <div className="spinner-border" role="status"></div>
          </div>
        ) : (
          <>
            {infoList && (
              <ContainerScore>
                <header>
                  <ReportBreadcrumb onPress={onPressBreadcrumb} />

                  <ButtonMenu
                    handlePrint={handlePrint}
                    handleCsv={downloadCsv}
                  />
                </header>
                <div style={{textAlign: 'center', margin: '30px 0'}}>Nivel de Leitura{year && ` - ${year?.ANO}`} {selectedSerie?.SER_NOME && ` - ${serie?.SER_NOME}` }</div>
                <GraphEvolutionaryLineReading
                  info={infoList}
                />

                <TableEvolutionaryLineReading
                  info={infoList}
                />
              </ContainerScore>
            )}
          </>
        )}
        <GeneratePdfPage
          componentRef={componentRef}
          infoList={infoList}
          serie={serie}
        />
        <CSVLink
          data={csv}
          filename="linha-evolutiva.csv"
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
  infoList,
  serie
}) {
  return (
    <div className="pdf">
      <div ref={componentRef} className="print-container">
        <PageContainer>
          <div className="d-flex justify-content-center mt-3"><strong>Serie: {serie?.SER_NOME}</strong></div>
          <ReportBreadcrumb onPress={() => {}} />
          {infoList && (
            <ContainerScore>
              <GraphEvolutionaryLineReading
                isPdf={true}
                info={infoList}
              />
              <div className="page-break" />

              <TableEvolutionaryLineReading
                info={infoList}
              />
            </ContainerScore>
          )}
        </PageContainer>
      </div>
    </div>
  );
}

EvolucaoLeitura.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={"Evolução de Leitura"}>{page}</Layout>;
};

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    return {
      props: {},
    };
  },
  {
    roles: ["REL", "EVO_LEI"],
    // roles: [],
  }
);
