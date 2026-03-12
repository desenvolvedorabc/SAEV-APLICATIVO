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
import { useState, useEffect } from "react";
import {
  useGetCounties,
} from "src/services/municipios.service";
import { DatePicker, LocalizationProvider } from "@mui/lab";
import { Autocomplete, TextField } from "@mui/material";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import brLocale from "date-fns/locale/pt-BR";
import { isValidDate } from "src/utils/validate";
import ButtonWhite from "src/components/buttons/buttonWhite";
import { format } from "date-fns";
import ModalAlterarPeriodo from "../modalAlterarPeriodo";
import useDebounce from "src/utils/use-debounce";
import { useGetStates } from "src/services/estados.service";

enum TypeAssessmentEnum {
  MUNICIPAL = 'Municipal',
  ESTADUAL = 'Estadual',
}

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
  const [uf, setUf] = useState(null);
  const [lancInicio, setLancInicio] = useState(null);
  const [errorLancInicio, setErrorLancInicio] = useState(true);
  const [errorLancInicioText, setErrorLancInicioText] = useState("");
  const [lancFim, setLancFim] = useState(null);
  const [errorLancFimText, setErrorLancFimText] = useState("");
  const [errorLancFim, setErrorLancFim] = useState(true);
  const [disp, setDisp] = useState(null);
  const [errorDisp, setErrorDisp] = useState(true);
  const [errorDispText, setErrorDispText] = useState("");
  const [selectedRede, setSelectedRede] = useState('MUNICIPAL');
  const [selectionTable, setSelectionTable] = useState<GridSelectionModel>([]);
  const [modalShow, setModalShow] = useState(false);
  const [filteredMunList, setFilteredMunList] = useState(listMunAdd)
  const debouncedSearchTerm = useDebounce(search, 500);

  const { data: states, isLoading: isLoadingStates } = useGetStates();
  const { data: listMun, isLoading } = useGetCounties({search: debouncedSearchTerm, page: 1, limit: 9999999, column: null, order: 'ASC', active: "1", verifyExistsRegional: null, stateId: uf?.id, enabled: !!uf});


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
      field: "AVM_TIPO",
      headerName: "REDE",
      renderCell: (cellValues) => {
        return (
          <div>
            {TypeAssessmentEnum[cellValues?.row?.AVM_TIPO]}
          </div>
        );
      },
      flex: 1,
    },
    {
      field: "AVM_DT_DISPONIVEL",
      headerName: "DISPONÍVEL",
      renderCell: (cellValues) => {
        return (
          <div>
            {cellValues?.row?.AVM_DT_DISPONIVEL ? format(new Date(cellValues?.row?.AVM_DT_DISPONIVEL), "dd/MM/yyyy") : "-"}
          </div>
        );
      },
    },
    {
      field: "lancamento",
      headerName: "PERÍODO DE LANÇAMENTO",
      width: 220,
      renderCell: (cellValues) => {
        const hasInicio = cellValues?.row?.AVM_DT_INICIO;
        const hasFim = cellValues?.row?.AVM_DT_FIM;

        if (!hasInicio && !hasFim) return <div>-</div>;

        return (
          <div>
            {hasInicio ? format(new Date(cellValues?.row?.AVM_DT_INICIO), "dd/MM/yyyy") : "-"} a{" "}
            {hasFim ? format(new Date(cellValues?.row?.AVM_DT_FIM), "dd/MM/yyyy") : "-"}
          </div>
        );
      },
    },
    {
      field: "status",
      headerName: "STATUS",
      renderCell: (cellValues) => {
        const hasInicio = cellValues?.row?.AVM_DT_INICIO;
        const hasFim = cellValues?.row?.AVM_DT_FIM;

        if (!hasInicio || !hasFim) {
          return (
            <Status>
              <Circle
                style={{
                  backgroundColor: "#999",
                }}
              />
              <Text
                style={{
                  color: "#999",
                }}
              >
                Sem data
              </Text>
            </Status>
          );
        }

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

  const handleChangeSelect = (id) => {
    if (mySelected.some((x) => x == id)) {
      setMySelected([...mySelected.filter((x) => x !== id)]);
    } else {
      setMySelected([...mySelected, id]);
    }
  };

  async function searchCharacters(search) {
    setListMunAvailableFilter(
      listMunAvailable?.filter((x) =>
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

  const handleAddList = () => {
    let listId = listMunAvailable.filter((x) => mySelected.includes(x.MUN_ID));
    let list = [];
    listId.map((x) => {
      if(!listMunAdd.find(add => add.id === x.MUN_ID + selectedRede)){
        list.push({
          id: x.MUN_ID + selectedRede,
          AVM_MUN_ID: x.MUN_ID,
          AVM_MUN_NOME: x.MUN_NOME,
          AVM_DT_INICIO: lancInicio,
          AVM_DT_FIM: lancFim,
          AVM_DT_DISPONIVEL: disp,
          AVM_ATIVO: 1,
          AVM_TIPO: selectedRede,
        });
      }
    });
    list = listMunAdd.concat(list);
    // setListMunAvailable(
    //   listMunAvailable.filter((x) => !mySelected.includes(x.MUN_ID))
    // );
    // setListMunAvailableFilter(
    //   listMunAvailableFilter.filter((x) => !mySelected.includes(x.MUN_ID))
    // );
    changeListMunAdd(list);
    setMySelected([]);
  };

  const handleDelete = (event) => {
    let listFiltered = listMunAdd?.filter(function (obj) {
      return !selectionTable?.some(function (obj2) {
        return obj.AVM_MUN_ID + obj.AVM_TIPO === obj2;
      });
    });
    changeListMunAdd(listFiltered);
  };

  const openModalPeriodo = () => {
    setModalShow(true);
  };

  const handleChangePeriodo = (selectedList, disp, lancInicio, lancFim) => {
    listMunAdd.map(function (obj) {
      selectedList.some(function (obj2) {
        if (obj.id === obj2.id) {
          obj2.AVM_DT_DISPONIVEL = disp;
          obj.AVM_DT_FIM = lancFim;
          obj.AVM_DT_INICIO = lancInicio;
        }
      });
    });
  };

  useEffect(() => {
    // if (listMunAdd && listMunAdd.length > 0) {
    //   let listFiltered = listMun?.items?.filter(function (obj) {
    //     return !listMunAdd.some(function (obj2) {
    //       return obj.MUN_ID === obj2.AVM_MUN_ID;
    //     });
    //   });
    //   setListMunAvailable(listFiltered);
    //   setListMunAvailableFilter(listFiltered);
    // } else {
      setListMunAvailable(listMun?.items);
      setListMunAvailableFilter(listMun?.items);
    // }
  },[listMun])

  const handleChangeUf = async (newValue) => {
    setUf(newValue);
    // await loadMun(newValue);
  };

  function onKeyDown(keyEvent) {
    if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
      keyEvent.preventDefault();
    }
  }

  function validateForm() {
    if(!mySelected.length || !!errorDispText?.trim() || !!errorLancInicioText?.trim() || !!errorLancFimText?.trim()) {
      return true
    }

    if(!!disp &&( !lancInicio || !lancFim)) {
      return true
    }

    if(!!lancInicio && (!disp || !lancFim)) {
      return true
    }

    if(!!lancFim && (!disp || !lancInicio)) {
      return true
    }

    if(!!lancFim && (lancFim < lancInicio)) {
      return true
    }

    if(!!lancInicio && isPast(new Date(lancInicio))) {
      return true
    }
   
    return false
  }

  return (
    <>
      <Card className="col-12 d-flex">
        <AvailableSide className="col-3">
          <div className="p-3">
            <Title>Municípios Disponíveis</Title>
            <div>
              <Autocomplete
                style={{background: "#FFF"}}
                fullWidth
                className=""
                data-test='state'
                id="state"
                size="small"
                value={uf}
                noOptionsText="Estado"
                options={states}
                loading={isLoadingStates}
                getOptionLabel={option => option.name}
                onChange={(_event, newValue) => {
                  handleChangeUf(newValue)
                }}
                renderInput={(params) => <TextField size="small" {...params} label="Estado" />}
              />
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
            {uf && listMunAvailableFilter?.length > 0 && (
              <>
                <FormCheck key={"all"} id={"all"} className="">
                  <Form.Check.Input
                    onChange={handleSelectAll}
                    value={"all"}
                    name="selectAll"
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
              {uf ? (listMunAvailableFilter?.length > 0 ?
                listMunAvailableFilter?.map((x) => {
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
                })
                :
                <div style={{padding: '10px 20px'}}>
                  Nenhum resultado encontrado
                </div>
              )
            :
              <div style={{padding: '10px 20px'}}>
                Filtre por um estado
              </div>
            }
            </ListOverflow>
          </List>
          <div className="p-3">
            <div>
              <Autocomplete
                className=""
                id="AVM_TIPO"
                size="small"
                value={selectedRede}
                noOptionsText="Rede"
                disableClearable
                options={Object.keys(TypeAssessmentEnum)}
                getOptionLabel={(option) => TypeAssessmentEnum[option]}
                onChange={(_event, newValue) => {
                  setSelectedRede(newValue);
                }}
                renderInput={(params) => (
                  <TextField size="small" {...params} label="Rede" />
                )}
                sx={{
                  backgroundColor: "#FFF",
                  marginBottom: '8px',
                }}
              />
            </div>
            <div className="">
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                locale={brLocale}
                
              >
                <DatePicker
                  disablePast
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
                    if (val && isValidDate(val)) {
                      const formattedDate = format(new Date(val), "yyyy-MM-dd 23:59:59");
                      setDisp(formattedDate);
                      return;
                    }
                    setDisp(null);
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
                  disablePast
                  openTo="year"
                  views={["year", "month", "day"]}
                  label="Lançamento Início:"
                  value={lancInicio}
                  minDate={disp ? new Date(disp) : undefined}
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
                    if (val && isValidDate(val)) {
                      const formattedDate = format(new Date(val), "yyyy-MM-dd 23:59:59");
                      setLancInicio(formattedDate);
                      return;
                    }
                    setLancInicio(null);
                    setErrorLancInicioText("");
                    setErrorLancInicio(false);
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
                  disablePast
                  openTo="year"
                  views={["year", "month", "day"]}
                  label="Lançamento Fim:"
                  value={lancFim}
                  minDate={lancInicio ? new Date(lancInicio) : undefined}
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
                    if (val && isValidDate(val)) {
                      const formattedDate = format(new Date(val), "yyyy-MM-dd 23:59:59");
                      setLancFim(formattedDate);
                      return;
                    }
                    setLancFim(null);
                    setErrorLancFim(false);
                    setErrorLancFimText("");
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
               validateForm()
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
        showDisponibilidade={true}
        onHide={() => {
          setModalShow(false);
        }}
        selected={
          listMunAdd.filter((x) =>{
            let find = false
            selectionTable.forEach((selection) => {if(selection === x.id) find = true})
            return find
          })
        }
        list={listMunAdd}
        handlechangeperiodo={handleChangePeriodo}
      />
    </>
  );
}
