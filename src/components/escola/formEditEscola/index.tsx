import * as React from "react";
import { Form } from "react-bootstrap";
import { useFormik } from "formik";
import { ButtonPadrao } from "src/components/buttons/buttonPadrao";
import {
  InputGroup3Dashed,
  InputGroup3,
  InputGroup2,
  Card,
  ButtonGroupBetween,
  FormSelect,
} from "src/shared/styledForms";
import { City } from "./styledComponents";
import ButtonWhite from "src/components/buttons/buttonWhite";
import { editSchool } from "src/services/escolas.service";
import ErrorText from "src/components/ErrorText";
import ModalConfirmacao from "src/components/modalConfirmacao";
import { loadCity, loadUf, completeCEP } from "src/utils/combos";
import { useEffect, useRef, useState } from "react";
import ModalPergunta from "src/components/modalPergunta";
import Router from "next/router";
import ButtonVermelho from "src/components/buttons/buttonVermelho";
import { maskCEP } from "src/utils/masks";
import { MdOutlineSchool } from "react-icons/md";
import { Autocomplete, TextField } from "@mui/material";
import { useAuth } from "src/context/AuthContext";

type ValidationErrors = Partial<{
  ESC_CEP: string;
  ESC_NOME: string;
  ESC_INEP: string;
  ESC_UF: string;
  ESC_CIDADE: string;
  ESC_ENDERECO: string;
  ESC_NUMERO: string;
  ESC_BAIRRO: string;
  ESC_COMPLEMENTO: string;
  ESC_INTEGRAL: string;
}>;

