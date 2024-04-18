import { Form } from "react-bootstrap";
import { useFormik } from "formik";
import { ButtonPadrao } from "src/components/buttons/buttonPadrao";
import {
  InputGroup,
  ButtonGroup,
  Card,
  InputGroup2,
  AddInputGroup,
  ButtonExcluir,
  ButtonAdicionar,
  InputControl,
  RepeatableInput,
  ButtonAddTopico,
} from "./styledComponents";
import ButtonWhite from "../../buttons/buttonWhite";
import ErrorText from "../../ErrorText";
import ModalConfirmacao from "../../modalConfirmacao";
import ModalAviso from "../../modalAviso";
import { useEffect, useState, useRef } from "react";
import Router from "next/router";
import { BiTrash } from "react-icons/bi";
import { MdControlPoint } from "react-icons/md";
import {
  Autocomplete,
  FormControl,
  TextField,
} from "@mui/material";
import {
  createReference,
  getAllDisciplinas,
  getAllSeries,
} from "src/services/referencias.service";
import { ModalImportMatriz } from "../modalImportMatriz";

type ValidationErrors = Partial<{
  MAR_NOME: string;
  MAR_DIS: string;
  MAR_SER: string;
  MAR_MTO: string;
}>;

interface ItemData {
  MTI_CODIGO: string;
  MTI_DESCRITOR: string;
}

