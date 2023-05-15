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
import { Container, InputSearch, IconSearch, TopContainer, TableCellBorder, Pagination, FormSelectStyled, ButtonPage, TableCellStyled, TableRowStyled, TableSortLabelStyled, ButtonMun } from './styledComponents'
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md"
import { ButtonPadrao } from 'src/components/buttons/buttonPadrao'
import ButtonWhite from 'src/components/buttons/buttonWhite'
import Router from 'next/router'
import Link from 'next/link'
import ModalMunicipios from 'src/components/avaliacao/modalMunicipios'
import { getAssessments, useGetAssessments } from 'src/services/avaliaoces.service'
import { CSVLink } from "react-csv";
import useDebounce from 'src/utils/use-debounce'

interface Data {
  AVALIACAO_AVA_ID: string
  AVALIACAO_AVA_NOME: string
  AVA_LANÇAMENTO: string
  AVALIACAO_MUNICIPIO: Array<string>
  AVALIACAO_TESTE: Array<string>
}

function createData(
  AVALIACAO_AVA_ID: string,
  AVALIACAO_AVA_NOME: string,
  AVA_LANÇAMENTO: string,
  AVALIACAO_MUNICIPIO: Array<string>,
  AVALIACAO_TESTE: Array<string>,
): Data {
  return {
    AVALIACAO_AVA_ID,
    AVALIACAO_AVA_NOME,
    AVA_LANÇAMENTO,
    AVALIACAO_MUNICIPIO,
    AVALIACAO_TESTE,
  }
}


interface HeadCell {
  id: keyof Data
  label: string
  status: boolean
}

const headCells: readonly HeadCell[] = [
  {
    id: 'AVALIACAO_AVA_NOME',
    status: false,
    label: 'EDIÇÃO',
  },
  {
    id: 'AVA_LANÇAMENTO',
    status: false,
    label: 'LANÇAMENTO',
  },
  {
    id: 'AVALIACAO_MUNICIPIO',
    status: false,
    label: 'MUNICÍPIOS',
  },
  {
    id: 'AVALIACAO_TESTE',
    status: false,
    label: 'TESTES',
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

export default function TableAvaliacao() {
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('AVALIACAO_AVA_NOME')
  const [selectedColumn, setSelectedColumn] = useState(null)
  const [page, setPage] = useState(1)
  const [qntPage, setQntPage] = useState(1)
  const [limit, setLimit] = useState(25)
  const [search, setSearch] = useState(null)
  const [searchTerm, setSearchTerm] = useState(null)
  const [disablePrev, setDisablePrev] = useState(true)
  const [disableNext, setDisableNext] = useState(false)
  const [modalMunicipios, setModalMunicipios] = useState()
  const [csv, setCsv] = useState([])
  const csvLink = useRef(undefined)
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data: dataEditions, isLoading: isLoadingEdition } = useGetAssessments(search, page, limit, selectedColumn, order.toUpperCase(), null, null, null, null, null);

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

  useEffect(() => {
    setQntPage(dataEditions?.meta?.totalPages)

    let list = []
    dataEditions?.items?.map(x => {
      let uniqueMun = []
      x.AVALIACAO_MUNICIPIO?.split("|")?.forEach((c) => {
        if (!uniqueMun.includes(c)) {
          uniqueMun.push(c);
        }
      });
      let uniqueTest = []
      x.AVALIACAO_TESTE?.split("|")?.forEach((c) => {
        if (!uniqueTest.includes(c)) {
          uniqueTest.push(c);
        }
      });

      if (selectedColumn === 'AVALIACAO_MUNICIPIO') {
        uniqueMun = uniqueMun.sort((a, b) => a.localeCompare(b));

        if (order === "desc") {
          uniqueMun = uniqueMun.sort((a, b) => b.localeCompare(a));
        }
      }

      if (selectedColumn === 'AVALIACAO_TESTE') {
        uniqueTest = uniqueTest.sort((a, b) => a.localeCompare(b));

        if (order === "desc") {
          uniqueTest = uniqueTest.sort((a, b) => b.localeCompare(a));
        }
      }


      list.push(createData(x.AVALIACAO_AVA_ID, x.AVALIACAO_AVA_NOME, x.AVA_LANCAMENTOS, uniqueMun, uniqueTest))
    })
    setRows(list)
  },[dataEditions])

  const createExport = async (search: string) => {
    const respAvaliacoes = await getAssessments(search, 1, 9999, null, "ASC", null, null, null, null)

    let list = []
    respAvaliacoes.data.items?.map(x => {
      let uniqueMun = []
      x.AVALIACAO_MUNICIPIO?.split("|")?.forEach((c) => {
        if (!uniqueMun.includes(c)) {
          uniqueMun.push(c);
        }
      });
      let uniqueTest = []
      x.AVALIACAO_TESTE?.split("|")?.forEach((c) => {
        if (!uniqueTest.includes(c)) {
          uniqueTest.push(c);
        }
      });
      list.push(createData(x.AVALIACAO_AVA_ID, x.AVALIACAO_AVA_NOME, x.AVA_LANCAMENTOS, uniqueMun, uniqueTest))
    })

    setRows(list)

    const tempCsv = []
    tempCsv.push(['AVALIAÇÃO', 'LANÇAMENTO', 'MUNICÍPIOS', 'TESTES'])
    const listCSV = JSON.parse(JSON.stringify(list));
    listCSV.map((item) => {
      delete item.AVALIACAO_AVA_ID
      tempCsv.push(Object.values(item))
    });
    setCsv(tempCsv)
  }

  const downloadCsv = (e) => {
    csvLink.current.link.click()
  }

  useEffect(() => {
    createExport(search)
  }, [search])


  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * limit - rows.length) : 0

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

  const setRow = (row, index) => {
    const labelId = `enhanced-table-checkbox-${index}`
    return (
      <Link href={`/edicao/editar/${row.AVALIACAO_AVA_ID}`}
        key={row.AVALIACAO_AVA_ID}
        passHref >
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
            {row.AVALIACAO_AVA_NOME}
          </TableCell>
          <TableCellBorder>
            {row.AVA_LANCAMENTOS}
          </TableCellBorder>
          <TableCellBorder>
            <ButtonMun type="button" onClick={(e) => { setModalMunicipios(row); e.stopPropagation() }}>
              {row.AVALIACAO_MUNICIPIO?.length || 0}
            </ButtonMun>
          </TableCellBorder>
          <TableCellBorder>
            {
              row.AVALIACAO_TESTE?.map((row, index) => {
                return <>{row}<br /></>
              })
            }
          </TableCellBorder>
        </TableRowStyled>
      </Link>
    )
  }

  return (
    <>
      <Container>
        <TopContainer className="mb-2">
          <div className="d-flex flex-row-reverse align-items-center ms-2">
            <InputSearch size={16} type="text" placeholder="Pesquise" name="searchTerm"
              onChange={handleChangeSearch}
            />
            <IconSearch color={'#7C7C7C'} />
          </div>
          <div className="d-flex">
            <div className="pe-2" style={{ width: 100 }}>
              <ButtonWhite onClick={(e) => { downloadCsv(e) }}>Exportar</ButtonWhite>
              <CSVLink
                data={csv}
                filename="avaliacoes.csv"
                className="hidden"
                ref={csvLink}
                target="_blank" />
            </div>
            <div style={{ width: 160 }}>
              <ButtonPadrao onClick={() => { Router.push(`/edicao`) }}>Adicionar Edição</ButtonPadrao>
            </div>
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
      <ModalMunicipios
        show={modalMunicipios}
        onHide={() => { setModalMunicipios(null) }}
      />
    </>
  )
}
