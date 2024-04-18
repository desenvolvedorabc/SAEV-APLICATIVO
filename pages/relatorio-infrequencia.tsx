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

export default function RelatorioInfrequencia() {
  const {user} = useAuth()
  console.log('user :', user);
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

  const {
    year,
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

  useEffect(() => {
    if(user?.USU_SPE?.SPE_PER?.PER_NOME === "Município"){
      changeCounty({
        AVM_MUN: {
          MUN_ID: user?.USU_MUN?.MUN_ID,
          MUN_NOME: user?.USU_MUN?.MUN_NOME,
        },
      });
      addBreadcrumbs(user?.USU_MUN?.MUN_ID, user?.USU_MUN?.MUN_NOME, 'county');
      setDisableCounty(true)
    }
    else if(user?.USU_SPE?.SPE_PER?.PER_NOME === "Escola"){
      changeCounty({
        AVM_MUN: {
          MUN_ID: user?.USU_MUN?.MUN_ID,
          MUN_NOME: user?.USU_MUN?.MUN_NOME,
        },
      });
      setDisableCounty(true)
      changeSchool({ ESC_ID: user?.USU_ESC?.ESC_ID, ESC_NOME: user?.USU_ESC?.ESC_NOME });
      addBreadcrumbs(user?.USU_MUN?.MUN_ID, user?.USU_MUN?.MUN_NOME, 'county');
      addBreadcrumbs(user?.USU_ESC?.ESC_ID, user?.USU_ESC?.ESC_NOME, 'school');
      setDisableSchool(true)
    }
  }, [user, year])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function loadData(page: number) {
    setIsLoading(true)

    const year = mapBreadcrumb.find((data) => data.level === "year")
    if(year) {
      setLevel('county')
      setLevelName(year.name)
    }
    const county = mapBreadcrumb.find((data) => data.level === "county")
    if(county) {
      setLevel('school')
      setLevelName(county.name)
    }
    const school = mapBreadcrumb.find((data) => data.level === "school")
    if(school) {
      setLevel('serie')
      setLevelName(school.name)
    }
    const serie = mapBreadcrumb.find((data) => data.level === "serie")
    if(serie) {
      setLevel('schoolClass')
      setLevelName(serie.name)
    }
    const schoolClass = mapBreadcrumb.find(
      (data) => data.level === "schoolClass"
    )
    if(schoolClass) {
      setLevel('student')
      setLevelName(schoolClass.name)
    }
    
    const reports = await getReportAbsences(
      page,
      limit,
      order,
      selectedColumn,
      school?.id,
      schoolClass?.id,
      year?.id,
      county?.id,
      serie?.id
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

  return (
    <PageContainer>
      <Top title={"Relatório de Infrequência"} />
      <ReportFilter isDisable={!year} isEdition={false} isSerie={true} buttonText="Filtrar" isDisableCounty={disableCounty} isDisableSchool={disableSchool}/>
      {
        isLoading ? (
          <Loading />
          ) : (
            <>
            <section>
              <ReportBreadcrumb onPress={onPressBreadcrump}  isDisabledCounty={disableCounty} isDisabledSchool={disableSchool} />
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
        <div ref={componentRef} className="print-container">
          <PageContainer>
            <section>
              <ReportBreadcrumb onPress={null} />
            </section>
            <GraphReportInfrequencia absences={absences} isVisible={true} isPdf={true} />
            <TableReportInfrequenciaGrouped absences={absences?.graph} level={level} levelName={levelName} isLoading={false}/>
            <TableReportInfrequencia absences={absences?.data} level={level} page={page} changePage={null} changeLimit={null} changeColumn={null} changeOrder={null} isPdf={true}/>
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