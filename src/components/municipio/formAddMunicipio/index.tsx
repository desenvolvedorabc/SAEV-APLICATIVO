import * as React from 'react';
import { Form } from "react-bootstrap";
import { useFormik } from 'formik';
import {ButtonPadrao} from 'src/components/buttons/buttonPadrao';
import { InputGroup3Dashed, InputGroup3, InputGroup2, ButtonGroupEnd, Card, Container, ButtonNoBorder, FormSelect } from 'src/shared/styledForms';
import ButtonWhite from 'src/components/buttons/buttonWhite';
import { createCounty } from 'src/services/municipios.service';
import ErrorText from 'src/components/ErrorText';
import ModalConfirmacao from 'src/components/modalConfirmacao';
import { useEffect, useRef, useState } from 'react';
import { loadCity, loadUf } from 'src/utils/combos';
import { maskCEP } from 'src/utils/masks';
import { useDropzone } from 'react-dropzone'
import Router from 'next/router';
import * as yup from 'yup';
import { add, format } from 'date-fns';
import { DatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import brLocale from 'date-fns/locale/pt-BR'
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import InputFile from 'src/components/InputFile';
import { isValidDate } from "src/utils/validate";


export default function FormAddMunicipio(props) {

  const [ModalShowConfirm, setModalShowConfirm] = useState(false)
  const [modalStatus, setModalStatus] = useState(true)
  const [uf, setUf] = useState('');
  const [listUf, setListUf] = useState([]);
  const [listCity, setListCity] = useState([]);
  const [logo, setLogo] = useState(null)
  const [file, setFile] = useState(null)
  const [createObjectURL, setCreateObjectURL] = useState(null)
  const [errorMessage, setErrorMessage] = useState(true)
  const [dataInicio, setDataInicio] = useState(null)
  const [dataFinal, setDataFinal] = useState(null)
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
      setLogo(acceptedFiles[0])
      setCreateObjectURL(URL.createObjectURL(acceptedFiles[0]))
    }
  });

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
  });

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
      MUN_NOME: "",
      MUN_UF: "",
      MUN_CIDADE: "",
      MUN_COD_IBGE: "",
      MUN_ENDERECO: "",
      MUN_NUMERO: "",
      MUN_COMPLEMENTO: "",
      MUN_BAIRRO: "",
      MUN_CEP: "",
      MUN_DT_INICIO: "",
      MUN_DT_FIM: "",
      MUN_ARQ_CONVENIO: "",
      MUN_LOGO: "",
      MUN_STATUS: "verde",
      MUN_ATIVO: true
    },
    validationSchema: validationSchema,
    onSubmit: async (county) => {
      county.MUN_UF = uf
      let logoForm = null
      if (logo) {
        logoForm = logo
      }

      let fileForm = null
      if (file) {
        fileForm = file
      }

      setIsDisabled(true)
      let response = null;
      try{
        response = await createCounty(county, logoForm, fileForm)
      }
      catch (err) {
        setIsDisabled(false)
      } finally {
        setIsDisabled(false)
      }
      if (response.status === 200 && response.data.MUN_NOME === county.MUN_NOME) {
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
  });

  const RemoveImage = () => {
    setLogo(null)
    setCreateObjectURL(null)
  }

  function hideConfirm() {
    setModalShowConfirm(false);
    if (!errorMessage) {
      formik.resetForm()
      return true;
    }
    Router.reload();
  }

  useEffect(() => {
    completeCEP()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.MUN_CEP])

  const completeCEP = async () => {
    var cep = formik.values.MUN_CEP.replace(/[^0-9]/, "");

    if (cep.length != 8) {

      return false;
    }

    let url = "https://viacep.com.br/ws/" + cep + "/json/";
    await fetch(url)
      .then(response => response.json())
      .then(data => {
        if (!data.error) {
        formik.values.MUN_UF = data.uf
        formik.values.MUN_CIDADE = data.localidade
        formik.values.MUN_ENDERECO = data.logradouro
        formik.values.MUN_BAIRRO = data.bairro
        formik.setTouched({ ...formik.touched, ['MUN_UF']: true });
        formik.setTouched({ ...formik.touched, ['MUN_CIDADE']: true });
        formik.setTouched({ ...formik.touched, ['MUN_ENDERECO']: true });
        formik.setTouched({ ...formik.touched, ['MUN_BAIRRO']: true });
        formik.handleChange
        numberRef.current.focus()
        setUf(data.uf)
        async () => {
          setListCity(await loadCity(data.uf));
        }
      }
    })

  }

  const onFileChange = (e) => {
    setFile(e.target.value);
  };

  
  const handleChangeUf = (e) => {
    setUf(e.target.value)
    formik.values.MUN_UF = e.target.value;
    formik.setTouched({ ...formik.touched, ['MUN_UF']: true });
  }

  const handleChangeCidade = (e) => {
    formik.values.MUN_CIDADE = e.target.value;
    formik.setTouched({ ...formik.touched, ['MUN_CIDADE']: true });
  }

  useEffect(() => {
    let findCity = listCity.find(c => c.nome === formik.values.MUN_CIDADE)
    formik.values.MUN_COD_IBGE = findCity?.id
  },[formik.values.MUN_CIDADE, listCity])

  return (
    <>
      <Card>
        <div className="mb-3">
          <strong>Novo Município</strong>
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
              <FormControl fullWidth size="small">
                <InputLabel id="Estado">Estado</InputLabel>
                <Select
                  labelId="Estado"
                  id="Estado"
                  value={uf}
                  label="Estado"
                  onChange={e => handleChangeUf(e)}
                >
                  {listUf.map((item, index) => (
                    <MenuItem key={index} value={item.sigla}>{item.sigla} - {item.nome}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              {formik.touched.MUN_UF && formik.errors.MUN_UF ? <ErrorText id="error-MUN_UF">{formik.errors.MUN_UF}</ErrorText> : null}
            </div>
            <div>
              <FormControl fullWidth size="small">
                <InputLabel id="MUN_CIDADE">Município</InputLabel>
                <Select
                  labelId="MUN_CIDADE"
                  id="MUN_CIDADE"
                  value={formik.values.MUN_CIDADE}
                  label="Município"
                  onChange={(e) => handleChangeCidade(e)}
                >
                  {listCity.map((item, index) => (
                    <MenuItem key={index} value={item.nome}>{item.nome}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              {formik.touched.MUN_CIDADE && formik.errors.MUN_CIDADE ? <ErrorText id="error-MUN_CIDADE">{formik.errors.MUN_CIDADE}</ErrorText> : null}
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
              {formik.touched.MUN_ENDERECO && formik.errors.MUN_ENDERECO ? <ErrorText id="error-MUN_ENDERECO">{formik.errors.MUN_ENDERECO}</ErrorText> : null}
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
              {formik.touched.MUN_BAIRRO && formik.errors.MUN_BAIRRO ? <ErrorText id="error-MUN_BAIRRO">{formik.errors.MUN_BAIRRO}</ErrorText> : null}
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
                {formik.touched.MUN_NUMERO && formik.errors.MUN_NUMERO ? <ErrorText id="error-MUN_NUMERO">{formik.errors.MUN_NUMERO}</ErrorText> : null}
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
                {formik.touched.MUN_COMPLEMENTO && formik.errors.MUN_COMPLEMENTO ? <ErrorText id="error-MUN_COMPLEMENTO">{formik.errors.MUN_COMPLEMENTO}</ErrorText> : null}
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
              {formik.touched.MUN_DT_INICIO && formik.errors.MUN_DT_INICIO ? <ErrorText id="error-MUN_DT_INICIO">{formik.errors.MUN_DT_INICIO}</ErrorText> : null}
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
              {formik.touched.MUN_DT_FIM && formik.errors.MUN_DT_FIM ? <ErrorText id="error-MUN_DT_FIM">{formik.errors.MUN_DT_FIM}</ErrorText> : null}
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
                        <img src={createObjectURL} width={150} alt="logo municipio"/>
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
        </Form>
      </Card>
      <ModalConfirmacao
        show={ModalShowConfirm}
        onHide={() => { hideConfirm() }}
        text={modalStatus ? `Município ${formik.values.MUN_NOME} adicionado com sucesso!` : errorMessage}
        status={modalStatus}
      />
    </>
  )
}
