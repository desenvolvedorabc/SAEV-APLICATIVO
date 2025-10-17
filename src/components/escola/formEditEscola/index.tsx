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
} from "src/shared/styledForms";
import { City } from "./styledComponents";
import ButtonWhite from "src/components/buttons/buttonWhite";
import { TypeSchool, createSchool, editSchool } from "src/services/escolas.service";
import ErrorText from "src/components/ErrorText";
import ModalConfirmacao from "src/components/modalConfirmacao";
import { loadCity, completeCEP } from "src/utils/combos";
import { useEffect, useRef, useState } from "react";
import ModalPergunta from "src/components/modalPergunta";
import Router from "next/router";
import ButtonVermelho from "src/components/buttons/buttonVermelho";
import { maskCEP } from "src/utils/masks";
import { MdOutlineSchool } from "react-icons/md";
import { Autocomplete, TextField } from "@mui/material";
import { useAuth } from "src/context/AuthContext";
import { useGetStates } from "src/services/estados.service";
import { queryClient } from "src/lib/react-query";

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
  ESC_TIPO: string;
}>;

export default function FormEditEscola({ escola, county }) {
  const [uf, setUf] = useState(null);
  const [modalShowConfirm, setModalShowConfirm] = useState(false);
  const [modalShowQuestion, setModalShowQuestion] = useState(false);
  const [modalShowConfirmQuestion, setModalShowConfirmQuestion] =
    useState(false);
  const [modalErrorMessage, setModalErrorMessage] = useState(false);
  const [active, setActive] = useState(escola?.ESC_ATIVO);
  const [modalStatus, setModalStatus] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isFieldDisabled, setIsFieldDisabled] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true)
  const { user } = useAuth()
  const numberRef = useRef(null);  

  const { data: states, isLoading: isLoadingStates } = useGetStates();

  useEffect(() => {
    if(!escola && (user?.USU_SPE?.role === 'ESTADO' || user?.USU_SPE?.role === 'MUNICIPIO_ESTADUAL')){
      formik.setFieldValue('ESC_TIPO', 'ESTADUAL', true)
    }
  }, [user])
  
  useEffect(() =>{
    formik.setFieldValue('ESC_CIDADE', county?.MUN_NOME)
  },[county])

  const validate = (values) => {
    const errors: ValidationErrors = {};
    if (!values.ESC_NOME) {
      errors.ESC_NOME = "Campo obrigatório";
    } else if (values.ESC_NOME.length < 6) {
      errors.ESC_NOME = "Deve ter no mínimo 6 caracteres";
    }
    if (!values.ESC_INEP) {
      errors.ESC_INEP = "Campo obrigatório";
    } else if (values.ESC_INEP.length !== 8) {
      errors.ESC_INEP = "Deve ter 8 caracteres";
    }
    if (!values.ESC_CEP) {
      errors.ESC_CEP = "Campo obrigatório";
    } else if (values.ESC_CEP.length < 9) {
      errors.ESC_CEP = "Deve ter no mínimo 8 caracteres";
    }
    // if (!uf) {
    //   errors.ESC_UF = "Campo obrigatório";
    // }
    // if (!values.ESC_CIDADE) {
    //   errors.ESC_CIDADE = "Campo obrigatório";
    // }
    if (!values.ESC_ENDERECO) {
      errors.ESC_ENDERECO = "Campo obrigatório";
    } else if (values.ESC_ENDERECO.length < 6) {
      errors.ESC_ENDERECO = "Deve ter no mínimo 6 caracteres";
    }
    if (!values.ESC_NUMERO) {
      errors.ESC_NUMERO = "Campo obrigatório";
    }
    if (!values.ESC_BAIRRO) {
      errors.ESC_BAIRRO = "Campo obrigatório";
    } else if (values.ESC_BAIRRO.length < 6) {
      errors.ESC_BAIRRO = "Deve ter no mínimo 6 caracteres";
    }
    if (!values.ESC_INTEGRAL) {
      errors.ESC_INTEGRAL = 'Campo obrigatório';
    }
    return errors;
  };

  // useEffect(() => {
  //   async function fetchAPI() {
  //     if (uf) {
  //       setListCity(await loadCity(uf?.abbreviation));
  //     }
  //   }
  //   fetchAPI();
  // }, [uf]);

  const formik = useFormik({
    initialValues: {
      ESC_NOME: escola?.ESC_NOME,
      ESC_INEP: escola?.ESC_INEP,
      ESC_UF: escola?.ESC_UF || county?.MUN_UF || '',
      ESC_CIDADE: escola?.ESC_CIDADE || county?.MUN_NOME,
      ESC_MUN: escola?.ESC_MUN?.MUN_ID || Number(county?.MUN_ID),
      ESC_ENDERECO: escola?.ESC_ENDERECO || '',
      ESC_NUMERO: escola?.ESC_NUMERO || '',
      ESC_COMPLEMENTO: escola?.ESC_COMPLEMENTO || '',
      ESC_BAIRRO: escola?.ESC_BAIRRO || '',
      ESC_CEP: escola?.ESC_CEP || '',
      ESC_LOGO: escola?.ESC_LOGO || '',
      ESC_ATIVO: escola?.ESC_ATIVO !== undefined ? escola?.ESC_ATIVO : true,
      ESC_STATUS: escola?.ESC_STATUS,
      ESC_INTEGRAL: escola?.ESC_INTEGRAL === true ? 'Sim' : 'Não',
      ESC_TIPO: escola?.ESC_TIPO || 'MUNICIPAL',
    },
    validate,
    onSubmit: async (values) => {
      const data = {
        ...values,
        ESC_MUN: values?.ESC_MUN || Number(county?.MUN_ID),
        ESC_INTEGRAL: values.ESC_INTEGRAL === 'Sim'
      }     
      
      setIsDisabled(true)
      let response = null;
      try{
        escola ? 
          response = await editSchool(escola?.ESC_ID, data)
        :
          response = await createSchool(data)
      }
      catch (err) {
        setIsDisabled(false)
        console.log("err", err.data);

      } finally {
        setIsDisabled(false)
        console.log('finally', response);
      }

      if (!response?.data?.message) {
        setActive(escola?.ESC_ATIVO);
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

  useEffect(() =>{
    if(states?.length > 0){
      if(escola){
        setUf(states?.find(state => state.abbreviation === escola?.ESC_UF))
      } else {
        setUf(states?.find(state => state.abbreviation === county?.MUN_UF))
        formik.setFieldValue('ESC_UF', county?.MUN_UF, true)
      }
    }
  },[states, escola, county])

  async function changeSchool() {
    setIsDisabled(true)

    setModalShowQuestion(false);
    escola = {
      ESC_ID: escola?.ESC_ID,
      ESC_ATIVO: !escola?.ESC_ATIVO,
    };
    let response = null;
      try{
        response = await editSchool(escola?.ESC_ID, escola);
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
      setActive(escola?.ESC_ATIVO);
      setModalShowConfirmQuestion(true);
      setModalStatus(true);
      queryClient.invalidateQueries(['schools_report', 'schools'])
    }
    else{
      setModalStatus(false);
      setModalShowConfirmQuestion(true);
      setModalErrorMessage(response?.data?.message)
    }
  }

  useEffect(() => {
    firstLoad ? setFirstLoad(false) : handleChangeCEP()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.ESC_CEP])

  const handleChangeCEP = async () => {
    const resp = await completeCEP(formik.values.ESC_CEP)
    
    if (resp && !resp?.error) {
      const resp = await completeCEP(formik.values.ESC_CEP);
      // formik.setFieldValue('ESC_UF', resp?.uf, true)
      // formik.setFieldValue('ESC_CIDADE', resp?.localidade, true)
      formik.setFieldValue('ESC_ENDERECO', resp?.logradouro, true)
      formik.setFieldValue('ESC_BAIRRO', resp?.bairro, true)
      numberRef.current.focus();
      // setUf(states?.find(state => state.abbreviation === resp?.uf))
      // setCity(listCity?.find(city => city.nome === resp?.localidade) || null);
    }
  }
  
  useEffect(() => {
    if(user?.USU_SPE?.role === 'ESCOLA') {
      setIsDisabled(true)
      setIsFieldDisabled(true)
    }
  },[user])
  
  // const handleChangeUf = (newValue) => {
  //   setUf(newValue)
  //   formik.setFieldValue('ESC_UF', newValue?.abbreviation, true)
  //   setCity(null)
  //   formik.setFieldValue('ESC_CIDADE', null, true)
  // }

  // const handleChangeCidade = (newValue) => {
  //   setCity(newValue)
  //   formik.setFieldValue('ESC_CIDADE', newValue?.nome, true)
  // }

  const handleChangType = (newValue) => {
    formik.setFieldValue('ESC_TIPO', newValue, true);
  }

  // const disableCounty = () => {
  //   if(isFieldDisabled || user?.USU_SPE?.role === 'MUNICIPIO_MUNICIPAL' || user?.USU_SPE?.role === 'MUNICIPIO_ESTADUAL'){
  //     return true
  //   }
  //   return false
  // }

  return (
    <>
      <Card>
        <div className="d-flex align-items-center">
          <div className="d-flex align-items-center">
            <MdOutlineSchool color={"#3E8277"} size={55} />
            <City>
              <strong>{escola ? escola?.ESC_NOME : 'Nova Escola'}</strong>
            </City>
          </div>
        </div>
        <Form onSubmit={formik.handleSubmit}>
          <InputGroup3Dashed className="" controlId="formBasic">
            <div>
              <Autocomplete
                className=""
                id="ESC_TIPO"
                size="small"
                disableClearable
                value={formik.values.ESC_TIPO}
                noOptionsText="Tipo"
                options={Object.keys(TypeSchool)}
                getOptionLabel={(option) => TypeSchool[option]}
                onChange={(_event, newValue) => {
                  handleChangType(newValue)}}
                renderInput={(params) => <TextField size="small" {...params} label="Tipo" />}
                disabled={user?.USU_SPE?.role !== 'SAEV'}
              />
            </div>
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
                inputProps={{ maxLength: 8 }}
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
              <Autocomplete
                className=""
                id="Estado"
                size="small"
                disableClearable
                value={uf}
                noOptionsText="Estado"
                options={states}
                getOptionLabel={(option) =>  `${option?.abbreviation} - ${option?.name}`}
                onChange={(_event, newValue) => {
                  // handleChangeUf(newValue)
                }}
                renderInput={(params) => <TextField size="small" {...params} label="Estado" />}
                disabled
              />
              {formik.errors.ESC_UF ? (
                <ErrorText>{formik.errors.ESC_UF}</ErrorText>
              ) : null}
            </div>
            <div>
              <Autocomplete
                className=""
                id="ESC_CIDADE"
                size="small"
                disableClearable
                value={county}
                noOptionsText="Município"
                options={[county]}
                getOptionLabel={(option) =>  `${option?.MUN_NOME}`}
                // onChange={(_event, newValue) => {
                //   handleChangeCidade(newValue)
                // }}
                disabled
                renderInput={(params) => <TextField size="small" {...params} label="Município" />}
              />
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
                InputLabelProps={{
                  shrink: formik.values.ESC_ENDERECO
                }}
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
                InputLabelProps={{
                  shrink: formik.values.ESC_BAIRRO
                }}
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
          {escola ?
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
                    dataTest='cancel'
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
                    dataTest='save'
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
          :
            <ButtonGroupBetween >
              <div style={{width:160}}>
                <ButtonWhite dataTest='cancel' onClick={(e) => { e.preventDefault(); formik.handleReset }}>
                  Cancelar
                </ButtonWhite>
              </div>
              <div className="ms-3" style={{width:160}}>
                <ButtonPadrao dataTest='save' type="submit" onClick={(e) => { e.preventDefault(); formik.handleSubmit(e) }} disable={!(formik.isValid && formik.dirty) || isDisabled}>
                  Adicionar
                </ButtonPadrao>
              </div>
            </ButtonGroupBetween>
          }
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
            ? `Escola ${formik.values.ESC_NOME} ${escola ? 'alterado' : 'adicionado'} com sucesso!`
            : modalErrorMessage
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
