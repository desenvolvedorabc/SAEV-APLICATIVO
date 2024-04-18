import * as React from "react";
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
import { ItemEdition } from "src/services/enturmacao.service";
import ScoreTotal from "./ScoreTotal";
import { useBreadcrumbContext } from "src/context/breadcrumb.context";
import useDebounce from "src/utils/use-debounce";
import { format } from "date-fns";
import { isValidDate } from "src/utils/validate";

const headCells = [
  {
    id: "grouped",
    status: false,
    label: "ENTURMADOS",
  },
  {
    id: "not_grouped",
    status: false,
    label: "NÃO ENTURMADOS",
  },
  {
    id: "total",
    status: false,
    label: "TOTAL ALUNOS",
  },
];

const types = {
  county: "school",
  school: "serie",
  serie: "schoolClass",
  schoolClass: "county",
};

type TableEditionsProps = {
  item: ItemEdition;
  setSearch: (value: string) => void;
  isLoading?: boolean;
  loadData: (
    page: number,
    limit: number,
    order: string,
    selectedColumn: string,
    search: string
  ) => void;
  isPdf?: boolean;
};

const TITLE_ITENS = {
  county: [
    {
      id: "name",
      status: false,
      label: "MUNICÍPIO",
    },
    ...headCells,
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
    ...headCells,
  ],
  serie: [
    {
      id: "name",
      status: false,
      label: "SERIES",
    },
    {
      id: "grouped",
      status: false,
      label: "ENTURMADOS",
    },
  ],
  schoolClass: [
    {
      id: "name",
      status: false,
      label: "TURMAS",
    },
    {
      id: "grouped",
      status: false,
      label: "ENTURMADOS",
    },
  ],
  student: [
    {
      id: "name",
      status: false,
      label: "NOME",
    },
    {
      id: "cpf",
      status: false,
      label: "CPF",
    },
    {
      id: "mae",
      status: false,
      label: "NOME DA MÃE",
    },
    {
      id: "nasc",
      status: false,
      label: "DATA DE NASCIMENTO",
    },
  ],
};

interface EnhancedTableProps {
  item: ItemEdition;
  onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void;
  order: string;
  orderBy: string;
}

