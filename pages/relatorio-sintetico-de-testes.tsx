import { Box } from "@mui/material"
import { ReactElement, useCallback, useEffect, useState } from "react"
import Layout from "src/components/layout"
import { Loading } from "src/components/Loading"
import PageContainer from "src/components/pageContainer"
import { ExportReportSynthetic } from "src/components/reportSynthetic/exportData"
import { SubjectsFilter } from "src/components/relatorioCorRaca/subjectFilter"
import { ReportBreadcrumb } from "src/components/reportBreadcrumb"
import { ReportFilter } from "src/components/reportFilter"
import TablePercentReading from "src/components/reportSynthetic/TablePercentReading"
import TableSelectedAnswer from "src/components/reportSynthetic/TableSelectedAnswer"
import { TopFilterSerie } from "src/components/topFilterSerie"
import { useAuth } from "src/context/AuthContext"
import { useBreadcrumbContext } from "src/context/breadcrumb.context"
import { getReportSynthetic, SubjectProps } from "src/services/report-synthetic"
import { useGenearePdf } from "src/utils/generatePdf"

export default function RelatorioSintetico() {
  const { user } = useAuth()
  const { handlePrint, componentRef } = useGenearePdf();

  const [ isLoading, setIsLoading ] = useState<boolean>(false)

  const {
    year,
    county,
    school,
    edition,
    serie,
    schoolClass,
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

  const [ reportSyntheticData, setReportSyntheticData ] = useState<SubjectProps[]>([] as SubjectProps[])
  const [ reportSynthetic, setReportSynthetic ] = useState<SubjectProps>({} as SubjectProps)
  const [ isGraphVisible, setIsGraphVisible ] = useState<boolean>(false)
  const [ subjects, setSubjects ] = useState<string[]>()
  const [ examId, setExamId ] = useState<string>()
  const [ listEmpty, setListEmpty ] = useState<boolean>(false)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function loadData() {
    setIsLoading(true)
    
    const dataReports = await getReportSynthetic({
      year: year?.ANO,
      edition: edition?.AVA_ID,
      county: county?.AVM_MUN?.MUN_ID,
      serie: serie?.SER_ID,
      school: school?.ESC_ID,
      schoolClass: schoolClass?.TUR_ID
    })
    
    if (dataReports?.items?.length === 0 || Object.keys(dataReports).length === 0) {
      setIsLoading(false)
      setIsGraphVisible(false)
      setListEmpty(true)
      return
    }

    const data = dataReports.items.filter(item => item.typeSubject !== 'Leitura')

    
    const list = data?.map(item => item.subject)
    const listOrdered = list.sort((a, b) => a.localeCompare(b))
    setExamId(listOrdered[0])
    setSubjects(listOrdered)

    setReportSyntheticData(data)

    setIsGraphVisible(true)
    setListEmpty(false)
    setIsLoading(false)
  }

  const filterDataByExam = (id: string) => {
    const [ report ] = reportSyntheticData.filter(report => report.subject === id)
    
    if (!report) {
      const data: any = {}
      return setReportSynthetic(data)
    }
    
    setReportSynthetic(report)
  }

  const handleChangeSerie = (e) => {
    changeSerie(e ? e.target.value : null);
    changeYear(null);
    changeCounty(null);
    changeSchool(null);
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
    if (examId && reportSyntheticData) {
      filterDataByExam(examId)
    }
    setIsLoading(false)
  }, [examId, reportSyntheticData])

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
        title={"Relatório Sintético de Testes"}
        serie={serie}
        changeSerie={handleChangeSerie}
        orderBy="DESC"
      />
      <ReportFilter
        isDisableYear={!serie}
        isDisable={onDisableReportFilter()}
        yearOrder="DESC"
      />
      {isLoading ? 
        <Loading />
        :
        <div style={{ backgroundColor: '#fff'}}>
          {listEmpty ? 
            <div style={{ padding: 10 }}>Nenhum resultado encontrado</div> 
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
                          />
                        </Box>
                        <ExportReportSynthetic handlePrint={handlePrint} />
                      </>
                    )
                  }
                </header>
              </section>
              {
                (isGraphVisible && reportSynthetic) ? (
                  <>
                    <section>
                      <TableSelectedAnswer report={reportSynthetic} />
                    </section>
                    <div style={{
                      borderBottom: '1px solid #d5d5d5',
                      margin: '25px',
                    }}></div>
                    <section>
                      <TablePercentReading report={reportSynthetic} />
                    </section>
                  
                    <GeneratePdfPage
                      componentRef={componentRef}
                      reportSynthetic={reportSynthetic}
                    />
                </>
                ) : isLoading && (
                  <Loading />
                )
              }
            </>
          }
        </div>
      }
    </PageContainer>
  )
}

function GeneratePdfPage({
  componentRef,
  reportSynthetic,
}) {
  
  return (
      <div className="pdf">
        <div ref={componentRef} className="print-container">
          <PageContainer>
            <section>
              <ReportBreadcrumb onPress={null} />
            </section>
            <section>
              <TableSelectedAnswer report={reportSynthetic} isPdf />
            </section>
            <div style={{
              borderBottom: '1px solid #d5d5d5',
              margin: '25px',
            }} className="page-break"></div>
            <section>
              <TablePercentReading report={reportSynthetic} isPdf />
            </section>
          </PageContainer>
        </div>
      </div>
  );
}

RelatorioSintetico.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout header={"Relatório Sintético de Testes"}>{page}</Layout>
  )
}