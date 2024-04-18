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
  Title,
  ButtonDownload
} from "./styledComponents";
import {
  MdNavigateNext,
  MdNavigateBefore,
  MdOutlineDownload,
  MdOutlineMessage,
} from "react-icons/md";

import { TableCellBorder } from "src/shared/styledTables";
import { getImportExports } from "src/services/importar.service";
import { formatDate } from "src/utils/date";
import useDebounce from "src/utils/use-debounce";
import ModalConfirmacao from "src/components/modalConfirmacao";
import ModalErrorImport from "src/components/modalErrorImport";

interface Data {
  DAT_ID: string;
  DAT_NOME: string;
  DAT_DT_CRIACAO: string;
  DAT_USU_NOME: string;
  DAT_STATUS: string;
  DAT_OBS: string;
  DAT_ARQUIVO_URL: string;
  DAT_ARQUIVO_ERROR_URL: string;
}

function createData(
  DAT_ID: string,
  DAT_NOME: string,
  DAT_DT_CRIACAO: string,
  DAT_USU_NOME: string,
  DAT_STATUS: string,
  DAT_OBS: string,
  DAT_ARQUIVO_URL: string,
  DAT_ARQUIVO_ERROR_URL: string,
): Data {
  return {
    DAT_ID,
    DAT_NOME,
    DAT_DT_CRIACAO,
    DAT_USU_NOME,
    DAT_STATUS,
    DAT_OBS,
    DAT_ARQUIVO_URL,
    DAT_ARQUIVO_ERROR_URL
  };
}

interface HeadCell {
  id: keyof Data;
  label: string;
  centered: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "DAT_NOME",
    centered: false,
    label: "DADOS",
  },
  {
    id: "DAT_DT_CRIACAO",
    centered: false,
    label: "DATA",
  },
  {
    id: "DAT_USU_NOME",
    centered: false,
    label: "USUÁRIO",
  },
  {
    id: "DAT_STATUS",
    centered: false,
    label: "STATUS",
  },
  {
    id: "DAT_OBS",
    centered: true,
    label: "OBS",
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
        {headCells?.map((headCell) => (
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
              hideSortIcon={headCell.id === "DAT_OBS"}
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

export function History({ url }) {
  const [order, setOrder] = useState("asc");
  const [orderBy] = useState("DAT_NOME");
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [page, setPage] = useState(1);
  const [qntPage, setQntPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [search, setSearch] = useState(null);
  const [searchTerm, setSearchTerm] = useState(null);
  const [disablePrev, setDisablePrev] = useState(true);
  const [disableNext, setDisableNext] = useState(false);
  const [openModalErrorMessage , setOpenModalErrorMessage] = useState(false);
  const [openModalErrorImport , setOpenModalErrorImport] = useState(false);
  const [obs, setObs] = useState('');
  const [errorUrl, setErrorUrl] = useState('');

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const StatusEmun = {
    ERROR: 'Erro',
    SUCCESS: 'Sucesso',
    IN_PROGRESS: 'Em andamento'
  }

  const handleRequestSort = (
    _event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = order === "asc";
    const orderNew = isAsc ? "desc" : "asc";
    setOrder(orderNew);
    setSelectedColumn(property);
    loadImportExport(search, page, limit, property, orderNew);
  };

  useEffect(() => {
    setDisablePrev(page === 1 ? true : false);
    setDisableNext(page === qntPage ? true : false);
  }, [qntPage, page]);

  const handleChangePage2 = (direction) => {
    if (direction === "prev") {
      setPage(page - 1);
      loadImportExport(search, page - 1, limit, selectedColumn, order);
    } else {
      setPage(page + 1);
      loadImportExport(search, page + 1, limit, selectedColumn, order);
    }
  };
  const handleChangeLimit = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(parseInt(event.target.value));
    setPage(1);
    loadImportExport(
      search,
      1,
      Number(event.target.value),
      selectedColumn,
      order
    );
  };

  useEffect(() => {
    loadImportExport(search, page, limit, selectedColumn, order);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const [rows, setRows] = useState([]);
  const tableBody = useRef();

  async function loadImportExport(
    _search: string,
    _page: number,
    _limit: number,
    _column: string,
    _order: string
  ) {
    const resp = await getImportExports(
      _search,
      _page,
      _limit,
      _column,
      _order.toUpperCase()
    );

    setQntPage(parseInt(resp.data.meta?.totalPages));
    let list = [];
    resp?.data?.items?.map((x) => {
      list.push(
        createData(
          x.DAT_ID,
          x.DAT_NOME,
          x.DAT_DT_CRIACAO,
          x.DAT_USU?.USU_NOME,
          x.DAT_STATUS,
          x.DAT_OBS,
          x.DAT_ARQUIVO_URL,
          x.DAT_ARQUIVO_ERROR_URL
        )
      );
    });

    setRows(list);
  }

  useEffect(() => {
    loadImportExport(search, page, limit, selectedColumn, order);
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

  const OpenModal = (item) => {
    if(item?.DAT_ARQUIVO_ERROR_URL){
      setErrorUrl(`${url}/files/file/${item.DAT_ARQUIVO_ERROR_URL}`)
      setOpenModalErrorImport(true);
    }
    else{
      setObs(item?.DAT_OBS);
      setOpenModalErrorMessage(true);
    }
  }

  const setRow = (row, index) => {
    const labelId = `enhanced-table-checkbox-${index}`;

    return (
      <TableRowStyled
        role="checkbox"
        tabIndex={-1}
        onClick={() => {
          /* TODO document why this arrow function is empty */
        }}
        key={row.DAT_ID}
      >
        <TableCell component="th" id={labelId} scope="row" padding="normal">
          {row.DAT_NOME}
        </TableCell>
        <TableCellBorder>
          {formatDate(row.DAT_DT_CRIACAO, "dd/MM/yyyy - HH'h'mm")}
        </TableCellBorder>
        <TableCellBorder>{row.DAT_USU_NOME}</TableCellBorder>
        <TableCellBorder>
          <Status color={row.DAT_STATUS}>{StatusEmun[row.DAT_STATUS]}</Status>
        </TableCellBorder>
        <TableCellBorder align="center">
          {row.DAT_STATUS === "SUCCESS" ? (
            <ButtonDownload
              type='button'
              href={`${url}/files/file/${row.DAT_ARQUIVO_URL}`}
              target="_blank" 
            >
              <MdOutlineDownload size={18} color="#4B4B4B"/>
            </ButtonDownload>
          ) : (
            <>
              {row.DAT_STATUS === "ERROR" ? (
                <ButtonDownload onClick={() => {OpenModal(row)}}
                >
                  <MdOutlineMessage size={18} color="#4B4B4B"/>
                </ButtonDownload>
              ) : (
                <></>
              )}
            </>
          )}
        </TableCellBorder>
      </TableRowStyled>
    );
  };

  return (
    <>
      <Container>
        <Title className="ms-3 pt-3">Histórico</Title>
        <TopContainer>
          <div className="d-flex ms-3 mb-3">
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
                  {rows?.map((row, index) => {
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
      <ModalConfirmacao
        show={openModalErrorMessage}
        onHide={() => {
          setOpenModalErrorMessage(false);
        }}
        text={obs}
        warning={true}
      />
      <ModalErrorImport
        show={openModalErrorImport}
        onHide={() => {
          setOpenModalErrorImport(false);
        }}
        errorUrl={errorUrl}
        // text={obs}
        // warning={true}
      />
    </>
  );
}