function EnhancedTableHead({
  item,
  order,
  orderBy,
  onRequestSort,
}: EnhancedTableProps) {
  const createSortHandler =
    (property: string) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {TITLE_ITENS[item.type]?.map((headCell) => (
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

export function TableGrouping({
  item,
  isPdf = false,
  isLoading = false,
  setSearch,
  loadData,
}: TableEditionsProps) {
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState("ASC");
  const [selectedColumn, setSelectedColumn] = useState("name");
  const [qntPage, setQntPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [disablePrev, setDisablePrev] = useState(true);
  const [disableNext, setDisableNext] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [click, setClick] = useState(false);
  const [searchTerm, setSearchTerm] = useState(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const {
    changeSerie,
    setIsUpdateData,
    changeCounty,
    changeSchool,
    changeSchoolClass,
    addBreadcrumbs,
    showBreadcrumbs,
  } = useBreadcrumbContext();

  useEffect(() => {
    setDisablePrev(page === 1 ? true : false);
    setDisableNext(page === item.qntPage ? true : false);
  }, [page, item]);

  const handleChangePage2 = (direction) => {
    if (direction === "prev") {
      setPage(page - 1);
      loadData(page - 1, limit, order, selectedColumn, searchTerm);
    } else {
      setPage(page + 1);
      loadData(page + 1, limit, order, selectedColumn, searchTerm);
    }
  };
  const handleChangeLimit = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(parseInt(event.target.value));
    setPage(1);
    loadData(1, Number(event.target.value), order, selectedColumn, searchTerm);
  };

  const handleChangeSearch = (e) => {
    setPage(1);
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    setPage(1);
    setSearchTerm(debouncedSearchTerm);
    loadData(1, limit, order, selectedColumn, debouncedSearchTerm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm]);

  const changeShowFilter = (e) => {
    setShowFilter(!showFilter);
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: string
  ) => {
    const isAsc = order === "DESC";
    setOrder(isAsc ? "ASC" : "DESC");
    setSelectedColumn(property);
    loadData(page, limit, isAsc ? "ASC" : "DESC", property, searchTerm);
  };

  const dataMapping = React.useMemo(() => {
    let filter_search = item.itens;

    if (order === "DESC") {
      filter_search = filter_search?.sort((a, b) => {
        return a[selectedColumn] - b[selectedColumn];
      });
    } else {
      filter_search = filter_search?.sort((a, b) => {
        return b[selectedColumn] - a[selectedColumn];
      });
    }

    return filter_search;
  }, [item.itens, selectedColumn, order]);

  const handleClickTable = (data) => {
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
    if (item.type === "serie") {
      changeSerie({ SER_ID: data.id, SER_NOME: data.name });
    }
    if (item.type === "schoolClass") {
      changeSchoolClass({ TUR_ID: data.id, TUR_NOME: data.name });
    }
    setPage(1);
    setSearchTerm(null)
    addBreadcrumbs(data.id, data.name, item.type);
    setClick(true);
  };

  useEffect(() => {
    if (click) {
      showBreadcrumbs();
      loadData(1, limit, order, null, null)
      setClick(false);
    }
  }, [click]);

  console.log('date: ', new Date("0014-12-19 23:59:59"))

  return (
    <Container>
      <TopContainer>
        {!isPdf && (
          <div className="d-flex mb-2 align-items-center">
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
        )}
        {item?.type !== 'student' &&
          <ScoreTotal
            qnt={item?.TOTAL_ENTURMADO ?? 0}
            total={item.TOTAL_ALUNOS ?? 0}
          />
        }
      </TopContainer>
      {isLoading ? (
        <>
          <div className="d-flex align-items-center flex-column mt-5">
            <div className="spinner-border" role="status"></div>
          </div>
          <br />

          <br />
        </>
      ) : (
        <>
          {!!item.itens?.length ? (
            <>
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
                        orderBy={selectedColumn}
                      />

                      <TableBody>
                        {dataMapping?.map((data) => (
                          <TableRowStyled
                            key={data?.id}
                            role="checkbox"
                            tabIndex={-1}
                            onClick={() =>
                              item.type !== "student" &&
                              handleClickTable(data)
                            }
                            style={{ cursor: "pointer" }}
                          >
                            {item.type === 'student' ? 
                              <>
                                <TableCell
                                  component="th"
                                  scope="row"
                                  padding="normal"
                                  //  style={{ cursor: "pointer" }}
                                >
                                  {data?.name}
                                </TableCell>
                                <TableCellBorder>
                                  {data?.cpf}
                                </TableCellBorder>
                                <TableCellBorder>
                                  {data?.mae}
                                </TableCellBorder>
                                <TableCellBorder>
                                  {isValidDate(data?.nasc) && format(new Date (data?.nasc), 'dd/MM/yyyy')}
                                </TableCellBorder>
                              </>
                              :
                              <>
                              <TableCell
                                component="th"
                                scope="row"
                                padding="normal"
                                //  style={{ cursor: "pointer" }}
                              >
                                {data?.name}
                              </TableCell>
                              {item.type === "school" && (
                                <TableCellBorder>{data?.inep}</TableCellBorder>
                              )}
                              <TableCellBorder>
                                {data?.grouped} ({data?.total === 0 ? 0 : (data?.grouped * 100 / data?.total).toFixed(0)}%)
                              </TableCellBorder>
                              {item.type !== "serie" &&
                                item.type !== "schoolClass" && (
                                  <>
                                    <TableCellBorder>
                                      {data?.not_grouped?.toLocaleString("pt-BR")}
                                    </TableCellBorder>
                                    <TableCellBorder>
                                      {data?.total?.toLocaleString("pt-BR")}
                                    </TableCellBorder>
                                  </>
                                )}
                              </>
                            }
                          </TableRowStyled>
                        ))}
                        {item.type !== "student" &&
                          <TableRowStyled
                            className="total"
                            role="checkbox"
                            tabIndex={-1}
                          >
                            <TableCell
                              component="th"
                              scope="row"
                              padding="normal"
                            >
                              Total/Média
                            </TableCell>
                            {item.type === "county" && (
                              <>
                                <TableCellBorder>
                                  {item.TOTAL_ENTURMADO} ({(item?.TOTAL_ENTURMADO * 100 / item?.TOTAL_ALUNOS).toFixed(0)}%)
                                </TableCellBorder>
                                <TableCellBorder>
                                  {item.TOTAL_NAO_ENTURMADO?.toLocaleString("pt-BR")}
                                </TableCellBorder>
                                <TableCellBorder>
                                  {item.TOTAL_ALUNOS?.toLocaleString("pt-BR")}
                                </TableCellBorder>
                              </>
                            )}

                            {item.type === "school" && (
                              <>
                                <TableCellBorder>-</TableCellBorder>
                                <TableCellBorder>
                                  {item.TOTAL_ENTURMADO} ({(item?.TOTAL_ENTURMADO * 100 / item?.TOTAL_ALUNOS).toFixed(0)}%)
                                </TableCellBorder>
                                <TableCellBorder>
                                  {item.TOTAL_NAO_ENTURMADO?.toLocaleString("pt-BR")}
                                </TableCellBorder>
                                <TableCellBorder>
                                  {item.TOTAL_ALUNOS?.toLocaleString("pt-BR")}
                                </TableCellBorder>
                              </>
                            )}
                            {item.type === "serie" && (
                              <TableCellBorder>
                                {item.TOTAL_ENTURMADO} ({item?.TOTAL_ALUNOS === 0 ? 0 : (item?.TOTAL_ENTURMADO * 100 / item?.TOTAL_ALUNOS).toFixed(0)}%)
                              </TableCellBorder>
                            )}

                            {item.type === "schoolClass" && (
                              <TableCellBorder>
                                {item.TOTAL_ENTURMADO} ({item?.TOTAL_ALUNOS === 0 ? 0 : (item?.TOTAL_ENTURMADO * 100 / item?.TOTAL_ALUNOS).toFixed(0)}%)
                              </TableCellBorder>
                            )}
                          </TableRowStyled>
                        }
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Pagination>
                    Linhas por página:
                    <FormSelectStyled
                      value={limit}
                      onChange={handleChangeLimit}
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={25}>25</option>
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
            </>
          ) : (
            <>
              <br />

              <br />
            </>
          )}
        </>
      )}
    </Container>
  );
}
