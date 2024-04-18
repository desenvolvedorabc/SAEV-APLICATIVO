import { useState, useEffect } from "react";
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
  Selected,
  Circle,
  Row,
} from "./styles";
import { useBreadcrumbContext } from "src/context/breadcrumb.context";
import { reasons } from "pages/relatorio-nao-avaliados";
import { ExportItem } from "src/services/relatorio-nao-avaliados.service";
import { TableSortLabelStyled } from "src/shared/styledTables";

interface EnhancedTableProps {
  notEvaluated?: ExportItem
  notEvaluatedStudents?: ExportItem
  onRequestSort: (event: React.MouseEvent<unknown>, property) => void
  order: string;
  orderBy: string;
  level: string;
}

const levels = {
  county: "MUNICIPIO",
  school: "ESCOLA",
  serie: 'SÉRIE',
  schoolClass: "TURMA",
  student: 'ALUNO'
};

function EnhancedTableHead({
  notEvaluated,
  notEvaluatedStudents,
  level,
  onRequestSort,
  order,
  orderBy,
}: EnhancedTableProps) {
  const createSortHandler =
    (property) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property)
    }

  let headCells = [];

  if (level !== 'Estudantes') {
    if (notEvaluated) {
      headCells.push({
        id: "name",
        status: true,
        label: levels[level],
      });
      headCells.push({
        id: "countTotalStudents",
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
    }
  } else {
    if (notEvaluatedStudents) {
      headCells.push({
        id: "name",
        status: true,
        label: "ALUNOS",
      });
      reasons.forEach(cell => {
        let currentCell = {
          id: cell.id,
          label: cell.label,
          status: true
        }
        headCells.push(currentCell)
      })
    }
  }
  if(level != 'Estudantes') {
    headCells.push({
      id: "total",
      status: true,
      label: 'TOTAL',
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
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {level != 'Estudantes' ?
                <TableSortLabelStyled
                  active={orderBy === headCell.id}
                  direction={order === "asc" ? "desc" : "asc"}
                  onClick={createSortHandler(headCell.id)}
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
                </TableSortLabelStyled>
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

interface ITableReportNaoAvaliadosProps {
  notEvaluated?: ExportItem
  notEvaluatedStudents?: any
  level?: any
  page?: any
  changePage?: any
  changeLimit?: any
}

export function TableReportNaoAvaliados({
  notEvaluated,
  notEvaluatedStudents,
  level,
}: ITableReportNaoAvaliadosProps) {
  const [qntPage, setQntPage] = useState(null);
  const [order, setOrder] = useState("asc");
  const [selectedColumn, setSelectedColumn] = useState("name");
  const [click, setClick] = useState(false);
  const {
    year,
    changeCounty,
    changeSchool,
    changeSerie,
    changeSchoolClass,
    addBreadcrumbs,
    showBreadcrumbs,
    setIsUpdateData,
  } = useBreadcrumbContext();  
  
  const handleRequestSort = (
    _event: React.MouseEvent<unknown>,
    property,
  ) => {
    const isAsc = order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setSelectedColumn(property)
  }

  const handleClickTable = (data) => {    
    if (level === "county") {
      changeCounty({
        AVM_MUN: {
          MUN_ID: data.id,
          MUN_NOME: data.name,
        },
      });
    }
    if (level === "Escola") {
      changeSchool({ ESC_ID: data.id, ESC_NOME: data.name });
    }
    if (level === "serie") {
      changeSerie({ SER_ID: data.id, SER_NOME: data.name });
    }
    if (level === 'Turma') {
      changeSchoolClass({ TUR_ID: data.id, TUR_NOME: data.name });
      level = 'schoolClass'
    }    

    addBreadcrumbs(data.id, data.name, level);
    setClick(true);
  };

  function totalInPercentage(value: number, total: number): string {
    const valueCalculate = ((value / total) * 100).toFixed(1);

    return !!total ? ` (${valueCalculate}%)` : " (0.0%)";
  }
  
  useEffect(() => {
    if (click) {
      showBreadcrumbs();
      setIsUpdateData(true);
      setClick(false);
    }
  }, [click]);
  
  return (
    <Container>
      {level && (
        <Box sx={{ width: "100%" }}>
          <Paper
            sx={{
              width: "100%",
              mb: 2,
              borderBottomLeftRadius: "10px",
              borderBottomRightRadius: "10px",
            }}
          >
            <TableContainer>
              <Table
                aria-labelledby="tableTitle"
                size={"medium"}
              >
                <EnhancedTableHead
                  order={order}
                  onRequestSort={handleRequestSort}
                  notEvaluated={notEvaluated}
                  notEvaluatedStudents={notEvaluatedStudents}
                  orderBy={selectedColumn}
                  level={level}
                />
                {
                  (level !== 'Estudantes') ? (
                    <DefaultTableLevel notEvaluated={notEvaluated} handleClickTable={handleClickTable} totalInPercentage={totalInPercentage} order={order} selectedColumn={selectedColumn} />
                  ) : (
                    <TableLevelStudents notEvaluatedStudents={notEvaluatedStudents}  />
                  )
                }
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      )}
    </Container>
  );
}


function DefaultTableLevel({ notEvaluated, handleClickTable, totalInPercentage, selectedColumn, order }) { 
  const [orderedData, setOrderedData] = useState(notEvaluated?.items)
  const getTotal = (data) => {
    return data?.recusa + data?.ausencia + data?.abandono + data?.transferencia + data?.deficiencia + data?.nao_participou
  }
  
  const orderTable = () => {
    let ordered
    if(selectedColumn === 'total'){
      ordered = notEvaluated?.items?.sort((a, b) => order === 'desc' ? getTotal(a) - getTotal(b) : getTotal(b) - getTotal(a))

      setOrderedData(ordered)
      
    } else if(selectedColumn === 'name'){
      ordered = notEvaluated?.items?.sort((a, b) => order === 'desc' ? (a[selectedColumn] == b[selectedColumn] ? 0 : a[selectedColumn] > b[selectedColumn] ? 1 : - 1) : (a[selectedColumn] == b[selectedColumn] ? 0 : b[selectedColumn] > a[selectedColumn] ? 1 : - 1))

      setOrderedData(ordered)
      
    } else{
      ordered = notEvaluated?.items?.sort((a, b) => order === 'desc' ? a[selectedColumn] - b[selectedColumn] : b[selectedColumn] - a[selectedColumn])

      setOrderedData(ordered)
    }
  }

  useEffect(() => {
    orderTable()
  },[order, selectedColumn])

  return (
    <TableBody>
      {orderedData?.map((data) => (
        <TableRowStyled
          key={data.id}
          role="checkbox"
          tabIndex={-1}
          onClick={() => handleClickTable(data)}
        >
          <TableCell component="th" scope="row" padding="normal">
            {data?.name}
          </TableCell>
          <TableCellBorder>
            <Row>
              {data?.countTotalStudents}
            </Row>
          </TableCellBorder>
          <TableCellBorder>
            <Row>
              <span>{data?.recusa}</span>
              <span>{totalInPercentage(data?.recusa, data?.countTotalStudents)}</span>
            </Row>
          </TableCellBorder>
          <TableCellBorder>
            <Row>
              <span>{data?.ausencia}</span>
              <span>{totalInPercentage(data?.ausencia, data?.countTotalStudents)}</span>
            </Row>
          </TableCellBorder>
          <TableCellBorder>
            <Row>
              <span>{data?.abandono}</span>
              <span>{totalInPercentage(data?.abandono, data?.countTotalStudents)}</span>
            </Row>
          </TableCellBorder>
          <TableCellBorder>
            <Row>
              <span>{data?.transferencia}</span>
              <span>{totalInPercentage(data?.transferencia, data?.countTotalStudents)}</span>
            </Row>
          </TableCellBorder>
          <TableCellBorder>
            <Row>
              <span>{data?.deficiencia}</span>
              <span>{totalInPercentage(data?.deficiencia, data?.countTotalStudents)}</span>
            </Row>
          </TableCellBorder>
          <TableCellBorder>
            <Row>
              <span>{data?.nao_participou}</span>
              <span>{totalInPercentage(data?.nao_participou, data?.countTotalStudents)}</span>
            </Row>
          </TableCellBorder>
          <TableCellBorder>
            <Row>
              <span>{getTotal(data)}</span>
              <span>{totalInPercentage(getTotal(data), data?.countTotalStudents)}</span>
            </Row>
          </TableCellBorder>
        </TableRowStyled>
      ))}
    </TableBody>
  )
}

function TableLevelStudents({ notEvaluatedStudents }) {  
  return (
    <TableBody>
      {notEvaluatedStudents?.students.map((student) => (
        <TableRowStyled
          key={student.id}
          role="checkbox"
          tabIndex={-1}
        >
          <TableCell component="th" scope="row" padding="normal">
            {student?.name}
          </TableCell>
          {
            reasons.map(reason => {
              
              if (student?.justificativa === reason.id) {
                return (
                  <Selected><Circle></Circle></Selected>
                )
              } else {
                return <TableCellBorder key={reason.id}></TableCellBorder>                
              }
            })
          }
        </TableRowStyled>
      ))}
    </TableBody>
  )
}
