import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  Container,
  TableCellStyled,
  TableCellBorder,
  TableRowStyled,
} from "./styles";
import { reasons } from "pages/relatorio-nao-avaliados";

interface EnhancedTableProps {
  data: any;
  level: string;
}

const levels = {
  county: "ANO",
  school: "MUNICIPIO",
  serie: "ESCOLA",
  schoolClass: 'SÉRIE',
  student: "TURMA",
};

function EnhancedTableHead({
  data,
  level,
}: EnhancedTableProps) {

  let headCells = [];

  if (data) {
    headCells.push({
      id: "enturmados",
      status: true,
      label: "ENTURMADOS",
    });
    reasons.forEach(cell => {
      let currentCell = {
        id: cell.id,
        label: cell.label,
        status: true
      }
      headCells.push(currentCell)
    })
    headCells.push({
      id: "total",
      status: true,
      label: "TOTAL (ALUNOS NÃO AVALIADOS)",
    });
  }  

  return (
    <TableHead>
      <TableRow style={{
         position: 'sticky',
         top: '0px',
      }}>
        {headCells.map((headCell) => (
          <TableCellStyled
            key={headCell.id}
            align={headCell.status ? "center" : "left"}
            padding={"normal"}
          >
            {headCell?.id === 'total' ?
              <strong>
                {headCell.label}
              </strong>
              :
              <div>
                {headCell.label}
              </div>
            }
          </TableCellStyled>
        ))}
      </TableRow>
    </TableHead>
  );
}

export function TableNaoAvaliadosGrouped({
  notEvaluated,
  level,
  levelName,
  isLoading,
  notEvaluatedStudents
}) {

  const getTotal = () => {
    return data?.dataGraph?.recusa + data?.dataGraph?.ausencia + data?.dataGraph?.abandono + data?.dataGraph?.transferencia + data?.dataGraph?.deficiencia + data?.dataGraph?.nao_participou || 0
  }
  
  let data

  if (level === 'Estudantes') {
    data = notEvaluatedStudents || null
  } else {
    data = notEvaluated || null
  }

  return (
    <Container>
      {level && (
        <Box sx={{ width: "100%" }}>
          <Paper
            sx={{
              width: "100%",
              pt: 3,
              pb: 4,
              borderRadius: 0
            }}
          >
            <TableContainer>
              <Table
                aria-labelledby="tableTitle"
                size={"medium"}
              >
                <EnhancedTableHead
                  data={data}
                  level={level}
                />
                {
                  !data ? (
                    <></>
                    ) : (
                    <TableBody>
                        <TableRowStyled
                          role="checkbox"
                          tabIndex={-1}
                        >
                          <TableCellBorder>
                            {data?.dataGraph?.total_enturmados || 0}
                          </TableCellBorder>
                          <TableCellBorder>
                            {data?.dataGraph?.recusa}
                          </TableCellBorder>
                          <TableCellBorder>
                            {data?.dataGraph?.ausencia}
                          </TableCellBorder>
                          <TableCellBorder>
                            {data?.dataGraph?.abandono}
                          </TableCellBorder>
                          <TableCellBorder>
                            {data?.dataGraph?.transferencia}
                          </TableCellBorder>
                          <TableCellBorder>
                            {data?.dataGraph?.deficiencia}
                          </TableCellBorder>
                          <TableCellBorder>
                            {data?.dataGraph?.nao_participou}
                          </TableCellBorder>
                          <TableCellBorder>
                            <strong>
                              {getTotal()}
                            </strong>
                          </TableCellBorder>
                        </TableRowStyled>
                    </TableBody>
              )}
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      )}
    </Container>
  );
}
