import { Form } from "react-bootstrap";
import { useFormik } from 'formik';
import { SelectionSide, Title, List, ListOverflow, FormCheck, FormCheckLabel, CardSelectionSide, MessageSide, ButtonDest, ButtonDestList, TopMessage, CardButtons, ButtonArea, ButtonCard } from './styledComponents'
import {ButtonPadrao} from 'src/components/buttons/buttonPadrao';
import ButtonWhite from 'src/components/buttons/buttonWhite';
import ModalConfirmacao from 'src/components/modalConfirmacao';
import ModalAviso from 'src/components/modalAviso';
import { useEffect, useState, useRef } from 'react';
import Router from 'next/router'
import ButtonVermelho from "src/components/buttons/buttonVermelho";
import {FormControl, InputLabel, MenuItem, Select, TextField} from '@mui/material';
import { findAllDistricts, findDistricts, getAllCounties } from "src/services/municipios.service";
import { loadUf } from "src/utils/combos";
import { MdClose } from "react-icons/md"
import { createMessage } from "src/services/mensagens.service";
import { getAllSchools, getSchools } from "src/services/escolas.service";
import { Editor } from "src/components/editor";
import { AutoCompletePagMun } from "src/components/AutoCompletePag/AutoCompletePagMun";

type ValidationErrors = Partial<{ MEN_TITLE: string, MEN_TEXT: string, MUNICIPIOS: string, ESCOLAS: string }>

