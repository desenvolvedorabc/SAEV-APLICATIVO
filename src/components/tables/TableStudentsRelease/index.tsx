import * as React from "react";
import { useState, useEffect, useMemo } from "react";
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
  InputSearch,
  IconSearch,
  TopContainer,
  TableCellBorder,
  Pagination,
  FormSelectStyled,
  ButtonPage,
  TableRowStyled,
  TableSortLabelStyled,
} from "./styledComponents";
import { MdNavigateNext, MdNavigateBefore, MdCheckCircleOutline } from "react-icons/md";
import { ItemEdition } from "src/services/lancamentos.service";
import CloseCircle from "public/assets/images/close-circle.svg";

const headCells = [
  {
    id: "name",
    status: false,
    label: "ALUNO",
  },
  {
    id: "id",
    status: false,
    label: "ID",
  },
  {
    id: "inep",
    status: false,
    label: "INEP",
  },
  // {
  //   id: "reading",
  //   status: false,
  //   label: "LEITURA",
  // },
  // {
  //   id: "portuguese",
  //   status: false,
  //   label: "PORTUGUÊS",
  // },
  // {
  //   id: "math",
  //   status: false,
  //   label: "MATEMÁTICA",
  // },
];

type TableEditionsProps = {
  item: ItemEdition;
  isPdf?: boolean;
  setSearch: (value: string) => void;
  loadData: (
    page: number,
    limit: number,
    order: string,
    selectedColumn: string
  ) => void;
};

interface EnhancedTableProps {
  item: ItemEdition;
  onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void;
  order: string;
  orderBy: string;
  subjects: {
    id: string;
    name: string;
    isRelease?: boolean;
  }[];
}

