import React, { useState, useEffect } from 'react'
import { DataGrid, GridToolbarContainer, GridToolbarExport, ptBR } from '@mui/x-data-grid'
import { getAllSubPerfis } from 'src/services/sub-perfis.service'
import { Container, Marker, InputSearch, IconSearch, TopContainer } from './styledComponents'
import { MdOutlineFilterAlt } from 'react-icons/md'
import {ButtonPadrao} from 'src/components/buttons/buttonPadrao';

import { Box, Paper } from '@mui/material'
import Router from 'next/router'

const columns = [
  { field: 'SPE_ID', headerName: 'SPE_ID', hide: true },
  { field: 'PER_NOME', headerName: 'PERFIL BASE', width: 300 },
  { field: 'SPE_NOME', headerName: 'SUB-PERFIL', width: 300 },
  { field: 'AREAS', headerName: 'ÁREAS HABILITADAS', width: 300 },
]

const TablePerfilv2 = () => {

  const [tableData, setTableData] = useState([])
  const [pageSize, setPageSize] = React.useState<number>(5);


  useEffect(() => {
    loadAll()
  }, [])

  async function loadAll() {
    const respSubPerfis = await getAllSubPerfis()
    let list = []
    respSubPerfis.data.map(x => {
      x.AREAS = Array.from(x.AREAS.values(), v => v['ARE_DESCRICAO']).join(", ")
      list.push(createData(x.SPE_ID, x.SPE_NOME, x.SPE_PER?.PER_NOME, x.AREAS))
    })
    setTableData(list)
  }

  interface Data {
    SPE_ID: string
    SPE_NOME: string
    PER_NOME: string
    AREAS: string
  }

  function createData(
    SPE_ID: string,
    SPE_NOME: string,
    PER_NOME: string,
    AREAS: string
  ): Data {
    return {
      SPE_ID,
      SPE_NOME,
      PER_NOME,
      AREAS
    }
  }

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }

  return (
    <Container>
      <TopContainer>
        <div className="d-flex">
          <Marker onClick>
            <MdOutlineFilterAlt color="#FFF" size={24} />
          </Marker>
          <div className="d-flex flex-row-reverse align-items-center ">
            <InputSearch size={16} type="text" placeholder="Pesquise" name="searchTerm"
              onChange
            />
            <IconSearch color={'#7C7C7C'} />
          </div>
        </div>
        <div >
          <ButtonPadrao onClick={() => { Router.push("/perfil") }}>Adicionar Sub-Perfil</ButtonPadrao>
        </div>
      </TopContainer>
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '100%', mb: 2, borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px' }}>

          <div style={{ height: 400, width: '100%' }}>
            <DataGrid
              getRowId={(row) => row.SPE_ID}
              disableColumnMenu={true}
              rows={tableData}
              columns={columns}
              pageSize={pageSize}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              rowsPerPageOptions={[5, 10, 20]}
              components={{
                Toolbar: CustomToolbar,
              }}
              pagination
              localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
            />
          </div>
        </Paper>
      </Box>
    </Container>
  )
}

export default TablePerfilv2
