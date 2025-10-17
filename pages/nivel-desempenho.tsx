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
import { useRouter } from "next/router";

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
  const router = useRouter();

  // const { handlePrint, componentRef } = useGenearePdf();

  const {
    changeSerie,
    changeYear,
    changeEpv,
    changeType,
    changeState,
    changeStateRegional,
    changeCounty,
    changeCountyRegional,
    changeEdition,
    changeSchool,
    changeSchoolClass,
    serie,
    year,
    edition,
    epv,
    type,
    state,
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
    // if(epv) newUrl = newUrl.concat('&epv=' + epv)
    // if(_edition) newUrl = newUrl.concat('&edition=' + _edition?.id)
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

    const resp = await getNivels(
      1,
      999999,
      order,
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
      _schoolClass?.id
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
    if (_edition?.id) _level = "county";
    if (_state?.id) _level = "regional";
    if (_stateRegional?.id) _level = "county";
    if (_county?.id) _level = "regionalSchool";
    if (_countyRegional?.id) _level = "school";
    if (_school?.id) _level = "schoolClass";
    if (_schoolClass?.id) _level = "student";
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

  const handleChangeSerie = (newValue, add = false) => {
    changeSerie(newValue);
    changeYear(null);
    changeEdition(null);
    changeEpv(null);
    changeType(null);
    changeState(null);
    changeStateRegional(null);
    changeCounty(null);
    changeCountyRegional(null);
    changeSchool(null);
    changeSchoolClass(null);

    if(add){
      const url = window.location.href.split('?serie=')
      const newUrl = url[0].concat('?serie=' + newValue?.SER_ID)
      window.history.pushState({ path: newUrl }, '', newUrl);
    }
    // resetBreadcrumbs();
    // handleUnClickBar();
    handleClickBreadcrumb(null);
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

  const selectSubject = (subject) => {
    setSubject(subject);

    setNivelList(allData?.items.find((item) => item.id === subject.id));
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
        return epv === 'Completo' ? !(!!state) : !(!!edition)
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
        <ReportFilter isDisableYear={!serie} isDisable={onDisableReportFilter()} isEpvFirst isSaev={user?.USU_SPE?.role === 'SAEV'} />
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
