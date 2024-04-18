import * as React from 'react'
import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { visuallyHidden } from '@mui/utils'
import { getTeachers, useGetTeachers } from 'src/services/professores.service'
import { Container, TopContainer } from './styledComponents'
import { InputSearch, IconSearch, TableCellBorder, Pagination, FormSelectStyled, ButtonPage, TableCellStyled, TableRowStyled, TableSortLabelStyled } from 'src/shared/styledTables'
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md"
import { ButtonPadrao } from 'src/components/buttons/buttonPadrao';

import ButtonWhite from 'src/components/buttons/buttonWhite'
import Router from 'next/router'
import Link from 'next/link'
import { format } from 'date-fns'
import useDebounce from 'src/utils/use-debounce'
import { Loading } from 'src/components/Loading'

interface Data {
  PRO_ID: string
  PRO_NOME: string
  PRO_DOCUMENTO: string
  PRO_FONE: string
  PRO_EMAIL: string
  PRO_FOR: string
  PRO_DT_NASC: number
}

function createData(
  PRO_ID: string,
  PRO_NOME: string,
  PRO_DOCUMENTO: string,
  PRO_FONE: string,
  PRO_EMAIL: string,
  PRO_FOR: string,
  PRO_DT_NASC: number,
): Data {
  return {
    PRO_ID,
    PRO_NOME,
    PRO_DOCUMENTO,
    PRO_FONE,
    PRO_EMAIL,
    PRO_FOR,
    PRO_DT_NASC
  }
}


interface HeadCell {
  id: keyof Data
  label: string
  status: boolean
}

const headCells: readonly HeadCell[] = [
  {
    id: 'PRO_NOME',
    status: false,
    label: 'NOME',
  },
  {
    id: 'PRO_DOCUMENTO',
    status: false,
    label: 'CPF',
  },
  {
    id: 'PRO_FONE',
    status: false,
    label: 'TELEFONE',
  },
  {
    id: 'PRO_EMAIL',
    status: false,
    label: 'EMAIL',
  },
  {
    id: 'PRO_FOR',
    status: false,
    label: 'FORMAÇAO',
  },
  {
    id: 'PRO_DT_NASC',
    status: true,
    label: 'IDADE',
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

export default function TableProfessores({ munId = '0' }) {
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('PRO_NOME')
  const [selectedColumn, setSelectedColumn] = useState(null)
  const [page, setPage] = useState(1)
  const [qntPage, setQntPage] = useState(1)
  const [limit, setLimit] = useState(25)
  const [search, setSearch] = useState(null)
  const [searchTerm, setSearchTerm] = useState(null);
  const [disablePrev, setDisablePrev] = useState(true)
  const [disableNext, setDisableNext] = useState(false)
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data, isLoading } = useGetTeachers(search, page, limit, selectedColumn, order.toUpperCase(), munId);

  useEffect(() => {
    let list = [];

    setQntPage(data?.meta?.totalPages);

    data?.items?.map((x) => {
      list.push(
        createData(
          x.PRO_ID, 
          x.PRO_NOME, 
          x.PRO_DOCUMENTO, 
          x.PRO_FONE, 
          x.PRO_EMAIL, 
          x.PRO_FOR?.FOR_NOME, 
          getAge(x.PRO_DT_NASC)
        )
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
    // loadProfessores(search, page, limit, property, order, munId)
  }

  useEffect(() => {
    setDisablePrev(page === 1 ? true : false);
    setDisableNext(page === qntPage ? true : false);
  }, [qntPage, page])

  const handleChangePage2 = (direction) => {
    if (direction === "prev") {
      setPage((page - 1))
      // loadProfessores(search, page - 1, limit, selectedColumn, order, munId)
    }
    else {
      setPage((page + 1))
      // loadProfessores(search, page + 1, limit, selectedColumn, order, munId)
    }
  }
  const handleChangeLimit = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(parseInt(event.target.value))
    setPage(1)
    // loadProfessores(search, 1, Number(event.target.value), selectedColumn, order, munId)
  }

  // useEffect(() => {
  //   loadProfessores(search, page, limit, selectedColumn, order, munId)
  // }, [search])

  const [rows, setRows] = useState([])

  const getAge = (data_nasc) => {
    const date = new Date()
    const nasc = new Date(data_nasc)
    const diff = Math.abs(date.getTime() - nasc.getTime());
    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));

    return years
  }

  // async function loadProfessores(search: string, page: number, limit: number, selectedColumn: string, order: string, county: string) {
  //   const respProfessores = await getTeachers(search, page, limit, selectedColumn, order.toUpperCase(), county)
  //   const inicio = respProfessores?.data.links?.last.search('=')
  //   const fim = respProfessores?.data.links?.last.search('&')
  //   setQntPage(parseInt(respProfessores.data.links?.last.substring(inicio + 1, fim)))

  //   let list = []
  //   respProfessores.data.items?.map(x => {
  //     list.push(createData(x.PRO_ID, x.PRO_NOME, x.PRO_DOCUMENTO, x.PRO_FONE, x.PRO_EMAIL, x.PRO_FOR?.FOR_NOME, getAge(x.PRO_DT_NASC)))
  //   })
  //   setRows(list)
  // }

  // useEffect(() => {
  //   loadProfessores(search, page, limit, selectedColumn, order, munId)
  // }, [])

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * limit - rows.length) : 0

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

  const setRow = (row, index) => {
    const labelId = `enhanced-table-checkbox-${index}`
    return (
      <Link href={`/municipio/${munId}/professor/${row.PRO_ID}`}
        key={row.PRO_ID}>
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
            {row.PRO_NOME}
          </TableCell>
          <TableCellBorder>
            {row.PRO_DOCUMENTO}
          </TableCellBorder>
          <TableCellBorder>
            {row.PRO_FONE}
          </TableCellBorder>
          <TableCellBorder>
            {row.PRO_EMAIL}
          </TableCellBorder>
          <TableCellBorder>
            {row.PRO_FOR}
          </TableCellBorder>
          <TableCellBorder>
            {row.PRO_DT_NASC}
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
          {/* <div className="pe-2">
            <ButtonWhite onClick={() => { Router.push(`/municipio/${munId}/professor`) }}>Importar</ButtonWhite>
          </div> */}
          <ButtonPadrao onClick={() => { Router.push(`/municipio/${munId}/professor`) }}>Adicionar Professor(A)</ButtonPadrao>
        </div>
      </TopContainer>
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '100%', mb: 2, borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px' }}>
          {isLoading ? 
            <Loading />
          :
            (
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
            )
          }
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
