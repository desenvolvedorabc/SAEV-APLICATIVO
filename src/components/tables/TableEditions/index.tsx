import * as React from "react";
import { useState, useEffect, useMemo } from "react";
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
  InputSearch,
  IconSearch,
  TopContainer,
  TableCellBorder,
  Pagination,
  FormSelectStyled,
  ButtonPage,
  TableRowStyled,
  TableSortLabelStyled,
} from "./styledComponents";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { ItemEdition } from "src/services/lancamentos.service";
import { useBreadcrumbContext } from "src/context/breadcrumb.context";

type TableEditionsProps = {
  item: ItemEdition;
  setSearch: (value: string) => void;
  loadData: (
    page: number,
    limit: number,
    order: string,
    selectedColumn: string
  ) => void;
  setTypeTable: (type: string) => void;
  isPdf?: boolean;
};

const TITLE_ITENS = {
  edition: [
    {
      id: "name",
      status: false,
      label: "EDIÇÕES",
    },
  ],
  county: [
    {
      id: "name",
      status: false,
      label: "MUNICÍPIOS",
    },
  ],
  school: [
    {
      id: "name",
      status: false,
      label: "ESCOLAS",
    },
    {
      id: "inep",
      status: false,
      label: "INEP",
    },
  ],
  schoolClass: [
    {
      id: "name",
      status: false,
      label: "SERIES",
    },
    {
      id: "classe",
      status: false,
      label: "TURMA",
    },
  ],
};

const types = {
  edition: "county",
  county: "school",
  school: "schoolClass",
  schoolClass: "student",
};

interface EnhancedTableProps {
  item: ItemEdition;
  onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void;
  order: string;
  subjects: any[];
  orderBy: string;
}

