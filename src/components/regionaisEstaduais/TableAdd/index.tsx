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
import { useGetCounties } from 'src/services/municipios.service'
import { Loading } from 'src/components/Loading'
import useDebounce from 'src/utils/use-debounce'

interface Params {
  listAdded: any[]
  addItem: (item) => void
  stateId: number
}
export default function TableAdd({ listAdded, addItem, stateId }: Params) {
  const [page, setPage] = useState<number>(1)
  const [search, setSearch] = useState('')
  const [disablePrev, setDisablePrev] = useState(true);
  const [disableNext, setDisableNext] = useState(false);
  const [qntPage, setQntPage] = useState(1);
  const debouncedSearchTerm = useDebounce(search, 500);

  const { data, isLoading } = useGetCounties({search: debouncedSearchTerm, page, limit: 6, column: null, order: 'ASC', active: "1", verifyExistsRegional: 1, stateId, enabled: !!stateId});

  useEffect(() => {
    setQntPage(data?.meta?.totalPages);
  }, [data])

  useEffect(() => {
    setDisablePrev(page === 1 ? true : false);
    setDisableNext(page === qntPage ? true : false);
  }, [qntPage, page]);

  const handleAdd = async (city: any) => {
    addItem(city)
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
      <div style={{ marginBottom: 24 }}>Adicionar Municípios</div>
      <div>
        <TextField
          id="city"
          label="Pesquisar Município"
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
              <TableCellStyled><strong>MUNICÍPIOS</strong></TableCellStyled>
              <TableCellStyled align="center"></TableCellStyled>
            </TableRow>
          </TableHead>
          <TableBody>
            {stateId ? isLoading ? 
              <Loading /> 
              : data?.items?.length > 0 ? (
                data?.items.map((city) => (
                  <TableRow key={'cityAdd' + city.MUN_ID}>
                    <TableCell>{city.MUN_NOME}</TableCell>
                    <TableCellBorder align="center">
                      {listAdded?.find(
                        (addCity) => addCity.MUN_ID === city.MUN_ID,
                      ) ? (
                        <TextAdd>
                          Adicionado
                        </TextAdd>
                      ) : (
                        <ButtonAdd
                          type='button'
                          data-test={`add-${city.MUN_ID}`}
                          onClick={() => handleAdd(city)}
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
                Selecione um estado
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
