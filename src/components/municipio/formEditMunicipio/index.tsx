import * as React from 'react'
import { useEffect, useRef, useState } from 'react'
import { Form } from "react-bootstrap"
import { useFormik } from 'formik'
import {ButtonPadrao} from 'src/components/buttons/buttonPadrao';

import ButtonVermelho from 'src/components/buttons/buttonVermelho'
import { City, Address } from './styledComponents'
import { InputGroup3Dashed, InputGroup3, InputGroup2, ButtonGroupBetween, Card,Container, ButtonNoBorder, ButtonGroupEnd } from 'src/shared/styledForms';
import ButtonWhite from 'src/components/buttons/buttonWhite'
import { changeShareData, createCounty, editCounty } from 'src/services/municipios.service'
import ErrorText from 'src/components/ErrorText'
import { format } from 'date-fns'
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
import { Autocomplete, Checkbox, FormControlLabel, TextField } from '@mui/material'
import InputFile from 'src/components/InputFile';
import { isValidDate } from "src/utils/validate";
import { useAuth } from 'src/context/AuthContext';
import { useGetStates } from 'src/services/estados.service';

export default function FormEditMunicipio({ municipio }) {
  const [uf, setUf] = useState(null)
  const [city, setCity] = useState(municipio?.MUN_CIDADE || null)
  const [listCity, setListCity] = useState([])
  const [modalShowConfirm, setModalShowConfirm] = useState(false)
  const [modalShowQuestion, setModalShowQuestion] = useState(false)
  const [modalShowConfirmQuestion, setModalShowConfirmQuestion] = useState(false)
  const [modalErrorMessage, setModalErrorMessage] = useState(false)
  const [active, setActive] = useState(municipio?.MUN_ATIVO)
  const [modalStatus, setModalStatus] = useState(true)
  const [logo, setLogo] = useState(null)
  const [createObjectURL, setCreateObjectURL] = useState(null)
  const [file, setFile] = useState(null)
  const [dataInicio, setDataInicio] = useState(municipio?.MUN_DT_INICIO)
  const [dataFinal, setDataFinal] = useState(municipio?.MUN_DT_FIM)
  const [isDisabled, setIsDisabled] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true)
  const [selectEmail, setSelectEmail] = useState(municipio?.MUN_MENSAGEM_EMAIL_ATIVO)
  const [selectWhatsapp, setSelectWhatsapp] = useState(municipio?.MUN_MENSAGEM_WHATSAPP_ATIVO)
  const { user } = useAuth()
  const numberRef = useRef(null)

  const { data: states, isLoading: isLoadingStates } = useGetStates();

  useEffect(() =>{
    if(states?.length > 0 && municipio)
      setUf(states?.find(state => state.abbreviation === municipio?.MUN_UF))
  },[states, municipio])

  useEffect(() =>{
    if(listCity?.length > 0)
      setCity(listCity?.find(city => city.nome === formik.values.MUN_CIDADE))
  },[listCity])

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
    MUN_PARCEIRO_EPV: yup
      .string()
      .required('Campo obrigatório'),
  })
  
  useEffect(() => {
    async function fetchAPI() {
      if (uf) {
        const list = await loadCity(uf?.abbreviation)
        setListCity(list);
        // setCity(list?.find(city => city.nome === formik.values.MUN_CIDADE))
      }
    }
    fetchAPI()
  }, [uf])

  const formik = useFormik({
    initialValues: {
      MUN_NOME: municipio?.MUN_NOME,
      MUN_UF: municipio?.MUN_UF,
      MUN_CIDADE: municipio?.MUN_CIDADE,
      MUN_COD_IBGE: municipio?.MUN_COD_IBGE,
      MUN_ENDERECO: municipio?.MUN_ENDERECO,
      MUN_NUMERO: municipio?.MUN_NUMERO,
      MUN_COMPLEMENTO: municipio?.MUN_COMPLEMENTO || '',
      MUN_BAIRRO: municipio?.MUN_BAIRRO,
      MUN_CEP: municipio?.MUN_CEP,
      MUN_DT_INICIO: municipio ? new Date(municipio?.MUN_DT_INICIO) : '',
      MUN_DT_FIM: municipio ? new Date(municipio?.MUN_DT_FIM) : '',
      MUN_ARQ_CONVENIO: municipio?.MUN_ARQ_CONVENIO || '',
      MUN_LOGO: municipio?.MUN_LOGO || '',
      MUN_ATIVO: municipio?.MUN_ATIVO !== undefined ? municipio?.MUN_ATIVO : true,
      MUN_STATUS: municipio?.MUN_STATUS || '',
      MUN_PARCEIRO_EPV: municipio?.MUN_PARCEIRO_EPV ? 'Sim' : 'Não',
      MUN_COMPARTILHAR_DADOS: municipio?.MUN_COMPARTILHAR_DADOS ? 'Sim' : 'Não',
      MUN_MENSAGEM_EMAIL_ATIVO: municipio?.MUN_MENSAGEM_EMAIL_ATIVO === '1',
      MUN_MENSAGEM_WHATSAPP_ATIVO: municipio?.MUN_MENSAGEM_WHATSAPP_ATIVO === '1',
      MUN_LEITURA_HERBY_ATIVO: municipio?.MUN_LEITURA_HERBY_ATIVO ? 'Sim' : 'Não',
    },
    validationSchema: validationSchema,
    onSubmit: async (county) => {

      const data = {
        ...county,
        MUN_UF: uf?.abbreviation,
        MUN_COD_IBGE: city?.id,
        MUN_PARCEIRO_EPV: county.MUN_PARCEIRO_EPV  === 'Sim',
        MUN_COMPARTILHAR_DADOS: county.MUN_COMPARTILHAR_DADOS  === 'Sim',
        MUN_MENSAGEM_EMAIL_ATIVO: selectEmail ? true : false,
        MUN_MENSAGEM_WHATSAPP_ATIVO: selectWhatsapp ? true : false,
        MUN_LEITURA_HERBY_ATIVO: county.MUN_LEITURA_HERBY_ATIVO  === 'Sim',
        stateId: uf?.id,
      }

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
        if(municipio && user?.USU_MUN?.MUN_ID === municipio?.MUN_ID && municipio?.MUN_COMPARTILHAR_DADOS !== data?.MUN_COMPARTILHAR_DADOS){
          response = await changeShareData(municipio?.MUN_ID)
        } else{
          municipio ? 
            response = await editCounty(municipio?.MUN_ID, data, logoForm, fileForm)
            :
            response = await createCounty(data, logoForm, fileForm)
        }
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
      MUN_ID: municipio?.MUN_ID,
      MUN_ATIVO: !municipio?.MUN_ATIVO
    }

    let response = null;
    try{
      response = await editCounty(municipio?.MUN_ID, municipio, null, null)
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

      setModalErrorMessage(response?.data?.message);
    }
  }

  const RemoveImage = () => {
    setLogo(null)
    setCreateObjectURL(null)
  }

  useEffect(() => {
    firstLoad ? setFirstLoad(false) : handleChangeCEP()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.MUN_CEP])

  const handleChangeCEP = async () => {
    const resp = await completeCEP(formik.values.MUN_CEP)
    
    if (resp && !resp?.error) {
      formik.setFieldValue('MUN_UF', resp?.uf, true)
      formik.setFieldValue('MUN_CIDADE', resp?.localidade, true)
      formik.setFieldValue('MUN_ENDERECO', resp?.logradouro, true)
      formik.setFieldValue('MUN_BAIRRO', resp?.bairro, true)
      numberRef.current.focus()
      setUf(states?.find(state => state.abbreviation === resp?.uf))
      async () => {
        const list = await loadCity(resp?.uf)
        setListCity(list);
        setCity(list?.find(city => city.nome === resp?.localidade) || null);
      }
    }
  }

  const onFileChange = (e) => {
    setFile(e.target.value)
  }

  const handleChangeUf = (newValue) => {
    setUf(newValue)
    formik.setFieldValue('MUN_UF', newValue?.abbreviation, true)
    setCity(null)
    formik.setFieldValue('MUN_CIDADE', null, true)
  }

  const handleChangeCidade = (newValue) => {
    setCity(newValue)
    formik.setFieldValue('MUN_CIDADE', newValue?.nome, true)
  }

  const getShareDisabled = () => {
    if(user?.USU_SPE?.role === 'MUNICIPIO_MUNICIPAL'){
      return false
    }
    return true
  }

  const getInputDisabled = () => {
    if(user?.USU_SPE?.role === 'MUNICIPIO_ESTADUAL' ||  municipio && user?.USU_SPE?.role === 'ESTADO'){
      return true;
    }
    return false;
  } 

  return (
    <>
      <Card>
        {municipio ? 
          <div className="d-flex align-items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {municipio?.MUN_LOGO && <img src={municipio?.MUN_LOGO_URL} width={70} alt="logo municipio" />}
            <div>
              <City><strong>{municipio?.MUN_NOME}</strong></City>
              <Address>{municipio?.MUN_ENDERECO}, {municipio?.MUN_NUMERO}, {municipio?.MUN_COMPLEMENTO ? municipio?.MUN_COMPLEMENTO + "," : ""} {municipio?.MUN_CEP}, {municipio?.MUN_BAIRRO}, {municipio?.MUN_CIDADE} - {municipio?.MUN_UF}</Address>
            </div>
          </div>
        :
          <div className="mb-3">
            <strong>Novo Município</strong>
          </div>
        }
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
                disabled={getInputDisabled()}
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
                disabled={getInputDisabled()}
              />
              {formik.touched.MUN_CEP && formik.errors.MUN_CEP ? <ErrorText id="error-MUN_CEP">{formik.errors.MUN_CEP}</ErrorText> : null}
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
                  handleChangeUf(newValue)}}
                renderInput={(params) => <TextField size="small" {...params} label="Estado" />}
                disabled={getInputDisabled()}
              />
              {formik.touched.MUN_UF && formik.errors.MUN_UF && <ErrorText id="error-MUN_UF">{formik.errors.MUN_UF}</ErrorText>}
            </div>
            <div>
              <Autocomplete
                className=""
                id="MUN_CIDADE"
                size="small"
                disableClearable
                value={city}
                noOptionsText="Município"
                options={listCity}
                getOptionLabel={(option) =>  `${option?.nome}`}
                onChange={(_event, newValue) => {
                  handleChangeCidade(newValue)}}
                renderInput={(params) => <TextField size="small" {...params} label="Município" />}
                disabled={getInputDisabled()}
              />
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
                InputLabelProps={{
                  shrink: formik.values.MUN_ENDERECO
                }}
                size="small"
                disabled={getInputDisabled()}
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
                InputLabelProps={{
                  shrink: formik.values.MUN_BAIRRO
                }}
                size="small"
                disabled={getInputDisabled()}
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
                  disabled={getInputDisabled()}
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
                  disabled={getInputDisabled()}
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
                data-test='dataInicio'
              >
                <DatePicker
                  openTo="year"
                  views={["year", "month", "day"]}
                  data-test='dataInicio'
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
                      data-test='dataInicio'
                      id='dataInicio'
                      {...params}
                      sx={{ backgroundColor: "#FFF" }}
                    />
                  )}
                  disabled={getInputDisabled()}
                />
              </LocalizationProvider>
              {formik.touched.MUN_DT_INICIO && formik.errors.MUN_DT_INICIO ? <ErrorText>{formik.errors.MUN_DT_INICIO}</ErrorText> : null}
            </div>
              <div className="">
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                locale={brLocale}
                data-test='dataFinal'
              >
                <DatePicker
                  openTo="year"
                  views={["year", "month", "day"]}
                  label="Data Final"
                  data-test='dataFinal'
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
                      data-test='dataFinal'
                      id='dataFinal'
                      size="small"
                      {...params}
                      sx={{ backgroundColor: "#FFF" }}
                    />
                  )}
                  disabled={getInputDisabled()}
                />
              </LocalizationProvider>
              {formik.touched.MUN_DT_FIM && formik.errors.MUN_DT_FIM ? <ErrorText>{formik.errors.MUN_DT_FIM}</ErrorText> : null}
            </div>
            <div>
              <InputFile label="Termo de Colaboração (PDF)" onChange={(e) => onFileChange(e)} error={formik.touched.MUN_ARQ_CONVENIO} acceptFile={".pdf"} />
            </div>
            <div style={{ marginTop: 15}}>
              <Autocomplete
                className=""
                id="MUN_PARCEIRO_EPV"
                size="small"
                value={formik.values.MUN_PARCEIRO_EPV}
                disableClearable
                noOptionsText="É Parceiro EPV?"
                options={['Sim', 'Não']}
                onChange={(_event, newValue) => {
                  formik.setFieldValue('MUN_PARCEIRO_EPV', newValue)}}
                renderInput={(params) => <TextField size="small" {...params} label="É Parceiro EPV?" />}
                disabled={user?.USU_SPE?.role !== 'SAEV'}
              />
            </div>
            <div style={{ marginTop: 15}}>
              <Autocomplete
                className=""
                id="MUN_COMPARTILHAR_DADOS"
                size="small"
                value={formik.values.MUN_COMPARTILHAR_DADOS}
                disableClearable
                noOptionsText="Compartilhar Dados"
                options={['Sim', 'Não']}
                onChange={(_event, newValue) => {
                  formik.setFieldValue('MUN_COMPARTILHAR_DADOS', newValue)}}
                renderInput={(params) => <TextField size="small" {...params} label="Compartilhar Dados" />}
                disabled={getShareDisabled()}
              />
            </div>
            <div style={{ marginTop: 15}}>
              <FormControlLabel 
                sx={{
                  border: '1px solid #D4D4D4',
                  borderRadius: '8px',
                  paddingRight: '10px',
                  marginLeft: '2px',
                  width: '100%',

                  '& .MuiFormControlLabel-label': {
                    fontSize: 12,
                    fontWeight: 400,
                  }
                }} 
                control={
                  <Checkbox checked={selectEmail} />
                } 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelectEmail(e.target.checked)}
                disabled={user?.USU_SPE?.role !== 'SAEV'}
                label="Permitir envio de E-mail" 
              />
            </div>
             <div style={{ marginTop: 15}}>
              <Autocomplete
                className=""
                id="MUN_LEITURA_HERBY_ATIVO"
                size="small"
                value={formik.values.MUN_LEITURA_HERBY_ATIVO}
                disableClearable
                noOptionsText="É Parceiro EPV?"
                options={['Sim', 'Não']}
                onChange={(_event, newValue) => {
                  formik.setFieldValue('MUN_LEITURA_HERBY_ATIVO', newValue)}}
                renderInput={(params) => <TextField size="small" {...params} label="Lançamentos Leitura pelo Herby?" />}
                disabled={user?.USU_SPE?.role !== 'SAEV'}
              />
            </div>
                        <div style={{ marginTop: 15}}>              
              <FormControlLabel 
                sx={{
                  border: '1px solid #D4D4D4',
                  borderRadius: '8px',
                  paddingRight: '10px',
                  marginLeft: '2px',
                  width: '100%',

                  '& .MuiFormControlLabel-label': {
                    fontSize: 12,
                    fontWeight: 400,
                  }
                }} 
                control={
                  <Checkbox checked={selectWhatsapp} />
                } 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelectWhatsapp(e.target.checked)}
                disabled={user?.USU_SPE?.role !== 'SAEV'}
                label="Permitir envio de Whatsapp" 
              />
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
          {municipio ? 
            <ButtonGroupBetween >
              {user?.USU_SPE?.role ==='SAEV' ?
                <div>
                  {formik.values.MUN_ATIVO ? (
                    <ButtonVermelho dataTest='inactive' onClick={(e) => { e.preventDefault(); setModalShowQuestion(true) }}>
                      Desativar
                    </ButtonVermelho>) : (
                    <ButtonPadrao dataTest='active' onClick={(e) => { e.preventDefault(); setModalShowQuestion(true) }}>
                      Ativar
                    </ButtonPadrao>)}
                </div>
                :
                <div></div>
              }
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
          :
            <ButtonGroupEnd >
              <div style={{width:160}}>
                <ButtonWhite onClick={(e) => { e.preventDefault(); formik.resetForm() }}>
                Cancelar
              </ButtonWhite>
              </div>
              <div className="ms-3" style={{width:160}}>
                <ButtonPadrao type="submit" onClick={(e) => { e.preventDefault(); formik.handleSubmit(e) }} disable={isDisabled}>
                  Adicionar
                </ButtonPadrao>
              </div>
            </ButtonGroupEnd>
          }
        </Form>
      </Card>
      <ModalConfirmacao
        show={modalShowConfirm}
        onHide={() => { 
          setModalShowConfirm(false)
          modalStatus && (municipio ? Router.reload() : Router.back()) 
        }}
        text={modalStatus ? `Município ${formik.values.MUN_NOME} ${municipio ? 'alterado' : 'adicionado'} com sucesso!` : modalErrorMessage}
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