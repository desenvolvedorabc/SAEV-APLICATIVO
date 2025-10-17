import { useEffect, useState } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { MdNavigateBefore, MdNavigateNext, MdOutlineAdd, MdSearch } from 'react-icons/md'
import { InputAdornment, TableCell, TextField } from '@mui/material'
import { ButtonPage, Pagination, TableCellBorder, TableCellStyled } from 'src/shared/styledTables'
import { ButtonAdd, TextAdd } from './styledComponents'
import { Loading } from 'src/components/Loading'
import useDebounce from 'src/utils/use-debounce'
import { useGetSchools } from 'src/services/escolas.service'

interface Params {
  listAdded: any[]
  addItem: (item) => void
  county: number
}
export default function TableAdd({ listAdded, addItem, county }: Params) {
  const [page, setPage] = useState<number>(1)
  const [search, setSearch] = useState('')
  const [disablePrev, setDisablePrev] = useState(true);
  const [disableNext, setDisableNext] = useState(false);
  const [qntPage, setQntPage] = useState(1);
  const debouncedSearchTerm = useDebounce(search, 500);

  const { data, isLoading } = useGetSchools({search: debouncedSearchTerm, page, limit: 6, column: null, order: 'ASC', active: "1", verifyExistsRegional: 1, county, typeSchool:'MUNICIPAL', enabled: !!county});

  useEffect(() => {
    setQntPage(data?.meta?.totalPages);
  }, [data])

  useEffect(() => {
    setDisablePrev(page === 1 ? true : false);
    setDisableNext(page === qntPage ? true : false);
  }, [qntPage, page]);

  const handleAdd = async (school: any) => {
    addItem(school)
  }

  const handleChangeSearch = (newValue) => {
    setSearch(newValue)
    setPage(1)
  }
  
  const handleChangePage = (direction) => {
    if (direction === "prev") {
      setPage(page - 1);
    } else {
      setPage(page + 1);
    }
  };

  useEffect(() => {
    setPage(1)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[debouncedSearchTerm]);

  return (
    <div style={{ width: '100%', padding: '20px' }}>
      <div style={{ marginBottom: 24 }}>Adicionar Escolas</div>
      <div>
        <TextField
          id="school"
          label="Pesquisar Escola"
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
              <TableCellStyled><strong>ESCOLAS</strong></TableCellStyled>
              <TableCellStyled align="center"></TableCellStyled>
            </TableRow>
          </TableHead>
          <TableBody>
            {county ? isLoading ? 
              <Loading /> 
              : data?.items?.length > 0 ? (
                data?.items.map((school) => (
                  <TableRow key={'schoolAdd' + school.ESC_ID}>
                    <TableCell>{school.ESC_NOME}</TableCell>
                    <TableCellBorder align="center">
                      {listAdded?.find(
                        (addCity) => addCity.ESC_ID === school.ESC_ID,
                      ) ? (
                        <TextAdd>
                          Adicionado
                        </TextAdd>
                      ) : (
                        <ButtonAdd
                          type='button'
                          data-test={`add-${school.ESC_ID}`}
                          onClick={() => handleAdd(school)}
                        >
                          <div style={{ marginRight: '12px'}}>
                            Adicionar
                          </div>
                          <MdOutlineAdd size={24} />
                        </ButtonAdd>
                      )}
                    </TableCellBorder>
                  </TableRow>
                ))
              ) : (
                <div style={{ padding: 10 }}>
                  Nenhum resultado encontrado
                </div>
            ):
              <div style={{ padding: 10 }}>
                Selecione um Município
              </div>
            }
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
