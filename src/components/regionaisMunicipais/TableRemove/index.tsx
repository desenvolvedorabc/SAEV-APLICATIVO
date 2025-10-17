import { useEffect, useState } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { MdNavigateBefore, MdNavigateNext, MdOutlineRemove, MdSearch } from 'react-icons/md'
import { InputAdornment, TableCell, TextField } from '@mui/material'
import { ButtonPage, Pagination, TableCellBorder, TableCellStyled } from 'src/shared/styledTables'
import { ButtonRemove } from './styledComponents'

interface Params {
  listAdded: any[]
  removeItem: (item) => void
}
export default function TableRemove({ listAdded, removeItem }: Params) {
  const [page, setPage] = useState<number>(0)
  const [listSchoolFilter, setListSchoolFilter] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [disablePrev, setDisablePrev] = useState(true);
  const [disableNext, setDisableNext] = useState(false);
  const [qntPage, setQntPage] = useState(1);

  const getPaginated = (list) => {
    return list.slice(0 + (6*page), 6 + (6*page))
  }

  useEffect(() => {
    let listFiltered = listAdded?.sort((a, b) => a.ESC_NOME.localeCompare(b.ESC_NOME))
    if (search)
      listFiltered = listFiltered.filter((school) =>
        school.ESC_NOME
          .toUpperCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .includes(
            search
              .toUpperCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, ''),
          ),
      )

    setQntPage(Math.floor(listFiltered.length / 7));
    let paginatedList = getPaginated(listFiltered)

    setListSchoolFilter(paginatedList)

  }, [listAdded, page, search])
  
  useEffect(() => {
    setDisablePrev(page === 0 ? true : false);
    setDisableNext(page === qntPage ? true : false);
  }, [qntPage, page]);

  const handleAdd = async (school: any) => {
    removeItem(school);
  }

  const handleChangeSearch = (newValue) => {
    setSearch(newValue)
    setPage(0)
  }
  
  const handleChangePage = (direction) => {
    if (direction === "prev") {
      setPage(page - 1);
    } else {
      setPage(page + 1);
    }
  };

  return (
    <div style={{ width: '100%', padding: '20px' }}>
      <div style={{ marginBottom: 24 }}>Escolas Vinculadas</div>
      <div>
        <TextField
          id="school"
          label="Pesquisar Escola Vinculada"
          size="small"
          fullWidth
          value={search}
          sx={{ backgroundColor: '#fff', marginBottom: '24px' }}
          onChange={(e) => handleChangeSearch(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <MdSearch color={'#3E8277'} />
              </InputAdornment>
            ),
          }}
        />
      </div>
      <TableContainer
        component={Paper}
      >
        <Table stickyHeader aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCellStyled><strong>ESCOLAS VINCULADAS ({listAdded?.length})</strong></TableCellStyled>
              <TableCellStyled align="center"></TableCellStyled>
            </TableRow>
          </TableHead>
          <TableBody>
            {listSchoolFilter.length > 0 ? (
                listSchoolFilter.map((school) => (
                  <TableRow key={'schoolRemove' + school.ESC_ID}>
                    <TableCell>{school.ESC_NOME}</TableCell>
                    <TableCellBorder align="center">
                      <ButtonRemove
                        type='button'
                        data-test={`add-${school.id}`}
                        onClick={() => handleAdd(school)}
                      >
                        <div style={{ marginRight: '12px'}}>
                          Remover
                        </div>
                        <MdOutlineRemove size={24} />
                      </ButtonRemove>
                    </TableCellBorder>
                  </TableRow>
                ))
              ) : (
                <div style={{ padding: 10 }}>
                  Nenhuma escola foi vinculada.
                </div>
            )}
          </TableBody>
        </Table>
        <Pagination>
          <ButtonPage type="button" data-test='previous' onClick={() => handleChangePage("prev")} disabled={disablePrev}>
            <MdNavigateBefore size={24} />
          </ButtonPage>
          <ButtonPage type="button" data-test='next' onClick={() => handleChangePage("next")} disabled={disableNext}>
            <MdNavigateNext size={24} />
          </ButtonPage>
        </Pagination>
      </TableContainer>
    </div>
  )
}
