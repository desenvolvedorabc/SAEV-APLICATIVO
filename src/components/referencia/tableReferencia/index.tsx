import * as React from 'react'
import { useState, useEffect, useMemo, useRef } from 'react'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { visuallyHidden } from '@mui/utils'
import { CSVLink } from "react-csv";
import { Container, TopContainer } from './styledComponents'
import { InputSearch, IconSearch, TableCellBorder, Pagination, FormSelectStyled, ButtonPage, TableCellStyled, TableRowStyled, TableSortLabelStyled } from 'src/shared/styledTables'
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md"
import { ButtonPadrao } from 'src/components/buttons/buttonPadrao';

import ButtonWhite from 'src/components/buttons/buttonWhite'
import Router from 'next/router'
import Link from 'next/link'
import { getReferences, useGetReferences } from 'src/services/referencias.service'
import useDebounce from 'src/utils/use-debounce'

interface Data {
  MATRIZ_REFERENCIA_MAR_ID: string
  MATRIZ_REFERENCIA_MAR_NOME: string
  MAR_DIS_DIS_NOME: string
  MATRIZ_REFERENCIA_MAR_SERIES: string
}

function createData(
  MATRIZ_REFERENCIA_MAR_ID: string,
  MATRIZ_REFERENCIA_MAR_NOME: string,
  MAR_DIS_DIS_NOME: string,
  MATRIZ_REFERENCIA_MAR_SERIES: string,
): Data {
  return {
    MATRIZ_REFERENCIA_MAR_ID,
    MATRIZ_REFERENCIA_MAR_NOME,
    MAR_DIS_DIS_NOME,
    MATRIZ_REFERENCIA_MAR_SERIES
  }
}


interface HeadCell {
  id: keyof Data
  label: string
  status: boolean
  width?: number
}

const headCells: readonly HeadCell[] = [
  {
    id: 'MATRIZ_REFERENCIA_MAR_NOME',
    status: false,
    label: 'MATRIZ',
    width: 150,
  },
  {
    id: 'MAR_DIS_DIS_NOME',
    status: false,
    label: 'DISCIPLINA',
    width: 150,
  },
  {
    id: 'MATRIZ_REFERENCIA_MAR_SERIES',
    status: false,
    label: 'SÉRIES',
    width: 300,
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
            style={{ width: headCell.width }}
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

export default function TableReferencia(props) {
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('MATRIZ_REFERENCIA_MAR_NOME')
  const [selectedColumn, setSelectedColumn] = useState(null)
  const [page, setPage] = useState(1)
  const [qntPage, setQntPage] = useState(1)
  const [limit, setLimit] = useState(25)
  const [search, setSearch] = useState(null)
  const [searchTerm, setSearchTerm] = useState(null);
  const [disablePrev, setDisablePrev] = useState(true)
  const [disableNext, setDisableNext] = useState(false)
  const [rows, setRows] = useState([])
  const [csv, setCsv] = useState([])
  const csvLink = useRef(undefined)
  const [exportCsv, setExportCsv] = useState(false)
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data, isLoading } = useGetReferences(search, page, limit, selectedColumn, order.toUpperCase(), null, null);

  useEffect(() => {
    let list = [];

    setQntPage(data?.meta?.totalPages);

    data?.items?.map((x) => {
      list.push(createData(x.MATRIZ_REFERENCIA_MAR_ID, x.MATRIZ_REFERENCIA_MAR_NOME, x.MAR_DIS_DIS_NOME, x.MATRIZ_REFERENCIA_MAR_SERIES)
      );
    });
    setRows(list);
  }, [data?.items, data?.meta?.totalPages]);

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

  const createExport = async () => {
    const respReferencias = await getReferences(search, 1, 9999, null, "ASC", null, null, null)

    let list = []
    respReferencias.data.items?.map(x => {
      list.push(createData(x.MATRIZ_REFERENCIA_MAR_ID, x.MATRIZ_REFERENCIA_MAR_NOME, x.MAR_DIS_DIS_NOME, x.MATRIZ_REFERENCIA_MAR_SERIES))
    })
    setRows(list)

    const tempCsv = []
    tempCsv.push(['NOME', 'DISCIPLINA', 'MATRIZ_REFERENCIA_MAR_SERIES'])
    const listCSV = JSON.parse(JSON.stringify(list));
    listCSV.map((item) => {
      delete item.MATRIZ_REFERENCIA_MAR_ID
      tempCsv.push(Object.values(item))
    });
    setCsv(tempCsv)
    setExportCsv(true)
  }

  useEffect(() => {
    if(exportCsv){
      csvLink.current.link.click()
      setExportCsv(false)
    }
  }, [csv, exportCsv])

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * limit - rows.length) : 0

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
    setSearchTerm(e.target.value);
  };

  const downloadCsv = (e) => {
    createExport()
  }

  const setRow = (row, index) => {
    const labelId = `enhanced-table-checkbox-${index}`
    return (
      <Link href={`/matriz-de-referencia/editar/${row.MATRIZ_REFERENCIA_MAR_ID}`}
        key={row.MATRIZ_REFERENCIA_MAR_ID} passHref>
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
            {row.MATRIZ_REFERENCIA_MAR_NOME}
          </TableCell>
          <TableCellBorder>
            {row.MAR_DIS_DIS_NOME}
          </TableCellBorder>
          <TableCellBorder>
            {row.MATRIZ_REFERENCIA_MAR_SERIES}
          </TableCellBorder>
        </TableRowStyled>
      </Link>
    )
  }

  return (
    <Container>
      <TopContainer className="mb-2">
        <div className="d-flex flex-row-reverse align-items-center ms-2">
          <InputSearch size={16} type="text" placeholder="Pesquise" name="searchTerm"
            onChange={handleChangeSearch}
          />
          <IconSearch color={'#7C7C7C'} />
        </div>
        <div className="d-flex">
          <div className="pe-2">
            <ButtonWhite onClick={(e) => { downloadCsv(e) }}>Exportar</ButtonWhite>
            <CSVLink
              data={csv}
              filename="matriz-referencia.csv"
              className="hidden"
              ref={csvLink}
              target="_blank" />
          </div>
          <ButtonPadrao onClick={() => { Router.push(`/matriz-de-referencia`) }}>Adicionar Matriz</ButtonPadrao>
        </div>
      </TopContainer>
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
