import { Form } from "react-bootstrap";
import { useFormik } from 'formik';
import { SelectionSide, Title, List, ListOverflow, FormCheck, FormCheckLabel, CardSelectionSide, MessageSide, ButtonDest, ButtonDestList, TopMessage, CardButtons, ButtonArea, ButtonCard } from './styledComponents'
import {ButtonPadrao} from 'src/components/buttons/buttonPadrao';
import ButtonWhite from 'src/components/buttons/buttonWhite';
import ModalConfirmacao from 'src/components/modalConfirmacao';
import ModalAviso from 'src/components/modalAviso';
import { useEffect, useState } from 'react';
import Router from 'next/router'
import ButtonVermelho from "src/components/buttons/buttonVermelho";
import {Autocomplete, Checkbox, FormControlLabel, TextField} from '@mui/material';
import { MdClose } from "react-icons/md"
import { Loading } from "src/components/Loading";
import { useGetStudents } from "src/services/alunos.service";
import { createMessageTutor, useGetMessageTemplates } from "src/services/mensagens-tutores.service";
import ErrorText from "src/components/ErrorText";
import { limparHTML } from "src/utils/limparHtml";
import { queryClient } from "src/lib/react-query";
import { useAuth } from "src/context/AuthContext";
import { useGetSchoolClasses } from "src/services/turmas.service";
import { useGetSeries } from "src/services/series.service";
import { Editor } from "src/components/editor";

type ValidationErrors = Partial<{ title: string, content: string, filter: string }>

