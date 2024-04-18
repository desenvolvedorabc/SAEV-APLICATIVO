import { ReactElement, useEffect, useState, useRef, useCallback } from "react";
import { ButtonMenu } from "src/components/ButtonMenu";
import { ContainerScore } from "src/components/containerScore";
import { GraphNivel } from "src/components/graphNivel";
import Layout from "src/components/layout";
import PageContainer from "src/components/pageContainer";
import { ReportBreadcrumb } from "src/components/reportBreadcrumb";
import { ReportFilter } from "src/components/reportFilter";
import { TableNivelPerformance } from "src/components/tables/TableNivelPerformance";
import { TopFilterSerie } from "src/components/topFilterSerie";
import { getNivels } from "src/services/nivel.service";
import { useGenearePdf } from "src/utils/generatePdf";
import { CSVLink } from "react-csv";
import { useBreadcrumbContext } from "src/context/breadcrumb.context";
import { withSSRAuth } from "src/utils/withSSRAuth";
import Camelize from "src/utils/camelize";
import { ButtonSubject } from "src/shared/styledComponentsRelatorios";
import { useAuth } from "src/context/AuthContext";

interface Data {
  TOTAL_ALUNOS_NIVEL_1: number;
  TOTAL_ALUNOS_NIVEL_2: number;
  TOTAL_ALUNOS_NIVEL_3: number;
  TOTAL_ALUNOS_NIVEL_4: number;
  TOTAL_ALUNOS: number;
  TURMA: string;
  NIVEL_TURMA: number;
  COD_DESCRITOR: string;
  DESCRITOR: string;
  VALOR: number;
}

function createData(
  TOTAL_ALUNOS_NIVEL_1: number,
  TOTAL_ALUNOS_NIVEL_2: number,
  TOTAL_ALUNOS_NIVEL_3: number,
  TOTAL_ALUNOS_NIVEL_4: number,
  TOTAL_ALUNOS: number,
  TURMA: string,
  NIVEL_TURMA: number,
  COD_DESCRITOR: string,
  DESCRITOR: string,
  VALOR: number
): Data {
  return {
    TOTAL_ALUNOS_NIVEL_1,
    TOTAL_ALUNOS_NIVEL_2,
    TOTAL_ALUNOS_NIVEL_3,
    TOTAL_ALUNOS_NIVEL_4,
    TOTAL_ALUNOS,
    TURMA,
    NIVEL_TURMA,
    COD_DESCRITOR,
    DESCRITOR,
    VALOR,
  };
}

interface DataStudent {
  NOME: string;
  TURMA: string;
  ESCOLA: string;
  QUESTAO: number;
  ALTERNATIVA_ESCOLHIDA: string;
  ACERTO: boolean;
}

function createDataStudent(
  NOME: string,
  TURMA: string,
  ESCOLA: string,
  QUESTAO: number,
  ALTERNATIVA_ESCOLHIDA: string,
  ACERTO: boolean
): DataStudent {
  return {
    NOME,
    TURMA,
    ESCOLA,
    QUESTAO,
    ALTERNATIVA_ESCOLHIDA,
    ACERTO,
  };
}


interface DataExport {
  MATERIA: string;
  TIPO: string;
  NOME: string;
  COD_DESCRITOR: number;
  DESCRITOR: string;
  VALOR: number;
  MEDIA: number;
}

function createDataExport(
  MATERIA: string,
  TIPO: string,
  NOME: string,
  COD_DESCRITOR: number,
  DESCRITOR: string,
  VALOR: number,
  MEDIA: number,
): DataExport {
  return {
    MATERIA,
    TIPO,
    NOME,
    COD_DESCRITOR,
    DESCRITOR,
    VALOR,
    MEDIA,
  };
}

