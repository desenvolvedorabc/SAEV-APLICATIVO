import { Menu } from "@mui/material";
import { useState, MouseEvent } from "react";
import { Form } from "react-bootstrap";
import * as S from "./styles";

export function ContentOptionsFilterTranfers({
  subject,
  selectSubject,
  orderBy,
  changeOrderBy,
  studentSelect,
  setStudentSelect,
  students = [],
  county,
  school,
}) {
  const [labelOrder, setLabelOrder] = useState("Pendentes Primeiro");

  const [anchorOrderBy, setAnchorOrderBy] = useState<null | HTMLElement>(null);

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

  function handleSelectOrder(e: any) {
    setLabelOrder(e.target.value);
    changeOrderBy(e);
    handleCloseOrderBy();
  }

  function handleSelectStudent(e: any) {
    setStudentSelect(e);
    handleCloseSelectStudent();
  }

  return (
    <S.Container>
      <div style={{display: 'flex', fontWeight: "bold", fontSize: 14, marginBottom: 10}}>
        {county && 
          <div>{county?.MUN_NOME}</div>
        }
        {school &&
          <div>{"\s > " + school?.ESC_NOME}</div>
        }
      </div>
      <S.Content>
        <div>
          <button
            onClick={() => selectSubject("em-aberto")}
            className={`${subject === "em-aberto" && "checked"}`}
          >
            Em aberto
          </button>
          <button
            onClick={() => selectSubject("finalizadas")}
            className={`${subject === "finalizadas" && "checked"}`}
          >
            Finalizadas
          </button>
          <button
            onClick={() => selectSubject("")}
            className={`${subject === "" && "checked"}`}
          >
            Todas
          </button>
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
              <S.MenuItemStyled key={"0"} htmlFor={""}>
                  <Form.Check
                    label={"Todos"}
                    name="studentBy"
                    className="w-100"
                    type={"radio"}
                    id={"Todos"}
                    value={"Todos"}
                  />
                </S.MenuItemStyled>
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
              <S.MenuItemStyled htmlFor="pendetesPrimeiro">
                <Form.Check
                  label="Pendentes Primeiro"
                  name="orderBy"
                  className="w-100"
                  type={"radio"}
                  id="pendetesPrimeiro"
                  value="Pendentes Primeiro"
                  defaultChecked={orderBy === "pendetesPrimeiro"}
                />
              </S.MenuItemStyled>
              <S.MenuItemStyled htmlFor="maisNovos">
                <Form.Check
                  label="Mais Novos"
                  name="orderBy"
                  className="w-100"
                  type={"radio"}
                  id="maisNovos"
                  value="Mais Novos"
                  defaultChecked={orderBy === "maisNovos"}
                />
              </S.MenuItemStyled>
              <S.MenuItemStyled htmlFor="maisAntigos">
                <Form.Check
                  label="Mais Antigos"
                  name="orderBy"
                  className="w-100"
                  type={"radio"}
                  id="maisAntigos"
                  value="Mais Antigos"
                  defaultChecked={orderBy === "maisAntigos"}
                />
              </S.MenuItemStyled>
            </Form.Group>
          </Menu>
        </div>
      </S.Content>
    </S.Container>
  );
}
