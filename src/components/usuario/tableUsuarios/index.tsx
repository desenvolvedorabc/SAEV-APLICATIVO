import * as React from 'react'
import { useState, useEffect, useRef } from 'react'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { visuallyHidden } from '@mui/utils'
import { useGetUsers } from 'src/services/usuarios.service'
import { Container, TopContainer } from './styledComponents'
import { FilterSelectedContainer, Marker, InputSearch, IconSearch, TableCellBorder, Pagination, FormSelectStyled, ButtonPage, ButtonStyled, TableCellStyled, TableRowStyled, TableSortLabelStyled } from 'src/shared/styledTables'
import { Form, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { MdOutlineFilterAlt, MdNavigateNext, MdNavigateBefore } from "react-icons/md"
import { ButtonPadrao } from 'src/components/buttons/buttonPadrao';

import Link from 'next/link'
import { getAllPerfis, useGetAllPerfis } from 'src/services/perfis.service'
import { getSubBase, useGetSubBase } from 'src/services/sub-perfis.service'
import { Autocomplete, TextField } from '@mui/material'
import { AutoCompletePagMun } from 'src/components/AutoCompletePag/AutoCompletePagMun'
import { AutoCompletePagEscMun } from 'src/components/AutoCompletePag/AutoCompletePagEscMun'
import { Loading } from 'src/components/Loading'
import useDebounce from 'src/utils/use-debounce'


interface Data {
  USU_ID: string
  USU_NOME: string
  USU_EMAIL: string
  USU_MUN: string
  USU_ESC: string
  USU_PERFIL: string
  USU_SUBPERFIL: string
}

function createData(
  USU_ID: string,
  USU_NOME: string,
  USU_EMAIL: string,
  USU_MUN: string,
  USU_ESC: string,
  USU_PERFIL: string,
  USU_SUBPERFIL: string
): Data {
  return {
    USU_ID,
    USU_NOME,
    USU_EMAIL,
    USU_MUN,
    USU_ESC,
    USU_PERFIL,
    USU_SUBPERFIL
  }
}

interface HeadCell {
  id: keyof Data
  label: string
  numeric: boolean
}

const headCells: readonly HeadCell[] = [
  {
    id: 'USU_NOME',
    numeric: false,
    label: 'NOME',
  },
  {
    id: 'USU_EMAIL',
    numeric: false,
    label: 'EMAIL',
  },
  {
    id: 'USU_MUN',
    numeric: false,
    label: 'CIDADE',
  },
  {
    id: 'USU_ESC',
    numeric: false,
    label: 'ESCOLA',
  },
  {
    id: 'USU_PERFIL',
    numeric: false,
    label: 'PERFIL',
  },
  {
    id: 'USU_SUBPERFIL',
    numeric: false,
    label: 'PERFIL BASE',
  },
]

interface EnhancedTableProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void
  order: string
  orderBy: string
  rowCount: number
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } =
    props
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property)
    }

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCellStyled
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={'normal'}
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
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabelStyled>
          </TableCellStyled>
        ))}
      </TableRow>
    </TableHead>
  )
}

