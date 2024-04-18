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
  Pagination,
  FormSelectStyled,
  ButtonPage,
  TableRowStyled,
} from "./styledComponents";
import {
  MdNavigateNext,
  MdNavigateBefore,
} from "react-icons/md";
import { useBreadcrumbContext } from "src/context/breadcrumb.context";
import { TableSortLabelStyled } from "src/shared/styledTables";

interface EnhancedTableProps {
  absences: any;
  onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void;
  order: string;
  orderBy: string;
  level: string;
  months?: number;
  isPdf?: boolean;
}

const levels = {
  county: "MUNICIPIO",
  school: "ESCOLA",
  serie: 'SÉRIE',
  schoolClass: "TURMA",
  student: 'ALUNO'
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
  onRequestSort,
  order,
  orderBy,
  level,
  months = 0,
  isPdf = false,
}: EnhancedTableProps) {
  const createSortHandler =
    (property) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property)
    }

  let headCells = [];

  if (absences) {
    if (level === "student") {
      headCells.push({
        id: "name",
        status: true,
        label: "ALUNOS",
      });
      if(!isPdf){
        MonthHeadCells.forEach(cell => {
          headCells.push(cell)
        })
      }
      else{
        if(months === 1){
          MonthHeadCells.slice(0,6).forEach(cell => {
            headCells.push(cell)
          })
        }
        if(months === 2){
          MonthHeadCells.slice(6,12).forEach(cell => {
            headCells.push(cell)
          })
        }
      }
      headCells.push({
        id: "total",
        status: true,
        label: "TOTAL",
      });
    } else {
      headCells.push({
        id: "name",
        status: true,
        label: levels[level],
      });
      headCells.push({
        id: "total_grouped",
        status: true,
        label: "ENTURMADOS",
      });
      if(!isPdf){
        MonthHeadCells.forEach(cell => {
          headCells.push(cell)
        })
      }
      else{
        if(months === 1){
          MonthHeadCells.slice(0,6).forEach(cell => {
            headCells.push(cell)
          })
        }
        if(months === 2){
          MonthHeadCells.slice(6,12).forEach(cell => {
            headCells.push(cell)
          })
        }
      }
      headCells.push({
        id: "total",
        status: true,
        label: "TOTAL",
      });
    }
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
          </TableCellStyled>
        ))}
      </TableRow>
    </TableHead>
  );
}

