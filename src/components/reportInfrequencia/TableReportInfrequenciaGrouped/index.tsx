import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  Container,
  TableCellStyled,
  TableCellBorder,
  TableRowStyled,
} from "./styledComponents";
import { Loading } from "src/components/Loading";

interface EnhancedTableProps {
  absences: any;
  level: string;
}

const levels = {
  county: "ANO",
  school: "MUNICIPIO",
  serie: "ESCOLA",
  schoolClass: 'SÉRIE',
  student: "TURMA",
};

const MonthHeadCells =  [
  {
    id: '1',
    status: false,
    label: 'JAN',
  },
  {
    id: '2',
    status: false,
    label: 'FEV',
  },
  {
    id: '3',
    status: false,
    label: 'MAR',
  },
  {
    id: '4',
    status: false,
    label: 'ABR',
  },
  {
    id: '5',
    status: false,
    label: 'MAI',
  },
  {
    id: '6',
    status: false,
    label: 'JUN',
  },
  {
    id: '7',
    status: false,
    label: 'JUL',
  },
  {
    id: '8',
    status: false,
    label: 'AGO',
  },
  {
    id: '9',
    status: false,
    label: 'SET',
  },
  {
    id: '10',
    status: false,
    label: 'OUT',
  },
  {
    id: '11',
    status: false,
    label: 'NOV',
  },
  {
    id: '12',
    status: false,
    label: 'DEZ',
  },
]

function EnhancedTableHead({
  absences,
  level,
}: EnhancedTableProps) {

  let headCells = [];

  if (absences) {
    headCells.push({
      id: "name",
      status: true,
      label: levels[level],
    });
    headCells.push({
      id: "enturmados",
      status: true,
      label: "ENTURMADOS",
    });
    MonthHeadCells.forEach(cell => {
      headCells.push(cell)
    })
    headCells.push({
      id: "total",
      status: true,
      label: "TOTAL",
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

export function TableReportInfrequenciaGrouped({
  absences,
  level,
  levelName,
  isLoading,
}) {

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
                  absences={absences}
                  level={level}
                />
                {
                  isLoading ? (
                    <Loading />
                    ) : (
                    <TableBody>
                        <TableRowStyled
                          role="checkbox"
                          tabIndex={-1}
                        >
                          <TableCell component="th" scope="row" padding="normal">
                            {levelName}
                          </TableCell>
                          <TableCellBorder>
                            {absences?.total_grouped}
                          </TableCellBorder>
                          {MonthHeadCells?.map((month) => {
                            const findMonth = absences?.months.find(
                              (m) => m?.month === Number(month?.id)
                            );
                            return (
                              <TableCellBorder key={findMonth?.month}>
                                {findMonth?.total}
                              </TableCellBorder>
                            );
                          })}

                          <TableCellBorder>
                            <strong>
                              {absences?.total_infrequency}
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
