import * as S from "./styles";
import { createRef, useEffect, useMemo, useState } from "react";
import { isEqual, isFuture, isPast } from "date-fns";
import { ButtonPadrao } from "src/components/buttons/buttonPadrao";
import { Carousel } from "react-bootstrap";
import ModalConfirmacao from "src/components/modalConfirmacao";
import ModalPergunta from "src/components/modalPergunta";
import { DetailsStudent } from "./DetailsStudent";
import { ReleasesResults } from "src/services/lancar-resultados.service";
import ModalAviso from "src/components/modalAviso";

type ContentProps = {
  selectedReleaseSubject: ReleasesResults;
  subject: string;
  visualizationBy: string;
  orderBy: string;
  studentSelect: string;
  isResetIndex: number;
  countFinished: number;
  setIsLoadingData: (value: boolean) => void;
  setIsResetIndex: (value: number) => void;
  setCountFinished: (value: number) => void;
  url: string;
};

export function ContentReleasesStudent({
  subject,
  countFinished,
  visualizationBy,
  selectedReleaseSubject,
  studentSelect,
  setIsLoadingData,
  orderBy,
  isResetIndex,
  setIsResetIndex,
  setCountFinished,
  url,
}: ContentProps) {
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalShowQuestion, setModalShowQuestion] = useState(false);
  const [textModal, setTextModal] = useState("");
  const [isEditionModalAvailable, setIsEditionModalAvailable] = useState(
    isEqual(
      new Date(new Date().toDateString()), new Date(new Date(selectedReleaseSubject?.AVM_DT_FIM).toDateString())
    ) ||
    isEqual(
      new Date(new Date().toDateString()), new Date(new Date(selectedReleaseSubject?.AVM_DT_INICIO).toDateString())
    ) ? false :
    isPast(
      new Date(new Date(selectedReleaseSubject?.AVM_DT_FIM).toDateString())
    ) ||
    isFuture(
      new Date(new Date(selectedReleaseSubject?.AVM_DT_INICIO).toDateString())
    )
  );
  const [ quantityLoadingDisable, setQuantityLoadingDisable] = useState(false)
  let quantityLoading = 0

  const isEditionAvailable =
    isEqual(
      new Date(new Date().toDateString()), new Date(new Date(selectedReleaseSubject?.AVM_DT_FIM).toDateString())
    ) ||
    isEqual(
      new Date(new Date().toDateString()), new Date(new Date(selectedReleaseSubject?.AVM_DT_INICIO).toDateString())
    ) ? false :
    isPast(
      new Date(new Date(selectedReleaseSubject?.AVM_DT_FIM).toDateString())
    ) ||
    isFuture(
      new Date(new Date(selectedReleaseSubject?.AVM_DT_INICIO).toDateString())
    );
    
  const [indexItemSelect, setIndexItemSelect] = useState(0);

  const students = selectedReleaseSubject?.subjects[0].students;

  const refs = useMemo(() => {
    return students.reduce((acc, value) => {
      acc[value.ALU_ID] = createRef();
      return acc;
    }, {});
  }, [students]);

  const dataStudentsOrder = useMemo(() => {
    let data = selectedReleaseSubject?.subjects[0].students.filter(function (
      a
    ) {
      return (
        !this[JSON.stringify(a?.ALU_ID)] &&
        (this[JSON.stringify(a?.ALU_ID)] = true)
      );
    },
    Object.create(null));

    if (orderBy === "porMenor") {
      data = data?.sort((a, b) => a.ALU_NOME.toLocaleUpperCase().localeCompare(b.ALU_NOME.toLocaleUpperCase()));
    } else if (orderBy === "porMaior") {
      data = data?.sort((a, b) => b.ALU_NOME.toLocaleUpperCase().localeCompare(a.ALU_NOME.toLocaleUpperCase()));
    } else {
      data = data.sort((a, b) => {
        if (!a.answers.length && b.answers.length) {
          return 0 - 1;
        } else if (a.answers.length && !b.answers.length) {
          return 1 - 0;
        }

        return a.answers[0]?.ALT_FINALIZADO - b.answers[0]?.ALT_FINALIZADO;
      });
    }

    return data;
  }, [orderBy, selectedReleaseSubject?.subjects]);

  const handleSelect = (selectedIndex, e) => {
    setIndexItemSelect(selectedIndex);
  };

  useEffect(() => {
    if (isResetIndex) {
      setIndexItemSelect(0);
      setIsResetIndex(0);
    }
  }, [isResetIndex, setIsResetIndex]);

  useEffect(() => {
    if (visualizationBy === "porLista") {
      refs[studentSelect]?.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      if (studentSelect.trim()) {
        const index = dataStudentsOrder.findIndex(
          (data) => String(data.ALU_ID) === String(studentSelect)
        );

        setIndexItemSelect(index);
      }
    }
  }, [studentSelect, refs, visualizationBy, dataStudentsOrder]);

  const changeQuantityLoading = (started) => {
    if (started)
      quantityLoading += 1  
    else{
      quantityLoading -= 1
    }
    setQuantityLoadingDisable(quantityLoading > 0)
  }

  return (
    <>
      <S.Container>
        {visualizationBy === "porLista" ? (
          <>
            {dataStudentsOrder?.map((data, index) => (
              <div key={data.ALU_ID} ref={refs[data.ALU_ID]}>
                <DetailsStudent
                  data={data}
                  isEditionAvailable={isEditionAvailable}
                  selectedReleaseSubject={selectedReleaseSubject}
                  subject={subject}
                  index={index}
                  setCountFinished={setCountFinished}
                  totalStudents={dataStudentsOrder.length}
                  url={url}
                  changeQuantityLoading={changeQuantityLoading}
                />
              </div>
            ))}
          </>
        ) : (
          <Carousel
            indicators={false}
            interval={999999}
            variant="dark"
            wrap={false}
            activeIndex={indexItemSelect}
            onSelect={handleSelect}
          >
            {dataStudentsOrder?.map((data, index) => (
              <Carousel.Item key={data.ALU_ID}>
                <DetailsStudent
                  data={data}
                  isEditionAvailable={isEditionAvailable}
                  selectedReleaseSubject={selectedReleaseSubject}
                  subject={subject}
                  index={index}
                  setCountFinished={setCountFinished}
                  totalStudents={dataStudentsOrder.length}
                  url={url}
                  changeQuantityLoading={changeQuantityLoading}
                />
              </Carousel.Item>
            ))}
          </Carousel>
        )}
      </S.Container>

      <ModalPergunta
        show={false}
        onHide={() => {}}
        onConfirm={() => {}}
        buttonNo={`Fechar`}
        buttonYes={"Lançar próxima Turma"}
        text={`Todos lançamentos feitos, já salvamos tudo pra você!`}
        status={true}
        size="lg"
      />

      <ModalConfirmacao
        show={modalConfirm}
        onHide={() => {
          setModalConfirm(false);
          setTextModal("");
          setIsLoadingData(true);
        }}
        text={textModal}
        textConfirm="Fechar"
        status={true}
      />

      <ModalConfirmacao
        show={isEditionModalAvailable}
        onHide={() => setIsEditionModalAvailable(false)}
        text="Esta edição está fora do periodo de lançamento!"
        textConfirm="Fechar"
        status={false}
      />
      <ModalAviso
        show={modalShowQuestion}
        onHide={() => setModalShowQuestion(false)}
        onConfirm={() => {
          setModalConfirm(true);
          setTextModal("Lançamentos salvos com sucesso.");
          setIsLoadingData(true);
        }}
        buttonYes={"Sim, Salvar Informações"}
        buttonNo={"Cancelar"}
        text={`Ao confirmar essa opção todos os alunos que não estiverem com o gabarito completo serão perdidos`}
      />
    </>
  );
}
