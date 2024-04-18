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
import { Container, IconEdit, Name, TopContainer } from './styledComponents'
import { InputSearch, IconSearch, TableCellBorder, Pagination, FormSelectStyled, ButtonPage, TableCellStyled, TableRowStyled, TableSortLabelStyled, Marker, FilterSelectedContainer } from 'src/shared/styledTables'
import { MdNavigateNext, MdNavigateBefore, MdOutlineEdit, MdOutlineFilterAlt } from "react-icons/md"
import { ButtonPadrao } from 'src/components/buttons/buttonPadrao';
import { BsQuestionCircle } from 'react-icons/bs'
import Link from 'next/link'
import useDebounce from 'src/utils/use-debounce'
import Router from 'next/router'
import { FormControl, InputLabel, MenuItem, Select, Tooltip } from '@mui/material'
import { useAuth } from 'src/context/AuthContext'
import ModalReport from '../ModalReport'
import { useGetExternalReport } from 'src/services/relatorio-externo'
import ButtonWhite from 'src/components/buttons/buttonWhite'


interface Data {
  id: string
  name: string
  category: string
  description: string
  status: string
  edit: string
  link: string
}

function createData(
  id: string,
  name: string,
  category: string,
  description: string,
  status: string,
  edit: string,
  link: string,
  ): Data {
  return {
    id,
    name,
    category,
    description,
    status,
    edit,
    link,
  }
}

interface HeadCell {
  id: keyof Data
  label: string
  numeric: boolean
}

const headCells: HeadCell[] = [
  {
    id: 'name',
    numeric: false,
    label: 'NOME',
  },
  {
    id: 'category',
    numeric: false,
    label: 'CATEGORIA',
  },
]

const headCellsSaev: HeadCell[] = [
  {
    id: 'name',
    numeric: false,
    label: 'NOME',
  },
  {
    id: 'category',
    numeric: false,
    label: 'CATEGORIA',
  },
  {
    id: 'status',
    numeric: false,
    label: 'STATUS',
  },
  {
    id: 'edit',
    numeric: true,
    label: 'EDITAR',
  },
]

interface EnhancedTableProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void
  order: string
  orderBy: string
  rowCount: number
  user: any
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort, user } =
    props
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property)
    }

  return (
    <TableHead>
      <TableRow>
        {user?.USU_SPE?.SPE_PER?.PER_NOME === 'SAEV' ?
          headCellsSaev.map((headCell) => {
            return (
              <TableCellStyled
                key={headCell.id}
                padding={'normal'}
              >
                <TableSortLabelStyled
                >
                  {headCell.label}
                </TableSortLabelStyled>
              </TableCellStyled>
            )
          })
          :
          headCells.map((headCell) => {
            return (
              <TableCellStyled
                key={headCell.id}
                padding={'normal'}
              >
                <TableSortLabelStyled
                >
                  {headCell.label}
                </TableSortLabelStyled>
              </TableCellStyled>
            )
          })

        }
      </TableRow>
    </TableHead>
  )
}

