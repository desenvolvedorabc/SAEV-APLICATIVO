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
import { getStudentsByProfile, useGetStudentsByProfile } from "src/services/alunos.service";
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
} from "src/shared/styledTables";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import {
  MdOutlineFilterAlt,
  MdNavigateNext,
  MdNavigateBefore,
} from "react-icons/md";
import { ButtonPadrao } from "src/components/buttons/buttonPadrao";
import { CSVLink } from "react-csv";

import Link from "next/link";
import ButtonWhite from "src/components/buttons/buttonWhite";
import { loadUf } from "src/utils/combos";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { AutoCompletePagMun } from "src/components/AutoCompletePag/AutoCompletePagMun";
import { AutoCompletePagEscMun } from "src/components/AutoCompletePag/AutoCompletePagEscMun";
import useDebounce from "src/utils/use-debounce";
import { useRouter } from "next/router";

interface Data {
  ALU_ID: string;
  ALU_NOME: string;
  ALU_INEP: number;
  MUN_NOME: string;
  ESC_NOME: string;
  SER_NOME: string;
  TUR_NOME: string;
  ALU_STATUS: string;
  ALU_ATIVO: string;
}

function createData(
  ALU_ID: string,
  ALU_NOME: string,
  ALU_INEP: number,
  MUN_NOME: string,
  ESC_NOME: string,
  SER_NOME: string,
  TUR_NOME: string,
  ALU_STATUS: string,
  ALU_ATIVO: string
): Data {
  return {
    ALU_ID,
    ALU_NOME,
    ALU_INEP,
    MUN_NOME,
    ESC_NOME,
    SER_NOME,
    TUR_NOME,
    ALU_STATUS,
    ALU_ATIVO
  };
}

interface DataExport {
  ALU_ID: string;
  ALU_NOME: string;
  ALU_INEP: number;
  MUN_NOME: string;
  ESC_NOME: string;
  SER_NOME: string;
  TUR_NOME: string;
  ALU_STATUS: string;
  ALU_ATIVO: string;

}

