import * as React from "react";
import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { TablePagination } from "@mui/material";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import { ptBR } from "@material-ui/core/locale";

export default function TableList({
  columns,
  rows,
  selectionTable,
  setSelectionTable,
}) {
  const theme = createTheme(ptBR);

  const [currentPage, setCurrentPage] = useState(0);
  const [perPage, setPerPage] = useState(5);

  const handleChangePage = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleChangePerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  const CustomPagination = () => {
    return (
        <TablePagination
            count={rows.length}
            page={currentPage}
            onPageChange={(event, value) =>{handleChangePage(value)}}
            rowsPerPage={perPage}
            onRowsPerPageChange={handleChangePerPage}
            rowsPerPageOptions={[5, 10, 25]}
            labelRowsPerPage={"Linhas por página"}
            sx={{
              color: "#68936A",
            }}

        />
    );
  }

  return (
    <div style={{ height: 400, width: "100%" }}>
      <ThemeProvider theme={theme}>
        {/* <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          disableSelectionOnClick
          experimentalFeatures={{ newEditingApi: true }}
        /> */}
        <DataGrid
          disableColumnMenu
          onSelectionModelChange={(newSelectionTable) => {
            setSelectionTable(newSelectionTable);
          }}
          pageSize={perPage}
          hideFooterSelectedRowCount={true}
          selectionModel={selectionTable}
          page={currentPage}
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#E0F1E0",
              color: "#68936A",
            },
            "& .MuiPaginationItem-root": {
              backgroundColor: "#E0F1E0",
              color: "#68936A",
            },
            "& .header": {
              width: "200px",
            },
            "& .MuiDataGrid-footerContainer": {
              backgroundColor: "#E0F1E0",
              color: "#68936A",
            },
            "& .MuiTablePagination-selectLabel": {
              margin: 0,
            },
            "& .MuiTablePagination-displayedRows": {
              display: "none",
            },
          }}
          rows={rows}
          columns={columns}
          checkboxSelection


          components={{
            Pagination: CustomPagination,
            NoRowsOverlay: () => (
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                Não há linhas
              </div>
            ),
          }}
        />
      </ThemeProvider>
    </div>
  );
}
