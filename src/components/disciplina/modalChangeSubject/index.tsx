import { ButtonPadrao } from "src/components/buttons/buttonPadrao";
import { Form, Modal } from "react-bootstrap";
import { useFormik } from "formik";
import { useState, useEffect } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import ErrorText from "src/components/ErrorText";
import * as yup from "yup";
import {
  createSubject,
  editSubject,
  getAllSubjects,
  getSubject,
} from "src/services/disciplinas.service";
import ButtonWhite from "src/components/buttons/buttonWhite";
import ModalConfirmacao from "src/components/modalConfirmacao";
import ModalPergunta from "src/components/modalPergunta";
import { ButtonAtivar } from "./styledComponents";
import { ColorPicker } from 'material-ui-color';
import { queryClient } from "src/lib/react-query";

export function ModalChangeSubject(props) {
  const [ModalShowConfirm, setModalShowConfirm] = useState(false);
  const [modalStatus, setModalStatus] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [modalShowQuestion, setModalShowQuestion] = useState(false);
  const [modalShowConfirmQuestion, setModalShowConfirmQuestion] =
    useState(false);
  const [active, setActive] = useState(false);
  const [listSubjects, setListSubjects] = useState([]);
  const [loadedSubject, setLoadedSubject] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);

  const loadAllSubject = async () => {
    const respSubject = await getAllSubjects();

    setListSubjects(respSubject.data);
  };

  useEffect(() => {
    loadAllSubject();
  }, []);

  useEffect(() => {
    if (props.disciplina?.DIS_ATIVO === "Ativo") {
      setActive(true);
    } else {
      setActive(false);
    }
  }, [props.disciplina?.DIS_ATIVO]);

  const validationSchema = yup.object({
    DIS_NOME: yup
      .string()
      .min(4, "Deve ter no minimo 4 caracteres")
      .required("Campo obrigatório")
      .test("Já existe esse nome", (DIS_NOME) => {
        let find = listSubjects.find(
          (subject) =>
            subject.DIS_NOME === DIS_NOME &&
            subject.DIS_NOME != loadedSubject.DIS_NOME
        );
        return find ? false : true;
      }),
    DIS_TIPO: yup.string().required("Campo obrigatório"),
    DIS_COLOR: yup.string().required("Campo obrigatório"),
  });

  const formik = useFormik({
    initialValues: {
      DIS_NOME: "",
      DIS_TIPO: "",
      DIS_COLOR: "",
      DIS_ATIVO: true,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {

      setIsDisabled(true)
      let response = null;
      try{
        response = props.disciplina?.DIS_ID
          ? await editSubject(props.disciplina?.DIS_ID, values)
          : await createSubject(values);
      }
      catch (err) {
        setIsDisabled(false)
      } finally {
        setIsDisabled(false)
      }

      if (
        response.status === 200 &&
        response.data.DIS_NOME === values.DIS_NOME
      ) {
        setModalStatus(true);
        setModalShowConfirm(true);
 
        queryClient.invalidateQueries(["subjects"])
      } else {
        setModalStatus(false);
        setModalShowConfirm(true);
        setErrorMessage(response.data.message || "Erro ao criar disciplina");
      }
    },
  });

  const loadSubject = async (id) => {
    const resp = await getSubject(id);
    setLoadedSubject(resp.data);
    formik.values.DIS_NOME = resp.data.DIS_NOME;
    formik.values.DIS_TIPO = resp.data.DIS_TIPO;
    formik.values.DIS_ATIVO = resp.data.DIS_ATIVO;
    formik.values.DIS_COLOR = resp.data.DIS_COLOR;
    setSelectedColor(resp.data.DIS_COLOR);
    formik.validateForm();
  };

  useEffect(() => {
    if (props.disciplina?.DIS_ID) loadSubject(props.disciplina?.DIS_ID);
  }, [props.disciplina]);

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

  const hideModal = () => {
    formik.resetForm();
    props.onHide();
  };

  async function changeSubject() {
    setModalShowQuestion(false);
    let subject = loadedSubject;
    subject = {
      ...subject,
      DIS_ATIVO: !subject.DIS_ATIVO,
    };

    const response = await editSubject(subject.DIS_ID, subject);
    if (
      response.status === 200 &&
      response.data.DIS_NOME === subject.DIS_NOME
    ) {
      setActive(subject.DIS_ATIVO);
      setModalShowConfirmQuestion(true);
      setModalStatus(true);
      queryClient.invalidateQueries(["subjects"])
      } else {
      setModalStatus(false);
      setModalShowConfirmQuestion(true);
    }
  }
  
  const handleColor = (e) => {
    setSelectedColor('#' + e.hex);
    formik.setFieldValue('DIS_COLOR', '#' + e.hex);
  };

  return (
    <>
      <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {props.disciplina?.DIS_ID ? "Editar" : "Adicionar"} Disciplina
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex flex-column align-items-center mt-3">
          <Form
            style={{ height: 320 }}
            className="d-flex flex-column col-12 px-5 justify-content-around align-items-center"
            onSubmit={formik.handleSubmit}
          >
            <div className="col-12">
              <TextField
                fullWidth
                label="Disciplina"
                id="DIS_NOME"
                name="DIS_NOME"
                value={formik.values.DIS_NOME}
                onChange={formik.handleChange}
                size="small"
              />
              {formik.errors.DIS_NOME ? (
                <ErrorText>
                  {formik.errors.DIS_NOME === "DIS_NOME is invalid"
                    ? "Disciplina já cadastrada"
                    : formik.errors.DIS_NOME}
                </ErrorText>
              ) : null}
              <FormControl fullWidth size="small" className="mt-3">
                <InputLabel id="DIS_TIPO">Tipo</InputLabel>
                <Select
                  labelId="DIS_TIPO"
                  id="DIS_TIPO"
                  name="DIS_TIPO"
                  value={formik.values.DIS_TIPO}
                  label="Tipo"
                  onChange={formik.handleChange}
                >
                  <MenuItem value={"Objetiva"}>Objetiva</MenuItem>
                  <MenuItem value={"Leitura"}>Leitura</MenuItem>
                </Select>
              </FormControl>
              {formik.errors.DIS_TIPO ? (
                <ErrorText>{formik.errors.DIS_TIPO}</ErrorText>
              ) : null}
              <FormControl fullWidth size="small" className="mt-3 d-flex flex-row">
                <div style={{  marginRight: 10 }}>Cor da disciplina: </div>
                <div>
                  <ColorPicker
                    value={selectedColor}
                    defaultValue="#FFFFFF"
                    onChange={handleColor}
                    disableTextfield
                    // inputFormats={['hex']}
                  />
                </div>
              </FormControl>
              {formik.errors.DIS_COLOR ? (
                <ErrorText>{formik.errors.DIS_COLOR}</ErrorText>
              ) : null}
            </div>
            <div className="col-12 mt-3">
              <div className="mb-3 col-12">
                <ButtonPadrao
                  type="submit"
                  onClick={(e) => {
                    formik.handleSubmit();
                  }}
                  disable={
                    !formik.dirty || (formik.errors.DIS_NOME ? true : false) || isDisabled
                  }
                >
                  {props.disciplina?.DIS_ID ? "Salvar" : "Adicionar"}
                </ButtonPadrao>
              </div>
              <div className="d-flex justify-content-center col-12">
                <ButtonWhite onClick={hideModal}>Cancelar</ButtonWhite>
              </div>
            </div>
            {props.disciplina?.DIS_ID && (
              <div className="d-flex justify-content-center col-12">
                {formik.values.DIS_ATIVO ? (
                  <ButtonAtivar
                    color={"vermelho"}
                    onClick={(e) => {
                      e.preventDefault();
                      setModalShowQuestion(true);
                    }}
                    type="button"
                  >
                    Desativar
                  </ButtonAtivar>
                ) : null}

                {!formik.values.DIS_ATIVO ? (
                  <ButtonAtivar
                    color={"verde"}
                    onClick={(e) => {
                      e.preventDefault();
                      setModalShowQuestion(true);
                    }}
                    type="button"
                  >
                    Ativar
                  </ButtonAtivar>
                ) : null}
              </div>
            )}
          </Form>
        </Modal.Body>
      </Modal>
      <ModalConfirmacao
        show={ModalShowConfirm}
        onHide={() => {
          setModalShowConfirm(false);
          formik.resetForm;
          modalStatus && (hideModal(), props.reload());
        }}
        text={
          modalStatus
            ? `Disciplina ${formik.values.DIS_NOME} adicionada com sucesso!`
            : errorMessage
        }
        status={modalStatus}
      />
      <ModalPergunta
        show={modalShowQuestion}
        onHide={() => setModalShowQuestion(false)}
        onConfirm={() => changeSubject()}
        buttonNo={`Não ${active ? "Desativar" : "Ativar"}`}
        buttonYes={`Sim, ${active ? "Desativar" : "Ativar"}`}
        text={`Você está ${
          !active === true ? "ativando" : "desativando"
        } a disciplina “${formik.values.DIS_NOME}”, tem certeza?`}
        status={!active}
        warning
        size="medium"
      />
      <ModalConfirmacao
        show={modalShowConfirmQuestion}
        onHide={() => {
          setModalShowConfirmQuestion(false);
          hideModal();
          props.reload();
        }}
        text={modalStatus ? `${formik.values.DIS_NOME} ${
          active === true ? "ativada" : "desativada"
        } com sucesso!` : `Erro ao ${active ? "ativar" : "desativar"}`}
        status={modalStatus}
      />
    </>
  );
}
