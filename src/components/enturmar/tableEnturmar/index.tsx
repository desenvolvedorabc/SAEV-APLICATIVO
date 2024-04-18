import {
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import { getStudentsGrouping } from "src/services/alunos.service";
import {
  ButtonPage,
  FormSelectStyled,
  IconSearch,
  InputSearch,
  TableCellBorder,
  TableCellStyled,
  TableRowStyled,
  TableSortLabelStyled,
} from "src/shared/styledTables";
import {
  Text,
  TopContainer,
  Pagination,
  Container,
  Status,
} from "./styledComponents";
import { visuallyHidden } from "@mui/utils";
import {
  MdNavigateBefore,
  MdNavigateNext,
  MdOutlineGroupAdd,
} from "react-icons/md";
import { useGetSeries } from "src/services/series.service";
import ButtonWhite from "src/components/buttons/buttonWhite";
import { ModalEnturmar } from "src/components/enturmar/modalEnturmar";
import { ButtonPadrao } from "src/components/buttons/buttonPadrao";
import useDebounce from "src/utils/use-debounce";

interface Data {
  ALU_ID: string;
  ALU_INEP: string;
  ALU_NOME: string;
  SER_NOME: string;
  TUR_NOME: string;
  ALU_STATUS: string;
}

function createData(
  ALU_ID: string,
  ALU_INEP: string,
  ALU_NOME: string,
  SER_NOME: string,
  TUR_NOME: string,
  ALU_STATUS: string
): Data {
  return {
    ALU_ID,
    ALU_INEP,
    ALU_NOME,
    SER_NOME,
    TUR_NOME,
    ALU_STATUS,
  };
}

interface HeadCell {
  id: keyof Data;
  label: string;
  status: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "ALU_ID",
    status: false,
    label: "CÓD",
  },
  {
    id: "ALU_INEP",
    status: false,
    label: "NÚM. INEP",
  },
  {
    id: "ALU_NOME",
    status: false,
    label: "ALUNO",
  },
  {
    id: "SER_NOME",
    status: false,
    label: "SÉRIE",
  },
  {
    id: "TUR_NOME",
    status: false,
    label: "TURMA",
  },
  {
    id: "ALU_STATUS",
    status: true,
    label: "STATUS",
  },
];

interface EnhancedTableProps {
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => void;
  order: string;
  orderBy: string;
  rowCount: number;
  handleSelectAll: any;
  allSelected: boolean;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort, handleSelectAll, allSelected } = props;
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        <TableCellStyled key={"select"} align={"center"} padding={"normal"}>
          <Checkbox
            checked={allSelected}
            onChange={(e) => handleSelectAll(e)}
          />
        </TableCellStyled>
        {headCells.map((headCell) => (
          <TableCellStyled
            key={headCell.id}
            align={headCell.status ? "center" : "left"}
            padding={"normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabelStyled
              active={orderBy === headCell.id}
              direction={order === "asc" ? "desc" : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabelStyled>
          </TableCellStyled>
        ))}
        <TableCellStyled key={"select"} align={"center"} padding={"normal"}>
          <strong>AÇÃO</strong>
        </TableCellStyled>
      </TableRow>
    </TableHead>
  );
}

