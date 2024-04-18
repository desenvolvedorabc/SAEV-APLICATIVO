import { ButtonPadrao } from "src/components/buttons/buttonPadrao";
import { Form, Modal } from "react-bootstrap";
import { useFormik } from "formik";
import { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import ErrorText from "src/components/ErrorText";
import * as yup from "yup";
import {
  createSerie,
  editSerie,
  getAllSeries,
  getSerie,
  getSeries,
  useGetSeries,
} from "src/services/series.service";
import ButtonWhite from "src/components/buttons/buttonWhite";
import ModalConfirmacao from "src/components/modalConfirmacao";
import ModalPergunta from "src/components/modalPergunta";
import { ButtonAtivar } from "./styledComponents";
import Router from "next/router";
import { queryClient } from "src/lib/react-query";

export function ModalChangeSerie(props) {
  const [ModalShowConfirm, setModalShowConfirm] = useState(false);
  const [modalStatus, setModalStatus] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [modalShowQuestion, setModalShowQuestion] = useState(false);
  const [modalShowConfirmQuestion, setModalShowConfirmQuestion] =
    useState(false);
  const [active, setActive] = useState(false);
  // const [listSeries, setListSeries] = useState([]);
  const [loadedSerie, setLoadedSerie] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);


  const { data: dataSerie } = useGetSeries(
    null, 1, 9999999, null, 'ASC', null
  );

  useEffect(() => {
    if (props.serie?.SER_ATIVO === "Ativo") {
      setActive(true);
    } else {
      setActive(false);
    }
  }, [props.serie?.SER_ATIVO]);


  const validationSchema = yup.object({
    SER_NOME: yup
      .string()
      .trim()
      .min(4, "Deve ter no minimo 4 caracteres")
      .required("Campo obrigatório")
      .test("Já existe esse nome", (SER_NOME) => {
        let find = dataSerie?.items?.find((ser) =>
          !loadedSerie?.SER_NOME
            ? ser?.SER_NOME === SER_NOME
            : ser?.SER_NOME === SER_NOME &&
              ser?.SER_NOME !== loadedSerie?.SER_NOME
        );
        return find ? false : true;
      }),
    SER_NUMBER: yup.number().min(1, "Mínimo 1").required("Campo obrigatório"),
  });

  const formik = useFormik({
    initialValues: {
      SER_NOME: "",
      SER_NUMBER: 1,
      SER_ATIVO: true,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {

      setIsDisabled(true)
      let response = null;
      try{
        response = props.serie?.SER_ID
        ? await editSerie(props.serie?.SER_ID, values)
        : await createSerie(values);
      }
      catch (err) {
        setIsDisabled(false)
      } finally {
        setIsDisabled(false)
      }
      if (
        response.status === 200 &&
        response.data.SER_NOME === values.SER_NOME
      ) {
        setModalStatus(true);
        setModalShowConfirm(true);
        queryClient.invalidateQueries(["series"])
      } else {
        setModalStatus(false);
        setModalShowConfirm(true);
        setErrorMessage(response.data.message || "Erro ao criar serie");
      }
    },
  });

  const loadSerie = async (id: number) => {
    const resp = await getSerie(id);
    setLoadedSerie(resp.data);
    formik.values.SER_NOME = resp.data.SER_NOME;
    formik.values.SER_NUMBER = resp.data.SER_NUMBER ? resp.data.SER_NUMBER : 0;
    formik.values.SER_ATIVO = resp.data.SER_ATIVO;
    formik.validateForm();
  };

  useEffect(() => {
    if (props.serie?.SER_ID) loadSerie(props.serie?.SER_ID);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.serie]);

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

  async function changeSerie() {
    setModalShowQuestion(false);
    let serie = loadedSerie;
    serie = {
      ...serie,
      SER_ATIVO: !serie.SER_ATIVO,
    };

    const response = await editSerie(serie.SER_ID, serie);
    if (response.status === 200 && response.data.SER_NOME === serie.SER_NOME) {
      setActive(serie.SER_ATIVO);
      setModalShowConfirmQuestion(true);
      setModalStatus(true);
      queryClient.invalidateQueries(["series"])
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
            {props.serie?.SER_ID ? "Editar" : "Adicionar"} Série
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex flex-column align-items-center mt-3">
          <Form
            style={{ height: 280 }}
            className="d-flex flex-column col-12 px-5 justify-content-around align-items-center"
            onSubmit={formik.handleSubmit}
          >
            <div className="col-12">
              <div className="col-12 mb-3">
                <TextField
                  fullWidth
                  label="Série"
                  id="SER_NOME"
                  name="SER_NOME"
                  value={formik.values.SER_NOME}
                  onChange={formik.handleChange}
                  size="small"
                />
                {formik.errors.SER_NOME ? (
                  <ErrorText>
                    {formik.errors.SER_NOME === "SER_NOME is invalid"
                      ? "Série já cadastrada"
                      : formik.errors.SER_NOME}
                  </ErrorText>
                ) : null}
              </div>
              <div className="col-12">
                <TextField
                  fullWidth
                  label="Número da Série"
                  id="SER_NUMBER"
                  name="SER_NUMBER"
                  type="number"
                  value={formik.values.SER_NUMBER}
                  onChange={formik.handleChange}
                  size="small"
                  InputProps={{ inputProps: { min: 0 } }}
                />
                {formik.errors.SER_NUMBER ? (
                  <ErrorText>
                    {formik.errors.SER_NUMBER === "SER_NUMBER is invalid"
                      ? "Série já cadastrada"
                      : formik.errors.SER_NUMBER}
                  </ErrorText>
                ) : null}
              </div>
            </div>
            <div className="col-12">
              <div className="mb-3 col-12">
                <ButtonPadrao
                  type="submit"
                  onClick={(e) => {
                    formik.handleSubmit();
                  }}
                  disable={!(formik.isValid && formik.dirty) || isDisabled}
                >
                  {props.serie?.SER_ID ? "Salvar" : "Adicionar"}
                </ButtonPadrao>
              </div>
              <div className="d-flex justify-content-center col-12">
                <ButtonWhite onClick={hideModal}>Cancelar</ButtonWhite>
              </div>
            </div>
            {props.serie?.SER_ID && (
              <div className="d-flex justify-content-center col-12">
                {formik.values.SER_ATIVO ? (
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

                {!formik.values.SER_ATIVO ? (
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
            ? `Série ${formik.values.SER_NOME} ${
                props.serie?.SER_ID ? "alterado" : "adicionado"
              } com sucesso!`
            : errorMessage
        }
        status={modalStatus}
        disable={isDisabled}
      />
      <ModalPergunta
        show={modalShowQuestion}
        onHide={() => setModalShowQuestion(false)}
        onConfirm={() => changeSerie()}
        buttonNo={`Não ${active ? "Desativar" : "Ativar"}`}
        buttonYes={`Sim, ${active ? "Desativar" : "Ativar"}`}
        text={`Você está ${
          !active === true ? "ativando" : "desativando"
        } a série “${formik.values.SER_NOME}”, tem certeza?`}
        status={!active}
        size="medium"
        warning
      />
      <ModalConfirmacao
        show={modalShowConfirmQuestion}
        onHide={() => {
          setModalShowConfirmQuestion(false);
          hideModal();
          props.reload();
        }}
        text={modalStatus ? `${formik.values.SER_NOME} ${
          active === true ? "ativada" : "desativada"
        } com sucesso!` : `Erro ao ${active ? "ativar" : "desativar"}`}
        status={modalStatus}
      />
    </>
  );
}
