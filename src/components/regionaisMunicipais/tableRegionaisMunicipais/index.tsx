import * as React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { visuallyHidden } from "@mui/utils";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { MdOutlineFilterAlt, MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { ButtonPadrao } from "src/components/buttons/buttonPadrao";
import Router from "next/router";
import ButtonWhite from "../../buttons/buttonWhite";
import Link from "next/link";
import useDebounce from "src/utils/use-debounce";
import { Loading } from "src/components/Loading";
import { saveAs } from 'file-saver';
import { Autocomplete, TextField } from "@mui/material";
import { ButtonPage, FilterSelectedContainer, FormSelectStyled, IconSearch, InputSearch, Marker, Pagination, TableCellBorder, TableCellStyled, TableRowStyled, TableSortLabelStyled } from "src/shared/styledTables";
import { Container, TopContainer } from "./styledComponents";
import { TypeRegionalEnum, getExportRegionais, useGetRegionais } from "src/services/regionais-estaduais.service";
import { useGetStates } from "src/services/estados.service";
import { AutoCompletePagMun2 } from "src/components/AutoCompletePag/AutoCompletePagMun2";
import { useAuth } from "src/context/AuthContext";

interface Data {
  id: string;
  name: string;
  state: string;
  county: string;
  schools: string;
}

function createData(id: string, name: string, state: string, county: string, schools: string): Data {
  return {
    id,
    name,
    state,
    county,
    schools,
  };
}

interface HeadCell {
  id: keyof Data;
  label: string;
  status: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "name",
    status: false,
    label: "REGIONAL",
  },
  {
    id: "state",
    status: false,
    label: "ESTADO",
  },
  {
    id: "county",
    status: false,
    label: "MUNICÍPIO",
  },
  {
    id: "schools",
    status: true,
    label: "ESCOLAS",
  },
];

