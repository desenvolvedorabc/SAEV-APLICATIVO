import { Form } from "react-bootstrap";
import {ButtonPadrao} from 'src/components/buttons/buttonPadrao';
import { InputGroup, ButtonGroup, Card, InputGroup2, AddInputGroup, ButtonExcluir, ButtonAdicionar, InputControl, RepeatableInput, ButtonAddTopico, FormSelect } from './styledComponents';
import ButtonWhite from '../../buttons/buttonWhite';
import ButtonVermelho from '../../buttons/buttonVermelho';
import ErrorText from '../../ErrorText';
import ModalConfirmacao from '../../modalConfirmacao';
import ModalAviso from '../../modalAviso';
import { useEffect, useState, useRef } from 'react';
import Router from 'next/router'
import { BiTrash } from "react-icons/bi"
import { MdControlPoint } from "react-icons/md"
import { editReference, getAllDisciplinas, getAllSeries, setActiveDescriptors } from "src/services/referencias.service";
import ModalPergunta from "src/components/modalPergunta";
import { Autocomplete, FormControl, TextField } from "@mui/material";
import { CSVLink } from "react-csv";
import { useFormik } from "formik";

type ValidationErrors = Partial<{ MAR_NOME: string, MAR_DIS: string, MAR_SER: string, MAR_MTO: string }>

