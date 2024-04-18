import { Form } from "react-bootstrap";
import { useFormik } from 'formik';
import {ButtonPadrao} from 'src/components/buttons/buttonPadrao';
import { InputGroup, ButtonGroup, Card, Card2, InputGroup2, ButtonExcluir, RepeatableInput, ButtonAddTopico, ButtonAnswer, AnswerNumber, FormSelect } from './styledComponents';
import ButtonWhite from 'src/components/buttons/buttonWhite';
import ErrorText from 'src/components/ErrorText';
import ModalConfirmacao from 'src/components/modalConfirmacao';
import ModalAviso from 'src/components/modalAviso';
import { useEffect, useState } from 'react';
import Router from 'next/router'
import { createTest } from 'src/services/testes.service'
import { BiTrash } from "react-icons/bi"
import { MdControlPoint } from "react-icons/md"
import PlusTen from "public/assets/images/plusTen.svg";
import InputFile from "src/components/InputFile";
import { getAllDisciplinas, getAllSeries, getReferences, getReference } from "src/services/referencias.service";
import { getAnos } from "src/utils/anos";
import { Autocomplete, FormControl, InputLabel, MenuItem, Select} from '@mui/material';
import TextField from '@mui/material/TextField';
import { ModalImportGabarito } from "../modalImportGabarito";
import { useGetYears } from "src/services/anos.service";
import ModalAvOnline from "src/components/modalAvOnline";

