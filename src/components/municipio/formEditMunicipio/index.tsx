import * as React from 'react'
import { useEffect, useRef, useState } from 'react'
import { Form } from "react-bootstrap"
import { useFormik } from 'formik'
import {ButtonPadrao} from 'src/components/buttons/buttonPadrao';

import ButtonVermelho from 'src/components/buttons/buttonVermelho'
import { City, Address } from './styledComponents'
import { InputGroup3Dashed, InputGroup3, InputGroup2, ButtonGroupBetween, Card,Container, ButtonNoBorder, FormSelect } from 'src/shared/styledForms';
import ButtonWhite from 'src/components/buttons/buttonWhite'
import { editCounty } from 'src/services/municipios.service'
import ErrorText from 'src/components/ErrorText'
import { add, format } from 'date-fns'
import ModalConfirmacao from 'src/components/modalConfirmacao'
import { completeCEP, loadCity, loadUf } from 'src/utils/combos'
import ModalPergunta from 'src/components/modalPergunta'
import Router from 'next/router'
import { useDropzone } from 'react-dropzone'
import { maskCEP } from 'src/utils/masks'
import * as yup from 'yup'
import { DatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import brLocale from 'date-fns/locale/pt-BR'
import { TextField } from '@mui/material'
import InputFile from 'src/components/InputFile';
import { isValidDate } from "src/utils/validate";
import { useAuth } from 'src/context/AuthContext';


export default function FormEditMunicipio({ municipio }) {
  const [uf, setUf] = useState(municipio.MUN_UF)
  const [listUf, setListUf] = useState([])
  const [city, setCity] = useState(municipio.MUN_CIDADE)
  const [listCity, setListCity] = useState([])
  const [modalShowConfirm, setModalShowConfirm] = useState(false)
  const [modalShowQuestion, setModalShowQuestion] = useState(false)
  const [modalShowConfirmQuestion, setModalShowConfirmQuestion] = useState(false)
  const [modalErrorMessage, setModalErrorMessage] = useState(false)
  const [active, setActive] = useState(municipio.MUN_ATIVO)
  const [modalStatus, setModalStatus] = useState(true)
  const [logo, setLogo] = useState(null)
  const [createObjectURL, setCreateObjectURL] = useState(null)
  const [file, setFile] = useState(null)
  const [dataInicio, setDataInicio] = useState(municipio.MUN_DT_INICIO)
  const [dataFinal, setDataFinal] = useState(municipio.MUN_DT_FIM)
  const [isDisabled, setIsDisabled] = useState(false);
  const { user } = useAuth()
  const numberRef = useRef(null)

  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject
  } = useDropzone({
    accept: "image/png, image/gif, image/jpeg",
    maxFiles: 1,
    onDrop: acceptedFiles => {
      setLogo(acceptedFiles[0])
      setCreateObjectURL(URL.createObjectURL(acceptedFiles[0]))
    }
  })

  const validationSchema = yup.object({
    MUN_NOME: yup
      .string()
      .required('Campo obrigatório'),
    MUN_CEP: yup
      .string()
      .min(9, 'CEP com formato inválido')
      .max(9, 'CEP com formato inválido')
      .required('Campo obrigatório'),
    MUN_UF: yup
      .string()
      .required('Campo obrigatório'),
    MUN_CIDADE: yup
      .string()
      .required('Campo obrigatório'),
    MUN_ENDERECO: yup
      .string()
      .required('Campo obrigatório')
      .min(6, 'Deve ter no minimo 6 caracteres'),
    MUN_NUMERO: yup
      .string()
      .required('Campo obrigatório'),
    MUN_BAIRRO: yup
      .string()
      .required('Campo obrigatório')
      .min(6, 'Deve ter no minimo 6 caracteres'),
    MUN_DT_INICIO: yup
      .date()
      .required('Campo obrigatório'),
    MUN_DT_FIM: yup
      .date()
      .nullable()
      .default(null)
      .when("MUN_DT_INICIO",
        (started, yup) =>
          started &&
          yup
            .min(started, "A data final deve ser maior que a inicial"))
      .required('Campo obrigatório'),
  })

  useEffect(() => {
    async function fetchAPI() {
      setListUf(await loadUf())
    }
    fetchAPI()
  }, [])
  useEffect(() => {
    async function fetchAPI() {
      if (uf) {
        setListCity(await loadCity(uf))
      }
    }
    fetchAPI()
  }, [uf])

  const formik = useFormik({
    initialValues: {
      MUN_NOME: municipio.MUN_NOME,
      MUN_UF: municipio.MUN_UF,
      MUN_CIDADE: municipio.MUN_CIDADE,
      MUN_COD_IBGE: municipio.MUN_COD_IBGE,
      MUN_ENDERECO: municipio.MUN_ENDERECO,
      MUN_NUMERO: municipio.MUN_NUMERO,
      MUN_COMPLEMENTO: municipio.MUN_COMPLEMENTO,
      MUN_BAIRRO: municipio.MUN_BAIRRO,
      MUN_CEP: municipio.MUN_CEP,
      MUN_DT_INICIO: municipio ? new Date(municipio.MUN_DT_INICIO) : '',
      MUN_DT_FIM: municipio ? new Date(municipio.MUN_DT_FIM) : '',
      MUN_ARQ_CONVENIO: municipio.MUN_ARQ_CONVENIO,
      MUN_LOGO: municipio.MUN_LOGO,
      MUN_ATIVO: municipio.MUN_ATIVO,
      MUN_STATUS: municipio.MUN_STATUS,
    },
    validationSchema: validationSchema,
    onSubmit: async (county) => {
      county.MUN_UF = uf
      county.MUN_CIDADE = city

      let logoForm = null
      if (logo) {
        logoForm = logo
      }

      let fileForm = null
      if (file) {
        fileForm = file
      }

      let response = null;
      try{
        response = await editCounty(municipio.MUN_ID, county, logoForm, fileForm);
      }
      catch (err) {
        setIsDisabled(false)
      } finally {
        setIsDisabled(false)
        console.log('finally', response);
      }
      if (!response?.data?.message) {
        setModalShowConfirm(true);
        setModalStatus(true);
      } else {
        setModalStatus(false);
        setModalShowConfirm(true);
        setModalErrorMessage(response.data.message);
      }
    }
  })

  async function changeCounty() {
    setModalShowQuestion(false)
    municipio = {
      MUN_ID: municipio.MUN_ID,
      MUN_ATIVO: !municipio.MUN_ATIVO
    }

    let response = null;
    try{
      response = await editCounty(municipio.MUN_ID, municipio, null, null)
    }
    catch (err) {
      setIsDisabled(false)
    } finally {
      setIsDisabled(false)
      console.log('finally', response);
    }
    if (!response?.data?.message) {
      formik.values.MUN_ATIVO = !active;
      setActive(!active);
      setModalShowConfirmQuestion(true);
      setModalStatus(true);
    } else {
      setModalStatus(false);
      setModalShowConfirm(true);
      console.log('response.data.message', response.data.message);

      setModalErrorMessage(response?.data?.message);
    }
  }

  const RemoveImage = () => {
    setLogo(null)
    setCreateObjectURL(null)
  }


  useEffect(() => {
    async function fetchAPI() {
      const resp = await completeCEP(formik.values.MUN_CEP)
      formik.values.MUN_UF = resp?.uf
      formik.values.MUN_CIDADE = resp?.localidade
      formik.values.MUN_ENDERECO = resp?.logradouro
      formik.values.MUN_BAIRRO = resp?.bairro
      formik.setTouched({ ...formik.touched, ['MUN_UF']: true });
      formik.setTouched({ ...formik.touched, ['MUN_CIDADE']: true });
      formik.setTouched({ ...formik.touched, ['MUN_ENDERECO']: true });
      formik.setTouched({ ...formik.touched, ['MUN_BAIRRO']: true });
      formik.handleChange
      setUf(resp?.uf)
      async () => {
        setListCity(await loadCity(resp?.uf));
      }
    }
    fetchAPI()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.MUN_CEP])

  const onFileChange = (e) => {
    setFile(e.target.value)
  }

  const handleChangeUf = (e) => {
    setUf(e.target.value)
    formik.values.MUN_UF = e.target.value;
    formik.setTouched({ ...formik.touched, ['MUN_UF']: true });
  }

  const handleChangeCidade = (e) => {
    setCity(e.target.value)
    formik.values.MUN_CIDADE = e.target.value;
    formik.setTouched({ ...formik.touched, ['MUN_CIDADE']: true });
  }

  useEffect(() => {
    let findCity = listCity.find(c => c.nome === formik.values.MUN_CIDADE)
    formik.values.MUN_COD_IBGE = findCity?.id
  },[formik.values.MUN_CIDADE, listCity])

  const getNameDisabled = () => {
    if(user?.USU_SPE?.SPE_PER?.PER_NOME === 'Município' || user?.USU_SPE?.SPE_PER?.PER_NOME === 'Escola'){
      return true
    }
    return false
  }

  return (
    <>
      <Card>
        <div className="d-flex align-items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {municipio.MUN_LOGO && <img src={municipio?.MUN_LOGO_URL} width={70} alt="logo municipio" />}
          <div className="ms-3">
            <City><strong>{municipio.MUN_NOME}</strong></City>
            <Address>{municipio.MUN_ENDERECO}, {municipio.MUN_NUMERO}, {municipio.MUN_COMPLEMENTO ? municipio.MUN_COMPLEMENTO + "," : ""} {municipio.MUN_CEP}, {municipio.MUN_BAIRRO}, {municipio.MUN_CIDADE} - {municipio.MUN_UF}</Address>
          </div>
        </div>
        <Form onSubmit={formik.handleSubmit}>
          <InputGroup3Dashed className="" controlId="formBasic">
            <div>
              <TextField
                fullWidth
                label="Nome"
                name="MUN_NOME"
                id="MUN_NOME"
                value={formik.values.MUN_NOME}
                onChange={formik.handleChange}
                size="small"
                disabled={getNameDisabled()}
              />
              {formik.touched.MUN_NOME && formik.errors.MUN_NOME ? <ErrorText id="error-MUN_NOME">{formik.errors.MUN_NOME}</ErrorText> : null}
            </div>
          </InputGroup3Dashed>
          <InputGroup3>
            <div>
              <TextField
                fullWidth
                label="CEP"
                name="MUN_CEP"
                id="MUN_CEP"
                value={maskCEP(formik.values.MUN_CEP)}
                onChange={formik.handleChange}
                size="small"
              />
              {formik.touched.MUN_CEP && formik.errors.MUN_CEP ? <ErrorText id="error-MUN_CEP">{formik.errors.MUN_CEP}</ErrorText> : null}
            </div>
            <div>
              <FormSelect 
                className=""
                name="MUN_UF" 
                value={uf} 
                onChange={e => handleChangeUf(e)}
              >
                <option value="">Estado</option>
                {listUf.map((item, index) => (
                  <option key={index} value={item.sigla}>{item.sigla} - {item.nome}</option>
                ))}
              </FormSelect>
              {formik.touched.MUN_UF && formik.errors.MUN_UF && <ErrorText id="error-MUN_UF">{formik.errors.MUN_UF}</ErrorText>}
            </div>
            <div>
              <FormSelect 
                name="MUN_CIDADE" 
                value={city} 
                onChange={e => handleChangeCidade(e)}
              >
                <option value="">Município</option>
                {listCity.map((item, index) => (
                  <option key={index} value={item.nome}>{item.nome}</option>
                ))}
              </FormSelect>
              {formik.touched.MUN_CIDADE && formik.errors.MUN_CIDADE && <ErrorText>{formik.errors.MUN_CIDADE}</ErrorText>}
            </div>
          </InputGroup3>
          <InputGroup3Dashed className="" controlId="formBasic">
            <div>
              <TextField
                fullWidth
                label="Endereço da SME"
                name="MUN_ENDERECO"
                id="MUN_ENDERECO"
                value={formik.values.MUN_ENDERECO}
                onChange={formik.handleChange}
                size="small"
              />
              {formik.touched.MUN_ENDERECO && formik.errors.MUN_ENDERECO ? <ErrorText>{formik.errors.MUN_ENDERECO}</ErrorText> : null}
            </div>
            <div>
              <TextField
                fullWidth
                label="Bairro"
                name="MUN_BAIRRO"
                id="MUN_BAIRRO"
                value={formik.values.MUN_BAIRRO}
                onChange={formik.handleChange}
                size="small"
              />
              {formik.touched.MUN_BAIRRO && formik.errors.MUN_BAIRRO ? <ErrorText>{formik.errors.MUN_BAIRRO}</ErrorText> : null}
            </div>
            <InputGroup2>
              <div>
                <TextField
                  fullWidth
                  label="Numero"
                  name="MUN_NUMERO"
                  id="MUN_NUMERO"
                  value={formik.values.MUN_NUMERO}
                  onChange={formik.handleChange}
                  size="small"
                  ref={numberRef}
                />
                {formik.touched.MUN_NUMERO && formik.errors.MUN_NUMERO ? <ErrorText>{formik.errors.MUN_NUMERO}</ErrorText> : null}
              </div>
              <div>
                <TextField
                  fullWidth
                  label="Complemento"
                  name="MUN_COMPLEMENTO"
                  id="MUN_COMPLEMENTO"
                  value={formik.values.MUN_COMPLEMENTO}
                  onChange={formik.handleChange}
                  size="small"
                />
                {formik.touched.MUN_COMPLEMENTO && formik.errors.MUN_COMPLEMENTO ? <ErrorText>{formik.errors.MUN_COMPLEMENTO}</ErrorText> : null}
              </div>
            </InputGroup2>
          </InputGroup3Dashed>
          <InputGroup3Dashed className="" controlId="formBasic">
            <div className="">
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                locale={brLocale}
              >
                <DatePicker
                  openTo="year"
                  views={["year", "month", "day"]}
                  label="Data Inicio"
                  value={dataInicio}
                  onChange={(val) => {
                    if (isValidDate(val)) {
                      setDataInicio(val);
                      formik.values.MUN_DT_INICIO = format(new Date(val), 'yyyy-MM-dd 23:59:59');
                      return;
                    }
                    formik.values.MUN_DT_INICIO = "";
                    setDataInicio("");
                  }}
                  renderInput={(params) => (
                    <TextField
                      fullWidth
                      size="small"
                      {...params}
                      sx={{ backgroundColor: "#FFF" }}
                    />
                  )}
                />
              </LocalizationProvider>
              {formik.touched.MUN_DT_INICIO && formik.errors.MUN_DT_INICIO ? <ErrorText>{formik.errors.MUN_DT_INICIO}</ErrorText> : null}
            </div>
              <div className="">
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                locale={brLocale}
              >
                <DatePicker
                  openTo="year"
                  views={["year", "month", "day"]}
                  label="Data Final"
                  value={dataFinal}
                  onChange={(val) => {
                    if (isValidDate(val)) {
                      setDataFinal(val);
                      formik.values.MUN_DT_FIM = format(new Date(val), 'yyyy-MM-dd 23:59:59');
                      return;
                    }
                    formik.values.MUN_DT_FIM = "";
                    setDataFinal("");
                  }}
                  renderInput={(params) => (
                    <TextField
                      fullWidth
                      size="small"
                      {...params}
                      sx={{ backgroundColor: "#FFF" }}
                    />
                  )}
                />
              </LocalizationProvider>
              {formik.touched.MUN_DT_FIM && formik.errors.MUN_DT_FIM ? <ErrorText>{formik.errors.MUN_DT_FIM}</ErrorText> : null}
            </div>
            <div>
              <InputFile label="Termo de Colaboração (PDF)" onChange={(e) => onFileChange(e)} error={formik.touched.MUN_ARQ_CONVENIO} acceptFile={".pdf"} />
            </div>
          </InputGroup3Dashed>
          <InputGroup3Dashed>
            <div>
              <Form.Label>
                Logo
              </Form.Label>
              <div className="d-flex">
                <div className="col-6 d-flex flex-column justify-content-center align-items-center">
                  <Container {...getRootProps({ isFocused, isDragAccept, isDragReject })}>
                    <input {...getInputProps()} />
                    {
                      createObjectURL ?
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={createObjectURL} width={150} alt="logo municipio" />
                        :
                        <p>Arraste uma imagem ou clique Para selecionar uma imagem.</p>
                    }
                  </Container>
                  {logo &&
                    <ButtonNoBorder type="button" onClick={RemoveImage}>Remover</ButtonNoBorder>
                  }
                </div>
              </div>
            </div>
          </InputGroup3Dashed>
          <ButtonGroupBetween >
            <div>
              {formik.values.MUN_ATIVO ? (
                <ButtonVermelho onClick={(e) => { e.preventDefault(); setModalShowQuestion(true) }}>
                  Desativar
                </ButtonVermelho>) : (
                <ButtonPadrao onClick={(e) => { e.preventDefault(); setModalShowQuestion(true) }}>
                  Ativar
                </ButtonPadrao>)}
            </div>
            <div className="d-flex">
              <div style={{width:160}}>
                <ButtonWhite onClick={(e) => { e.preventDefault() }}>
                  Baixar Termo de Colaboração
                </ButtonWhite>
              </div>
              <div className="ms-3" style={{width:160}}>
                <ButtonWhite onClick={(e) => { e.preventDefault(); formik.resetForm() }}>
                  Descartar Alterações
                </ButtonWhite>
              </div>
              <div className="ms-3" style={{width:160}}>
                <ButtonPadrao type="submit" onClick={(e) => { e.preventDefault(); formik.handleSubmit(e) }} disable={isDisabled}>
                  Salvar
                </ButtonPadrao>
              </div>
            </div>
          </ButtonGroupBetween>
        </Form>
      </Card>
      <ModalConfirmacao
        show={modalShowConfirm}
        onHide={() => { setModalShowConfirm(false); if (modalStatus) Router.reload() }}
        text={modalStatus ? `Município ${formik.values.MUN_NOME} alterado com sucesso!` : `Erro ao alterar município`}
        status={modalStatus}
      />
      <ModalPergunta
        show={modalShowQuestion}
        onHide={() => setModalShowQuestion(false)}
        onConfirm={() => changeCounty()}
        buttonNo={active ? 'Não Desativar' : 'Não Ativar'}
        buttonYes={'Sim, Tenho Certeza'}
        text={`Você está ${!active === true ? 'ativando(a)' : 'desativando(a)'} o(a) “${formik.values.MUN_NOME}”, ao desativar esse Município todos os Usuários serão DESATIVADOS, você tem certeza que deseja seguir em diante?. Você pode ${active === true ? 'ativar' : 'desativar'} novamente a qualquer momento.`}
        status={!active}
        size="lg"
      />
      <ModalConfirmacao
        show={modalShowConfirmQuestion}
        onHide={() => { setModalShowConfirmQuestion(false); modalStatus && Router.reload() }}
        text={modalStatus ? `${formik.values.MUN_NOME} ${active === true ? 'ativado' : 'desativado'} com sucesso!` : modalErrorMessage ? modalErrorMessage : `Erro ao ${!active ? "ativar" : "desativar"}`}
        status={modalStatus}
      />
    </>
  )
}