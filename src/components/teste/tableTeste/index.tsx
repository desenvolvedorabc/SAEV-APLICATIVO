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
import { getTests } from 'src/services/testes.service'
import { Container, TopContainer } from './styledComponents'
import { InputSearch, IconSearch, TableCellBorder, Pagination, FormSelectStyled, ButtonPage, TableCellStyled, TableRowStyled, TableSortLabelStyled, Marker, FilterSelectedContainer } from 'src/shared/styledTables'
import { MdNavigateNext, MdNavigateBefore, MdOutlineFilterAlt } from "react-icons/md"
import { ButtonPadrao } from 'src/components/buttons/buttonPadrao';

import ButtonWhite from 'src/components/buttons/buttonWhite'
import Router from 'next/router'
import Link from 'next/link'
import { CSVLink } from "react-csv";
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { Autocomplete, TextField } from '@mui/material'
import { useGetYears } from 'src/services/anos.service'
import { useGetSeries } from 'src/services/series.service'
import { useGetSubjects } from 'src/services/disciplinas.service'

interface Data {
  TESTE_TES_ID: string
  TESTE_TES_NOME: string
  TES_DIS_DIS_NOME: string
  TES_SER_SER_NOME: string
}

function createData(
  TESTE_TES_ID: string,
  TESTE_TES_NOME: string,
  TES_DIS_DIS_NOME: string,
  TES_SER_SER_NOME: string,
): Data {
  return {
    TESTE_TES_ID,
    TESTE_TES_NOME,
    TES_DIS_DIS_NOME,
    TES_SER_SER_NOME,
  }
}


interface HeadCell {
  id: keyof Data
  label: string
  status: boolean
}