function createDataExport(
  ALU_ID: string,
  ALU_NOME: string,
  ALU_INEP: number,
  MUN_NOME: string,
  ESC_NOME: string,
  SER_NOME: string,
  TUR_NOME: string,
  ALU_STATUS: string,
  ALU_ATIVO: string
): DataExport {
  return {
    ALU_ID,
    ALU_NOME,
    ALU_INEP,
    MUN_NOME,
    ESC_NOME,
    SER_NOME,
    TUR_NOME,
    ALU_STATUS,
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
  {
    id: "ALU_ATIVO",
    numeric: false,
    label: "ATIVO",
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
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("ALU_ID");
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [filterCity, setFilterCity] = useState(idMun);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [filterSchool, setFilterSchool] = useState(idEsc != "null" ? idEsc : null);
  const [selectedEnturmado, setSelectedEnturmado] = useState("");
  const [filterEnturmado, setFilterEnturmado] = useState(null)
  const [page, setPage] = useState(1);
  const [qntPage, setQntPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [search, setSearch] = useState(null);
  const [searchTerm, setSearchTerm] = useState(null);
  const [disablePrev, setDisablePrev] = useState(true);
  const [disableNext, setDisableNext] = useState(false);
  const [listUf, setListUf] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [csv, setCsv] = useState([]);
  const csvLink = useRef(undefined);
  const [resetSchool, setResetSchool] = useState(false)
  const {query} = useRouter();
  
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data, isLoading } = useGetStudentsByProfile(
    search,
    page,
    limit,
    selectedColumn,
    order.toUpperCase(),
    filterCity?.MUN_ID,
    filterSchool?.ESC_ID,
    filterEnturmado,
    null
  );

  const filterSelected = () => {
    setFilterCity(selectedCity)
    setFilterSchool(selectedSchool)
    setFilterEnturmado(selectedEnturmado)
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
          x.ALU_INEP,
          x.MUN_NOME,
          x.ESC_NOME,
          x.SER_NOME,
          x.TUR_NOME,
          x.ALU_STATUS,
          x.ALU_ATIVO ? "Ativo" : "Inativo",
        )
      );
    });
    setRows(list);
  }, [data?.items, data?.meta?.totalPages]);

  useEffect(() => {
    async function fetchAPI() {
      setListUf(await loadUf());
    }
    fetchAPI();
  }, []);

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

  const changeShowFilter = (e) => {
    setShowFilter(!showFilter);
  };

  const CreateExport = async () => {
    const respAlunosExport = await getStudentsByProfile(
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

    let list = [];
    respAlunosExport.data.items?.map((x) => {
      list.push(
        createDataExport(
          x.ALU_ID,
          x.ALU_NOME,
          x.ALU_INEP,
          x.MUN_NOME,
          x.ESC_NOME,
          x.SER_NOME,
          x.TUR_NOME,
          x.ALU_STATUS,
          x.ALU_ATIVO ? "Ativo" : "Inativo",
        )
      );
    });

    const tempCsv = [];
    tempCsv.push([
      "CÓD",
      "ALUNO",
      "NÚM_INEP",
      "MUNICÍPIO",
      "ESCOLA",
      "SÉRIE",
      "TURMA",
      "STATUS",
      "ATIVO"
    ]);
    const listCSV = JSON.parse(JSON.stringify(list));
    listCSV.map((item) => {
      tempCsv.push(Object.values(item));
    });
    setCsv(tempCsv);

    
    csvLink.current.link.click();
  }

  const downloadCsv = (e) => {
    CreateExport()
  };


  const setRow = (row, index) => {
    const labelId = `enhanced-table-checkbox-${index}`;

    return (
      <Link href={`/municipio/${query.id}/escola/${query.escId}/aluno/${row.ALU_ID}`} key={row.ALU_ID}>
        <TableRowStyled role="checkbox" tabIndex={-1}>
          <TableCell component="th" id={labelId} scope="row" padding="normal">
            {row.ALU_ID}
          </TableCell>
          <TableCellBorderWidth>{row.ALU_NOME}</TableCellBorderWidth>
          <TableCellBorder>{row.ALU_INEP}</TableCellBorder>
          <TableCellBorder>{row.MUN_NOME}</TableCellBorder>
          <TableCellBorder>{row.ESC_NOME}</TableCellBorder>
          <TableCellBorder>{row.SER_NOME}</TableCellBorder>
          <TableCellBorder>{row.TUR_NOME}</TableCellBorder>
          <TableCellBorder>{row.ALU_STATUS}</TableCellBorder>
          <TableCellBorder>{row.ALU_ATIVO}</TableCellBorder>
        </TableRowStyled>
      </Link>
    );
  };

  return (
    <Container>
      <TopContainer>
        <div className="d-flex mb-2">
          <OverlayTrigger
            key={"toolTip"}
            placement={"top"}
            overlay={<Tooltip id={`tooltip-top`}>Filtro Avançado</Tooltip>}
          >
            <Marker onClick={changeShowFilter}>
              <MdOutlineFilterAlt color="#FFF" size={24} />
            </Marker>
          </OverlayTrigger>
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
                downloadCsv(e);
              }}
            >
              Exportar
            </ButtonWhite>
            <CSVLink
              data={csv}
              filename="alunos.csv"
              className="hidden"
              ref={csvLink}
              target="_blank"
            />
          </div>
          <Link href={`/municipio/${query.id}/escola/${query.escId}/aluno`}>
            <div style={{ width: 148 }}>
              <ButtonPadrao onClick={() => {}}>Cadastrar Aluno</ButtonPadrao>
            </div>
          </Link>
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
          <div className="me-3 border-end border-white">
            <FormControl sx={{ width: 150 }} size="small">
              <InputLabel id="status">Status</InputLabel>
              <Select
                labelId="status"
                id="status"
                value={selectedEnturmado}
                label="Status"
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
