import * as React from 'react'
import { Form } from "react-bootstrap"
import { useFormik } from 'formik'
import {ButtonPadrao} from 'src/components/buttons/buttonPadrao';

import { InputGroup, Container } from './styledComponents'
import { InputGroup3, InputGroup2, ButtonGroupBetween, Card, ButtonNoBorder, FormSelect } from 'src/shared/styledForms'
import ButtonWhite from '../../buttons/buttonWhite'
import { editTeacher, getAllGender, getAllSkin, getAllFormation } from 'src/services/professores.service'
import ErrorText from '../../ErrorText'
import ModalConfirmacao from '../../modalConfirmacao'
import ModalPergunta from '../../modalPergunta'
import { loadCity, loadUf, completeCEP } from 'src/utils/combos';
import { maskCEP, maskCPF, maskPhone } from 'src/utils/masks';
import { useEffect, useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import Router from 'next/router'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import { DatePicker } from '@mui/lab'
import { TextField } from '@mui/material'
import brLocale from 'date-fns/locale/pt-BR'
import { format } from 'date-fns'
import ButtonVermelho from 'src/components/buttons/buttonVermelho'
import { isValidCPF, isValidDate } from 'src/utils/validate'
import CardInfoProfessorRelatorio from '../cardInfoProfessorRelatorio'
import * as yup from 'yup'

export default function FormEditProfessor({ professor, municipio }) {

  const [modalShowConfirm, setModalShowConfirm] = useState(false)
  const [modalShowQuestion, setModalShowQuestion] = useState(false)
  const [modalShowConfirmQuestion, setModalShowConfirmQuestion] = useState(false)
  const [active, setActive] = useState(professor.PRO_ATIVO)
  const [modalStatus, setModalStatus] = useState(true)
  const [uf, setUf] = useState('')
  const [listUf, setListUf] = useState([])
  const [listCity, setListCity] = useState([])
  const [listGender, setListGender] = useState([])
  const [listSkin, setListSkin] = useState([])
  const [listFormation, setListFormation] = useState([])
  const [avatar, setAvatar] = useState(null)
  const [createObjectURL, setCreateObjectURL] = useState(null)
  const [errorMessage, setErrorMessage] = useState(true)
  const [birthDate, setBirthDate] = useState("")
  const [isDisabled, setIsDisabled] = useState(false);

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
      setAvatar(acceptedFiles[0])
      setCreateObjectURL(URL.createObjectURL(acceptedFiles[0]))
    }
  })

  const validationSchema = yup.object({
    PRO_NOME: yup
      .string()
      .required('Campo obrigatório'),
    PRO_CEP: yup
      .string()
      .min(9, 'CEP com formato inválido')
      .max(9, 'CEP com formato inválido')
      .required('Campo obrigatório'),
    PRO_UF: yup
      .string()
      .required('Campo obrigatório'),
    PRO_CIDADE: yup
      .string()
      .required('Campo obrigatório'),
    PRO_ENDERECO: yup
      .string()
      .required('Campo obrigatório')
      .min(6, 'Deve ter no minimo 6 caracteres'),
    PRO_NUMERO: yup
      .string()
      .required('Campo obrigatório'),
    PRO_BAIRRO: yup
      .string()
      .required('Campo obrigatório')
      .min(6, 'Deve ter no minimo 6 caracteres'),
    PRO_DT_NASC: yup
      .date()
      .min(
        '1900-01-01',
        () => `Data de nascimento inválido`)
      .required('Campo obrigatório'),
    PRO_EMAIL: yup
      .string()
      .required('Campo obrigatório')
      .email('Email com formato inválido'),
    PRO_DOCUMENTO: yup
      .string()
      .required('Campo obrigatório')
      .test(
        'Documento com formato inválido',
        'Documento com formato inválido',
        (cpf) => {
          console.log(cpf);
          return isValidCPF(cpf ? cpf : '')},
      )
      .min(14, "Documento com formato inválido")
      .max(14, "Documento com formato inválido"),
    PRO_FONE: yup
      .string()
      .required('Campo obrigatório')
      .min(14, 'Telefone com formato inválido')
      .max(14, 'Telefone com formato inválido'),
    PRO_GEN: yup
      .number()
      .required('Campo obrigatório'),
    PRO_FOR: yup
      .number()
      .required('Campo obrigatório'),
    PRO_PEL: yup
      .number()
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

  const loadGender = async () => {
    const resp = await getAllGender()
    setListGender(resp.data)
  }

  const loadSkin = async () => {
    const resp = await getAllSkin()
    setListSkin(resp.data)
  }

  const loadFormation = async () => {
    const resp = await getAllFormation()
    setListFormation(resp.data)
  }


  useEffect(() => {
    loadGender()
    loadSkin()
    loadFormation()
    if (professor) {
      setBirthDate(format(new Date(professor.PRO_DT_NASC), 'yyyy-MM-dd 23:59:59'))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const formik = useFormik({
    initialValues: {
      PRO_NOME: professor.PRO_NOME,
      PRO_FONE: professor.PRO_FONE,
      PRO_DOCUMENTO: professor.PRO_DOCUMENTO,
      PRO_AVATAR: professor.PRO_AVATAR,
      PRO_EMAIL: professor.PRO_EMAIL,
      PRO_FOR: professor.PRO_FOR?.FOR_ID,
      PRO_GEN: professor.PRO_GEN?.GEN_ID,
      PRO_PEL: professor.PRO_PEL?.PEL_ID,
      PRO_DT_NASC: professor.PRO_DT_NASC ? format(new Date(professor.PRO_DT_NASC), 'yyyy-MM-dd 23:59:59') : "",
      PRO_ATIVO: professor.PRO_ATIVO,
      PRO_UF: professor.PRO_UF,
      PRO_CIDADE: professor.PRO_CIDADE,
      PRO_ENDERECO: professor.PRO_ENDERECO,
      PRO_NUMERO: professor.PRO_NUMERO,
      PRO_COMPLEMENTO: professor.PRO_COMPLEMENTO,
      PRO_BAIRRO: professor.PRO_BAIRRO,
      PRO_CEP: professor.PRO_CEP,
      PRO_MUN: municipio.MUN_ID,
    },
    validationSchema: validationSchema,
    // .default(function () {
    //   if (!isValidCPF(formik.values.PRO_DOCUMENTO)) {
    //     formik.errors.PRO_DOCUMENTO = 'Documento com formato inválido'
    //   }
    // }),
    onSubmit: async (values) => {
      let avatarForm = null
      if (avatar) {
        avatarForm = avatar
      }

      values.PRO_DOCUMENTO = maskCPF(values.PRO_DOCUMENTO.trim())
      values.PRO_FONE = maskPhone(values.PRO_FONE.trim())

      setIsDisabled(true)
      let response = null;
      try{
        response = await editTeacher(professor.PRO_ID, values, avatarForm)
      }
      catch (err) {
        setIsDisabled(false)
      } finally {
        setIsDisabled(false)
      }

      if (response.status === 200 && response.data.PRO_NOME === values.PRO_NOME) {
        setModalStatus(true)
        setModalShowConfirm(true)
        setUf("")
        RemoveImage()
      }
      else {
        setModalStatus(false)
        setModalShowConfirm(true)
        setErrorMessage(response.data.message || 'Erro ao criar município')
      }
    }
  })

  async function changeTeacher() {
    setModalShowQuestion(false)
    let professorChanged = {
      PRO_ID: professor.PRO_ID,
      PRO_ATIVO: !professor.PRO_ATIVO,
    }

    
    setIsDisabled(true)
    let response = null;
    try{
      response = await editTeacher(professor.PRO_ID, professorChanged, null)
    }
    catch (err) {
      setIsDisabled(false)
    } finally {
      setIsDisabled(false)
    }

    if (response.status === 200 && response.data.PRO_NOME === formik.values.PRO_NOME) {
      setActive(professor.PRO_ATIVO)
      setModalShowConfirmQuestion(true)
      setModalStatus(true)
    }
    else {
      setModalStatus(false)
      setModalShowConfirmQuestion(true)
    }

  }

  const RemoveImage = () => {
    setAvatar(null)
    setCreateObjectURL(null)
  }

  function hideConfirm() {
    setModalShowConfirm(false)
    if (!errorMessage) {
      formik.resetForm()
      setBirthDate(null)
      return true
    }
    Router.reload()
  }

  useEffect(() => {
    async function fetchAPI() {
      const resp = await completeCEP(formik.values.PRO_CEP)
      formik.values.PRO_UF = resp?.uf
      formik.values.PRO_CIDADE = resp?.localidade
      formik.values.PRO_ENDERECO = resp?.logradouro
      formik.values.PRO_BAIRRO = resp?.bairro
      formik.setTouched({ ...formik.touched, ['PRO_UF']: true });
      formik.setTouched({ ...formik.touched, ['PRO_CIDADE']: true });
      formik.setTouched({ ...formik.touched, ['PRO_ENDERECO']: true });
      formik.setTouched({ ...formik.touched, ['PRO_BAIRRO']: true });
      formik.handleChange
      numberRef.current.focus()
      setUf(resp?.uf)
      async () => {
        setListCity(await loadCity(resp?.uf))
      }
    }
    fetchAPI()
  }, [formik.values.PRO_CEP])

  const handleChangeDocument = (e) => {
    const newValue = maskCPF(e.target.value)
    formik.setFieldValue('PRO_DOCUMENTO', newValue, true);
  }

  return (
    <>
      <Card>
        <Form onSubmit={formik.handleSubmit}>
          <InputGroup className="" controlId="formBasic">
            <div className="d-flex flex-column justify-content-center align-items-center">
              <CardInfoProfessorRelatorio professor={professor} moreDetails={false} size={60} nameSize={14} nameMarginBottom={4} />
            </div>
            <div className="d-flex flex-column justify-content-top pt-4 align-items-center">
              <Container {...getRootProps({ isFocused, isDragAccept, isDragReject })}>
                <input {...getInputProps()} />
                {
                  createObjectURL ?
                    <img src={createObjectURL} width={150} />
                    :
                    <>Alterar imagem de perfil</>
                }
              </Container>
              {avatar &&
                <ButtonNoBorder type="button" onClick={RemoveImage}>Remover</ButtonNoBorder>
              }
            </div>
            <div></div>
            <div>
              <TextField
                fullWidth
                label="Nome"
                name="PRO_NOME"
                id="PRO_NOME"
                value={formik.values.PRO_NOME}
                onChange={formik.handleChange}
                size="small"
              />
              {formik.touched.PRO_NOME && formik.errors.PRO_NOME ? <ErrorText>{formik.errors.PRO_NOME}</ErrorText> : null}
            </div>
            <div>
              <TextField
                fullWidth
                label="Email"
                name="PRO_EMAIL"
                id="PRO_EMAIL"
                value={formik.values.PRO_EMAIL}
                onChange={formik.handleChange}
                size="small"
              />
              {formik.touched.PRO_EMAIL && formik.errors.PRO_EMAIL ? <ErrorText>{formik.errors.PRO_EMAIL}</ErrorText> : null}
            </div>
            <div>
              <TextField
                fullWidth
                label="Telefone"
                name="PRO_FONE"
                id="PRO_FONE"
                inputProps={{ maxLength: 14 }}
                value={maskPhone(formik.values.PRO_FONE)}
                onChange={formik.handleChange}
                size="small"
              />
              {formik.touched.PRO_FONE && formik.errors.PRO_FONE ? <ErrorText>{formik.errors.PRO_FONE}</ErrorText> : null}
            </div>
            <div>
              <TextField
                fullWidth
                label="CPF"
                name="PRO_DOCUMENTO"
                id="PRO_DOCUMENTO"
                value={maskCPF(formik.values.PRO_DOCUMENTO)}
                inputProps={{ maxLength: 14 }}
                onChange={handleChangeDocument}
                size="small"
              />
              {formik.touched.PRO_DOCUMENTO && formik.errors.PRO_DOCUMENTO ? <ErrorText>{formik.errors.PRO_DOCUMENTO}</ErrorText> : null}
            </div>
            <div>
              <FormSelect name="PRO_FOR" value={formik.values.PRO_FOR} onChange={formik.handleChange}>
                <option value="">Formação</option>
                {listFormation.map((item, index) => (
                  <option key={index} value={item.FOR_ID}>{item.FOR_NOME}</option>
                ))}
              </FormSelect>
              {formik.touched.PRO_FOR && formik.errors.PRO_FOR ? <ErrorText>{formik.errors.PRO_FOR}</ErrorText> : null}
            </div>
            <div>
              <LocalizationProvider dateAdapter={AdapterDateFns} locale={brLocale}>
                <DatePicker
                  openTo="year"
                  views={['year', 'month', 'day']}
                  label="Data de Nascimento"
                  value={birthDate}
                  onError={(error) => console.log(error)}
                  onChange={(val) => {
                    if (isValidDate(val)) {
                      setBirthDate(val)
                      val = format(new Date(val), 'yyyy-MM-dd 23:59:59')
                      formik.setFieldValue('PRO_DT_NASC', val)
                    }
                  }}
                  renderInput={(params) => <TextField size="small" fullWidth {...params} />}
                />
              </LocalizationProvider>
              {formik.touched.PRO_DT_NASC && formik.errors.PRO_DT_NASC ? <ErrorText>{formik.errors.PRO_DT_NASC}</ErrorText> : null}
            </div>
            <div>
              <FormSelect name="PRO_GEN" value={formik.values.PRO_GEN} onChange={formik.handleChange}>
                <option value="">Sexo</option>
                {listGender.map((item, index) => (
                  <option key={index} value={item.GEN_ID}>{item.GEN_NOME}</option>
                ))}
              </FormSelect>
              {formik.touched.PRO_GEN && formik.errors.PRO_GEN ? <ErrorText>{formik.errors.PRO_GEN}</ErrorText> : null}
            </div>
            <div>
              <FormSelect name="PRO_PEL" value={formik.values.PRO_PEL} onChange={formik.handleChange}>
                <option value="">Cor/Raça</option>
                {listSkin.map((item, index) => (
                  <option key={index} value={item.PEL_ID}>{item.PEL_NOME}</option>
                ))}
              </FormSelect>
              {formik.touched.PRO_PEL && formik.errors.PRO_PEL ? <ErrorText>{formik.errors.PRO_PEL}</ErrorText> : null}
            </div>
          </InputGroup>
          <InputGroup3 styles={{paddinBottom: "30px"}} className="" controlId="formBasic">
            <div>
              <TextField
                fullWidth
                label="CEP"
                name="PRO_CEP"
                id="PRO_CEP"
                value={maskCEP(formik.values.PRO_CEP)}
                onChange={formik.handleChange}
                size="small"
              />
              {formik.touched.PRO_CEP && formik.errors.PRO_CEP ? <ErrorText>{formik.errors.PRO_CEP}</ErrorText> : null}
            </div>
            <div>
              <FormSelect className="" name="PRO_UF" value={uf} onChange={e => setUf(e.target.value)}>
                <option value="">Estado</option>
                {listUf.map((item, index) => (
                  <option key={index} value={item.sigla}>{item.sigla} - {item.nome}</option>
                ))}
              </FormSelect>
              {formik.touched.PRO_UF && formik.errors.PRO_UF ? <ErrorText>{formik.errors.PRO_UF}</ErrorText> : null}
            </div>
            <div>
              <FormSelect name="PRO_CIDADE" value={formik.values.PRO_CIDADE} onChange={formik.handleChange}>
                <option value="">Município</option>
                {listCity.map((item, index) => (
                  <option key={index} value={item.nome}>{item.nome}</option>
                ))}
              </FormSelect>
              {formik.touched.PRO_CIDADE && formik.errors.PRO_CIDADE ? <ErrorText>{formik.errors.PRO_CIDADE}</ErrorText> : null}
            </div>
            <div>
              <TextField
                fullWidth
                label="Endereço da SME"
                name="PRO_ENDERECO"
                id="PRO_ENDERECO"
                value={formik.values.PRO_ENDERECO}
                onChange={formik.handleChange}
                size="small"
              />
              {formik.touched.PRO_ENDERECO && formik.errors.PRO_ENDERECO ? <ErrorText>{formik.errors.PRO_ENDERECO}</ErrorText> : null}
            </div>
            <div>
              <TextField
                fullWidth
                label="Bairro"
                name="PRO_BAIRRO"
                id="PRO_BAIRRO"
                value={formik.values.PRO_BAIRRO}
                onChange={formik.handleChange}
                size="small"
              />
              {formik.touched.PRO_BAIRRO && formik.errors.PRO_BAIRRO ? <ErrorText>{formik.errors.PRO_BAIRRO}</ErrorText> : null}
            </div>
            <InputGroup2 paddingBottom={true}>
              <div>
                <TextField
                  fullWidth
                  label="Numero"
                  name="PRO_NUMERO"
                  id="PRO_NUMERO"
                  value={formik.values.PRO_NUMERO}
                  onChange={formik.handleChange}
                  size="small"
                  ref={numberRef}
                />
                {formik.touched.PRO_NUMERO && formik.errors.PRO_NUMERO ? <ErrorText>{formik.errors.PRO_NUMERO}</ErrorText> : null}
              </div>
              <div>
                <TextField
                  fullWidth
                  label="Complemento"
                  name="PRO_COMPLEMENTO"
                  id="PRO_COMPLEMENTO"
                  value={formik.values.PRO_COMPLEMENTO}
                  onChange={formik.handleChange}
                  size="small"
                />
                {formik.touched.PRO_COMPLEMENTO && formik.errors.PRO_COMPLEMENTO ? <ErrorText>{formik.errors.PRO_COMPLEMENTO}</ErrorText> : null}
              </div>
            </InputGroup2>
          </InputGroup3>
          <ButtonGroupBetween>
            <div>
              {formik.values.PRO_ATIVO ? (
                <ButtonVermelho onClick={(e) => { e.preventDefault(); setModalShowQuestion(true) }}>
                  Desativar
                </ButtonVermelho>) : (
                <ButtonPadrao onClick={(e) => { e.preventDefault(); setModalShowQuestion(true) }}>
                  Ativar
                </ButtonPadrao>)}
            </div>
            <div className="d-flex">
              <div style={{width:160}}>
                <ButtonWhite onClick={(e) => { e.preventDefault(); formik.resetForm(); setBirthDate(professor.PRO_DT_NASC); }}>
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
        onHide={() => { hideConfirm() }}
        text={modalStatus ? `Professor ${formik.values.PRO_NOME} alterado com sucesso!` : errorMessage}
        status={modalStatus}
      />
      <ModalPergunta
        show={modalShowQuestion}
        onHide={() => setModalShowQuestion(false)}
        onConfirm={() => changeTeacher()}
        buttonNo={active ? 'Não Desativar': 'Não Ativar'}
        buttonYes={'Sim, Tenho Certeza'}
        text={`Você está ${!active === true ? `ativando(a) o(a) ${formik.values.PRO_NOME}` : `desativando(a) o(a) ${formik.values.PRO_NOME}, isso tirará todos os acessos, os dados serão desconsiderados do relatório`}. Você pode ${active === true ? 'ativar' : 'desativar'} novamente a qualquer momento.`}
        status={!active}
        size="lg"
      />
      <ModalConfirmacao
        show={modalShowConfirmQuestion}
        onHide={() => { setModalShowConfirmQuestion(false); Router.reload() }}
        text={modalStatus ? `${formik.values.PRO_NOME} ${!active === true ? 'ativado' : 'desativado'} com sucesso!` : `Erro ao ${active ? "ativar" : "desativar"}`}
        status={modalStatus}
      />
    </>
  )
}