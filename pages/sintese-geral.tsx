import PageContainer from "src/components/pageContainer";
import { TopFilterSerie } from "src/components/topFilterSerie";
import { useState, useEffect, useRef } from "react";
import Layout from "src/components/layout";
import type { ReactElement } from "react";
import { ReportFilter } from "src/components/reportFilter";
import { TableAnswers } from "src/components/tables/TableAnswers";
import { TableNotesReading } from "src/components/tables/TableNotesReading";
import { ContainerScore } from "src/components/containerScore";
import { GraphStudentsReading } from "src/components/GraphStudentsReading";
import { TableClassReading } from "src/components/tables/TableClassReading";
import { ReportBreadcrumb } from "src/components/reportBreadcrumb";
import {
  ItemSubject,
  getGeneralSynthesis,
  getGeneralSynthesisCSV,
} from "src/services/sintese-geral.service";
import { SectionContentItensSubject } from "src/components/templates/SectionContentItensSubject";
import { useBreadcrumbContext } from "src/context/breadcrumb.context";
import { useGenearePdf } from "src/utils/generatePdf";
import { CSVLink } from "react-csv";
import { withSSRAuth } from "src/utils/withSSRAuth";
import { ContentOptionsExams } from "../src/components/contentOptionsExams/index";
import { FooterTable } from "src/components/tables/TableAnswers/FooterTable";
import { useAuth } from "src/context/AuthContext";
import {ChatAI} from "src/components/chatAI";
import { ChatButton } from "src/components/chatAI/ChatButton";
import { useGetPerfil } from "src/services/perfis.service";

interface DataLeitura {
  NOME: string;
  MATERIA: string;
  NIVEL: string;
}

function createDataLeitura(NOME: string, MATERIA: string, NIVEL: string): DataLeitura {
  return {
    NOME,
    MATERIA,
    NIVEL,
  };
}

interface DataTable {
  NOME_ALUNO: string;
  MATERIA: string;
  MEDIA: number;
  QUESTAO: number;
  RESPOSTA: string;
  ACERTO: string;
  DESCRITOR: string;
}

function createDataTable(
  NOME_ALUNO: string,
  MATERIA: string,
  MEDIA: number,
  QUESTAO: number,
  RESPOSTA: string,
  ACERTO: string,
  DESCRITOR: string
): DataTable {
  return {
    NOME_ALUNO,
    MATERIA,
    MEDIA,
    QUESTAO,
    RESPOSTA,
    ACERTO,
    DESCRITOR,
  };
}