function EnhancedTableHead({
  item,
  order,
  orderBy,
  subjects,
  onRequestSort,
}: EnhancedTableProps) {
  const createSortHandler =
    (property: string) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  const _headCells = [
    ...headCells,

  ]

  subjects?.forEach((x: any) => {
    _headCells.push({
      id: x.id,
      status: false,
      label: x.name.toUpperCase(),
    });
  });

  _headCells.push({
    id: "general",
    status: true,
    label: "GERAL",
  })

  
  
  return (
    <TableHead>
      <TableRow>
        {_headCells?.map((headCell) => (
          <TableCellStyled
            key={headCell.id}
            align={headCell.status ? "center" : "left"}
            padding={"normal"}
            sortDirection={orderBy === headCell.id ? order : false}
            // style={{ width: headCell.width }}
          >
            <TableSortLabelStyled
              active={orderBy === headCell.id}
              direction={order === "ASC" ? "desc" : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
            </TableSortLabelStyled>
          </TableCellStyled>
        ))}
      </TableRow>
    </TableHead>
  );
}

export function TableStudentsRelease({ item, isPdf, setSearch, loadData }: TableEditionsProps) {
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState("ASC");
  const [selectedColumn, setSelectedColumn] = useState("name");
  const [limit, setLimit] = useState(item.meta.totalPerPage);
  const [disablePrev, setDisablePrev] = useState(true);
  const [disableNext, setDisableNext] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  
  
  const subjects = useMemo(() => {
    let subjects = item?.itens[0]?.subjects ? [...item?.itens[0].subjects] : [];

    item?.itens?.forEach((item) =>  {
      if(item?.subjects?.length) {
        subjects.push(...item.subjects)
      }
    })

    subjects = subjects.filter(function (a) {
      return (
        !this[JSON.stringify(a?.name)] &&
        (this[JSON.stringify(a?.name)] = true)
      );
    }, Object.create(null)).sort((a, b) => a.name.localeCompare(b.name)); 

    
    return subjects;
  }, [item.type, item]);

  const itemValues = useMemo(() => {
    return item;
  }, [item.type, item]);

  useEffect(() => {
    setDisablePrev(page === 1 ? true : false);
    setDisableNext(page === item.meta.totalPages ? true : false);
  }, [item, page]);

  const handleChangePage2 = (direction) => {
    if (direction === "prev") {
      setPage(page - 1);
      loadData(page - 1, limit, order, selectedColumn);
    } else {
      setPage(page + 1);
      loadData(page + 1, limit, order, selectedColumn);
    }
  };
  const handleChangeLimit = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(parseInt(event.target.value));
    setPage(1);
    loadData(1, Number(event.target.value), order, selectedColumn);
  };

  const handleChangeSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: string
  ) => {
    const isAsc = order === "DESC";
    setOrder(isAsc ? "ASC" : "DESC");
    setSelectedColumn(property);
    loadData(page, limit, isAsc ? "ASC" : "DESC", property);
  }


  const totalReduce = useMemo(() => {

    let releases = subjects?.map(subject => {
      let release = true;
      item.itens.forEach(student => {
        student.subjects.forEach(subjectStudent => {
          if(subjectStudent.name === subject.name){
            if(!subjectStudent.isRelease){
              release = false;
            }
          }
        })
      })
      return release;
    })

    let general = true;
    item.itens.forEach((student) => {
      if(!student.general){
        general = false;
      }
    })

    releases.push(general)

    return releases;
  }, [item.itens]);

  const getRelease = (student, subject) => {
    let release = false;
    student.subjects.forEach((x) => {
      if(x.name === subject){
        release = x.isRelease;
      }
    })
    return release;
  }

  return (
    <Container style={{ maxWidth: !isPdf ? "calc(100vw - 330px)'" : "100%" }}>
      {!isPdf && (
        <TopContainer>
          <div className="d-flex mb-2">
            <div className="d-flex mx-3 flex-row-reverse align-items-center">
              <InputSearch
                size={16}
                type="text"
                placeholder="Pesquise"
                name="searchTerm"
                onChange={handleChangeSearch}
              />
              <IconSearch size={24} color={"#7C7C7C"} />
            </div>
          </div>
        </TopContainer>
      )}

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
                onRequestSort={handleRequestSort}
                item={item}
                orderBy={selectedColumn}
                subjects={subjects}
              />

              <TableBody>
                {item.itens?.map((data) => (
                  <TableRowStyled key={data.id} role="checkbox" tabIndex={-1}>
                    <TableCell component="th" scope="row" padding="normal">
                      {data.name}
                    </TableCell>
                    <TableCellBorder>{data.id}</TableCellBorder>
                    <TableCellBorder>{data.inep}</TableCellBorder>
                    {subjects?.map((subject) => (
                      <TableCellBorder key={data.id + subject.id} align="center">
                        {getRelease(data, subject.name) ?  
                          <MdCheckCircleOutline color={"#007F00"} size={21} />
                          :
                          <CloseCircle />
                        }
                      </TableCellBorder>
                    )) }
                    <TableCellBorder align="center">{data.general ? 
                      <MdCheckCircleOutline color={"#007F00"} size={21} />
                      :
                      <CloseCircle />
                      }
                    </TableCellBorder>
                  </TableRowStyled>
                ))}

                {/* <TableRowStyled className="total" role="checkbox" tabIndex={-1}>
                  <TableCell component="th" scope="row" padding="normal">
                    Total/Média
                  </TableCell>
                  <TableCellBorder align="center">-</TableCellBorder>
                  <TableCellBorder align="center">-</TableCellBorder>
                  {totalReduce.map((x, index) => 
                    <TableCellBorder key={index} align="center">
                      {
                        x ?  
                        <MdCheckCircleOutline color={"#007F00"} size={21} />
                        :
                        <CloseCircle />
                      }
                    </TableCellBorder>
                  )}
                </TableRowStyled> */}
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
            <ButtonPage  onClick={() => handleChangePage2("prev")} disabled={disablePrev}>
              <MdNavigateBefore size={24} />
            </ButtonPage>
            <ButtonPage onClick={() => handleChangePage2("next")} disabled={disableNext}>
              <MdNavigateNext size={24} />
            </ButtonPage>
          </Pagination>
        </Paper>
      </Box>
    </Container>
  );
}
