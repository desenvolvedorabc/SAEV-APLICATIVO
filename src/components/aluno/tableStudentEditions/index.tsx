import * as React from "react";
import { useState, useEffect } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  Container,
  TableCellStyled,
  TableCellBorder,
  Pagination,
  FormSelectStyled,
  ButtonPage,
  TableRowStyled,
  TableSortLabelStyled,
  Title,
} from "./styledComponents";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { getStudentEvaluationHistory } from "src/services/alunos.service";

interface EnhancedTableProps {
  editions: any;
  subjects: string[];
  onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void;
  order: string;
  orderBy: string;
}


enum Niveis{
  fluente = 'Fluente',
  nao_fluente = 'Não Fluente',
  frases = 'Frases',
  palavras = 'Palavras',
  silabas = 'Sílabas',
  nao_leitor = 'Não Leitor',
  nao_avaliado = 'Não Avaliado',
  nao_informado = 'Não Informado',
}

function EnhancedTableHead({
  editions,
  subjects,
  order,
  orderBy,
  onRequestSort,
}: EnhancedTableProps) {
  const createSortHandler =
    (property: string) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  let headCells = [];

  if (editions) {
    headCells.push({
      id: "year",
      status: false,
      label: "ANO",
    });
    headCells.push({
      id: "AVA_EDICAO",
      status: false,
      label: "EDIÇÃO",
    });
    headCells.push({
      id: "AVA_SERIE",
      status: false,
      label: "SÉRIE",
    });
    subjects.forEach((subject) => {
      headCells.push({
        id: subject,
        status: false,
        label: subject.toUpperCase(),
      });
    });
  }

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCellStyled
            key={headCell.id}
            align={headCell.status ? "center" : "left"}
            padding={"normal"}
            sortDirection={
              headCell.label === "ANO" && orderBy === headCell.id
                ? order
                : false
            }
          >
            {headCell.label === "ANO" ? (
              <TableSortLabelStyled
                active={orderBy === headCell.id}
                direction={order === "asc" ? "desc" : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
              </TableSortLabelStyled>
            ) : (
              <div style={{ fontWeight: 600 }}>{headCell.label}</div>
            )}
          </TableCellStyled>
        ))}
      </TableRow>
    </TableHead>
  );
}

export function TableStudentEditions({ aluno }) {
  const [page, setPage] = useState(1);
  const [qntPage, setQntPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [disablePrev, setDisablePrev] = useState(true);
  const [disableNext, setDisableNext] = useState(false);
  const [listSort, setListOrder] = useState([]);
  const [order, setOrder] = useState("asc");
  const [selectedColumn, setSelectedColumn] = useState("year");
  const [school, setSchool] = useState(aluno?.ALU_ESC?.ESC_ID);
  const [history, setHistory] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const getSubjects = () => {
    let list = [];
    history?.forEach((edition) => {
      edition.subjects.forEach((subject) => {
        if (!list.includes(subject.name)) {
          list.push(subject.name);
        }
      });
    });
    setSubjects(list);
  };

  const loadInfos = async () => {
    let respHistory = await getStudentEvaluationHistory(
      aluno?.ALU_ID,
      page,
      limit,
      selectedColumn,
      order.toUpperCase(),
      school
    );
    setHistory(respHistory?.data?.items);
    setQntPage(respHistory?.data?.meta?.totalPages)
  };
  useEffect(() => {
    loadInfos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aluno, page, limit, selectedColumn, order, school]);

  useEffect(() => {
    getSubjects();
    history && setListOrder(history);
  }, [history]);

  useEffect(() => {
    setDisablePrev(page === 1 ? true : false);
    setDisableNext(page === qntPage ? true : false);
  }, [qntPage, page]);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: string
  ) => {
    const isAsc = order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setSelectedColumn(property);
  };

  const handleChangePage2 = (direction) => {
    if (direction === "prev") {
      setPage(page - 1);
    } else {
      setPage(page + 1);
    }
  };

  const handleChangeLimit = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(parseInt(event.target.value));
    setPage(1);
  };

  const handleSelectSchool = (e) => {
    setSchool(e.target.value);
  };

  return (
    <Container>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
        className="px-4"
      >
        <Title>Histórico de Avaliações</Title>
        <FormControl className="w-25" size="small">
          <InputLabel id="periodo">Período</InputLabel>
          <Select
            labelId="periodo"
            id="periodo"
            value={school}
            defaultValue={school}
            label="Período"
            onChange={handleSelectSchool}
          >
            <MenuItem value={aluno?.ALU_ESC?.ESC_ID}>Escola Atual</MenuItem>
            {aluno?.schoolClasses?.map((classe) => (
              <MenuItem key={classe} value={classe?.ESC_ID}>
                {classe.ESC_NOME}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
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
              <EnhancedTableHead
                order={order}
                subjects={subjects}
                onRequestSort={handleRequestSort}
                editions={history}
                orderBy={selectedColumn}
              />
              <TableBody>
                {history?.map((data) => (
                  <TableRowStyled
                    key={data.AVA_ID}
                    role="checkbox"
                    tabIndex={-1}
                  >
                    <TableCell component="th" scope="row" padding="normal">
                      {data.year}
                    </TableCell>
                    <TableCellBorder>{data.name}</TableCellBorder>
                    <TableCellBorder>{data.serie}</TableCellBorder>
                    {subjects.map((subject) => {
                      let findSubject = data.subjects?.find(
                        (dataSubject) => subject === dataSubject.name
                      );
                      return (
                        <>
                        {findSubject ?
                          <TableCellBorder key={subject}>
                            {`${
                              !!findSubject?.nivel ? Niveis[findSubject?.nivel] :
                              !!findSubject?.totalRightQuestions
                                ? findSubject?.totalRightQuestions + '%'
                                : '0%'
                            }`}
                          </TableCellBorder>
                          :
                          <TableCellBorder key={subject} color={"#D3D3D3"}>
                          </TableCellBorder>
                        }
                        </>
                      );
                    })}
                  </TableRowStyled>
                ))}
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
  );
}
