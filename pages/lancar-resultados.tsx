import PageContainer from "src/components/pageContainer";
import { useState, useEffect } from "react";
import Layout from "src/components/layout";
import type { ReactElement } from "react";
import { ContentReleasesFilter } from "src/components/lancarResultado/contentReleasesFilter";
import { useBreadcrumbContext } from "src/context/breadcrumb.context";
import Top from "src/components/top";
import { ContentInfoDataAndOptionsSubject } from "src/components/lancarResultado/ContentInfoDataAndOptionsSubject";
import { ContentReleasesStudent } from "src/components/lancarResultado/ContentReleasesStudent";
import {
  getReleasesResults,
  ReleasesResults,
} from "src/services/lancar-resultados.service";
import { withSSRAuth } from "src/utils/withSSRAuth";
import { parseCookies } from "nookies";

export default function LancarResultados({url}) {
  const [releaseResults, setReleaseResults] = useState<ReleasesResults[]>([]);
  const [selectedReleaseSubject, setSelectedReleaseSubject] =
    useState<ReleasesResults>({} as ReleasesResults);
  const [subject, setSubject] = useState(null);
  const [orderBy, setOrderBy] = useState("porMenor");
  const [studentSelect, setStudentSelect] = useState("");
  const [visualizationBy, setVisualizationBy] = useState("porCarrousel");
  const [county, setCounty] = useState(null);
  const [school, setSchool] = useState(null);
  const [serie, setSerie] = useState(null);
  const [schoolClass, setSchoolClass] = useState(null);
  const [edition, setEdition] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResetIndex, setIsResetIndex] = useState(0);
  const [countFinished, setCountFinished] = useState(0);

  const { resetBreadcrumbs, handleUnClickBar } = useBreadcrumbContext();

  useEffect(() => {
    resetBreadcrumbs();
    handleUnClickBar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSelectSubject(type: string) {
    setSubject(type);
    if(type !== subject) {
      loadStudents(true, true);
    }
  }

  function handleChangeOrderBy(e) {
    setOrderBy(e.target.id);
  }

  function handleSelectStudent(e) {
    setStudentSelect(e.target.id);
  }

  function handleChangeVisualizationOrderBy(e) {
    setVisualizationBy(e.target.id);
  }

  async function loadStudents(keepSubject, keepStudent) {
    setIsLoading(true);
    const releases = await getReleasesResults(
      1,
      99999,
      "FINALIZADO",
      "DESC",
      county?.MUN_ID,
      school?.ESC_ID,
      schoolClass?.TURMA_TUR_ID,
      null,
      edition?.AVA_ID,
      serie?.SER_ID,
    );
    let filterData = releases?.data?.filter(
      (data) => !!data?.subjects[0]?.students?.length
    );

    filterData = filterData.filter(function (a) {
      return (
        !this[JSON.stringify(a?.subjects[0].DIS_NOME)] &&
        (this[JSON.stringify(a?.subjects[0].DIS_NOME)] = true)
      );
    }, Object.create(null));

    setReleaseResults(filterData);
    setSelectedReleaseSubject(filterData[0]);
    if(!keepSubject){
      setSubject(filterData[0]?.subjects[0]?.DIS_NOME ?? "");
      setCountFinished(filterData[0]?.subjects[0]?.total?.finished ?? 0);
    } 
    // else{
    //   filterData[0]?.subjects
    // }
    setIsLoadingData(false);
    setIsLoading(false);
    if(!keepStudent){
      setStudentSelect("");
      console.log('alterou')
    }
  }

  useEffect(() => {
    if (isLoadingData) {
      loadStudents(false, false);
    }
  }, [edition, serie, isLoadingData, county, school, schoolClass]);

  useEffect(() => {
    const handleSelectReleaseSubject = releaseResults.find(
      (data) => data.subjects[0].DIS_NOME === subject
    );
    

    setSelectedReleaseSubject(handleSelectReleaseSubject);
    setCountFinished(
      handleSelectReleaseSubject?.subjects[0]?.total?.finished ?? 0
    );
    setIsResetIndex(1);
  }, [releaseResults, subject]);

  return (
    <>
      <PageContainer>
        <Top title="Lançar Resultados" />
        <ContentReleasesFilter
          changeCounty={setCounty}
          changeSchool={setSchool}
          changeSerie={setSerie}
          changeSchoolClass={setSchoolClass}
          changeEdition={setEdition}
          setIsLoadingData={setIsLoadingData}
        />

        {isLoading && (
          <div className="d-flex align-items-center flex-column mt-5">
            <div className="spinner-border" role="status"></div>
          </div>
        )}

        {!isLoading && selectedReleaseSubject?.subjects?.length && (
          <>
            <ContentInfoDataAndOptionsSubject
              isSchoolClass={false}
              subject={subject}
              students={selectedReleaseSubject?.subjects[0].students}
              selectedReleaseSubject={selectedReleaseSubject}
              handlePrint={() => {}}
              countFinished={countFinished}
              handleCsv={() => {}}
              releasesResults={releaseResults}
              selectSubject={handleSelectSubject}
              studentSelect={studentSelect}
              setStudentSelect={handleSelectStudent}
              orderBy={orderBy}
              visualizationBy={visualizationBy}
              changeVisualizationBy={handleChangeVisualizationOrderBy}
              changeOrderBy={handleChangeOrderBy}
              county = {county}
              edition={edition}
            />

            <ContentReleasesStudent
              orderBy={orderBy}
              setIsLoadingData={setIsLoadingData}
              selectedReleaseSubject={selectedReleaseSubject}
              studentSelect={studentSelect}
              visualizationBy={visualizationBy}
              subject={subject}
              countFinished={countFinished}
              setCountFinished={setCountFinished}
              isResetIndex={isResetIndex}
              setIsResetIndex={setIsResetIndex}
              url={url}
            />
          </>
        )}
      </PageContainer>
    </>
  );
}

LancarResultados.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={"Lançar Resultados"}>{page}</Layout>;
};

export const getServerSideProps = withSSRAuth(
  async function getServerSideProps(context) {
    let cookies = parseCookies(context);

    return {
      props: {
        url: process.env.NEXT_PUBLIC_API_URL,
      },
    };
  },
  {
    roles: ["LAN_RES"],
  }
);