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
import { ButtonStart, Circle, Container, Status, Text, TopContainer } from './styledComponents'
import { FilterSelectedContainer, Marker, InputSearch, IconSearch, TableCellBorder, Pagination, FormSelectStyled, ButtonPage, ButtonStyled, TableCellStyled, TableRowStyled, TableSortLabelStyled } from 'src/shared/styledTables'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { MdOutlineFilterAlt, MdNavigateNext, MdNavigateBefore } from "react-icons/md"

import { Autocomplete, TextField } from '@mui/material'
import useDebounce from 'src/utils/use-debounce'
import { useAssessmentsOnlineStudent } from 'src/services/avaliacao-online'
import { useGetSchoolClasses } from 'src/services/turmas.service'
import ModalAviso from 'src/components/modalAviso'
import Router from 'next/router'


interface Data {
  id: string,
  codigo: string,
  name: string,
  ava: string,
  status: string,
}

function createData(
  id: string,
  codigo: string,
  name: string,
  ava: string,
  status: string,
  ): Data {
  return {
    id,
    codigo,
    name,
    ava,
    status,
  }
}

interface HeadCell {
  id: keyof Data
  label: string
  numeric: boolean
}

const headCells: readonly HeadCell[] = [
  {
    id: 'codigo',
    numeric: false,
    label: 'CÓDIGO',
  },
  {
    id: 'name',
    numeric: false,
    label: 'NOME DO ALUNO',
  },
  {
    id: 'ava',
    numeric: true,
    label: 'APLICAR AVALIAÇÃO',
  },
  {
    id: 'status',
    numeric: true,
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
            align={headCell.numeric ? 'center' : 'left'}
            padding={'normal'}
            // sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabelStyled
              // active={orderBy === headCell.id}
              // direction={order === "asc" ? "desc" : "asc"}
              // onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {/* {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null} */}
            </TableSortLabelStyled>
          </TableCellStyled>
        ))}
      </TableRow>
    </TableHead>
  )
}

export default function TableAvaliacaoOnlineStudents({idAva, idSerie}) {
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('name')
  const [selectedColumn, setSelectedColumn] = useState(null)
  const [selectedClass, setSelectedClass] = useState(null)
  const [filterClass, setFilterClass] = useState(null)
  const [page, setPage] = useState(1)
  const [qntPage, setQntPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState(null)
  const [disablePrev, setDisablePrev] = useState(true)
  const [disableNext, setDisableNext] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const [searchTerm, setSearchTerm] = useState(null)
  const [modalShowStart, setModalShowStart] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  
  const { data, isLoading } = useAssessmentsOnlineStudent(
    search,
    page,
    limit,
    selectedColumn,
    order.toUpperCase(),
    idAva,
    filterClass,
  );

  useEffect(() => {
    let list = [];

    setQntPage(data?.meta?.totalPages);
    console.log('data :', data);

    data?.items?.map((x) => {
      list.push(
        createData(x.ALU_ID, x.ALU_INEP, x.ALU_NOME, x.isAvailable, x.isAvailable)
      );
    });
    setRows(list);
  }, [data?.items, data?.meta?.totalPages]);

  
  const { data: dataSchoolClass, isLoading: isLoadingSerie } = useGetSchoolClasses(
    null,
    1,
    99999999,
    null,
    'ASC',
    '2023',
    null,
    null,
    idSerie,
    null,
    1,
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
    setSelectedClass(newValue)
  }

  const filterSelected = () => {
    setFilterClass(selectedClass?.TURMA_TUR_ID)
    setPage(1)
  }

  const changeShowFilter = (e) => {
    setShowFilter(!showFilter)
  }

  const setRow = (row, index) => {
    const labelId = `enhanced-table-checkbox-${index}`
    
    console.log('row :', row);
    return (
      // <Link href={`/avaliacao-online/alunos/${row.id}`}
      //    passHref>
        <TableRowStyled
          role="checkbox"
          tabIndex={-1}
          key={row.id}
        >
          <TableCell
            component="th"
            id={labelId}
            scope="row"
            padding="normal"
          >
            {row.codigo ? row.codigo : 'N/A'}
          </TableCell>
          <TableCellBorder
            component="th"
            id={labelId}
            scope="row"
            padding="normal"
          >
            {row.name}
          </TableCellBorder>
          <TableCellBorder align="center">
            <ButtonStart onClick={() => {setModalShowStart(true), setSelectedStudent({id: row.id, name: row.name})}} disabled={!row.status}>
              Iniciar Avaliação
            </ButtonStart>
          </TableCellBorder>
          <TableCellBorder align="center">
            <Status available={row.status} >
              <Circle available={row.status}/>
              <Text available={row.status} >
                {!row.status  ? "Concluída" : "Disponível"}
              </Text>
            </Status>
          </TableCellBorder>
        </TableRowStyled>
      // </Link>
    )
  }

  return (
    <>
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
        </TopContainer>
        {showFilter &&
          <FilterSelectedContainer>
            <div className="me-2">
              <Autocomplete
                fullWidth
                style={{width: 142, background: "#FFF"}}
                id="size-small-outlined"
                size="small"
                noOptionsText="Turma"
                options={dataSchoolClass?.items}
                value={selectedClass}
                getOptionLabel={(option) => `${option?.TURMA_TUR_NOME}`}
                onChange={(event, newValue) => {
                  handleSelectSerie(newValue);
                }}
                renderInput={(params) => (
                  <TextField size="small" {...params} label="Turma" />
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
      <ModalAviso
        show={modalShowStart}
        onHide={() => setModalShowStart(false)}
        onConfirm={() => { Router.push(`/avaliacao-online/realizar/${idAva}/${selectedStudent?.id}`) }}
        buttonYes={'Sim. Desejo Realizar a Avaliação'}
        buttonNo={'Não. Desejo Voltar'}
        text={`Atenção! Você está iniciando uma avaliação online para o aluno ${selectedStudent?.name}. Tem certeza que deseja continuar?  `}
      />
    </>
  )
}
