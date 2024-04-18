import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Container, TableRowStyled } from './styledComponents';
import { TableCellBorder } from 'src/shared/styledTables';
import { Item2, SubjectProps } from 'src/services/report-synthetic';

interface Props {
  report: SubjectProps
  isPdf?: boolean
}

export default function TablePercentReading({ report, isPdf = false } : Props) {

  const getAnswerValue = (question: Item2, level: string) => {
    return Math.round(Number(question?.reportReadingCorrect[level])) || '0'
  }

  return (
    <Container>
      <TableContainer component={Paper} sx={{ border: '1px solid #D4D4D4',
        borderRadius: '16px', margin: '10px 0', maxHeight: !isPdf ? '600px' : 'none' }}>
        <Table stickyHeader sx={{ minWidth: 750 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell  sx={{padding: '5px 0', borderBottom: 0}} align="center" colSpan={1} />
              <TableCellBorder  sx={{padding: '5px 0', borderBottom: 0}} align="center" colSpan={1} />
              <TableCellBorder  sx={{padding: '5px 0'}} align="center"  colSpan={10}>Percentual de acertos por nível de leitura</TableCellBorder>
            </TableRow>
            <TableRow>
              <TableCell sx={{ borderTop: 0, paddingTop: '0px', paddingBottom: '5px'}} align='center'>
                Questão
              </TableCell>
              <TableCellBorder sx={{paddingTop: '0px', paddingBottom: '5px'}} align='center'>
                Gabarito
              </TableCellBorder>
              <TableCellBorder sx={{paddingTop: '5px', paddingBottom: '5px'}} align='center'>
                Fluente
              </TableCellBorder>
              <TableCellBorder sx={{paddingTop: '5px', paddingBottom: '5px'}} align='center'>
                Sem Fluência
              </TableCellBorder>
              <TableCellBorder sx={{paddingTop: '5px', paddingBottom: '5px'}} align='center'>
                Frases
              </TableCellBorder>
              <TableCellBorder sx={{paddingTop: '5px', paddingBottom: '5px'}} align='center'>
                Palavras
              </TableCellBorder>
              <TableCellBorder sx={{paddingTop: '5px', paddingBottom: '5px'}} align='center'>
                Sílabas
              </TableCellBorder>
              <TableCellBorder sx={{paddingTop: '5px', paddingBottom: '5px'}} align='center'>
                Não Leitor
              </TableCellBorder>
            </TableRow>
          </TableHead>
          <TableBody>
            {report?.items?.map((row) => (
              <TableRowStyled
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { borderBottom: 0 } }}
              >
                <TableCell align='center' component="th" scope="row" >
                  {row.order + 1}
                </TableCell>
                <TableCellBorder align='center'>{row.option}</TableCellBorder>
                <TableCellBorder align='center'>{getAnswerValue(row, 'fluente')}%</TableCellBorder>
                <TableCellBorder align='center'>{getAnswerValue(row, 'nao_fluente')}%</TableCellBorder>
                <TableCellBorder align='center'>{getAnswerValue(row, 'frases')}%</TableCellBorder>
                <TableCellBorder align='center'>{getAnswerValue(row, 'palavras')}%</TableCellBorder>
                <TableCellBorder align='center'>{getAnswerValue(row, 'silabas')}%</TableCellBorder>
                <TableCellBorder align='center'>{getAnswerValue(row, 'nao_leitor')}%</TableCellBorder>
              </TableRowStyled>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}