export default function FormEditEscola({ escola, city }) {
  const [uf, setUf] = useState(escola.ESC_UF);
  const [listUf, setListUf] = useState([]);
  const [listCity, setListCity] = useState([]);
  const [modalShowConfirm, setModalShowConfirm] = useState(false);
  const [modalShowQuestion, setModalShowQuestion] = useState(false);
  const [modalShowConfirmQuestion, setModalShowConfirmQuestion] =
    useState(false);
  const [modalErrorMessage, setModalErrorMessage] = useState(false);
  const [active, setActive] = useState(escola.ESC_ATIVO);
  const [modalStatus, setModalStatus] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isFieldDisabled, setIsFieldDisabled] = useState(false);
  const { user } = useAuth()
  const numberRef = useRef(null);  


  const validate = (values) => {
    const errors: ValidationErrors = {};
    if (!values.ESC_NOME) {
      errors.ESC_NOME = "Campo obrigatório";
    } else if (values.ESC_NOME.length < 6) {
      errors.ESC_NOME = "Deve ter no minimo 6 caracteres";
    }
    if (!values.ESC_INEP) {
      errors.ESC_INEP = "Campo obrigatório";
    } else if (values.ESC_INEP.length < 8) {
      errors.ESC_INEP = "Deve ter no minimo 8 caracteres";
    }
    if (!values.ESC_CEP) {
      errors.ESC_CEP = "Campo obrigatório";
    } else if (values.ESC_CEP.length < 9) {
      errors.ESC_CEP = "Deve ter no minimo 9 caracteres";
    }
    if (!uf) {
      errors.ESC_UF = "Campo obrigatório";
    }
    if (!values.ESC_CIDADE) {
      errors.ESC_CIDADE = "Campo obrigatório";
    }
    if (!values.ESC_ENDERECO) {
      errors.ESC_ENDERECO = "Campo obrigatório";
    } else if (values.ESC_ENDERECO.length < 6) {
      errors.ESC_ENDERECO = "Deve ter no minimo 6 caracteres";
    }
    if (!values.ESC_NUMERO) {
      errors.ESC_NUMERO = "Campo obrigatório";
    }
    if (!values.ESC_BAIRRO) {
      errors.ESC_BAIRRO = "Campo obrigatório";
    } else if (values.ESC_BAIRRO.length < 6) {
      errors.ESC_BAIRRO = "Deve ter no minimo 6 caracteres";
    }
    if (!values.ESC_INTEGRAL) {
      errors.ESC_INTEGRAL = 'Campo obrigatório';
    }
    return errors;
  };

  useEffect(() => {
    async function fetchAPI() {
      setListUf(await loadUf());
    }
    fetchAPI();
  }, []);
  useEffect(() => {
    async function fetchAPI() {
      if (uf) {
        setListCity(await loadCity(uf));
      }
    }
    fetchAPI();
  }, [uf]);

  const formik = useFormik({
    initialValues: {
      ESC_NOME: escola.ESC_NOME,
      ESC_INEP: escola.ESC_INEP,
      ESC_UF: escola.ESC_UF,
      ESC_CIDADE: escola.ESC_CIDADE,
      ESC_MUN: escola.ESC_MUN?.MUN_ID,
      ESC_ENDERECO: escola.ESC_ENDERECO,
      ESC_NUMERO: escola.ESC_NUMERO,
      ESC_COMPLEMENTO: escola.ESC_COMPLEMENTO,
      ESC_BAIRRO: escola.ESC_BAIRRO,
      ESC_CEP: escola.ESC_CEP,
      ESC_LOGO: escola.ESC_LOGO,
      ESC_ATIVO: escola.ESC_ATIVO,
      ESC_STATUS: escola.ESC_STATUS,
      ESC_INTEGRAL: escola.ESC_INTEGRAL === true ? 'Sim' : 'Não',
    },
    validate,
    onSubmit: async (values) => {
      const data = {
        ...values,
        ESC_UF: uf,
        ESC_INTEGRAL: values.ESC_INTEGRAL === 'Sim' ? true : false
      }     
      
      setIsDisabled(true)
      let response = null;
      try{
        response = await editSchool(escola.ESC_ID, data);
      }
      catch (err) {
        setIsDisabled(false)
        console.log("err", err.data);

      } finally {
        setIsDisabled(false)
        console.log('finally', response);
  }

    console.log(response);

    if (!response?.data?.message) {
      setActive(escola.ESC_ATIVO);
      setModalShowConfirm(true);
      setModalStatus(true);
    }
    else{
      setModalStatus(false);
      setModalShowConfirm(true);
      setModalErrorMessage(response?.data?.message)
    }
    },
  });

  async function changeSchool() {
    setIsDisabled(true)

    console.log('escola.ESC_ID', escola.ESC_ID)
    setModalShowQuestion(false);
    escola = {
      ESC_ID: escola.ESC_ID,
      ESC_ATIVO: !escola.ESC_ATIVO,
    };
    let response = null;
      try{
        response = await editSchool(escola.ESC_ID, escola);
      }
      catch (err) {
        setIsDisabled(false)
        console.log("err", err.data);

      } finally {
        setIsDisabled(false)
        console.log('finally', response);
  }

    console.log(response);

    if (!response?.data?.message) {
      setActive(escola.ESC_ATIVO);
      setModalShowConfirmQuestion(true);
      setModalStatus(true);
    }
    else{
      setModalStatus(false);
      setModalShowConfirmQuestion(true);
      setModalErrorMessage(response?.data?.message)
    }
  }

  useEffect(() => {
    async function fetchAPI() {
      const resp = await completeCEP(formik.values.ESC_CEP);
      formik.values.ESC_UF = resp?.uf;
      formik.values.ESC_CIDADE = resp?.localidade;
      formik.values.ESC_ENDERECO = resp?.logradouro;
      formik.values.ESC_BAIRRO = resp?.bairro;
      formik.setTouched({ ...formik.touched, ["ESC_UF"]: true });
      formik.setTouched({ ...formik.touched, ["ESC_CIDADE"]: true });
      formik.setTouched({ ...formik.touched, ["ESC_ENDERECO"]: true });
      formik.setTouched({ ...formik.touched, ["ESC_BAIRRO"]: true });
      numberRef.current.focus();
      formik.handleChange;
      setUf(resp?.uf);
      async () => {
        setListCity(await loadCity(resp?.uf));
      };
    }
    fetchAPI();
  }, [formik.values.ESC_CEP]);

  useEffect(() => {
    if(user?.USU_SPE?.SPE_PER?.PER_NOME === 'Escola') {
      setIsDisabled(true)
      setIsFieldDisabled(true)
    }
  },[user])

  return (
    <>
      <Card>
        <div className="d-flex align-items-center">
          <div className="d-flex align-items-center">
            <MdOutlineSchool color={"#3E8277"} size={55} />
            <City>
              <strong>{escola.ESC_NOME}</strong>
            </City>
          </div>
        </div>
        <Form onSubmit={formik.handleSubmit}>
          <InputGroup3Dashed className="" controlId="formBasic">
            <div>
              <TextField
                fullWidth
                label="Nome"
                name="ESC_NOME"
                id="ESC_NOME"
                value={formik.values.ESC_NOME}
                onChange={formik.handleChange}
                size="small"
                disabled={isFieldDisabled}
              />
              {formik.errors.ESC_NOME ? (
                <ErrorText>{formik.errors.ESC_NOME}</ErrorText>
              ) : null}
            </div>
            <div>
              <TextField
                fullWidth
                label="INEP"
                name="ESC_INEP"
                id="ESC_INEP"
                value={formik.values.ESC_INEP}
                onChange={formik.handleChange}
                size="small"
                disabled={isFieldDisabled}
              />
              {formik.errors.ESC_INEP ? (
                <ErrorText>{formik.errors.ESC_INEP}</ErrorText>
              ) : null}
            </div>
          </InputGroup3Dashed>
          <InputGroup3>
            <div>
              <TextField
                fullWidth
                label="CEP"
                name="ESC_CEP"
                id="ESC_CEP"
                value={maskCEP(formik.values.ESC_CEP)}
                onChange={formik.handleChange}
                size="small"
                disabled={isFieldDisabled}
              />
              {formik.errors.ESC_CEP ? (
                <ErrorText>{formik.errors.ESC_CEP}</ErrorText>
              ) : null}
            </div>
            <div>
              <FormSelect
                className=""
                name="ESC_UF"
                value={uf}
                onChange={(e) => setUf(e.target.value)}
                disabled={isFieldDisabled}
              >
                <option value="">Estado</option>
                {listUf.map((item, index) => (
                  <option key={index} value={item.sigla}>
                    {item.sigla} - {item.nome}
                  </option>
                ))}
              </FormSelect>
              {formik.errors.ESC_UF ? (
                <ErrorText>{formik.errors.ESC_UF}</ErrorText>
              ) : null}
            </div>
            <div>
              <FormSelect
                name="ESC_CIDADE"
                value={formik.values.ESC_CIDADE}
                onChange={formik.handleChange}
                disabled={isFieldDisabled}
              >
                <option value="">Município</option>
                {listCity.map((item, index) => (
                  <option key={index} value={item.nome}>
                    {item.nome}
                  </option>
                ))}
              </FormSelect>
              {formik.errors.ESC_CIDADE ? (
                <ErrorText>{formik.errors.ESC_CIDADE}</ErrorText>
              ) : null}
            </div>
          </InputGroup3>
          <InputGroup3 className="" controlId="formBasic">
            <div>
              <TextField
                fullWidth
                label="Endereço da SME"
                name="ESC_ENDERECO"
                id="ESC_ENDERECO"
                value={formik.values.ESC_ENDERECO}
                onChange={formik.handleChange}
                size="small"
                disabled={isFieldDisabled}
              />
              {formik.errors.ESC_ENDERECO ? (
                <ErrorText>{formik.errors.ESC_ENDERECO}</ErrorText>
              ) : null}
            </div>
            <div>
              <TextField
                fullWidth
                label="Bairro"
                name="ESC_BAIRRO"
                id="ESC_BAIRRO"
                value={formik.values.ESC_BAIRRO}
                onChange={formik.handleChange}
                size="small"
                disabled={isFieldDisabled}
              />
              {formik.errors.ESC_BAIRRO ? (
                <ErrorText>{formik.errors.ESC_BAIRRO}</ErrorText>
              ) : null}
            </div>
            <InputGroup2>
              <div>
                <TextField
                  fullWidth
                  label="Numero"
                  name="ESC_NUMERO"
                  id="ESC_NUMERO"
                  value={formik.values.ESC_NUMERO}
                  onChange={formik.handleChange}
                  size="small"
                  ref={numberRef}
                  disabled={isFieldDisabled}
                />
                {formik.errors.ESC_NUMERO ? (
                  <ErrorText>{formik.errors.ESC_NUMERO}</ErrorText>
                ) : null}
              </div>
              <div>
                <TextField
                  fullWidth
                  label="Complemento"
                  name="ESC_COMPLEMENTO"
                  id="ESC_COMPLEMENTO"
                  value={formik.values.ESC_COMPLEMENTO}
                  onChange={formik.handleChange}
                  size="small"
                  disabled={isFieldDisabled}
                />
                {formik.errors.ESC_COMPLEMENTO ? (
                  <ErrorText>{formik.errors.ESC_COMPLEMENTO}</ErrorText>
                ) : null}
              </div>
            </InputGroup2>
          </InputGroup3>
          <InputGroup3 paddingBottom>
            <div>
            <Autocomplete
              style={{background: "#FFF"}}
              className=""
              id="ano"
              size="small"
              value={formik.values.ESC_INTEGRAL}
              noOptionsText="Escola de Tempo Integral?"
              options={['Sim', 'Não']}
              onChange={(_event, newValue) => {
                formik.setFieldValue('ESC_INTEGRAL', newValue, true);
              }}
              renderInput={(params) => <TextField size="small" {...params} label="Escola de Tempo Integral?" />}
              disabled={isFieldDisabled}
            />
            {formik.errors.ESC_INTEGRAL ? <ErrorText>{formik.errors.ESC_INTEGRAL}</ErrorText> : null}
            </div>
          </InputGroup3>
          <ButtonGroupBetween>
            <div>
              {formik.values.ESC_ATIVO ? (
                <ButtonVermelho
                  disable={isDisabled}
                  onClick={(e) => {
                    e.preventDefault();
                    setModalShowQuestion(true);
                  }}
                >
                  Desativar
                </ButtonVermelho>
              ) : (
                <ButtonPadrao
                  disable={isDisabled}
                  onClick={(e) => {
                    e.preventDefault();
                    setModalShowQuestion(true);
                  }}
                >
                  Ativar
                </ButtonPadrao>
              )}
            </div>
            <div className="d-flex">
              <div style={{ width: 160 }}>
                <ButtonWhite
                  onClick={(e) => {
                    e.preventDefault();
                    formik.resetForm();
                  }}
                >
                  Descartar Alterações
                </ButtonWhite>
              </div>
              <div className="ms-3" style={{ width: 160 }}>
                <ButtonPadrao
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    formik.handleSubmit(e);
                  }}
                  disable={!formik.isValid || isDisabled}
                >
                  Salvar
                </ButtonPadrao>
              </div>
            </div>
          </ButtonGroupBetween>
        </Form>
      </Card>
      <ModalConfirmacao
        show={modalShowConfirm}
        onHide={() => {
          setModalShowConfirm(false);
          modalStatus && Router.reload();
        }}
        text={
          modalStatus
            ? `Escola ${formik.values.ESC_NOME} alterado com sucesso!`
            : `Erro ao alterar escola`
        }
        status={modalStatus}
      />
      <ModalPergunta
        show={modalShowQuestion}
        onHide={() => setModalShowQuestion(false)}
        onConfirm={() => changeSchool()}
        buttonNo={!active ? "Não Ativar" : "Não Desativar"}
        buttonYes={"Sim, Tenho Certeza"}
        text={`Você está ${
          !active === true
            ? `ativando ${formik.values.ESC_NOME}`
            : `desativando(a) o(a) “${formik.values.ESC_NOME}”, ao desativar essa escola todos os alunos serão DESENTURMADOS e os Usuários serão DESATIVADOS, você tem certeza que deseja seguir em diante?`
        }. Você pode ${
          active === true ? "ativar" : "desativar"
        } novamente a qualquer momento.`}
        status={!active}
        size="lg"
      />
      <ModalConfirmacao
        show={modalShowConfirmQuestion}
        onHide={() => {
          setModalShowConfirmQuestion(false);
          modalStatus && Router.reload();
        }}
        text={modalStatus ? `${formik.values.ESC_NOME} ${
          active === true
            ? "ativado com sucesso!"
            : "foi desativada(o) com sucesso e os alunos estão sendo DESENTURMADOS pelo sistema."
        }` : modalErrorMessage ? modalErrorMessage : `Erro ao ${!active ? "ativar" : "desativar"}`}
        status={modalStatus}
      />
    </>
  );
}
