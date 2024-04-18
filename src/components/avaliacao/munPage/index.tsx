import { Form } from "react-bootstrap";
import { ButtonPadrao } from "src/components/buttons/buttonPadrao";
import ErrorText from "src/components/ErrorText";
import { isEqual, isFuture, isPast } from "date-fns";
import TableList from "../tableList";
import {
  AddSide,
  AvailableSide,
  Card,
  FormCheck,
  FormCheckLabel,
  List,
  ListOverflow,
  Title,
  Status,
  Circle,
  Text,
  MdSearchStyled,
  Pesquisar,
} from "./styledComponents";
import { GridColDef, GridSelectionModel } from "@mui/x-data-grid";
import { useState, useEffect, useRef } from "react";
import { loadUf } from "src/utils/combos";
import {
  findAllDistricts,
  findDistricts,
  getAllCounties,
} from "src/services/municipios.service";
import { DatePicker, LocalizationProvider } from "@mui/lab";
import { TextField } from "@mui/material";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import brLocale from "date-fns/locale/pt-BR";
import { isValidDate } from "src/utils/validate";
import ButtonWhite from "src/components/buttons/buttonWhite";
import { format } from "date-fns";
import ModalAlterarPeriodo from "../modalAlterarPeriodo";
import useDebounce from "src/utils/use-debounce";

