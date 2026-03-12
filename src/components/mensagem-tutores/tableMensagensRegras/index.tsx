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
  TopContainer,
  Pagination,
  FormSelectStyled,
  ButtonPage,
  TableCellStyled,
  TableRowStyled,
  TableSortLabelStyled,
  Status,
  Text,
} from "./styledComponents";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { ButtonPadrao } from "src/components/buttons/buttonPadrao";
import Router from "next/router";

import { TableCellBorder } from "src/shared/styledTables";
import useDebounce from "src/utils/use-debounce";
import { NotificationRuleType, useGetAutomaticMessageRules } from "src/services/mensagens-automaticas.service";

interface Data {
  MEN_ID: string;
  MEN_TITLE: string;
  MEN_TEXT: string;
  MEN_TYPE: string;
  MEN_STATUS: boolean;
}

function createData(
  MEN_ID: string,
  MEN_TITLE: string,
  MEN_TEXT: string,
  MEN_TYPE: string,
  MEN_STATUS: boolean,
): Data {
  return {
    MEN_ID,
    MEN_TITLE,
    MEN_TEXT,
    MEN_TYPE,
    MEN_STATUS,
  };
}

interface HeadCell {
  id: keyof Data;
  label: string;
  centered: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "MEN_TITLE",
    centered: false,
    label: "MENSAGEM",
  },
  {
    id: "MEN_TYPE",
    centered: false,
    label: "TIPO",
  },
  {
    id: "MEN_STATUS",
    centered: true,
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
            align={headCell.centered ? "center" : "left"}
            padding={"normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabelStyled
              active={orderBy === headCell.id}
              direction={order === "asc" ? "desc" : "asc"}
              hideSortIcon={
                true
              }
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

export default function TableMensagensRegras({ }) {
  const [order, setOrder] = useState("desc");
  const [orderBy] = useState("ANO_NOME");
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [page, setPage] = useState(1);
  const [qntPage, setQntPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [disablePrev, setDisablePrev] = useState(true);
  const [disableNext, setDisableNext] = useState(false);

  const handleRequestSort = (
    _event: React.MouseEvent<unknown>,
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

  const { data, isLoading } = useGetAutomaticMessageRules(null, page, limit, selectedColumn, order.toUpperCase());

  useEffect(() => {
    if(data){
      setQntPage(parseInt(data.meta?.totalPages));
  
      let list = [];
      data?.items.map((x) => {
        list.push(
          createData(
            x.id,
            x.title,
            x.content,
            x.ruleType,
            x.active,
          )
        );
      });
  
      setRows(list);
    }
  }, [data]);

  const setRow = (row, index) => {
    const labelId = `enhanced-table-checkbox-${index}`;

    return (
      <TableRowStyled
        role="checkbox"
        tabIndex={-1}
        onClick={() => {
          Router.push(`/regras-automaticas/editar/${row.MEN_ID}`);
        }}
        key={row.MEN_ID}
      >
        <TableCell
          component="th"
          id={labelId}
          scope="row"
          padding="normal"
          style={{ maxWidth: 400 }}
        >
          {row.MEN_TITLE} <br />
          <Text>
            <div dangerouslySetInnerHTML={{ __html: row.MEN_TEXT }} />
          </Text>
        </TableCell>
        <TableCellBorder>
          {NotificationRuleType[row.MEN_TYPE]}
        </TableCellBorder>
        <TableCellBorder>
          <Status ativo={row.MEN_STATUS}>{row.MEN_STATUS ? "Ativo" : "Inativo"}</Status>
        </TableCellBorder>
      </TableRowStyled>
    );
  };

  return (
    <>
      <Container>
        <TopContainer>
          <div className="d-flex mb-2">
          </div>
          <div style={{ width: 160 }}>
            <ButtonPadrao
              onClick={() => {
                Router.push("/regras-automaticas");
              }}
            >
              Criar Regra
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
      </Container>
    </>
  );
}