export default function NivelDesempenho() {
  const {user} = useAuth()
  const [nivelList, setNivelList] = useState(null);
  const [order, setOrder] = useState("ASC");
  const [csv, setCsv] = useState([]);
  const csvLink = useRef(undefined);
  const [level, setLevel] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [subject, setSubject] = useState(null);
  const [subjectList, setSubjectList] = useState([]);
  const [allData, setAllData] = useState(null);

  // const { handlePrint, componentRef } = useGenearePdf();

  const {
    changeSerie,
    changeYear,
    changeCounty,
    changeEdition,
    changeSchool,
    changeSchoolClass,
    serie,
    year,
    edition,
    county,
    school,
    hideBreadcrumbs,
    setIsUpdateData,
    mapBreadcrumb,
    isUpdateData,
    visibleBreadcrumbs,
    handleClickBreadcrumb,
    clickBreadcrumb,
    addBreadcrumbs,
    showBreadcrumbs,
  } = useBreadcrumbContext();

  const getNivelStage = (nivelStage) => {
    if (nivelStage === "min") return "Mínimo";
    if (nivelStage === "under") return "Abaixo da média";
    if (nivelStage === "med") return "Mediano";
    if (nivelStage === "max") return "Maior";
  };

  const loadInfos = useCallback(async () => {
    setIsLoading(true);
    let year = mapBreadcrumb.find((x) => x.level === "year");
    let edition = mapBreadcrumb.find((x) => x.level === "edition");
    let county = mapBreadcrumb.find((x) => x.level === "county");
    let school = mapBreadcrumb.find((x) => x.level === "school");
    let schoolClass = mapBreadcrumb.find((x) => x.level === "schoolClass");
    const resp = await getNivels(
      1,
      999999,
      order,
      serie?.SER_ID,
      year?.id,
      edition?.id,
      county?.id,
      school?.id,
      schoolClass?.id
    );

    setAllData(resp);

    setSubjectList(
      resp?.items?.map((subject) => {
        return { id: subject.id, nome: subject.name };
      })
    );
    if (!subject) setSubject({ id: resp?.items[0].id, nome: resp?.items[0].name });

    let nivel = resp?.items?.find((item) => item?.id === subject?.id)

    if(!nivel)
      nivel = resp?.items[0]
    
    setNivelList(nivel)

    let _level = "edition";
    if (edition?.id) _level = "county";
    if (county?.id) _level = "school";
    if (school?.id) _level = "schoolClass";
    if (schoolClass?.id) _level = "student";
    setLevel(_level);

    let list = [];
    let tempCsv = [];
    
      resp?.items.map((disciplina) => {
        disciplina.items.map((x) => {
          x.descriptors?.sort((a,b) => a.id - b.id)?.map((descritor) => {
            list.push(
              createDataExport(
                disciplina.name,
                disciplina.type,
                x.name,
                descritor.cod,
                descritor.description,
                descritor.value,
                x.value,
              )
            );
          });
        })
      });

      tempCsv.push([
        "MATÉRIA",
        "TIPO",
        "NOME",
        "COD_DESCRITOR",
        "DESCRITOR",
        "VALOR",
        "MÉDIA",
      ]);

    let listCSV = JSON.parse(JSON.stringify(list));

    listCSV.map((item) => {
      tempCsv.push(Object.values(item));
    });

    setCsv(tempCsv);

    setIsLoading(false);
  }, [serie, mapBreadcrumb, order]);

  const downloadCsv = () => {
    csvLink.current.link.click();
  };

  const handleChangeSerie = (e) => {
    changeSerie(e ? e.target.value : null);
    changeYear(null);
    changeEdition(null);
    changeCounty(null);
    changeSchool(null);
    changeSchoolClass(null);
    // resetBreadcrumbs();
    // handleUnClickBar();
    // handleClickBreadcrumb(null);
    // getNivels(page, limit, order, null, null, null, null, null, null);
  };

  useEffect(() => {
    if (isUpdateData || visibleBreadcrumbs) {
      loadInfos();

      hideBreadcrumbs();
      setIsUpdateData(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleBreadcrumbs, isUpdateData, hideBreadcrumbs, setIsUpdateData]);

  const onPressBreadcrumb = useCallback(() => {
    handleClickBreadcrumb(!clickBreadcrumb);
  }, [handleClickBreadcrumb, clickBreadcrumb]);

  function handleClickCell(cell) {
    if (nivelList.level === "school") {
      addBreadcrumbs(cell.id, cell.name, "school");
    }
    showBreadcrumbs();
    setIsUpdateData(true);
  }

  const getDisable = () => {
    if (serie && mapBreadcrumb.find((x) => x.level === "year")) {
      return false;
    }
    return true;
  };

  const selectSubject = (subject) => {
    setSubject(subject);

    setNivelList(allData?.items.find((item) => item.id === subject.id));
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
    <>
      <PageContainer>
        <TopFilterSerie
          title={"Nível de Desempenho >"}
          serie={serie}
          changeSerie={handleChangeSerie}
        />
        <ReportFilter isDisableYear={!serie} isDisable={onDisableReportFilter()} />
        {isLoading ? (
          <div className="d-flex align-items-center flex-column mt-5">
            <div className="spinner-border" role="status"></div>
          </div>
        ) : (
          <>
            <section>
              <header>
                <ReportBreadcrumb onPress={onPressBreadcrumb} />

                <ButtonMenu handlePrint={null} handleCsv={downloadCsv} />
              </header>
              <div style={{ backgroundColor: "#fff", padding: "10px 25px 0 25px" }}>
                {subjectList?.map((data, key) => (
                  <ButtonSubject
                    active={subject.id === data.id}
                    key={data?.id ?? key}
                    onClick={() => selectSubject(data)}
                  >
                    {Camelize(data.nome)}
                  </ButtonSubject>
                ))}
              </div>
              {nivelList && (
                <>
                  <ContainerScore>
                    <GraphNivel list={nivelList} level={level} />
                  </ContainerScore>
                  <div>
                    <TableNivelPerformance
                      item={nivelList}
                      handleClickCell={handleClickCell}
                      level={level}
                    />
                  </div>
                </>
              )}
            </section>
            {/* <GeneratePdfPage
              componentRef={componentRef}
              nivelList={nivelList}
              level={level}
              serie={serie}
            /> */}
            <CSVLink
              data={csv}
              filename="nivel_desempenho.csv"
              className="hidden"
              ref={csvLink}
              target="_blank"
            />
          </>
        )}
      </PageContainer>
    </>
  );
}

// function GeneratePdfPage({ componentRef, nivelList, level, serie }) {
//   const handleClickCell = () => {};

//   return (
//     <div className="pdf">
//       <div ref={componentRef} className="print-container">
//         <PageContainer>
//           <div className="d-flex justify-content-center mt-3">
//             <strong>Serie: {serie?.SER_NOME}</strong>
//           </div>
//           <ReportBreadcrumb onPress={() => {}} />
//           <section>
//             <ContainerScore>
//               <GraphNivel list={nivelList} level={level} />
//             </ContainerScore>
//             {/* <div className="page-break" />

//             <TableNivelPerformance
//               isPdf={true}
//               item={nivelList}
//               handleClickCell={handleClickCell}
//               level={level}
//             /> */}
//           </section>
//         </PageContainer>
//       </div>
//     </div>
//   );
// }

NivelDesempenho.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={"Nível de Desempenho"}>{page}</Layout>;
};

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    return {
      props: {},
    };
  },
  {
    roles: ["REL", "NIV_DES"],
  }
);
