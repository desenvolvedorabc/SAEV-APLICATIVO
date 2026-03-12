import { Form } from "react-bootstrap";
import { useFormik } from 'formik';
import { SelectionSide, Title, List, ListOverflow, FormCheck, FormCheckLabel, CardSelectionSide, MessageSide, ButtonDest, ButtonDestList, TopMessage, CardButtons, ButtonArea } from './styledComponents'
import {ButtonPadrao} from 'src/components/buttons/buttonPadrao';
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
import { useGetSeries, useGetAllSeries } from "src/services/series.service";
import { Editor } from "src/components/editor";

type ValidationErrors = Partial<{ title: string, content: string, filter: string }>

export default function FormCreateMessageTutores({ school, serie, schoolClass, changeSerie, changeSchoolClass, reloadTrigger }) {
  const [ModalShowConfirm, setModalShowConfirm] = useState(false)
  const [modalStatus, setModalStatus] = useState(true)
  const [modalShowWarning, setModalShowWarning] = useState(false)
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
  const [destinatarios, setDestinatarios] = useState([])
    
  const { data: allSeries, isLoading: isLoadingAllSeries } = useGetAllSeries('1');

  const { data: classList, isLoading: isLoadingSchoolClass } = useGetSchoolClasses(
    null, 
    1, 
    9999, 
    'TURMA_TUR_ANO', 
    "ASC", 
    null,
    null,
    school?.ESC_ID === 'ALL' ? null : school?.ESC_ID,
    serie?.SER_ID === 'ALL' ? null : serie?.SER_ID,
    null,
    1,
    !!serie
  );

  /* eslint-disable-next-line no-use-before-define */
  useEffect(() => {
    if(classList && serie && !schoolClass) {
      setSelectedClass(classList.items)
    } else if (!serie) {
      setSelectedClass([])
    }
  }, [classList, serie, schoolClass, reloadTrigger])

  useEffect(() => {
    let newDestinatarios = []

    if (school && !serie) {
      selectedSeries.forEach(serieItem => {
        newDestinatarios.push({
          id: serieItem.SER_ID,
          type: 'serie',
          name: serieItem.SER_NOME,
          removable: true
        })
      })
    } else if (serie && !schoolClass) {
      selectedClass.forEach(classItem => {
        newDestinatarios.push({
          id: classItem.TURMA_TUR_ID,
          type: 'turma',
          name: classItem.TURMA_TUR_NOME,
          removable: true
        })
      })
    } else if (schoolClass) {
      newDestinatarios = []
    }

    setDestinatarios(newDestinatarios)
  }, [school, serie, schoolClass, selectedSeries, selectedClass])

  const handleRemoveDestinatario = (id, type) => {
    if (type === 'serie') {
      setSelectedSeries(selectedSeries.filter(item => item.SER_ID !== id))
      const remainingSeries = selectedSeries.filter(item => item.SER_ID !== id)
      if (remainingSeries.length === 0 && serie) {
        changeSerie(null)
      }
    } else if (type === 'turma') {
      setSelectedClass(selectedClass.filter(item => item.TURMA_TUR_ID !== id))
      const remainingClasses = selectedClass.filter(item => item.TURMA_TUR_ID !== id)
      if (remainingClasses.length === 0 && schoolClass) {
        changeSchoolClass(null)
      }
    } else if (type === 'aluno') {
      setListAddAluno(listAddAluno.filter(item => item.ALU_ID !== id))
      setMySelected([...mySelected.filter((x) => x.ALU_ID !== id)])
    }
  }

  const { data: seriesList, isLoading: isLoadingSerie } = useGetSeries(
    null, 
    1, 
    9999, 
    null, 
    "ASC", 
    school?.ESC_ID === 'ALL' ? null : school?.ESC_ID,
    '1',
    !!school
  );

  useEffect(() => {
    if(school?.ESC_ID === 'ALL' && allSeries && !serie) {
      setSelectedSeries(allSeries)
    } else if(seriesList && school && !serie) {
      setSelectedSeries(seriesList.items)
    } else if (!school) {
      setSelectedSeries([])
    }
  }, [seriesList, allSeries, school, serie, reloadTrigger])

  const normalizedSchoolId = school?.ESC_ID === 'ALL' ? null : school?.ESC_ID
  const normalizedSerieId = serie?.SER_ID === 'ALL' ? null : serie?.SER_ID
  const normalizedClassId = normalizedSerieId === null ? null : schoolClass?.TURMA_TUR_ID

  const { data: students, isLoading: isLoadingStudents } = useGetStudents({
    search: searchAluno,
    page: 1,
    limit: 99999,
    column: null,
    order: 'ASC',
    stateId: null,
    county: null,
    typeSchool: null,
    school: normalizedSchoolId,
    status: null,
    serie: normalizedSerieId,
    schoolClass: normalizedClassId,
    active: "1",
    enabled: !!school && !!schoolClass
  });

  useEffect(() => {
    if (!schoolClass) {
      setMySelected([])
      setselectAllActive(false)
      setListAddAluno([])
    }
  }, [schoolClass])

  useEffect(() => {
    if (!school) {
      setSelectedSeries([])
      setSelectedClass([])
      setMySelected([])
      setListAddAluno([])
      setselectAllActive(false)
    }
  }, [school])

  useEffect(() => {
    if (!serie) {
      setSelectedClass([])
      setMySelected([])
      setListAddAluno([])
      setselectAllActive(false)
    }
  }, [serie])


  const { data, isLoading } = useGetMessageTemplates(null, 1, 999999, null, 'ASC');

  const validate = values => {
    const errors: ValidationErrors = {};
    if (!values.title) {
      errors.title = 'Campo obrigatório';
    } else if (values.title.length < 6) {
      errors.title = 'Deve ter no minimo 6 caracteres';
    }
    if (!limparHTML(values.content)) {
      errors.content = 'Campo obrigatório';
    }
    
    const hasValidDestinatarios = destinatarios.length > 0 || listAddAluno.length > 0
    if (!hasValidDestinatarios){
      errors.filter = 'Obrigatório pelo menos um destinatário. Selecione uma escola, série, turma ou alunos específicos.';
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
      let listClass = []
      let listStudents = []
      
      // Coletar séries dos destinatários
      destinatarios
        .filter(d => d.type === 'serie')
        .forEach(d => listSeries.push(d.id))
      
      // Coletar turmas dos destinatários
      destinatarios
        .filter(d => d.type === 'turma')
        .forEach(d => listClass.push(d.id))
      
      // Coletar alunos selecionados
      listAddAluno.forEach(x => {
        listStudents.push(x.ALU_ID)
      })

      const data = {
        ...values,
        filters: {
          schoolId: school?.ESC_ID === 'ALL' ? null : school?.ESC_ID,
          serieId: serie?.SER_ID === 'ALL' ? null : serie?.SER_ID,
          schoolClassId: schoolClass?.TURMA_TUR_ID === 'ALL' ? null : schoolClass?.TURMA_TUR_ID,
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

  useEffect(() => {
    let students = []
    mySelected.map((x) => {
        students.push(x)
    })
    setListAddAluno(students)
  }, [mySelected])

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
              size="small"
              error={formik.touched.title && formik.errors.title !== undefined}
              helperText={formik.touched.title && formik.errors.title}
              sx={{
                backgroundColor: "#FFF"
              }}
            />
            <Title style={{marginTop: 10}}>Destinatários:</Title>
            {formik.errors.filter !== undefined && (
              <ErrorText>{formik.errors.filter}</ErrorText>
            )}
            <ButtonDestList>
              <>
                {destinatarios.map((destinatario) => (
                  <ButtonDest 
                    key={`${destinatario.type}-${destinatario.id}`} 
                    onClick={() => destinatario.removable ? handleRemoveDestinatario(destinatario.id, destinatario.type) : {}}
                  >
                    {destinatario.type === 'municipio' && `Município: ${destinatario.name}`}
                    {destinatario.type === 'escola' && `Escola: ${destinatario.name}`}
                    {destinatario.type === 'serie' && `Série: ${destinatario.name}`}
                    {destinatario.type === 'serie_all' && `${destinatario.name}`}
                    {destinatario.type === 'turma' && `Turma: ${destinatario.name}`}
                    {destinatario.removable && <MdClose color={"#4B4B4B"} size={18}/>}
                  </ButtonDest>
                ))}
                
                {listAddAluno.map((x) => (
                  <ButtonDest key={x.ALU_ID} onClick={() => {handleRemoveDestinatario(x.ALU_ID, 'aluno')}}>
                    {x.ALU_NOME}
                    <div>
                      <MdClose color={"#4B4B4B"} size={18}/>
                    </div>
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
        text={modalStatus ? `Mensagem agendada para envio com sucesso.` : errorMessage || "Erro ao enviar mensagem"
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