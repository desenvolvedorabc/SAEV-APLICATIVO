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
import { getSubPerfis } from "src/services/sub-perfis.service";
import { Container, TopContainer } from "./styledComponents";
import {
  InputSearch,
  IconSearch,
  TableCellBorder,
  Pagination,
  FormSelectStyled,
  ButtonPage,
  TableCellStyled,
  TableRowStyled,
  TableSortLabelStyled,
} from "src/shared/styledTables";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { ButtonPadrao } from "src/components/buttons/buttonPadrao";

import Router from "next/router";
import Link from "next/link";
import useDebounce from "src/utils/use-debounce";

interface Data {
  SPE_ID: string;
  SPE_NOME: string;
  PER_NOME: string;
  AREAS: string;
}

function createData(
  SPE_ID: string,
  SPE_NOME: string,
  PER_NOME: string,
  AREAS: string
): Data {
  return {
    SPE_ID,
    SPE_NOME,
    PER_NOME,
    AREAS,
  };
}

interface HeadCell {
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "PER_NOME",
    numeric: false,
    label: "PERFIL BASE",
  },
  {
    id: "SPE_NOME",
    numeric: false,
    label: "SUB-PERFIL",
  },
  {
    id: "SPE_ID",
    numeric: false,
    label: "CÓD",
  },
  {
    id: "AREAS",
    numeric: false,
    label: "ÁREAS HABILITADAS",
  },
];

interface EnhancedTableProps {
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => void;
  order: string;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCellStyled
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={"normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.id === 'PER_NOME' ? (
               <TableSortLabelStyled
               active={orderBy === headCell.id}
               direction={order === "asc" ? "desc" : "asc"}
               onClick={createSortHandler(headCell.id)}
             >
               {headCell.label}
               {orderBy === headCell.id ? (
                 <Box component="span" sx={visuallyHidden}>
                   {order === "desc" ? "sorted descending" : "sorted ascending"}
                 </Box>
               ) : null}
             </TableSortLabelStyled>
               ): (
                 <strong>{headCell.label}</strong>

            )}
            
          </TableCellStyled>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default function TablePerfil() {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("PER_NOME");
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [page, setPage] = useState(1);
  const [qntPage, setQntPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [search, setSearch] = useState(null);
  const [searchTerm, setSearchTerm] = useState(null);
  const [disablePrev, setDisablePrev] = useState(true);
  const [disableNext, setDisableNext] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = order === "asc";
    const formattedOrder = isAsc ? "desc" : "asc";
    setOrder(formattedOrder);
    setSelectedColumn(property);
    loadSubPerfis(search, page, limit, property, formattedOrder);
  };

  useEffect(() => {
    setDisablePrev(page === 1 ? true : false);
    setDisableNext(page === qntPage ? true : false);
  }, [qntPage, page]);

  const handleChangePage2 = (direction) => {
    if (direction === "prev") {
      setPage(page - 1);
      loadSubPerfis(search, page - 1, limit, selectedColumn, order);
    } else {
      setPage(page + 1);
      loadSubPerfis(search, page + 1, limit, selectedColumn, order);
    }
  };
  const handleChangeLimit = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(parseInt(event.target.value));
    setPage(1);
    loadSubPerfis(search, 1, Number(event.target.value), selectedColumn, order);
  };

  useEffect(() => {
    loadSubPerfis(search, page, limit, selectedColumn, order);
  }, [search]);

  const [rows, setRows] = useState([]);

  async function loadSubPerfis(
    search: string,
    page: number,
    limit: number,
    selectedColumn: string,
    order: string
  ) {
    const respSubPerfis = await getSubPerfis(
      search,
      page,
      limit,
      selectedColumn,
      order.toUpperCase()
    );

    // const inicio = respSubPerfis?.data.links?.last.search('=')
    // const fim = respSubPerfis?.data.links?.last.search('&')
    // setQntPage(parseInt(respSubPerfis.data.links?.last.substring(inicio + 1, fim)))

    let list = [];
    setQntPage(respSubPerfis.data.meta?.totalPages);
    respSubPerfis.data.items?.map((x) => {
      list.push(createData(x.SPE_ID, x.SPE_NOME, x.SPE_PER?.PER_NOME, x.AREAS));
    });
    setRows(list);
  }

  useEffect(() => {
    loadSubPerfis(search, page, limit, selectedColumn, order);
  }, []);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * limit - rows.length) : 0;

    useEffect(() => {
      if (debouncedSearchTerm) {
        setSearch(debouncedSearchTerm)
      }
      else
        setSearch("")
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[debouncedSearchTerm]);
  
    const handleChangeSearch = (e) => {
      setSearchTerm(e.target.value);
    };

  return (
    <Container>
      <TopContainer>
        <div className="d-flex flex-row-reverse align-items-center ms-2">
          <InputSearch
            size={16}
            type="text"
            placeholder="Pesquise"
            name="searchTerm"
            onChange={handleChangeSearch}
          />
          <IconSearch color={"#7C7C7C"} />
        </div>
        <div>
          <ButtonPadrao
            onClick={() => {
              Router.push("/perfil");
            }}
          >
            Adicionar Sub-Perfil
          </ButtonPadrao>
        </div>
      </TopContainer>
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
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />

              <TableBody>
                {rows.map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <Link
                      href={`/perfil/editar/${row.SPE_ID}`}
                      key={row.SPE_ID}
                      passHref
                    >
                      <TableRowStyled role="checkbox" tabIndex={-1}>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="normal"
                        >
                          {row.PER_NOME}
                        </TableCell>
                        <TableCellBorder>{row.SPE_NOME}</TableCellBorder>
                        <TableCellBorder>{row.SPE_ID}</TableCellBorder>
                        <TableCellBorder>
                          {row.AREAS.map((x, index) =>
                            index < row.AREAS.length - 1 ? (
                              <span>{x.ARE_DESCRICAO}, </span>
                            ) : (
                              <span>{x.ARE_DESCRICAO}</span>
                            )
                          )}
                        </TableCellBorder>
                      </TableRowStyled>
                    </Link>
                  );
                })}
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
