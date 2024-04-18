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
import { Container, TopContainer } from './styledComponents'
import { FilterSelectedContainer, Marker, InputSearch, IconSearch, TableCellBorder, Pagination, FormSelectStyled, ButtonPage, ButtonStyled, TableCellStyled, TableRowStyled, TableSortLabelStyled } from 'src/shared/styledTables'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { MdOutlineFilterAlt, MdNavigateNext, MdNavigateBefore } from "react-icons/md"
import { ButtonPadrao } from 'src/components/buttons/buttonPadrao';

import Link from 'next/link'
import { getAllYears } from 'src/services/anos.service'
import { getAllCounties } from 'src/services/municipios.service'
import { getCountySchools } from 'src/services/escolas.service'
import { getSchoolClasses } from 'src/services/turmas.service'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { AutoCompletePagMun } from 'src/components/AutoCompletePag/AutoCompletePagMun'
import { AutoCompletePagEscMun } from 'src/components/AutoCompletePag/AutoCompletePagEscMun'
import useDebounce from 'src/utils/use-debounce'


interface Data {
  TURMA_TUR_ID: string
  TURMA_TUR_NOME: string
  TURMA_TUR_TIPO: string
  TUR_MUN_MUN_NOME: string
  TUR_ESC_ESC_NOME: string
  TURMA_TUR_ANO: string
  TUR_SER_SER_NOME: string
  TURMA_TUR_PERIODO: string
  TURMA_TUR_ATIVO: string
}

function createData(
  TURMA_TUR_ID: string,
  TURMA_TUR_NOME: string,
  TURMA_TUR_TIPO: string,
  TUR_MUN_MUN_NOME: string,
  TUR_ESC_ESC_NOME: string,
  TURMA_TUR_ANO: string,
  TUR_SER_SER_NOME: string,
  TURMA_TUR_PERIODO: string,
  TURMA_TUR_ATIVO: string
  ): Data {
  return {
    TURMA_TUR_ID,
    TURMA_TUR_NOME,
    TURMA_TUR_TIPO,
    TUR_MUN_MUN_NOME,
    TUR_ESC_ESC_NOME,
    TURMA_TUR_ANO,
    TUR_SER_SER_NOME,
    TURMA_TUR_PERIODO,
    TURMA_TUR_ATIVO
  }
}

interface HeadCell {
  id: keyof Data
  label: string
  numeric: boolean
}

