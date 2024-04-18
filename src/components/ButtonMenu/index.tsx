import { Menu } from "@mui/material";
import { useState, MouseEvent, useEffect } from "react";
import * as S from "./styles";

type ButtonProps = {
  handlePrint: () => void;
  handleCsv: (e) => void;
};

export function ButtonMenu({ handlePrint, handleCsv }: ButtonProps) {
  const [anchorExport, setAnchorExport] = useState<null | HTMLElement>(null);
  const openExport = Boolean(anchorExport);
  const handleClickExport = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorExport(event.currentTarget);
  };
  const handleCloseExport = (e, type) => {
    e.preventDefault();
    if(type === "pdf")
      handlePrint();
    else if(type === "excel")
      handleCsv(e)
    setAnchorExport(null);
  };

  return (
    <>
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
        onClose={(e) => handleCloseExport(e, null)}
      >
        {handlePrint &&
          <S.MenuItemStyled onClick={(e) => handleCloseExport(e, "pdf")}>
            PDF (Gráfico)
          </S.MenuItemStyled>
        }
        <S.MenuItemStyled onClick={(e) => handleCloseExport(e, "excel")}>
          EXCEL (Dados)
        </S.MenuItemStyled>
      </Menu>
    </>
  );
}
