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
import { MdNavigateNext, MdNavigateBefore, MdOutlineFilterAlt } from "react-icons/md"
import { ButtonPadrao } from 'src/components/buttons/buttonPadrao'
import ButtonWhite from 'src/components/buttons/buttonWhite'
import Router from 'next/router'
import Link from 'next/link'
import ModalMunicipios from 'src/components/avaliacao/modalMunicipios'
import { getAssessments, useGetAssessments } from 'src/services/avaliaoces.service'
import { CSVLink } from "react-csv";
import useDebounce from 'src/utils/use-debounce'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { FilterSelectedContainer, Marker } from 'src/shared/styledTables'
import { AutoCompletePagMun } from 'src/components/AutoCompletePag/AutoCompletePagMun'
import { Autocomplete, TextField } from '@mui/material'
import { useGetYears } from 'src/services/anos.service'

interface Data {
  AVA_ID: string
  AVA_NOME: string
  AVA_ANO: string
  AVALIACAO_MUNICIPIO: Array<string>
  AVALIACAO_TESTE: Array<string>
}

function createData(
  AVA_ID: string,
  AVA_NOME: string,
  AVA_ANO: string,
  AVALIACAO_MUNICIPIO: Array<string>,
  AVALIACAO_TESTE: Array<string>,
): Data {
  return {
    AVA_ID,
    AVA_NOME,
    AVA_ANO,
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
    id: 'AVA_ANO',
    status: false,
    label: 'ANO',
  },
  {
    id: 'AVA_NOME',
    status: false,
    label: 'EDIÇÃO',
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


    const showSort = (headCellId) => {
      if(headCellId === 'AVA_NOME' || headCellId === 'AVA_ANO'){
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
  )
}

export default function TableAvaliacao() {
  const [order, setOrder] = useState('asc')
  const [selectedColumn, setSelectedColumn] = useState('AVA_NOME')
  const [page, setPage] = useState(1)
  const [qntPage, setQntPage] = useState(1)
  const [limit, setLimit] = useState(25)
  const [search, setSearch] = useState(null)
  const [searchTerm, setSearchTerm] = useState(null)
  const [selectedYear, setSelectedYear] = useState(null);
  const [filterYear, setFilterYear] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [filterCity, setFilterCity] = useState(null);
  const [disablePrev, setDisablePrev] = useState(true)
  const [disableNext, setDisableNext] = useState(false)
  const [modalMunicipios, setModalMunicipios] = useState()
  const [csv, setCsv] = useState([])
  const csvLink = useRef(undefined)
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [showFilter, setShowFilter] = useState(false);

  const { data: dataEditions, isLoading: isLoadingEdition } = useGetAssessments(search, page, limit, selectedColumn, order.toUpperCase(), filterCity, null, null, null, filterYear);

  const { data: dataYears } = useGetYears(null, 1, 999999, null, 'DESC', true);

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
  
  const changeShowFilter = (e) => {
    setShowFilter(!showFilter);
  };

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


      list.push(createData(x.Assessments_AVA_ID, x.Assessments_AVA_NOME, x.Assessments_AVA_ANO, uniqueMun, uniqueTest))
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
      list.push(createData(x.Assessments_AVA_ID, x.Assessments_AVA_NOME, x.Assessments_AVA_ANO, uniqueMun, uniqueTest))
    })

    setRows(list)

    const tempCsv = []
    tempCsv.push(['ANO', 'AVALIAÇÃO', 'MUNICÍPIOS', 'TESTES'])
    const listCSV = JSON.parse(JSON.stringify(list));
    listCSV.map((item) => {
      delete item.Assessments_AVA_ID
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

  const filterSelected = () => {
    setFilterCity(selectedCity?.MUN_ID)
    setFilterYear(selectedYear?.ANO_NOME)
    setPage(1)
  }

  const setRow = (row, index) => {
    const labelId = `enhanced-table-checkbox-${index}`
    return (
      <Link href={`/edicao/editar/${row.AVA_ID}`}
        key={row.AVA_ID}
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
            {row.AVA_ANO}
          </TableCell>
          <TableCellBorder>
            {row.AVA_NOME}
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
        {showFilter && (
          <FilterSelectedContainer>
            <div className="pe-2 me-2 border-end border-white">
              <Autocomplete
                className=""
                id="size-small-outlined"
                size="small"
                value={selectedYear}
                noOptionsText="Ano Letivo (Avaliação):"
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
                  <TextField size="small" {...params} label="Ano Letivo (Avaliação):" />
                )}
                renderOption={(props, option) =>  
                  <li {...props} key={option.ANO_ID}>
                    {option.ANO_NOME}
                  </li>
                }
              />
            </div>
            <div className="me-2">
              <AutoCompletePagMun county={selectedCity} changeCounty={setSelectedCity} width={"150px"} label={'Município Participante:'}/>
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