export default function TableUsuarios() {
  const [order, setOrder] = useState('asc')
  const [orderBy] = useState('USU_NOME')
  const [selectedColumn, setSelectedColumn] = useState(null)
  const [selectedCity, setSelectedCity] = useState(null)
  const [selectedSchool, setSelectedSchool] = useState(null)
  const [selectedPerfil, setSelectedPerfil] = useState(null)
  const [selectedPerfilBase, setSelectedPerfilBase] = useState(null)
  const [filterCity, setFilterCity] = useState(null)
  const [filterSchool, setFilterSchool] = useState(null)
  const [filterPerfil, setFilterPerfil] = useState(null)
  const [filterPerfilBase, setFilterPerfilBase] = useState(null)
  const [page, setPage] = useState(1)
  const [qntPage, setQntPage] = useState(1)
  const [limit, setLimit] = useState(25)
  const [search, setSearch] = useState(null)
  const [disablePrev, setDisablePrev] = useState(true)
  const [disableNext, setDisableNext] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const [resetSchool, setResetSchool] = useState(false)
  const [searchTerm, setSearchTerm] = useState(null)
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data, isLoading } = useGetUsers(search, page, limit, selectedColumn, order.toUpperCase(), filterCity?.MUN_ID, filterSchool?.ESC_ID, filterPerfilBase?.PER_ID, filterPerfil?.SPE_ID);
  
  const { data: perfis, isLoading: isLoadingPerfis } = useGetAllPerfis();
  
  const { data: subPerfis, isLoading: isLoadingSubPerfis } = useGetSubBase(selectedPerfilBase?.PER_ID, !!selectedPerfilBase);
  
  useEffect(() => {
    let list = [];

    setQntPage(data?.meta?.totalPages);

    data?.items?.map((x) => {
      list.push(
        createData(
          x.USU_ID, 
          x.USU_NOME, 
          x.USU_EMAIL, 
          x.USU_MUN?.MUN_NOME, 
          x.USU_ESC?.ESC_NOME, 
          x.USU_SPE?.SPE_PER?.PER_NOME, 
          x.USU_SPE?.SPE_NOME
        )
      );
    });
    setRows(list);
  }, [data?.items, data?.meta?.totalPages]);

  const handleRequestSort = (
    _event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => {
    const isAsc = order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setSelectedColumn(property)
  }

  useEffect(() => {
    setDisablePrev(page === 1 ? true : false);
    setDisableNext(page === qntPage ? true : false);
  }, [qntPage, page])

  const handleChangePage2 = (direction) => {
    if (direction === "prev") {
      setPage((page - 1))
    }
    else {
      setPage((page + 1))
    }
  }
  const handleChangeLimit = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(parseInt(event.target.value))
    setPage(1)
  }
  const [rows, setRows] = useState([])
  const tableBody = useRef();

  useEffect(() => {
    if (debouncedSearchTerm) {
      setSearch(debouncedSearchTerm)
    }
    else
      setSearch("")
      
    setPage(1)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[debouncedSearchTerm]);

  const handleChangeSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleSelectCity = (newValue) => {
    setSelectedCity(newValue)
    setSelectedSchool(null)
    setResetSchool(!resetSchool)
  }
  const handleSelectSchool = (newValue) => {
    setSelectedSchool(newValue)
  }
  const handleSelectPerfilBase = (newValue) => {
    setSelectedPerfilBase(newValue)
    setSelectedPerfil(null)
  }
  const handleSelectPerfil = (newValue) => {
    setSelectedPerfil(newValue)
  }

  const filterSelected = () => {
    setPage(1)
    setFilterCity(selectedCity)
    setFilterSchool(selectedSchool)
    setFilterPerfil(selectedPerfil)
    setFilterPerfilBase(selectedPerfilBase)
  }

  const changeShowFilter = () => {
    setShowFilter(!showFilter)
  }

  const setRow = (row, index) => {
    const labelId = `enhanced-table-checkbox-${index}`

    return (
      <Link href={`/usuario/${row.USU_ID}`}
        key={row.USU_ID} passHref>
        <TableRowStyled
          role="checkbox"
          tabIndex={-1}
        >
          <TableCell
            component="th"
            id={labelId}
            scope="row"
            padding="normal"
          >
            {row.USU_NOME}
          </TableCell>
          <TableCellBorder>
            {row.USU_EMAIL}
          </TableCellBorder>
          <TableCellBorder>
            {row.USU_MUN}
          </TableCellBorder>
          <TableCellBorder>
            {row.USU_ESC}
          </TableCellBorder>
          <TableCellBorder>
            {row.USU_PERFIL}
          </TableCellBorder>
          <TableCellBorder>
            {row.USU_SUBPERFIL}
          </TableCellBorder>
        </TableRowStyled>
      </Link>
    )
  }

  return (
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
            <InputSearch size={16} type="text" placeholder="Pesquise" name="searchTerm"
              onChange={handleChangeSearch}
            />
            <IconSearch color={'#7C7C7C'} />
          </div>
        </div>
        <div>
          <Link href="/usuario" passHref>
            <div style={{ width: 160 }}>
              <ButtonPadrao onClick={() => { /* TODO document why this arrow function is empty */  }}>Adicionar Usuário</ButtonPadrao>
            </div>
          </Link>
        </div>
      </TopContainer>
      {showFilter &&
        <FilterSelectedContainer>
          <div className="me-2">
            <AutoCompletePagMun county={selectedCity} changeCounty={handleSelectCity} width={"150px"} />
          </div>
          <div className="pe-2 me-2 border-end border-white">
            <AutoCompletePagEscMun school={selectedSchool} changeSchool={handleSelectSchool} mun={selectedCity} resetSchools={resetSchool} width={"150px"}  />
          </div>
          <div className="pe-2 me-2 border-end border-white">
            <Autocomplete
              style={{width: 150, background: "#FFF"}}
              className=""
              id="size-small-outlined"
              size="small"
              value={selectedPerfilBase}
              noOptionsText="Perfil Base"
              options={perfis}
              getOptionLabel={(option) =>  `${option?.PER_NOME}`}
              onChange={(_event, newValue) => {
                handleSelectPerfilBase(newValue)}}
              loading={isLoadingPerfis}
              sx={{
                "& .Mui-disabled": {
                  background: "#D3D3D3",
                },
              }}
              renderInput={(params) => <TextField size="small" {...params} label="Perfil Base" />}
            />
          </div>
          <div>
            <Autocomplete
              style={{width: 150, background: "#FFF"}}
              className=""
              id="size-small-outlined"
              size="small"
              value={selectedPerfil}
              noOptionsText="Sub-Perfil"
              options={subPerfis}
              getOptionLabel={(option) =>  `${option?.SPE_NOME}`}
              onChange={(_event, newValue) => {
                handleSelectPerfil(newValue)}}
              disabled={selectedPerfilBase === null}
              loading={isLoadingSubPerfis}
              sx={{
                "& .Mui-disabled": {
                  background: "#D3D3D3",
                },
              }}
              renderInput={(params) => <TextField size="small" {...params} label="Sub-Perfil" />}
            />
          </div>
          <div>
            <ButtonStyled onClick={() => { filterSelected() }}>Filtrar</ButtonStyled>
          </div>
        </FilterSelectedContainer >
      }
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '100%', mb: 2, borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px' }}>
        {isLoading ? (
          <Loading />
          ) : (
            <TableContainer>
              <Table
                sx={{ minWidth: 750 }}
                aria-labelledby="tableTitle"
                size={'medium'}
              >
                <EnhancedTableHead
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
                  rowCount={rows.length}
                />
                <TableBody id="tableBody" ref={tableBody}>
                  {
                    rows.map((row, index) => {
                      return (setRow(row, index))
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
            <ButtonPage onClick={() => handleChangePage2("prev")} disabled={disablePrev}>
              <MdNavigateBefore size={24} />
            </ButtonPage>
            <ButtonPage onClick={() => handleChangePage2("next")} disabled={disableNext}>
              <MdNavigateNext size={24} />
            </ButtonPage>
          </Pagination>
        </Paper>
      </Box>
    </Container>
  )
}
