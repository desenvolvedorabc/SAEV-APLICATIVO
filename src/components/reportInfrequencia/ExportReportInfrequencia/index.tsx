import { Menu, MenuItem } from "@mui/material";
import ButtonWhite from "src/components/buttons/buttonWhite";
import { useState } from 'react'
import { Container } from "./styledComponents";
import { saveAs } from 'file-saver';
import { useBreadcrumbContext } from "src/context/breadcrumb.context";
import { getExportReportAbsence } from "src/services/relatorio-infrequencia.service";

export function ExportReportInfrequencia({ handlePrint }) {
  const [isDisabled, setIsDisabled] = useState<'csv' | 'pdf' | ''>('');
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const {
    mapBreadcrumb,
  } = useBreadcrumbContext()


  const downloadPdf = () => {
    setIsDisabled('pdf')
    setTimeout(() => {
      handlePrint()
      setIsDisabled('')
    }, 300)
  }

  const downloadCsv = async () => {
    setIsDisabled('csv')
    const year = mapBreadcrumb.find((data) => data.level === "year")
    const county = mapBreadcrumb.find((data) => data.level === "county")
    const school = mapBreadcrumb.find((data) => data.level === "school")
    const serie = mapBreadcrumb.find((data) => data.level === "serie")
    const schoolClass = mapBreadcrumb.find(
      (data) => data.level === "schoolClass"
    )

    const resp = await getExportReportAbsence(
      school?.id,
      schoolClass?.id,
      year?.id,
      county?.id,
      serie?.id
    );
    if(!resp.data.message) {
      saveAs(resp?.data, 'Relatório_Infrequência.xls');
    } else {
    }
    setIsDisabled('')
  };

  return (
    <Container>
      <div style={{ width: 177 }}>
        <ButtonWhite
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          >
          Exportar
        </ButtonWhite>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
          >
          <MenuItem disabled={isDisabled === 'pdf'} onClick={downloadPdf}>
            {isDisabled === 'pdf' && <LoadSpinner /> }
            PDF (Gráfico)
          </MenuItem>
          <MenuItem disabled={isDisabled === 'csv'} onClick={downloadCsv}>
            {isDisabled === 'csv' && <LoadSpinner /> }
            EXCEL (Dados)
          </MenuItem>
        </Menu>
      </div>
    </Container>
  )
}

function LoadSpinner() {
  return <div className="spinner-border spinner-border-sm" role="status" style={{marginRight: '5px'}}></div>
}