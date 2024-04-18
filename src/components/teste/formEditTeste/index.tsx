import { Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useFormik } from "formik";
import { ButtonPadrao } from "src/components/buttons/buttonPadrao";
import {
  InputGroup,
  ButtonGroup,
  Card,
  Card2,
  InputGroup2,
  ButtonExcluir,
  ButtonDownload,
  RepeatableInput,
  ButtonAddTopico,
  ButtonAnswer,
  AnswerNumber,
} from "./styledComponents";
import ButtonWhite from "src/components/buttons/buttonWhite";
import ErrorText from "src/components/ErrorText";
import ModalConfirmacao from "src/components/modalConfirmacao";
import ModalAviso from "src/components/modalAviso";
import { useEffect, useState } from "react";
import Router from "next/router";
import { deleteQuestionTest, editTest, toggleActiveTest } from "src/services/testes.service";
import { BiTrash } from "react-icons/bi";
import { MdControlPoint, MdOutlineDownload } from "react-icons/md";
import PlusTen from "public/assets/images/plusTen.svg";
import ButtonVermelho from "src/components/buttons/buttonVermelho";
import ModalPergunta from "src/components/modalPergunta";
import InputFile from "src/components/InputFile";
import {
  getAllDisciplinas,
  getAllSeries,
  getReferences,
  getReference,
} from "src/services/referencias.service";
import {
  Autocomplete,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useGetYears } from "src/services/anos.service";
import { ModalImportGabarito } from "../modalImportGabarito";
import ModalAvOnline from "src/components/modalAvOnline";


type ValidationErrors = Partial<{
  TES_NOME: string;
  TES_DIS: string;
  TES_SER: string;
  TES_TEG: string;
  TES_MAR: string;
}>;

