import * as React from "react";
import { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { visuallyHidden } from "@mui/utils";
import { useGetYears } from "src/services/anos.service";
import {
  Container,
  InputSearch,
  IconSearch,
  TopContainer,
  Pagination,
  FormSelectStyled,
  ButtonPage,
  TableCellStyled,
  TableRowStyled,
  TableSortLabelStyled,
} from "./styledComponents";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { ButtonPadrao } from "src/components/buttons/buttonPadrao";
import { TableCellBorder } from "src/shared/styledTables";
import {ModalChangeYear} from "../modalChangeYear";
import useDebounce from "src/utils/use-debounce";

interface Data {
  ANO_ID: string;
  ANO_NOME: string;
  ANO_ATIVO: string;
}

function createData(ANO_ID: string, ANO_NOME: string, ANO_ATIVO: string): Data {
  return {
    ANO_ID,
    ANO_NOME,
    ANO_ATIVO,
  };
}

interface HeadCell {
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "ANO_NOME",
    numeric: false,
    label: "ANO LETIVO",
  },
  {
    id: "ANO_ATIVO",
    numeric: false,
    label: "STATUS",
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
          </TableCellStyled>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default function TableAnos() {
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("ANO_NOME");
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [page, setPage] = useState(1);
  const [qntPage, setQntPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [search, setSearch] = useState(null);
  const [searchTerm, setSearchTerm] = useState(null);
  const [disablePrev, setDisablePrev] = useState(true);
  const [disableNext, setDisableNext] = useState(false);
  const [modalChangeOpen, setModalChangeOpen] = useState(false);
  const [selectedAno, setSelectedAno] = useState(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data, isLoading } = useGetYears(search, page, limit, selectedColumn, order.toUpperCase(), null);

  useEffect(() => {
    let list = [];

    setQntPage(data?.meta?.totalPages);

    data?.items?.map((x) => {
      list.push(createData(x.ANO_ID, x.ANO_NOME, x.ANO_ATIVO ? "Ativo" : "Inativo"));
    });
    setRows(list);
  }, [data?.items, data?.meta?.totalPages]);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = order === "asc";
    const orderNew = isAsc ? "desc" : "asc";
    setOrder(orderNew);
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

  const [rows, setRows] = useState([]);
  const tableBody = useRef();

  useEffect(() => {
    setPage(1)
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

  const handleChangeYear = (ano) => {
    setSelectedAno(ano)
    setModalChangeOpen(true)
  }

  const setRow = (row, index) => {
    const labelId = `enhanced-table-checkbox-${index}`;

    return (
      <TableRowStyled role="checkbox" tabIndex={-1} onClick={() => {handleChangeYear(row)}} key={row.ANO_ID}>
        <TableCell component="th" id={labelId} scope="row" padding="normal">
          {row.ANO_NOME}
        </TableCell>
        <TableCellBorder>
          {row.ANO_ATIVO}
        </TableCellBorder>
      </TableRowStyled>
    );
  };

  return (
    <Container>
      <TopContainer>
        <div className="d-flex ms-2 mb-2">
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
        <div style={{ width: 160 }}>
          <ButtonPadrao onClick={() => {handleChangeYear(null)}}>Cadastrar Ano Letivo</ButtonPadrao>
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
              <TableBody id="tableBody" ref={tableBody}>
                {rows.map((row, index) => {
                  return setRow(row, index);
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
      <ModalChangeYear
        show={modalChangeOpen}
        onHide={() => { setModalChangeOpen(false) }}
        ano={selectedAno}
        reload={() => null}
      />
    </Container>
  );
}