const headCells: readonly HeadCell[] = [
  {
    id: 'TESTE_TES_NOME',
    status: false,
    label: 'NOME',
  },
  {
    id: 'TES_DIS_DIS_NOME',
    status: false,
    label: 'DISCIPLINA',
  },
  {
    id: 'TES_SER_SER_NOME',
    status: false,
    label: 'SÉRIE',
  }
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
            align={headCell.status ? 'center' : 'left'}
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

export default function TableTeste(props) {
  const [order, setOrder] = useState('asc')
  const [selectedColumn, setSelectedColumn] = useState('TESTE_TES_NOME')
  const [selectedYear, setSelectedYear] = useState(null);
  const [filterYear, setFilterYear] = useState(null);
  const [selectedDisciplina, setSelectedDisciplina] = useState(null);
  const [filterDisciplina, setFilterDisciplina] = useState(null);
  const [selectedSerie, setSelectedSerie] = useState(null);
  const [filterSerie, setFilterSerie] = useState(null);
  const [page, setPage] = useState(1)
  const [qntPage, setQntPage] = useState(1)
  const [limit, setLimit] = useState(25)
  const [search, setSearch] = useState(null)
  const [disablePrev, setDisablePrev] = useState(true)
  const [disableNext, setDisableNext] = useState(false)
  const [csv, setCsv] = useState([])
  const csvLink = useRef(undefined)
  const [showFilter, setShowFilter] = useState(false);

  const { data: dataYears } = useGetYears(null, 1, 999999, null, 'DESC', null);

  const { data: dataSerie } = useGetSeries(
    null, 1, 9999999, null, 'ASC', null
  );

  const { data: dataSubjects, isLoading } = useGetSubjects(
    null,
    1,
    9999999,
    null,
    'ASC',
  );

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => {
    const isAsc = order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setSelectedColumn(property)
    loadTestes(search, page, limit, property, order, filterYear, filterDisciplina, filterSerie)
  }

  useEffect(() => {
    setDisablePrev(page === 1 ? true : false);
    setDisableNext(page === qntPage ? true : false);
  }, [qntPage, page])

  const handleChangePage2 = (direction) => {
    if (direction === "prev") {
      setPage((page - 1))
      loadTestes(search, page - 1, limit, selectedColumn, order, filterYear, filterDisciplina, filterSerie)
    }
    else {
      setPage((page + 1))
      loadTestes(search, page + 1, limit, selectedColumn, order, filterYear, filterDisciplina, filterSerie)
    }
  }
  const handleChangeLimit = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(parseInt(event.target.value))
    setPage(1)
    loadTestes(search, 1, Number(event.target.value), selectedColumn, order, filterYear, filterDisciplina, filterSerie)
  }

  const [rows, setRows] = useState([])


  async function loadTestes(search: string, page: number, limit: number, selectedColumn: string, order: string, year: number, subject: string, serie: string ){
    const respTestes = await getTests(search, page, limit, selectedColumn, order.toUpperCase(), year, subject, serie)
    const inicio = respTestes?.data.links?.last.search('=')
    const fim = respTestes?.data.links?.last.search('&')
    setQntPage(parseInt(respTestes.data.links?.last.substring(inicio + 1, fim)))

    let list = []
    respTestes.data.items?.map(x => {
      list.push(createData(x.TESTE_TES_ID, x.TESTE_TES_NOME, x.TES_DIS_DIS_NOME, x.TES_SER_SER_NOME))
    })
    setRows(list)
  }

  const createExport = async (search: string) => {
    const respTestes = await getTests(search, 1, 9999, null, "ASC", filterYear, filterDisciplina, filterSerie)

    let list = []
    respTestes.data.items?.map(x => {
      list.push(createData(x.TESTE_TES_ID, x.TESTE_TES_NOME, x.TES_DIS_DIS_NOME, x.TES_SER_SER_NOME))
    })
    setRows(list)

    const tempCsv = []
    tempCsv.push(['NOME', 'DISCIPLINA', 'SERIE'])
    const listCSV = JSON.parse(JSON.stringify(list));
    listCSV.map((item) => {
      delete item.TESTE_TES_ID
      tempCsv.push(Object.values(item))
    });
    setCsv(tempCsv)
    csvLink.current.link.click()
  }

  const downloadCsv = (e) => {
    createExport(search)
  }

  useEffect(() => {
    loadTestes(search, page, limit, selectedColumn, order, filterYear, filterDisciplina, filterSerie)
  }, [])

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * limit - rows.length) : 0

  const changeShowFilter = (e) => {
    setShowFilter(!showFilter);
  };

  const filterSelected = () => {
    setFilterDisciplina(selectedDisciplina?.DIS_ID)
    setFilterSerie(selectedSerie?.SER_ID)
    setFilterYear(selectedYear?.ANO_NOME)
    setPage(1)
    loadTestes(search, 1, limit, selectedColumn, order, selectedYear?.ANO_NOME, selectedDisciplina?.DIS_ID, selectedSerie?.SER_ID)
  }

  const handleChangeSearch = (e) => {
    setSearch(e.target.value)
    setPage(1)
    loadTestes(e.target.value, 1, limit, selectedColumn, order, filterYear, filterDisciplina, filterSerie)
  }

  const setRow = (row, index) => {
    const labelId = `enhanced-table-checkbox-${index}`
    return (
      <Link href={`/teste/editar/${row.TESTE_TES_ID}`}
        key={row.TESTE_TES_ID} passHref>
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
            {row.TESTE_TES_NOME}
          </TableCell>
          <TableCellBorder
          >
            {row.TES_DIS_DIS_NOME}
          </TableCellBorder>
          <TableCellBorder>
            {row.TES_SER_SER_NOME}
          </TableCellBorder>
        </TableRowStyled>
      </Link>
    )
  }

  return (
    <Container>
      <TopContainer className="mb-2">
        <div className="d-flex">
          <OverlayTrigger
            key={"toolTip"}
            placement={"top"}
            overlay={<Tooltip id={`tooltip-top`}>Filtro Avançado</Tooltip>}
          >
            <Marker onClick={changeShowFilter}>
              <MdOutlineFilterAlt color="#FFF" size={24} />
            </Marker>
          </OverlayTrigger>
          <div className="d-flex flex-row-reverse align-items-center">
            <InputSearch size={16} type="text" placeholder="Pesquise" name="searchTerm"
              onChange={handleChangeSearch}
            />
            <IconSearch color={'#7C7C7C'} />
          </div>
        </div>
        <div className="d-flex">
          <div className="pe-2">
            <ButtonWhite onClick={(e) => { downloadCsv(e) }}>Exportar</ButtonWhite>
            <CSVLink
              data={csv}
              filename="testes.csv"
              className="hidden"
              ref={csvLink}
              target="_blank" />
          </div>
          <ButtonPadrao onClick={() => { Router.push(`/teste`) }}>Adicionar Teste</ButtonPadrao>
        </div>
      </TopContainer>
      {showFilter && (
        <FilterSelectedContainer>
          <div className="pe-2 me-2 border-end border-white">
            <Autocomplete
              className=""
              id="size-small-outlined"
              size="small"
              value={selectedYear}
              noOptionsText="Ano Letivo (Teste):"
              options={dataYears?.items}
              getOptionLabel={(option) => `${option.ANO_NOME}`}
              onChange={(_event, newValue) => {
                setSelectedYear(newValue);
              }}
              sx={{
                background: "#fff",
                width: 150,
              }}
              renderInput={(params) => (
                <TextField size="small" {...params} label="Ano Letivo (Teste):" />
              )}
              renderOption={(props, option) =>  
                <li {...props} key={option.ANO_ID}>
                  {option.ANO_NOME}
                </li>
              }
            />
          </div>
          <div className="pe-2 me-2 border-end border-white">
            <Autocomplete
              className=""
              id="size-small-outlined"
              size="small"
              value={selectedDisciplina}
              noOptionsText="Disciplina (Teste)"
              options={dataSubjects?.items}
              getOptionLabel={(option) => `${option.DIS_NOME}`}
              onChange={(_event, newValue) => {
                setSelectedDisciplina(newValue);
              }}
              sx={{
                background: "#fff",
                width: 150,
              }}
              renderInput={(params) => (
                <TextField size="small" {...params} label="Disciplina (Teste)" />
              )}
            />
          </div>
          <div className="me-2">
            <Autocomplete
              className=""
              id="size-small-outlined"
              size="small"
              value={selectedSerie}
              noOptionsText="Série (Teste)"
              options={dataSerie?.items}
              getOptionLabel={(option) => `${option.SER_NOME}`}
              onChange={(_event, newValue) => {
                setSelectedSerie(newValue);
              }}
              sx={{
                background: "#fff",
                width: 150,
              }}
              renderInput={(params) => (
                <TextField size="small" {...params} label="Série (Teste)" />
              )}
            />
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
                orderBy={selectedColumn}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody>
                {
                  rows.map((row, index) => {
                    return setRow(row, index)
                  }
                  )}
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
