import { Menu } from "@mui/material";
import { useState, MouseEvent, useEffect } from "react";
import { Form } from "react-bootstrap";
import Camelize from "src/utils/camelize";
import { generateDataImportExcel } from "src/utils/import-excel";
import * as S from "./styles";

export function ContentOptionsExams({
  isSchoolClass = false,
  examId,
  selectExamId,
  orderBy,
  changeOrderBy,
  leitura = true,
  expand = false,
  handleExpandAll = null,
  expandAll = false,
  items = [],
  handlePrint,
  handleCsv = null,
}) {
  const [labelOrder, setLabelOrder] = useState("Por nome");

  const [anchorOrderBy, setAnchorOrderBy] = useState<null | HTMLElement>(null);
  const openOrderBy = Boolean(anchorOrderBy);
  const handleClickOrderBy = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorOrderBy(event.currentTarget);
  };
  const handleCloseOrderBy = () => {
    setAnchorOrderBy(null);
  };
  const [anchorExport, setAnchorExport] = useState<null | HTMLElement>(null);
  const openExport = Boolean(anchorExport);
  const handleClickExport = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorExport(event.currentTarget);
  };
  const handleCloseExport = (e, type) => {
    if (type === "pdf") handlePrint();
    else if (type === "excel") handleCsv(e);
    setAnchorExport(null);
  };

  function handleSelectOrder(e: any) {
    setLabelOrder(e.target.value);
    changeOrderBy(e);
    handleCloseOrderBy();
  }

  const readExcel = async (file) => {
    const value = await generateDataImportExcel(file);
  };

  useEffect(() => {
    if (!isSchoolClass && (orderBy === "menorNivel" || orderBy === "maiorNivel")) {
      handleSelectOrder({
        target: {
          value: "Por nome",
          id: "porNome",
        },
      });
    }
  }, [handleSelectOrder, isSchoolClass, orderBy]);

  const [sortedItems, setSortedItems] = useState([])

  useEffect(() => {
    const sorted = items?.sort((a, b) => a.subject.localeCompare(b.subject))
      setSortedItems(sorted)
  },[items])

  return (
    <S.Container>
      <div>
        {sortedItems?.map((data, key) => (
          <button
            key={data?.id ?? key}
            onClick={() => selectExamId(data.id)}
            className={`${examId === data.id && "checked"}`}
          >
            {Camelize(data.subject)}
          </button>
        ))}
      </div>

      <div>
        <S.ButtonMenu
          id="orderBy-button"
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
            <S.MenuItemStyled htmlFor="porNome">
              <Form.Check
                label="Por nome"
                name="orderBy"
                className="w-100"
                type={"radio"}
                id="porNome"
                value="Por nome"
                defaultChecked={orderBy === "porNome"}
              />
            </S.MenuItemStyled>
            <S.MenuItemStyled>
              <Form.Check
                label="Menor média no topo"
                name="orderBy"
                className="w-100"
                type={"radio"}
                id={"menorMedia"}
                value={"Menor média no topo"}
                defaultChecked={orderBy === "menorMedia"}
              />
            </S.MenuItemStyled>

            <S.MenuItemStyled>
              <Form.Check
                label="Maior média no topo"
                name="orderBy"
                width={100}
                className="w-100"
                type={"radio"}
                id={"maiorMedia"}
                value={"Maior média no topo"}
                defaultChecked={orderBy === "maiorMedia"}
              />
            </S.MenuItemStyled>

            {isSchoolClass && (
              <>
                <S.MenuItemStyled>
                  <Form.Check
                    label="Maior nível no topo"
                    name="orderBy"
                    className="w-100"
                    type={"radio"}
                    id={"maiorNivel"}
                    value={"Maior nível no topo"}
                    defaultChecked={orderBy === "maiorNivel"}
                  />
                </S.MenuItemStyled>

                <S.MenuItemStyled>
                  <Form.Check
                    label="Menor nível no topo"
                    name="orderBy"
                    type={"radio"}
                    className="w-100"
                    id={"menorNivel"}
                    value={"Menor nível no topo"}
                    defaultChecked={orderBy === "menorNivel"}
                  />
                </S.MenuItemStyled>
              </>
            )}
          </Form.Group>
        </Menu>
        {expand && (
          <S.ButtonMenu onClick={handleExpandAll} className="export">
            {expandAll ? "Fechar Tudo" : "Expandir Tudo"}
          </S.ButtonMenu>
        )}

        <S.ButtonMenu
          className="export"
          id="export-button"
          aria-controls={openExport ? "export-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={openExport ? "true" : undefined}
          onClick={handleClickExport}
        >
          Exportar
        </S.ButtonMenu>
        <Menu
          id="export-menu"
          anchorEl={anchorExport}
          open={openExport}
          onClose={(e) => handleCloseExport(e, "")}
        >
          <S.MenuItemStyled onClick={(e) => handleCloseExport(e, "pdf")}>
            PDF (Gráfico)
          </S.MenuItemStyled>
          <S.MenuItemStyled onClick={(e) => handleCloseExport(e, "excel")}>
            EXCEL (Dados)
          </S.MenuItemStyled>
        </Menu>
      </div>
    </S.Container>
  );
}
