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
import { getExportStudentsExcel, useGetStudents } from "src/services/alunos.service";
import {
  Container,
  TopContainer,
  TableCellBorderWidth,
} from "./styledComponents";
import {
  FilterSelectedContainer,
  Marker,
  InputSearch,
  IconSearch,
  TableCellBorder,
  Pagination,
  FormSelectStyled,
  ButtonPage,
  TableCellStyled,
  TableRowStyled,
  TableSortLabelStyled,
  ActiveTag,
  PointActiveTag,
} from "src/shared/styledTables";
import {
  MdOutlineFilterAlt,
  MdNavigateNext,
  MdNavigateBefore,
} from "react-icons/md";
import { ButtonPadrao } from "src/components/buttons/buttonPadrao";
import { saveAs } from 'file-saver';

import Link from "next/link";
import ButtonWhite from "src/components/buttons/buttonWhite";
import { FormControl, InputLabel, MenuItem, Select, Tooltip } from "@mui/material";
import { AutoCompletePagMun } from "src/components/AutoCompletePag/AutoCompletePagMun";
import { AutoCompletePagEscMun } from "src/components/AutoCompletePag/AutoCompletePagEscMun";
import useDebounce from "src/utils/use-debounce";
import { useRouter } from "next/router";
import Router from "next/router";
import ModalConfirmacao from "src/components/modalConfirmacao";
import { Loading } from "src/components/Loading";
import { format } from "date-fns";
import { useAuth } from "src/context/AuthContext";

interface Data {
  ALU_ID: string;
  ALU_NOME: string;
  ALU_DT_NASC: string;
  ALU_NOME_MAE: string;
  MUN_NOME: string;
  ESC_NOME: string;
  SER_NOME: string;
  TUR_NOME: string;
  ALU_ATIVO: string;
}

function createData(
  ALU_ID: string,
  ALU_NOME: string,
  ALU_DT_NASC: string,
  ALU_NOME_MAE: string,
  MUN_NOME: string,
  ESC_NOME: string,
  SER_NOME: string,
  TUR_NOME: string,
  ALU_ATIVO: string
): Data {
  return {
    ALU_ID,
    ALU_NOME,
    ALU_DT_NASC,
    ALU_NOME_MAE,
    MUN_NOME,
    ESC_NOME,
    SER_NOME,
    TUR_NOME,
    ALU_ATIVO
  };
}