export default function FormEditMatriz({ matriz }) {

  const [ModalShowConfirm, setModalShowConfirm] = useState(false)
  const [modalShowUndo, setModalShowUndo] = useState(false)
  const [modalShowConfirmUndo, setModalShowConfirmUndo] = useState(false)
  const [modalShowQuestion, setModalShowQuestion] = useState(false)
  const [modalShowConfirmQuestion, setModalShowConfirmQuestion] = useState(false)
  const [modalShowQuestionDescription, setModalShowQuestionDescription] = useState(false)
  const [modalShowConfirmQuestionDescription, setModalShowConfirmQuestionDescription] = useState(false)
  const [modalStatus, setModalStatus] = useState(true)
  const [active, setActive] = useState(matriz?.MAR_ATIVO)
  const [series, setSeries] = useState([])
  const [selectedSeries, setSelectedSeries] = useState([]);
  const [disciplina, setDisciplina] = useState([])
  const [listInputs, setListInputs] = useState([{ MTI_CODIGO: "", MTI_DESCRITOR: "", MTI_STATUS: "" }])
  const [listTopics, setListTopics] = useState(matriz?.MAR_MTO)
  const [errorMessage, setErrorMessage] = useState(null)
  const [csv, setCsv] = useState([])
  const [selectedDescription, setSelectedDescription] = useState(null)
  const [isDisabled, setIsDisabled] = useState(false);
  const csvLink = useRef(undefined)

  const validate = values => {
    const errors: ValidationErrors = {};
    if (!values.MAR_NOME) {
      errors.MAR_NOME = 'Campo obrigatório';
    } else if (values.MAR_NOME.length < 2) {
      errors.MAR_NOME = 'Deve ter no minimo 2 caracteres';
    }
    if (!values.MAR_DIS) {
      errors.MAR_DIS = 'Campo obrigatório';
    }
    if (!values.MAR_SER) {
      errors.MAR_SER = 'Campo obrigatório';
    }
    return errors;
  };

  const verifyTopicEmpty = () => {
    let topicEmpty = []
    let descEmpty = []

    listTopics.map((topic, index) => {
      descEmpty = []
      topic.MTO_MTI.map((desc, index2) => {
        if(desc.MTI_CODIGO == "" || desc.MTI_DESCRITOR == ""){
          descEmpty.push(index2)
        }
      })
      topic.MTO_MTI = topic.MTO_MTI.filter((desc, index2) => !descEmpty.includes(index2))

      if(topic.MTO_MTI.length === 0){
        topicEmpty.push(index)
      }
    })

    const list = listTopics.filter((topic, index) => !topicEmpty.includes(index))
    setListTopics(list)

    return list
  }

  const formik = useFormik({
    initialValues: {
      MAR_NOME: matriz?.MAR_NOME,
      MAR_DIS: matriz?.MAR_DIS?.DIS_ID,
      MAR_SER: matriz?.MAR_SER,
      MAR_MTO: matriz?.MAR_MTO,
      MAR_ATIVO: matriz?.MAR_ATIVO,
      MAR_ID: matriz?.MAR_ID,
    },
    validate,
    onSubmit: async (values) => {
      values.MAR_SER = selectedSeries;
      values.MAR_MTO = verifyTopicEmpty()

      let error = false;
      values.MAR_MTO.forEach((element, index) => {
        element.MTO_MTI.forEach((el, indexEl) => {
          if(el.MTI_ATIVO !== false){
            if(getErrorCode(index, indexEl))
              error = true;
          }
        });
      });

      if(error){
        setModalStatus(false);
        setModalShowConfirm(true);
        setErrorMessage("Existem códigos duplicados");

        return
      }

      setIsDisabled(true)
      let response = null;
      try{
        response = await editReference(values.MAR_ID, values)
      }
      catch (err) {
        setIsDisabled(false)
      } finally {
        setIsDisabled(false)
      }

      if (response.status === 200 && response.data.MAR_NOME === values.MAR_NOME) {
        setModalStatus(true)
        setModalShowConfirm(true)
      }
      else {
        setModalStatus(false)
        setModalShowConfirm(true)
        setErrorMessage(response.data.message || 'Erro ao editar matriz de referência')
      }
    }
  });

  async function changeMatriz() {
    const matrizChanged = {
      MAR_ATIVO: !matriz.MAR_ATIVO,
      MAR_ID: matriz.MAR_ID
    }

    const response = await editReference(matrizChanged.MAR_ID, matrizChanged)
    if (response.status === 200 && response.data.MAR_ID === matriz.MAR_ID) {
      setActive(matrizChanged.MAR_ATIVO)
      setModalShowConfirmQuestion(true)
      setModalStatus(true)
    }
    else {
      setModalStatus(false)
      setModalShowConfirmQuestion(true)
    }
  }

  const loadSeries = async () => {
    const resp = await getAllSeries()
    setSeries(resp.data)
  }

  const loadDisciplinas = async () => {
    const resp = await getAllDisciplinas()
    setDisciplina(resp.data)
  }

  const addInput = (index) => {
    listTopics[index].MTO_MTI.push({ MTI_CODIGO: "", MTI_DESCRITOR: "", MTI_STATUS: "" });
    setListTopics([...listTopics])
  }

  const changeActiveDescriptor = async () => {
    const resp = await setActiveDescriptors(selectedDescription?.MTI_ID)

    if(resp.data.status === 401){
      setModalStatus(false)
    }
    else{
      setModalStatus(true)

      listTopics.forEach(listTopic => {
        listTopic.MTO_MTI.forEach(x => {
          if(x.MTI_ID === selectedDescription.MTI_ID){
            x.MTI_ATIVO = !x.MTI_ATIVO;
          }
        })
      })
    }

    setModalShowConfirmQuestionDescription(true)

  }

  const handleDeleteInput = (position, positionItem) => {
    listTopics[position].MTO_MTI = listTopics[position].MTO_MTI.map((topicItem, index) => {
      if (index === positionItem) {
        topicItem.MTI_STATUS = 'DELETE'
      }
      return topicItem
    });

    setListTopics([...listTopics])

    formik.validateForm()
  }

  const addTopic = () => {
    setListTopics([...listTopics, {
      MTO_NOME: "",
      MTO_MTI: [
        { MTI_CODIGO: "", MTI_DESCRITOR: "", MTI_STATUS: "" }
      ]
    }])
  }

  const resetSeries = () => {
    setSelectedSeries(matriz.MAR_SER);
  }

  const handleChangeTopic = (e, index) => {
    formik.validateForm()
    listTopics[index].MTO_NOME = e.target.value;
    setListTopics([...listTopics])
  }


  const handleChangeCodigo = (e, index, indexItem) => {
    listTopics[index].MTO_MTI[indexItem].MTI_CODIGO = e.target.value;
    setListTopics([...listTopics])
    formik.validateForm()

  }

  const getErrorCode = (index: number, indexItem: number) => {
    let error = false;
    listTopics?.map((topic, indexTopic) => {
      topic?.MTO_MTI?.map((element, indexEl) => {
        if(listTopics[index].MTO_MTI[indexItem].MTI_CODIGO === element.MTI_CODIGO 
          && element.MTI_ATIVO !== false){
          if(!(index === indexTopic && indexItem === indexEl)){
            error = true;
          }
        }
      });
    })
    return error;
  };

  const handleChangeDescritor = (e, index, indexItem) => {
    listTopics[index].MTO_MTI[indexItem].MTI_DESCRITOR = e.target.value;
    setListInputs([...listInputs])
    formik.validateForm()
  }

  const handleChangeSerieList = (newValue) => {
    setSelectedSeries(newValue);
  }

  const createCsv = () => {
    const tempCsv = []
    tempCsv.push(['NOME', 'DISCIPLINA', 'SERIES', 'TOPICOS', 'CODIGO_DESCRITOR', 'DESCRITOR'])

    let listSeries = []
    matriz.MAR_SER?.map(x => listSeries.push(x.SER_NOME))
    
    let list = []

    matriz.MAR_MTO.map(x => {
      x.MTO_MTI.map(y => list.push({nome: matriz.MAR_NOME, disciplina: matriz.MAR_DIS.DIS_NOME, series: listSeries, topico: x.MTO_NOME, codigo_descritor: y.MTI_CODIGO, descritor: y.MTI_DESCRITOR}))
    })

    const matrizCSV = JSON.parse(JSON.stringify(list));
    matrizCSV.map((item) => {
      tempCsv.push(Object.values(item))
    });

    setCsv(tempCsv)
  }

  useEffect(() => {
    createCsv()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const downloadCsv = (e) => {
    // createCsv()
    // setTimeout(() => {
      csvLink.current.link.click()
    // }, 1000)
  }

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
        top: 205
      },
    },
  };

  useEffect(() => {
    loadSeries()
    loadDisciplinas()
    resetSeries()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Form onSubmit={formik.handleSubmit}>
        <Card>
          <InputGroup className="" controlId="formBasic">
            <div>
              <TextField
                fullWidth
                label="Nome"
                name="MAR_NOME"
                id="MAR_NOME"
                value={formik.values.MAR_NOME}
                onChange={formik.handleChange}
                size="small"
              />
              {formik.errors.MAR_NOME && formik.touched.MAR_NOME ? <ErrorText>{formik.errors.MAR_NOME}</ErrorText> : null}
            </div>
            <div>
              <FormSelect name="MAR_DIS" value={formik.values.MAR_DIS} onChange={formik.handleChange}>
                <option value="">Disciplina</option>
                {disciplina.map((item, index) => (
                  <option key={index} value={item.DIS_ID}>{item.DIS_NOME}</option>
                ))}
              </FormSelect>
              {formik.errors.MAR_DIS && formik.touched.MAR_DIS ? <ErrorText>{formik.errors.MAR_DIS}</ErrorText> : null}
            </div>
            <div>
              <FormControl sx={{ m: 0, width: 300 }}>
                <Autocomplete
                  multiple
                  className=""
                  id="size-small-outlined"
                  size="small"
                  value={selectedSeries}
                  noOptionsText="Séries"
                  options={series}
                  getOptionLabel={(option) => `${option.SER_NOME}`}
                  onChange={(_event, newValue) => {
                    handleChangeSerieList(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField size="small" {...params} label="Séries" />
                  )}
                  sx={{
                    backgroundColor: '#fff',
                  }}
                />
                {formik.errors.MAR_SER && formik.touched.MAR_SER ? (
                  <ErrorText>{formik.errors.MAR_SER}</ErrorText>
                ) : null}
              </FormControl>
              </div>
              <div className="">
                <ButtonWhite onClick={(e) => { downloadCsv(e) }}>Exportar</ButtonWhite>
                <CSVLink
                  data={csv}
                  filename="matriz-referencia.csv"
                  className="hidden"
                  ref={csvLink}
                  target="_blank" />
              </div>
          </InputGroup>
        </Card>
        {listTopics && listTopics?.map((group, index) => {
          return (
            <Card className="mt-3" key={index}>
              <InputGroup2>
                <TextField
                  fullWidth
                  label="Tópico"
                  name="Topico"
                  id="Topico"
                  value={group.MTO_NOME}
                  onChange={(e) => handleChangeTopic(e, index)}
                  size="small"
                />
              </InputGroup2>
              <div className="">
                {group.MTO_MTI?.map((input, indexItem) => (
                  input.MTI_STATUS !== 'DELETE' &&
                  <RepeatableInput key={indexItem} className="">
                    <div className="col-2">
                      <TextField
                        fullWidth
                        label="Código"
                        name={`MTI_CODIGO-${index}-${indexItem}`}
                        id={`MTI_CODIGO-${index}-${indexItem}`}
                        value={input.MTI_CODIGO}
                        onChange={(e) => handleChangeCodigo(e, index, indexItem)}
                        error={input.MTI_ATIVO !== false && getErrorCode(index, indexItem)}
                        helperText={input.MTI_ATIVO !== false && getErrorCode(index, indexItem) && 'Código duplicado'}
                        size="small"
                      />
                    </div>
                    <div className="col px-3">
                      <TextField
                        fullWidth
                        label="Descritor"
                        name={`MTI_DESCRITOR-${index}-${indexItem}`}
                        id={`MTI_DESCRITOR-${index}-${indexItem}`}
                        value={input.MTI_DESCRITOR}
                        onChange={(e) => handleChangeDescritor(e, index, indexItem)}
                        size="small"
                      />
                    </div>
                    <div className="" style={{width: 78}}>
                    {input?.MTI_ID ? 
                      input.MTI_ATIVO ? (
                        <ButtonVermelho type='button' onClick={(e) => { setSelectedDescription(input), setModalShowQuestionDescription(true) }}>
                          Desativar
                        </ButtonVermelho>) : (
                        <ButtonPadrao type='button' onClick={(e) => { setSelectedDescription(input), setModalShowQuestionDescription(true) }}>
                          Ativar
                        </ButtonPadrao>
                        )
                      :
                        <ButtonExcluir type="button" onClick={() => {handleDeleteInput(index, indexItem)}}>
                          <BiTrash color={"#FF6868"} size={16} />
                        </ButtonExcluir>
                    }
                    </div>
                  </RepeatableInput>
                ))}
              </div>
              <AddInputGroup>
                <div className="col-2">
                  <InputControl type="text" disabled placeholder="Código" />
                </div>
                <div className="col px-3">
                  <InputControl type="text" disabled placeholder="Descritor" />
                </div>
                <div className="">
                  <ButtonAdicionar type="button" onClick={() => addInput(index)}><MdControlPoint color={"#FFF"} size={16} /></ButtonAdicionar>
                </div>
              </AddInputGroup>
            </Card>
          )
        })}
        <ButtonAddTopico type="button" onClick={() => addTopic()}>
          <MdControlPoint color={"#3E8277"} size={35} />
        </ButtonAddTopico>
        <ButtonGroup >
          <div>
            {active ? (
              <ButtonVermelho onClick={(e) => { e.preventDefault(); setModalShowQuestion(true) }}>
                Desativar
              </ButtonVermelho>) : (
              <ButtonPadrao onClick={(e) => { e.preventDefault(); setModalShowQuestion(true) }}>
                Ativar
              </ButtonPadrao>)}
          </div>
          <div className="d-flex">
            <div style={{width:160}}>
              <ButtonWhite onClick={(e) => { e.preventDefault(); setModalShowUndo(true) }}>
                Cancelar
              </ButtonWhite>
            </div>
            <div className="ms-3" style={{width:160}}>
              <ButtonPadrao type="submit" onClick={(e) => { e.preventDefault(); formik.handleSubmit(e) }}  disable={!(formik.isValid) || isDisabled}>
                Salvar
              </ButtonPadrao>
            </div>
          </div>
        </ButtonGroup>
      </Form>
      <ModalConfirmacao
        show={ModalShowConfirm}
        onHide={() => { setModalShowConfirm(false), modalStatus && Router.reload() }}
        text={modalStatus ? `Matriz ${formik.values.MAR_NOME} alterada com sucesso!` : errorMessage}
        status={modalStatus}
      />
      <ModalAviso
        show={modalShowUndo}
        onHide={() => setModalShowUndo(false)}
        onConfirm={() => { Router.push('/matrizes-de-referencia') }}
        buttonYes={'Sim, Descartar Informações'}
        buttonNo={'Não Descartar Informações'}
        text={`Ao confirmar essa opção todas as informações serão perdidas.`}
      />
      <ModalConfirmacao
        show={modalShowConfirmUndo}
        onHide={() => { setModalShowConfirmUndo(false); Router.reload(); }}
        text={`As informações foram modificadas com sucesso!`}
        status={true}
      />
      <ModalPergunta
        show={modalShowQuestion}
        onHide={() => setModalShowQuestion(false)}
        onConfirm={() => changeMatriz()}
        buttonNo={active ? 'Não Desativar' : 'Não Ativar'}
        buttonYes={'Sim, Tenho Certeza'}
        text={`Você está ${!active === true ? 'ativando' : 'desativando'} a “${formik.values.MAR_NOME}”.`}
        status={!active}
        size="lg"
      />
      <ModalConfirmacao
        show={modalShowConfirmQuestion}
        onHide={() => { setModalShowConfirmQuestion(false); Router.reload(); }}
        text={modalStatus ? `${formik.values.MAR_NOME} ${active ? 'ativada' : 'desativada'} com sucesso!` : `Erro ao ${active ? "ativar" : "desativar"}`}
        status={modalStatus}
      />
      <ModalPergunta
        show={modalShowQuestionDescription}
        onHide={() => setModalShowQuestionDescription(false)}
        onConfirm={() => changeActiveDescriptor()}
        buttonNo={selectedDescription?.MTI_ATIVO ? 'Não Desativar' : 'Não Ativar'}
        buttonYes={'Sim, Tenho Certeza'}
        text={`Você está ${!selectedDescription?.MTI_ATIVO === true ? 'ativando' : 'desativando'} a “${selectedDescription?.MTI_CODIGO}”.`}
        status={!selectedDescription?.MTI_ATIVO}
        size="lg"
      />
      <ModalConfirmacao
        show={modalShowConfirmQuestionDescription}
        onHide={() => { setModalShowConfirmQuestionDescription(false), modalStatus && setModalShowQuestionDescription(false) }}
        text={modalStatus ? `Descritor ${selectedDescription?.MTI_ATIVO ? 'ativado' : 'desativado'} com sucesso!` : `Erro ao ${!selectedDescription?.MTI_ATIVO ? "ativar" : "desativar descritor"}`}
        status={modalStatus}
      />
    </>
  )
}