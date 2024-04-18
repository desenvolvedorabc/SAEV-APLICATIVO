import { Box } from "@mui/material"
import { ReactElement, useCallback, useEffect, useState } from "react"
import Layout from "src/components/layout"
import { Loading } from "src/components/Loading"
import PageContainer from "src/components/pageContainer"
import { ExportReportCorRaca } from "src/components/relatorioCorRaca/exportData"
import ListGraphsReportRace from "src/components/relatorioCorRaca/ListGraphsReportRace"
import { SubjectsFilter } from "src/components/relatorioCorRaca/subjectFilter"
import { TableData } from "src/components/relatorioCorRaca/tableData/tableData"
import { ReportBreadcrumb } from "src/components/reportBreadcrumb"
import { ReportFilter } from "src/components/reportFilter"
import { TopFilterSerie } from "src/components/topFilterSerie"
import { useAuth } from "src/context/AuthContext"
import { useBreadcrumbContext } from "src/context/breadcrumb.context"
import { RootObject, SubjectProps, getReportRace } from "src/services/report-race.service"
import { useGenearePdf } from "src/utils/generatePdf"

export default function RelatorioCorRaca() {
  const { user } = useAuth()
  const { handlePrint, componentRef } = useGenearePdf();
  const { mapBreadcrumb } = useBreadcrumbContext()

  const [ isLoading, setIsLoading ] = useState<boolean>(false)

  const {
    county,
    school,
    edition,
    serie,
    isUpdateData,
    setIsUpdateData,
    changeSerie,
    changeYear,
    changeCounty,
    changeSchool,
    changeSchoolClass,
    changeEdition,
    handleClickBreadcrumb,
    clickBreadcrumb,
    visibleBreadcrumbs,
    hideBreadcrumbs
  } = useBreadcrumbContext()

  const [ reportRaceData, setReportRaceData ] = useState<RootObject>({} as RootObject)
  const [ reportRace, setReportRace ] = useState<SubjectProps>({} as SubjectProps)
  const [disableCounty, setDisableCounty] = useState<boolean>(false)
  const [disableSchool, setDisableSchool] = useState<boolean>(false)
  const [ isGraphVisible, setIsGraphVisible ] = useState<boolean>(false)
  const [ examId, setExamId ] = useState<string>('Leitura')
  const [ level, setLevel ] = useState<string>('')
  const [ subjects, setSubjects ] = useState<string[]>()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function loadData() {
    setIsLoading(true)

    const year = mapBreadcrumb.find((data) => data.level === "year")
    const schoolClass = mapBreadcrumb.find(
      (data) => data.level === "schoolClass"
    )

    const dataReports = await getReportRace({
      serie: serie?.SER_ID,
      year: year?.id,
      county: county?.AVM_MUN?.MUN_ID,
      school: school?.ESC_ID,
      schoolClass: schoolClass?.id
    })

    if (dataReports.items.length > 0) {
      setLevel(dataReports.items[0].level)
    }

    if (dataReports.items.length === 0) {
      setIsLoading(false)
      setIsGraphVisible(false)
      return
    }

    setSubjects(dataReports?.items?.map(item => item.subject))

    setReportRaceData(dataReports)

    setIsGraphVisible(true)
    setIsLoading(false)
  }

  const filterDataByExam = (id: string) => {
    const [ report ] = reportRaceData.items.filter(report => report.subject === id)
    
    if (!report) {
      const data: any = {}
      return setReportRace(data)
    }
    
    setReportRace(report)
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

  const onPressBreadcrump = useCallback(() => {
    handleClickBreadcrumb(!clickBreadcrumb)
  }, [
    handleClickBreadcrumb,
    clickBreadcrumb,
  ])

  useEffect(() => {
    if (isUpdateData || visibleBreadcrumbs) {
      loadData()
      hideBreadcrumbs()
      setIsUpdateData(false)
    }
  }, [
    visibleBreadcrumbs,
    isUpdateData,
    hideBreadcrumbs,
    setIsUpdateData,
    loadData,
  ])

  useEffect(() => {
    setIsLoading(true)
    if (examId && reportRaceData?.items) {
      filterDataByExam(examId)
    }
    setIsLoading(false)
  }, [examId, reportRaceData])

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
        title={"Resultado: Cor/Raça"}
        serie={serie}
        changeSerie={handleChangeSerie}
        orderBy="DESC"
      />
      <ReportFilter
        isDisableYear={!serie}
        isDisable={onDisableReportFilter()}
        yearOrder="DESC"
        isEdition={false}
      />
      {isLoading ? 
        <Loading />
        :
        <>
          <section>
            <header>
              {
                isGraphVisible && (
                  <>
                    <Box sx={{ width: '100%' }}>
                      <SubjectsFilter
                        examId={examId}
                        setExamId={setExamId}
                        subjects={subjects}
                        />
                      <ReportBreadcrumb
                        onPress={onPressBreadcrump}
                        isDisabledCounty={disableCounty}
                        isDisabledSchool={disableSchool}
                        />
                    </Box>
                    <ExportReportCorRaca handlePrint={handlePrint} />
                  </>
                )
              }
            </header>
          </section>
          {
            (isGraphVisible && reportRace) ? (
              <>
              <section>
                <TableData reportRace={reportRace} serieNumber={serie?.SER_NUMBER} exam={examId}/>
              </section>
              <section style={{marginTop: '25px'}}>
                <ListGraphsReportRace reportRace={reportRace} exam={examId} />
              </section>
              
              <GeneratePdfPage
                componentRef={componentRef}
                reportRace={reportRace}
                examId={examId}
                serieNumber={serie?.SER_NUMBER}
                />
              </>
            ) : isLoading && (
              <Loading />
              )
            }
        </>
      }
    </PageContainer>
  )
}

function GeneratePdfPage({
  componentRef,
  reportRace,
  examId,
  serieNumber,
}) {
  
  return (
      <div className="pdf">
        <div ref={componentRef} className="print-container">
          <PageContainer>
            <section>
              <ReportBreadcrumb onPress={null} />
            </section>
            <section>
              <TableData reportRace={reportRace} serieNumber={serieNumber} exam={examId} />
            </section>
            <section style={{marginTop: '25px'}}>
              <ListGraphsReportRace reportRace={reportRace} exam={examId} isPDF />
            </section>
          </PageContainer>
        </div>
      </div>
  );
}

RelatorioCorRaca.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout header={"Resultado: Cor/Raça"}>{page}</Layout>
  )
}