export function TableReportInfrequencia({
  absences,
  level,
  page,
  changePage,
  changeLimit,
  changeOrder,
  changeColumn,
  isPdf = false
}) {
  const [qntPage, setQntPage] = useState(null);
  const [limit, setLimit] = useState(25);
  const [disablePrev, setDisablePrev] = useState(true);
  const [disableNext, setDisableNext] = useState(false);
  const [order, setOrder] = useState("asc");
  const [selectedColumn, setSelectedColumn] = useState("name");
  const [click, setClick] = useState(false);
  const {
    changeCounty,
    changeSchool,
    changeSerie,
    changeSchoolClass,
    addBreadcrumbs,
    showBreadcrumbs,
    setIsUpdateData,
  } = useBreadcrumbContext();
  
  useEffect(() => {
    setDisablePrev(page === 1 ? true : false);
    setDisableNext(page < qntPage ? false : true);
  }, [qntPage, page]);

  useEffect(() => {
    setQntPage(absences?.meta?.totalPages)
  }, [absences])

  const handleRequestSort = (
    _event: React.MouseEvent<unknown>,
    property,
  ) => {
    const isAsc = order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    changeOrder(isAsc ? 'desc' : 'asc')
    setSelectedColumn(property)
    changeColumn(property)
  }

  const handleChangeLimit = (e) => {
    setLimit(e.target.value);
    changeLimit(e.target.value)
  };
  const handleNextPage = () => {
    if (page < qntPage) {
      changePage(page + 1)
    };
  };

  const handlePrevPage = () => {
    if (page > 0) {
      changePage(page - 1)
    };
  };

  const handleClickTable = (data) => {
    if (level === "county") {
      changeCounty({
        AVM_MUN: {
          MUN_ID: data.id,
          MUN_NOME: data.name,
        },
      });
    }
    if (level === "school") {
      changeSchool({ ESC_ID: data.id, ESC_NOME: data.name });
    }
    if (level === "serie") {
      changeSerie({ SER_ID: data.id, SER_NOME: data.name });
    }
    if (level === 'schoolClass') {
      changeSchoolClass({ TUR_ID: data.id, TUR_NOME: data.name });
    }
    addBreadcrumbs(data.id, data.name, level);
    setClick(true);
  };
  
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
        <Box  sx={{ width: "100%" }}>
          <Paper
            sx={{
              width: "100%",
              mb: 2,
              borderBottomLeftRadius: "10px",
              borderBottomRightRadius: "10px",
            }}
          >
            {!isPdf ? 
              <TableContainer>
                <Table
                  aria-labelledby="tableTitle"
                  size={"medium"}
                >
                  <EnhancedTableHead
                    order={order}
                    onRequestSort={handleRequestSort}
                    absences={absences}
                    orderBy={selectedColumn}
                    level={level}
                  />
                  <TableBody>
                    {absences?.items?.map((data) => (
                      <TableRowStyled
                        key={data.id}
                        role="checkbox"
                        tabIndex={-1}
                        onClick={() => handleClickTable(data)}
                      >
                        <TableCell component="th" scope="row" padding="normal">
                          {data?.name}
                        </TableCell>
                        {level !== 'student' &&
                          <TableCellBorder>
                            {data?.graph?.total_grouped}
                          </TableCellBorder>
                        }

                        {MonthHeadCells?.map((month) => {
                          const findMonth = data?.graph?.months.find(
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
                            {data?.graph?.total_infrequency}
                          </strong>
                        </TableCellBorder>
                      </TableRowStyled>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              :
              <>
                <TableContainer>
                  <Table
                    aria-labelledby="tableTitle"
                    size={"medium"}
                    >
                    <EnhancedTableHead
                      order={order}
                      onRequestSort={handleRequestSort}
                      absences={absences}
                      orderBy={selectedColumn}
                      level={level}
                      months={1}
                      isPdf={true}
                      />
                    <TableBody>
                      {absences?.items?.map((data) => (
                        <TableRowStyled
                        key={data.id}
                        role="checkbox"
                        tabIndex={-1}
                        onClick={() => handleClickTable(data)}
                        >
                          <TableCell component="th" scope="row" padding="normal">
                            {data?.name}
                          </TableCell>
                          {level !== 'student' &&
                            <TableCellBorder>
                              {data?.graph?.total_grouped}
                            </TableCellBorder>
                          }

                          {MonthHeadCells?.slice(0,6)?.map((month) => {
                            const findMonth = data?.graph?.months.find(
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
                              {data?.graph?.total_infrequency}
                            </strong>
                          </TableCellBorder>
                        </TableRowStyled>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TableContainer>
                <Table
                  aria-labelledby="tableTitle"
                  size={"medium"}
                  >
                  <EnhancedTableHead
                    order={order}
                    onRequestSort={handleRequestSort}
                    absences={absences}
                    orderBy={selectedColumn}
                    level={level}
                    months={2}
                    isPdf={true}
                    />
                  <TableBody>
                    {absences?.items?.map((data) => (
                      <TableRowStyled
                      key={data.id}
                      role="checkbox"
                      tabIndex={-1}
                      onClick={() => handleClickTable(data)}
                      >
                        <TableCell component="th" scope="row" padding="normal">
                          {data?.name}
                        </TableCell>
                        {level !== 'student' &&
                          <TableCellBorder>
                            {data?.graph?.total_grouped}
                          </TableCellBorder>
                        }

                        {MonthHeadCells?.slice(6,12)?.map((month) => {
                          const findMonth = data?.graph?.months.find(
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
                            {data?.graph?.total_infrequency}
                          </strong>
                        </TableCellBorder>
                      </TableRowStyled>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
            }

            {!isPdf &&
              <Pagination>
                <ButtonPage disabled={disablePrev} onClick={handlePrevPage}>
                  <MdNavigateBefore size={24} />
                </ButtonPage>
                <ButtonPage disabled={disableNext} onClick={handleNextPage}>
                  <MdNavigateNext size={24} />
                </ButtonPage>
              </Pagination>
            }
          </Paper>
        </Box>
      )}
    </Container>
  );
}