export default function FormCreateMessageTutores({ county, school, serie, schoolClass }) {
  const { user } = useAuth()
  const [ModalShowConfirm, setModalShowConfirm] = useState(false)
  const [modalStatus, setModalStatus] = useState(true)
  const [modalShowWarning, setModalShowWarning] = useState(false)
  const [modalShowQuestion, setModalShowQuestion] = useState(false)
  const [errorMessage, setErrorMessage] = useState(true)
  const [searchAluno, setSearchAluno] = useState(null)
  const [studentFilter, setStudentFilter] = useState(null)
  const [selectAllActive, setselectAllActive] = useState(false)
  const [selectAllActiveSchool, setselectAllActiveSchool] = useState(false)
  const [mySelected, setMySelected] = useState([])
  const [mySelectedSchool, setMySelectedSchool] = useState([])
  const [listAddAluno, setListAddAluno] = useState([])
  const [text, setText] = useState("")
  const [disableAll, setDisableAll] = useState(false)
  const [areaActive, setAreaActive] = useState(true)
  const [isDisabled, setIsDisabled] = useState(false);
  const [saveModel, setSaveModel] = useState(false)
  const [selectedModel, setSelectedModel] = useState(null)
  const [selectedEmail, setSelectedEmail] = useState(null)
  const [selectedWhatsapp, setSelectedWhatsapp] = useState(null)
  const [selectedSeries, setSelectedSeries] = useState([])
  const [selectedClass, setSelectedClass] = useState([])
    
  const { data: classList, isLoading: isLoadingSchoolClass } = useGetSchoolClasses(
    null, 
    1, 
    9999, 
    'TURMA_TUR_ANO', 
    "ASC", 
    null,
    null,
    school?.ESC_ID,
    serie?.SER_ID,
    null,
    1,
    !!serie
  );

  useEffect(() => {
    if(classList){
      setSelectedClass(classList.items)
    }
  }, [classList])

  const handleDeleteClass = (id) => {
    setSelectedClass(selectedClass.filter(item => item.TURMA_TUR_ID !== id))
  }

  const { data: seriesList, isLoading: isLoadingSerie } = useGetSeries(
    null, 
    1, 
    9999, 
    null, 
    "ASC", 
    school?.ESC_ID,
    '1',
    !!school
  );

  useEffect(() => {
    if(seriesList){
      setSelectedSeries(seriesList.items)
    }
  }, [seriesList])

  const handleDeleteSerie = (id) => {
    setSelectedSeries(selectedSeries.filter(item => item.SER_ID !== id))
  }

  const { data: students, isLoading: isLoadingStudents } = useGetStudents({
    search: searchAluno,
    page: 1,
    limit: 99999,
    column: null,
    order: 'ASC',
    stateId: null, //filterState?.id,
    county: user?.USU_MUN?.MUN_ID,
    typeSchool: null,
    school: school?.ESC_ID,
    status: null,
    serie: serie?.SER_ID,
    schoolClass: schoolClass?.TURMA_TUR_ID,
    active: "1",
    enabled: !!schoolClass
  });


  const { data, isLoading } = useGetMessageTemplates(null, 1, 999999, null, 'ASC');

  const validate = values => {
    console.log('values :', values);
    const errors: ValidationErrors = {};
    if (!values.title) {
      errors.title = 'Campo obrigatório';
    } else if (values.title.length < 6) {
      errors.title = 'Deve ter no minimo 6 caracteres';
    }
    if (!limparHTML(values.content)) {
      errors.content = 'Campo obrigatório';
    }
    if (!school){
      errors.filter = 'Obrigatório pelo menos um destinatário';
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      title: "",
      content: "",
    },
    validate,
    onSubmit: async (values) => {
      setIsDisabled(true)
      values.content = text

      let listSeries = []
      if(!serie){
        selectedSeries.map(x => {
          listSeries.push(x.SER_ID)
        })
      }

      let listClass = []
      if(!schoolClass){
        selectedClass.map(x => {
          listClass.push(x.TURMA_TUR_ID)
        })
      }
      let listStudents = []
      if(schoolClass){
        listAddAluno.map(x => {
          listStudents.push(x.ALU_ID)
        })
      }

      const data = {
        ...values,
        filters: {
          countyId: county?.MUN_ID,
          schoolId: school?.ESC_ID,
          serieId: serie?.SER_ID,
          schoolClassId: schoolClass?.TURMA_TUR_ID,
          schoolClassIds: listClass,
          serieIds: listSeries,
          studentIds: listStudents,
          active: 1,
        },
        newTemplate: saveModel,
        forWpp: selectedWhatsapp ? 1 : 0,
        forEmail: selectedEmail ? 1 : 0
      }

      let response = null;
      response = await createMessageTutor(data)
      setIsDisabled(false)

      if (!response.data.message) {
        setModalStatus(true)
        setModalShowConfirm(true)
        queryClient.invalidateQueries(['tutor-messages'])
        queryClient.invalidateQueries(['messages-template'])
      }
      else {
        setErrorMessage(response.data.message || 'Erro ao enviar mensagem')
        setModalStatus(false)
        setModalShowConfirm(true)
      }
    }
  });
  
  const handleChangeSearchAluno = (e) => {
    setSearchAluno(e.target.value)
  }

  const handleChangeAlunoFilter = (newValue) => {
    setStudentFilter(newValue)
    setMySelectedSchool([])
    setselectAllActiveSchool(false)
  }

  function onKeyDown(keyEvent) {
    if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
      keyEvent.preventDefault();
    }
  }

  const handleSelectAll =  () => {
    if (!selectAllActive) {
      let list = []

      students?.items?.forEach(async(x, index) => {
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

  const handleChangeSelect = (student) => {
    if (mySelected.some((x) => x.ALU_ID == student.ALU_ID)) {
      setMySelected([...mySelected.filter((x) => x.ALU_ID !== student.ALU_ID)])
    }
    else {
      setMySelected([...mySelected, student])
    }
  }
  
  const verifyMySelected = (student) => {
    return !!mySelected.find((item) => {
      return student?.ALU_ID === item?.ALU_ID
    })
  }

  const handleAddSelecteds = () => {
    let students = listAddAluno.concat()
    mySelected.map((x) => {
      if (!listAddAluno.some((student) => student.ALU_ID == x.ALU_ID)) {
        students.push(x)
      }
    })
    setListAddAluno(students)
  }

  const handleRemoveAluno = (idAluno) => {
    setListAddAluno([...listAddAluno.filter((x) => x.ALU_ID !== idAluno)])
  }

  const handleChangeText = (value) => {
    setText(value)
    formik.setFieldValue('content', value, true);
  }

  return (
    <>
      <div className="d-flex">
        {schoolClass &&
          <SelectionSide className="d-flex flex-column me-3">
            <div className="d-flex">
              <ButtonArea type="button" onClick={() => { setAreaActive(true) }} active={areaActive} style={{marginRight: 13}}>
                Alunos
              </ButtonArea>
            </div>
            <CardSelectionSide>
              <Title>Filtrar por:</Title>
              <div className="col mt-2 mb-3">
                <TextField
                  fullWidth
                  label="Buscar"
                  name="searchAluno"
                  id="searchAluno"
                  value={searchAluno}
                  onChange={handleChangeSearchAluno}
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
                  key={"student"}
                  id={"student"}
                  className=""
                >
                  <Form.Check.Input onChange={handleSelectAll} value={"all"} name="students" type={"checkbox"} checked={selectAllActive} disabled={disableAll} />
                  <FormCheckLabel>
                    <div>Selecionar Todos</div>
                  </FormCheckLabel>
                </FormCheck>
                <ListOverflow>
                  {isLoadingStudents ?
                    <Loading />
                    :
                    students?.items?.map(x => {
                      return (
                        <FormCheck
                          key={x.ALU_ID}
                          id={x.ALU_ID}
                          className=""
                        >
                          <Form.Check.Input onChange={() => handleChangeSelect(x)} value={x} name="mySelected" type={"checkbox"} checked={verifyMySelected(x)} />
                          <FormCheckLabel>
                            <div>{x.ALU_NOME}</div>
                          </FormCheckLabel>
                        </FormCheck>
                      )
                    })
                  }
                </ListOverflow>
              </List>
            </CardSelectionSide>
            <ButtonCard>
              <div style={{width: "100%"}}>
                <ButtonWhite onClick={() => {handleAddSelecteds()}}>Adicionar</ButtonWhite>
              </div>
            </ButtonCard>
          </SelectionSide>
        }
        <MessageSide className="col">
          <TopMessage>
            <TextField
              fullWidth
              label="Título da Mensagem"
              name="title"
              id="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onKeyDown={onKeyDown} 
              onDragEnter={(e) => e.preventDefault()} 
              onSubmit={(e) => e.preventDefault()}
              size="small"
              error={formik.touched.title && formik.errors.title !== undefined}
              helperText={formik.touched.title && formik.errors.title}
              sx={{
                backgroundColor: "#FFF"
              }}
            />
            <Title style={{marginTop: 10}}>Destinatários:</Title>
            {console.log('erros', formik.touched.filter, formik.errors.filter)}
            {formik.errors.filter !== undefined && (
              <ErrorText>{formik.errors.filter}</ErrorText>
            )}
            <ButtonDestList>
              <>
                {school && !serie &&
                  selectedSeries?.map((x) => (
                    <ButtonDest key={x.SER_ID} onClick={() => {handleDeleteSerie(x.SER_ID)}}>
                      {x.SER_NOME}
                      <MdClose color={"#4B4B4B"} size={18}/>
                    </ButtonDest>
                  ))
                }
                {serie && !schoolClass &&
                  selectedClass?.map((x) => (
                    <ButtonDest key={x.TURMA_TUR_ID} onClick={() => {handleDeleteClass(x.TURMA_TUR_ID)}}>
                      {x.TURMA_TUR_NOME}
                      <MdClose color={"#4B4B4B"} size={18}/>
                    </ButtonDest>
                  ))
                }
                {/* {schoolClass && listAddAluno.length === 0 &&
                  <ButtonDest
                    key={schoolClass.TURMA_TUR_ID} 
                    onClick={() => {handleRemoveAluno(schoolClass.TURMA_TUR_ID)}}
                  >
                    {schoolClass.TURMA_TUR_NOME}
                    <MdClose color={"#4B4B4B"} size={18}/>
                  </ButtonDest>
                } */}
                {listAddAluno.map((x) => (
                  <ButtonDest key={x.ALU_ID} onClick={() => {handleRemoveAluno(x.ALU_ID)}}>
                    {x.ALU_NOME}
                    <MdClose color={"#4B4B4B"} size={18}/>
                  </ButtonDest>
                ))}
              </>
            </ButtonDestList>
            <div style={{width: 280, marginTop: 20}}>
              <Autocomplete
                className=""
                id="model"
                size="small"
                value={selectedModel}
                noOptionsText="Utilizar um modelo de mensagem"
                options={data?.items || []}
                getOptionLabel={(option) => `${option.title}`}
                onChange={(_event, newValue) => {
                  setSelectedModel(newValue);
                }}
                renderInput={(params) => (
                  <TextField size="small" {...params} label="Utilizar um modelo de mensagem" />
                )}
              />
            </div>
          </TopMessage>
          <div className="mx-3 mb-3">
            <Editor changeText={handleChangeText} minHeight={"400px"} initialValue={selectedModel?.content} tutor />
            {formik.touched.content && formik.errors.content !== undefined && (
              <ErrorText>{formik.errors.content}</ErrorText>
            )}
          </div>
          <div className="my-3">
            <div className="d-flex justify-content-end mt-2">
              <div style={{fontSize: 12, fontWeight: 400, color: "#4B4B4B", display: "flex", alignItems: "center", marginRight: 20}}>
                Enviar por:
              </div>
              <FormControlLabel 
                sx={{
                  border: '1px solid #D4D4D4',
                  borderRadius: '8px',
                  paddingRight: '10px',

                  '& .MuiFormControlLabel-label': {
                    fontSize: 12,
                    fontWeight: 400,
                  }
                }} 
                control={
                  <Checkbox />
                } 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelectedEmail(e.target.checked)}
                label="E-mail" 
              />
              <FormControlLabel 
                sx={{
                  border: '1px solid #D4D4D4',
                  borderRadius: '8px',
                  paddingRight: '10px',
                  marginRight: "30px",

                  '& .MuiFormControlLabel-label': {
                    fontSize: 12,
                    fontWeight: 400,
                  }
                }} 
                control={
                  <Checkbox />
                } 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelectedWhatsapp(e.target.checked)}
                label="WhatsApp" 
              />
              <FormControlLabel 
                sx={{
                  border: '1px solid #D4D4D4',
                  borderRadius: '8px',
                  paddingRight: '10px',

                  '& .MuiFormControlLabel-label': {
                    fontSize: 12,
                    fontWeight: 400,
                  }
                }} 
                control={
                  <Checkbox />
                } 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSaveModel(e.target.checked)}
                label="Salvar como modelo" 
              />
            </div>
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
            onClick={(e) => formik.handleSubmit(e)} 
            disable={isDisabled}
          >
            Enviar
          </ButtonPadrao>
        </div>
      </CardButtons>
      <ModalConfirmacao
        show={ModalShowConfirm}
        onHide={() => { setModalShowConfirm(false), modalStatus && Router.back()}}
        text={modalStatus ? `Mensagem enviada com sucesso.` : errorMessage || "Erro ao enviar mensagem"
        }
        status={modalStatus}
      />
      <ModalAviso
        show={modalShowWarning}
        onHide={() => setModalShowWarning(false)}
        onConfirm={() => { Router.back() }}
        buttonYes={'Sim, Descartar Mensagem'}
        buttonNo={'Manter Mensagem'}
        text={`Tem certeza que deseja descartar a mensagem atual?`}
      />
    </>
  )
}