export default function SinteseGeral() {
  const {user} = useAuth()
  const [isLoading, setIsLoading] = useState(false);
  const [examId, setExamId] = useState(undefined);
  const [orderBy, setOrderBy] = useState("porNome");
  const [listScore, setListScore] = useState<ItemSubject>({} as ItemSubject);
  const [items, setItems] = useState<ItemSubject[]>([]);
  const [selectedItem, setSelectedItem] = useState<ItemSubject>({} as ItemSubject);
  const [leituraItem, setLeituraItem] = useState<ItemSubject>({} as ItemSubject);
  const [csv, setCsv] = useState([]);
  const csvLink = useRef(undefined);
  const [level, setLevel] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatContext, setChatContext] = useState(null);
  const [chatKey, setChatKey] = useState(0);

  const { data: profileAreas } = useGetPerfil(user?.USU_SPE?.SPE_ID, !!user?.USU_SPE?.SPE_ID)

  const { handlePrint, componentRef } = useGenearePdf();

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
    mapBreadcrumb,
    serie,
    year,
    state,
    epv,
    type,
    county,
    school,
    schoolClass,
    resetBreadcrumbs,
    isUpdateData,
    setIsUpdateData,
    hideBreadcrumbs,
    clickBar,
    handleUnClickBar,
    visibleBreadcrumbs,
    handleClickBreadcrumb,
    clickBreadcrumb,
  } = useBreadcrumbContext();

  const loadGeneralSynthesis = async (
    serieLoad,
    yearLoad,
    editionLoad,
    isEpvPartner,
    type,
    stateId,
    stateRegionalId,
    countyLoad,
    municipalityOrUniqueRegionalId,
    schoolLoad,
    schoolClassLoad
  ) => {
    setIsLoading(true);
    const resp = await getGeneralSynthesis(
      serieLoad,
      yearLoad,
      editionLoad,
      isEpvPartner,
      type,
      stateId,
      stateRegionalId,
      countyLoad,
      municipalityOrUniqueRegionalId,
      schoolLoad,
      schoolClassLoad
    );

    setIsLoading(false);

    setItems(resp?.items ?? []);

    if(!resp?.items)
      return


    if (resp?.items[0]?.level) setLevel(resp?.items[0]?.level);
    else setLevel(null)
  };

  const updateChatContext = () => {
    const _year = mapBreadcrumb.find((data) => data.level === "year");
    const _edition = mapBreadcrumb.find((data) => data.level === "edition");
    const _state = mapBreadcrumb.find((data) => data.level === "state");
    const _stateRegional = mapBreadcrumb.find((data) => data.level === "regional");
    const _county = mapBreadcrumb.find((data) => data.level === "county");
    const _countyRegional = mapBreadcrumb.find((data) => data.level === "regionalSchool");
    const _school = mapBreadcrumb.find((data) => data.level === "school");
    const _schoolClass = mapBreadcrumb.find((data) => data.level === "schoolClass");

    const context = {
      breadcrumb: mapBreadcrumb,
      items: items,
      selectedItem: selectedItem,
      serie: serie,
      year: _year,
      edition: _edition,
      state: _state,
      stateRegional: _stateRegional,
      county: _county,
      countyRegional: _countyRegional,
      school: _school,
      schoolClass: _schoolClass,
    };

    setChatContext(context);
  };


  useEffect(() => {
    if(!level){
      let list = [];
      let tempCsv = [];
      let listCSV = [];
  
      items?.forEach((x) => {
        if (x.subject === "Leitura") {
          x.students?.forEach((student) => {
            list.push(createDataLeitura(student.name, x.subject, student.type));
          });
  
          tempCsv.push(["NOME_ALUNO", "MATÉRIA", "NIVEL"]);
          listCSV = JSON.parse(JSON.stringify(list));
          listCSV.forEach((item) => {
            tempCsv.push(Object.values(item));
          });
          tempCsv.push([]);
          tempCsv.push([]);
          tempCsv.push([]);
        } else {
          const descriptors = x?.quests?.descriptors.sort((a, b) => a.TEG_ORDEM - b.TEG_ORDEM)
          let orderedStudents = []
          if (orderBy === "menorMedia") {
            orderedStudents = x.students?.sort((a, b) => {
              return a.avg - b.avg;
            });
          } else if (orderBy === "maiorMedia") {
            orderedStudents = x.students?.sort((a, b) => {
              return b.avg - a.avg;
            });
          } else if (orderBy === "porNome") {
            orderedStudents = x.students?.sort((a, b) => {
              return ("" + a.name).localeCompare(b.name);
            });
          } else if (orderBy === "menorNivel") {
            orderedStudents = x.students?.sort((a, b) => {
              return a.level - b.level;
            });
          } else if (orderBy === "maiorNivel") {
            orderedStudents = x.students?.sort((a, b) => {
              return b.level - a.level;
            });
          }
          orderedStudents?.forEach((student) => {
            descriptors?.forEach((descriptor, index) => {
              let question = student?.quests?.find((quest) => quest.questionId === descriptor.id)
              let type = question?.type === "right" ? "certo" : "errado";
              list.push(
                createDataTable(
                  student?.name,
                  x?.subject,
                  student?.avg,
                  index,
                  question?.letter || '-',
                  type || '-',
                  descriptor?.description
                )
              );
            })
          });
  
          tempCsv.push([
            "NOME_ALUNO",
            "MATÉRIA",
            "MÉDIA",
            "QUESTÃO",
            "RESPOSTA",
            "ACERTO",
            "DESCRITOR",
          ]);
          listCSV = JSON.parse(JSON.stringify(list));
          listCSV.forEach((item) => {
            tempCsv.push(Object.values(item));
          });
          tempCsv.push([]);
          tempCsv.push([]);
          tempCsv.push([]);
        }
  
        listCSV = [];
        list = [];
      });
            
      setCsv(tempCsv);
    }
  },[items, orderBy])

  const downloadCsv = async () => {
    const _year = mapBreadcrumb.find((data) => data.level === "year");
    const _edition = mapBreadcrumb.find((data) => data.level === "edition");
    const _state = mapBreadcrumb.find((data) => data.level === "state");
    const _stateRegional = mapBreadcrumb.find((data) => data.level === "regional");
    const _county = mapBreadcrumb.find((data) => data.level === "county");
    const _countyRegional = mapBreadcrumb.find((data) => data.level === "regionalSchool");
    const _school = mapBreadcrumb.find((data) => data.level === "school");
    const _schoolClass = mapBreadcrumb.find((data) => data.level === "schoolClass");

    if (_year?.id) {
      try {
        const resp = await getGeneralSynthesisCSV(
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

        setCsv(resp.data);
      } catch (error) {
        console.error('Error downloading CSV:', error);
      }
    }

    csvLink.current.link.click();
  };

  useEffect(() => {
    resetBreadcrumbs();
    handleUnClickBar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const findItem = items.find((data) => data.id === examId);

    setSelectedItem(findItem ?? ({} as ItemSubject));

    const findLeitura = items.find((data) => data.subject === "Leitura");

    setLeituraItem(findLeitura ?? ({} as ItemSubject));
  }, [examId, items]);

  useEffect(() => {
    if (items.length > 0) {
      updateChatContext();
    }
  }, [items, selectedItem, mapBreadcrumb]);

  useEffect(() => {
    if (isUpdateData) {
      setChatKey(prev => prev + 1);
    }
  }, [isUpdateData]);

  useEffect(() => {
    if (isUpdateData || clickBar || visibleBreadcrumbs) {
      const _school = mapBreadcrumb.find((data) => data.level === "school");
      const _schoolClass = mapBreadcrumb.find((data) => data.level === "schoolClass");
      const _county = mapBreadcrumb.find((data) => data.level === "county");
      const _year = mapBreadcrumb.find((data) => data.level === "year");
      const _edition = mapBreadcrumb.find((data) => data.level === "edition");
      const _state = mapBreadcrumb.find((data) => data.level === "state");
      const _stateRegional = mapBreadcrumb.find((data) => data.level === "regional");
      const _countyRegional = mapBreadcrumb.find((data) => data.level === "regionalSchool");

      if (!!_year?.id) {
        loadGeneralSynthesis(
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
      } else {
        setItems([]);
        setSelectedItem({} as ItemSubject);
      }

      handleUnClickBar();
      hideBreadcrumbs();
      setIsUpdateData(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    mapBreadcrumb,
    // handleUnClickBar,
    // setIsUpdateData,
    // hideBreadcrumbs,
    // clickBar,
    // visibleBreadcrumbs,
    // isUpdateData,
  ]);

  useEffect(() => {
    setExamId((value: number) => (!!value ? value : items[0]?.id));
  }, [items]);

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

    resetBreadcrumbs();
    handleUnClickBar();
    handleClickBreadcrumb(null);
  };

  function handleSelectExamId(examId: number) {
    setExamId(examId);
  }

  function handleChangeOrderBy(e) {
    setOrderBy(e.target.id);
  }

  const onPressBreadcrumb = () => {
    handleClickBreadcrumb(!clickBreadcrumb);
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
    <>
      <PageContainer>
        <TopFilterSerie title={"Síntese Geral >"} serie={serie} changeSerie={handleChangeSerie} />
        <ReportFilter isDisableYear={!serie} isDisable={onDisableReportFilter()} isSaev={user?.USU_SPE?.role === 'SAEV'} />
        <ChatAI
          key={chatKey}
          isOpen={isChatOpen}
          onClose={() => {
            setIsChatOpen(false);
            setChatKey(prev => prev + 1);
          }}
          contextData={chatContext}
          initialSuggestions={[
            'Análise do Relatório',
            'Resumo do Relatório',
            'Destaques do Desempenho',
            'Pontos de Atenção',
            'Comparar Categorias'
          ]}
        />
        {isLoading ? (
          <div className="d-flex align-items-center flex-column mt-5">
            <div className="spinner-border" role="status"></div>
          </div>
        ) : (
          <section>
            <ReportBreadcrumb
              onPress={onPressBreadcrumb}
              action={items.length > 0 && profileAreas?.AREAS?.find(x => x.ARE_NOME === 'AI_ASSIST') && (
                <ChatButton
                  isOpen={isChatOpen}
                  onClick={() => setIsChatOpen(!isChatOpen)}
                />
              )}
            />
            {!!items.length && (
              <ContentOptionsExams
                isSchoolClass={!!schoolClass?.id}
                examId={examId}
                handlePrint={handlePrint}
                items={items}
                handleCsv={downloadCsv}
                selectExamId={handleSelectExamId}
                orderBy={orderBy}
                changeOrderBy={handleChangeOrderBy}
              />
            )}

            {!!selectedItem.subject && (
              <>
                {selectedItem.subject !== "Leitura" ? (
                  <>
                    {selectedItem.type !== "table" && (
                      <SectionContentItensSubject
                        orderBy={orderBy}
                        listScore={selectedItem}
                        setOrderListScore={setListScore}
                      />
                    )}

                    {selectedItem.type === "table" && (
                      <TableAnswers order={orderBy} classe={selectedItem} leitura={leituraItem} />
                    )}
                  </>
                ) : (
                  <ContainerScore>
                    <GraphStudentsReading selectedItem={selectedItem} />
                    {selectedItem.type !== "table" ? (
                      <TableClassReading orderBy={orderBy} selectedItem={selectedItem} />
                    ) : (
                      <TableNotesReading orderBy={orderBy} selectedItem={selectedItem} />
                    )}
                  </ContainerScore>
                )}
              </>
            )}
          </section>
        )}

        <GeneratePdfPage
          componentRef={componentRef}
          orderBy={orderBy}
          items={items}
          schoolClass={schoolClass}
          leituraItem={leituraItem}
          serie={serie}
        />
        <CSVLink
          data={csv}
          filename="sintese_geral.csv"
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
  items,
  leituraItem,
  schoolClass,
  orderBy,
  serie,
}) {

  return (
    <div className="pdf">
      <div ref={componentRef} className="print-container">
        <PageContainer isPdf>
          <div className="d-flex justify-content-center mt-3">
            <strong>Serie: {serie?.SER_NOME}</strong>
          </div>
          <ReportBreadcrumb onPress={() => {}} />
          {!schoolClass ? (
            <>
              {items.map((item, index) => (
                <>
                  {String(item.subject).toLowerCase() !== "leitura" ? (
                    <>
                      <h3 className="pdf--title">{item.subject}</h3>

                      <SectionContentItensSubject
                        key={index}
                        orderBy={orderBy}
                        listScore={item}
                        setOrderListScore={() => {}}
                        isPdf={true}
                      />
                    </>
                  ) : (
                    <>
                      <h3 className="pdf--title">Leitura</h3>

                      <GraphStudentsReading selectedItem={item} />

                      {item.type !== "table" ? (
                        <TableClassReading orderBy={orderBy} selectedItem={item} isPdf={true} />
                      ) : (
                        <TableNotesReading orderBy={orderBy} selectedItem={item} isPdf={true} />
                      )}
                    </>
                  )}
                  <div className="page-break" />
                </>
              ))}
            </>
          ) : (
            <>
              {items.map((item, index) => (
                <>
                  {String(item.subject).toLowerCase() !== "leitura" ? (
                    <>
                      <h3 className="pdf--title">{item.subject}</h3>
                      <FooterTable />
                      <div>
                        <TableAnswers order={orderBy} classe={item} leitura={leituraItem} isPdf={true} />
                        {
                          Array.from({ length: Math.floor((item?.students?.length / 10) -1) }).map((_, index) => <div key={index} className="page-break" />)                          
                        }
                      </div>
                      {/* {index < items?.length && <div className="page-break" />} */}

                    </>
                  ) : (
                    <>
                      <h3 className="pdf--title">Leitura</h3>

                      <GraphStudentsReading selectedItem={item} />

                      {item.type !== "table" ? (
                        <TableClassReading orderBy={orderBy} selectedItem={item} isPdf={true} />
                      ) : (
                        <TableNotesReading orderBy={orderBy} selectedItem={item} isPdf={true} />
                      )}
                    </>
                  )}
                  <div className="page-break" />
                </>
              ))}
            </>
          )}
        </PageContainer>
      </div>
    </div>
  );
}

SinteseGeral.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={"Síntese Geral"}>{page}</Layout>;
};

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    return {
      props: {},
    };
  },
  {
    roles: ["REL", "SINT_GER"],
  }
);
