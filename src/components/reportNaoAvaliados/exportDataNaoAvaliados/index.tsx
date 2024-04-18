import { Menu, MenuItem } from "@mui/material";
import ButtonWhite from "src/components/buttons/buttonWhite";
import { useState } from 'react'
import { Container } from "./styles";
import { saveAs } from 'file-saver';
import { useBreadcrumbContext } from "src/context/breadcrumb.context";
import { getExportReportNotEvaluated } from "src/services/relatorio-nao-avaliados.service";
import { z } from "zod";

const paramsSchema = z.object({
  serie: z.number(),
  year: z.string(),
  edition: z.number(),
  county: z.number().nullable().optional(),
  school: z.number().nullable().optional(),
  schoolClass: z.number().nullable().optional()
})

export function ExportReportNaoAvaliados({ handlePrint }) {
  const [isDisabled, setIsDisabled] = useState<'csv' | 'pdf' | ''>('');
  const [anchorEl, setAnchorEl] = useState(null);

  const { serie } = useBreadcrumbContext()

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
    const edition = mapBreadcrumb.find((data) => data.level === "edition")
    const year = mapBreadcrumb.find((data) => data.level === "year")
    const county = mapBreadcrumb.find((data) => data.level === "county")
    const school = mapBreadcrumb.find((data) => data.level === "school")
    const schoolClass = mapBreadcrumb.find(
      (data) => data.level === "schoolClass"
    )    
    
    const params = paramsSchema.parse({
      edition: edition?.id,
      school: school?.id,
      schoolClass: schoolClass?.id,
      year: year?.id,
      county: county?.id,
      serie: serie?.SER_ID
    })

    const resp = await getExportReportNotEvaluated(
      params.edition,
      params.school,
      params.schoolClass,
      params.year,
      params.county,
      params.serie
    );
    if(!resp.data.message) {
      saveAs(resp?.data, 'Relatório_Nao_Avaliados.csv');
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