export function TableExternalReport() {
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('name')
  const [selectedColumn, setSelectedColumn] = useState(null)
  const [page, setPage] = useState(1)
  const [qntPage, setQntPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState(null)
  const [disablePrev, setDisablePrev] = useState(true)
  const [disableNext, setDisableNext] = useState(false)
  const [searchTerm, setSearchTerm] = useState(null)
  const [openModalReport, setOpenModalReport] = useState(false)
  const [link, setLink] = useState(null)
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [name, setName] = useState(null)
  const {user} = useAuth()
  const [showFilter, setShowFilter] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null);

  const { data, isLoading } = useGetExternalReport(
    search,
    page,
    limit,
    null,
    'ASC',
    user?.USU_SPE?.SPE_PER?.PER_NOME === 'SAEV' ? filterStatus : '1'
  );
  

  useEffect(() => {
    let list = [];

    setQntPage(data?.meta?.totalPages);

    data?.items?.map((x) => {
      list.push(
        createData(x.id, x.name, x.category, x.description, x.active, x.edit, x.link))
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
    setPage(1)
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

  const changeShowFilter = () => {
    setShowFilter(!showFilter)
  }

  const filterSelected = () => {
    setFilterStatus(selectedStatus)
  }

  const setRow = (row, index) => {
    const labelId = `enhanced-table-checkbox-${index}`

    return (
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <Name status={row.status} onClick={() => {row.status && (setLink(row.link), setName(row.name), setOpenModalReport(true))}}>{row.name}</Name>
          <div>
            <Tooltip 
              title={row.description} 
              arrow 
              placement="left-end" 
              componentsProps={{
                tooltip: {
                  sx: {
                    bgcolor: '#63CFBD',
                    color: '#000',
                    '& .MuiTooltip-arrow': {
                      color: '#63CFBD',
                    },
                  },
                },
              }}
            >
              <div>
                <BsQuestionCircle color={'#3E8277'} size={20}/>
              </div>
            </Tooltip>
          </div>
        </div>
        </TableCell>
        <TableCellBorder>
          {row.category}
        </TableCellBorder>
        {user?.USU_SPE?.SPE_PER?.PER_NOME === 'SAEV' && 
          <>
            <TableCellBorder>
              {row.status ? "Ativo" : <div style={{color: 'red'}}>Inativo</div>}
            </TableCellBorder>
            <TableCellBorder>
              <IconEdit onClick={() => Router.push(`/relatorio-externo/editar/${row.id}`)} >
                <MdOutlineEdit color={'#3E8277'} size={22} />
              </IconEdit>
            </TableCellBorder>
          </>
        }
      </TableRowStyled>
    )
  }

  return (
    <Container>
      <TopContainer>
        <div className="d-flex mb-2">
          {user?.USU_SPE?.SPE_PER?.PER_NOME === 'SAEV' ? 
            <Tooltip 
              title={"Filtro Avançado"} 
              arrow 
              placement="bottom-start"
            >
              <div>
                <Marker onClick={changeShowFilter}>
                  <MdOutlineFilterAlt color="#FFF" size={24} />
                </Marker>
              </div>
            </Tooltip>
            :
            <div className='ms-3'></div>
          }
          <div className="d-flex flex-row-reverse align-items-center">
            <InputSearch size={16} type="text" placeholder="Pesquise" name="searchTerm"
              onChange={handleChangeSearch}
            />
            <IconSearch color={'#7C7C7C'} />
          </div>
        </div>
        {user?.USU_SPE?.SPE_PER?.PER_NOME === 'SAEV' && 
          <div>
            <Link href="/relatorio-externo" passHref>
              <div style={{ width: 160 }}>
                <ButtonPadrao onClick={() => { }}>Adicionar Link</ButtonPadrao>
              </div>
            </Link>
          </div>
        }
      </TopContainer>
      {showFilter && (
        <FilterSelectedContainer>
          <div className="me-3 border-end border-white">
            <FormControl sx={{ width: 150 }} size="small">
              <InputLabel id="status">Status</InputLabel>
              <Select
                labelId="status"
                id="status"
                value={selectedStatus}
                label="Status"
                onChange={(e) => setSelectedStatus(e.target.value)}
                sx={{
                  backgroundColor:"#fff",
                  "& .Mui-disabled": {
                    background: "#D3D3D3",
                  },
                }}
              >
                <MenuItem value={null}>
                  <em>Todos</em>
                </MenuItem>
                <MenuItem value={"1"}>Ativo</MenuItem>
                <MenuItem value={"0"}>Inativo</MenuItem>
              </Select>
            </FormControl>
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
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
                user={user}
              />
              <TableBody id="tableBody" ref={tableBody}>
                {rows.map((row, index) => {
                    return (setRow(row, index))
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <Pagination>
            Linhas por página:
            <FormSelectStyled value={limit} onChange={handleChangeLimit}>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
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
      <ModalReport
        open={openModalReport}
        handleClose={() => {
          setOpenModalReport(false);
        }}
        link={link}
        name={name}
      />
    </Container>
  )
}