export default function FormAddMatriz(props) {
  const [ModalShowConfirm, setModalShowConfirm] = useState(false);
  const [modalShowQuestion, setModalShowQuestion] = useState(false);
  const [modalShowImport, setModalShowImport] = useState(false);
  const [modalStatus, setModalStatus] = useState(true);
  const [series, setSeries] = useState([]);
  const [disciplina, setDisciplina] = useState([]);
  const [listInputs, setListInputs] = useState([
    { MTI_CODIGO: "", MTI_DESCRITOR: "" },
  ]);
  const [selectedSeries, setSelectedSeries] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);

  const [listTopics, setListTopics] = useState([
    {
      MTO_NOME: "",
      MTO_MTI: [{ MTI_CODIGO: "", MTI_DESCRITOR: "" }],
    },
  ]);
  const matNome = useRef(null);

  const validate = (values) => {
    const errors: ValidationErrors = {};
    if (!values.MAR_NOME) {
      errors.MAR_NOME = "Campo obrigatório";
    } else if (values.MAR_NOME.length < 2) {
      errors.MAR_NOME = "Deve ter no minimo 2 caracteres";
    }
    if (!values.MAR_DIS) {
      errors.MAR_DIS = "Campo obrigatório";
    }
    if (!selectedSeries?.length) {
      errors.MAR_SER = "Campo obrigatório";
    }
    return errors;
  };

  const verifyTopicEmpty = () => {
    let topicEmpty = [];
    let descEmpty = [];

    listTopics.map((topic, index) => {
      descEmpty = [];
      topic.MTO_MTI.map((desc, index2) => {
        if (desc.MTI_CODIGO == "" || desc.MTI_DESCRITOR == "") {
          descEmpty.push(index2);
        }
      });
      topic.MTO_MTI = topic.MTO_MTI.filter(
        (desc, index2) => !descEmpty.includes(index2)
      );

      if (topic.MTO_MTI.length === 0) {
        topicEmpty.push(index);
      }
    });

    const list = listTopics.filter(
      (topic, index) => !topicEmpty.includes(index)
    );
    setListTopics(list);

    return list;
  };


  const formik = useFormik({
    initialValues: {
      MAR_NOME: "",
      MAR_DIS: "",
      MAR_SER: "",
      MAR_MTO: "",
      MAR_ATIVO: true,
    },
    validate,
    onSubmit: async (values) => {
      values.MAR_SER = selectedSeries;
      values.MAR_MTO = verifyTopicEmpty();

      let error = false;
      values.MAR_MTO.forEach((element, index) => {
        element.MTO_MTI.forEach((el, indexEl) => {
          if(getErrorCode(index, indexEl))
            error = true;
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
        response = await createReference(values);
      }
      catch (err) {
        setIsDisabled(false)
      } finally {
        setIsDisabled(false)
      }
      if (
        response.status === 200 &&
        response.data.MAR_NOME === values.MAR_NOME
      ) {
        setModalStatus(true);
        setModalShowConfirm(true);
      } else {
        setModalStatus(false);
        setModalShowConfirm(true);
        setErrorMessage(
          response.data.message || "Erro ao criar matriz de referência"
        );
      }
    },
  });

  const loadSeries = async () => {
    const resp = await getAllSeries();
    setSeries(resp.data);
  };

  const loadDisciplinas = async () => {
    const resp = await getAllDisciplinas();
    setDisciplina(resp.data);
  };

  const addInput = (index) => {
    listTopics[index].MTO_MTI.push({ MTI_CODIGO: "", MTI_DESCRITOR: "" });
    setListTopics([...listTopics]);
  };

  const handleDeleteInput = (position, positionItem) => {
    listTopics[position].MTO_MTI = listTopics[position].MTO_MTI.filter(
      (x, index) => index !== positionItem
    );

    if (listTopics[position].MTO_MTI.length === 0) {
      let list = listTopics.filter((x, index) => index !== position);
      setListTopics([...list]);
    } else {
      setListTopics([...listTopics]);
    }
  };

  const addTopic = () => {
    setListTopics([
      ...listTopics,
      {
        MTO_NOME: "",
        MTO_MTI: [{ MTI_CODIGO: "", MTI_DESCRITOR: "" }],
      },
    ]);
  };

  const handleChangeTopic = (e, index) => {
    listTopics[index].MTO_NOME = e.target.value;
    setListTopics([...listTopics]);
  };

  const handleChangeCodigo = (e, index, indexItem) => {
    listTopics[index].MTO_MTI[indexItem].MTI_CODIGO = e.target.value;
    setListTopics([...listTopics]);
  };

  const getErrorCode = (index: number, indexItem: number) => {
    let error = false;
    listTopics?.map((topic, indexTopic) => {
      topic?.MTO_MTI?.map((element, indexEl) => {
        if(listTopics[index].MTO_MTI[indexItem].MTI_CODIGO === element.MTI_CODIGO){
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
    setListInputs([...listInputs]);
  };

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
        top: 205,
      },
    },
  };

  useEffect(() => {
    loadSeries();
    loadDisciplinas();
  }, []);

  const changeMatrizImport = (matriz) => {
    formik.setFieldValue("MAR_NOME", matriz.MAR_NOME);
    //formik.values.MAR_NOME = matriz.MAR_NOME

    let dis = disciplina.find((x) => x.DIS_NOME === matriz.MAR_DIS);
    //formik.values.MAR_DIS = dis.DIS_ID
    formik.setFieldValue("MAR_DIS", dis.DIS_ID);

    formik.setFieldValue("MAR_SER", matriz.MAR_SER);
    setSelectedSeries(matriz.MAR_SER);

    setListTopics(matriz.MAR_MTO);
    formik.values.MAR_MTO = matriz.MAR_MTO;
    formik.validateForm();
  };

  const handleChangeSerieList = (newValue) => {
    setSelectedSeries(newValue);
  }

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
                ref={matNome}
                id="MAR_NOME"
                value={formik.values.MAR_NOME}
                onChange={formik.handleChange}
                size="small"
              />
              {formik.errors.MAR_NOME && formik.touched.MAR_NOME ? (
                <ErrorText>{formik.errors.MAR_NOME}</ErrorText>
              ) : null}
            </div>
            <div>
              <Form.Select
                name="MAR_DIS"
                value={formik.values.MAR_DIS}
                onChange={formik.handleChange}
              >
                <option value="">Disciplina</option>
                {disciplina?.map((item, index) => (
                  <option key={index} value={item.DIS_ID}>
                    {item.DIS_NOME}
                  </option>
                ))}
              </Form.Select>
              {formik.errors.MAR_DIS && formik.touched.MAR_DIS ? (
                <ErrorText>{formik.errors.MAR_DIS}</ErrorText>
              ) : null}
            </div>
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
              />
              {formik.errors.MAR_SER && formik.touched.MAR_SER ? (
                <ErrorText>{formik.errors.MAR_SER}</ErrorText>
              ) : null}
            </FormControl>
            <div>
              <ButtonWhite
                onClick={() => {
                  setModalShowImport(true);
                }}
              >
                Importar
              </ButtonWhite>
            </div>
          </InputGroup>
        </Card>
        {listTopics.map((group, index) => {
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
                {group.MTO_MTI.map((input, indexItem) => (
                  <RepeatableInput key={indexItem} className="">
                    <div className="col-2">
                      <TextField
                        fullWidth
                        label="Código"
                        name={`MTI_CODIGO-${index}-${indexItem}`}
                        id={`MTI_CODIGO-${index}-${indexItem}`}
                        value={input.MTI_CODIGO}
                        onChange={(e) =>
                          handleChangeCodigo(e, index, indexItem)
                        }
                        error={getErrorCode(index, indexItem)}
                        helperText={getErrorCode(index, indexItem) && 'Código duplicado'}
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
                        onChange={(e) =>
                          handleChangeDescritor(e, index, indexItem)
                        }
                        size="small"
                      />
                    </div>
                    <div className="">
                      <ButtonExcluir
                        type="button"
                        onClick={() => handleDeleteInput(index, indexItem)}
                      >
                        <BiTrash color={"#FF6868"} size={16} />
                      </ButtonExcluir>
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
                  <ButtonAdicionar
                    type="button"
                    onClick={() => addInput(index)}
                  >
                    <MdControlPoint color={"#FFF"} size={16} />
                  </ButtonAdicionar>
                </div>
              </AddInputGroup>
            </Card>
          );
        })}
        <ButtonAddTopico type="button" onClick={() => addTopic()}>
          <MdControlPoint color={"#3E8277"} size={35} />
        </ButtonAddTopico>
        <ButtonGroup>
          <div style={{ width: 160 }}>
            <ButtonWhite
              onClick={(e) => {
                e.preventDefault();
                setModalShowQuestion(true);
              }}
            >
              Cancelar
            </ButtonWhite>
          </div>
          <div className="ms-3" style={{ width: 160 }}>
            <ButtonPadrao
              type="submit"
              disable={isDisabled}
              onClick={(e) => {
                e.preventDefault();
                formik.handleSubmit(e);
              }}
            >
              Adicionar Matriz
            </ButtonPadrao>
          </div>
        </ButtonGroup>
      </Form>
      <ModalConfirmacao
        show={ModalShowConfirm}
        onHide={() => {
          setModalShowConfirm(false),
            modalStatus && Router.push("/matrizes-de-referencia");
        }}
        text={
          modalStatus
            ? `Matriz ${formik.values.MAR_NOME} adicionada com sucesso!`
            : errorMessage
        }
        status={modalStatus}
      />
      <ModalAviso
        show={modalShowQuestion}
        onHide={() => setModalShowQuestion(false)}
        onConfirm={() => {
          Router.push("/matrizes-de-referencia");
        }}
        buttonYes={"Sim, Descartar Informações"}
        buttonNo={"Não Descartar Informações"}
        text={`Ao confirmar essa opção todas as informações serão perdidas.`}
      />
      <ModalImportMatriz
        show={modalShowImport}
        onHide={() => setModalShowImport(false)}
        changeMatriz={changeMatrizImport}
        series={series}
      />
    </>
  );
}