export function TableEnturmar({ mun, school, status }) {
  const [listStudents, setListStudents] = useState([]);
  const [serie, setSerie] = useState(null);
  const [search, setSearch] = useState(null);
  const [searchTerm, setSearchTerm] = useState(null);
  const [page, setPage] = useState(1);
  const [qntPage, setQntPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [order, setOrder] = useState("ASC");
  const [orderBy, setOrderBy] = useState("ALU_NOME");
  const [disablePrev, setDisablePrev] = useState(true);
  const [disableNext, setDisableNext] = useState(false);
  const [reload, setReload] = useState(false);
  const [rows, setRows] = useState([]);
  const [allSelected, setAllSelected] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [showEnturmarModal, setShowEnturmarModal] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [studentsNotGrouped, setStudentsNotGrouped] = useState(0);
  const [resetModal, setResetModal] = useState(false);

  const handleChangeSerie = (e: SelectChangeEvent<any>) => {
    setSerie(e.target.value);
  };

  const { data: dataSerie } = useGetSeries(
    null, 
    1, 
    9999, 
    null, 
    "ASC", 
    school?.ESC_ID, 
    '1',
  );

  const handleRequestSort = (
    _event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    loadStudents(
      search,
      page,
      limit,
      property,
      order,
      mun?.MUN_ID,
      school?.ESC_ID,
      status,
      serie?.SER_ID,
      true
    );
  };

  useEffect(() => {
    setDisablePrev(page === 1 ? true : false);
    setDisableNext(page === qntPage ? true : false);
  }, [qntPage, page]);

  const handleChangePage2 = (direction) => {
    setAllSelected(false);
    if (direction === "prev") {
      setPage(page - 1);
      loadStudents(
        search,
        page - 1,
        limit,
        orderBy,
        order,
        mun?.MUN_ID,
        school?.ESC_ID,
        status,
        serie?.SER_ID,
        true
      );
    } else {
      setPage(page + 1);
      loadStudents(
        search,
        page + 1,
        limit,
        orderBy,
        order,
        mun?.MUN_ID,
        school?.ESC_ID,
        status,
        serie?.SER_ID,
        true
      );
    }
  };
  const handleChangeLimit = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(parseInt(event.target.value));
    setPage(1);
    loadStudents(
      search,
      1,
      Number(event.target.value),
      orderBy,
      order,
      mun?.MUN_ID,
      school?.ESC_ID,
      status,
      serie?.SER_ID,
      true
    );
  };

  const loadStudents = async (
    _search: string,
    _page: number,
    _limit: number,
    _orderBy: string,
    _order: string,
    _mun: string,
    _school: string,
    _status: string,
    _serie: string,
    _active: boolean,
  ) => {
    if (mun?.MUN_ID && school?.ESC_ID) {
      const resp = await getStudentsGrouping(
        _search,
        _page,
        _limit,
        _orderBy,
        _order.toUpperCase(),
        _mun,
        _school,
        _status,
        _serie,
        '1'
      );
      setListStudents(resp.data.items);
      const inicio = resp?.data.links?.last.search("=");
      const fim = resp?.data.links?.last.search("&");
      setQntPage(parseInt(resp.data.links?.last.substring(inicio + 1, fim)));
      setStudentsNotGrouped(resp.data.totalNotGrouped);

      let list = [];
      resp.data.items?.map((x) => {
        list.push(
          createData(
            x.ALU_ID,
            x.ALU_INEP,
            x.ALU_NOME,
            x.SER_NOME,
            x.TUR_NOME,
            x.ALU_STATUS
          )
        );
      });
      setRows(list);
    }
  };

  useEffect(() => {
    loadStudents(
      search,
      page,
      limit,
      orderBy,
      order,
      mun?.MUN_ID,
      school?.ESC_ID,
      status,
      serie?.SER_ID,
      true,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page, limit, orderBy, order, mun, school, status, serie, reload]);

  useEffect(() => {
    setSelectedStudents([]);
    setAllSelected(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mun, school, status]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      setSearch(debouncedSearchTerm);
    } else setSearch("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm]);

  const handleChangeSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectAll = () => {
    if (allSelected) {
      let list = [];
      setSelectedStudents([...list]);
      setAllSelected(!allSelected);
    } else {
      let list = [...selectedStudents];
      rows.forEach((student) => {
        // if(!selectedStudents.includes(student)){
        if (
          selectedStudents.filter(
            (selected) => selected.ALU_ID === student.ALU_ID
          ).length === 0
        ) {
          list.push(student);
        }
      });
      setSelectedStudents(list);
      setAllSelected(!allSelected);
    }
  };

  const handleSelectStudent = (student) => {
    if (selectedStudents.includes(student)) {
      setSelectedStudents([
        ...selectedStudents.filter((x) => x.ALU_ID != student.ALU_ID),
      ]);
      setAllSelected(false);
    } else {
      setSelectedStudents([...selectedStudents, student]);
    }
  };

  const getIsSelected = (student) => {
    return (
      selectedStudents.filter((x) => x.ALU_ID === student.ALU_ID).length > 0
    );
  };

  const openModalEnturmar = (student) => {
    setShowEnturmarModal(true);
    let list = [];
    list.push(student);
    setSelectedStudents(list);
  };

  const changeReload = () => {
    setReload(!reload);
  };

  return (
    <Container>
      <TopContainer>
        <Text>{`${mun ? mun?.MUN_NOME + "," : ""} ${
          school ? school?.ESC_NOME + "," : ""
        } ${
          serie ? serie?.SER_NOME + " " : ""
        } (${studentsNotGrouped} Alunos Não Enturmados)`}</Text>
        <div className="d-flex justify-content-between mt-3 mb-3">
          <div className="d-flex ms-2">
            <div className="d-flex flex-row-reverse align-items-center ">
              <InputSearch
                size={16}
                type="text"
                placeholder="Pesquise"
                name="searchTerm"
                onChange={handleChangeSearch}
              />
              <IconSearch color={"#7C7C7C"} />
            </div>
            <FormControl sx={{ width: 186, marginLeft: "20px" }} size="small">
              <InputLabel id="serie">Série</InputLabel>
              <Select
                labelId="serie"
                id="serie"
                value={serie}
                label="Série"
                onChange={(e) => handleChangeSerie(e)}
                disabled={!school}
              >
                <MenuItem value={null}>
                  <em>Série</em>
                </MenuItem>
                {dataSerie?.items?.map((x) => (
                  <MenuItem key={x} value={x}>
                    {x.SER_NOME}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="d-flex">
            <div style={{ width: 162, marginRight: "10px" }}>
              <ButtonWhite
                onClick={() => {
                  setSelectedStudents([]);
                  setAllSelected(false);
                }}
              >
                Limpar Seleção
              </ButtonWhite>
            </div>
            <div style={{ width: 182 }}>
              <ButtonPadrao
                onClick={() => {
                  setShowEnturmarModal(true);
                }}
                disable={selectedStudents.length === 0}
              >
                Enturmar Alunos
              </ButtonPadrao>
            </div>
          </div>
        </div>
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
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
                handleSelectAll={handleSelectAll}
                allSelected={allSelected}
              />

              <TableBody>
                {rows.length > 0 &&
                  rows.map((row, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <>
                        <TableRowStyled
                          role="checkbox"
                          tabIndex={-1}
                          key={index}
                        >
                          <TableCell
                            component="th"
                            id={"select"}
                            scope="row"
                            padding="normal"
                          >
                            <Checkbox
                              checked={getIsSelected(row)}
                              onChange={() => handleSelectStudent(row)}
                            />
                          </TableCell>
                          <TableCellBorder
                            component="th"
                            id={labelId}
                            scope="row"
                            padding="normal"
                          >
                            {row.ALU_ID}
                          </TableCellBorder>
                          <TableCellBorder>{row.ALU_INEP}</TableCellBorder>
                          <TableCellBorder>{row.ALU_NOME}</TableCellBorder>
                          <TableCellBorder>{row.SER_NOME}</TableCellBorder>
                          <TableCellBorder>{row.TUR_NOME}</TableCellBorder>
                          <TableCellBorder>
                            <Status status={row.ALU_STATUS}>
                              {row.ALU_STATUS}
                            </Status>
                          </TableCellBorder>
                          <TableCellBorder align="center">
                            <button>
                              <MdOutlineGroupAdd
                                size={20}
                                onClick={() => {
                                  openModalEnturmar(row);
                                }}
                              />
                            </button>
                          </TableCellBorder>
                        </TableRowStyled>
                      </>
                    );
                  })}
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
      {showEnturmarModal &&
        <ModalEnturmar
          show={showEnturmarModal}
          onHide={() => {
            setShowEnturmarModal(false);
            setResetModal(!resetModal);
          }}
          listSelected={selectedStudents}
          school={school}
          serie={serie}
          changeReload={changeReload}
          reset={resetModal}
        />
      }
    </Container>
  );
}
