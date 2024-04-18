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
import { saveAbsences, getAbsences } from "src/services/infrequencia.service";
import {
  Container,
  TopContainer,
} from "./styledComponents";
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

import ButtonWhite from "src/components/buttons/buttonWhite";
import { ButtonPadrao } from "src/components/buttons/buttonPadrao";
import ModalConfirmacao from "src/components/modalConfirmacao";
import ModalAviso from "src/components/modalAviso";
import { TextField } from "@mui/material";
import Router from 'next/router'
import useDebounce from "src/utils/use-debounce";

interface Data {
  ALU_ID: string;
  ALU_INEP: number;
  ALU_NOME: string;
  ALU_FALTAS: string;
}

function createData(
  ALU_ID: string,
  ALU_INEP: number,
  ALU_NOME: string,
  ALU_FALTAS: string
): Data {
  return {
    ALU_ID,
    ALU_INEP,
    ALU_NOME,
    ALU_FALTAS,
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
    id: "ALU_INEP",
    numeric: false,
    label: "NÚM. INEP",
  },
  {
    id: "ALU_NOME",
    numeric: false,
    label: "ALUNO",
  },
  {
    id: "ALU_FALTAS",
    numeric: false,
    label: "FALTAS",
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

type TableProps = {
  county: any;
  serie: any;
  school: any;
  schoolClass: any;
  year: any;
  month: any;
};

export function TableInfrequencia({
  county,
  school,
  schoolClass,
  serie,
  year,
  month
}: TableProps) {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("ALU_ID");
  const [modalStatus, setModalStatus] = useState(true)
  const [modalShowConfirm, setModalShowConfirm] = useState(false);
  const [modalTextConfirm, setModalTextConfirm] = useState("");
  const [modalShowWarning, setModalShowWarning] = useState(false);
  const [errorMessage, setErrorMessage] = useState(true)
  const [selectedColumn, setSelectedColumn] = useState("ALU_NOME");
  const [page, setPage] = useState(1);
  const [qntPage, setQntPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [search, setSearch] = useState(null);
  const [searchTerm, setSearchTerm] = useState(null);
  const [disablePrev, setDisablePrev] = useState(true);
  const [disableNext, setDisableNext] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [qntAlunos, setQntAlunos] = useState(0)
  const [listInfrequencia, setListInfrequencia] = useState([])
  const [isDisabled, setIsDisabled] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  let changeFilter = false;

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = order === "asc";
    const orderSelect = isAsc ? "desc" : "asc";
    setOrder(orderSelect);
    setSelectedColumn(property);
    loadAbsence(search, page, limit, property, orderSelect, schoolClass?.TURMA_TUR_ID, year, month.MES_ID);
  };

  useEffect(() => {
    setDisablePrev(page === 1 ? true : false);
    setDisableNext(page === qntPage ? true : false);
  }, [qntPage, page]);

  const handleChangePage2 = (direction) => {
    if (direction === "prev") {
      setPage(page - 1);
      loadAbsence(
        search,
        page - 1,
        limit,
        selectedColumn,
        order,
        schoolClass?.TURMA_TUR_ID,
        year,
        month.MES_ID
      );
    } else {
      setPage(page + 1);
      loadAbsence(
        search,
        page + 1,
        limit,
        selectedColumn,
        order,
        schoolClass?.TURMA_TUR_ID,
        year,
        month.MES_ID
      );
    }
  };
  const handleChangeLimit = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(parseInt(event.target.value));
    setPage(1);
    loadAbsence(
      search,
      1,
      Number(event.target.value),
      selectedColumn,
      order,
      schoolClass?.TURMA_TUR_ID,
      year,
      month.MES_ID
    );
  };

  useEffect(() => {
    loadAbsence(search, page, limit, selectedColumn, order, schoolClass?.TURMA_TUR_ID, year, month.MES_ID);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const [rows, setRows] = useState([]);
  const tableBody = useRef();

  async function loadAbsence(
    _search: string,
    _page: number,
    _limit: number,
    _selectedColumn: string,
    _order: string,
    _schoolClass: string,
    _year: string,
    _month: number
  ) {
    const respAlunos = await getAbsences(
      _search,
      _page,
      _limit,
      _selectedColumn,
      _order.toUpperCase(),
      _schoolClass,
      _year,
      _month
      );

    const inicio = respAlunos?.data.links?.last.search("=");
    const fim = respAlunos?.data.links?.last.search("&");
    setQntAlunos(respAlunos?.data?.meta?.totalItems)
    setQntPage(
      parseInt(respAlunos.data.links?.last.substring(inicio + 1, fim))
    );

    let list = [];
    let listInfr = changeFilter ? [] : listInfrequencia
    respAlunos.data.items?.map((x) => {
      list.push(
        createData(x.ALU_ID, x.ALU_INEP, x.ALU_NOME, x.MUN_NOME)
      );
      let find = listInfr.find(alu => alu.IFR_ALU_ID === x.ALU_ID)
      if(!find){
        listInfr.push({
          IFR_MES: month,
          IFR_ANO: year,
          IFR_FALTA: x.INFREQUENCIA_IFR_FALTA ? x.INFREQUENCIA_IFR_FALTA  : 
          0,
          IFR_SCHOOL_CLASS: schoolClass?.TURMA_TUR_ID,
          IFR_ALU_ID: x.ALU_ID
        })
      }
    });


    setListInfrequencia(listInfr)

    setRows(list);

    changeFilter = false
  }

  useEffect(() => {
    if (isLoadingData) {
      loadAbsence(
        search,
        page,
        limit,
        selectedColumn,
        order,
        schoolClass?.TURMA_TUR_ID,
        year,
        month.MES_ID
      );
      setIsLoadingData(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingData]);

  useEffect(() => {
    changeFilter = true;
    loadAbsence(
      search,
      page,
      limit,
      selectedColumn,
      order,
      schoolClass?.TURMA_TUR_ID,
      year,
      month.MES_ID
    );
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schoolClass, year, month]);

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

  const handleChangeInfrequencia = (e, idAluno) => {
    let find = false

    if(e.target.value <= 30 && e.target.value >= 0){
      listInfrequencia.map(x => {
        if(x.IFR_ALU_ID === idAluno){
          x.IFR_FALTA = e.target.value
          setListInfrequencia([...listInfrequencia])
          find = true
        }
      })
      if(!find){
        setListInfrequencia([...listInfrequencia, 
          {
            IFR_MES: month,
            IFR_ANO: year,
            IFR_FALTA: e.target.value,
            IFR_SCHOOL_CLASS: schoolClass?.TURMA_TUR_ID,
            IFR_ALU_ID: idAluno
          }
        ])
      }
    }
  }

  const getInfrequencia = (idAluno) => {
    let aluno
    aluno = listInfrequencia.find(x => x.IFR_ALU_ID === idAluno)
    return aluno?.IFR_FALTA
  }

  const handleSubmit = async () => {

    
    setIsDisabled(true)
    let response = null;
    try{
      response = await saveAbsences(listInfrequencia)
    }
    catch (err) {
      setIsDisabled(false)
    } finally {
      setIsDisabled(false)
    }

    if (response.status === 200 && response?.data?.status !== 401) {
      setModalStatus(true)
      setModalShowConfirm(true)
    }
    else {
      setModalStatus(false)
      setModalShowConfirm(true)
      setErrorMessage(response.data.message || 'Erro ao apontar infrequências')
    }

  }

  const setRow = (row, index) => {
    const labelId = `enhanced-table-checkbox-${index}`;

    return (
      // <Link href={`/aluno/${row.ALU_ID}`} key={row.ALU_ID}>
      <TableRowStyled key={row.ALU_ID + month?.MES_ID} role="checkbox" tabIndex={-1} className="disable-hover">
        <TableCell component="th" id={labelId} scope="row" padding="normal">
          {row.ALU_ID}
        </TableCell>
        <TableCellBorder>{row.ALU_INEP}</TableCellBorder>
        {/* <TableCellBorderWidth>{month}</TableCellBorderWidth> */}
        <TableCellBorder component="th" scope="row" padding="normal">
          {row.ALU_NOME}
        </TableCellBorder>
        <TableCellBorder>
          {" "}
          <div style={{ width: "90px" }}>
            <TextField
              fullWidth={false}
              type="number"
              label=" "
              name="ALU_INEP"
              id="ALU_INEP"
              value={getInfrequencia(row.ALU_ID)}
              size="small"
              InputProps={{ inputProps: { min: 0, max: 30 } }}
              onChange={(e) => handleChangeInfrequencia(e, row.ALU_ID)}
            />
          </div>
        </TableCellBorder>
      </TableRowStyled>
      // </Link>
    );
  };

  return (
    <>
      {!isLoadingData ? (
        <Container>
          <TopContainer>
            {!!serie && (
              <h3>
                {county?.MUN_CIDADE}, {school?.ESC_NOME}, {serie?.SER_NOME} -{" "}
                {schoolClass?.TURMA_TUR_NOME} - {schoolClass?.TURMA_TUR_PERIODO} - {year} - {month.MES_NOME} ({qntAlunos}{" "}
                Alunos)
              </h3>
            )}
            <div className="d-flex m-2">
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

          <footer>
            <div style={{ width: 160 }}>
              <ButtonWhite
                type="button"
                onClick={() => setModalShowWarning(true)}
              >
                Descartar
              </ButtonWhite>
            </div>
            <div className="ms-3" style={{ width: 160 }}>
              <ButtonPadrao
                type="submit"
                disable={isDisabled}
                onClick={() => {
                  handleSubmit()
                }}
              >
                Salvar Infrequencia
              </ButtonPadrao>
            </div>
          </footer>
        </Container>
      ) : (
        <h1>...</h1>
      )}

      <ModalAviso
        show={modalShowWarning}
        onConfirm={() => {
          setModalShowWarning(false), setIsLoadingData(true), Router.reload();
        }}
        onHide={() => {
          // setModalShowConfirm(true);
          //Router.reload();
          setModalShowWarning(false);
          // setModalTextConfirm("Dados de infrequência descartados.");
        }}
        newModalFormat
        buttonNo={"Manter Apontamento"}
        buttonYes={"Sim, Descartar"}
        text={`Tem certeza que deseja descartar o apontamento de infrequência?

        ${schoolClass?.TURMA_TUR_NOME} - ${schoolClass?.TURMA_TUR_PERIODO}
        ${serie?.SER_NOME}
        ${school?.ESC_NOME}`}
        warning
      />

      <ModalConfirmacao
        show={modalShowConfirm}
        onHide={() => {
          setModalShowConfirm(false);
          Router.reload()}
        }
        textConfirm="Fechar"
        text={modalStatus ? `Infrequência apontada com sucesso!` : errorMessage}
        status={modalStatus}
      />
    </>
  );
}
