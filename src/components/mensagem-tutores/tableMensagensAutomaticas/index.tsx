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
  Pagination,
  FormSelectStyled,
  ButtonPage,
  TableCellStyled,
  TableRowStyled,
  TableSortLabelStyled,
  Status,
  Text,
  TopContainer,
  Marker,
  InputSearch,
  IconSearch,
  FilterSelectedContainer,
  ButtonStyled,
} from "./styledComponents";
import { MdNavigateNext, MdNavigateBefore, MdOutlineFilterAlt } from "react-icons/md";
import Router from "next/router";

import { TableCellBorder } from "src/shared/styledTables";
import { ModalDelete } from "src/components/modalDelete";
import { formatDate } from "src/utils/date";
import useDebounce from "src/utils/use-debounce";
import { queryClient } from "src/lib/react-query";
import { NotificationRuleType, useGetAutomaticMessage } from "src/services/mensagens-automaticas.service";
import { maskPhoneCountry } from "src/utils/masks";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { ButtonPadrao } from "src/components/buttons/buttonPadrao";
import { DatePicker, LocalizationProvider } from "@mui/lab";
import { Autocomplete, TextField } from "@mui/material";
import { isValidDate } from "src/utils/validate";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import brLocale from "date-fns/locale/pt-BR";

const StatusMessage = {
  PENDENTE: 'Pendente',
  NAO_ENVIADO: 'Não Enviado',
  ENTREGUE: 'Entregue',
  ENVIADO: 'Enviado',
  FALHOU: 'Falhou',
}

interface Data {
  MEN_ID: string;
  MEN_TITLE: string;
  MEN_TEXT: string;
  MEN_TIPO: string;
  MEN_DESTINATARIOS: string;
  MEN_DATA: string;
  MEN_EMAIL: string;
  MEN_WHATSAPP: string;
  MEN_STATUS_EMAIL: boolean;
  MEN_STATUS_WHATSAPP: boolean;
}

function createData(
  MEN_ID: string,
  MEN_TITLE: string,
  MEN_TEXT: string,
  MEN_TIPO: string,
  MEN_DESTINATARIOS: string,
  MEN_DATA: string,
  MEN_EMAIL: string,
  MEN_WHATSAPP: string,
  MEN_STATUS_EMAIL: boolean,
  MEN_STATUS_WHATSAPP: boolean
): Data {
  return {
    MEN_ID,
    MEN_TITLE,
    MEN_TEXT,
    MEN_TIPO,
    MEN_DESTINATARIOS,
    MEN_DATA,
    MEN_EMAIL,
    MEN_WHATSAPP,
    MEN_STATUS_EMAIL,
    MEN_STATUS_WHATSAPP
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
    id: "MEN_DESTINATARIOS",
    centered: false,
    label: "DESTINATÁRIO",
  },
  {
    id: "MEN_TIPO",
    centered: false,
    label: "TIPO",
  },
  {
    id: "MEN_DATA",
    centered: false,
    label: "DATA ENVIO",
  },
  {
    id: "MEN_EMAIL",
    centered: false,
    label: "EMAIL",
  },
  {
    id: "MEN_WHATSAPP",
    centered: false,
    label: "WHATSAPP",
  },
  {
    id: "MEN_STATUS_EMAIL",
    centered: false,
    label: "STATUS EMAIL",
  },
  {
    id: "MEN_STATUS_WHATSAPP",
    centered: false,
    label: "STATUS WHATSAPP",
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

export default function TableMensagensAutomaticas({ }) {
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
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [showFilter, setShowFilter] = useState(false)
  const [sendDate, setSendDate] = useState(null);
  const [date, setDate] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [type, setType] = useState(null);

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

  const { data, isLoading } = useGetAutomaticMessage(search, page, limit, selectedColumn, order.toUpperCase(), type, date);

  useEffect(() => {
    if(data){
      setQntPage(parseInt(data.meta?.totalPages));
  
      let list = [];
      data?.items.map((x) => {
        list.push(
          createData(
            x.id,
            x?.rule?.title,
            x?.rule?.content,
            x.ruleType,
            x.student?.ALU_NOME,
            x.createdAt,
            x.student?.ALU_EMAIL,
            x.student?.ALU_WHATSAPP,
            x.statusEmail,
            x.statusWhatsapp,
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
    setType(selectedType)
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
          {/* <Text>
            <div dangerouslySetInnerHTML={{ __html: row.MEN_TEXT }} />
          </Text> */}
        </TableCell>
        <TableCellBorder>
          {row.MEN_DESTINATARIOS}
        </TableCellBorder>
        <TableCellBorder>
          {NotificationRuleType[row.MEN_TIPO]}
        </TableCellBorder>
        <TableCellBorder>
          {formatDate(row.MEN_DATA)}
        </TableCellBorder>
        <TableCellBorder>
          {row.MEN_EMAIL}
        </TableCellBorder>
        <TableCellBorder>
          {maskPhoneCountry(row.MEN_WHATSAPP)}
        </TableCellBorder>
        <TableCellBorder>
          <Status color={row.MEN_STATUS_EMAIL}>
            {StatusMessage[row.MEN_STATUS_EMAIL]}
          </Status>
        </TableCellBorder>
        <TableCellBorder>
          <Status color={row.MEN_STATUS_WHATSAPP}>
            {StatusMessage[row.MEN_STATUS_WHATSAPP]}
          </Status>
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
            <Autocomplete
              sx={{background: "#FFF", width: 164}}
              fullWidth
              className=""
              data-test='ruleType'
              id="ruleType"
              size="small"
              value={selectedType}
              noOptionsText="Tipo"
              options={Object.keys(NotificationRuleType)}
              getOptionLabel={option => NotificationRuleType[option]}
              onChange={(_event, newValue) => {
                setSelectedType(newValue)
              }}
              renderInput={(params) => <TextField size="small" {...params} label="Tipo" />}
            />
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
              borderRadius: "10px",
              // borderBottomRightRadius: "10px",
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
