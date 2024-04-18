import { CardDefault } from "src/components/cardDefault";
import { Title, ButtonDownload } from "./styledComponents";
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { MdOutlineDownload } from "react-icons/md";

const StyledTableCell = styled(TableCell)(({ }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#E0F1E0",
    color: "#68936A",
    fontWeight: 600
  },
}));

const TableCellBorder = styled(TableCell)`
  border-left: 1px solid #d4d4d4;
`;

export function TemplateList(){
  return(
    <>
      <CardDefault>
        <Title>Templates</Title>
      </CardDefault>
      <TableContainer component={Paper}>
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="left">TEMPLATE</StyledTableCell>
              <StyledTableCell align="center">AÇÃO</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCellBorder align="left" component="th" scope="row">
                Template Alunos
              </TableCellBorder>
              <TableCellBorder align="center">
                <ButtonDownload href='/assets/templates/template_importacao_aluno.csv' target="_blank" download>
                  <MdOutlineDownload size={20} color="#4B4B4B" />
                </ButtonDownload>
              </TableCellBorder>
            </TableRow>
            <TableRow>
              <TableCellBorder align="left" component="th" scope="row">
                Template Usuários
              </TableCellBorder>
              <TableCellBorder align="center">
                <ButtonDownload href='/assets/templates/template_importacao_usuario.csv' target="_blank" download>
                  <MdOutlineDownload size={20} color="#4B4B4B" />
                </ButtonDownload>
              </TableCellBorder>
            </TableRow>
            <TableRow>
              <TableCellBorder align="left" component="th" scope="row">
                Legendas
              </TableCellBorder>
              <TableCellBorder align="center">
                <ButtonDownload href='/assets/templates/legendas.csv' target="_blank" download>
                  <MdOutlineDownload size={20} color="#4B4B4B" />
                </ButtonDownload>
              </TableCellBorder>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}