export default function FormEditTeste({ teste }) {
  const [ModalShowConfirm, setModalShowConfirm] = useState(false);
  const [modalShowQuestion, setModalShowQuestion] = useState(false);
  const [modalShowConfirmQuestion, setModalShowConfirmQuestion] =
    useState(false);
    const [modalShowConfirmDeleteQuestion, setModalShowConfirmDeleteQuestion] =
      useState(false);
  const [modalShowConfirmQuestionCancel, setModalShowConfirmQuestionCancel] =
    useState(false);
  const [modalShowQuestionChange, setModalShowQuestionChange] = useState(false);
  const [modalShowImportGabarito, setModalShowImportGabarito] = useState(false)
  const [modalShowAvOnline, setModalShowAvOnline] = useState(false)
  const [active, setActive] = useState(teste.TES_ATIVO);
  const [modalStatus, setModalStatus] = useState(true);
  const [testeFile, setTesteFile] = useState();
  const [manualFile, setManualFile] = useState();
  const [listDis, setListDis] = useState([]);
  const [listSer, setListSer] = useState([]);
  const [listMar, setListMar] = useState([]);
  const [marDisable, setMarDisable] = useState(true);
  const [selectedDis, setSelectedDis] = useState(teste?.TES_DIS)
  const [auxDis, setAuxDis] = useState(teste?.TES_DIS?.DIS_ID);
  const [auxSer, setAuxSer] = useState(teste?.TES_SER?.SER_ID);
  const [auxMar, setAuxMar] = useState(teste?.TES_MAR?.MAR_ID);
  const [listDescritores, setListDescritores] = useState([]);
  const [answers, setAnswers] = useState(teste?.TES_TEG);
  const [listSelectedDescritores, setListSelectedDescritores] = useState([])
  const [errorMessage, setErrorMessage] = useState('Erro ao editar Teste')
  const [isDisabled, setIsDisabled] = useState(false);

  let countGabarito = teste?.TES_TEG?.length

  const { data: dataYears } = useGetYears(null, 1, 999999, null, 'DESC', true);

  const validate = (values) => {
    const errors: ValidationErrors = {};
    if (!values.TES_NOME) {
      errors.TES_NOME = "Campo obrigatório";
    } else if (values.TES_NOME.length < 2) {
      errors.TES_NOME = "Deve ter no minimo 2 caracteres";
    }
    if (!values.TES_DIS) {
      errors.TES_DIS = "Campo obrigatório";
    }
    if (!values.TES_SER) {
      errors.TES_SER = "Campo obrigatório";
    }
    if (selectedDis?.DIS_TIPO === "Objetiva" && !values.TES_MAR) {
      errors.TES_MAR = 'Campo obrigatório';
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      TES_NOME: teste?.TES_NOME,
      TES_ANO: teste?.TES_ANO,
      TES_DIS: teste?.TES_DIS?.DIS_ID,
      TES_SER: teste?.TES_SER?.SER_ID,
      TES_ARQUIVO: teste?.TES_ARQUIVO,
      TES_MANUAL: teste?.TES_MANUAL,
      TES_MAR: teste?.TES_MAR?.MAR_ID,
      TES_TEG: teste?.TES_TEG,
      TES_ATIVO: teste?.TES_ATIVO,
    },
    validate,
    onSubmit: async (values) => {
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

      let testeF = null;
      if (testeFile) {
        testeF = testeFile;
      }

      let manual = null;
      if (manualFile) {
        manual = manualFile;
      }

      if(selectedDis?.DIS_TIPO === "Objetiva"){
        answers.map((x, index) => {
          x.TEG_ORDEM = index;
        });

        values.TES_TEG = answers;
      } else{
        values.TES_TEG = [];
        values.TES_MAR = null;
      }

      console.log('values :', values);

      setIsDisabled(true)
      let response = null;
      try{
        response = await editTest(teste.TES_ID, values, testeF, manual);
      }
      catch (err) {
        setIsDisabled(false)
      } finally {
        setIsDisabled(false)
      }

      if (
        response.status === 200 &&
        response.data.TES_NOME === values.TES_NOME
      ) {
        setErrorMessage('Erro ao editar Teste')
        setModalStatus(true);
        setModalShowConfirm(true);
      } else {
        setModalStatus(false);
        setModalShowConfirm(true);
      }
    },
  });

  const loadDisciplinas = async () => {
    const resp = await getAllDisciplinas();
    setListDis(resp.data);
  };

  const loadSeries = async () => {
    const resp = await getAllSeries();
    setListSer(resp.data);
  };

  const loadMatrizes = async (dis, ser) => {
    const resp = await getReferences(null, 1, 9999, null, "ASC", dis, ser, '1');
    setListMar(resp.data.items);
  };

  const loadDescritores = async (id) => {
    const resp = await getReference(id);
    const list = [];
    resp.data?.MAR_MTO?.map((x) => {
      x.MTO_MTI.map((el) => {
        list.push(el);
      });
    });
    setListDescritores(list);
  };

  useEffect(() => {
    loadDisciplinas();
    loadSeries();
  }, []);

  const handleChangeDis = (newValue) => {
    let valor = newValue;
    setSelectedDis(valor)
    if (formik.values.TES_MAR === "") {
      setAuxDis(valor?.DIS_ID);
      formik.setFieldValue("TES_DIS", valor?.DIS_ID);
    } else {
      setAuxDis(valor?.DIS_ID);
      handleChangeMatriz("");
    }
  };

  const handleChangeSer = (e) => {
    let valor = e.target.value;
    if (formik.values.TES_MAR === "") {
      setAuxSer(valor);
      formik.setFieldValue("TES_SER", valor);
    } else {
      setAuxSer(valor);
      handleChangeMatriz("");
    }
  };

  const handleChangeMatriz = (id) => {
    setAuxMar(id);
    setModalShowQuestionChange(true);
  };

  const confirmChangeMatriz = () => {
    resetAnswers();
    setModalShowQuestionChange(false);
    formik.setFieldValue("TES_DIS", auxDis);
    formik.setFieldValue("TES_SER", auxSer);
    formik.setFieldValue("TES_MAR", auxMar);
  };

  useEffect(() => {
    if (formik.values.TES_DIS !== "" && formik.values.TES_SER !== "") {
      setMarDisable(false);
      loadMatrizes(formik.values.TES_DIS, formik.values.TES_SER);
    } else {
      setMarDisable(true);
    }
  }, [formik.values.TES_DIS, formik.values.TES_SER]);

  useEffect(() => {
    if (formik.values.TES_MAR === "") {
      setListDescritores([]);
    } else {
      loadDescritores(formik.values.TES_MAR);
    }
  }, [formik.values.TES_MAR]);

  const addAnswers = () => {
    setAnswers([
      ...answers,
      {
        TEG_RESPOSTA_CORRETA: "A",
        TEG_MTI: null,
        TEG_ORDEM: countGabarito + 1,
      },
    ]);

    countGabarito += 1;

  };

  const handleDeleteAnswer = async (position, questionId) => {

    if(questionId) {
      setIsDisabled(true)
      let response = null;
      try{
        response = await deleteQuestionTest(questionId);
      }
      catch (err) {
        setIsDisabled(false)
      } finally {
        setIsDisabled(false)
      }

      if (response.message) {
        setErrorMessage(response.message || 'Erro ao deletar questão')
        setModalStatus(false);
        setModalShowConfirmDeleteQuestion(true);
      } else {
        setModalStatus(true);
        setModalShowConfirmDeleteQuestion(true);
        let list = answers.filter((_x, index) => index !== position)
        setAnswers(list);
      }
    } else {
      let list = answers.filter((_x, index) => index !== position)
      setAnswers(list);
    }

  };

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
    setAnswers([
      {
        TEG_RESPOSTA_CORRETA: "A",
        TEG_MTI: null,
        TEG_ORDEM: countGabarito + 1,
      },
    ]);

    countGabarito += 1;
  };

  const handleChangeAnswer = (index, letter) => {
    answers[index].TEG_RESPOSTA_CORRETA = letter;
    setAnswers([...answers]);
  };

  const handleChangeDescritor = (id, index) => {
    answers[index].TEG_MTI = id;
    setAnswers([...answers]);
  };

  const checkAnswer = (answer, letter) => {
    if (answer === letter) return true;
    return false;
  };

  async function changeTeste() {
    setModalShowQuestion(false);
    // teste = {
    //   TES_ID: teste.TES_ID,
    //   TES_ATIVO: !teste.TES_ATIVO,
    // };

    const response = await toggleActiveTest(teste.TES_ID);
    if (!response.message) {
      setActive(response?.active);
      setModalShowConfirmQuestion(true);
      setModalStatus(true);
    } else {
      setModalStatus(false);
      setModalShowConfirmQuestion(true);
    }
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

  const getDefaultDescritor = (group) => {
    return listDescritores.find((x) => x.MTI_ID === group.TEG_MTI?.MTI_ID);
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
              {formik.errors.TES_NOME ? (
                <ErrorText>{formik.errors.TES_NOME}</ErrorText>
              ) : null}
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
              <Autocomplete
                style={{background: "#FFF"}}
                className=""
                id="mun"
                size="small"
                value={selectedDis}
                noOptionsText="Disciplina"
                options={listDis}
                getOptionLabel={(option) =>  `${option?.DIS_NOME}`}
                onChange={(_event, newValue) => {
                  handleChangeDis(newValue)}}
                renderInput={(params) => <TextField size="small" {...params} label="Disciplina" />}
              />
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
                  {listSer?.map((item) => (
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
            <div className="d-flex">
              <InputFile
                label="Teste (PDF)"
                initialValue={teste.TES_ARQUIVO}
                onChange={(e) => onTesteChange(e)}
                error={formik.errors.TES_TESTE}
                acceptFile={".pdf"}
              />
              {teste.TES_ARQUIVO && (
                <OverlayTrigger
                  key={"toolTip_Arq"}
                  placement={"bottom"}
                  overlay={
                    <Tooltip id={`tooltip-bottom`}>{teste.TES_ARQUIVO}</Tooltip>
                  }
                >
                  <ButtonDownload
                    href={teste.TES_ARQUIVO_URL}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <MdOutlineDownload size={20} color={"#3E8277"} />
                  </ButtonDownload>
                </OverlayTrigger>
              )}
            </div>
            <div className="d-flex">
              <InputFile
                label="Manual Aplicador (PDF)"
                onChange={(e) => onManualChange(e)}
                error={formik.errors.TES_MANUAL}
                acceptFile={".pdf"}
              />
              {teste.TES_MANUAL && (
                <OverlayTrigger
                  key={"toolTip_Manual"}
                  placement={"bottom"}
                  overlay={
                    <Tooltip id={`tooltip-bottom`}>{teste.TES_MANUAL}</Tooltip>
                  }
                >
                  <ButtonDownload
                    href={teste.TES_MANUAL_URL}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <MdOutlineDownload size={20} color={"#3E8277"} />
                  </ButtonDownload>
                </OverlayTrigger>
              )}
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
                  {listMar?.map((item) => (
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
        <div className="d-flex justify-content-between align-items-center py-3">
          <div>
            <strong>Gabarito</strong>
          </div>
          <div style={{ width: 160 }}>
          <ButtonWhite onClick={() => {setModalShowImportGabarito(true)}} disable={!formik.values.TES_MAR}>
              Importar Gabarito
            </ButtonWhite>
          </div>
        </div>
        {listDescritores?.length > 0 &&
          answers?.map((group, index) => {
            return (
              <div key={`${group.TEG_ORDEM}`} className="d-flex rounded-start">
                <AnswerNumber className="d-flex justify-content-center align-items-center rounded-start">
                  <strong>{index + 1}ª</strong>
                </AnswerNumber>
                <Card2 className="rounded-end col">
                  <RepeatableInput className="">
                    <div className="d-flex">
                      <ButtonAnswer
                        type="button"
                        onClick={() => handleChangeAnswer(index, "A")}
                        className="rounded-start"
                        active={checkAnswer(group.TEG_RESPOSTA_CORRETA, "A")}
                      >
                        A
                      </ButtonAnswer>
                      <ButtonAnswer
                        type="button"
                        onClick={() => handleChangeAnswer(index, "B")}
                        active={checkAnswer(group.TEG_RESPOSTA_CORRETA, "B")}
                      >
                        B
                      </ButtonAnswer>
                      <ButtonAnswer
                        type="button"
                        onClick={() => handleChangeAnswer(index, "C")}
                        active={checkAnswer(group.TEG_RESPOSTA_CORRETA, "C")}
                      >
                        C
                      </ButtonAnswer>
                      <ButtonAnswer
                        type="button"
                        onClick={() => handleChangeAnswer(index, "D")}
                        active={checkAnswer(group.TEG_RESPOSTA_CORRETA, "D")}
                      >
                        D
                      </ButtonAnswer>
                      <ButtonAnswer
                        type="button"
                        onClick={() => handleChangeAnswer(index, "E")}
                        className="rounded-end"
                        active={checkAnswer(group.TEG_RESPOSTA_CORRETA, "E")}
                      >
                        E
                      </ButtonAnswer>
                    </div>
                    <div className="col px-3">
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={listDescritores}
                        size="small"
                        noOptionsText="Nenhuma opção"
                        defaultValue={getDefaultDescritor(group)}
                        value={listSelectedDescritores[index]}
                        isOptionEqualToValue={(option, value) => {
                          return option.MTI_ID === value.MTI_ID}}
                        getOptionLabel={(option) => {
                          return `${option.MTI_CODIGO} - ${option.MTI_DESCRITOR}`}}
                        onChange={(_event, newValue) => {
                          handleChangeDescritor(newValue?.MTI_ID, index);
                        }}
                        renderInput={(params) => (
                          <TextField {...params} label="Descritor" />
                        )}
                      />
                    </div>
                    <div className="">
                      <ButtonExcluir
                        type="button"
                        onClick={() => handleDeleteAnswer(index, group?.TEG_ID)}
                      >
                        <BiTrash color={"#FF6868"} size={16} />
                      </ButtonExcluir>
                    </div>
                  </RepeatableInput>
                </Card2>
              </div>
            );
          })}
        <ButtonAddTopico type="button" onClick={addAnswers}>
          <MdControlPoint color={"#3E8277"} size={39} />
        </ButtonAddTopico>
        <ButtonAddTopico type="button" onClick={addTenAnswers}>
          <PlusTen color={"#3E8277"} size={35} />
        </ButtonAddTopico>
        <ButtonGroup>
          <div style={{display: 'flex'}}>
            <div>

            {formik.values.TES_ATIVO ? (
              <ButtonVermelho
              onClick={(e) => {
                e.preventDefault();
                setModalShowQuestion(true);
              }}
              >
                Desativar
              </ButtonVermelho>
            ) : (
              <ButtonPadrao
              onClick={(e) => {
                e.preventDefault();
                setModalShowQuestion(true);
              }}
              >
                Ativar
              </ButtonPadrao>
            )}
            </div>
            <div style={{marginLeft: 16, width: "160px !important"}}>
              <ButtonWhite onClick={(e) => {setModalShowAvOnline(true)}}>
                {teste?.assessmentOnline ? 'Editar Versão Online' : 'Cadastrar Versão Online'}
              </ButtonWhite>
            </div>
          </div>
          <div className="d-flex">
            <div style={{ width: 160 }}>
              <ButtonWhite
                onClick={(e) => {
                  e.preventDefault();
                  setModalShowConfirmQuestionCancel(true);
                }}
              >
                Cancelar
              </ButtonWhite>
            </div>
            <div className="ms-3" style={{ width: 160 }}>
              <ButtonPadrao
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  formik.handleSubmit(e);
                }}
                disable={
                  isDisabled
                  //!(formik.isValid && formik.dirty)
                }
              >
                Salvar
              </ButtonPadrao>
            </div>
          </div>
        </ButtonGroup>
      </Form>
      <ModalConfirmacao
        show={ModalShowConfirm}
        onHide={() => {
          setModalShowConfirm(false); modalStatus && Router.reload();
        }}
        text={
          modalStatus
            ? `Teste ${formik.values.TES_NOME} alterado com sucesso!`
            : errorMessage
        }
        status={modalStatus}
      />
      <ModalAviso
        show={modalShowConfirmQuestionCancel}
        onHide={() => setModalShowConfirmQuestionCancel(false)}
        onConfirm={() => {
          Router.push("/testes");
        }}
        buttonYes={"Sim, Descartar Informações"}
        buttonNo={"Não Descartar Informações"}
        text={`Ao confirmar essa opção todas as informações serão perdidas.`}
      />
      <ModalAviso
        show={modalShowQuestionChange}
        onHide={() => setModalShowQuestionChange(false)}
        onConfirm={() => {
          confirmChangeMatriz();
        }}
        buttonYes={"Sim, Descartar Informações"}
        buttonNo={"Não Descartar Informações"}
        text={`Ao confirmar essa opção todos os gabaritos serão perdidos.`}
      />
      <ModalPergunta
        show={modalShowQuestion}
        onHide={() => setModalShowQuestion(false)}
        onConfirm={() => changeTeste()}
        buttonNo={active ? "Não Desativar" : 'Não Ativar'}
        buttonYes={"Sim, Tenho Certeza"}
        text={`Você está ${
          !active === true
            ? `ativando o "${formik.values.TES_NOME}"`
            : `desativando o "${formik.values.TES_NOME}", isso tirará todos os acessos, os dados serão desconsiderados do relatório.`
        } Você pode ${
          !active === true ? "ativar" : "desativar"
        } novamente a qualquer momento.`}
        status={!active}
        size="lg"
      />
      <ModalConfirmacao
        show={modalShowConfirmQuestion}
        onHide={() => {
          setModalShowConfirmQuestion(false);
          modalStatus && Router.push(`/teste/editar/${teste.TES_ID}`);
        }}
        text={modalStatus ? `${formik.values.TES_NOME} ${
          active === true ? "ativado" : "desativado"
        } com sucesso!` : `Erro ao ${!active ? "ativar" : "desativar"}`}
        status={modalStatus}
      />
      <ModalConfirmacao
        show={modalShowConfirmDeleteQuestion}
        onHide={() => {
          setModalShowConfirmDeleteQuestion(false);
        }}
        text={modalStatus ? 'Questão deletada com sucesso!' : errorMessage}
        status={modalStatus}
      />
      <ModalAvOnline
        show={modalShowAvOnline}
        onHide={() => {
          setModalShowAvOnline(false);
        }}
        idTeste={teste.TES_ID}
        idAvaliacao={teste?.assessmentOnline ? teste?.assessmentOnline?.id : null}
      />
      <ModalImportGabarito
        show={modalShowImportGabarito}
        onHide={() => { setModalShowImportGabarito(false)}}
        changeGabarito={changeGabaritoImport}
      />
    </>
  );
}
