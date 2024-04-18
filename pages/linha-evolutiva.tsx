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
import { GraphEvolutionaryLine } from "src/components/GraphEvolutionaryLine";
import { TableEvolutionaryLine } from "src/components/tables/TableEvolutionaryLine";
import { CSVLink } from "react-csv";

import * as S from "../styles/pages/linha-evolutiva.styles";
import { SearchEvolutionaryLine } from "src/components/SearchEvolutionaryLine";
import {
  getEvolutionaryLine,
  getEvolutionaryLineStudent,
} from "src/services/evolutiva.service";
import { withSSRAuth } from "src/utils/withSSRAuth";
import Top from "src/components/top";
import { useAuth } from "src/context/AuthContext";

interface Data {
  EDICAO: string;
  MATERIA: string;
  PARTICIPACAO: string;
  ACERTOS: number;
  TOTAL_ALUNOS: number;
}

function createData(
  EDICAO: string,
  MATERIA: string,
  PARTICIPACAO: string,
  ACERTOS: number,
  TOTAL_ALUNOS: number
): Data {
  return {
    EDICAO,
    MATERIA,
    PARTICIPACAO,
    ACERTOS,
    TOTAL_ALUNOS,
  };
}

interface DataStudent {
  EDICAO: string;
  MATERIA: string;
  PARTICIPACAO: string;
  ACERTOS: number;
}

function createDataStudent(
  EDICAO: string,
  MATERIA: string,
  PARTICIPACAO: string,
  ACERTOS: number
): DataStudent {
  return {
    EDICAO,
    MATERIA,
    PARTICIPACAO,
    ACERTOS,
  };
}

export default function LinhaEvolutiva() {
  const {user} = useAuth()
  const [selectTypeButton, setSelectTypeButton] = useState("general");
  const [csv, setCsv] = useState([]);
  const [infoList, setInfoList] = useState(null);
  const [yearStudent, setYearStudent] = useState(null);
  const [student, setStudent] = useState(null);
  const csvLink = useRef(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [listSubjects, setListSubjects] = useState([]);
  const {
    serie,
    changeSerie,
    changeYear,
    changeCounty,
    changeSchool,
    changeSchoolClass,
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
    let county = mapBreadcrumb.find((x) => x.level === "county");
    let school = mapBreadcrumb.find((x) => x.level === "school");
    let schoolClass = mapBreadcrumb.find((x) => x.level === "schoolClass");

    let list = [];
    const tempCsv = [];
    let resp = null;
    
    if (selectTypeButton === "general") {
      resp = await getEvolutionaryLine(
        1,
        999999,
        serie?.SER_ID,
        year?.id,
        county?.id,
        school?.id,
        schoolClass?.id
      );

      let _listSubjects = [];
      resp?.data?.items?.map((x) => {
        x.subjects.map((subject) => {
          if (!_listSubjects.find(x => x.id === subject.id))
            _listSubjects.push(subject);
        });
      });

      setListSubjects(_listSubjects?.sort((a,b) => a.id - b.id));

      setIsLoading(false);

      tempCsv.push([
        "EDIÇÃO",
        "MATÉRIA",
        "PARTICIPAÇÃO",
        "ACERTOS",
        "TOTAL_ALUNOS",
      ]);

      resp?.data?.items?.map((x) => {
        x?.subjects.map((subject) => {
          list.push(
            createData(
              x.name,
              subject.name,
              subject.percentageFinished,
              subject.percentageRightQuestions,
              subject.totalStudents
            )
          );
        });
      });
    } else {
      resp = await getEvolutionaryLineStudent(
        serie,
        yearStudent,
        student.ALU_ID
      );

      let _listSubjects = [];
      resp?.data?.items?.map((x) => {
        x.subjects.map((subject) => {
          if (!_listSubjects.find(x => x.id === subject.id))
            _listSubjects.push(subject);
        });
      });

      setListSubjects(_listSubjects?.sort((a,b) => a.id - b.id));
      setIsLoading(false);

      tempCsv.push(["EDIÇÃO", "MATÉRIA", "PARTICIPAÇÃO", "ACERTOS"]);

      resp?.data?.items?.map((x) => {
        x?.subjects.map((subject) => {
          list.push(
            createDataStudent(
              x.name,
              subject.name,
              subject.isParticipated ? "Participou" : "Não participou",
              subject.totalRightQuestions
            )
          );
        });
      });
    }

    setInfoList(resp.data?.items);

    const listCSV = JSON.parse(JSON.stringify(list));
    listCSV.map((item) => {
      tempCsv.push(Object.values(item));
    });
    setCsv(tempCsv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapBreadcrumb, selectTypeButton, yearStudent, student]);

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

  const downloadCsv = () => {
    csvLink.current.link.click();
  };
  function handleSelectSubject(type: string) {
    setSelectTypeButton(type);
    setInfoList([]);
    setListSubjects([]);
  }

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
          title="Linha Evolutiva"
        />
        <S.ContentButton>
          <button
            className={selectTypeButton === "general" && "active"}
            onClick={() => handleSelectSubject("general")}
          >
            Visão geral
          </button>
          <button
            className={selectTypeButton === "student" && "active"}
            onClick={() => handleSelectSubject("student")}
          >
            Por Aluno
          </button>
        </S.ContentButton>

        <div
          style={{
            display: selectTypeButton !== "general" ? "none" : "block",
          }}
        >
          <ReportFilter isSerieFirst={true} isDisable={onDisableReportFilter()} isEdition={false} />
        </div>
        {selectTypeButton === "student" && (
          <SearchEvolutionaryLine
            changeYear={setYearStudent}
            changeStudent={setStudent}
            updateStudent={updateStudent}
          />
        )}
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

                <GraphEvolutionaryLine
                  info={infoList}
                  subjects={listSubjects}
                  type={selectTypeButton}
                  year={yearStudent}
                  studentName={student?.ALU_NOME}
                />

                <TableEvolutionaryLine
                  info={infoList}
                  subjects={listSubjects}
                  type={selectTypeButton}
                />
              </ContainerScore>
            )}
          </>
        )}
        <GeneratePdfPage
          componentRef={componentRef}
          infoList={infoList}
          listSubjects={listSubjects}
          selectTypeButton={selectTypeButton}
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
  listSubjects,
  selectTypeButton,
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
              <GraphEvolutionaryLine
                isPdf={true}
                info={infoList}
                subjects={listSubjects}
                type={selectTypeButton}
              />
              <div className="page-break" />

              <TableEvolutionaryLine
                info={infoList}
                subjects={listSubjects}
                type={selectTypeButton}
              />
            </ContainerScore>
          )}
        </PageContainer>
      </div>
    </div>
  );
}

LinhaEvolutiva.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={"Linha Evolutiva"}>{page}</Layout>;
};

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    return {
      props: {},
    };
  },
  {
    roles: ["REL", "LIN_EVO"],
  }
);
