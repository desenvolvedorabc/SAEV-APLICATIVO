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
import { getTestEdler, getTestFile, getTestHerby } from 'src/services/testes.service'
import { Container, Loading, TopContainer } from './styledComponents'
import { InputSearch, IconSearch, TableCellBorder, Pagination, FormSelectStyled, ButtonPage, TableCellStyled, TableRowStyled } from 'src/shared/styledTables'
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md"
import { ButtonPadrao } from 'src/components/buttons/buttonPadrao';
import Download from "public/assets/images/downloadTest.svg";
import { getAssessmentsDownload } from 'src/services/avaliaoces.service'
import { format } from 'date-fns'
import JSZip from 'jszip'
import { saveAs } from 'file-saver';
import ReactLoading from 'react-loading';
import useDebounce from 'src/utils/use-debounce'
import { parseCookies } from 'nookies'
import ModalConfirmacao from 'src/components/modalConfirmacao'

interface Data {
  id: number
  edicao: string
  disciplina: string
  dataDisponivel: string
  periodo: string
  serie: string
  teste: string
  manual: string
  file: string
  card: string
  arq_manual: string
}

function createData(
  id: number,
  edicao: string,
  disciplina: string,
  dataDisponivel: string,
  periodo: string,
  serie: string,
  teste: string,
  manual: string,
  file: string,
  card: string,
  arq_manual: string,
): Data {
  return {
    id,
    edicao,
    disciplina,
    dataDisponivel,
    periodo,
    serie,
    teste,
    manual,
    file,
    card,
    arq_manual,

  }
}


interface HeadCell {
  id: keyof Data
  label: string
  status: boolean
}

const headCells: readonly HeadCell[] = [
  {
    id: 'edicao',
    status: false,
    label: 'EDIÇÃO',
  },
  {
    id: 'disciplina',
    status: false,
    label: 'DISCIPLINA',
  },
  {
    id: 'dataDisponivel',
    status: false,
    label: 'DATA DISPONÍVEL',
  },
  {
    id: 'periodo',
    status: false,
    label: 'PERÍODO LANÇAMENTO INICIAL / FINAL',
  },
  {
    id: 'serie',
    status: false,
    label: 'SÉRIE',
  },
  {
    id: 'teste',
    status: false,
    label: 'TESTE',
  },
  {
    id: 'manual',
    status: false,
    label: 'MANUAL',
  },
  {
    id: 'file',
    status: false,
    label: 'TESTE E MANUAL',
  },
  {
    id: 'card',
    status: false,
    label: 'CARTÃO RESPOSTA',
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
            style={{fontWeight: 'bold'}}
          >
            {/* <TableSortLabelStyled
              active={orderBy === headCell.id}
              direction={order === "asc" ? "desc" : "asc"}
              onClick={createSortHandler(headCell.id)}
            > */}
              {headCell.label}
              {/* {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null} */}
            {/* </TableSortLabelStyled> */}
          </TableCellStyled>
        ))}
      </TableRow>
    </TableHead>
  )
}

