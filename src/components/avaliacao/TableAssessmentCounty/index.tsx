import * as React from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Autocomplete, TextField } from "@mui/material";
import {
  Container,
  TableCellBorder,
  Pagination,
  FormSelectStyled,
  ButtonPage,
  TableCellStyled,
  TableRowStyled,
  TopContainer,
  FilterContainer,
} from "./styledComponents";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import Link from "next/link";
import { useTableAssessmentForCounty } from "./useTableAssessmentForCounty";

const headCells = [
  {
    id: "AVA_ANO",
    status: false,
    label: "ANO",
  },
  {
    id: "AVA_NOME",
    status: false,
    label: "EDIÇÃO",
  },
];

function EnhancedTableHead() {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCellStyled
            key={headCell.id}
            align={headCell.status ? "center" : "left"}
            padding={"normal"}
          >
            {headCell.label}
          </TableCellStyled>
        ))}
      </TableRow>
    </TableHead>
  );
}

export function TableAssessmentCounty() {
  const {
    disableNext,
    disablePrev,
    handleChangeLimit,
    handleChangePage2,
    rows,
    limit,
    selectedYear,
    handleChangeYear,
    dataYears,
    isLoading,
  } = useTableAssessmentForCounty();

  const setRow = (row, index) => {
    const labelId = `enhanced-table-checkbox-${index}`;
    return (
      <Link href={`/edicao/municipio/${row.AVA_ID}`} key={row.AVA_ID} passHref>
        <TableRowStyled role="checkbox" tabIndex={-1}>
          <TableCell component="th" id={labelId} scope="row" padding="normal">
            {row.AVA_ANO}
          </TableCell>
          <TableCellBorder>{row.AVA_NOME}</TableCellBorder>
        </TableRowStyled>
      </Link>
    );
  };

  return (
    <>
      <Container>
        <TopContainer>
          <FilterContainer>
            <Autocomplete
              id="year-filter"
              size="small"
              value={selectedYear}
              noOptionsText="Nenhum ano encontrado"
              options={dataYears?.items || []}
              getOptionLabel={(option) => `${option.ANO_NOME}`}
              onChange={(_event, newValue) => {
                handleChangeYear(newValue);
              }}
              sx={{
                background: "#fff",
                width: 200,
              }}
              renderInput={(params) => (
                <TextField
                  size="small"
                  {...params}
                  label="Ano Letivo"
                  placeholder="Selecione o ano"
                />
              )}
              renderOption={(props, option) => (
                <li {...props} key={option.ANO_ID}>
                  {option.ANO_NOME}
                </li>
              )}
            />
          </FilterContainer>
        </TopContainer>
        <Box sx={{ width: "100%" }}>
          <Paper
            sx={{
              width: "100%",
              mb: 2,
              borderBottomLeftRadius: "10px",
              borderBottomRightRadius: "10px",
            }}
          >
            <TableContainer>
              <Table
                sx={{ minWidth: 750 }}
                aria-labelledby="tableTitle"
                size={"medium"}
              >
                <EnhancedTableHead />
                <TableBody>
                  {isLoading && selectedYear ? (
                    <TableRow>
                      <TableCell colSpan={2} align="center">
                        Carregando...
                      </TableCell>
                    </TableRow>
                  ) : rows.length > 0 ? (
                    rows.map((row, index) => {
                      return setRow(row, index);
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={2} align="center">
                        {selectedYear
                          ? "Nenhuma edição encontrada para o ano selecionado"
                          : "Selecione um ano letivo para visualizar as edições municipais"}
                      </TableCell>
                    </TableRow>
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
              <ButtonPage
                onClick={() => handleChangePage2("prev")}
                disabled={disablePrev}
              >
                <MdNavigateBefore size={24} />
              </ButtonPage>
              <ButtonPage
                onClick={() => handleChangePage2("next")}
                disabled={disableNext}
              >
                <MdNavigateNext size={24} />
              </ButtonPage>
            </Pagination>
          </Paper>
        </Box>
      </Container>
    </>
  );
}
