import { Box } from "@mui/material"
import { useRouter } from "next/router"
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
import { withSSRAuth } from "src/utils/withSSRAuth"

export default function RelatorioCorRaca() {
  const { user } = useAuth()
  const { handlePrint, componentRef } = useGenearePdf();
  const { mapBreadcrumb } = useBreadcrumbContext()
  const router = useRouter();
  const [ isLoading, setIsLoading ] = useState<boolean>(false)

  const {
    serie,
    epv,
    type,
    state,
    county,
    school,
    edition,
    isUpdateData,
    setIsUpdateData,
    changeSerie,
    changeYear,
    changeEpv,
    changeType,
    changeState,
    changeStateRegional,
    changeCounty,
    changeCountyRegional,
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
    const _year = mapBreadcrumb.find((data) => data.level === "year");
    const _state = mapBreadcrumb.find((data) => data.level === "state");
    const _stateRegional = mapBreadcrumb.find((data) => data.level === "regional");
    const _county = mapBreadcrumb.find((data) => data.level === "county");
    const _countyRegional = mapBreadcrumb.find((data) => data.level === "regionalSchool");
    const _school = mapBreadcrumb.find((data) => data.level === "school");
    const _schoolClass = mapBreadcrumb.find((data) => data.level === "schoolClass");

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

    const dataReports = await getReportRace({
      serie: serie?.SER_ID,
      year: _year?.id,
      isEpvPartner: epv === 'Exclusivo Epv' ? 1 : 0,
      typeSchool: type === 'PUBLICA' ? null : type,
      stateId: _state?.id,
      stateRegionalId: _stateRegional?.id,
      county: _county?.id,
      municipalityOrUniqueRegionalId: _countyRegional?.id,
      school: _school?.id,
      schoolClass: _schoolClass?.id
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

  const handleChangeSerie = (newValue, add = false) => {
    changeSerie(newValue);
    changeYear(null);
    changeEpv(null);
    changeType(null);
    changeState(null);
    changeStateRegional(null);
    changeCountyRegional(null);

    if(add){
      const url = window.location.href.split('?serie=')
      const newUrl = url[0].concat('?serie=' + newValue?.SER_ID)
      window.history.pushState({ path: newUrl }, '', newUrl);
    }

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
        isSaev={user?.USU_SPE?.role === 'SAEV'}
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