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
import { useGetSchoolsReport } from "src/services/escolas.service";
import {
  Container,
  Circle,
  Marker,
  InputSearch,
  IconSearch,
  TopContainer,
  TableCellBorder,
  Pagination,
  FormSelectStyled,
  ButtonPage,
  ButtonStyled,
  TableCellStyled,
  TableRowStyled,
  TableSortLabelStyled,
} from "./styledComponents";
import { Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import {
  MdOutlineFilterAlt,
  MdNavigateNext,
  MdNavigateBefore,
} from "react-icons/md";
import { ButtonPadrao } from "src/components/buttons/buttonPadrao";

import Router from "next/router";
import Link from "next/link";
import useDebounce from "src/utils/use-debounce";
import { Loading } from "src/components/Loading";
import { AutoCompletePagMun } from "src/components/AutoCompletePag/AutoCompletePagMun";
import { ActiveTag, FilterSelectedContainer, PointActiveTag } from "src/shared/styledTables";
import { Autocomplete, TextField } from "@mui/material";

interface Data {
  ESC_ID: number;
  ESC_NOME: string;
  ESC_INEP: string;
  ESC_ENTURMADOS: number;
  ESC_INFREQUENCIA: number;
  ESC_ATIVO: boolean;
}

function createData(
  ESC_ID: number,
  ESC_NOME: string,
  ESC_INEP: string,
  ESC_ENTURMADOS: number,
  ESC_INFREQUENCIA: number,
  ESC_ATIVO: boolean
): Data {
  return {
    ESC_ID,
    ESC_NOME,
    ESC_INEP,
    ESC_ENTURMADOS,
    ESC_INFREQUENCIA,
    ESC_ATIVO,
  };
}

interface HeadCell {
  id: keyof Data;
  label: string;
  status: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "ESC_NOME",
    status: false,
    label: "NOME",
  },
  {
    id: "ESC_INEP",
    status: false,
    label: "NÚM. INEP",
  },
  {
    id: "ESC_ENTURMADOS",
    status: false,
    label: "ENTURMADOS",
  },
  {
    id: "ESC_INFREQUENCIA",
    status: false,
    label: "INFREQUENCIA",
  },
  {
    id: "ESC_ATIVO",
    status: true,
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
            align={headCell.status ? "center" : "left"}
            padding={"normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.id === "ESC_NOME" ? (
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
              headCell.label
            )}
          </TableCellStyled>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default function TableEscolas({ munId = null }) {
  const [order, setOrder] = useState("asc");
  const [orderBy] = useState("ESC_NOME");
  const [selectedCity, setSelectedCity] = useState(null);
  const [filterCity, setFilterCity] = useState(munId || null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState([]);
  const [qntPage, setQntPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState(null);
  const [searchTerm, setSearchTerm] = useState(null);
  const [disablePrev, setDisablePrev] = useState(true);
  const [disableNext, setDisableNext] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    setFilterCity(munId)
  }, [munId])

  const { data, isLoading } = useGetSchoolsReport(
    search,
    page,
    limit,
    selectedColumn,
    order?.toUpperCase(),
    filterStatus,
    filterCity,
  );

  const handleRequestSort = (
    _event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = order === "asc";
    const formattedOrder = isAsc ? "desc" : "asc";
    setOrder(formattedOrder);
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
    setQntPage(data?.meta?.totalPages);

    let list = [];
    data?.items?.map((x) => {
      list.push(
        createData(
          x.ESC_ID,
          x.ESC_NOME,
          x.ESC_INEP,
          x.ENTURMADOS,
          x.INFREQUENCIA,
          x.ESC_ATIVO
        )
      );
    });
    setRows(list);
  }, [data?.items, data?.meta?.totalPages])

  const handleSelectStatus = (newValue) => {
    setSelectedStatus(newValue);
  };

  const handleFilter = () => {
    !munId && setFilterCity(selectedCity?.MUN_ID)
    setFilterStatus(selectedStatus?.value)
    setPage(1);
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

  const changeShowFilter = () => {
    setShowFilter(!showFilter);
  };

  const setRow = (row, index) => {
    const labelId = `enhanced-table-checkbox-${index}`;
    return (
      <Link
        href={`/municipio/${filterCity}/escola/${row.ESC_ID}`}
        key={row.ESC_ID}
        passHref
      >
        <TableRowStyled role="checkbox" tabIndex={-1}>
          <TableCell component="th" id={labelId} scope="row" padding="normal">
            {row.ESC_NOME}
          </TableCell>
          <TableCellBorder component="th" id={labelId} scope="row" padding="normal">
            {row.ESC_INEP}
          </TableCellBorder>
          <TableCellBorder component="th" id={labelId} scope="row" padding="normal">
            {row.ESC_ENTURMADOS ? row.ESC_ENTURMADOS : 0}%
          </TableCellBorder>
          <TableCellBorder component="th" id={labelId} scope="row" padding="normal">
            {row.ESC_INFREQUENCIA ? row.ESC_INFREQUENCIA : 0}%
          </TableCellBorder>
          <TableCellBorder align="center">
            <ActiveTag active={row.ESC_ATIVO}>
              <PointActiveTag active={row.ESC_ATIVO} />
              {row.ESC_ATIVO ? 'Ativo' : 'Inativo'}
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
        {
          filterCity &&
            <div>
              <ButtonPadrao
                onClick={() => {
                  Router.push(`/municipio/${filterCity}/escola`);
                }}
              >
                Adicionar Escola
              </ButtonPadrao>
            </div>
        }
      </TopContainer>
      {showFilter && (
        <FilterSelectedContainer>
          {!munId &&
            <div className="me-2">
              <AutoCompletePagMun county={selectedCity} changeCounty={setSelectedCity} width={"150px"} />
            </div>
          }
          <div>
          <Autocomplete
            style={{background: "#FFF", width: '137px'}}
            fullWidth
            className=""
            id="type"
            size="small"
            value={selectedStatus}
            noOptionsText="Status"
            options={[{name: "Ativo", value: '1'}, {name: "Inativo", value: '0'}]}
            getOptionLabel={option => option.name}
            onChange={(_event, newValue) => {
              handleSelectStatus(newValue)
            }}
            renderInput={(params) => <TextField size="small" {...params} label="Status" />}
          />
          </div>
          <div>
            <ButtonStyled
              onClick={() => {
                handleFilter();
              }}
            >
              Filtrar
            </ButtonStyled>
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
            {filterCity ? 
              <TableBody>
                {rows.map((row, index) => {
                  return setRow(row, index);
                })}
              </TableBody>
            :
              <div style={{ padding: '10px' }}>Necessário selecionar um município no filtro</div>  
            }
           </Table>
         </TableContainer>
         )}
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
  );
}