function EnhancedTableHead({
  item,
  order,
  subjects,
  orderBy,
  onRequestSort,
}: EnhancedTableProps) {
  const createSortHandler =
    (property: string) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  let headCells = [];

  if (1) {
    TITLE_ITENS[item.type].forEach((forT) => {
      headCells.push({
        ...forT,
      });
    });
    headCells.push({
      id: "grouped",
      status: true,
      label: "ENTURMADOS",
    });

    subjects.forEach((x: any) => {
      headCells.push({
        id: x.id,
        status: true,
        label: x.name.toUpperCase(),
      });
    });
    headCells.push({
      id: "general",
      status: true,
      label: "GERAL",
    });
  }

  return (
    <TableHead>
      <TableRow>
        {headCells?.map((headCell) => (
          <TableCellStyled
            key={headCell.id}
            align={headCell.status ? "center" : "left"}
            padding={"normal"}
            sortDirection={orderBy === headCell.id ? order : false}
            style={{ width: headCell.width }}
          >
            {headCell.id === "name" ? (
              <TableSortLabelStyled
                active={orderBy === headCell.id}
                direction={order === "ASC" ? "desc" : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
              </TableSortLabelStyled>
            ) : (
              <b>{headCell.label}</b>
            )}
          </TableCellStyled>
        ))}
      </TableRow>
    </TableHead>
  );
}

export function TableEditions({
  item,
  isPdf = false,
  loadData,
  setSearch,
  setTypeTable,
}: TableEditionsProps) {
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState("ASC");
  const [selectedColumn, setSelectedColumn] = useState("name");
  const [limit, setLimit] = useState(item.meta?.totalPerPage);
  const [disablePrev, setDisablePrev] = useState(true);
  const [disableNext, setDisableNext] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [click, setClick] = useState(false);
  const {
    addBreadcrumbs,
    showBreadcrumbs,
    setIsUpdateData,
    changeEdition,
    changeCounty,
    changeSchool,
    changeSchoolClass,
  } = useBreadcrumbContext();

  useEffect(() => {
    setDisablePrev(page === 1 ? true : false);
    setDisableNext(page === item.meta.totalPages ? true : false);
  }, [page, item]);

  const handleChangePage2 = (direction) => {
    if (direction === "prev") {
      setPage(page - 1);
      loadData(page - 1, limit, order, selectedColumn);
    } else {
      setPage(page + 1);
      loadData(page + 1, limit, order, selectedColumn);
    }
  };
  const handleChangeLimit = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(parseInt(event.target.value));
    setPage(1);
    loadData(1, Number(event.target.value), order, selectedColumn);
  };

  const handleChangeSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: string
  ) => {
    const isAsc = order === "DESC";
    setOrder(isAsc ? "ASC" : "DESC");
    setSelectedColumn(property);
    loadData(page, limit, isAsc ? "ASC" : "DESC", property);
  };

  const getMedia = (subjectId) => {

    let media = 0;
    item.itens.map(x => {
      let findSubject = x.subjects.find(subject =>  subject.id === subjectId)
      if(findSubject){
        media += findSubject.grouped * findSubject.percentageFinished
      }
    })

    return media / totalReduce?.grouped;
  }

  const totalReduce = useMemo(() => {
    const total = item.itens.reduce(
      (acc, cur) => {
        return {
          grouped: acc.grouped + cur.grouped,
          math: acc.math + cur.math,
          portuguese: acc.portuguese + cur.portuguese,
          general: acc.general + cur.general,
          reading: acc.reading + cur.reading,
        };
      },
      {
        grouped: 0,
        math: 0,
        general: 0,
        portuguese: 0,
        reading: 0,
      }
    );

    return {
      grouped: total.grouped ?? 0,
      math: !!total.math ? (total.math / item.itens.length).toFixed(0) : 0,
      portuguese: !!total.portuguese
        ? (total.portuguese / item.itens.length).toFixed(0)
        : 0,
      general: !!total.general
        ? (total.general / item.itens.length).toFixed(0)
        : 0,
      reading: !!total.reading
        ? (total.reading / item.itens.length).toFixed(0)
        : 0,
    };
  }, [item.itens]);

  const subjects = useMemo(() => {
    const _subjects = item?.itens[0]?.subjects ? [...item?.itens[0]?.subjects] : [];

    item?.itens?.forEach((item) =>  {
      if(item?.subjects?.length) {
        _subjects.push(...item.subjects)
      }
    })

    const filterSubjects = _subjects.filter(function (a) {
      return (
        !this[JSON.stringify(a?.name)] &&
        (this[JSON.stringify(a?.name)] = true)
      );
    }, Object.create(null)).sort((a, b) => a.name.localeCompare(b.name)); 
        
    return filterSubjects;

  }, [item]);

  const handleClickTable = (data) => {
    setTypeTable(types[item.type]);
    if (item.type === "edition") {
      changeEdition({ AVA_ID: data.id, AVA_NOME: data.name });
    }
    if (item.type === "county") {
      changeCounty({
        AVM_MUN: {
          MUN_ID: data.id,
          MUN_NOME: data.name,
        },
      });
    }
    if (item.type === "school") {
      changeSchool({ ESC_ID: data.id, ESC_NOME: data.name });
    }
    if (item.type === "schoolClass") {
      changeSchoolClass({ TUR_ID: data.id, TUR_NOME: data.classe });
    }
    addBreadcrumbs(data.id, data.name, item.type);
    setClick(true);
  };

  useEffect(() => {
    if (click) {
      showBreadcrumbs();
      setIsUpdateData(true);
      setClick(false);
    }
  }, [click]);

  // console.log("item", item)

  return (
    <Container style={{ maxWidth: !isPdf ? "calc(100vw - 330px)'" : "100%" }}>
      {!isPdf && (
        <TopContainer>
          <div className="d-flex mb-2">
            <div className="d-flex mx-3 flex-row-reverse align-items-center">
              <InputSearch
                size={16}
                type="text"
                placeholder="Pesquise"
                name="searchTerm"
                onChange={handleChangeSearch}
              />
              <IconSearch size={24} color={"#7C7C7C"} />
            </div>
          </div>
        </TopContainer>
      )}
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
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={"medium"}
            >
              <EnhancedTableHead
                order={order}
                onRequestSort={handleRequestSort}
                item={item}
                subjects={subjects}
                orderBy={selectedColumn}
              />

              <TableBody>
                {item.itens?.map((data) => (
                  <TableRowStyled
                    key={data.id}
                    role="checkbox"
                    tabIndex={-1}
                    onClick={() => handleClickTable(data)}
                    style={{ cursor: "pointer" }}
                  >
                    <TableCell component="th" scope="row" padding="normal">
                      {data.name}
                    </TableCell>
                    {item.type === "school" && (
                      <TableCellBorder>{data.inep}</TableCellBorder>
                    )}
                    {item.type === "schoolClass" && (
                      <TableCellBorder>{data.classe}</TableCellBorder>
                    )}
                    <TableCellBorder>
                      {data.grouped?.toLocaleString("pt-BR")}
                    </TableCellBorder>

                    {subjects?.map((subject) => {
                      let findSubject = data.subjects?.find(
                        (dataSubject) => subject.id === dataSubject.id
                      );

                      return (
                        <>
                          {findSubject ? (
                            <TableCellBorder key={subject}>
                              {`${
                                !!findSubject?.percentageFinished
                                  ? findSubject?.percentageFinished
                                  : 0
                              }%`}
                            </TableCellBorder>
                          ) : (
                            <TableCellBorder key={subject} color={"#D3D3D3"} style={{background: '#D3D3D3'}} >
                            </TableCellBorder>
                          )}
                        </>
                      );
                    })}

                    <TableCellBorder>{data.general}%</TableCellBorder>
                  </TableRowStyled>
                ))}

                {/* <TableRowStyled className="total" role="checkbox" tabIndex={-1}>
                  <TableCell component="th" scope="row" padding="normal">
                    Total/Média
                  </TableCell>
                  {TITLE_ITENS[item.type]?.slice(1).map((data, index) =>
                    {
                      data.label === "INEP" || data.label === "TURMA" && 
                        console.log('entrou')
                        return <TableCellBorder key={index}>-</TableCellBorder>
                    }
                  )}
                  <TableCellBorder>
                    {totalReduce?.grouped?.toLocaleString("pt-BR")}
                  </TableCellBorder>
                  {subjects.map((cur, index) => (
                    <>
                      <TableCellBorder key={index}>{getMedia(cur.id).toFixed(0)}%</TableCellBorder>
                    </>
                  ))}
                  <TableCellBorder>{totalReduce?.general}%</TableCellBorder>
                </TableRowStyled> */}
              </TableBody>
            </Table>
          </TableContainer>
          <Pagination>
            Linhas por página:
            <FormSelectStyled value={limit} onChange={handleChangeLimit}>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </FormSelectStyled>
            <ButtonPage
              onClick={() => handleChangePage2("prev")}
              disabled={disablePrev}
            >
              <MdNavigateBefore size={24} />
            </ButtonPage>
            <ButtonPage
              onClick={() => handleChangePage2("next")}
              disabled={disableNext}
            >
              <MdNavigateNext size={24} />
            </ButtonPage>
          </Pagination>
        </Paper>
      </Box>
    </Container>
  );
}
