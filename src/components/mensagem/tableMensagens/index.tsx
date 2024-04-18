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
import { deleteMessage, getMessages } from "src/services/mensagens.service";
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
  Status,
  ButtonDelete,
  Text,
} from "./styledComponents";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { ButtonPadrao } from "src/components/buttons/buttonPadrao";
import { BiTrash } from "react-icons/bi";
import Router from "next/router";

import { TableCellBorder } from "src/shared/styledTables";
import { ModalDelete } from "src/components/modalDelete";
import { ModalMessage } from "../modalMessage";
import { formatDate } from "src/utils/date";
import useDebounce from "src/utils/use-debounce";

interface Data {
  MEN_ID: string;
  MEN_TITLE: string;
  MEN_TEXT: string;
  MEN_MUN: string;
  MEN_DT_CRIACAO: string;
  MEN_IS_DELETE: boolean;
  ACTION: string;
}

function createData(
  MEN_ID: string,
  MEN_TITLE: string,
  MEN_TEXT: string,
  MEN_MUN: string,
  MEN_DT_CRIACAO: string,
  MEN_IS_DELETE: boolean,
  ACTION: string
): Data {
  return {
    MEN_ID,
    MEN_TITLE,
    MEN_TEXT,
    MEN_MUN,
    MEN_DT_CRIACAO,
    MEN_IS_DELETE,
    ACTION,
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
    id: "MEN_MUN",
    centered: false,
    label: "MUNICÍPIOS",
  },
  {
    id: "MEN_DT_CRIACAO",
    centered: false,
    label: "DATA",
  },
  {
    id: "MEN_IS_DELETE",
    centered: false,
    label: "STATUS",
  },
  {
    id: "ACTION",
    centered: true,
    label: "AÇÃO",
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
              onClick={createSortHandler(headCell.id)}
              hideSortIcon={
                headCell.id != "MEN_TITLE" && headCell.id != "MEN_DT_CRIACAO"
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

export default function TableMensagens() {
  const [order, setOrder] = useState("desc");
  const [orderBy] = useState("ANO_NOME");
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [page, setPage] = useState(1);
  const [qntPage, setQntPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [search, setSearch] = useState(null);
  const [searchTerm, setSearchTerm] = useState(null);
  const [disablePrev, setDisablePrev] = useState(true);
  const [disableNext, setDisableNext] = useState(false);
  const [modalShowMessage, setModalShowMessage] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [modalShowDelete, setModalShowDelete] = useState(false);
  const [idDeleteMessage, setIdDeleteMessage] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const handleRequestSort = (
    _event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = order === "asc";
    const orderNew = isAsc ? "desc" : "asc";
    setOrder(orderNew);
    setSelectedColumn(property);
    loadMessages(search, page, limit, property, orderNew);
  };

  async function handleDeleteMessage() {
    try {
      await deleteMessage(idDeleteMessage);
      setModalShowDelete(false);
      setIdDeleteMessage("");
      Router.reload();
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    setDisablePrev(page === 1 ? true : false);
    setDisableNext(page === qntPage ? true : false);
  }, [qntPage, page]);

  const handleChangePage2 = (direction) => {
    if (direction === "prev") {
      setPage(page - 1);
      loadMessages(search, page - 1, limit, selectedColumn, order);
    } else {
      setPage(page + 1);
      loadMessages(search, page + 1, limit, selectedColumn, order);
    }
  };
  const handleChangeLimit = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(parseInt(event.target.value));
    setPage(1);
    loadMessages(search, 1, Number(event.target.value), selectedColumn, order);
  };

  useEffect(() => {
    loadMessages(search, page, limit, selectedColumn, order);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const [rows, setRows] = useState([]);
  const tableBody = useRef();

  const getMun = (munList) => {
    let list = "";
    munList.map((x, index) => {
      if (index != munList.length - 1) list = list.concat(x.MUN_NOME, ", ");
      else list = list.concat(x.MUN_NOME);
    });

    return list;
  };

  async function loadMessages(
    _search: string,
    _page: number,
    _limit: number,
    _selectedColumn: string,
    _order: string
  ) {
    const respMensagem = await getMessages(
      _search,
      _page,
      _limit,
      _selectedColumn,
      _order
    );

    setQntPage(parseInt(respMensagem.data.meta?.totalPages));

    let list = [];
    respMensagem?.data?.items.map((x) => {
      list.push(
        createData(
          x.MEN_ID,
          x.MEN_TITLE,
          x.MEN_TEXT,
          getMun(x.municipios),
          x.MEN_DT_CRIACAO,
          x.MEN_IS_DELETE,
          null
        )
      );
    });

    setRows(list);
  }

  useEffect(() => {
    loadMessages(search, page, limit, selectedColumn, order);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const handleShowMessage = (mensagem) => {
    setSelectedMessage(mensagem);
    setModalShowMessage(true);
  };

  const setRow = (row, index) => {
    const labelId = `enhanced-table-checkbox-${index}`;

    return (
      <TableRowStyled
        role="checkbox"
        tabIndex={-1}
        onClick={() => {
          handleShowMessage(row);
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
        <TableCellBorder>{row.MEN_MUN}</TableCellBorder>
        <TableCellBorder>
          {formatDate(row.MEN_DT_CRIACAO, "dd/MM/yyyy")}
        </TableCellBorder>
        <TableCellBorder>
          {!row.MEN_IS_DELETE ? (
            <Status enviado={!row.MEN_IS_DELETE}>Enviada</Status>
          ) : (
            <Status>Deletada</Status>
          )}
        </TableCellBorder>
        <TableCellBorder align="center">
          {!row.MEN_IS_DELETE && (
            <ButtonDelete
              type="button"
              onClick={(e) => {
                setModalShowDelete(true);
                setIdDeleteMessage(row.MEN_ID);
                e.stopPropagation();
              }}
            >
              <BiTrash color={"#FF6868"} size={16} />
            </ButtonDelete>
          )}
        </TableCellBorder>
      </TableRowStyled>
    );
  };

  return (
    <>
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
            <ButtonPadrao
              onClick={() => {
                Router.push("/mensagem");
              }}
            >
              Enviar Mensagem
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
      <ModalDelete
        show={modalShowDelete}
        onHide={() => setModalShowDelete(false)}
        onConfirm={handleDeleteMessage}
        buttonNo={"Manter Mensagem"}
        buttonYes={"Deletar Mensagem"}
        text={`Você está deletando a mensagem e não ficará mais visível aos municípios.`}
      />
      <ModalMessage
        show={modalShowMessage}
        onHide={() => setModalShowMessage(false)}
        message={selectedMessage}
      />
    </>
  );
}