export function TableTesteAvailable({id, escId, url}) {
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('TESTE_TES_NOME')
  const [selectedColumn, setSelectedColumn] = useState(null)
  const [page, setPage] = useState(1)
  const [qntPage, setQntPage] = useState(1)
  const [limit, setLimit] = useState(25)
  const [search, setSearch] = useState(null)
  const [disablePrev, setDisablePrev] = useState(true)
  const [disableNext, setDisableNext] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState(null);
  const [showModalErrorEdler, setShowModalErrorEdler] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const cookies = parseCookies();
  const perfil = cookies["PER_NOME"]

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => {
    const isAsc = order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setSelectedColumn(property)
    loadTestes(search, page, limit, property, order)
  }

  useEffect(() => {
    setDisablePrev(page === 1 ? true : false);
    setDisableNext(page === qntPage ? true : false);
  }, [qntPage, page])

  const handleChangePage2 = (direction) => {
    if (direction === "prev") {
      setPage((page - 1))
      loadTestes(search, page - 1, limit, selectedColumn, order)
    }
    else {
      setPage((page + 1))
      loadTestes(search, page + 1, limit, selectedColumn, order)
    }
  }
  const handleChangeLimit = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(parseInt(event.target.value))
    setPage(1)
    loadTestes(search, 1, Number(event.target.value), selectedColumn, order)
  }

  const [rows, setRows] = useState([])


  async function loadTestes(search: string, page: number, limit: number, selectedColumn: string, order: string) {

    let respTestes = null
    respTestes = await getAssessmentsDownload(search, page, limit, selectedColumn, order.toUpperCase(), id, escId)

    setQntPage(respTestes?.data?.meta?.totalPages)

    let list = []
    respTestes.data.items?.map(x => {
      list.push(createData(
        x.id, 
        x.edition, 
        x.subject, 
        x.availableAt && format(new Date(x.availableAt), 
        'dd/MM/yyyy'), 
        x.startAt && `${format(new Date(x.startAt), 'dd/MM/yyyy')} - ${format(new Date(x.endsAt), 'dd/MM/yyyy')}`, 
        x.serie,
        x.name, 
        x.manual, 
        x.file,
        null, 
        null))
    })
    setRows(list)
  }

  useEffect(() => {
    loadTestes(search, page, limit, selectedColumn, order)
  }, [])

  useEffect(() => {
    loadTestes(search, page, limit, selectedColumn, order)
  }, [search])

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

  const downloadFile = (teste) => {
    if(perfil === 'Escola') return 
    
    setLoading(true)
    if(teste.file){
      const anchor = document.createElement("a");
      anchor.href = `${url}/tests/file/${teste.file}`;
      anchor.target="_blank";
      anchor.download = teste.file;
      
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    }
    
    if(teste.manual){
      const anchor = document.createElement("a");
      anchor.href = `${url}/tests/manual/${teste.manual}`;
      anchor.target="_blank";
      anchor.download = teste.manual;
      
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);

    }
    setLoading(false)
  } 

  const generateZipFromCloud = async () => { 
    setLoading(true);
    let filename = "TesteDownload";
    let urls = []

    const zip = new JSZip()
    const folder = zip.folder('project')
    urls.forEach(async (url) => {
      const response = await getTestFile(rows[13].teste)
      const blobPromise = response.data
                   
      const name = url.substring(url.lastIndexOf('/'))
      folder.file(name, blobPromise)
    })

    
    function dataURItoBlob(dataURI) {
      const arrayBuffer = new ArrayBuffer(dataURI.length);
      const int8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < dataURI.length; i++) {
        int8Array[i] = dataURI.charCodeAt(i);
      }
      const blob = new Blob([int8Array], { type: 'application/pdf'});
      return blob;
    }

    const response = await getTestFile(rows[13].teste)
    const blobPromise = dataURItoBlob(response.data)

    const name = url.substring(url.lastIndexOf('/'))
    folder.file(name, blobPromise)
  
    zip.generateAsync({type:"blob"})
      .then(blob => saveAs(blob, filename))
      .catch(e => console.log(e));

    setLoading(false);
  }

  const generateHerbyCard = async (idTeste: number, teste) => {
    setLoading(true);
    const resp = await getTestHerby(idTeste, id, escId)
    setLoading(false);

    var blob = new Blob([resp.data], { type: "application/pdf" });
    var link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = teste + ".pdf";
    link.click();
  }

  
  const generateEdlerCard = async (idTeste: number, teste) => {
    setLoading(true);
    const resp = await getTestEdler(idTeste, id, escId)
    setLoading(false);

    if(resp?.data?.message){
      setShowModalErrorEdler(true);
    }
    else{
      var blob = new Blob([resp.data], { type: "application/pdf" });
      var link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = teste + ".pdf";
      link.click();
    }
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
            {row.edicao}
          </TableCell>
          <TableCellBorder
          >
            {row.disciplina}
          </TableCellBorder>
          <TableCellBorder>
            {row.dataDisponivel}
          </TableCellBorder>
          <TableCellBorder>
            {row.periodo}
          </TableCellBorder>
          <TableCellBorder>
            {row.serie}
          </TableCellBorder>
          <TableCellBorder style={{
            maxWidth: 210, 
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {row.teste}
          </TableCellBorder>
          <TableCellBorder style={{
            maxWidth: 180, 
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {row.manual}
          </TableCellBorder>
          <TableCellBorder align="center">
            {(row.file || row.manual) &&
              <button onClick={() => {downloadFile(row)}}>
                <Download size={23} color={"#20423D"} />
              </button>
            }
          </TableCellBorder>
          <TableCellBorder align="center">
            <button onClick={() => {
              row.disciplina != 'Leitura' ?
                generateHerbyCard(row.id, row?.teste)
                :
                generateEdlerCard(row.id, row?.teste)
              }}>
              <Download size={23} color={"#20423D"} />
            </button>
          </TableCellBorder>
        </TableRowStyled>
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
          <ButtonPadrao onClick={() => { generateZipFromCloud() }}>Baixar Todos</ButtonPadrao>
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
      {loading && 
        <>
          <Loading top={window.scrollY}>
            <ReactLoading type={"spin"} color={'#3e8277'} height={70} width={70} />
          </Loading>
        </>
      }
      <ModalConfirmacao
        show={showModalErrorEdler}
        onHide={() => {
          setShowModalErrorEdler(false);
        }}
        text={'Não foi possivel gerar o cartão desse teste'}
        status={false}
      />
    </Container>
  )
}
