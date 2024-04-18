import { ReactElement, useCallback, useEffect, useState } from "react"
import { Loading } from "src/components/Loading"
import Layout from "src/components/layout"
import PageContainer from "src/components/pageContainer"
import { ReportBreadcrumb } from "src/components/reportBreadcrumb"
import { ReportFilter } from "src/components/reportFilter"
import { ExportReportNaoAvaliados } from "src/components/reportNaoAvaliados/exportDataNaoAvaliados"
import { GraphNaoAvaliados } from "src/components/reportNaoAvaliados/graphNaoAvaliados"
import { SubjectsFilter } from "src/components/reportNaoAvaliados/subjectFilter"
import { TableReportNaoAvaliados } from "src/components/reportNaoAvaliados/tableNaoAvaliados"
import { TableNaoAvaliadosGrouped } from "src/components/reportNaoAvaliados/tableNaoAvaliadosGrouped"
import { TopFilterSerie } from "src/components/topFilterSerie"
import { useAuth } from "src/context/AuthContext"
import { useBreadcrumbContext } from "src/context/breadcrumb.context"
import { useGenearePdf } from "src/utils/generatePdf"
import { Box } from "@mui/material"
import { ExportItem, JustificativasTypes, SchemaStudentsProps, getNotEvaluated } from "src/services/relatorio-nao-avaliados.service"
import { Title } from "styles/pages/relatorio-nao-avaliados.style"

export const reasons: { id: JustificativasTypes, label: string }[] = [
  {
    id: 'recusa',
    label: 'Recusou-se a participar',
  },
  {
    id: 'ausencia',
    label: 'Faltou, mas está frequentando a escola',
  },
  {
    id: 'abandono',
    label: 'Abandonou a escola',
  },
  {
    id: 'transferencia',
    label: 'Foi transferido para outra escola',
  },
  {
    id: 'deficiencia',
    label: 'Motivos de deficiência',
  },
  {
    id: 'nao_participou',
    label: 'Não participou',
  },
]