interface EnhancedTableProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
  order: string;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  const showSort = (headCellId) => {
    if(headCellId === 'name'){
      return true;
    }
    return false;
  }


  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCellStyled key={headCell.id} align={headCell.status ? "center" : "left"} padding={"normal"} sortDirection={orderBy === headCell.id ? order : false}>
            {showSort(headCell.id) ? (
              <TableSortLabelStyled active={orderBy === headCell.id} direction={order === "asc" ? "desc" : "asc"} onClick={createSortHandler(headCell.id)}>
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc" ? "sorted descending" : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabelStyled>
            ) : (
              <>{headCell.label}</>
            )}
          </TableCellStyled>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default function TableRegionaisMunicipais() {
  const [order, setOrder] = useState("asc");
  const [isDisabled, setIsDisabled] = useState(false);
  const [selectedState, setSelectedState] = useState(null);
  const [filterState, setFilterState] = useState(null);
  const [selectedCounty, setSelectedCounty] = useState(null);
  const [filterCounty, setFilterCounty] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState("name");
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [qntPage, setQntPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState(null);
  const [searchTerm, setSearchTerm] = useState(null);
  const [disablePrev, setDisablePrev] = useState(true);
  const [disableNext, setDisableNext] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const { user } = useAuth()

  const { data, isLoading } = useGetRegionais(debouncedSearchTerm, page, limit, null, order?.toUpperCase(), filterCounty, filterState, 'MUNICIPAL');

  const { data: states, isLoading: isLoadingStates } = useGetStates();

  useEffect(() => {
    if(user?.USU_SPE?.role === 'MUNICIPIO_MUNICIPAL'){
      setSelectedState(user?.state)
      setFilterState(user?.state?.id)
      setSelectedCounty(user?.USU_MUN)
      setFilterCounty(user?.USU_MUN?.MUN_ID)
    }
  }, [user])

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Data) => {
    const isAsc = order === "asc";
    const loadOrder = isAsc ? "desc" : "asc";
    setOrder(loadOrder);
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

  useEffect(() => {
    let list = [];

    setQntPage(data?.meta?.totalPages);

    data?.items?.map((x) => {
      list.push(
        createData(
          x?.id,
          x?.name,
          x?.state?.name,
          x?.county?.MUN_NOME,
          x?.schools?.length,
        )
      );
    });
    setRows(list);
  }, [data?.items, data?.meta?.totalPages]);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * limit - rows.length) : 0;

  const handleSelectState = (newValue) => {
    setSelectedState(newValue);
    setSelectedCounty(null);
  };

  const handleSelectCounty = (newValue) => {
    setSelectedCounty(newValue);
  };

  const FilterState = () => {
    setFilterState(selectedState?.id);
    setFilterCounty(selectedCounty?.MUN_ID);
    setPage(1)
  };

  useEffect(() => {
    if (debouncedSearchTerm) {
      setPage(1)
      setSearch(debouncedSearchTerm)
    }
    else
      setSearch("")
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[debouncedSearchTerm]);

  const handleChangeSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const changeShowFilter = (e) => {
    setShowFilter(!showFilter);
  };
  
  const downloadCsv = async () => {
    setIsDisabled(true)

    const resp = await getExportRegionais(
      search, 
      page, 
      limit, 
      selectedColumn, 
      order?.toUpperCase(), 
      filterCounty,
      filterState,
      'MUNICIPAL', 
    );
    if(!resp.data.message) {
      saveAs(resp?.data, 'Regionais_Municipais.csv');
    } else {
    }
    setIsDisabled(false)
  };

  return (
    <Container>
      <TopContainer>
        <div className="d-flex mb-2">
          <OverlayTrigger key={"toolTip"} placement={"top"} overlay={<Tooltip id={`tooltip-top`}>Filtro Avançado</Tooltip>}>
            <Marker onClick={changeShowFilter}>
              <MdOutlineFilterAlt color="#FFF" size={24} />
            </Marker>
          </OverlayTrigger>
          <div className="ms-2 d-flex flex-row-reverse align-items-center ">
            <InputSearch data-test='search' size={16} type="text" placeholder="Pesquise" name="searchTerm" onChange={handleChangeSearch} />
            <IconSearch color={"#7C7C7C"} />
          </div>
        </div>
        <div style={{ display: 'flex'}}>
          <div style={{ width: 160, marginRight: '14px' }}>
            <ButtonWhite
              border
              dataTest='export'
              disable={isDisabled}
              onClick={() => {
                downloadCsv()
              }}
            >
              Exportar
            </ButtonWhite>
          </div>
          <div style={{ width: 160 }}>
            <ButtonPadrao
              dataTest='newRegional'
              onClick={() => {
                Router.push("/regional-municipal");
              }}
              >
              Adicionar Regional
            </ButtonPadrao>
          </div>
        </div>
      </TopContainer>
      {showFilter && (
        <FilterSelectedContainer>
          <div className="me-2">
            <Autocomplete
              style={{width: 150, background: "#FFF"}}
              className=""
              data-test="state"
              id="state"
              size="small"
              value={selectedState}
              noOptionsText="Estado"
              options={states}
              getOptionLabel={(option) =>  `${option?.name}`}
              loading={isLoadingStates}
              onChange={(_event, newValue) => {
                handleSelectState(newValue)}}
              sx={{
                "& .Mui-disabled": {
                  background: "#D3D3D3",
                },
              }}
              renderInput={(params) => <TextField size="small" {...params} label="Estado" />}
              disabled={user?.USU_SPE?.role === 'MUNICIPIO_MUNICIPAL'}
            />
          </div>
          <div className="me-2">
            <AutoCompletePagMun2 county={selectedCounty} changeCounty={handleSelectCounty} disabled={!selectedState || user?.USU_SPE?.role === 'MUNICIPIO_MUNICIPAL'} stateId={selectedState?.id} width={"150px"} />
          </div>
          <div>
            <ButtonWhite
              onClick={() => {
                FilterState();
              }}
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
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={"medium"}>
              <EnhancedTableHead order={order} orderBy={selectedColumn} onRequestSort={handleRequestSort} rowCount={rows.length} />

              <TableBody>
                {rows.length > 0 ? (
                  rows.map((row, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <Link href={`/regional-municipal/editar/${row.id}`} key={row.id} passHref>
                        <TableRowStyled role="checkbox" tabIndex={-1}>
                          <TableCell component="th" id={labelId} scope="row" padding="normal">
                            {row.name}
                          </TableCell>
                          <TableCellBorder>
                            {row.state}
                          </TableCellBorder> 
                          <TableCellBorder>
                            {row.county}
                          </TableCellBorder> 
                          <TableCellBorder align='center'>
                            ({row?.schools}) Vinculadas
                          </TableCellBorder> 
                        </TableRowStyled>
                      </Link>
                    );
                  })
                ) : (
                  <div style={{ padding: 10 }}>
                    Nenhum resultado encontrado.
                  </div>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
          <Pagination>
            Linhas por página:
            <FormSelectStyled data-test='limit' value={limit} onChange={handleChangeLimit}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
            </FormSelectStyled>
            <ButtonPage data-test='previous' onClick={() => handleChangePage2("prev")} disabled={disablePrev}>
              <MdNavigateBefore size={24} />
            </ButtonPage>
            <ButtonPage data-test='next' onClick={() => handleChangePage2("next")} disabled={disableNext}>
              <MdNavigateNext size={24} />
            </ButtonPage>
          </Pagination>
        </Paper>
      </Box>
    </Container>
  );
}
