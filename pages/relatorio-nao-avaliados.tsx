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
import { useRouter } from "next/router"
import { withSSRAuth } from "src/utils/withSSRAuth"

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
  const [level, setLevel] = useState<string>()
  const [disableCounty, setDisableCounty]  = useState<boolean>(false)
  const [disableSchool, setDisableSchool]  = useState<boolean>(false)
  const [ examList, setExamList ] = useState<string[]>([])
  const [ examId, setExamId ] = useState<string>('Leitura')
  const router = useRouter();

  const {
    serie,
    edition,
    state,
    epv,
    type,
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
  async function loadData() {
    setIsLoading(true)
    
    const _year = mapBreadcrumb.find((data) => data.level === "year");
    const _edition = mapBreadcrumb.find((data) => data.level === "edition");
    const _state = mapBreadcrumb.find((data) => data.level === "state");
    const _stateRegional = mapBreadcrumb.find((data) => data.level === "regional");
    const _county = mapBreadcrumb.find((data) => data.level === "county");
    const _countyRegional = mapBreadcrumb.find((data) => data.level === "regionalSchool");
    const _school = mapBreadcrumb.find((data) => data.level === "school");
    const _schoolClass = mapBreadcrumb.find((data) => data.level === "schoolClass");

    // let newUrl = `${router.pathname}?`
      
    // if(serie) newUrl = newUrl.concat('serie=' + serie?.SER_ID)
    // if(_year) newUrl = newUrl.concat('&year=' + _year?.id)
    // if(_edition) newUrl = newUrl.concat('&edition=' + _edition?.id)
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

    const subject: string | null = examId || null    
    
    const dataReports = await getNotEvaluated(
      serie?.SER_ID,
      _year?.id,
      _edition?.id,
      epv === 'Exclusivo Epv' ? 1 : 0,
      type === 'PUBLICA' ? null : type,
      _state?.id,
      _stateRegional?.id,
      _county?.id,
      _countyRegional?.id,
      _school?.id,
      _schoolClass?.id,
    )
    setLevel(dataReports?.items[0]?.level)

    if (dataReports?.items[0]?.level === 'student') {
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
    if (level === 'student') {      
      const [reports] = notEvaluatedData?.items?.filter(report => report.subject === examId)      

      setNotEvaluatedStudentes(reports)
    } else if (notEvaluatedData.items) {  
      const [reports] = notEvaluatedData?.items?.filter(report => report.subject === examId)
      
      setNotEvaluated(reports)
    }
  }, [examId])

  const handleChangeSerie = (newValue, add = false) => {
    changeSerie(newValue);
    changeYear(null);

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
        title={"Relatório de Não Avaliados"}
        serie={serie}
        changeSerie={handleChangeSerie}
      />
      <ReportFilter
        isDisableYear={!serie}
        isDisable={onDisableReportFilter()}
        isSaev={user?.USU_SPE?.role === 'SAEV'}
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
            <TableNaoAvaliadosGrouped notEvaluated={notEvaluated} notEvaluatedStudents={notEvaluatedStudentes} level={level} />
            <TableReportNaoAvaliados notEvaluated={notEvaluated} notEvaluatedStudents={notEvaluatedStudentes} level={level} />
            <GeneratePdfPage
              componentRef={componentRef}
              notEvaluatedData={notEvaluatedData}
              level={level}
              isGraphVisible={isGraphVisible}
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
  isGraphVisible,
  level,
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
                  />
                  <TableReportNaoAvaliados
                    notEvaluated={getData(subject)}
                    notEvaluatedStudents={getData(subject)}
                    level={level}
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