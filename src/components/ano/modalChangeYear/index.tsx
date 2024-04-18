import { ButtonPadrao } from "src/components/buttons/buttonPadrao";
import { Form, Modal } from "react-bootstrap";
import { useFormik } from "formik";
import { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import ErrorText from "src/components/ErrorText";
import * as yup from "yup";
import {
  createYear,
  editYear,
  getYear,
  useGetYears,
} from "src/services/anos.service";
import ButtonWhite from "src/components/buttons/buttonWhite";
import ModalConfirmacao from "src/components/modalConfirmacao";
import ModalPergunta from "src/components/modalPergunta";
import { ButtonAtivar } from "./styledComponents";
import { queryClient } from "src/lib/react-query";

export function ModalChangeYear(props) {
  const [ModalShowConfirm, setModalShowConfirm] = useState(false);
  const [modalStatus, setModalStatus] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [modalShowQuestion, setModalShowQuestion] = useState(false);
  const [modalShowConfirmQuestion, setModalShowConfirmQuestion] =
    useState(false);
  const [active, setActive] = useState(false);
  const [loadedYear, setLoadedYear] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  
  const { data } = useGetYears(null, 1, 999999, null, 'ASC', null);

  const validationSchema = yup.object({
    ANO_NOME: yup
      .string()
      .min(4, "Deve ter no minimo 4 caracteres")
      .required("Campo obrigatório")
      .test("Já existe esse nome", (ANO_NOME) => {
        let find = data?.items?.find(
          (year) =>
            year?.ANO_NOME === ANO_NOME && year?.ANO_NOME != loadedYear?.ANO_NOME
        );
        return find ? false : true;
      }),
  });

  useEffect(() => {
    if (props.ano?.ANO_ATIVO === "Inativo") {
      setActive(false);
    } else {
      setActive(true);
    }
  }, [props.ano?.ANO_ATIVO]);
  const formik = useFormik({
    initialValues: {
      ANO_NOME: "",
      ANO_ATIVO: true,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsDisabled(true)
      let response = null;
      try{
        response = props.ano?.ANO_ID
        ? await editYear(props.ano?.ANO_ID, values)
        : await createYear(values);
      }
      catch (err) {
        setIsDisabled(false)
      } finally {
        setIsDisabled(false)
      }
      response = props.ano?.ANO_ID
        ? await editYear(props.ano?.ANO_ID, values)
        : await createYear(values);
      if (
        response.status === 200 &&
        response.data.ANO_NOME === values.ANO_NOME
      ) {
        setModalStatus(true);
        setModalShowConfirm(true);
        queryClient.invalidateQueries(['years'])
      } else {
        setModalStatus(false);
        setModalShowConfirm(true);
        setErrorMessage(response.data.message || "Erro ao criar ano");
      }
    },
  });

  const loadYear = async (id) => {
    const resp = await getYear(id);
    setLoadedYear(resp.data);
    formik.values.ANO_NOME = resp.data.ANO_NOME;
    formik.values.ANO_ATIVO = resp.data.ANO_ATIVO;
    formik.validateForm();
  };

  useEffect(() => {
    if (props.ano?.ANO_ID) loadYear(props.ano?.ANO_ID);
  }, [props.ano]);

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

  async function changeAno() {
    setModalShowQuestion(false);
    let year = loadedYear;
    year = {
      ...year,
      ANO_ATIVO: !year?.ANO_ATIVO,
    };

    setIsDisabled(true)
    let response = null;
    try{
      response = await editYear(year.ANO_ID, year);
    }
    catch (err) {
      setIsDisabled(false)
    } finally {
      setIsDisabled(false)
    }
    
    if (response.status === 200 && response.data.ANO_NOME === year.ANO_NOME) {
      setActive(year?.ANO_ATIVO);
      setModalShowConfirmQuestion(true);
      setModalStatus(true)
      queryClient.invalidateQueries(['years'])
    } else {
      setModalStatus(false);
      setModalShowConfirmQuestion(true);
    }
  }

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
            {props.ano?.ANO_ID ? "Editar" : "Adicionar"} Ano Letivo
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex flex-column align-items-center mt-3">
          <Form
            style={{ height: 280 }}
            className="d-flex flex-column col-12 px-5 justify-content-around align-items-center"
            onSubmit={formik.handleSubmit}
          >
            <div className="col-12">
              <TextField
                fullWidth
                label="Ano Letivo"
                id="ANO_NOME"
                name="ANO_NOME"
                value={formik.values.ANO_NOME}
                onChange={formik.handleChange}
                size="small"
              />
              {formik.errors.ANO_NOME ? (
                <ErrorText>
                  {formik.errors.ANO_NOME === "ANO_NOME is invalid"
                    ? "Ano já cadastrado"
                    : formik.errors.ANO_NOME}
                </ErrorText>
              ) : null}
            </div>
            <div className="col-12">
              <div className="mb-3 col-12">
                <ButtonPadrao
                  type="submit"
                  onClick={(e) => {
                    formik.handleSubmit();
                  }}
                  disable={
                    !formik.dirty || formik.errors.ANO_NOME ? true : false || isDisabled
                  }
                >
                  {props.ano?.ANO_ID ? "Salvar" : "Adicionar"}
                </ButtonPadrao>
              </div>
              <div className="d-flex justify-content-center col-12">
                <ButtonWhite onClick={hideModal}>Cancelar</ButtonWhite>
              </div>
            </div>
            {props.ano?.ANO_ID && (
              <div className="d-flex justify-content-center col-12">
                {formik.values?.ANO_ATIVO ? (
                  <ButtonAtivar
                    color={"vermelho"}
                    disabled={isDisabled}
                    onClick={(e) => {
                      e.preventDefault();
                      setModalShowQuestion(true);
                    }}
                    type="button"
                  >
                    Desativar
                  </ButtonAtivar>
                ) : null}

                {!formik.values?.ANO_ATIVO ? (
                  <ButtonAtivar
                    color={"verde"}
                    disabled={isDisabled}
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
            ? `Ano Letivo ${formik.values.ANO_NOME} ${
                props.ano?.ANO_ID ? "alterado" : "adicionado"
              }  com sucesso!`
            : errorMessage
        }
        status={modalStatus}
      />
      <ModalPergunta
        show={modalShowQuestion}
        onHide={() => setModalShowQuestion(false)}
        onConfirm={() => changeAno()}
        buttonNo={`Não ${active ? "Desativar" : "Ativar"}`}
        buttonYes={`Sim, ${active ? "Desativar" : "Ativar"}`}
        text={`Você está ${
          !active === true ? "ativando" : "desativando"
        } o ano letivo “${formik.values.ANO_NOME}”, tem certeza?`}
        status={!active}
        warning={true}
        size="medium"
      />
      <ModalConfirmacao
        show={modalShowConfirmQuestion}
        onHide={() => {
          setModalShowConfirmQuestion(false);
          hideModal();
          props.reload();
        }}
        text={modalStatus ? `${formik.values.ANO_NOME} ${
          active === true ? "ativado" : "desativado"
        } com sucesso!` : `Erro ao ${active ? "ativar" : "desativar"}`}
        status={modalStatus}
      />
    </>
  );
}
