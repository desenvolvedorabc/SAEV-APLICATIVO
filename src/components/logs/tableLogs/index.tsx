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
  TableCellStyled,
  FilterStatusContainer,
  Marker,
  InputSearch,
  IconSearch,
  TopContainer,
  TableCellBorder,
  Pagination,
  FormSelectStyled,
  ButtonPage,
  TableRowStyled,
  TableSortLabelStyled,
  Text,
} from "./styledComponents";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import {
  MdOutlineFilterAlt,
  MdNavigateNext,
  MdNavigateBefore,
} from "react-icons/md";
import ButtonWhite from "../../buttons/buttonWhite";
import Link from "next/link";
import { DatePicker, LocalizationProvider } from "@mui/lab";
import {
  Autocomplete,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import brLocale from "date-fns/locale/pt-BR";
import { isValidDate } from "src/utils/validate";
import { getLogs } from "src/services/logs.service";
import { format } from "date-fns";
import { CSVLink } from "react-csv";
import { entities_mock } from "src/utils/mocks/entities";
import { AutoCompletePagMun } from "src/components/AutoCompletePag/AutoCompletePagMun";
import useDebounce from "src/utils/use-debounce";
import { AutoCompletePagEscMun } from "src/components/AutoCompletePag/AutoCompletePagEscMun";

interface Data {
  id: string;
  createdAt: string;
  usuario: string;
  municipio: string;
  nameEntity: string;
  method: string;
  stateInitial: string;
  stateFinal: string;
}

function createData(
  id: string,
  createdAt: string,
  usuario: string,
  municipio: string,
  nameEntity: string,
  method: string,
  stateInitial: string,
  stateFinal: string
): Data {
  return {
    id,
    createdAt,
    usuario,
    municipio,
    nameEntity,
    method,
    stateInitial,
    stateFinal,
  };
}

interface DataExport {
  createdAt: string;
  usuario: string;
  municipio: string;
  nameEntity: string;
  method: string;
  stateInitial: string;
  stateFinal: string;
}

function createDataExport(
  createdAt: string,
  usuario: string,
  municipio: string,
  nameEntity: string,
  method: string,
  stateInitial: string,
  stateFinal: string
): DataExport {
  return {
    createdAt,
    usuario,
    municipio,
    nameEntity,
    method,
    stateInitial,
    stateFinal,
  };
}

interface HeadCell {
  id: keyof Data;
  label: string;
  status: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "createdAt",
    status: false,
    label: "DATA/HORA",
  },
  {
    id: "usuario",
    status: false,
    label: "USUÁRIO",
  },
  {
    id: "municipio",
    status: false,
    label: "MUNICÍPIO",
  },
  {
    id: "nameEntity",
    status: false,
    label: "ENTIDADE",
  },
  {
    id: "method",
    status: false,
    label: "MÉTODO",
  },
  {
    id: "stateInitial",
    status: true,
    label: "ESTADO ANTES",
  },
  {
    id: "stateFinal",
    status: true,
    label: "ESTADO DEPOIS",
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
            align={headCell.status ? "center" : "left"}
            padding={"normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.id != "usuario" && headCell.id != "municipio" && headCell.id !== "stateInitial" && headCell.id !== "stateFinal" ? (
              <TableSortLabelStyled
                active={orderBy === headCell.id}
                direction={order === "asc" ? "desc" : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabelStyled>
            ) : (
              <strong>{headCell.label}</strong>
            )}
          </TableCellStyled>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default function TableLogs() {
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("data");
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [page, setPage] = useState(1);
  const [qntPage, setQntPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [search, setSearch] = useState(null);
  const [searchTerm, setSearchTerm] = useState(null);
  const [disablePrev, setDisablePrev] = useState(true);
  const [disableNext, setDisableNext] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [inicioSelected, setInicioSelected] = useState(null);
  const [inicioFilter, setInicioFilter] = useState(null);
  const [fimSelected, setFimSelected] = useState(null);
  const [fimFilter, setFimFilter] = useState(null);
  const [metodoSelected, setMetodoSelected] = useState(null);
  const [metodoFilter, setMetodoFilter] = useState(null);
  const [entidadeSelected, setEntidadeSelected] = useState(null);
  const [entidadeFilter, setEntidadeFilter] = useState(null);
  const [munSelected, setMunSelected] = useState(null);
  const [munFilter, setMunFilter] = useState(null);
  const [escSelected, setEscSelected] = useState(null);
  const [escFilter, setEscFilter] = useState(null);
  const [listEntity, setListEntity] = useState(entities_mock);
  const [csv, setCsv] = useState([]);
  const csvLink = useRef(undefined);
  const [exportCsv, setExportCsv] = useState(false)
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [resetSchool, setResetSchool] = useState(false)

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = order === "asc";
    const loadOrder = isAsc ? "desc" : "asc";
    setOrder(loadOrder);
    setSelectedColumn(property);
    loadLogs(
      search,
      page,
      limit,
      property,
      loadOrder,
      inicioFilter,
      fimFilter,
      metodoFilter,
      entidadeFilter,
      munFilter,
      escSelected
    );
  };

  useEffect(() => {
    setDisablePrev(page === 1 ? true : false);
    setDisableNext(page === qntPage ? true : false);
  }, [qntPage, page]);

  const handleChangePage2 = (direction) => {
    if (direction === "prev") {
      setPage(page - 1);
      loadLogs(
        search,
        page - 1,
        limit,
        selectedColumn,
        order,
        inicioFilter,
        fimFilter,
        metodoFilter,
        entidadeFilter?.value,
        munFilter,
        escSelected
      );
    } else {
      setPage(page + 1);
      loadLogs(
        search,
        page + 1,
        limit,
        selectedColumn,
        order,
        inicioFilter,
        fimFilter,
        metodoFilter,
        entidadeFilter?.value,
        munFilter,
        escSelected
      );
    }
  };

  const handleChangeLimit = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(parseInt(event.target.value));
    setPage(1);
    loadLogs(
      search,
      1,
      Number(event.target.value),
      selectedColumn,
      order,
      inicioFilter,
      fimFilter,
      metodoFilter,
      entidadeFilter?.value,
      munFilter,
      escSelected
    );
  };

  const getLogName = (value) => {
    let name = value;
    listEntity.map((entity) => {
      if (entity.value === value) name = entity.name;
    });

    return name;
  };

  const [rows, setRows] = useState([]);

  useEffect(() => {
    loadLogs(
      search,
      1,
      limit,
      selectedColumn,
      order,
      inicioFilter,
      fimFilter,
      metodoFilter,
      entidadeFilter?.value,
      munFilter,
      escSelected
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  async function loadLogs(
    search: string,
    page: number,
    limit: number,
    selectedColumn: string,
    order: string,
    inicioFilter: string,
    fimFilter: string,
    metodoFilter: string,
    entidadeFilter: string,
    munFilter: any,
    escFilter: any,
  ) {
    const respLogs = await getLogs(
      search,
      page,
      limit,
      selectedColumn,
      order.toUpperCase(),
      inicioFilter,
      fimFilter,
      metodoFilter,
      entidadeFilter,
      munFilter?.MUN_ID,
      escFilter?.ESC_ID,
    );
    setQntPage(respLogs?.data?.meta?.totalPages);

    let list = [];

    respLogs?.data?.items?.map((x) => {
      list.push(
        createData(
          x.id,
          x.createdAt && format(new Date(x.createdAt), "dd/MM/yyyy - HH:mm:ss"),
          x.user?.USU_NOME,
          x.user?.USU_MUN?.MUN_NOME
            ? x.user?.USU_MUN?.MUN_NOME
            : x.user?.USU_SPE?.SPE_PER?.PER_NOME,
          getLogName(x.nameEntity),
          x.method,
          x.stateInitial,
          x.stateFinal
        )
      );
    });
    setRows(list);
  }

  useEffect(() => {
    loadLogs(
      search,
      page,
      limit,
      selectedColumn,
      order,
      inicioFilter,
      fimFilter,
      metodoFilter,
      entidadeFilter,
      munFilter,
      escSelected
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const createExport = async () => {
    const respLogsExport = await getLogs(
      search,
      1,
      999999,
      selectedColumn,
      order.toUpperCase(),
      inicioFilter,
      fimFilter,
      metodoFilter,
      entidadeFilter,
      munFilter?.MUN_ID,
      escFilter?.ESC_ID
    );

    let list = [];
    respLogsExport.data.items?.map((x) => {
      list.push(
        createDataExport(
          x.createdAt
            ? format(new Date(x.createdAt), "dd/MM/yyyy - HH:mm:ss")
            : " ",
          x.user?.USU_NOME ? x.user?.USU_NOME : " ",
          x.user?.USU_MUN?.MUN_NOME
            ? x.user?.USU_MUN?.MUN_NOME
            : x.user?.USU_SPE?.SPE_PER?.PER_NOME,
          x.nameEntity ? x.nameEntity : " ",
          x.method ? x.method : " ",
          x.stateInitial ? x.stateInitial?.replaceAll(',' , ' - ') : " ",
          x.stateFinal ? x.stateFinal?.replaceAll(',' , ' - '): " "
        )
      );
    });

    const tempCsv = [];
    tempCsv.push([
      "DATA/HORA",
      "USUÁRIO",
      "MUNICÍPIO",
      "ENTIDADE",
      "MÉTODO",
      "ESTADO ANTES",
      "ESTADO DEPOIS",
    ]);
    const listCSV = JSON.parse(JSON.stringify(list));
    listCSV.map((item) => {
      tempCsv.push(Object.values(item));
    });
    setCsv(tempCsv);
    setExportCsv(true)
  }

  useEffect(() => {
    if(exportCsv){
      csvLink.current.link.click()
      setExportCsv(false)
    }
  }, [csv, exportCsv])

  const downloadCsv = (e) => {
    createExport()
  }


  const FilterStatus = () => {
    setInicioFilter(inicioSelected)
    setFimFilter(fimSelected)
    setMetodoFilter(metodoSelected)
    setEntidadeFilter(entidadeSelected)
    setMunFilter(munSelected)
    setEscFilter(escSelected)

    loadLogs(
      search,
      1,
      limit,
      selectedColumn,
      order,
      inicioSelected,
      fimSelected,
      metodoSelected,
      entidadeSelected?.value,
      munSelected,
      escSelected
    );
  };

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

  const handleChangeCounty = (newValue) => {
    setMunSelected(newValue)
    setEscSelected(null)
    setResetSchool(!resetSchool)
  }

  const changeShowFilter = (e) => {
    setShowFilter(!showFilter);
  };

  const ResetFilter = () => {
    setInicioFilter(null)
    setFimFilter(null)
    setMetodoFilter(null)
    setEntidadeFilter(null);
    setMunFilter(null);
    setEscFilter(null);

    setInicioSelected(null)
    setFimSelected(null)
    setMetodoSelected(null)
    setEntidadeSelected(null);
    setMunSelected(null);
    setEscSelected(null);

    loadLogs(
      search,
      1,
      limit,
      selectedColumn,
      order,
      null,
      null,
      null,
      null,
      null,
      null
    );
  }

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
        <div style={{ width: 160 }}>
          <ButtonWhite
            onClick={(e) => {
              downloadCsv(e);
            }}
          >
            Exportar
          </ButtonWhite>
          <CSVLink
            data={csv}
            filename="logs.csv"
            className="hidden"
            ref={csvLink}
            target="_blank"
          />
        </div>
      </TopContainer>
      {showFilter && (
        <FilterStatusContainer>
          <div style={{ width: 164 }} className="pe-3">
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              locale={brLocale}
            >
              <DatePicker
                openTo="year"
                views={["year", "month", "day"]}
                label="Data Inicio"
                value={inicioSelected}
                onChange={(val) => {
                  if (isValidDate(val)) {
                    setInicioSelected(val);
                    return;
                  }
                  setInicioSelected("");
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
          <div
            style={{ width: 164 }}
            className="pe-3 me-3 border-end border-white"
          >
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              locale={brLocale}
            >
              <DatePicker
                openTo="year"
                views={["year", "month", "day"]}
                label="Data Fim"
                value={fimSelected}
                onChange={(val) => {
                  if (isValidDate(val)) {
                    setFimSelected(val);
                    return;
                  }
                  setFimSelected("");
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
          <div
            style={{ width: 142 }}
            className="pe-3 me-3 border-end border-white"
          >
            <FormControl fullWidth size="small">
              <InputLabel id="metodoFilter">Método:</InputLabel>
              <Select
                labelId="metodoFilter"
                id="metodoFilter"
                name="metodoFilter"
                value={metodoSelected}
                label="Método:"
                onChange={(e) => setMetodoSelected(e.target.value)}
                sx={{
                  backgroundColor: "#fff",
                }}
              >
                <MenuItem value={null}>
                  Todos
                </MenuItem>
                <MenuItem value="POST">
                  POST
                </MenuItem>
                <MenuItem value="PUT">
                  PUT
                </MenuItem>
                <MenuItem value="DELETE">
                  DELETE
                </MenuItem>
              </Select>
            </FormControl>
          </div>
          <div
            style={{ width: 142 }}
            className="pe-3 me-3 border-end border-white"
          >
            <Autocomplete
              style={{background: "#FFF"}}
              className=""
              id="size-small-outlined"
              size="small"
              value={entidadeSelected}
              noOptionsText="Entidade:"
              options={listEntity}
              getOptionLabel={(option) =>  `${option?.name}`}
              onChange={(_event, newValue) => {
                setEntidadeSelected(newValue)}}
              sx={{
                "& .Mui-disabled": {
                  background: "#D3D3D3",
                },
              }}
              renderInput={(params) => <TextField size="small" {...params} label="Entidade:" />}
            />
          </div>
          <div className="me-2">
            <AutoCompletePagMun county={munSelected} changeCounty={handleChangeCounty} width={"150px"} />
          </div>
          <div className="pe-2 me-2 border-end border-white">
            <AutoCompletePagEscMun school={escSelected} changeSchool={setEscSelected} mun={munSelected} resetSchools={resetSchool} width={"150px"} />
          </div> 
          <div style={{ width: 83 }}>
            <ButtonWhite
              onClick={() => {
                FilterStatus();
              }}
            >
              Filtrar
            </ButtonWhite>
          </div>
          <div style={{ marginLeft: 15, width: 83}}>
            <ButtonWhite
              onClick={() => {
                ResetFilter();
              }}
            >
              Resetar
            </ButtonWhite>
          </div>
        </FilterStatusContainer>
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

              <TableBody>
                {rows.length > 0 ? (
                  rows.map((row, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <Link href={`/log/${row.id}`} key={row.id} passHref>
                        <TableRowStyled role="checkbox" tabIndex={-1}>
                          <TableCell
                            component="th"
                            id={labelId}
                            scope="row"
                            padding="normal"
                          >
                            {row.createdAt}
                          </TableCell>
                          <TableCellBorder>{row.usuario}</TableCellBorder>
                          <TableCellBorder>{row.municipio}</TableCellBorder>
                          <TableCellBorder>{row.nameEntity}</TableCellBorder>
                          <TableCellBorder>{row.method}</TableCellBorder>
                          <TableCellBorder align="center">
                            <Text>{row.stateInitial}</Text>
                          </TableCellBorder>
                          <TableCellBorder align="center">
                            <Text>{row.stateFinal}</Text>
                          </TableCellBorder>
                        </TableRowStyled>
                      </Link>
                    );
                  })
                ) : (
                  <></>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Pagination>
            <span style={{marginRight: "20px"}}> Total páginas: <b>{qntPage}</b></span>
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