const headCells: readonly HeadCell[] = [
  {
    id: 'TURMA_TUR_NOME',
    numeric: false,
    label: 'NOME',
  },
  {
    id: 'TURMA_TUR_ID',
    numeric: false,
    label: 'CÓD',
  },
  {
    id: 'TURMA_TUR_TIPO',
    numeric: false,
    label: 'TIPO',
  },
  {
    id: 'TUR_MUN_MUN_NOME',
    numeric: false,
    label: 'MUNICÍPIO',
  },
  {
    id: 'TUR_ESC_ESC_NOME',
    numeric: false,
    label: 'ESCOLA',
  },
  {
    id: 'TURMA_TUR_ANO',
    numeric: false,
    label: 'ANO',
  },
  {
    id: 'TUR_SER_SER_NOME',
    numeric: false,
    label: 'SÉRIE',
  },
  {
    id: 'TURMA_TUR_PERIODO',
    numeric: false,
    label: 'PERÍODO',
  },
  {
    id: 'TURMA_TUR_ATIVO',
    numeric: false,
    label: 'STATUS',
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

export default function TableTurmas() {
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('TURMA_TUR_NOME')
  const [selectedColumn, setSelectedColumn] = useState(null)
  const [selectedYear, setSelectedYear] = useState(null)
  const [selectedCity, setSelectedCity] = useState(null)
  const [selectedSchool, setSelectedSchool] = useState(null)
  const [selectedType, setSelectedType] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState(null)
  const [filterYear, setFilterYear] = useState(null)
  const [filterCity, setFilterCity] = useState(null)
  const [filterSchool, setFilterSchool] = useState(null)
  const [filterType, setFilterType] = useState(null)
  const [filterStatus, setFilterStatus] = useState(null)
  const [page, setPage] = useState(1)
  const [qntPage, setQntPage] = useState(1)
  const [limit, setLimit] = useState(25)
  const [search, setSearch] = useState(null)
  const [disablePrev, setDisablePrev] = useState(true)
  const [disableNext, setDisableNext] = useState(false)
  const [anos, setAnos] = useState([])
  const [municipios, setMunicipios] = useState([])
  const [escolas, setEscolas] = useState([])
  const [showFilter, setShowFilter] = useState(false)
  const [resetSchool, setResetSchool] = useState(false)
  const [searchTerm, setSearchTerm] = useState(null)
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => {
    const isAsc = order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setSelectedColumn(property)
    loadTurmas(search, page, limit, property, order, filterYear, filterCity, filterSchool, filterType, filterStatus)
  }

  useEffect(() => {
    setDisablePrev(page === 1 ? true : false);
    setDisableNext(page === qntPage ? true : false);
  }, [qntPage, page])

  const handleChangePage2 = (direction) => {
    if (direction === "prev") {
      setPage((page - 1))
      loadTurmas(search, page - 1, limit, selectedColumn, order, filterYear, filterCity, filterSchool, filterType, filterStatus)
    }
    else {
      setPage((page + 1))
      loadTurmas(search, page + 1, limit, selectedColumn, order, filterYear, filterCity, filterSchool, filterType, filterStatus)
    }
  }
  const handleChangeLimit = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(parseInt(event.target.value))
    setPage(1)
    loadTurmas(search, 1, Number(event.target.value), selectedColumn, order, filterYear, filterCity, filterSchool, filterType, filterStatus)
  }

  useEffect(() => {
    setPage(1)
    loadTurmas(search, 1, limit, selectedColumn, order, filterYear, filterCity, filterSchool, filterType, filterStatus)
  }, [search])

  const [rows, setRows] = useState([])
  const tableBody = useRef();

  async function loadTurmas(search: string, page: number, limit: number, selectedColumn: string, order: string, year: string, county: any, school: any, type: string, status: number) {

    const respTurmas = await getSchoolClasses(search, page, limit, selectedColumn, order.toUpperCase(), null, year, county?.MUN_ID, school?.ESC_ID, type, status)
    const inicio = respTurmas?.data.links?.last.search('=')
    const fim = respTurmas?.data.links?.last.search('&')
    setQntPage(parseInt(respTurmas.data.links?.last.substring(inicio + 1, fim)))

    let list = []
    respTurmas.data.items?.map(x => {
      list.push(createData(x.TURMA_TUR_ID, x.TURMA_TUR_NOME, x.TURMA_TUR_TIPO, x.TUR_MUN_MUN_NOME, x.TUR_ESC_ESC_NOME, x.TURMA_TUR_ANO, x.TUR_SER_SER_NOME, x.TURMA_TUR_PERIODO, x.TURMA_TUR_ATIVO ? "Ativo" : "Inativo"))
    })

    setRows(list)

  }

  const loadAnos = async () => {
    const resp = await getAllYears()

    setAnos(resp.data.sort((a, b) => b.ANO_NOME - a.ANO_NOME))
  }
  const loadMunicipios = async () => {
    const resp = await getAllCounties()
    setMunicipios(resp.data)
  }
  const loadEscolas = async () => {
    const resp = await getCountySchools(selectedCity?.ESC_ID)
    setEscolas(resp.data)
  }


  useEffect(() => {
    loadTurmas(search, page, limit, selectedColumn, order, filterYear, filterCity, filterSchool, filterType, filterStatus)
    loadMunicipios()
    loadAnos()
  }, [])

  useEffect(() => {
    if (selectedCity) {
      loadEscolas()
    }
  }, [selectedCity])


  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * limit - rows.length) : 0

  const handleChangeSearch = (e) => {
    setSearchTerm(e.target.value);
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

  const handleSelectYear = (e) => {
    setSelectedYear(e.target.value)
  }
  const handleSelectCity = (newValue) => {
    setSelectedCity(newValue)
    setSelectedSchool(null)
  }
  const handleSelectSchool = (newValue) => {
    setSelectedSchool(newValue)
  }
  const handleSelectType = (e) => {
    setSelectedType(e.target.value)
  }
  const handleSelectStatus = (e) => {
    setSelectedStatus(e.target.value)
  }

  const filterSelected = () => {
    setFilterCity(selectedCity)
    setFilterYear(selectedYear)
    setFilterSchool(selectedSchool)
    setFilterType(selectedType)
    setFilterStatus(selectedStatus)
    setPage(1)

    loadTurmas(search, 1, limit, selectedColumn, order, selectedYear, selectedCity, selectedSchool, selectedType, selectedStatus)
  }

  const changeShowFilter = (e) => {
    setShowFilter(!showFilter)
  }

  const setRow = (row, index) => {
    const labelId = `enhanced-table-checkbox-${index}`

    return (
      <Link href={`/turma/editar/${row.TURMA_TUR_ID}`}
        key={row.TURMA_TUR_ID} passHref>
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
            {row.TURMA_TUR_NOME}
          </TableCell>
          <TableCellBorder>
            {row.TURMA_TUR_ID}
          </TableCellBorder>
          <TableCellBorder>
            {row.TURMA_TUR_TIPO}
          </TableCellBorder>
          <TableCellBorder>
            {row.TUR_MUN_MUN_NOME}
          </TableCellBorder>
          <TableCellBorder>
            {row.TUR_ESC_ESC_NOME}
          </TableCellBorder>
          <TableCellBorder>
            {row.TURMA_TUR_ANO}
          </TableCellBorder>
          <TableCellBorder>
            {row.TUR_SER_SER_NOME}
          </TableCellBorder>
          <TableCellBorder>
            {row.TURMA_TUR_PERIODO}
          </TableCellBorder>
          <TableCellBorder>
            {row.TURMA_TUR_ATIVO}
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
          <Link href="/turma" passHref>
            <div style={{ width: 160 }}>
              <ButtonPadrao onClick={() => { }}>Cadastrar Turma</ButtonPadrao>
            </div>
          </Link>
        </div>
      </TopContainer>
      {showFilter &&
        <FilterSelectedContainer>
          <div className="me-2">
            <FormControl sx={{}} size="small">
              <InputLabel id="status">Ano Letivo</InputLabel>
              <Select
                style={{width: 150, background: "#FFF"}}
                labelId="status"
                id="status"
                value={selectedYear}
                label="Ano Letivo"
                onChange={(e) => handleSelectYear(e)}
              >
                <MenuItem value={null}>
                  <em>Todos</em>
                </MenuItem>
                {anos && anos?.map(x =>  (
                  <MenuItem key={x.ANO_ID} value={x.ANO_NOME}>
                    {x.ANO_NOME}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="me-2">
            <AutoCompletePagMun county={selectedCity} changeCounty={handleSelectCity} width={"150px"} />
          </div>
          <div className="pe-2 me-2 border-end border-white">
            <AutoCompletePagEscMun school={selectedSchool} changeSchool={handleSelectSchool} mun={selectedCity} resetSchools={resetSchool} width={"150px"}  />
          </div>
          <div className="pe-2 me-2 border-end border-white">
            <FormControl sx={{}} size="small">
              <InputLabel id="status">Tipo</InputLabel>
              <Select
                style={{width: 150, background: "#FFF"}}
                labelId="status"
                id="status"
                value={selectedType}
                label="Tipo"
                onChange={(e) => handleSelectType(e)}
              >
                <MenuItem value={null}>
                  <em>Todos</em>
                </MenuItem>
                <MenuItem value={"Regular"}>
                  Regular
                </MenuItem>
                <MenuItem value={"Multisseriada"}>
                  Multisseriada
                </MenuItem>
              </Select>
            </FormControl>
          </div>
          <div>
            <FormControl sx={{}} size="small">
              <InputLabel id="status">Status</InputLabel>
              <Select
                style={{width: 150, background: "#FFF"}}
                labelId="status"
                id="status"
                value={selectedStatus}
                label="Status"
                onChange={(e) => handleSelectStatus(e)}
              >
                <MenuItem value={null}>
                  <em>Todos</em>
                </MenuItem>
                <MenuItem value={1}>
                  Ativo
                </MenuItem>
                <MenuItem value={0}>
                  Inativo
                </MenuItem>
              </Select>
            </FormControl>
          </div>
          <div>
            <ButtonStyled onClick={() => { filterSelected() }}>Filtrar</ButtonStyled>
          </div>
        </FilterSelectedContainer >
      }
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '100%', mb: 2, borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px' }}>
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
