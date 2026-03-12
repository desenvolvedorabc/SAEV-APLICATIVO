import { Form } from "react-bootstrap";
import { useFormik } from 'formik';
import { SelectionSide, Title, List, ListOverflow, FormCheck, FormCheckLabel, CardSelectionSide, MessageSide, ButtonDest, ButtonDestList, TopMessage, CardButtons, ButtonArea, ButtonCard } from './styledComponents'
import {ButtonPadrao} from 'src/components/buttons/buttonPadrao';
import ButtonWhite from 'src/components/buttons/buttonWhite';
import ModalConfirmacao from 'src/components/modalConfirmacao';
import ModalAviso from 'src/components/modalAviso';
import { useState } from 'react';
import Router from 'next/router'
import ButtonVermelho from "src/components/buttons/buttonVermelho";
import {Autocomplete, TextField} from '@mui/material';
import { useGetCounties } from "src/services/municipios.service";
import { MdClose } from "react-icons/md"
import { createMessage } from "src/services/mensagens.service";
import { useGetSchools } from "src/services/escolas.service";
import { Editor } from "src/components/editor";
import { AutoCompletePagMun } from "src/components/AutoCompletePag/AutoCompletePagMun";
import { useGetStates } from "src/services/estados.service";
import useDebounce from "src/utils/use-debounce";
import { Loading } from "src/components/Loading";
import { useGetRegionais } from "src/services/regionais-estaduais.service";
import { useGetSeries } from "src/services/series.service";
import { useGetSchoolClasses } from "src/services/turmas.service";

type ValidationErrors = Partial<{ MEN_TITLE: string, MEN_TEXT: string, MUNICIPIOS: string, ESCOLAS: string }>

