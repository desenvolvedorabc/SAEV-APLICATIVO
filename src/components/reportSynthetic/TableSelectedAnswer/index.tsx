import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Container, Descriptor, TableCellBorder, TableRowStyled } from './styledComponents';
import { Item2, SubjectProps } from 'src/services/report-synthetic';

interface Props {
  report: SubjectProps
  isPdf?: boolean
}

export default function TableSelectedAnswer({ report, isPdf = false }: Props) {
  const getAnswerValue = (question: Item2, answer: string) => {
    const find = question?.options?.find(option => option.option === answer)

    return Math.round(Number(find?.value)) || '0'
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
              <TableCellBorder  sx={{padding: '5px 0'}} align="center"  colSpan={10}>Opções</TableCellBorder>
            </TableRow>
            <TableRow>
              <TableCell sx={{ borderTop: 0, paddingTop: '0px', paddingBottom: '5px'}} align='center'>
                <div>
                  Questão
                </div>
              </TableCell>
              <TableCellBorder sx={{paddingTop: '0px', paddingBottom: '5px'}} align='center'>
                <div>
                  Gabarito
                </div>
              </TableCellBorder>
              <TableCellBorder sx={{paddingTop: '5px', paddingBottom: '5px'}} align='center'>
                A
              </TableCellBorder>
              <TableCellBorder sx={{paddingTop: '5px', paddingBottom: '5px'}} align='center'>
                B
              </TableCellBorder>
              <TableCellBorder sx={{paddingTop: '5px', paddingBottom: '5px'}} align='center'>
                C
              </TableCellBorder>
              <TableCellBorder sx={{paddingTop: '5px', paddingBottom: '5px'}} align='center'>
                D
              </TableCellBorder>
              <TableCellBorder sx={{paddingTop: '5px', paddingBottom: '5px'}} align='center'>
                --
              </TableCellBorder>
              <TableCellBorder sx={{paddingTop: '5px', paddingBottom: '5px'}} align='center'>
                Descritor
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
                <TableCellBorder correct={row?.option === 'A'} align='center'>{getAnswerValue(row, 'A')}%</TableCellBorder>
                <TableCellBorder correct={row?.option === 'B'} align='center'>{getAnswerValue(row, 'B')}%</TableCellBorder>
                <TableCellBorder correct={row?.option === 'C'} align='center'>{getAnswerValue(row, 'C')}%</TableCellBorder>
                <TableCellBorder correct={row?.option === 'D'} align='center'>{getAnswerValue(row, 'D')}%</TableCellBorder>
                <TableCellBorder align='center'>{getAnswerValue(row, '-')}%</TableCellBorder>
                <TableCellBorder align='center' sx={{ maxWidth: 300 }}>
                  <Descriptor>
                    {row.descriptor}
                  </Descriptor>
                </TableCellBorder>
              </TableRowStyled>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}