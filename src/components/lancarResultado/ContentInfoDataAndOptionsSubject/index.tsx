import { Menu } from "@mui/material";
import { useState, MouseEvent, useEffect, useCallback } from "react";
import { Form } from "react-bootstrap";
import ButtonWhite from "src/components/buttons/buttonWhite";
import ModalAlterarPeriodo from "../modalAlterarPeriodo";
import ScoreTotal from "./ScoreTotal";
import * as S from "./styles";

export function ContentInfoDataAndOptionsSubject({
  isSchoolClass = false,
  subject,
  selectSubject,
  orderBy,
  selectedReleaseSubject,
  changeOrderBy,
  studentSelect,
  setStudentSelect,
  releasesResults,
  students,
  countFinished,
  visualizationBy,
  changeVisualizationBy,
  leitura = true,
  handlePrint,
  handleCsv = null,
  county,
  edition,
}) {
  const [labelOrder, setLabelOrder] = useState("A-Z");
  const [labelVisualization, setLabelVisualization] = useState("Carrossel");
  const [modalShow, setModalShow] = useState(false)
  const [dateFim, setDateFim] = useState(selectedReleaseSubject?.AVM_DT_FIM)
  const perfil = window.localStorage.getItem("PER_NOME")

  const [anchorOrderBy, setAnchorOrderBy] = useState<null | HTMLElement>(null);
  const [anchorVisualizationBy, setAnchorVisualizationBy] =
    useState<null | HTMLElement>(null);
  const openOrderBy = Boolean(anchorOrderBy);
  const handleClickOrderBy = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorOrderBy(event.currentTarget);
  };
  const handleCloseOrderBy = () => {
    setAnchorOrderBy(null);
  };

  const [anchorStudent, setAnchorStudent] = useState<null | HTMLElement>(null);

  const openStudent = Boolean(anchorStudent);
  const handleClickSelectStudent = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorStudent(event.currentTarget);
  };
  const handleCloseSelectStudent = () => {
    setAnchorStudent(null);
  };

  const openVisualizationOrderBy = Boolean(anchorVisualizationBy);
  const handleClickVisualizationBy = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorVisualizationBy(event.currentTarget);
  };
  const handleCloseVisualizationBy = () => {
    setAnchorVisualizationBy(null);
  };
  const [anchorExport, setAnchorExport] = useState<null | HTMLElement>(null);
  // const openExport = Boolean(anchorExport);
  // const handleClickExport = (event: MouseEvent<HTMLButtonElement>) => {
  //   setAnchorExport(event.currentTarget);
  // };
  // const handleCloseExport = (e, type) => {
  //   if (type === "pdf") handlePrint();
  //   else if (type === "excel") handleCsv(e);
  //   setAnchorExport(null);
  // };

  function handleSelectOrder(e: any) {
    setLabelOrder(e.target.value);
    changeOrderBy(e);
    handleCloseOrderBy();
  }

  function handleSelectVisualization(e: any) {
    setLabelVisualization(e.target.value);
    changeVisualizationBy(e);
    handleCloseVisualizationBy();
  }

  function handleSelectStudent(e: any) {
    setStudentSelect(e);
    handleCloseSelectStudent();
  }

  useEffect(() => {
    if (
      !isSchoolClass &&
      (orderBy === "menorNivel" || orderBy === "maiorNivel")
    ) {
      handleSelectOrder({
        target: {
          value: "A-Z",
          id: "porMenor",
        },
      });
    }
  }, [handleSelectOrder, isSchoolClass, orderBy]);


  const totalStudents = selectedReleaseSubject?.subjects[0].students.filter(
    function (a) {
      return (
        !this[JSON.stringify(a?.ALU_ID)] &&
        (this[JSON.stringify(a?.ALU_ID)] = true)
      );
    },
    Object.create(null)
  ).length;

  const changeFim = () => {
    setDateFim(selectedReleaseSubject?.AVM_DT_FIM)
  }

  const verifyPerfil = () => {
    if(perfil === "SAEV" || perfil === "Município")
      return true;
    return false;
  };

  return (
    <S.Container>
      <header>
        <div>
          <p>{totalStudents} alunos(as):</p>

          <ScoreTotal
            total={totalStudents}
            qnt={selectedReleaseSubject?.subjects[0].total.finished}
          />
        </div>

        <p>
          <b>
            Período de Lançamento:{" "}
            {new Date(
              selectedReleaseSubject?.AVM_DT_INICIO
            ).toLocaleDateString()}{" "}
            a{" "}
            {new Date(dateFim).toLocaleDateString()}.
          </b>
        </p>
        {verifyPerfil() &&
          <div style={{ width: 114}}>
            <ButtonWhite onClick={() => {setModalShow(true) }} >
              Alterar Período de Lançamento
            </ButtonWhite>
          </div>
        }
      </header>

      <S.Content>
        <div>
          {releasesResults.map((data, index) => (
            <button
              key={index}
              onClick={() => selectSubject(data?.subjects[0]?.DIS_NOME)}
              className={`${
                subject === data?.subjects[0]?.DIS_NOME && "checked"
              }`}
            >
              {data?.subjects[0]?.DIS_NOME}
              <span>
                {((
                  data?.subjects[0].total.finished /
                    data?.subjects[0].students.filter(function (a) {
                      return (
                        !this[JSON.stringify(a?.ALU_ID)] &&
                        (this[JSON.stringify(a?.ALU_ID)] = true)
                      );
                    }, Object.create(null)).length
                ) * 100).toFixed(0)}
                %
              </span>
            </button>
          ))}
        </div>

        <div>
          <S.ButtonMenu
            id="student-button"
            aria-controls={openStudent ? "student-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={openStudent ? "true" : undefined}
            onClick={handleClickSelectStudent}
          >
            Selecionar Aluno(a)
          </S.ButtonMenu>
          <Menu
            id="student-menu"
            anchorEl={anchorStudent}
            open={openStudent}
            onClose={handleCloseSelectStudent}
          >
            <Form.Group
              defaultChecked={studentSelect}
              onChange={handleSelectStudent}
            >
              {students?.map((data) => (
                <S.MenuItemStyled key={data.ALU_ID} htmlFor={data.ALU_ID}>
                  <Form.Check
                    label={data.ALU_NOME}
                    name="studentBy"
                    className="w-100"
                    type={"radio"}
                    id={data.ALU_ID}
                    value={data.ALU_NOME}
                    defaultChecked={studentSelect === data.ALU_ID}
                  />
                </S.MenuItemStyled>
              ))}
            </Form.Group>
          </Menu>
          <S.ButtonMenu
            id="visualizationBy-button"
            className="export"
            aria-controls={
              openVisualizationOrderBy ? "visualizationBy-menu" : undefined
            }
            aria-haspopup="true"
            aria-expanded={openVisualizationOrderBy ? "true" : undefined}
            onClick={handleClickVisualizationBy}
          >
            Visualização: <span className="ms-1">{labelVisualization}</span>
          </S.ButtonMenu>
          <Menu
            id="visualizationBy-menu"
            anchorEl={anchorVisualizationBy}
            open={openVisualizationOrderBy}
            onClose={handleCloseVisualizationBy}
          >
            <Form.Group
              defaultChecked={visualizationBy}
              onChange={handleSelectVisualization}
            >
              <S.MenuItemStyled htmlFor="porCarrousel">
                <Form.Check
                  label="Carrossel"
                  name="visualizationBy"
                  className="w-100"
                  type={"radio"}
                  id="porCarrousel"
                  value="Carrossel"
                  defaultChecked={visualizationBy === "porCarrousel"}
                />
              </S.MenuItemStyled>

              <S.MenuItemStyled htmlFor="porLista">
                <Form.Check
                  label="Lista"
                  name="visualizationBy"
                  className="w-100"
                  type={"radio"}
                  id="porLista"
                  value="Lista"
                  defaultChecked={visualizationBy === "porLista"}
                />
              </S.MenuItemStyled>
            </Form.Group>
          </Menu>

          <S.ButtonMenu
            id="orderBy-button"
            className="export"
            aria-controls={openOrderBy ? "orderBy-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={openOrderBy ? "true" : undefined}
            onClick={handleClickOrderBy}
          >
            Ordenar: <span className="ms-1">{labelOrder}</span>
          </S.ButtonMenu>
          <Menu
            id="orderBy-menu"
            anchorEl={anchorOrderBy}
            open={openOrderBy}
            onClose={handleCloseOrderBy}
          >
            <Form.Group defaultChecked={orderBy} onChange={handleSelectOrder}>
              <S.MenuItemStyled htmlFor="porMenor">
                <Form.Check
                  label="A-Z"
                  name="orderBy"
                  className="w-100"
                  type={"radio"}
                  id="porMenor"
                  value="A-Z"
                  defaultChecked={orderBy === "porMenor"}
                />
              </S.MenuItemStyled>

              <S.MenuItemStyled htmlFor="porMaior">
                <Form.Check
                  label="Z-A"
                  name="orderBy"
                  className="w-100"
                  type={"radio"}
                  id="porMaior"
                  value="Z-A"
                  defaultChecked={orderBy === "porMaior"}
                />
              </S.MenuItemStyled>

              <S.MenuItemStyled htmlFor="naoLancados">
                <Form.Check
                  label="Não lançados"
                  name="orderBy"
                  className="w-100"
                  type={"radio"}
                  id="naoLancados"
                  value="Não lançados"
                  defaultChecked={orderBy === "naoLancados"}
                />
              </S.MenuItemStyled>
            </Form.Group>
          </Menu>
        </div>
      </S.Content>
      <ModalAlterarPeriodo
        show={modalShow}
        onHide={() => { setModalShow(false) }}
        selected={null}
        list={null}
        county={county}
        inicio={selectedReleaseSubject?.AVM_DT_INICIO}
        fim={selectedReleaseSubject?.AVM_DT_FIM}
        handlechangeperiodo={changeFim}
        edition={edition}
      />
    </S.Container>
  );
}