export default function FormCreateMessage({}) {
  const [ModalShowConfirm, setModalShowConfirm] = useState(false)
  const [modalStatus, setModalStatus] = useState(true)
  const [modalShowWarning, setModalShowWarning] = useState(false)
  const [errorMessage, setErrorMessage] = useState(true)
  const [uf, setUf] = useState(null)
  const [stateRegional, setStateRegional] = useState(null)
  const [countyRegional, setCountyRegional] = useState(null)
  const [searchMun, setSearchMun] = useState(null)
  const [munFilter, setMunFilter] = useState(null)
  const [searchSchool, setSearchSchool] = useState("")
  const [selectAllActive, setselectAllActive] = useState(false)
  const [selectAllActiveSchool, setselectAllActiveSchool] = useState(false)
  const [selectAllActiveSerie, setselectAllActiveSerie] = useState(false)
  const [selectAllActiveSchoolClass, setselectAllActiveSchoolClass] = useState(false)
  const [mySelected, setMySelected] = useState([])
  const [mySelectedSchool, setMySelectedSchool] = useState([])
  const [mySelectedSerie, setMySelectedSerie] = useState([])
  const [mySelectedSchoolClass, setMySelectedSchoolClass] = useState([])
  const [listAddMun, setListAddMun] = useState([])
  const [listAddEsc, setListAddEsc] = useState([])
  const [listAddSerie, setListAddSerie] = useState([])
  const [listAddSchoolClass, setListAddSchoolClass] = useState([])
  const [serie, setSerie] = useState(null)
  const [text, setText] = useState("")
  const [disableAll, setDisableAll] = useState(false)
  const [areaActive, setAreaActive] = useState(0)
  const [isDisabled, setIsDisabled] = useState(false);
  const debouncedSearchTermCounty = useDebounce(searchMun, 500);
  const debouncedSearchTermSchool = useDebounce(searchSchool, 500);

  const { data: states, isLoading: isLoadingStates } = useGetStates();

  const { data: listStateRegional, isLoading: isLoadingStateRegional } = useGetRegionais(null, 1, 999999, null, 'ASC', null, uf?.id, 'ESTADUAL', !!uf);

  const { data: listMun, isLoading } = useGetCounties({search: debouncedSearchTermCounty, page: 1, limit: 9999999, column: null, order: 'ASC', active: "1", verifyExistsRegional: null, stateId: uf?.id, stateRegionalId: stateRegional?.id, enabled: true});

  const { data: listCountyRegional, isLoading: isLoadingCountyRegional } = useGetRegionais(null, 1, 999999, null, 'ASC', munFilter?.MUN_ID, null, null, !!munFilter);

  const { data: listSchool, isLoading: isLoadingSchool } = useGetSchools({search: debouncedSearchTermSchool, page: 1, limit: 999999, column: null, order: 'ASC', active: "1", county: munFilter?.MUN_ID, municipalityOrUniqueRegionalId: countyRegional?.id, typeSchool: null, enabled: true});

  const { data: listSerie, isLoading: isLoadingSerie } = useGetSeries(
    null, 
    1, 
    999999, 
    null, 
    "ASC", 
    munFilter?.MUN_ID ? null : null,
    '1',
    !!munFilter
  );

  const { data: listSchoolClass, isLoading: isLoadingSchoolClass } = useGetSchoolClasses(
    null, 
    1, 
    999999, 
    'TURMA_TUR_ANO', 
    "ASC", 
    null,
    munFilter?.MUN_ID,
    null,
    serie?.SER_ID,
    null,
    1,
    !!serie
  );

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
      SERIES: [],
      TURMAS: [],
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
      
      list = []
      listAddSerie.map(x => {
        list.push(x.SER_ID)
      })
      values.SERIES = list
      
      list = []
      listAddSchoolClass.map(x => {
        list.push(x.TURMA_TUR_ID)
      })
      values.TURMAS = list
      
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
  
  const handleChangeUf = async (newValue) => {
    setUf(newValue)
    setStateRegional(null)
    setMySelected([])
    setselectAllActive(false)
  }
  
  const handleChangeStateRegional = async (newValue) => {
    setStateRegional(newValue)
    setMySelected([])
    setselectAllActive(false)
  }
  
  const handleChangeCountyRegional = async (newValue) => {
    setCountyRegional(newValue)
    setMySelectedSchool([])
    setselectAllActiveSchool(false)
  }
  
  const handleChangeSearchMun = (e) => {
    setSearchMun(e.target.value)
  }

  const handleChangeMunFilter = (newValue) => {
    setMunFilter(newValue)
    setCountyRegional(null)
    setMySelectedSchool([])
    setselectAllActiveSchool(false)
  }

  const handleChangeSearchSchool = (e) => {
    setSearchSchool(e.target.value)
  }

  function onKeyDown(keyEvent) {
    if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
      keyEvent.preventDefault();
    }
  }

  const handleSelectAll =  () => {
    if (!selectAllActive) {
      let list = []

      listMun?.items?.forEach(async(x, index) => {
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
    return !!mySelected.find((item) => {
      return mun?.MUN_ID === item?.MUN_ID
    })
  }

  const verifyMySelectedSchool = (esc) => {
    return !!mySelectedSchool.find((item) => {
      return esc?.ESC_ID === item?.ESC_ID
    })
  }

  const handleSelectAllSchools = () => {
    if (!selectAllActiveSchool) {
      setMySelectedSchool([...listSchool?.items])
      setselectAllActiveSchool(true)
    }
    else {
      setMySelectedSchool([])
      setselectAllActiveSchool(false)
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

  const handleSelectAllSeries = () => {
    if (!selectAllActiveSerie) {
      setMySelectedSerie([...listSerie?.items])
      setselectAllActiveSerie(true)
    }
    else {
      setMySelectedSerie([])
      setselectAllActiveSerie(false)
    }
  }
  
  const handleChangeSelectSerie = (serieItem) => {
    if (mySelectedSerie?.some((x) => x.SER_ID == serieItem.SER_ID)) {
      setMySelectedSerie([...mySelectedSerie.filter((x) => x.SER_ID !== serieItem.SER_ID)])
    }
    else {
      setMySelectedSerie([...mySelectedSerie, serieItem])
    }
  }

  const verifyMySelectedSerie = (serieItem) => {
    return !!mySelectedSerie.find((item) => {
      return serieItem?.SER_ID === item?.SER_ID
    })
  }

  const handleSelectAllSchoolClasses = () => {
    if (!selectAllActiveSchoolClass) {
      setMySelectedSchoolClass([...listSchoolClass?.items])
      setselectAllActiveSchoolClass(true)
    }
    else {
      setMySelectedSchoolClass([])
      setselectAllActiveSchoolClass(false)
    }
  }
  
  const handleChangeSelectSchoolClass = (turmaItem) => {
    if (mySelectedSchoolClass?.some((x) => x.TURMA_TUR_ID == turmaItem.TURMA_TUR_ID)) {
      setMySelectedSchoolClass([...mySelectedSchoolClass.filter((x) => x.TURMA_TUR_ID !== turmaItem.TURMA_TUR_ID)])
    }
    else {
      setMySelectedSchoolClass([...mySelectedSchoolClass, turmaItem])
    }
  }

  const verifyMySelectedSchoolClass = (turmaItem) => {
    return !!mySelectedSchoolClass.find((item) => {
      return turmaItem?.TURMA_TUR_ID === item?.TURMA_TUR_ID
    })
  }

  const handleChangeSerie = (newValue) => {
    setSerie(newValue)
    setMySelectedSchoolClass([])
    setselectAllActiveSchoolClass(false)
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

    let listSer = listAddSerie.concat()
    mySelectedSerie.map((x) => {
      if (!listAddSerie.some((serie) => serie.SER_ID == x.SER_ID)) {
        listSer.push(x)
      }
    })
    setListAddSerie(listSer)

    let listTur = listAddSchoolClass.concat()
    mySelectedSchoolClass.map((x) => {
      if (!listAddSchoolClass.some((turma) => turma.TURMA_TUR_ID == x.TURMA_TUR_ID)) {
        listTur.push(x)
      }
    })
    setListAddSchoolClass(listTur)
  }

  const handleRemoveMun = (idMun) => {
    setListAddMun([...listAddMun.filter((x) => x.MUN_ID !== idMun)])
  }

  const handleRemoveEsc = (idEsc) => {
    setListAddEsc([...listAddEsc.filter((x) => x.ESC_ID !== idEsc)])
  }

  const handleRemoveSerie = (idSerie) => {
    setListAddSerie([...listAddSerie.filter((x) => x.SER_ID !== idSerie)])
  }

  const handleRemoveSchoolClass = (idTurma) => {
    setListAddSchoolClass([...listAddSchoolClass.filter((x) => x.TURMA_TUR_ID !== idTurma)])
  }

  const handleChangeText = (value) => {
    setText(value)
  }

  return (
    <>
      <div className="d-flex">
        <SelectionSide className="d-flex flex-column">
          <div className="d-flex">
            <ButtonArea type="button" onClick={() => { setAreaActive(0) }} active={areaActive === 0} style={{marginRight: 13}}>
              Municípios
            </ButtonArea>
            <ButtonArea type="button" onClick={() => { setAreaActive(1) }} active={areaActive === 1} style={{marginRight: 13}}>
              Escolas
            </ButtonArea>
            <ButtonArea type="button" onClick={() => { setAreaActive(2) }} active={areaActive === 2} style={{marginRight: 13}}>
              Séries
            </ButtonArea>
            <ButtonArea type="button" onClick={() => { setAreaActive(3) }} active={areaActive === 3}>
              Turmas
            </ButtonArea>
          </div>
          {areaActive === 0 && (
            <CardSelectionSide>
              <Title>Usuários das Secretarias Destinatárias</Title>
              <Autocomplete
                sx={{background: "#FFF", marginTop: '10px'}}
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
              <Autocomplete
                sx={{background: "#FFF", marginTop: '10px'}}
                fullWidth
                className=""
                data-test='stateRegional'
                id="stateRegional"
                size="small"
                value={stateRegional}
                noOptionsText="Regional Estadual"
                options={listStateRegional?.items || []}
                loading={isLoadingStateRegional}
                getOptionLabel={option => option.name}
                onChange={(_event, newValue) => {
                  handleChangeStateRegional(newValue)
                }}
                disabled={!uf}
                renderInput={(params) => <TextField size="small" {...params} label="Regional Estadual" />}
              />
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
                    <div>Todas ({listMun?.meta?.totalItems || 0})</div>
                  </FormCheckLabel>
                </FormCheck>
                <ListOverflow>
                  {isLoading ?
                    <Loading />
                    :
                    listMun?.items?.map(x => {
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
                    })
                  }
                </ListOverflow>
              </List>
            </CardSelectionSide>
          )}

          {areaActive === 1 && (
            <CardSelectionSide>
              <Title>Selecionar Usuários das Escolas</Title>
              <AutoCompletePagMun county={munFilter} changeCounty={handleChangeMunFilter} showUf={true} />
              <Autocomplete
                sx={{background: "#FFF", marginTop: '10px'}}
                fullWidth
                className=""
                data-test='countyRegional'
                id="countyRegional"
                size="small"
                value={countyRegional}
                noOptionsText="Regional Municipal/Estadual"
                options={listCountyRegional?.items || []}
                loading={isLoadingCountyRegional}
                getOptionLabel={option => option.name}
                onChange={(_event, newValue) => {
                  handleChangeCountyRegional(newValue)
                }}
                disabled={!munFilter}
                renderInput={(params) => <TextField size="small" {...params} label="Regional Municipal/Estadual" />}
              />
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
                    <div>Todas ({listSchool?.meta?.totalItems || 0})</div>
                  </FormCheckLabel>
                </FormCheck>
                <ListOverflow>
                  {isLoadingSchool ?
                    <Loading />
                    :
                    listSchool?.items?.map((school) => (
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
          )}

          {areaActive === 2 && (
            <CardSelectionSide>
              <Title>Selecionar Séries</Title>
              <AutoCompletePagMun county={munFilter} changeCounty={handleChangeMunFilter} showUf={true} />
              <List>
                <FormCheck
                  key={"serie"}
                  id={"serie"}
                  className=""
                >
                  <Form.Check.Input onChange={handleSelectAllSeries} value={"all"} name="Series" type={"checkbox"} checked={selectAllActiveSerie} />
                  <FormCheckLabel>
                    <div>Todas ({listSerie?.meta?.totalItems || 0})</div>
                  </FormCheckLabel>
                </FormCheck>
                <ListOverflow>
                  {isLoadingSerie ?
                    <Loading />
                    :
                    listSerie?.items?.map((serieItem) => (
                      <FormCheck
                        key={serieItem.SER_ID}
                        id={serieItem.SER_ID}
                        className=""
                      >
                        <Form.Check.Input onChange={() => handleChangeSelectSerie(serieItem)} value={serieItem} name="mySelectedSerie" type={"checkbox"} checked={verifyMySelectedSerie(serieItem)} />
                        <FormCheckLabel>
                          <div>{serieItem.SER_NOME}</div>
                        </FormCheckLabel>
                      </FormCheck>
                  ))}
                </ListOverflow>
              </List>
            </CardSelectionSide>
          )}

          {areaActive === 3 && (
            <CardSelectionSide>
              <Title>Selecionar Turmas</Title>
              <AutoCompletePagMun county={munFilter} changeCounty={handleChangeMunFilter} showUf={true} />
              <Autocomplete
                sx={{background: "#FFF", marginTop: '10px'}}
                fullWidth
                className=""
                data-test='serie'
                id="serie"
                size="small"
                value={serie}
                noOptionsText="Série"
                options={listSerie?.items || []}
                loading={isLoadingSerie}
                getOptionLabel={option => option.SER_NOME}
                onChange={(_event, newValue) => {
                  handleChangeSerie(newValue)
                }}
                disabled={!munFilter}
                renderInput={(params) => <TextField size="small" {...params} label="Série" />}
              />
              <List>
                <FormCheck
                  key={"turma"}
                  id={"turma"}
                  className=""
                >
                  <Form.Check.Input onChange={handleSelectAllSchoolClasses} value={"all"} name="Turmas" type={"checkbox"} checked={selectAllActiveSchoolClass} />
                  <FormCheckLabel>
                    <div>Todas ({listSchoolClass?.meta?.totalItems || 0})</div>
                  </FormCheckLabel>
                </FormCheck>
                <ListOverflow>
                  {isLoadingSchoolClass ?
                    <Loading />
                    :
                    listSchoolClass?.items?.map((turmaItem) => (
                      <FormCheck
                        key={turmaItem.TURMA_TUR_ID}
                        id={turmaItem.TURMA_TUR_ID}
                        className=""
                      >
                        <Form.Check.Input onChange={() => handleChangeSelectSchoolClass(turmaItem)} value={turmaItem} name="mySelectedSchoolClass" type={"checkbox"} checked={verifyMySelectedSchoolClass(turmaItem)} />
                        <FormCheckLabel>
                          <div>{turmaItem.TURMA_TUR_NOME}</div>
                        </FormCheckLabel>
                      </FormCheck>
                  ))}
                </ListOverflow>
              </List>
            </CardSelectionSide>
          )}
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
              <>
                {listAddSerie.map((x) => (
                  <ButtonDest key={x.SER_ID} onClick={() => {handleRemoveSerie(x.SER_ID)}}>
                    {x.SER_NOME}
                    <MdClose color={"#4B4B4B"} size={18}/>
                  </ButtonDest>
                ))}
              </>
              <>
                {listAddSchoolClass.map((x) => (
                  <ButtonDest key={x.TURMA_TUR_ID} onClick={() => {handleRemoveSchoolClass(x.TURMA_TUR_ID)}}>
                    {x.TURMA_TUR_NOME}
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