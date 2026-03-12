import { Menu } from "@mui/material";
import { useState, MouseEvent, useEffect } from "react";
import { Form } from "react-bootstrap";
import Camelize from "src/utils/camelize";
import { generateDataImportExcel } from "src/utils/import-excel";
import * as S from "./styles";

export function ContentOptionsExams({
  examId,
  selectExamId,
  items = [],
  handlePrint,
  handleCsv = null,
}) {

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

  const [sortedItems, setSortedItems] = useState([])

  useEffect(() => {
    if(!items?.length) return
    const sorted = items?.sort((a, b) => a.subject.localeCompare(b.subject))
    setSortedItems(sorted)
    selectExamId(sorted[0]?.id)
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
          {/* <S.MenuItemStyled onClick={(e) => handleCloseExport(e, "excel")}>
            EXCEL (Dados)
          </S.MenuItemStyled> */}
        </Menu>
      </div>
    </S.Container>
  );
}
