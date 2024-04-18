import { Form } from "react-bootstrap"
import {ButtonPadrao} from "src/components/buttons/buttonPadrao"
import TableList from "../tableList"
import { AddSide, AvailableSide, ButtonExcluir, Card, FormCheck, FormCheckLabel, TestList, TestListOverflow, Title } from "./styledComponents"
import { BiTrash } from "react-icons/bi"
import { GridColDef } from '@mui/x-data-grid';
import { useEffect, useRef, useState } from "react"
import { GridSelectionModel } from '@mui/x-data-grid';
import { findYears } from "src/services/testes.service"
import useDebounce from "src/utils/use-debounce"
import { Autocomplete, TextField } from "@mui/material"
import { useGetYears } from "src/services/anos.service"

export default function TestePage({ listTestesAdd, changeListAdd, listSelected }) {
  const [listTestesAvailableFilter, setListTestesAvailableFilter] = useState([])
  const [listTestesAvailable, setListTestesAvailable] = useState([])
  const [ano, setAno] = useState(null)
  const [search, setSearch] = useState(null)
  const [selectAllActive, setselectAllActive] = useState(false)
  const [listTestSelected, setListTestSelected] = useState(listSelected || [])
  const [mySelected, setMySelected] = useState([])
  const [selectionTable, setSelectionTable] = useState<GridSelectionModel>([]);
  const didReplace = useRef(true);

  
  const { data: dataYears } = useGetYears(null, 1, 999999, null, 'DESC', true);
  
  useEffect(() => {
      const date = new Date();
      const year = date.getFullYear();
      let find = dataYears?.items?.find(x => x.ANO_NOME == year);

      if(find) {
        handleChangeAno(find);
      }
  }, [dataYears] )

  const testCol: GridColDef[] = [
    { field: 'TES_NOME', headerName: 'TESTE', headerClassName: 'header', flex: 1 },
    { field: 'TES_DIS', headerName: 'DISCIPLINA', headerClassName: 'header', flex: 1 },
    { field: 'TES_ANO', headerName: 'ANO', headerClassName: 'header', flex: 1 },
    {
      field: 'excluir',
      headerName: 'EXCLUIR',
      width: 150,
      renderCell: (cellValues) => {
        return (
          <ButtonExcluir key={cellValues.id} type="button"
            onClick={(event) => {
              handleDeleteTeste(event, cellValues);
            }}
          >
            <BiTrash color={"#FF6868"} size={15} />
          </ButtonExcluir>
        );
      },
    },
  ];


  // useEffect(() => {
  //   loadTests("")
  // }, []);

  const handleChangeSelectTest = (id) => {
    if (mySelected.some((x) => x == id)) {
      setMySelected([...mySelected.filter((x) => x !== id)])
    }
    else {
      setMySelected([...mySelected, id])
    }
  }

  async function searchCharacters(search) {
    setListTestesAvailableFilter(listTestesAvailable.filter(x => x.TES_NOME.toUpperCase().includes(search.toUpperCase())
    ))
  }

  const debouncedSearch = useDebounce(search, 500);

  useEffect(
    () => {
      if (debouncedSearch) {
        setListTestesAvailableFilter(listTestesAvailable);
        searchCharacters(debouncedSearch)
      } else {
        setListTestesAvailableFilter(listTestesAvailable);
      }
    },
    [debouncedSearch]
  );

  const handleChangeSearch = (e) => {
    setSearch(e.target.value)
  }

  const handleSelectAll = () => {
    if (!selectAllActive) {
      let list = []
      listTestesAvailable.map(x => {
        list.push(x.TES_ID)
      })
      setMySelected([...list])
      setselectAllActive(!selectAllActive)
    }
    else {
      setMySelected([])
      setselectAllActive(!selectAllActive)
    }
  }

  const verifyMySelected = (id) => {
    return mySelected.find((item) => {
      return id === item
    })
  }

  const handleAddList = () => {
    let listId = listTestesAvailable.filter(x => mySelected.includes(x.TES_ID))

    let list = []
    listId.map(x => {
      list.push({
        id: x.TES_ID,
        TES_ID: x.TES_ID,
        TES_NOME: x.TES_NOME,
        TES_DIS: x.TES_DIS,
        TES_ANO: x.TES_ANO,
      })
    })
    list = listTestesAdd.concat(list)
    setListTestesAvailable(listTestesAvailable.filter(x => !mySelected.includes(x.TES_ID)))
    setListTestesAvailableFilter(listTestesAvailableFilter.filter(x => !mySelected.includes(x.TES_ID)))
    changeListAdd(list)
    setMySelected([])
  }

  useEffect(() => {
    if (listTestesAvailable && listTestesAvailable.length > 0 && didReplace.current && listSelected && listSelected?.length > 0) {
      let listFiltered = listTestesAvailable.filter(function (obj) {
        return !listTestSelected.some(function (obj2) {
          return obj.TES_ID === obj2.TES_ID;
        });
      });
      setListTestesAvailable(listFiltered)
      setListTestesAvailableFilter(listFiltered)
      didReplace.current = false;
    }
  }, [listTestesAvailable])

  const handleDeleteTeste = (event, cellValues) => {
    const id = cellValues.row.TES_ID
    let updateList = listTestesAdd.filter(x => x.TES_ID !== id)
    changeListAdd(updateList)
    setListTestesAvailable([...listTestesAvailable, cellValues.row])
    setListTestesAvailableFilter([...listTestesAvailableFilter, cellValues.row])

    event.stopPropagation()
  }

  const handleChangeAno = async (newValue) => {
    setAno(newValue)
    await loadTests(newValue?.ANO_NOME)
  }

  async function loadTests(ano: string) {
    const respTests = await findYears(ano)
    let list = [];
    const filterData =  respTests?.data?.filter((data) => !!data.TES_ATIVO)

    filterData?.map(item => {
      list.push({
        id: item.TES_ID,
        TES_ID: item.TES_ID,
        TES_NOME: item.TES_NOME,
        TES_DIS: item.TES_DIS.DIS_NOME,
        TES_ANO: item.TES_ANO,
      })
    })
    
    if (listTestesAdd && listTestesAdd.length > 0) {
      let listFiltered = list.filter(function (obj) {
        return !listTestesAdd.some(function (obj2) {
          return obj.TES_ID === obj2.TES_ID;
        });
      });
      setListTestesAvailable(listFiltered)
      setListTestesAvailableFilter(listFiltered)
    } else {
      setListTestesAvailable(list)
      setListTestesAvailableFilter(list);
    }

  }

  function onKeyDown(keyEvent) {
    if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
      keyEvent.preventDefault();
    }
  }


  return (
    <Card className="col-12 d-flex">
      <AvailableSide className="col-3">
        <div className="p-3">
          <Title>
            Testes Disponíveis
          </Title>
          <div>
            
            <Autocomplete
                style={{background: "#FFF"}}
                className=""
                id="ano"
                size="small"
                value={ano}
                noOptionsText="Ano"
                options={dataYears?.items ? dataYears?.items : []}
                getOptionLabel={(option) =>  `${option?.ANO_NOME}`}
                onChange={(_event, newValue) => {
                  handleChangeAno(newValue)
                }}
                renderInput={(params) => <TextField size="small" {...params} label="Ano" />}
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
                backgroundColor: "#FFF"
              }}
            />
          </div>
        </div>
        <TestList>
          <FormCheck
            key={"all"}
            id={"all"}
            className=""
          >
            <Form.Check.Input onChange={handleSelectAll} value={"all"} name="AREAS" type={"checkbox"} checked={selectAllActive} />
            <FormCheckLabel>
              <div>Selecionar Todos</div>
            </FormCheckLabel>
          </FormCheck>
          <TestListOverflow>
            {listTestesAvailableFilter.map(x => {
              return (
                <FormCheck
                  key={x.TES_ID}
                  id={x.TES_ID}
                  className=""
                >
                  <Form.Check.Input onChange={() => handleChangeSelectTest(x.TES_ID)} value={x.TES_ID} name="mySelected" type={"checkbox"} checked={verifyMySelected(x.TES_ID)} />
                  <FormCheckLabel>
                    <div>{x.TES_NOME}</div>
                  </FormCheckLabel>
                </FormCheck>
              )
            })}
          </TestListOverflow>
        </TestList>
        <div className="p-3">
          <ButtonPadrao type="button" onClick={handleAddList}>
            Adicionar
          </ButtonPadrao>
        </div>
      </AvailableSide>
      <AddSide className="col">
        <Title className="m-3">
          Testes Adicionados
        </Title>
        <TableList columns={testCol} rows={listTestesAdd} selectionTable={selectionTable} setSelectionTable={setSelectionTable} />
      </AddSide>
    </Card>
  )
}