import Layout from "src/components/layout";
import PageContainer from "src/components/pageContainer";
import Top from "src/components/top"

import { ReactElement, useCallback, useEffect, useState } from "react";
import { ReportFilter } from "src/components/reportFilter";
import { useBreadcrumbContext } from "src/context/breadcrumb.context";
import { ReportBreadcrumb } from "src/components/reportBreadcrumb";
import { TableReportInfrequencia } from "src/components/reportInfrequencia/TableReportInfrequencia";
import { Loading } from "src/components/Loading";
import { ExportReportInfrequencia } from "src/components/reportInfrequencia/ExportReportInfrequencia";
import { IReportAbsenceProps, getReportAbsences } from "src/services/relatorio-infrequencia.service";
import { GraphReportInfrequencia } from "src/components/reportInfrequencia/GraphReportInfrequencia";
import { useGenearePdf } from "src/utils/generatePdf";
import { TableReportInfrequenciaGrouped } from "src/components/reportInfrequencia/TableReportInfrequenciaGrouped";
import { useAuth } from "src/context/AuthContext";
import { useRouter } from "next/router";
import { withSSRAuth } from "src/utils/withSSRAuth";

export default function RelatorioInfrequencia() {
  const {user} = useAuth()
  const [ absences, setAbsences ] = useState<IReportAbsenceProps>({} as IReportAbsenceProps)
  const [ isLoading, setIsLoading ] = useState<boolean>(false)
  const [ isGraphVisible, setIsGraphVisible ] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [ isPageChange, setIsPageChange ] = useState<boolean>(false)
  const [limit, setLimit] = useState<number>(25)
  const [level, setLevel] = useState<string>()
  const [levelName, setLevelName] = useState<string>()
  const { handlePrint, componentRef } = useGenearePdf();
  const [disableCounty, setDisableCounty]  = useState<boolean>(false)
  const [disableSchool, setDisableSchool]  = useState<boolean>(false)
  const [order, setOrder]  = useState<string>("asc")
  const [selectedColumn, setSelectedColumn]  = useState<string>('name')
  const router = useRouter();

  const {
    year,
    epv,
    type,
    state,
    county,
    school,
    changeCounty,
    changeSchool,
    addBreadcrumbs,
    isUpdateData,
    setIsUpdateData,
    handleClickBreadcrumb,
    clickBreadcrumb,
    mapBreadcrumb,
    visibleBreadcrumbs,
    hideBreadcrumbs,
  } = useBreadcrumbContext()

  // useEffect(() => {
  //   if(user?.USU_SPE?.SPE_PER?.PER_NOME === "Município"){
  //     changeCounty({
  //       AVM_MUN: {
  //         MUN_ID: user?.USU_MUN?.MUN_ID,
  //         MUN_NOME: user?.USU_MUN?.MUN_NOME,
  //       },
  //     });
  //     addBreadcrumbs(user?.USU_MUN?.MUN_ID, user?.USU_MUN?.MUN_NOME, 'county');
  //     setDisableCounty(true)
  //   }
  //   else if(user?.USU_SPE?.SPE_PER?.PER_NOME === "Escola"){
  //     changeCounty({
  //       AVM_MUN: {
  //         MUN_ID: user?.USU_MUN?.MUN_ID,
  //         MUN_NOME: user?.USU_MUN?.MUN_NOME,
  //       },
  //     });
  //     setDisableCounty(true)
  //     changeSchool({ ESC_ID: user?.USU_ESC?.ESC_ID, ESC_NOME: user?.USU_ESC?.ESC_NOME });
  //     addBreadcrumbs(user?.USU_MUN?.MUN_ID, user?.USU_MUN?.MUN_NOME, 'county');
  //     addBreadcrumbs(user?.USU_ESC?.ESC_ID, user?.USU_ESC?.ESC_NOME, 'school');
  //     setDisableSchool(true)
  //   }
  // }, [user, year])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function loadData(page: number) {
    setIsLoading(true)
    const _year = mapBreadcrumb.find((data) => data.level === "year");
    const _state = mapBreadcrumb.find((data) => data.level === "state");
    const _stateRegional = mapBreadcrumb.find((data) => data.level === "regional");
    const _county = mapBreadcrumb.find((data) => data.level === "county");
    const _countyRegional = mapBreadcrumb.find((data) => data.level === "regionalSchool");
    const _school = mapBreadcrumb.find((data) => data.level === "school");
    const _serie = mapBreadcrumb.find((data) => data.level === "serie")
    const _schoolClass = mapBreadcrumb.find((data) => data.level === "schoolClass");

    // let newUrl = `${router.pathname}?`
      
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

    if(epv) {
      setLevel('county')
      setLevelName(epv)
    }
    if(_state) {
      setLevel('regional')
      setLevelName(_state.name)
    }
    if(_stateRegional) {
      setLevel('county')
      setLevelName(_stateRegional.name)
    }
    if(_county) {
      setLevel('regionalSchool')
      setLevelName(_county.name)
    }
    if(_countyRegional) {
      setLevel('school')
      setLevelName(_countyRegional.name)
    }
    if(_school) {
      setLevel('serie')
      setLevelName(_school.name)
    }
    if(_serie) {
      setLevel('schoolClass')
      setLevelName(_serie.name)
    }
    if(_schoolClass) {
      setLevel('student')
      setLevelName(_schoolClass.name)
    }
    
    const reports = await getReportAbsences(
      page,
      limit,
      order?.toUpperCase(),
      selectedColumn,
      _year?.id,
      epv === 'Exclusivo Epv' ? 1 : 0,
      type,
      _state?.id,
      _stateRegional?.id,
      _county?.id,
      _countyRegional?.id,
      _school?.id,
      _serie?.id,
      _schoolClass?.id
      )

    setAbsences(reports)
    setIsGraphVisible(true)
    setIsLoading(false)
  }

  const onPressBreadcrump = useCallback(() => {
    handleClickBreadcrumb(!clickBreadcrumb)
    setIsUpdateData(true)
  }, [
    handleClickBreadcrumb,
    clickBreadcrumb,
    setIsUpdateData,
  ])

  useEffect(() => {
    if (isUpdateData || visibleBreadcrumbs) {
      if(isPageChange){
        loadData(page)
        setIsPageChange(false)
      }else{
        setPage(1)
        loadData(1)
      }
      hideBreadcrumbs()
      setIsUpdateData(false)
    }
  }, [
    visibleBreadcrumbs,
    isUpdateData,
    hideBreadcrumbs,
    setIsUpdateData,
    loadData,
    isPageChange,
    limit,
    order,
    selectedColumn
  ])


  const handleChangePage = (page: number) => {
    setPage(page)
    setIsPageChange(true)
    setIsUpdateData(true)
  }

  const handleChangeLimit = (limit: number) => {
    setLimit(limit)
    setIsUpdateData(true)
  }

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
    <PageContainer>
      <Top title={"Relatório de Infrequência"} />
      <ReportFilter isDisable={onDisableReportFilter()} isEdition={false} isSerie={true} buttonText="Filtrar" isSaev={user?.USU_SPE?.role === 'SAEV'} isPublic={false}/>
      {
        isLoading ? (
          <Loading />
          ) : (
            <>
            <section>
              <ReportBreadcrumb onPress={onPressBreadcrump} />
              {isGraphVisible &&
                <ExportReportInfrequencia handlePrint={handlePrint} />
              }
            </section>
            <GraphReportInfrequencia absences={absences} isVisible={isGraphVisible} />
            <TableReportInfrequenciaGrouped absences={absences?.graph} level={level} levelName={levelName} isLoading={false}/>
            <TableReportInfrequencia absences={absences?.data} level={level} page={page} changePage={handleChangePage} changeLimit={handleChangeLimit} changeOrder={setOrder} changeColumn={setSelectedColumn} />
            <GeneratePdfPage
              componentRef={componentRef}
              absences={absences}
              page={page}
              level={level}
              levelName={levelName}
              />
          </>
        )
      }
    </PageContainer>
  )
}

function GeneratePdfPage({
  componentRef,
  absences,
  page,
  level,
  levelName
}) {
  return (
      <div className="pdf">
        <div ref={componentRef} className="print-container" >
          <PageContainer>
            <section>
              <ReportBreadcrumb onPress={null} />
            </section>
            <GraphReportInfrequencia absences={absences} isVisible={true} isPdf={true} />
            <TableReportInfrequenciaGrouped absences={absences?.graph} level={level} levelName={levelName} isLoading={false}/>
            <TableReportInfrequencia absences={absences?.data} level={level} page={page} changePage={null} changeLimit={null} changeColumn={null} changeOrder={null} isPdf={true} />
          </PageContainer>
        </div>
      </div>
  );
}

RelatorioInfrequencia.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout header={"Relatório de Infrequência"}>{page}</Layout>
  )
}

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    return {
      props: {},
    };
  },
  {
    roles: [],
  }
);