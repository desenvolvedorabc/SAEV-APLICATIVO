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
import {
  Container,
  TableCellBorderWidth,
  TopContainer,
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
import { useGetHistoryExport } from "src/services/exportar.service";
import { format } from "date-fns";

interface Data {
  id: number;
  type: string;
  date: string;
  user: string;
  city: string;
  link: string;
}

function createData(
  id: number,
  type: string,
  date: string,
  user: string,
  city: string,
  link: string,
): Data {
  return {
    id,
    type,
    date,
    user,
    city,
    link,
  };
}

interface HeadCell {
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "type",
    numeric: false,
    label: "TIPO DE MICRODADOS",
  },
  {
    id: "date",
    numeric: false,
    label: "DATA/HORA",
  },
  {
    id: "user",
    numeric: false,
    label: "USUÁRIO",
  },
  {
    id: "city",
    numeric: false,
    label: "MUNICÍPIO",
  },
  {
    id: "link",
    numeric: false,
    label: "LINK",
  },
];

function EnhancedTableHead() {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCellStyled
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={"normal"}
          >
            <TableSortLabelStyled
            >
              {headCell.label}
            </TableSortLabelStyled>
          </TableCellStyled>
        ))}
      </TableRow>
    </TableHead>
  );
}

export function TableExport({url}) {
  const [page, setPage] = useState(1);
  const [qntPage, setQntPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [disablePrev, setDisablePrev] = useState(true);
  const [disableNext, setDisableNext] = useState(false);

  const { data, isLoading } = useGetHistoryExport(
    page,
    limit,
    "ASC",
  );
  
  useEffect(() => {
    let list = [];

    setQntPage(data?.meta?.totalPages);

    data?.items?.map((x) => {
      list.push(
        createData(
          x.id,
          x.type,
          x.createdAt,
          x.user?.USU_NOME,
          x.county?.MUN_NOME,
          x.file,
        )
      );
    });
    setRows(list);
  }, [data?.items, data?.meta?.totalPages]);

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

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * limit - rows.length) : 0;
    
  const setRow = (row, index) => {
    const labelId = `enhanced-table-checkbox-${index}`;

    return (
      <TableRowStyled role="checkbox" tabIndex={-1} key={index}>
        <TableCell component="th" id={labelId} scope="row" padding="normal">
          {row.type}
        </TableCell>
        <TableCellBorderWidth>{row.date ? format(new Date(row.date),"dd/MM/yyyy - HH'h'mm") : null}</TableCellBorderWidth>
        <TableCellBorder>{row.user}</TableCellBorder>
        <TableCellBorder>{row.city}</TableCellBorder>
        <TableCellBorder><a style={{fontSize: 12}} href={`${url}/microdata/file/${row.link}`} target="_blank" download rel="noreferrer">{row.link}</a></TableCellBorder>
      </TableRowStyled>
    );
  };

  return (
    <Container>
      <TopContainer className="mb-2">
        <div>
          <strong>Histórico</strong>
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
              <EnhancedTableHead />
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