export default function RelatorioNaoAvaliados() {

  const {user} = useAuth()
  const { handlePrint, componentRef } = useGenearePdf();

  const [ notEvaluatedData, setNotEvaluatedData ] = useState({} as any)
  const [ notEvaluatedStudentes, setNotEvaluatedStudentes ] = useState<SchemaStudentsProps>({} as SchemaStudentsProps)
  const [ notEvaluated, setNotEvaluated ] = useState<ExportItem>({} as ExportItem)
  const [ isLoading, setIsLoading ] = useState<boolean>(false)
  const [ isGraphVisible, setIsGraphVisible ] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [ isPageChange, setIsPageChange ] = useState<boolean>(false)
  const [limit, setLimit] = useState<number>(5)
  const [level, setLevel] = useState<string>()
  const [levelName, setLevelName] = useState<string>()
  const [disableCounty, setDisableCounty]  = useState<boolean>(false)
  const [disableSchool, setDisableSchool]  = useState<boolean>(false)
  const [ examList, setExamList ] = useState<string[]>([])
  const [ examId, setExamId ] = useState<string>('Leitura')

  const {
    serie,
    edition,
    county,
    school,
    changeCounty,
    changeSchool,
    isUpdateData,
    setIsUpdateData,
    handleClickBreadcrumb,
    clickBreadcrumb,
    mapBreadcrumb,
    visibleBreadcrumbs,
    hideBreadcrumbs,
    changeSerie,
    changeYear,
    changeEdition,
    changeSchoolClass,
  } = useBreadcrumbContext()  

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function loadData(page: number) {
    setIsLoading(true)

    const year = mapBreadcrumb.find((data) => data.level === "year")
    const schoolClass = mapBreadcrumb.find(
      (data) => data.level === "schoolClass"
    )

    const subject: string | null = examId || null    
    
    const dataReports = await getNotEvaluated(
      page,
      limit,
      edition?.AVA_ID,
      school?.ESC_ID,
      schoolClass?.id,
      year?.id,
      county?.AVM_MUN?.MUN_ID,
      serie?.SER_ID,
      subject
    )

    let level = "";

    if (dataReports?.items[0]?.level === "school") level = "Escola";
    if (dataReports?.items[0]?.level === "schoolClass") level = "Turma";
    if (dataReports?.items[0]?.level === "student") level = "Estudantes";
    setLevel(level);    

    if (dataReports?.items[0]?.level === "county") setLevel("county");

    if (level === 'Estudantes') {
      setNotEvaluatedData(dataReports)
      const data = dataReports?.items?.filter(report => report.subject === examId)
      const [reports] = data
      const exams: string[] = []
      dataReports?.items.map((currentData) => {
        exams.push(currentData.subject)
      })
      setExamList(exams)
      setNotEvaluatedStudentes(reports)
    } else {
      setNotEvaluatedData(dataReports)
      const data = dataReports?.items?.filter(report => report.subject === examId)
      const [reports] = data      
      const exams: string[] = []
      dataReports?.items.map((currentData) => {
        exams.push(currentData.subject)
      })
      setExamList(exams)
      setNotEvaluated(reports)
    }
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
      } else{
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
  ])

  useEffect(() => {
    if (level === 'Estudantes') {      
      const [reports] = notEvaluatedData?.items?.filter(report => report.subject === examId)      

      setNotEvaluatedStudentes(reports)
    } else if (notEvaluatedData.items) {  
      const [reports] = notEvaluatedData?.items?.filter(report => report.subject === examId)
      
      setNotEvaluated(reports)
    }

  }, [examId])


  const handleChangePage = (page: number) => {
    setPage(page)
    setIsPageChange(true)
    setIsUpdateData(true)
  }

  const handleChangeLimit = (limit: number) => {
    setLimit(limit)
    setIsUpdateData(true)
  }

  const handleChangeSerie = (e) => {
    changeSerie(e ? e.target.value : null);
    changeYear(null);

    if (!disableCounty) {
      changeCounty(null);
    }

    if (!disableSchool) {
      changeSchool(null);
    }
    
    changeEdition(null);
    changeSchoolClass(null);
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
    <PageContainer>
      <TopFilterSerie
        title={"Relatório de Não Avaliados"}
        serie={serie}
        changeSerie={handleChangeSerie}
      />
      <ReportFilter
        isDisableYear={!serie}
        isDisable={onDisableReportFilter()}
        yearOrder="DESC"
      />
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <section>
            <header>
              {
                isGraphVisible && (
                  <>
                  <Box sx={{ width: '100%' }}>
                    <SubjectsFilter examId={examId} setExamId={setExamId} subjects={examList} />
                    <ReportBreadcrumb
                      onPress={onPressBreadcrump}
                      isDisabledCounty={disableCounty}
                      isDisabledSchool={disableSchool}
                    />
                  </Box>
                  <ExportReportNaoAvaliados handlePrint={handlePrint} />
                  </>
                )
              }
            </header>
            <GraphNaoAvaliados visible={isGraphVisible} notEvaluatedStudents={notEvaluatedStudentes} notEvaluated={notEvaluated} level={level} />
            <TableNaoAvaliadosGrouped notEvaluated={notEvaluated} notEvaluatedStudents={notEvaluatedStudentes} level={level} levelName={levelName} isLoading={false} />
            <TableReportNaoAvaliados notEvaluated={notEvaluated} notEvaluatedStudents={notEvaluatedStudentes} level={level} />
            <GeneratePdfPage
              componentRef={componentRef}
              notEvaluatedData={notEvaluatedData}
              notEvaluated={notEvaluated}
              notEvaluatedStudentes={notEvaluatedStudentes}
              page={page}
              level={level}
              levelName={levelName}
              isGraphVisible={isGraphVisible}
              handleChangePage={handleChangePage}
              handleChangeLimit={handleChangeLimit}
              subjects={examList}
            />              
          </section>
        </>
      )}
    </PageContainer>
  )
}

function GeneratePdfPage({
  componentRef,
  notEvaluatedData,
  notEvaluated,
  notEvaluatedStudentes,
  isGraphVisible,
  level,
  levelName,
  page,
  handleChangePage,
  handleChangeLimit,
  subjects
}) {

  
  function getData(id: string) {
    let data

    if (notEvaluatedData?.items) {
      data = notEvaluatedData?.items?.filter(report => report.subject === id)[0]
    }

    return data
  }
  

  return (
      <div className="pdf">
        <div ref={componentRef} className="print-container">
          <PageContainer>
            <section>
              <ReportBreadcrumb onPress={null} />
            </section>
            {
              subjects.map((subject) => (
                <div key={subject}>
                  <Title>Matéria: <strong>{subject}</strong></Title>
                  <GraphNaoAvaliados
                    visible={isGraphVisible}
                    notEvaluatedStudents={getData(subject)}
                    notEvaluated={getData(subject)}
                    level={level}
                    isPDF={true}
                  />
                  <TableNaoAvaliadosGrouped
                    notEvaluated={getData(subject)}
                    notEvaluatedStudents={getData(subject)}
                    level={level}
                    levelName={levelName}
                    isLoading={false}
                  />
                  <TableReportNaoAvaliados
                    notEvaluated={getData(subject)}
                    notEvaluatedStudents={getData(subject)}
                    level={level}
                    page={page}
                    changePage={handleChangePage}
                    changeLimit={handleChangeLimit}
                  />
                </div>
              ))
            }
          </PageContainer>
        </div>
      </div>
  );
}


RelatorioNaoAvaliados.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout header={"Relatório de Não Avaliados"}>{page}</Layout>
  )
}