export default function MunPage({
  listMunAdd,
  changeListMunAdd,
  listSelected,
}) {
  const [search, setSearch] = useState(null);
  const [searchMunAdd, setSearchMunAdd] = useState(null);
  const [selectAllActive, setselectAllActive] = useState(false);
  const [listMunAvailable, setListMunAvailable] = useState([]);
  const [listMunAvailableFilter, setListMunAvailableFilter] = useState([]);
  const [mySelected, setMySelected] = useState([]);
  const [listUf, setListUf] = useState([]);
  const [listAllUf, setListAllUf] = useState([]);
  const [listMun, setListMun] = useState([]);
  const [uf, setUf] = useState("");
  const [lancInicio, setLancInicio] = useState(null);
  const [errorLancInicio, setErrorLancInicio] = useState(true);
  const [errorLancInicioText, setErrorLancInicioText] = useState("");
  const [lancFim, setLancFim] = useState(null);
  const [errorLancFimText, setErrorLancFimText] = useState("");
  const [errorLancFim, setErrorLancFim] = useState(true);
  const [disp, setDisp] = useState(null);
  const [errorDisp, setErrorDisp] = useState(true);
  const [errorDispText, setErrorDispText] = useState("");
  const [selectionTable, setSelectionTable] = useState<GridSelectionModel>([]);
  const [modalShow, setModalShow] = useState(false);
  const [filteredMunList, setFilteredMunList] = useState(listMunAdd)

  useEffect(() => {
    if(searchMunAdd){
      setFilteredMunList(listMunAdd.filter(x => x.AVM_MUN_NOME.toUpperCase().includes(searchMunAdd.toUpperCase())))
    }
    else
      setFilteredMunList(listMunAdd)
  },[listMunAdd, searchMunAdd])

  const munCol: GridColDef[] = [
    {
      field: "AVM_MUN_NOME",
      headerName: "MUNICÍPIO",
      headerClassName: "header",
      flex: 1,
    },
    {
      field: "AVM_DT_DISPONIVEL",
      headerName: "DISPONÍVEL",
      renderCell: (cellValues) => {
        return (
          <div>
            {format(new Date(cellValues?.row?.AVM_DT_DISPONIVEL), "dd/MM/yyyy")}
          </div>
        );
      },
    },
    {
      field: "lancamento",
      headerName: "PERÍODO DE LANÇAMENTO",
      width: 220,
      renderCell: (cellValues) => {
        return (
          <div>
            {format(new Date(cellValues?.row?.AVM_DT_INICIO), "dd/MM/yyyy")} a{" "}
            {format(new Date(cellValues?.row?.AVM_DT_FIM), "dd/MM/yyyy")}
          </div>
        );
      },
    },
    {
      field: "status",
      headerName: "STATUS",
      renderCell: (cellValues) => {
        const isVerifyData =
          isEqual(new Date(new Date().toDateString()), new Date(new Date(cellValues?.row?.AVM_DT_INICIO).toDateString())) ||
          isEqual(new Date(new Date().toDateString()), new Date(new Date(cellValues?.row?.AVM_DT_FIM).toDateString())) ? false :
          isPast(
            new Date(new Date(cellValues?.row?.AVM_DT_FIM).toDateString())
          ) ||
          isFuture(
            new Date(new Date(cellValues?.row?.AVM_DT_INICIO).toDateString())
          )

        return (
          <Status>
            <Circle
              style={{
                backgroundColor: `${isVerifyData ? "red" : "4a4aff"}`,
              }}
            />
            <Text
              style={{
                color: `${isVerifyData ? "red" : "4a4aff"}`,
              }}
            >
              {isVerifyData ? "Fechado" : "Aberto"}
            </Text>
          </Status>
        );
      },
    },
  ];

  useEffect(() => {
    async function fetchAPI() {
      setListAllUf(await loadUf());
    }
    fetchAPI();
  }, []);

  const handleChangeSelect = (id) => {
    if (mySelected.some((x) => x == id)) {
      setMySelected([...mySelected.filter((x) => x !== id)]);
    } else {
      setMySelected([...mySelected, id]);
    }
  };

  async function searchCharacters(search) {
    setListMunAvailableFilter(
      listMunAvailable.filter((x) =>
        x.MUN_NOME.toUpperCase().includes(search.toUpperCase())
      )
    );
  }

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    if (debouncedSearch) {
      setListMunAvailableFilter(listMunAvailable);
      searchCharacters(debouncedSearch);
    } else {
      setListMunAvailableFilter(listMunAvailable);
    }
  }, [debouncedSearch]);

  const handleChangeSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleChangeSearchMunAdd = (e) => {
    setSearchMunAdd(e.target.value);
  };

  const handleSelectAll = () => {
    if (!selectAllActive) {
      let list = [];
      listMunAvailable.map((x) => {
        list.push(x.MUN_ID);
      });
      setMySelected([...list]);
      setselectAllActive(!selectAllActive);
    } else {
      setMySelected([]);
      setselectAllActive(!selectAllActive);
    }
  };

  const verifyMySelected = (id) => {
    return mySelected.find((item) => {
      return id === item;
    });
  };

  async function loadComboUfs() {
    const respUfs = await findAllDistricts();

    let list = [];
    respUfs.data.map((obj) => {
      listAllUf.map((obj2) => {
        if (obj.MUN_UF === obj2.sigla) {
          if (!list.includes(obj2)) {
            list.push(obj2);
          }
        }
      });
    });
    setListUf(list.sort((a, b) => a.sigla.localeCompare(b.sigla)));
  }

  const handleAddList = () => {
    let listId = listMunAvailable.filter((x) => mySelected.includes(x.MUN_ID));
    let list = [];
    listId.map((x) => {
      list.push({
        id: x.MUN_ID,
        AVM_MUN_ID: x.MUN_ID,
        AVM_MUN_NOME: x.MUN_NOME,
        AVM_DT_INICIO: lancInicio,
        AVM_DT_FIM: lancFim,
        AVM_DT_DISPONIVEL: disp,
        AVM_ATIVO: 1,
      });
    });
    list = listMunAdd.concat(list);
    setListMunAvailable(
      listMunAvailable.filter((x) => !mySelected.includes(x.MUN_ID))
    );
    setListMunAvailableFilter(
      listMunAvailableFilter.filter((x) => !mySelected.includes(x.MUN_ID))
    );
    changeListMunAdd(list);
    setMySelected([]);
  };

  const handleDelete = (event) => {
    let list = listMun.filter((x) => selectionTable.includes(x.MUN_ID));
    setListMunAvailable(listMunAvailable.concat(list));
    let listFiltered = listMunAdd.filter(function (obj) {
      return !list.some(function (obj2) {
        return obj.AVM_MUN_ID === obj2.MUN_ID;
      });
    });
    changeListMunAdd(listFiltered);
    setListMunAvailableFilter(listMunAvailableFilter.concat(list));
    setListMunAvailable(listMunAvailable.concat(list));
  };

  const openModalPeriodo = () => {
    setModalShow(true);
  };

  const handleChangePeriodo = (selectedList, disp, lancInicio, lancFim) => {
    listMunAdd.map(function (obj) {
      selectedList.some(function (obj2) {
        if (obj.AVM_MUN_ID === obj2.AVM_MUN_ID) {
          obj2.AVM_DT_DISPONIVEL = disp;
          obj.AVM_DT_FIM = lancFim;
          obj.AVM_DT_INICIO = lancInicio;
        }
      });
    });
  };

  async function loadMun(uf: string) {
    let respMunicipios;
    if (uf === "") {
      respMunicipios = await getAllCounties();
    } else {
      respMunicipios = await findDistricts(uf);
    }

    setListMun(respMunicipios.data);

    if (listMunAdd && listMunAdd.length > 0) {
      let listFiltered = respMunicipios.data.filter(function (obj) {
        return !listMunAdd.some(function (obj2) {
          return obj.MUN_ID === obj2.AVM_MUN_ID;
        });
      });
      setListMunAvailable(listFiltered);
      setListMunAvailableFilter(listFiltered);
    } else {
      setListMunAvailable(respMunicipios.data);
      setListMunAvailableFilter(respMunicipios.data);
    }
  }

  useEffect(() => {
    loadComboUfs();
    loadMun("")
  }, [listAllUf]);

  const handleChangeUf = async (e) => {
    setUf(e.target.value);
    await loadMun(e.target.value);
  };

  function onKeyDown(keyEvent) {
    if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
      keyEvent.preventDefault();
    }
  }

  return (
    <>
      <Card className="col-12 d-flex">
        <AvailableSide className="col-3">
          <div className="p-3">
            <Title>Municípios Disponíveis</Title>
            <div>
              <Form.Select
                name="uf"
                value={uf}
                onChange={(e) => handleChangeUf(e)}
              >
                <option value="">Estado</option>
                {listUf.map((item, index) => (
                  <option key={index} value={item.sigla}>
                    {item.sigla} - {item.nome}
                  </option>
                ))}
              </Form.Select>
            </div>
            <div className="col mt-2">
              <TextField
                fullWidth
                label="Buscar"
                name="search"
                id="search"
                value={search}
                onChange={handleChangeSearch}
                onKeyDown={onKeyDown}
                onDragEnter={(e) => e.preventDefault()}
                onSubmit={(e) => e.preventDefault()}
                size="small"
                sx={{
                  backgroundColor: "#FFF",
                }}
              />
            </div>
          </div>
          <List>
            {!!listMunAvailableFilter?.length && (
              <>
                <FormCheck key={"all"} id={"all"} className="">
                  <Form.Check.Input
                    onChange={handleSelectAll}
                    value={"all"}
                    name="AREAS"
                    type={"checkbox"}
                    checked={selectAllActive}
                  />
                  <FormCheckLabel>
                    <div>Selecionar Todos</div>
                  </FormCheckLabel>
                </FormCheck>
              </>
            )}
            <ListOverflow>
              {listMunAvailableFilter.map((x) => {
                return (
                  <FormCheck key={x.MUN_ID} id={x.MUN_ID} className="">
                    <Form.Check.Input
                      onChange={() => handleChangeSelect(x.MUN_ID)}
                      value={x.MUN_ID}
                      name="mySelected"
                      type={"checkbox"}
                      checked={verifyMySelected(x.MUN_ID)}
                    />
                    <FormCheckLabel>
                      <div>{x.MUN_NOME}</div>
                    </FormCheckLabel>
                  </FormCheck>
                );
              })}
            </ListOverflow>
          </List>
          <div className="p-3">
            <div className="">
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                locale={brLocale}
              >
                <DatePicker
                  openTo="year"
                  views={["year", "month", "day"]}
                  label="Disponível Em:"
                  value={disp}
                  minDate={new Date()}
                  onError={(error) => {
                    if (error === "invalidDate") {
                      setErrorDispText("Data inválida");
                      setErrorDisp(true);
                      return;
                    }
                    if (error === "minDate") {
                      setErrorDispText("Data inferior à atual");
                      setErrorDisp(true);
                      return;
                    }
                    if (!error) {
                      setErrorDispText("");
                      setErrorDisp(false);
                    }
                  }}
                  onChange={(val) => {
                    setErrorDisp(false);
                    if (isValidDate(val)) {
                      val = format(new Date(val), "yyyy-MM-dd 23:59:59");
                      setDisp(val);
                      return;
                    }
                    setDisp("");
                  }}
                  renderInput={(params) => (
                    <TextField
                      size="small"
                      {...params}
                      sx={{ backgroundColor: "#FFF" }}
                    />
                  )}
                />
              </LocalizationProvider>
              {errorDispText ? <ErrorText>{errorDispText}</ErrorText> : null}
            </div>
            <div className="py-2">
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                locale={brLocale}
              >
                <DatePicker
                  openTo="year"
                  views={["year", "month", "day"]}
                  label="Lançamento Início:"
                  value={lancInicio}
                  minDate={new Date(disp)}
                  onError={(error) => {
                    if (error === "invalidDate") {
                      setErrorLancInicioText("Data inválida");
                      setErrorLancInicio(true);
                      return;
                    }
                    if (error === "minDate") {
                      setErrorLancInicioText("Data inferior à disponibilidade");
                      setErrorLancInicio(true);
                      return;
                    }
                    if (!error) {
                      setErrorLancInicioText("");
                      setErrorLancInicio(false);
                    }
                  }}
                  onChange={(val) => {
                    setErrorLancInicio(false);
                    if (isValidDate(val)) {
                      val = format(new Date(val), "yyyy-MM-dd 23:59:59");
                      setLancInicio(val);
                      return;
                    }
                    setLancInicio("");
                    setErrorLancInicioText("Data inválida");
                    setErrorLancInicio(true);
                  }}
                  renderInput={(params) => (
                    <TextField
                      size="small"
                      {...params}
                      sx={{ backgroundColor: "#FFF" }}
                    />
                  )}
                />
              </LocalizationProvider>
              {errorLancInicioText ? (
                <ErrorText>{errorLancInicioText}</ErrorText>
              ) : null}
            </div>
            <div className="pb-2">
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                locale={brLocale}
              >
                <DatePicker
                  openTo="year"
                  views={["year", "month", "day"]}
                  label="Lançamento Fim:"
                  value={lancFim}
                  minDate={new Date(lancInicio)}
                  onError={(error) => {
                    if (error === "invalidDate") {
                      setErrorLancFimText("Data inválida");
                      setErrorLancFim(true);
                      return;
                    }
                    if (error === "minDate") {
                      setErrorLancFimText("Data inferior à Lançamento inicial");
                      setErrorLancFim(true);
                      return;
                    }
                    if (!error) {
                      setErrorLancFimText("");
                      setErrorLancFim(false);
                    }
                  }}
                  onChange={(val) => {
                    setErrorLancFim(false);
                    if (isValidDate(val)) {
                      val = format(new Date(val), "yyyy-MM-dd 23:59:59");
                      setLancFim(val);
                      return;
                    }
                    setLancFim("");
                    setErrorLancFim(true);
                    setErrorLancFimText("Data inválida");
                  }}
                  renderInput={(params) => (
                    <TextField
                      size="small"
                      {...params}
                      sx={{ backgroundColor: "#FFF" }}
                    />
                  )}
                />
              </LocalizationProvider>
              {errorLancFimText ? (
                <ErrorText>{errorLancFimText}</ErrorText>
              ) : null}
            </div>
            <ButtonPadrao
              type="button"
              onClick={handleAddList}
              disable={
                disp === "1969-12-31 23:59:59" ||
                !isValidDate(disp) ||
                lancInicio === "1969-12-31 23:59:59" ||
                !isValidDate(lancInicio) ||
                lancFim === "1969-12-31 23:59:59" ||
                !isValidDate(lancFim) ||
                !mySelected.length ||
                !!errorDisp ||
                !!errorLancInicio ||
                !!errorLancFim
              }
            >
              Adicionar
            </ButtonPadrao>
          </div>
        </AvailableSide>
        <AddSide className="col">
          <Title className="m-3">Municípios Adicionados</Title>
          <div className="d-flex justify-content-between m-3 mt-0">
            <div className="col-6 d-flex align-items-center">
              <MdSearchStyled size={20} />
              <Pesquisar
                type="text"
                name="searchMunAdd"
                placeholder="Pesquise"
                onChange={handleChangeSearchMunAdd}
                value={searchMunAdd}
              />
            </div>
            <div className="d-flex col-5 justify-content-end">
              <div className="me-2">
                <ButtonWhite
                  onClick={openModalPeriodo}
                  disable={!selectionTable.length}
                >
                  Alterar Período de Lançamento
                </ButtonWhite>
              </div>
              <div style={{ width: 160 }}>
                <ButtonWhite
                  onClick={handleDelete}
                  disable={!selectionTable.length}
                >
                  Excluir
                </ButtonWhite>
              </div>
            </div>
          </div>
          <TableList
            columns={munCol}
            rows={filteredMunList}
            selectionTable={selectionTable}
            setSelectionTable={setSelectionTable}
          />
        </AddSide>
      </Card>
      <ModalAlterarPeriodo
        show={modalShow}
        onHide={() => {
          setModalShow(false);
        }}
        selected={listMunAdd.filter((x) =>
          selectionTable.includes(x.AVM_MUN_ID)
        )}
        list={listMunAdd}
        disp={disp}
        handlechangeperiodo={handleChangePeriodo}
      />
    </>
  );
}
