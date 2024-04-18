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
import { visuallyHidden } from "@mui/utils";
import { useGetCountiesReport } from "src/services/municipios.service";
import {
  Container,
  TableCellStyled,
  Circle,
  FilterStatusContainer,
  Marker,
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
import { Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import { MdOutlineFilterAlt, MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { ButtonPadrao } from "src/components/buttons/buttonPadrao";
import Router from "next/router";
import ButtonWhite from "../../buttons/buttonWhite";
import Link from "next/link";
import useDebounce from "src/utils/use-debounce";
import { Loading } from "src/components/Loading";

interface Data {
  MUN_ID: string;
  MUN_NOME: string;
  MUN_UF: string;
  MUN_COD_IBGE: string;
  TOTAL_ESCOLAS: number;
  TOTAL_ALUNOS: number;
  ENTURMADOS: number;
}

function createData(MUN_ID: string, MUN_NOME: string, MUN_UF: string, MUN_COD_IBGE: string, TOTAL_ESCOLAS: number, TOTAL_ALUNOS: number, ENTURMADOS: number): Data {
  return {
    MUN_ID,
    MUN_NOME,
    MUN_UF,
    MUN_COD_IBGE,
    TOTAL_ESCOLAS,
    TOTAL_ALUNOS,
    ENTURMADOS,
  };
}

interface HeadCell {
  id: keyof Data;
  label: string;
  status: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "MUN_NOME",
    status: false,
    label: "MUNICÍPIO",
  },
  {
    id: "MUN_UF",
    status: false,
    label: "UF",
  },
  {
    id: "MUN_COD_IBGE",
    status: false,
    label: "CÓD IBGE",
  },
  {
    id: "TOTAL_ESCOLAS",
    status: false,
    label: "ESCOLAS",
  },
  {
    id: "TOTAL_ALUNOS",
    status: false,
    label: "ALUNOS",
  },
  {
    id: "ENTURMADOS",
    status: false,
    label: "ENTURMAÇÃO",
  },
];

interface EnhancedTableProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
  order: string;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  const showSort = (headCellId) => {
    if(headCellId === 'MUN_NOME' || headCellId === 'MUN_UF'){
      return true;
    }
    return false;
  }


  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCellStyled key={headCell.id} align={headCell.status ? "center" : "left"} padding={"normal"} sortDirection={orderBy === headCell.id ? order : false}>
            {showSort(headCell.id) ? (
              <TableSortLabelStyled active={orderBy === headCell.id} direction={order === "asc" ? "desc" : "asc"} onClick={createSortHandler(headCell.id)}>
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc" ? "sorted descending" : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabelStyled>
            ) : (
              <>{headCell.label}</>
            )}
          </TableCellStyled>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default function TableMunicipios() {
  const [order, setOrder] = useState("asc");
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState("MUN_NOME");
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [qntPage, setQntPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState(null);
  const [searchTerm, setSearchTerm] = useState(null);
  const [disablePrev, setDisablePrev] = useState(true);
  const [disableNext, setDisableNext] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data, isLoading } = useGetCountiesReport(search, page, limit, selectedColumn, order?.toUpperCase(), filterStatus);

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Data) => {
    const isAsc = order === "asc";
    const loadOrder = isAsc ? "desc" : "asc";
    setOrder(loadOrder);
    setSelectedColumn(property);
  };

  useEffect(() => {
    setDisablePrev(page === 1 ? true : false);
    setDisableNext(page === qntPage ? true : false);
  }, [qntPage, page]);

  const handleChangePage2 = (direction) => {
    if (direction === "prev") {
      setPage(page - 1);
    } else {
      setPage(page + 1);
    }
  };

  const handleChangeLimit = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(parseInt(event.target.value));
    setPage(1);
  };

  useEffect(() => {
    let list = [];

    setQntPage(data?.meta?.totalPages);

    data?.items?.map((x) => {
      list.push(
        createData(
          x.MUN_ID,
          x.MUN_NOME,
          x.MUN_UF,
          x.MUN_COD_IBGE,
          x.TOTAL_ESCOLAS,
          x.TOTAL_ALUNOS,
          x.ENTURMADOS,
        )
      );
    });
    setRows(list);
  }, [data?.items, data?.meta?.totalPages]);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * limit - rows.length) : 0;

  const statusColor = (status) => {
    if (status === "verde") return "#64BC47";
    if (status === "amarelo") return "#FAD036";
    return "#FF6868";
  };

  const handleSelectStatus = (e) => {
    setSelectedStatus(e.target.value);
  };

  const FilterStatus = () => {
    setFilterStatus(selectedStatus);
    setPage(1)
  };

  useEffect(() => {
    if (debouncedSearchTerm) {
      setPage(1)
      setSearch(debouncedSearchTerm)
    }
    else
      setSearch("")
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[debouncedSearchTerm]);

  const handleChangeSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const changeShowFilter = (e) => {
    setShowFilter(!showFilter);
  };

  return (
    <Container>
      <TopContainer>
        <div className="d-flex mb-2">
          {/* <OverlayTrigger key={"toolTip"} placement={"top"} overlay={<Tooltip id={`tooltip-top`}>Filtro Avançado</Tooltip>}>
            <Marker onClick={changeShowFilter}>
              <MdOutlineFilterAlt color="#FFF" size={24} />
            </Marker>
          </OverlayTrigger> */}
          <div className="ms-2 d-flex flex-row-reverse align-items-center ">
            <InputSearch size={16} type="text" placeholder="Pesquise" name="searchTerm" onChange={handleChangeSearch} />
            <IconSearch color={"#7C7C7C"} />
          </div>
        </div>
        <div style={{ width: 160 }}>
          <ButtonPadrao
            onClick={() => {
              Router.push("/municipio");
            }}
          >
            Adicionar Município
          </ButtonPadrao>
        </div>
      </TopContainer>
      {/* {showFilter && (
        <FilterStatusContainer>
          <div className="me-2">
            <Form.Label
              style={{
                color: "#7C7C7C",
                fontSize: "12px",
                paddingLeft: 12,
                marginBottom: -5,
              }}
            >
              Status
            </Form.Label>
            <Form.Select
              className="col-3"
              value={selectedStatus}
              onChange={handleSelectStatus}
              style={{
                border: "none",
                borderBottom: "1px solid #7C7C7C",
                width: "150px",
              }}
            >
              <option value="">Todos</option>
              <option value="verde">Verde</option>
              <option value="amarelo">Amarelo</option>
              <option value="vermelho">Vermelho</option>
            </Form.Select>
          </div>
          <div>
            <ButtonWhite
              onClick={() => {
                FilterStatus();
              }}
            >
              Filtrar
            </ButtonWhite>
          </div>
        </FilterStatusContainer>
      )} */}
      <Box sx={{ width: "100%" }}>
        <Paper
          sx={{
            width: "100%",
            mb: 2,
            borderBottomLeftRadius: "10px",
            borderBottomRightRadius: "10px",
          }}
        >
        {isLoading ? (
         <Loading />
        ) : (
            <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={"medium"}>
              <EnhancedTableHead order={order} orderBy={selectedColumn} onRequestSort={handleRequestSort} rowCount={rows.length} />

              <TableBody>
                {rows.length > 0 ? (
                  rows.map((row, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <Link href={`/municipio/${row.MUN_ID}`} key={row.MUN_ID} passHref>
                        <TableRowStyled role="checkbox" tabIndex={-1}>
                          <TableCell component="th" id={labelId} scope="row" padding="normal">
                            {row.MUN_NOME}
                          </TableCell>
                          <TableCellBorder>{row.MUN_UF}</TableCellBorder>
                          <TableCellBorder>{row.MUN_COD_IBGE}</TableCellBorder>
                          <TableCellBorder>{row.TOTAL_ESCOLAS.toLocaleString("pt-BR")}</TableCellBorder>
                          <TableCellBorder>{row.TOTAL_ALUNOS.toLocaleString("pt-BR")}</TableCellBorder>
                          <TableCellBorder>{row.ENTURMADOS}%</TableCellBorder>
                        </TableRowStyled>
                      </Link>
                    );
                  })
                ) : (
                  <></>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
          <Pagination>
            Linhas por página:
            <FormSelectStyled value={limit} onChange={handleChangeLimit}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
            </FormSelectStyled>
            <ButtonPage onClick={() => handleChangePage2("prev")} disabled={disablePrev}>
              <MdNavigateBefore size={24} />
            </ButtonPage>
            <ButtonPage onClick={() => handleChangePage2("next")} disabled={disableNext}>
              <MdNavigateNext size={24} />
            </ButtonPage>
          </Pagination>
        </Paper>
      </Box>
    </Container>
  );
}