type ValidationErrors = Partial<{ TES_NOME: string, TES_DIS: string, TES_SER: string, TES_TEG: string, TES_ANO: string, TES_MAR: string }>

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function FormAddMatriz(props) {

  const [ModalShowConfirm, setModalShowConfirm] = useState(false)
  const [modalShowQuestion, setModalShowQuestion] = useState(false)
  const [modalShowQuestionChange, setModalShowQuestionChange] = useState(false)
  const [modalShowImportGabarito, setModalShowImportGabarito] = useState(false)
  const [modalShowAvOnline, setModalShowAvOnline] = useState(false)
  const [modalStatus, setModalStatus] = useState(true)
  const [testeFile, setTesteFile] = useState()
  const [manualFile, setManualFile] = useState()
  const [listDis, setListDis] = useState([])
  const [listSer, setListSer] = useState([])
  const [listMar, setListMar] = useState([])
  const [marDisable, setMarDisable] = useState(true)
  const [selectedDis, setSelectedDis] = useState(null)
  const [auxDis, setAuxDis] = useState(null)
  const [auxSer, setAuxSer] = useState(null)
  const [auxMar, setAuxMar] = useState(null)
  const [listDescritores, setListDescritores] = useState([])
  const [listSelectedDescritores, setListSelectedDescritores] = useState([])
  const [answers, setAnswers] = useState([])
  const [errorMessage, setErrorMessage] = useState('Erro ao criar Teste')
  const [isDisabled, setIsDisabled] = useState(false);
  const [idTeste, setIdTeste] = useState(null);

  let countGabarito = 1;

  const { data: dataYears } = useGetYears(null, 1, 999999, null, 'DESC', true);


  const validate = values => {
    const errors: ValidationErrors = {};
    if (!values.TES_NOME) {
      errors.TES_NOME = 'Campo obrigatório';
    } else if (values.TES_NOME.length < 2) {
      errors.TES_NOME = 'Deve ter no minimo 2 caracteres';
    }
    if (!values.TES_DIS) {
      errors.TES_DIS = 'Campo obrigatório';
    }
    if (!values.TES_SER) {
      errors.TES_SER = 'Campo obrigatório';
    }
    if (!values.TES_ANO) {
      errors.TES_ANO = 'Campo obrigatório';
    }
    if (selectedDis?.DIS_TIPO === "Objetiva" && !values.TES_MAR) {
      errors.TES_MAR = 'Campo obrigatório';
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      TES_NOME: "",
      TES_ANO: "",
      TES_DIS: "",
      TES_SER: "",
      TES_TEG: [],
      TES_ARQUIVO: "",
      TES_MANUAL: "",
      TES_MAR: "",
      TES_ATIVO: true,
    },
    validate,
    onSubmit: async (values) => {
      console.log('values :', values);
      console.log('selectedDis :', selectedDis);

      let checkAnswer = false;

      if(selectedDis?.DIS_TIPO === "Objetiva"){
        answers.forEach(answer => {
          if(!answer.TEG_MTI)
            checkAnswer = true;
        })
        if(checkAnswer){
          setErrorMessage('Existem campos em branco')
          setModalStatus(false)
          setModalShowConfirm(true)
          return
        }
      }

      let testeF = null
      if (testeFile) {
        testeF = testeFile
      }

      let manual = null
      if (manualFile) {
        manual = manualFile
      }

      if(selectedDis?.DIS_TIPO === "Objetiva"){
        answers.map((x, index) => {
          x.TEG_ORDEM = index
        })
        
        values.TES_TEG = answers
      }
      else{
        values.TES_TEG = []
      }

      
      setIsDisabled(true)
      let response = null;
      try{
        response = await createTest(values, testeF, manual)
      }
      catch (err) {
        setIsDisabled(false)
      } finally {
        setIsDisabled(false)
      }
      if (response.status === 200 && response.data.TES_NOME === values.TES_NOME) {
        setIdTeste(response.data.TES_ID)
        setModalStatus(true)
        setModalShowAvOnline(true)
        // setModalShowConfirm(true)
      }
      else {
        setModalStatus(false)
        setModalShowConfirm(true)
        setErrorMessage('Erro ao criar Teste')
      }
    }
  });


  const loadDisciplinas = async () => {
    const resp = await getAllDisciplinas()
    setListDis(resp.data)
  }

  const loadSeries = async () => {
    const resp = await getAllSeries()
    if(resp.data)
      setListSer(resp.data)
  }


  const loadMatrizes = async (dis, ser) => {
    const resp = await getReferences(null, 1, 9999, null, "ASC", dis, ser, '1')
    const filterData = resp?.data?.items?.filter((data) => !!data.MATRIZ_REFERENCIA_MAR_ATIVO)

    setListMar(filterData)
  }

  const loadDescritores = async (id) => {
    const resp = await getReference(id)
    const list = []
    resp.data?.MAR_MTO?.map(x => {
      x.MTO_MTI.map(el => {
        list.push(el)
      })
    })
    setListDescritores(list)
  }

  useEffect(() => {
    loadDisciplinas()
    loadSeries()
  }, [])

  const handleChangeDis = (e) => {
    let valor = e.target.value
    setSelectedDis(valor)
    if (formik.values.TES_MAR === "") {
      setAuxDis(valor?.DIS_ID)
      formik.setFieldValue('TES_DIS', valor?.DIS_ID)
    }
    else {
      setAuxDis(valor?.DIS_ID)
      handleChangeMatriz("")
    }
  }

  useEffect(() => {
    formik.validateForm();
  },[selectedDis])

  const handleChangeSer = (e) => {
    let valor = e.target.value
    if (formik.values.TES_MAR === "") {
      setAuxSer(valor)
      formik.setFieldValue('TES_SER', valor)
    }
    else {
      setAuxSer(valor)
      //e.target.value = ""
      handleChangeMatriz("")
    }
  }

  const handleChangeMatriz = (id) => {
    setAuxMar(id)
    if(answers.length > 0) {
      setModalShowQuestionChange(true)
    }
    else{
      confirmChangeMatriz(id);
    }
  }

  const confirmChangeMatriz = (idMatriz) => {
    // resetAnswers(),
    setModalShowQuestionChange(false),
    formik.setFieldValue('TES_DIS', auxDis)
    formik.setFieldValue('TES_SER', auxSer)
    formik.setFieldValue('TES_MAR', idMatriz ? idMatriz : auxMar)

    countGabarito = 1;
    setAnswers([
      {
        TEG_RESPOSTA_CORRETA: "A",
        TEG_MTI: null,
        TEG_ORDEM: countGabarito,
      },
    ]);
  }

  useEffect(() => {
    if (formik.values.TES_DIS !== "" && formik.values.TES_SER !== "") {
      setMarDisable(false)
      loadMatrizes(formik.values.TES_DIS, formik.values.TES_SER)
    }
    else {
      setMarDisable(true)
    }
  }, [formik.values.TES_DIS, formik.values.TES_SER])

  useEffect(() => {
    if (formik.values.TES_MAR === "") {
      setListDescritores([])
    }
    else {
      loadDescritores(formik.values.TES_MAR)
    }
  }, [formik.values.TES_MAR])

  const addAnswers = () => {
    countGabarito += 1;
    setAnswers([
      ...answers,
      {
        TEG_RESPOSTA_CORRETA: "A",
        TEG_MTI: null,
        TEG_ORDEM: countGabarito,
      },
    ]);
  };

  const handleDeleteAnswer = (position) => {
    setAnswers([...answers.filter((x, index) => index !== position)])
  }

  const addTenAnswers = () => {
    const teste = Array.from({
      length: 10
    }).map((_, index) => {
      countGabarito += 1;
     return  { TEG_RESPOSTA_CORRETA: "A", TEG_MTI: null, TEG_ORDEM: countGabarito  }
    })

    setAnswers([
      ...answers,
      ...teste
    ]);
  };

  const resetAnswers = () => {
    countGabarito = 1;
    setAnswers([
      {
        TEG_RESPOSTA_CORRETA: "A",
        TEG_MTI: null,
        TEG_ORDEM: countGabarito,
      },
    ]);

  }

  const handleChangeAnswer = (index, letter) => {
    answers[index].TEG_RESPOSTA_CORRETA = letter;
    setAnswers([...answers])
  }

  const handleChangeDescritor = (id, index) => {
    answers[index].TEG_MTI = id;
    setAnswers([...answers])
  }


  const checkAnswer = (answer, letter) => {
    if (answer === letter)
      return true
    return false;
  }

  const onTesteChange = (e) => {
    setTesteFile(e.target.value);
  };


  const onManualChange = (e) => {
    setManualFile(e.target.value);
  };

  const changeGabaritoImport = (gabarito) => {
    setAnswers([])

    let list = []
    gabarito.TES_TEG.forEach(x => {
      listDescritores.forEach(descritor => {
        if(descritor.MTI_CODIGO == x.TEG_MTI){
          list.push(descritor)
          x.TEG_MTI = descritor.MTI_ID
        }
    })})

    setListSelectedDescritores(list)
    setAnswers(gabarito.TES_TEG)
    formik.validateForm()
  };

  return (
    <>
      <Form onSubmit={formik.handleSubmit}>
        <Card>
          <InputGroup className="" controlId="formBasic">
            <div>
              <TextField
                fullWidth
                label="Nome"
                name="TES_NOME"
                id="TES_NOME"
                value={formik.values.TES_NOME}
                onChange={formik.handleChange}
                size="small"
              />
              {formik.errors.TES_NOME ? <ErrorText>{formik.errors.TES_NOME}</ErrorText> : null}
            </div>
            <div>
              <FormControl fullWidth size="small">
                <InputLabel id="TES_ANO">Ano</InputLabel>
                <Select
                  labelId="TES_ANO"
                  id="TES_ANO"
                  name="TES_ANO"
                  value={formik.values.TES_ANO}
                  label="Ano"
                  onChange={formik.handleChange}
                >
                  {dataYears?.items?.map((item, index) => (
                    <MenuItem key={index} value={item.ANO_NOME}>
                      {item.ANO_NOME}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {formik.errors.TES_ANO ? <ErrorText>{formik.errors.TES_ANO}</ErrorText> : null}
            </div>
            <div>
              <FormControl fullWidth size="small">
                <InputLabel id="TES_DIS">Disciplina</InputLabel>
                <Select
                  labelId="TES_DIS"
                  id="TES_DIS"
                  name="TES_DIS"
                  value={selectedDis}
                  label="Disciplina"
                  onChange={(e) => handleChangeDis(e)}
                >
                  {listDis.map((item) => (
                    <MenuItem key={item.DIS_ID} value={item}>
                      {item.DIS_NOME}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {formik.errors.TES_DIS ? <ErrorText>{formik.errors.TES_DIS}</ErrorText> : null}
            </div>
            <div>
              <FormControl fullWidth size="small">
                <InputLabel id="TES_SER">Série</InputLabel>
                <Select
                  labelId="TES_SER"
                  id="TES_SER"
                  name="TES_SER"
                  value={formik.values.TES_SER}
                  label="Série"
                  onChange={(e) => handleChangeSer(e)}
                >
                  {listSer.map((item) => (
                    <MenuItem key={item.SER_ID} value={item.SER_ID}>
                      {item.SER_NOME}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {formik.errors.TES_SER ? <ErrorText>{formik.errors.TES_SER}</ErrorText> : null}
            </div>
          </InputGroup>
          <InputGroup2>
            <div>
              <InputFile label="Teste (PDF)" onChange={(e) => onTesteChange(e)} error={formik.errors.TES_TESTE} acceptFile={".pdf"} />
            </div>
            <div>
              <InputFile label="Manual Aplicador (PDF)" onChange={(e) => onManualChange(e)} error={formik.errors.TES_MANUAL} acceptFile={".pdf"} />
            </div>
            <div>
              <FormControl fullWidth size="small">
                <InputLabel id="TES_MAR">Matriz de Referência</InputLabel>
                <Select
                  labelId="TES_MAR"
                  id="TES_MAR"
                  name="TES_MAR"
                  value={formik.values.TES_MAR}
                  label="Matriz de Referência"
                  onChange={(e) => handleChangeMatriz(e.target.value)}
                  disabled={selectedDis?.DIS_TIPO != "Objetiva"}
                >
                  {listMar.map((item) => (
                    <MenuItem key={item.MATRIZ_REFERENCIA_MAR_ID} value={item.MATRIZ_REFERENCIA_MAR_ID}>
                      {item.MATRIZ_REFERENCIA_MAR_NOME}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {formik.errors.TES_MAR ? <ErrorText>{formik.errors.TES_MAR}</ErrorText> : null}
            </div>
          </InputGroup2>
        </Card>
        {selectedDis?.DIS_TIPO === "Objetiva" && formik.values.TES_MAR &&
          <>
            <div className="d-flex justify-content-between align-items-center py-3">
              <div>
                <strong>Gabarito</strong>
              </div>
              <div style={{width:160}}>
                <ButtonWhite type='button' onClick={() => {setModalShowImportGabarito(true)}} disable={!formik.values.TES_MAR}>
                  Importar Gabarito
                </ButtonWhite>
              </div>
            </div>
            {answers.map((group, index) => {
              return (
                <div key={group.TEG_ORDEM} className="d-flex rounded-start">
                  <AnswerNumber className="d-flex justify-content-center align-items-center rounded-start">
                    <strong>{(index + 1)}ª</strong>
                  </AnswerNumber>
                  <Card2 className="rounded-end col">
                    <RepeatableInput className="">
                      <div className="d-flex">
                        <ButtonAnswer type="button" onClick={(() => handleChangeAnswer(index, "A"))} className="rounded-start" active={checkAnswer(group.TEG_RESPOSTA_CORRETA, "A")}>
                          A
                        </ButtonAnswer>
                        <ButtonAnswer type="button" onClick={(() => handleChangeAnswer(index, "B"))} active={checkAnswer(group.TEG_RESPOSTA_CORRETA, "B")}>
                          B
                        </ButtonAnswer>
                        <ButtonAnswer type="button" onClick={(() => handleChangeAnswer(index, "C"))} active={checkAnswer(group.TEG_RESPOSTA_CORRETA, "C")}>
                          C
                        </ButtonAnswer>
                        <ButtonAnswer type="button" onClick={(() => handleChangeAnswer(index, "D"))} active={checkAnswer(group.TEG_RESPOSTA_CORRETA, "D")}>
                          D
                        </ButtonAnswer>
                        <ButtonAnswer type="button" onClick={(() => handleChangeAnswer(index, "E"))} className="rounded-end" active={checkAnswer(group.TEG_RESPOSTA_CORRETA, "E")}>
                          E
                        </ButtonAnswer>
                      </div>
                      <div className="col px-3">
                        <Autocomplete
                          key={`${formik.values.TES_MAR}-${index}`}
                          //disablePortal
                          id="size-small-outlined"
                          size="small"
                          noOptionsText="Nenhuma opção"
                          options={listDescritores}
                          value={listSelectedDescritores[index]}
                          isOptionEqualToValue={(option, value) => {
                            return option.MTI_ID === value.MTI_ID}}
                          getOptionLabel={(option) => {
                            
                            return `${option.MTI_CODIGO} - ${option.MTI_DESCRITOR}`}}
                          onChange={(event, newValue) => {
                            handleChangeDescritor(newValue?.MTI_ID, index)
                          }}
                          renderInput={(params) => <TextField size="small" {...params} label="Descritor" />}
                        />
                      </div>
                      <div className="">
                        <ButtonExcluir type="button" onClick={() => handleDeleteAnswer(index)}><BiTrash color={"#FF6868"} size={16} /></ButtonExcluir>
                      </div>
                    </RepeatableInput>
                  </Card2>
                </div>
              )
            })}
            <ButtonAddTopico type="button" onClick={addAnswers}>
              <MdControlPoint color={"#3E8277"} size={39} />
            </ButtonAddTopico>
            <ButtonAddTopico type="button" onClick={addTenAnswers}>
              <PlusTen color={"#3E8277"} size={35} />
            </ButtonAddTopico>
          </>
        }
        <ButtonGroup >
          <div style={{width:160}}>
            <ButtonWhite type='button' onClick={(e) => { e.preventDefault(); setModalShowQuestion(true) }}>
              Cancelar
            </ButtonWhite>
          </div>
          <div className="ms-3" style={{width:160}}>
            <ButtonPadrao type="submit" onClick={(e) => { e.preventDefault(); formik.handleSubmit(e) }} disable={isDisabled
              //!(formik.isValid && formik.dirty)
            }>
              Adicionar Teste
            </ButtonPadrao>
          </div>
        </ButtonGroup>
      </Form>
      <ModalConfirmacao
        show={ModalShowConfirm}
        onHide={() => { setModalShowConfirm(false), modalStatus && Router.push("/testes") }}
        text={modalStatus ? `Teste "${formik.values.TES_NOME}" adicionado com sucesso!` : errorMessage ? errorMessage : `Erro ao criar Teste`}
        status={modalStatus}
      />
      <ModalAviso
        show={modalShowQuestion}
        onHide={() => setModalShowQuestion(false)}
        onConfirm={() => { Router.push('/testes') }}
        buttonYes={'Sim, Descartar Informações'}
        buttonNo={'Não Descartar Informações'}
        text={`Ao confirmar essa opção todas as informações serão perdidas.`}
      />
      <ModalAviso
        show={modalShowQuestionChange}
        onHide={() => setModalShowQuestionChange(false)}
        onConfirm={() => { confirmChangeMatriz(null) }}
        buttonYes={'Sim, Descartar Informações'}
        buttonNo={'Não Descartar Informações'}
        text={`Ao confirmar essa opção todos os gabaritos serão perdidos.`}
      />
      <ModalAvOnline
        show={modalShowAvOnline}
        onHide={() => {
          setModalShowAvOnline(false);
          setModalShowConfirm(true);
        }}
        idTeste={idTeste}
        idAvaliacao={null}
      />
      <ModalImportGabarito
        show={modalShowImportGabarito}
        onHide={() => { setModalShowImportGabarito(false)}}
        changeGabarito={changeGabaritoImport}
      />
    </>
  )
}