/* eslint-disable @next/next/link-passhref */
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
import { getStudentsTransfer } from "src/services/alunos.service";
import {
  Container,
} from "./styledComponents";
import {
  TableCellBorder,
  Pagination,
  FormSelectStyled,
  ButtonPage,
  TableCellStyled,
  TableRowStyled,
  TableSortLabelStyled,
} from "src/shared/styledTables";
import {
  MdNavigateNext,
  MdNavigateBefore,
} from "react-icons/md";

import Link from "next/link";

interface Data {
  ALU_ID: string;
  ALU_NOME: string;
  ALU_INEP: number;
  MUN_NOME: string;
  ESC_NOME: string;
  ESC_INEP: string;
  SER_NOME: string;
  TUR_NOME: string;
  ALU_STATUS: string;
}

function createData(
  ALU_ID: string,
  ALU_NOME: string,
  ALU_INEP: number,
  MUN_NOME: string,
  ESC_NOME: string,
  ESC_INEP: string,
  SER_NOME: string,
  TUR_NOME: string,
  ALU_STATUS: string
): Data {
  return {
    ALU_ID,
    ALU_NOME,
    ALU_INEP,
    MUN_NOME,
    ESC_NOME,
    ESC_INEP,
    SER_NOME,
    TUR_NOME,
    ALU_STATUS,
  };
}

interface HeadCell {
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "ALU_ID",
    numeric: false,
    label: "CÓD",
  },
  {
    id: "ALU_NOME",
    numeric: false,
    label: "ALUNO",
  },
  {
    id: "ALU_INEP",
    numeric: false,
    label: "NÚM. INEP",
  },
  {
    id: "MUN_NOME",
    numeric: false,
    label: "MUNICÍPIO",
  },
  {
    id: "ESC_NOME",
    numeric: false,
    label: "ESCOLA",
  },
  {
    id: "ESC_INEP",
    numeric: false,
    label: "CÓD INEP",
  },
  {
    id: "SER_NOME",
    numeric: false,
    label: "SÉRIE",
  },
  {
    id: "TUR_NOME",
    numeric: false,
    label: "TURMA",
  },
  {
    id: "ALU_STATUS",
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

export function TableAlunosTransfer({ escola, busca }) {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("ALU_ID");
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [page, setPage] = useState(1);
  const [qntPage, setQntPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [disablePrev, setDisablePrev] = useState(true);
  const [disableNext, setDisableNext] = useState(false);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setSelectedColumn(property);
    setPage(1)
    loadStudentsTable(1, limit, property, order);
  };

  useEffect(() => {
    setDisablePrev(page === 1 ? true : false);
    setDisableNext(page === qntPage ? true : false);
  }, [qntPage, page]);

  const handleChangePage2 = (direction) => {
    if (direction === "prev") {
      setPage(page - 1);
      loadStudentsTable(
        page - 1,
        limit,
        selectedColumn,
        order,
      );
    } else {
      setPage(page + 1);
      loadStudentsTable(
        page + 1,
        limit,
        selectedColumn,
        order,
      );
    }
  };
  const handleChangeLimit = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(parseInt(event.target.value));
    setPage(1);
    loadStudentsTable(
      1,
      Number(event.target.value),
      selectedColumn,
      order,
    );
  };

  const [rows, setRows] = useState([]);
  const tableBody = useRef();

  async function loadStudentsTable(
    _page: number,
    _limit: number,
    _selectedColumn: string,
    _order: string,
  ) {
    const respAlunos = await getStudentsTransfer(
      busca,
      _page,
      _limit,
      _selectedColumn,
      _order.toUpperCase(),
      escola ? escola : null,
      "1"
    );
    const inicio = respAlunos?.data.links?.last.search("=");
    const fim = respAlunos?.data.links?.last.search("&");
    setQntPage(
      parseInt(respAlunos.data.links?.last.substring(inicio + 1, fim))
    );

    let list = [];
    // listFilter = listFilter?.length > 0 ? listFilter : 
    respAlunos?.data?.items?.forEach((item) => {
      list.push(
        createData(
          item.ALU_ID,
          item.ALU_NOME,
          item.ALU_INEP,
          item.MUN_NOME,
          item.ESC_NOME,
          item.ESC_INEP,
          item.SER_NOME,
          item.TUR_NOME,
          item.ALU_STATUS
        )
      );
    });

    setRows(list);
  }

  useEffect(() => {
    console.log('alterou2');
    setPage(1)
    loadStudentsTable(
      1,
      limit,
      selectedColumn,
      order,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [escola, busca]);

  const setRow = (row, index) => {
    const labelId = `enhanced-table-checkbox-${index}`;

    return (
      <Link href={`/transferencia/aluno/${row.ALU_ID}`} key={row.ALU_ID}>
        <TableRowStyled role="checkbox" tabIndex={-1}>
          <TableCell component="th" id={labelId} scope="row" padding="normal">
            {row.ALU_ID}
          </TableCell>
          <TableCellBorder>{row.ALU_NOME}</TableCellBorder>
          <TableCellBorder>{row.ALU_INEP}</TableCellBorder>
          <TableCellBorder>{row.MUN_NOME}</TableCellBorder>
          <TableCellBorder>{row.ESC_NOME}</TableCellBorder>
          <TableCellBorder>{row.ESC_INEP}</TableCellBorder>
          <TableCellBorder>{row.SER_NOME}</TableCellBorder>
          <TableCellBorder>{row.TUR_NOME}</TableCellBorder>
          <TableCellBorder>{row.ALU_STATUS}</TableCellBorder>
        </TableRowStyled>
      </Link>
    );
  };

  return (
    <Container>
      {/*<TopContainer>
         <div className="d-flex mb-2">
          <div className="d-flex flex-row-reverse align-items-center ms-3">
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
      </TopContainer>*/}
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
    </Container>
  );
}