interface DataExport {
  ALU_ID: string;
  ALU_NOME: string;
  ALU_DT_NASC: number;
  ALU_NOME_MAE: string;
  MUN_NOME: string;
  ESC_NOME: string;
  SER_NOME: string;
  TUR_NOME: string;
  ALU_ATIVO: string;

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
    id: "ALU_DT_NASC",
    numeric: false,
    label: "NASCIMENTO",
  },
  {
    id: "ALU_NOME_MAE",
    numeric: false,
    label: "NOME MÃE",
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
    id: "ALU_ATIVO",
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

export function TableAlunos({idMun, idEsc}) {
  const { user } = useAuth()
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("ALU_ID");
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [filterCity, setFilterCity] = useState(idMun !== 'null' ? {MUN_ID: idMun} : null);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [filterSchool, setFilterSchool] = useState(idEsc != "null" ? {ESC_ID: idEsc} : null);
  const [selectedEnturmado, setSelectedEnturmado] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [filterEnturmado, setFilterEnturmado] = useState(null)
  const [filterStatus, setFilterStatus] = useState(null)
  const [modalShowConfirm, setModalShowConfirm] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [page, setPage] = useState(1);
  const [qntPage, setQntPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [search, setSearch] = useState(null);
  const [searchTerm, setSearchTerm] = useState(null);
  const [disablePrev, setDisablePrev] = useState(true);
  const [disableNext, setDisableNext] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [resetSchool, setResetSchool] = useState(false)

  useEffect(() => {
    if(user?.USU_SPE?.SPE_PER?.PER_NOME === "Município"){
      setFilterCity({MUN_ID: user?.USU_MUN?.MUN_ID})
    }
    if(user?.USU_SPE?.SPE_PER?.PER_NOME === "Escola"){
      setFilterCity({MUN_ID: user?.USU_MUN?.MUN_ID})
      setFilterSchool({ESC_ID: user?.USU_ESC?.ESC_ID})
    }

  }, [user])
   
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data, isLoading } = useGetStudents(
    search,
    page,
    limit,
    selectedColumn,
    order.toUpperCase(),
    filterCity?.MUN_ID,
    filterSchool?.ESC_ID,
    filterEnturmado,
    null,
    filterStatus
  );

  const filterSelected = () => {
    setFilterCity(selectedCity)
    setFilterSchool(selectedSchool)
    setFilterEnturmado(selectedEnturmado)
    setFilterStatus(selectedStatus)
    setPage(1)
  }
  
  useEffect(() => {
    let list = [];

    setQntPage(data?.meta?.totalPages);

    data?.items?.map((x) => {
      list.push(
        createData(
          x.ALU_ID,
          x.ALU_NOME,
          x.ALU_DT_NASC,
          x.ALU_NOME_MAE,
          x.MUN_NOME,
          x.ESC_NOME,
          x.SER_NOME,
          x.TUR_NOME,
          x.ALU_ATIVO,
        )
      );
    });
    setRows(list);
    console.log('list :', list);
  }, [data?.items, data?.meta?.totalPages]);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = order === "asc";
    setOrder(isAsc ? "desc" : "asc");
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

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * limit - rows.length) : 0;
    
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

  const handleSelectCity = (newValue) => {
    setSelectedCity(newValue);
    setSelectedSchool(null);
    setFilterSchool(null);
    setResetSchool(!resetSchool)
  };
  const handleSelectSchool = (newValue) => {
    setSelectedSchool(newValue);
  };

  const handleSelectEnturmado = (e) => {
    setSelectedEnturmado(e.target.value != " " ? e.target.value : null);
  };

  const handleSelectStatus = (e) => {
    setSelectedStatus(e.target.value != " " ? e.target.value : null);
  };

  const changeShowFilter = (e) => {
    setShowFilter(!showFilter);
  };


  const downloadCsv = async () => {
    const resp = await getExportStudentsExcel(
      search,
      1,
      999999,
      selectedColumn,
      order.toUpperCase(),
      filterCity?.MUN_ID,
      filterSchool?.ESC_ID,
      filterEnturmado,
      null
    );
    if(!resp.data.message) {
      saveAs(resp?.data, 'Alunos.xls');
    } else {
      setModalShowConfirm(true);
      if(!filterCity){
        setErrorMessage("Informe pelo menos o município.")
      } else{
        setErrorMessage(resp?.data?.message)
      }
    }
  };

  const setRow = (row, index) => {
    const labelId = `enhanced-table-checkbox-${index}`;

    return (
      <Link href={`/municipio/${filterCity?.MUN_ID}/escola/${filterSchool?.ESC_ID}/aluno/${row.ALU_ID}`} key={row.ALU_ID}>
        <TableRowStyled role="checkbox" tabIndex={-1}>
          <TableCell component="th" id={labelId} scope="row" padding="normal">
            {row.ALU_ID}
          </TableCell>
          <TableCellBorderWidth>{row.ALU_NOME}</TableCellBorderWidth>
          <TableCellBorder>{row.ALU_DT_NASC && !Number.isNaN(new Date(row.ALU_DT_NASC).getTime()) ? format(new Date(row.ALU_DT_NASC), 'dd/MM/yyyy') : ''}</TableCellBorder>
          <TableCellBorder>{row.ALU_NOME_MAE}</TableCellBorder>
          <TableCellBorder>{row.MUN_NOME}</TableCellBorder>
          <TableCellBorder>{row.ESC_NOME}</TableCellBorder>
          <TableCellBorder>{row.SER_NOME}</TableCellBorder>
          <TableCellBorder>{row.TUR_NOME}</TableCellBorder>
          <TableCellBorder align="center">
            <ActiveTag active={row.ALU_ATIVO}>
              <PointActiveTag active={row.ALU_ATIVO} />
              {row.ALU_ATIVO ? 'Ativo' : 'Inativo'}
              <div></div>
            </ActiveTag>
          </TableCellBorder>
        </TableRowStyled>
      </Link>
    );
  };

  return (
    <Container>
      <TopContainer>
        <div className="d-flex mb-2">
            <Tooltip 
              title={'Filtro Avançado'} 
              arrow 
              placement="top" 
              componentsProps={{
                tooltip: {
                  sx: {
                    bgcolor: '#000',
                    color: '#fff',
                    '& .MuiTooltip-arrow': {
                      color: '#000',
                    },
                  },
                },
              }}
            >
            <Marker onClick={changeShowFilter}>
              <MdOutlineFilterAlt color="#FFF" size={24} />
            </Marker>
          </Tooltip>
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
        <div className="d-flex">
          <div className="pe-2" style={{ width: 110 }}>
            <ButtonWhite
              onClick={(e) => {
                downloadCsv();
              }}
            >
              Exportar
            </ButtonWhite>
          </div>
          <div style={{ width: 148 }}>
            <Tooltip 
              title={!filterCity ? 'Necessário filtrar por um município' : ''} 
              arrow 
              placement="bottom" 
              componentsProps={{
                tooltip: {
                  sx: {
                    bgcolor: '#000',
                    color: '#fff',
                    '& .MuiTooltip-arrow': {
                      color: '#000',
                    },
                  },
                },
              }}
            >
              <div>
                <ButtonPadrao onClick={() => {Router.push(`/municipio/${filterCity?.MUN_ID}/escola/${filterSchool?.ESC_ID}/aluno`)}} disable={!filterCity}>Cadastrar Aluno</ButtonPadrao>
              </div>
            </Tooltip>
          </div>
        </div>
      </TopContainer>
      {showFilter && (
        <FilterSelectedContainer>
          <div className="me-2">
            <AutoCompletePagMun county={selectedCity} changeCounty={handleSelectCity} width={"150px"} />
          </div>
          <div className="pe-2 me-2 border-end border-white">
            <AutoCompletePagEscMun school={selectedSchool} changeSchool={handleSelectSchool} mun={selectedCity} resetSchools={resetSchool} width={"150px"} />
          </div> 
          <div className="me-2 pe-2 border-end border-white">
            <FormControl sx={{ width: 150 }} size="small">
              <InputLabel id="status">Enturmação</InputLabel>
              <Select
                labelId="status"
                id="status"
                value={selectedEnturmado}
                label="Enturmação"
                onChange={handleSelectEnturmado}
                sx={{
                  backgroundColor:"#fff",
                  "& .Mui-disabled": {
                    background: "#D3D3D3",
                  },
                }}
              >
                <MenuItem value={" "}>
                  <em>Todos</em>
                </MenuItem>
                <MenuItem value="Enturmado">Enturmado</MenuItem>
                <MenuItem value="Não Enturmado">Não Enturmado</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="me-3">
            <FormControl sx={{ width: 150 }} size="small">
              <InputLabel id="status">Status</InputLabel>
              <Select
                labelId="status"
                id="status"
                value={selectedStatus}
                label="Status"
                onChange={handleSelectStatus}
                sx={{
                  backgroundColor:"#fff",
                  "& .Mui-disabled": {
                    background: "#D3D3D3",
                  },
                }}
              >
                <MenuItem value={" "}>
                  <em>Todos</em>
                </MenuItem>
                <MenuItem value="1">Ativo</MenuItem>
                <MenuItem value="0">Inativo</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div style={{ width: 83 }}>
            <ButtonWhite
              onClick={() => {
                filterSelected();
              }}
              border={true}
            >
              Filtrar
            </ButtonWhite>
          </div>
        </FilterSelectedContainer>
      )}
      <Box sx={{ width: "100%" }}>
        <Paper
          sx={{
            width: "100%",
            mb: 2,
            borderBottomLeftRadius: "10px",
            borderBottomRightRadius: "10px",
          }}
        >
        {isLoading ? (
         <Loading />
        ) : (
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
        )}
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
      <ModalConfirmacao
        show={modalShowConfirm}
        onHide={() => setModalShowConfirm(false)}
        text={errorMessage}
        status={false}
      />
    </Container>
  );
}
