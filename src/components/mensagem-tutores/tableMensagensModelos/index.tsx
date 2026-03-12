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
import { deleteMessage } from "src/services/mensagens.service";
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
  Marker,
} from "./styledComponents";
import { MdNavigateNext, MdNavigateBefore, MdOutlineFilterAlt } from "react-icons/md";
import { ButtonPadrao } from "src/components/buttons/buttonPadrao";
import { BiTrash } from "react-icons/bi";
import Router from "next/router";

import { ButtonStyled, FilterSelectedContainer, TableCellBorder } from "src/shared/styledTables";
import { ModalDelete } from "src/components/modalDelete";
import { formatDate } from "src/utils/date";
import useDebounce from "src/utils/use-debounce";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import brLocale from "date-fns/locale/pt-BR";
import { isValidDate } from "src/utils/validate";
import { deleteMessageTutor, useGetMessageTemplates } from "src/services/mensagens-tutores.service";
import { queryClient } from "src/lib/react-query";

interface Data {
  MEN_ID: string;
  MEN_TITLE: string;
  MEN_TEXT: string;
  MEN_DT_CRIACAO: string;
  MEN_IS_DELETE: boolean;
  ACTION: string;
}

function createData(
  MEN_ID: string,
  MEN_TITLE: string,
  MEN_TEXT: string,
  MEN_DT_CRIACAO: string,
  MEN_IS_DELETE: boolean,
  ACTION: string
): Data {
  return {
    MEN_ID,
    MEN_TITLE,
    MEN_TEXT,
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

export default function TableMensagensModelos({ }) {
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
  const [modalShowDelete, setModalShowDelete] = useState(false);
  const [idDeleteMessage, setIdDeleteMessage] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [showFilter, setShowFilter] = useState(false)
  const [sendDate, setSendDate] = useState(null);
  const [date, setDate] = useState(null);

  const handleRequestSort = (
    _event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = order === "asc";
    const orderNew = isAsc ? "desc" : "asc";
    setOrder(orderNew);
    setSelectedColumn(property);
  };

  async function handleDeleteMessage() {
    try {
      await deleteMessageTutor(idDeleteMessage);
      setModalShowDelete(false);
      setIdDeleteMessage("");
      queryClient.invalidateQueries(["message-templates"]);
      // Router.reload();
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

  const { data, isLoading } = useGetMessageTemplates(search, page, limit, selectedColumn, order.toUpperCase(), date);

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
            x.updatedAt,
            x.MEN_IS_DELETE,
            null
          )
        );
      });
  
      setRows(list);
    }
  }, [data]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      setSearch(debouncedSearchTerm)
    }
    else
      setSearch("")
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[debouncedSearchTerm]);

  const changeShowFilter = () => {
    setShowFilter(!showFilter)
  }

  const filterSelected = () => {
    setPage(1)
    setDate(sendDate)
  }

  const handleChangeSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const setRow = (row, index) => {
    const labelId = `enhanced-table-checkbox-${index}`;

    return (
      <TableRowStyled
        role="checkbox"
        tabIndex={-1}
        onClick={() => {
          Router.push(`/modelo-mensagem-tutores/editar/${row.MEN_ID}`);
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
          {formatDate(row.MEN_DT_CRIACAO, "dd/MM/yyyy")}
        </TableCellBorder>
        <TableCellBorder>
          <Status enviado={!row.MEN_IS_DELETE}>Modelo</Status>
        </TableCellBorder>
        <TableCellBorder align="center">
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
        </TableCellBorder>
      </TableRowStyled>
    );
  };

  return (
    <>
      <Container>
        <TopContainer>
          <div className="d-flex mb-2">
            <OverlayTrigger
              key={"toolTip"}
              placement={"top"}
              overlay={
                <Tooltip id={`tooltip-top`}>
                  Filtro Avançado
                </Tooltip>
              }
            >
              <Marker onClick={changeShowFilter}>
                <MdOutlineFilterAlt color="#FFF" size={24} />
              </Marker>
            </OverlayTrigger>
            <div className="d-flex flex-row-reverse align-items-center ">
              <InputSearch data-test='search' size={16} type="text" placeholder="Pesquise" name="searchTerm"
                onChange={handleChangeSearch}
              />
              <IconSearch color={'#7C7C7C'} />
            </div>
          </div>
          <div style={{ width: 160 }}>
            <ButtonPadrao
              onClick={() => {
                Router.push("/modelo-mensagem-tutores");
              }}
            >
              Criar Modelo
            </ButtonPadrao>
          </div>
        </TopContainer>
        {showFilter &&
          <FilterSelectedContainer>
            <div style={{ width: 164 }} className="pe-3">
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                locale={brLocale}
              >
                <DatePicker
                  openTo="year"
                  views={["year", "month", "day"]}
                  label="Data Envio:"
                  value={sendDate}
                  onChange={(val) => {
                    if (isValidDate(val)) {
                      setSendDate(val);
                      return;
                    }
                    setSendDate("");
                  }}
                  renderInput={(params) => (
                    <TextField
                      fullWidth
                      size="small"
                      {...params}
                      sx={{ backgroundColor: "#FFF" }}
                    />
                  )}
                />
              </LocalizationProvider>
            </div>
            <div>
              <ButtonStyled onClick={() => { filterSelected() }}>Filtrar</ButtonStyled>
            </div>
          </FilterSelectedContainer >
        }
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
        text={`Voce está deletando esse modelo. Tem certeza que deseja prosseguir?`}
      />
    </>
  );
}
