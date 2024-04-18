import * as React from "react";
import { Form } from "react-bootstrap";
import { useFormik } from "formik";
import { ButtonPadrao } from "src/components/buttons/buttonPadrao";
import { InputGroup3, ButtonGroupBetween, Card } from "src/shared/styledForms";
import {
  InputGroup,
} from "./styledComponents";
import ButtonWhite from "src/components/buttons/buttonWhite";
import ModalConfirmacao from "src/components/modalConfirmacao";
import { useEffect, useState } from "react";
import ModalPergunta from "src/components/modalPergunta";
import ButtonVermelho from "src/components/buttons/buttonVermelho";
import Router from "next/router";
import {
  TextField,
  Autocomplete,
} from "@mui/material";
import { activeExternalReport, createExternalReport, editExternalReport } from "src/services/relatorio-externo";
import ModalQuestao from "src/components/modalQuestao";
import ModalAviso from "src/components/modalAviso";
import { queryClient } from "src/lib/react-query";

type ValidationErrors = Partial<{
  name: string;
  category: string;
  role: string;
  link: string;
  description: string;
}>;

export default function FormEditExternalReport({ report }) {
  const [modalShowConfirm, setModalShowConfirm] = useState(false);
  const [modalShowQuestion, setModalShowQuestion] = useState(false);
  const [modalShowCreate, setModalShowCreate] = useState(false);
  const [modalShowWarning, setModalShowWarning] = useState(false);
  const [modalShowConfirmQuestion, setModalShowConfirmQuestion] =
    useState(false);
  const [active, setActive] = useState(report?.active);
  const [modalStatus, setModalStatus] = useState(true);
  const [errorMessage, setErrorMessage] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  let errorsAux;

  const validate = (values) => {
    const errors: ValidationErrors = {};
    if (!values.name?.trim()) {
      errors.name = "Campo obrigatório";
    }
    if (!values.category) {
      errors.category = "Campo obrigatório";
    }
    if (!values.role) {
      errors.role = "Campo obrigatório";
    }
    if (!values.link) {
      errors.link = "Campo obrigatório";
    }
    if (!values.description) {
      errors.description = "Campo obrigatório";
    }
    errorsAux = errors
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      id: report?.id,
      name: report?.name,
      category: report?.category,
      role: report?.role,
      link: report?.link,
      description: report?.description,
      active: report?.active,
    },
    validate,
    onSubmit: async (values) => {
      setIsDisabled(true)
      let response = null;
      try{
        response = report?.id
        ? await editExternalReport(report?.id, values)
        : await createExternalReport(values);
      }
      catch (err) {
        setIsDisabled(false)
      } finally {
        setIsDisabled(false)
      }
      if (
        response?.data?.message
      ) {
        setModalStatus(false);
        setModalShowConfirm(true);
        setErrorMessage(response.data.message || "Erro ao alterar link");
      } else {
        setModalStatus(true);
        setModalShowConfirm(true);
        queryClient.invalidateQueries(['external-reports'])
      }
    },
  });


  async function changeReport() {
    setModalShowQuestion(false);
    const response = await activeExternalReport(report?.id);
    if (
      response?.data?.message
    ) {
      setModalStatus(false);
      setModalShowConfirm(true);
      setErrorMessage(response.data.message || "Erro ao alterar link");
    } else {
      setModalStatus(true);
      setModalShowConfirm(true);
      queryClient.invalidateQueries(['external-reports'])
    }
  }

  const handleChangeRole = (newValue) => {
    formik.setFieldValue("role", newValue, true);
  }

  const openModalCreate = () => {
    formik.validateForm();
    if(Object.keys(errorsAux).length === 0 )
      setModalShowCreate(true);
  }

  return (
    <>
      <Form onSubmit={(e) => { e.preventDefault() }}>
        <Card>
          <div className="mb-3">
            <strong>
              Novo Link
            </strong>
          </div>
            <div>
              <InputGroup3>
                <div>
                  <TextField
                    fullWidth
                    label="Nome do Relatório"
                    name="name"
                    id="name"
                    inputProps={{ maxLength: 50 }}
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    size="small"
                    error={!!formik.errors.name}
                    helperText={
                      formik.errors.name
                        ? formik.errors.name
                        : ''
                    }
                  />
                </div>
                <div>
                  <TextField
                    fullWidth
                    label="Categoria"
                    name="category"
                    id="category"
                    inputProps={{ maxLength: 50 }}
                    value={formik.values.category}
                    onChange={formik.handleChange}
                    size="small"
                    error={!!formik.errors.category}
                    helperText={
                      formik.errors.category
                        ? formik.errors.category
                        : ''
                    }
                  />
                </div>
                <div>
                  <Autocomplete
                    style={{background: "#FFF"}}
                    className=""
                    id="role"
                    size="small"
                    value={formik.values.role}
                    noOptionsText="Hierarquia"
                    options={["SAEV", 'Escola', 'Município']}
                    // onChange={formik.handleChange}
                    onChange={(_event, newValue) => {
                      handleChangeRole(newValue)
                    }}
                    renderInput={(params) => <TextField 
                      size="small" {...params} label="Hierarquia" 
                      error={!!formik.errors.role}
                      helperText={
                        formik.errors.role
                          ? formik.errors.role
                          : ''
                      } 
                    />}
                  />
                </div>
              </InputGroup3>
              <InputGroup>
                <div className="">
                  <TextField
                    fullWidth
                    label="Link do Relatório"
                    id="link"
                    name="link"
                    value={formik.values.link}
                    onChange={formik.handleChange}
                    size="small"
                    error={!!formik.errors.link}
                    helperText={
                      formik.errors.link
                        ? formik.errors.link
                        : ''
                    }
                  />
                </div>
              </InputGroup>
              <InputGroup>
                <div className="">
                  <TextField
                    minRows={3}
                    maxRows={3}
                    multiline
                    inputProps={{ maxLength: 300 }}
                    fullWidth
                    label="Descritivo do relatório"
                    id="description"
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    size="small"
                    error={!!formik.errors.description}
                    helperText={
                      formik.errors.description
                        ? formik.errors.description
                        : ''
                    }
                  />
                </div>
              </InputGroup>
            </div>
        </Card>
        <ButtonGroupBetween style={{ marginTop: 30 }}>
          <div>
            {report?.id && (
              <>
                {formik.values.active ? (
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
              </>
            )}
          </div>
          <div className="d-flex">
            <div style={{ width: 160 }}>
              <ButtonWhite
                onClick={() => {
                  setModalShowWarning(true);
                }}
                >
                {report?.id ? "Descartar Alterações" : "Cancelar"}
              </ButtonWhite>
            </div>
            <div className="ms-3" style={{ width: 160 }}>
              <ButtonPadrao
                // type="submit"
                onClick={() => {
                  openModalCreate();
                }}
                disable={isDisabled}
                >
                {report?.id ? "Salvar" : "Adicionar"}
              </ButtonPadrao>
            </div>
          </div>
        </ButtonGroupBetween>
      </Form>
      <ModalConfirmacao
        show={modalShowConfirm}
        onHide={() => {
          modalStatus ?
            Router.back() : (setModalShowConfirm(false), setModalShowCreate(false))
        }}
        text={
          modalStatus
          ? `${report?.id ? '' : 'Novo'} Link ${report?.id ? 'alterado' : 'adicionado'} com sucesso!`
          : errorMessage
        }
        status={modalStatus}
        />
      <ModalPergunta
        show={modalShowQuestion}
        onHide={() => setModalShowQuestion(false)}
        onConfirm={() => changeReport()}
        buttonNo={!active ? "Não Ativar" : "Não Desativar"}
        buttonYes={"Sim, Tenho Certeza"}
        text={`Você está ${
          !active === true
            ? `ativando esse link.`
            : `desativando esse link.`
        }${
          !active ? " Você pode desativar novamente a qualquer momento." : ' Você pode ativar novamente a qualquer momento.'
        }`}
        status={!active}
        size="sm"
      />
      <ModalConfirmacao
        show={modalShowConfirmQuestion}
        onHide={() => {
          setModalShowConfirmQuestion(false);
          Router.reload();
        }}
        text={modalStatus ? `${formik.values.name} ${
          active === true
            ? "ativado com sucesso!"
            : "O link foi desativado com sucesso."
        }` : `Erro ao ${active ? "ativar" : "desativar"}`}
        status={modalStatus}
      />
      <ModalQuestao
        show={modalShowCreate}
        onConfirm={(e) => {
          formik.handleSubmit(e);
        }}
        onHide={() => {
          setModalShowCreate(false)
        }}
        text={`Você está prestes a ${report?.id ? "editar" : "adicionar"} esse link. Deseja seguir com essa operação?`}
        textConfirm={report?.id ? "Sim, Salvar Alterações" : "Sim, Adicionar Link"}
      />
      <ModalAviso
        show={modalShowWarning}
        onHide={() => setModalShowWarning(false)}
        onConfirm={() => {
          Router.back();
        }}
        buttonYes={"Sim, Descartar Informações"}
        buttonNo={"Não Descartar Informações"}
        text={`Ao confirmar essa opção todas as informações serão perdidas.`}
      />
    </>
  );
}