export default function FormCreateMessage({}) {
  const [ModalShowConfirm, setModalShowConfirm] = useState(false)
  const [modalStatus, setModalStatus] = useState(true)
  const [modalShowWarning, setModalShowWarning] = useState(false)
  const [errorMessage, setErrorMessage] = useState(true)
  const [listUf, setListUf] = useState([])
  const [listAllUf, setListAllUf] = useState([])
  const [listMun, setListMun] = useState([])
  const [uf, setUf] = useState("")
  const [searchMun, setSearchMun] = useState(null)
  const [searchSchool, setSearchSchool] = useState("")
  const [selectAllActive, setselectAllActive] = useState(false)
  const [selectAllActiveSchool, setselectAllActiveSchool] = useState(false)
  const [listMunFilter, setListMunFilter] = useState([])
  const [mySelected, setMySelected] = useState([])
  const [schoolList, setSchoolList] = useState([])
  const [mySelectedSchool, setMySelectedSchool] = useState([])
  const [munFilter, setMunFilter] = useState(null)
  const [listAddMun, setListAddMun] = useState([])
  const [listAddEsc, setListAddEsc] = useState([])
  const [filteredSchools, setFilteredSchools] = useState([])
  const [text, setText] = useState("")
  const [disableAll, setDisableAll] = useState(false)
  const [areaActive, setAreaActive] = useState(true)
  const [pageMun, setPageMun] = useState(1);
  const [completeMun, setCompleteMun] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);

  const validate = values => {
    const errors: ValidationErrors = {};
    if (!values.MEN_TITLE) {
      errors.MEN_TITLE = 'Campo obrigatório';
    } else if (values.MEN_TITLE.length < 6) {
      errors.MEN_TITLE = 'Deve ter no minimo 6 caracteres';
    }
    if (!values.MEN_TEXT) {
      errors.MEN_TEXT = 'Campo obrigatório';
    }
    if (!values.MUNICIPIOS) {
      errors.MUNICIPIOS = 'Campo obrigatório';
    }
    if (!values.ESCOLAS) {
      errors.ESCOLAS = 'Campo obrigatório';
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      MEN_TITLE: "",
      MEN_TEXT: "",
      MUNICIPIOS: [],
      ESCOLAS: [],
    },
    //validate,
    onSubmit: async (values) => {
      values.MEN_TEXT = text

      let list = []
      listAddMun.map(x => {
        list.push(x.MUN_ID)
      })
      values.MUNICIPIOS = list
      
      list = []
      listAddEsc.map(x => {
        list.push(x.ESC_ID)
      })
      values.ESCOLAS = list
      
      setIsDisabled(true)
      let response = null;
      try{
        response = await createMessage(values)
      }
      catch (err) {
        setIsDisabled(false)
      } finally {
        setIsDisabled(false)
      }
      if (response.status === 201) {
        setModalStatus(true)
        setModalShowConfirm(true)
      }
      else {
        setErrorMessage(response.data.message || 'Erro ao enviar mensagem')
        setModalStatus(false)
        setModalShowConfirm(true)
      }
    }
  });


  async function loadMun(uf: string) {
    let respMunicipios
    if (uf === "") {
      respMunicipios = await getAllCounties()
    }
    else {
      respMunicipios = await findDistricts(uf)
    }

    setListMun(respMunicipios.data)
  }

  const filterMun = (searchMun) => {
    let list = []
    if(!searchMun)
      setListMunFilter(listMun)
    else{
      list = listMun.filter(x => x.MUN_NOME.toUpperCase().includes(searchMun.toUpperCase()))
  
      setListMunFilter(list)
    }
  }

  async function loadComboUfs() {
    const respUfs = await findAllDistricts()

    let list = []
    respUfs?.data?.map(obj => {
      listAllUf.map(obj2 => {
        if (obj.MUN_UF === obj2.sigla) {
          if (!list.includes(obj2)) {
            list.push(obj2)
          }
        }
      })
    })
    setListUf(list.sort((a, b) => a.sigla.localeCompare(b.sigla)))
  }

  useEffect(() => {
    async function fetchAPI() {
      setListAllUf(await loadUf());
    }
    fetchAPI()
    loadSchool()

  }, []);

  const loadSchool = async () => {
    const respEscolas = await getAllSchools()
    if(respEscolas?.data?.length > 0) {
      setSchoolList(respEscolas.data)
    }
  }

  useEffect(() => {
    loadComboUfs()
    loadMun("")
  }, [listAllUf]);

  
  const handleChangeUf = async (e) => {
    setUf(e.target.value)
    await loadMun(e.target.value)
  }

  
  const handleChangeSearchMun = (e) => {
    setSearchMun(e.target.value)
  }

  const handleChangeMunFilter = (newValue) => {
    setMunFilter(newValue)
  }

  const handleChangeSearchSchool = (e) => {
    setSearchSchool(e.target.value)
  }

  useEffect(() => {
    let list = []

    if(munFilter === null){
      list = [...schoolList]
    }
    else{
     list = schoolList?.filter((x) => x?.ESC_MUN.MUN_ID === munFilter?.MUN_ID)
     setFilteredSchools(list)
    }

    if(searchSchool != ""){
      list = list.filter((x) => x?.ESC_NOME.toUpperCase().includes(searchSchool.toUpperCase()))
    }

    setFilteredSchools(list)

  }, [munFilter, searchSchool, schoolList])

  function onKeyDown(keyEvent) {
    if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
      keyEvent.preventDefault();
    }
  }

  const handleSelectAll =  () => {
    if (!selectAllActive) {
      let list = []

      listMunFilter.forEach(async(x, index) => {
        list.push(x)
    })
      setMySelected(list)

      setselectAllActive(!selectAllActive)
    }
    else {
      setMySelected([])
      setselectAllActive(!selectAllActive)
    }
  }

  const handleChangeSelect = (mun) => {
    if (mySelected.some((x) => x.MUN_ID == mun.MUN_ID)) {
      setMySelected([...mySelected.filter((x) => x.MUN_ID !== mun.MUN_ID)])
    }
    else {
      setMySelected([...mySelected, mun])
    }
  }
  
  const verifyMySelected = (mun) => {
    return mySelected.find((item) => {
      return mun?.MUN_ID === item?.MUN_ID
    })
  }

  const verifyMySelectedSchool = (esc) => {
    return mySelectedSchool.find((item) => {

      return esc?.ESC_ID === item?.ESC_ID
    })
  }

  const handleSelectAllSchools = () => {
    if (!selectAllActiveSchool) {
      setMySelectedSchool([...schoolList])
      setselectAllActiveSchool(!selectAllActiveSchool)
    }
    else {
      setMySelectedSchool([])
      setselectAllActiveSchool(!selectAllActiveSchool)
    }
  }
  
  const handleChangeSelectSchool = (escola) => {
    if (mySelectedSchool?.some((x) => x.ESC_ID == escola.ESC_ID)) {
      setMySelectedSchool([...mySelectedSchool.filter((x) => x.ESC_ID !== escola.ESC_ID)])
    }
    else {
      setMySelectedSchool([...mySelectedSchool, escola])
    }
  }

  const handleAddSelecteds = () => {

    let listMun = listAddMun.concat()
    mySelected.map((x) => {
      if (!listAddMun.some((mun) => mun.MUN_ID == x.MUN_ID)) {
        listMun.push(x)
      }
    })
    setListAddMun(listMun)

    let listEsc = listAddEsc.concat()
    mySelectedSchool.map((x) => {
      if (!listAddEsc.some((esc) => esc.ESC_ID == x.ESC_ID)) {
        listEsc.push(x)
      }
    })
    setListAddEsc(listEsc)
  }

  const handleRemoveMun = (idMun) => {
    setListAddMun([...listAddMun.filter((x) => x.MUN_ID !== idMun)])
  }

  const handleRemoveEsc = (idEsc) => {
    setListAddEsc([...listAddEsc.filter((x) => x.ESC_ID !== idEsc)])
  }

  const handleChangeText = (value) => {
    setText(value)
  }

  useEffect(() => {
    filterMun(searchMun)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[listMun, searchMun])

  return (
    <>
      <div className="d-flex">
        <SelectionSide className="d-flex flex-column">
          <div className="d-flex">
            <ButtonArea type="button" onClick={() => { setAreaActive(true) }} active={areaActive} style={{marginRight: 13}}>
              Municípios
            </ButtonArea>
            <ButtonArea type="button" onClick={() => { setAreaActive(false) }} active={!areaActive}>
              Escolas
            </ButtonArea>
          </div>
          {areaActive ? 
            <CardSelectionSide>
              <Title>Usuários das Secretarias Destinatárias</Title>
              <FormControl fullWidth size="small">
                <InputLabel id="MEN_UF">Estado</InputLabel>
                <Select
                  labelId="MEN_UF"
                  id="MEN_UF"
                  name="MEN_UF"
                  value={uf} 
                  onChange={(e) => handleChangeUf(e)}
                  label="Estado"
                >
                  <MenuItem key={"allUf"} value={""}>
                    Todos
                  </MenuItem>
                  {listUf.map((item, index) => (
                    <MenuItem key={index} value={item.sigla}>
                      {item.sigla} - {item.nome}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <div className="col mt-2 mb-3">
                <TextField
                  fullWidth
                  label="Buscar"
                  name="searchMun"
                  id="searchMun"
                  value={searchMun}
                  onChange={handleChangeSearchMun}
                  onKeyDown={onKeyDown} 
                  onDragEnter={(e) => e.preventDefault()} 
                  onSubmit={(e) => e.preventDefault()}
                  size="small"
                  sx={{
                    backgroundColor: "#FFF"
                  }}
                />
              </div>
              <List>
                <FormCheck
                  key={"mun"}
                  id={"mun"}
                  className=""
                >
                  <Form.Check.Input onChange={handleSelectAll} value={"all"} name="municipios" type={"checkbox"} checked={selectAllActive} disabled={disableAll} />
                  <FormCheckLabel>
                    <div>Selecionar Todos</div>
                  </FormCheckLabel>
                </FormCheck>
                <ListOverflow>
                  {listMunFilter.map(x => {
                    return (
                      <FormCheck
                        key={x.MUN_ID}
                        id={x.MUN_ID}
                        className=""
                      >
                        <Form.Check.Input onChange={() => handleChangeSelect(x)} value={x} name="mySelected" type={"checkbox"} checked={verifyMySelected(x)} />
                        <FormCheckLabel>
                          <div>{x.MUN_NOME}</div>
                        </FormCheckLabel>
                      </FormCheck>
                    )
                  })}
                </ListOverflow>
              </List>
            </CardSelectionSide>
          :
            <CardSelectionSide>
              <Title>Selecionar Usuários das Escolas</Title>
              <AutoCompletePagMun county={munFilter} changeCounty={handleChangeMunFilter} />
              <div className="col mt-2 mb-3">
                <TextField
                  fullWidth
                  label="Buscar"
                  name="searchSchool"
                  id="searchSchool"
                  value={searchSchool}
                  onChange={handleChangeSearchSchool}
                  onKeyDown={onKeyDown} 
                  onDragEnter={(e) => e.preventDefault()} 
                  onSubmit={(e) => e.preventDefault()}
                  size="small"
                  sx={{
                    backgroundColor: "#FFF"
                  }}
                />
              </div>
              <List>
                <FormCheck
                  key={"esc"}
                  id={"esc"}
                  className=""
                >
                  <Form.Check.Input onChange={handleSelectAllSchools} value={"all"} name="Escolas" type={"checkbox"} checked={selectAllActiveSchool} />
                  <FormCheckLabel>
                    <div>Selecionar Todos</div>
                  </FormCheckLabel>
                </FormCheck>
                <ListOverflow>
                  {filteredSchools.map((school) => (
                    <FormCheck
                      key={school.ESC_ID}
                      id={school.ESC_ID}
                      className=""
                    >
                      <Form.Check.Input onChange={() => handleChangeSelectSchool(school)} value={school} name="mySelectedSchool" type={"checkbox"} checked={verifyMySelectedSchool(school)} />
                      <FormCheckLabel>
                        <div>{school.ESC_NOME}</div>
                      </FormCheckLabel>
                    </FormCheck>
                  ))}
                </ListOverflow>
              </List>
            </CardSelectionSide>
          }
          <ButtonCard>
            <div style={{width: "100%"}}>
              <ButtonWhite onClick={() => {handleAddSelecteds()}}>Adicionar</ButtonWhite>
            </div>
          </ButtonCard>
        </SelectionSide>
        <MessageSide className="col ms-3">
          <TopMessage>
            <TextField
              fullWidth
              label="Título da Mensagem"
              name="MEN_TITLE"
              id="MEN_TITLE"
              value={formik.values.MEN_TITLE}
              onChange={formik.handleChange}
              onKeyDown={onKeyDown} 
              onDragEnter={(e) => e.preventDefault()} 
              onSubmit={(e) => e.preventDefault()}
              size="small"
              sx={{
                backgroundColor: "#FFF"
              }}
            />
            <Title style={{marginTop: 10}}>Destinatários:</Title>
            <ButtonDestList>
              <>
                {listAddMun.map((x) => (
                  <>
                  <ButtonDest key={x.MUN_ID} onClick={() => {handleRemoveMun(x.MUN_ID)}}>
                    {x.MUN_NOME}
                    <MdClose color={"#4B4B4B"} size={18}/>
                  </ButtonDest>
                  </>
                ))}
              </>
              <>
                {listAddEsc.map((x) => (
                  <ButtonDest key={x.ESC_ID} onClick={() => {handleRemoveEsc(x.ESC_ID)}}>
                    {x.ESC_NOME}
                    <MdClose color={"#4B4B4B"} size={18}/>
                  </ButtonDest>
                ))}
              </>
            </ButtonDestList>
          </TopMessage>
          <div className="ms-3" style={{maxWidth: 800}}>
            <Editor changeText={handleChangeText} minHeight={"400px"} />
          </div>
        </MessageSide>
      </div>
      <CardButtons>
        <div style={{width: 135}}>
          <ButtonVermelho onClick={() => {setModalShowWarning(true)}}>
            Descartar
          </ButtonVermelho>
        </div>
        <div style={{width: 135}}>
          <ButtonPadrao 
            onClick={(e) => {formik.handleSubmit(e)}} 
            type="submit" 
            disable={isDisabled}
          >
            Enviar
          </ButtonPadrao>
        </div>
      </CardButtons>
      <ModalConfirmacao
        show={ModalShowConfirm}
        onHide={() => { setModalShowConfirm(false), modalStatus && Router.push(`/mensagens`)}}
        text={modalStatus ? `Mensagem enviada com sucesso.` : "Erro ao enviar mensagem"
        //errorMessage
      }
        status={modalStatus}
      />
      <ModalAviso
        show={modalShowWarning}
        onHide={() => setModalShowWarning(false)}
        onConfirm={() => { Router.push('/mensagens') }}
        buttonYes={'Sim, Descartar Mensagem'}
        buttonNo={'Manter Mensagem'}
        text={`Tem certeza que deseja descartar a mensagem atual?`}
      />
    </>
  )
}