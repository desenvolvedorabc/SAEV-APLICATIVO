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
import { useRouter } from "next/router";

export default function EvolucaoLeitura() {
  const {user} = useAuth()
  const [csv, setCsv] = useState([]);
  const [infoList, setInfoList] = useState(null);
  const csvLink = useRef(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSerie, setSelectedSerie] = useState(null);
  const router = useRouter()
  const {
    serie,
    resetBreadcrumbs,
    handleUnClickBar,
    handleClickBreadcrumb,
    clickBreadcrumb,
    mapBreadcrumb,
    year,
    epv,
    type,
    state,
    stateRegional,
    edition,
    county,
    countyRegional,
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
    // let year = mapBreadcrumb.find((x) => x.level === "year");
    // setSelectedYear(year?.id);
    setSelectedSerie(serie)
    const _school = mapBreadcrumb.find((data) => data.level === "school");
    const _schoolClass = mapBreadcrumb.find((data) => data.level === "schoolClass");
    const _county = mapBreadcrumb.find((data) => data.level === "county");
    const _year = mapBreadcrumb.find((data) => data.level === "year");
    const _state = mapBreadcrumb.find((data) => data.level === "state");
    const _stateRegional = mapBreadcrumb.find((data) => data.level === "regional");
    const _countyRegional = mapBreadcrumb.find((data) => data.level === "regionalSchool");

    // let newUrl = `${router.pathname}?`
      
    // if(serie) newUrl = newUrl.concat('serie=' + serie?.SER_ID)
    // if(_year) newUrl = newUrl.concat('&year=' + _year?.id)
    // if(epv) newUrl = newUrl.concat('&epv=' + epv)
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

    let resp = null;
    
    resp = await getEvolutionaryLineReading(
      1,
      999999,
      serie?.SER_ID,
      _year?.id,
      epv === 'Exclusivo Epv' ? 1 : 0,
      type === 'PUBLICA' ? null : type,
      _state?.id,
      _stateRegional?.id,
      _county?.id,
      _countyRegional?.id,
      _school?.id,
      _schoolClass?.id
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
    const _school = mapBreadcrumb.find((data) => data.level === "school");
    const _schoolClass = mapBreadcrumb.find((data) => data.level === "schoolClass");
    const _county = mapBreadcrumb.find((data) => data.level === "county");
    const _year = mapBreadcrumb.find((data) => data.level === "year");
    const _state = mapBreadcrumb.find((data) => data.level === "state");
    const _stateRegional = mapBreadcrumb.find((data) => data.level === "regional");
    const _countyRegional = mapBreadcrumb.find((data) => data.level === "regionalSchool");

    const resp = await getExportEvolutionaryLineReading(
      1,
      999999,
      serie?.SER_ID,
      _year?.id,
      epv === 'Exclusivo Epv' ? 1 : 0,
      type === 'PUBLICA' ? null : type,
      _state?.id,
      _stateRegional?.id,
      _county?.id,
      _countyRegional?.id,
      _school?.id,
      _schoolClass?.id
    )
      
    setIsLoading(false);

    saveAs(resp.data, 'Evolução de Leitura');
  };

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
        return epv === 'Completo' ? !(!!state) : !(!!epv)
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
        <ReportFilter isSerieFirst={true} isDisable={onDisableReportFilter()} isEdition={false} isSaev={user?.USU_SPE?.role === 'SAEV'} />
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
