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
import { Autocomplete, TextField, Tooltip } from "@mui/material";
import { AutoCompletePagEscMun } from "src/components/AutoCompletePag/AutoCompletePagEscMun";
import useDebounce from "src/utils/use-debounce";
import Router from "next/router";
import ModalConfirmacao from "src/components/modalConfirmacao";
import { Loading } from "src/components/Loading";
import { format } from "date-fns";
import { useAuth } from "src/context/AuthContext";
import { useGetStates } from "src/services/estados.service";
import { AutoCompletePagMun2 } from "src/components/AutoCompletePag/AutoCompletePagMun2";

enum enumType {
  ESTADUAL = 'Estadual',
  MUNICIPAL = 'Municipal',
  PUBLICA = 'Publica'
}

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
  const [selectedState, setSelectedState] = useState(null);
  const [filterState, setFilterState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [filterCity, setFilterCity] = useState(idMun !== 'null' ? {MUN_ID: idMun} : null);
  const [typeList, setTypeList] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [filterType, setFilterType] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [filterSchool, setFilterSchool] = useState(idEsc != "null" ? {ESC_ID: idEsc} : null);
  const [selectedEnturmado, setSelectedEnturmado] = useState(null);
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

  const { data: states, isLoading: isLoadingStates } = useGetStates();

  useEffect(() => {
    if(user){
      if(user?.USU_SPE?.role === "ESTADO"){
        setFilterState({id: user?.stateId})
      }
      if(user?.USU_SPE?.role === "MUNICIPIO_MUNICIPAL" || user?.USU_SPE?.role === 'MUNICIPIO_ESTADUAL'){
        setFilterState({id: user?.stateId})
        setFilterCity({MUN_ID: user?.USU_MUN?.MUN_ID})
      }
      if(user?.USU_SPE?.role === "ESCOLA"){
        setFilterState({id: user?.stateId})
        setFilterCity({MUN_ID: user?.USU_MUN?.MUN_ID})
        setFilterSchool({ESC_ID: user?.USU_ESC?.ESC_ID})
      }

      if(user?.USU_SPE?.role === "ESTADO" || user?.USU_SPE?.role === 'MUNICIPIO_ESTADUAL'){
        setTypeList(['ESTADUAL'])
        setFilterType('ESTADUAL')
      } else if(user?.USU_SPE?.role === 'MUNICIPIO_MUNICIPAL'){
        setTypeList(['MUNICIPAL'])
        setFilterType('MUNICIPAL')
      } else if(user?.USU_SPE?.role === 'ESCOLA' ){
        setTypeList([user?.USU_ESC?.ESC_TIPO])
        setFilterType(user?.USU_ESC?.ESC_TIPO)        
      } else {
        setTypeList(['ESTADUAL', 'MUNICIPAL', 'PUBLICA'])
      }
    }
  }, [user])
   
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data, isLoading } = useGetStudents({
    search,
    page,
    limit,
    column: selectedColumn,
    order: order.toUpperCase(),
    stateId: filterState?.id,
    county: filterCity?.MUN_ID,
    typeSchool: filterType === 'PUBLICA' ? null : filterType,
    school: filterSchool?.ESC_ID,
    status: filterEnturmado,
    serie: null,
    active: filterStatus
  });

  const filterSelected = () => {
    setFilterState(selectedState)
    setFilterCity(selectedCity)
    if(user?.USU_SPE?.role === "ESTADO" || user?.USU_SPE?.role === 'MUNICIPIO_ESTADUAL'){
      setFilterType('ESTADUAL')
    } else if(user?.USU_SPE?.role === 'MUNICIPIO_MUNICIPAL'){
      setFilterType('MUNICIPAL')
    } else if(user?.USU_SPE?.role === 'ESCOLA' ){
      setFilterType(user?.USU_ESC?.ESC_TIPO)        
    } else {
      setFilterType(selectedType)
    }
    setFilterType(selectedType)
    setFilterSchool(selectedSchool)
    setFilterEnturmado(selectedEnturmado)
    setFilterStatus(selectedStatus ? selectedStatus === 'Ativo' ? 1 : 0 : null)
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

  const handleSelectState = (newValue) => {
    setSelectedState(newValue);
    handleSelectCity(null)
  };

  const handleSelectCity = (newValue) => {
    setSelectedCity(newValue);
    handleSelectType(null);
  };

  const handleSelectType = (newValue) => {
    setSelectedType(newValue);
    handleSelectSchool(null);
    setResetSchool(!resetSchool)
  };

  const handleSelectSchool = (newValue) => {
    setSelectedSchool(newValue);
  };

  const handleSelectEnturmado = (newValue) => {
    setSelectedEnturmado(newValue);
  };

  const handleSelectStatus = (newValue) => {
    setSelectedStatus(newValue);
  };

  const changeShowFilter = (e) => {
    setShowFilter(!showFilter);
  };

  const downloadCsv = async () => {
    const resp = await getExportStudentsExcel({
      search,
      page: 1,
      limit: 9999999,
      column: selectedColumn,
      order: order.toUpperCase(),
      stateId: filterState?.id,
      county: filterCity?.MUN_ID,
      typeSchool: filterType === 'PUBLICA' ? null : filterType,
      school: filterSchool?.ESC_ID,
      status: filterEnturmado,
      serie: null,
      active: filterStatus
    });
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
          <TableCellBorder>
            {
              row.ALU_DT_NASC && !Number.isNaN(new Date(row.ALU_DT_NASC).getTime()) ? format(new Date(row.ALU_DT_NASC), 'dd/MM/yyyy') : ''
            }
          </TableCellBorder>
          <TableCellBorder>{row.ALU_NOME_MAE}</TableCellBorder>
          <TableCellBorder>{row.MUN_NOME}</TableCellBorder>
          <TableCellBorder>{row.ESC_NOME}</TableCellBorder>
          <TableCellBorder>{row.SER_NOME}</TableCellBorder>
          <TableCellBorder>{row.TUR_NOME}</TableCellBorder>
          <TableCellBorder align="center">
            <ActiveTag data-test='tagStatus' active={row.ALU_ATIVO}>
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
              data-test='search'
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
              data-test='export'
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
                <ButtonPadrao 
                  dataTest='newStudent' 
                  onClick={() => {
                    Router.push(`/municipio/${filterCity?.MUN_ID}/escola/${filterSchool?.ESC_ID}/aluno`)
                  }} 
                  disable={!filterCity}
                >
                  Cadastrar Aluno
                </ButtonPadrao>
              </div>
            </Tooltip>
          </div>
        </div>
      </TopContainer>
      {showFilter && (
        <FilterSelectedContainer>
          {user?.USU_SPE?.role === "SAEV" && (
            <div className="me-2">
              <Autocomplete
                sx={{background: "#FFF", width: '137px'}}
                fullWidth
                className=""
                data-test='state'
                id="state"
                size="small"
                value={selectedState}
                noOptionsText="Estado"
                options={states || []}
                loading={isLoadingStates}
                getOptionLabel={option => option.name}
                onChange={(_event, newValue) => {
                  handleSelectState(newValue)
                }}
                renderInput={(params) => <TextField size="small" {...params} label="Estado" />}
              />
            </div>
          )}
          {(user?.USU_SPE?.role === "SAEV" || user?.USU_SPE?.role === "ESTADO") && (
            <div className="me-2">
              <AutoCompletePagMun2
                county={selectedCity}
                changeCounty={handleSelectCity}
                width={"150px"}
                stateId={user?.USU_SPE?.role === "SAEV" ? selectedState?.id : user?.stateId}
                disabled={user?.USU_SPE?.role === "SAEV" && !selectedState}
              />
            </div>
          )}
          {user?.USU_SPE?.role !== "ESCOLA" && (
            <div className="me-2">
              <Autocomplete
                className=""
                id="type"
                size="small"
                value={selectedType}
                noOptionsText="Rede"
                options={typeList}
                getOptionLabel={(option) => `${enumType[option]}`}
                onChange={(_event, newValue) => {
                  handleSelectType(newValue);
                }}
                disabled={
                  (user?.USU_SPE?.role === "SAEV" && !selectedCity) ||
                  (user?.USU_SPE?.role === "ESTADO" && !selectedCity)
                }
            sx={{
              background: "#FFF",
              width: '137px',
              "& .Mui-disabled": {
                background: "#D3D3D3",
              },
            }}
            renderInput={(params) => (
              <TextField size="small" {...params} label="Rede" />
            )}
          />
          </div>
          )}
          <div className="pe-2 me-2 border-end border-white">
            <AutoCompletePagEscMun 
              school={selectedSchool}
              changeSchool={handleSelectSchool}
              mun={selectedCity}
              resetSchools={resetSchool}
              width={"150px"}
              typeSchool={selectedType}
              disabled={!selectedType}
              enabled={!!selectedType}
            />
          </div> 
          <div className="me-2 pe-2 border-end border-white">
            <Autocomplete
              sx={{background: "#FFF", width: '150px'}}
              fullWidth
              className=""
              data-test='enturmacao'
              id="enturmacao"
              size="small"
              value={selectedEnturmado}
              noOptionsText="Enturmação"
              options={["Enturmado", "Não Enturmado"]}
              onChange={(_event, newValue) => {
                handleSelectEnturmado(newValue)
              }}
              renderInput={(params) => <TextField size="small" {...params} label="Enturmação" />}
            />
          </div>
          <div className="me-3">
            <Autocomplete
              sx={{background: "#FFF", width: '150px'}}
              fullWidth
              className=""
              data-test='status'
              id="status"
              size="small"
              value={selectedStatus}
              noOptionsText="Status"
              options={["Ativo", "Inativo"]}
              onChange={(_event, newValue) => {
                handleSelectStatus(newValue)
              }}
              renderInput={(params) => <TextField size="small" {...params} label="Status" />}
            />
          </div>
          <div style={{ width: 83 }}>
            <ButtonWhite
              data-test='filter'
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
            <FormSelectStyled data-test='limit' value={limit} onChange={handleChangeLimit}>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </FormSelectStyled>
            <ButtonPage
              data-test='previous'
              onClick={() => handleChangePage2("prev")}
              disabled={disablePrev}
            >
              <MdNavigateBefore size={24} />
            </ButtonPage>
            <ButtonPage
              data-test='next'
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
