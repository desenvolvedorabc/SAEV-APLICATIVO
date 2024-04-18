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
  Marker,
  FilterSelectedContainer,
  ButtonStyled,
  PopoverStyled,
} from "./styledComponents";
import { Form, OverlayTrigger } from "react-bootstrap";
import {
  MdOutlineFilterAlt,
  MdNavigateNext,
  MdNavigateBefore,
} from "react-icons/md";
import getLastPage from "src/utils/calculate-last-page";
import { useBreadcrumbContext } from "src/context/breadcrumb.context";

interface EnhancedTableProps {
  item: any;
  onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void;
  order: string;
  orderBy: string;
  level: string;
}

const levels = {
  edition: "EDIÇÃO",
  county: "MUNICIPIO",
  schoolClass: "TURMA",
  school: "ESCOLA",
};

function EnhancedTableHead({
  item,
  order,
  orderBy,
  onRequestSort,
  level,
}: EnhancedTableProps) {
  const createSortHandler =
    (property: string) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  let headCells = [];

  if (item) {
    if (level === "student") {
      headCells.push({
        id: "name",
        status: true,
        label: "ALUNOS",
      });
      item?.descriptors?.sort((a,b) => a.cod.localeCompare(b.cod))?.map((x) => {
        headCells.push({
          id: x?.id,
          status: false,
          label: x?.cod,
          description: x?.description,
        });
      });
      console.log('headCells', headCells)
      headCells.push({
        id: "nivel",
        status: true,
        label: "NIVEL",
      });
    } else {
      headCells.push({
        id: "name",
        status: true,
        label: levels[level],
      });
      item?.descriptors?.sort((a,b) => a.cod.localeCompare(b.cod))?.map((x) => {
        headCells.push({
          id: x.id,
          status: false,
          label: x?.cod,
          description: x?.description,
        });
      });
      console.log('headCells', headCells)
      headCells.push({
        id: "nivel",
        status: true,
        label: "NIVEL",
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
            {headCell.description ? (
              <OverlayTrigger
                key={"toolTipDescritor"}
                placement={"top"}
                overlay={
                  <PopoverStyled id={`tooltip-descritor-top`}>
                    {headCell.description}
                  </PopoverStyled>
                }
              >
                <TableSortLabelStyled
                // active={orderBy === headCell.id}
                // direction={order === "asc" ? "desc" : "asc"}
                // onClick={createSortHandler(headCell.id)}
                >
                  {headCell.label}
                </TableSortLabelStyled>
              </OverlayTrigger>
            ) : (
              <TableSortLabelStyled
                active={orderBy === headCell.id}
                direction={order === "asc" ? "desc" : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
              </TableSortLabelStyled>
            )}
          </TableCellStyled>
        ))}
      </TableRow>
    </TableHead>
  );
}

export function TableNivelPerformance({
  item,
  isPdf = false,
  handleClickCell,
  level,
}) {
  const [page, setPage] = useState(1);
  const [qntPage, setQntPage] = useState(null);
  const [limit, setLimit] = useState(25);
  const [search, setSearch] = useState("");
  const [disablePrev, setDisablePrev] = useState(true);
  const [disableNext, setDisableNext] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filter, setFilter] = useState(null);
  const [listFilter, setlistFilter] = useState([]);
  const [order, setOrder] = useState("asc");
  const [selectedColumn, setSelectedColumn] = useState("name");
  const [click, setClick] = useState(false);
  const [descriptorLength, setDescriptorLength] = useState(0);
  const {
    changeCounty,
    changeEdition,
    changeSchool,
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
    if (item) setlistFilter(item?.items);
    setDescriptorLength(0);
  }, [item]);

  console.log('item',item)

  const handleChangeSearch = (e) => {
    setSearch(e.target.value);
  };

  function changeFilter() {
    if (filter === "Todos") {
      setlistFilter(item?.items);
    } else {
      let limite;
      if (filter == 75) limite = 100;
      if (filter == 50) limite = 74;
      if (filter == 25) limite = 49;
      if (filter == 0) limite = 24;

      let list = item?.items.filter((x) => {
        return parseInt(x.value) >= filter && parseInt(x.value) <= limite;
      });

      setlistFilter(list);
    }
  }

  const handleChangeFilter = (e) => {
    setFilter(e.target.value);
  };

  const changeShowFilter = (e) => {
    setShowFilter(!showFilter);
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: string
  ) => {
    const isAsc = order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setSelectedColumn(property);
  };

  const nivelColor = (nivel) => {
    if (nivel >= 75) return "#3E8277";
    if (nivel >= 50) return "#5EC2B1";
    if (nivel >= 25) return "#FAA036";
    if (nivel >= 0) return "#FF6868";
  };

  const dataMapping = useMemo(() => {
    let filter_search = listFilter ? listFilter : [];
    if (search.trim()) {
      filter_search = filter_search?.filter((data) =>
        data?.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (order === "asc") {
      filter_search = filter_search?.sort((a, b) => {
        if (selectedColumn === "name") {
          if (level === "student") {
            return (
              "" + a?.name.toString().toLowerCase()
            ).localeCompare(b?.name.toString().toLowerCase());
          }
          return (
            "" + a[selectedColumn].toString().toLowerCase()
          ).localeCompare(b[selectedColumn].toString().toLowerCase());
        }
        if (selectedColumn === "nivel") {
          return a.value - b.value;
        }

        return a[selectedColumn] - b[selectedColumn];
      });
    } else {
      filter_search = filter_search?.sort((a, b) => {
        if (selectedColumn === "name") {
          if (level === "student") {
            return (
              "" + b?.name.toString().toLowerCase()
            ).localeCompare(a?.name.toString().toLowerCase());
          }
          return (
            "" + b[selectedColumn].toString().toLowerCase()
          ).localeCompare(a[selectedColumn].toString().toLowerCase());
        }
        if (selectedColumn === "nivel") {
          return b.value - a.value;
        }

        return b[selectedColumn] - a[selectedColumn];
      });
    }
    // setQntPage(filter_search?.length ?? 0);
    const total = filter_search?.length ?? 0;
    const skippedItems = (+page - 1) * +limit;
    setQntPage(getLastPage(total, +limit));

    const itemsFilter = filter_search.filter(
      (message, index) => index >= skippedItems && index < skippedItems + +limit
    );

    return itemsFilter;
  }, [search, selectedColumn, order, listFilter, level, limit, page]);

  const handleChangeLimit = (e) => {
    setLimit(e.target.value);
    setPage(1);
  };
  const handleNextPage = () => {
    if (page < qntPage) setPage(page + 1);
  };

  const handlePrevPage = () => {
    if (page > 0) setPage(page - 1);
  };

  const handleClickTable = (data) => {
    if (level === "edition") {
      changeEdition({ AVA_ID: data.id, AVA_NOME: data.name });
    }
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

  const setValuesField = (length) => {
    let cells = []
    for (let i = 0; i < descriptorLength -  length; i++) {
      cells.push(
        <TableCellBorder align="center" style={{background: "#DCDCDC"}}>
          -
        </TableCellBorder>
      )
    } 
    return cells;
  }

  return (
    <Container style={{ maxWidth: "calc(100vw - 330px)" }}>
      {!isPdf && (
        <TopContainer>
          <div className="d-flex mb-2">
            <OverlayTrigger
              key={"toolTip"}
              placement={"top"}
              overlay={
                <PopoverStyled id={`tooltip-top`}>
                  Filtro Avançado
                </PopoverStyled>
              }
            >
              <Marker onClick={changeShowFilter}>
                <MdOutlineFilterAlt color="#FFF" size={24} />
              </Marker>
            </OverlayTrigger>
            <div className="d-flex flex-row-reverse align-items-center ">
              <InputSearch
                size={16}
                type="text"
                placeholder="Pesquise"
                name="searchTerm"
                onChange={handleChangeSearch}
              />
              <IconSearch color={"#7C7C7C"} />
            </div>
          </div>
        </TopContainer>
      )}

      {showFilter && (
        <FilterSelectedContainer>
          <div className="me-2">
            <Form.Label
              style={{
                color: "#7C7C7C",
                fontSize: "12px",
                paddingLeft: 12,
                marginBottom: -5,
              }}
            >
              Nivel:
            </Form.Label>
            <Form.Select
              className="col-3"
              value={filter}
              onChange={handleChangeFilter}
              style={{ border: "none", borderBottom: "1px solid #7C7C7C" }}
            >
              <option value={"Todos"}>Todos</option>
              <option value={75}>Maior Desempenho</option>
              <option value={50}>Desempenho Mediano</option>
              <option value={25}>Desempenho Abaixo da Média</option>
              <option value={0}>Menor Desempenho</option>
            </Form.Select>
          </div>
          <div>
            <ButtonStyled
              onClick={() => {
                changeFilter();
              }}
            >
              Filtrar
            </ButtonStyled>
          </div>
        </FilterSelectedContainer>
      )}
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
            <TableContainer style={{
              overflowY: 'auto',
              maxHeight: '600px'
            }}>
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
                  level={level}
                />
                {level === "student" ? (
                  <TableBody>
                    {dataMapping?.map((data) => (
                      <TableRowStyled
                        key={data.ALT_ID}
                        role="checkbox"
                        tabIndex={-1}
                      >
                        <TableCell component="th" scope="row" padding="normal">
                          {data?.name}
                        </TableCell>
                        {/* {data?.descriptors.map((descriptor) => (
                          <TableCellBorder key={descriptor.id}>
                            {descriptor.value ? descriptor.value : 0}%
                          </TableCellBorder>
                        ))} */}

                        {item?.descriptors?.sort((a,b) => a.cod.localeCompare(b.cod))?.map((descriptor) => {
                          const findDescriptor = data?.descriptors.find(
                            (d) => d?.id === descriptor?.id
                          );

                          if (findDescriptor) {
                            return (
                              <TableCellBorder key={findDescriptor?.id}>
                                {findDescriptor?.value
                                  ? `${findDescriptor?.value}%`
                                  : "0%"}
                              </TableCellBorder>
                            );
                          }

                          return (
                            <TableCellBorder
                              align="center"
                              style={{ background: "#DCDCDC" }}
                              key={descriptor.id}
                            >
                              -
                            </TableCellBorder>
                          );
                        })}

                        <TableCellBorder
                          style={{ color: "#FFF" }}
                          color={nivelColor(data.value)}
                        >
                          {data.value ? data.value : "0"}%
                        </TableCellBorder>
                      </TableRowStyled>
                    ))}
                    <TableRowStyled
                      className="total"
                      key={item?.id}
                      role="checkbox"
                      tabIndex={-1}
                    >
                      <TableCell component="th" scope="row" padding="normal">
                        Média
                      </TableCell>
                      {item?.descriptors?.sort((a,b) => a.cod.localeCompare(b.cod))?.map((descriptor, index) => (
                        <TableCellBorder key={`media${index}`}>
                          {descriptor.value}%
                        </TableCellBorder>
                      ))}
                      <TableCellBorder
                        style={{ color: "#FFF" }}
                        color={nivelColor(item?.media?.mediaNivel)}
                      >
                        {item?.value}%
                      </TableCellBorder>
                    </TableRowStyled>
                  </TableBody>
                ) : (
                  <TableBody>
                    {dataMapping?.map((data) => (
                      <TableRowStyled
                        key={data.id}
                        role="checkbox"
                        tabIndex={-1}
                        onClick={() => {
                          handleClickTable(data);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <TableCell component="th" scope="row" padding="normal">
                          {data.name}
                        </TableCell>
                        {item?.descriptors?.sort((a,b) => a.cod.localeCompare(b.cod))?.map((descriptor) => {
                          const findDescriptor = data?.descriptors.find(
                            (d) => d?.id === descriptor?.id
                          );

                          if (findDescriptor) {
                            return (
                              <TableCellBorder key={findDescriptor?.id}>
                                {findDescriptor?.value
                                  ? `${findDescriptor?.value}%`
                                  : "0%"}
                              </TableCellBorder>
                            );
                          }

                          return (
                            <TableCellBorder
                              align="center"
                              style={{ background: "#DCDCDC" }}
                              key={descriptor.id}
                            >
                              -
                            </TableCellBorder>
                          );
                        })}
                        <TableCellBorder
                          style={{ color: "#FFF" }}
                          color={nivelColor(!!data.value ? data.value : 0)}
                        >
                          {!!data.value ? data.value : 0}%
                        </TableCellBorder>
                      </TableRowStyled>
                    ))}
                    <TableRowStyled
                      className="total"
                      key={item?.id}
                      role="checkbox"
                      tabIndex={-1}
                    >
                      <TableCell component="th" scope="row" padding="normal">
                        Média
                      </TableCell>
                      {item?.descriptors?.sort((a,b) => a.cod.localeCompare(b.cod))?.map((descriptor, index) => (
                        <TableCellBorder key={`media${index}`}>
                          {descriptor.value}%
                        </TableCellBorder>
                      ))}
                      <TableCellBorder
                        style={{ color: "#FFF" }}
                        color={nivelColor(item?.media?.mediaNivel)}
                      >
                        {item?.value}%
                      </TableCellBorder>
                    </TableRowStyled>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
            <Pagination>
              Linhas por página:
              <FormSelectStyled
                value={limit}
                onChange={(e) => handleChangeLimit(e)}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
              </FormSelectStyled>
              <ButtonPage disabled={disablePrev} onClick={handlePrevPage}>
                <MdNavigateBefore size={24} />
              </ButtonPage>
              <ButtonPage disabled={disableNext} onClick={handleNextPage}>
                <MdNavigateNext size={24} />
              </ButtonPage>
            </Pagination>
          </Paper>
        </Box>
      )}
    </Container>
  );
}
