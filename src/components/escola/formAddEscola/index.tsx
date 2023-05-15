import * as React from 'react';
import { Form } from "react-bootstrap";
import { useFormik } from 'formik';
import {ButtonPadrao} from 'src/components/buttons/buttonPadrao';
import { InputGroup3Dashed, InputGroup3, InputGroup2, ButtonGroupBetween, Card, FormSelect } from 'src/shared/styledForms';
import ButtonWhite from '../../buttons/buttonWhite';
import { createSchool } from 'src/services/escolas.service';
import ErrorText from '../../ErrorText';
import ModalConfirmacao from '../../modalConfirmacao';
import { loadCity, loadUf, completeCEP } from 'src/utils/combos';
import { maskCEP } from 'src/utils/masks';
import { useEffect, useRef, useState } from 'react';
import Router from 'next/router';
import { TextField } from '@mui/material';

type ValidationErrors = Partial<{ ESC_CEP: string, ESC_NOME: string, ESC_INEP: string, ESC_UF: string, ESC_CIDADE: string, ESC_ENDERECO: string, ESC_NUMERO: string, ESC_BAIRRO: string }>

export default function FormAddEscola({ munId }) {

  const [uf, setUf] = useState('');
  const [listUf, setListUf] = useState([]);
  const [listCity, setListCity] = useState([]);
  const [ModalShowConfirm, setModalShowConfirm] = useState(false)
  const [modalStatus, setModalStatus] = useState(true)
  const [errorMessage, setErrorMessage] = useState(true)
  const [isDisabled, setIsDisabled] = useState(false);
  const numberRef = useRef(null)


  const validate = values => {
    const errors: ValidationErrors = {};
    if (!values.ESC_NOME) {
      errors.ESC_NOME = 'Campo obrigatório';
    } else if (values.ESC_NOME.length < 6) {
      errors.ESC_NOME = 'Deve ter no minimo 6 caracteres';
    }
    if (!values.ESC_INEP) {
      errors.ESC_INEP = 'Campo obrigatório';
    } else if (values.ESC_INEP.length < 8) {
      errors.ESC_INEP = 'Deve ter no minimo 8 caracteres';
    }
    if (!values.ESC_CEP) {
      errors.ESC_CEP = 'Campo obrigatório';
    } else if (values.ESC_CEP.length < 9) {
      errors.ESC_CEP = 'Deve ter no minimo 9 caracteres';
    }
    if (!uf) {
      errors.ESC_UF = 'Campo obrigatório';
    }
    if (!values.ESC_CIDADE) {
      errors.ESC_CIDADE = 'Campo obrigatório';
    }
    if (!values.ESC_ENDERECO) {
      errors.ESC_ENDERECO = 'Campo obrigatório';
    } else if (values.ESC_ENDERECO.length < 6) {
      errors.ESC_ENDERECO = 'Deve ter no minimo 6 caracteres';
    }
    if (!values.ESC_NUMERO) {
      errors.ESC_NUMERO = 'Campo obrigatório';
    }
    if (!values.ESC_BAIRRO) {
      errors.ESC_BAIRRO = 'Campo obrigatório';
    } else if (values.ESC_BAIRRO.length < 6) {
      errors.ESC_BAIRRO = 'Deve ter no minimo 6 caracteres';
    }
    return errors;
  };

  useEffect(() => {
    async function fetchAPI() {
      setListUf(await loadUf());
    }
    fetchAPI()
  }, []);
  useEffect(() => {
    async function fetchAPI() {
      if (uf) {
        setListCity(await loadCity(uf));
      }
    }
    fetchAPI()
  }, [uf]);

  const formik = useFormik({
    initialValues: {
      ESC_NOME: "",
      ESC_INEP: "",
      ESC_UF: "",
      ESC_CIDADE: "",
      ESC_MUN: Number(munId),
      ESC_ENDERECO: "",
      ESC_NUMERO: "",
      ESC_COMPLEMENTO: "",
      ESC_BAIRRO: "",
      ESC_CEP: "",
      ESC_ATIVO: true,
      ESC_STATUS: "verde",
      ESC_LOGO: "",
    },
    validate,
    onSubmit: async (values) => {
      values.ESC_UF = uf

      
      setIsDisabled(true)
      let response = null;
      try{
        const response = await createSchool(values)
      }
      catch (err) {
        setIsDisabled(false)
      } finally {
        setIsDisabled(false)
      }

      if (response.status === 200 && response.data.ESC_NOME === values.ESC_NOME) {
        setModalStatus(true)
        setModalShowConfirm(true)
        setUf("")
      }
      else {
        setModalStatus(false)
        setModalShowConfirm(true)
        setErrorMessage(response.data.message || 'Erro ao criar escola')
      }
    },
  });

  function hideConfirm() {
    setModalShowConfirm(false);
    if (modalStatus) {
      // formik.resetForm()
      Router.reload()
    }
  }


  useEffect(() => {
    async function fetchAPI() {
      const resp = await completeCEP(formik.values.ESC_CEP)
      formik.values.ESC_UF = resp?.uf
      formik.values.ESC_CIDADE = resp?.localidade
      formik.values.ESC_ENDERECO = resp?.logradouro
      formik.values.ESC_BAIRRO = resp?.bairro
      formik.setTouched({ ...formik.touched, ['ESC_UF']: true });
      formik.setTouched({ ...formik.touched, ['ESC_CIDADE']: true });
      formik.setTouched({ ...formik.touched, ['ESC_ENDERECO']: true });
      formik.setTouched({ ...formik.touched, ['ESC_BAIRRO']: true });
      numberRef.current.focus()
      formik.handleChange
      setUf(resp?.uf)
      async () => {
        setListCity(await loadCity(resp?.uf));
      }
    }
    fetchAPI()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.ESC_CEP])



  return (
    <>
      <Card>
        <div className="mb-3">
          <strong>Nova Escola</strong>
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
              />
              {formik.errors.ESC_NOME ? <ErrorText>{formik.errors.ESC_NOME}</ErrorText> : null}
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
              />
              {formik.errors.ESC_INEP ? <ErrorText>{formik.errors.ESC_INEP}</ErrorText> : null}
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
              />
              {formik.errors.ESC_CEP ? <ErrorText>{formik.errors.ESC_CEP}</ErrorText> : null}
            </div>
            <div>
              <FormSelect className="" name="ESC_UF" value={uf} onChange={e => setUf(e.target.value)}>
                <option value="">Estado</option>
                {listUf.map((item, index) => (
                  <option key={index} value={item.sigla}>{item.sigla} - {item.nome}</option>
                ))}
              </FormSelect>
              {formik.errors.ESC_UF ? <ErrorText>{formik.errors.ESC_UF}</ErrorText> : null}
            </div>
            <div>
              <FormSelect name="ESC_CIDADE" value={formik.values.ESC_CIDADE} onChange={formik.handleChange}>
                <option value="">Município</option>
                {listCity.map((item, index) => (
                  <option key={index} value={item.nome}>{item.nome}</option>
                ))}
              </FormSelect>
              {formik.errors.ESC_CIDADE ? <ErrorText>{formik.errors.ESC_CIDADE}</ErrorText> : null}
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
              />
              {formik.errors.ESC_ENDERECO ? <ErrorText>{formik.errors.ESC_ENDERECO}</ErrorText> : null}
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
              />
              {formik.errors.ESC_BAIRRO ? <ErrorText>{formik.errors.ESC_BAIRRO}</ErrorText> : null}
            </div>
            <InputGroup2 paddingBottom={true}>
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
                />
                {formik.errors.ESC_NUMERO ? <ErrorText>{formik.errors.ESC_NUMERO}</ErrorText> : null}
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
                />
                {formik.errors.ESC_COMPLEMENTO ? <ErrorText>{formik.errors.ESC_COMPLEMENTO}</ErrorText> : null}
              </div>
            </InputGroup2>
          </InputGroup3>
          <ButtonGroupBetween >
            <div style={{width:160}}>
              <ButtonWhite onClick={(e) => { e.preventDefault(); formik.handleReset }}>
                Cancelar
              </ButtonWhite>
            </div>
            <div className="ms-3" style={{width:160}}>
              <ButtonPadrao type="submit" onClick={(e) => { e.preventDefault(); formik.handleSubmit(e) }} disable={!(formik.isValid && formik.dirty) || isDisabled}>
                Adicionar
              </ButtonPadrao>
            </div>
          </ButtonGroupBetween>
        </Form>
      </Card>
      <ModalConfirmacao
        show={ModalShowConfirm}
        onHide={() => { hideConfirm() }}
        text={modalStatus ? `Escola ${formik.values.ESC_NOME} adicionado com sucesso!` : errorMessage}
        status={modalStatus}
      />
    </>
  )
}
