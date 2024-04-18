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

import Link from 'next/link'
import { Autocomplete, TextField } from '@mui/material'
import useDebounce from 'src/utils/use-debounce'
import { useAssessmentsOnline } from 'src/services/avaliacao-online'
import { useGetSeries } from 'src/services/series.service'
import { format } from 'date-fns'


interface Data {
  id: string,
  name: string,
  subject: string,
  serie: string,
  startAt: string,
  endsAt: string,
  assessmentOnlineId: string,
  serieId: number,
}

function createData(
  id: string,
  name: string,
  subject: string,
  serie: string,
  startAt: string,
  endsAt: string,
  assessmentOnlineId: string,
  serieId: number
  ): Data {
  return {
    id,
    name,
    subject,
    serie,
    startAt,
    endsAt,
    assessmentOnlineId,
    serieId
  }
}

interface HeadCell {
  id: keyof Data
  label: string
  numeric: boolean
}

const headCells: readonly HeadCell[] = [
  {
    id: 'name',
    numeric: false,
    label: 'NOME',
  },
  {
    id: 'subject',
    numeric: false,
    label: 'DISCIPLINA',
  },
  {
    id: 'serie',
    numeric: false,
    label: 'SÉRIE',
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

export default function TableAvaliacaoOnline() {
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('name')
  const [selectedColumn, setSelectedColumn] = useState(null)
  const [selectedSerie, setSelectedSerie] = useState(null)
  const [filterSerie, setFilterSerie] = useState(null)
  const [page, setPage] = useState(1)
  const [qntPage, setQntPage] = useState(1)
  const [limit, setLimit] = useState(5)
  const [search, setSearch] = useState(null)
  const [disablePrev, setDisablePrev] = useState(true)
  const [disableNext, setDisableNext] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const [searchTerm, setSearchTerm] = useState(null)
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  
  const { data, isLoading } = useAssessmentsOnline(
    search,
    page,
    limit,
    selectedColumn,
    order.toUpperCase(),
    filterSerie
  );

  useEffect(() => {
    let list = [];

    setQntPage(data?.meta?.totalPages);
    console.log('data :', data);

    data?.items?.map((x) => {
      list.push(
        createData(x.id, x.name, x.subject, x.serie, x.startAt, x.endsAt, x.assessmentOnlineId, x.serieId)
      );
    });
    setRows(list);
  }, [data?.items, data?.meta?.totalPages]);

  
  const { data: dataSerie, isLoading: isLoadingSerie } = useGetSeries(
    null,
    1,
    99999999,
    null,
    'ASC',
    null,
    "1",
  );


  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
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

  const handleSelectSerie = (newValue) => {
    setSelectedSerie(newValue)
  }

  const filterSelected = () => {
    setFilterSerie(selectedSerie?.SER_ID)
    setPage(1)
  }

  const changeShowFilter = (e) => {
    setShowFilter(!showFilter)
  }

  const setRow = (row, index) => {
    const labelId = `enhanced-table-checkbox-${index}`

    console.log('row :', row);
    return (
      <Link href={`/avaliacao-online/alunos/${row.serieId}/${row.assessmentOnlineId}`}
        key={row.id} passHref>
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
            {row.name}
          </TableCell>
          <TableCellBorder>
            {row.subject}
          </TableCellBorder>
          <TableCellBorder>
            {row.serie}
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
        {rows.length > 0 &&
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'end', marginRight: 32}}>
            <div style={{color: '#7c7c7c', fontWeight: 300}}>Período de Edição dos Testes:</div>
            <div>{rows[0]?.startAt && format(new Date(rows[0]?.startAt), 'dd/MM/yyyy')} a {rows[0]?.endsAt && format(new Date(rows[0]?.endsAt), 'dd/MM/yyyy')}</div>
          </div>
        }
      </TopContainer>
      {showFilter &&
        <FilterSelectedContainer>
          <div className="me-2">
            <Autocomplete
              fullWidth
              style={{width: 142, background: "#FFF"}}
              id="size-small-outlined"
              size="small"
              noOptionsText="Série"
              options={dataSerie?.items}
              value={selectedSerie}
              getOptionLabel={(option) => `${option?.SER_NOME}`}
              onChange={(event, newValue) => {
                handleSelectSerie(newValue);
              }}
              renderInput={(params) => (
                <TextField size="small" {...params} label="Série" />
              )}
            />
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
              {!isLoading ? 
                  (rows.length > 0 ?
                    <TableBody id="tableBody" ref={tableBody}>
                      {rows.map((row, index) => {
                          return (setRow(row, index))
                        })}
                    </TableBody>
                  :
                    <div style={{display: 'flex', justifyContent: 'center', padding: '20px 0'}}>Não existe resultado</div>)
                :
                  <div className="d-flex align-items-center flex-column m-4">
                    <div className="spinner-border" role="status"></div>
                  </div>
                }
            </Table>
          </TableContainer>
          <Pagination>
            Linhas por página:
            <FormSelectStyled value={limit} onChange={handleChangeLimit}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
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
