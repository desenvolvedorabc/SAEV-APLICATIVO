import * as React from "react";
import { Form } from "react-bootstrap";
import { useFormik } from "formik";
import { ButtonPadrao } from "src/components/buttons/buttonPadrao";
import {
  InputGroup3Dashed,
  InputGroup3,
  InputGroup2,
  Card,
  Container,
  ButtonDisable,
} from "src/shared/styledForms";
import { ButtonGroupEnd } from "./styledComponents";
import ButtonWhite from "src/components/buttons/buttonWhite";
import {
  getAllPcd,
  editStudent,
} from "src/services/alunos.service";
import { getSchools } from "src/services/escolas.service";
import { getAllGender, getAllSkin } from "src/services/professores.service";
import ErrorText from "src/components/ErrorText";
import ModalConfirmacao from "src/components/modalConfirmacao";
import { useEffect, useRef, useState } from "react";
import { loadCity, loadUf, completeCEP } from "src/utils/combos";
import { maskCEP, maskCPF, maskPhone } from "src/utils/masks";
import { useDropzone } from "react-dropzone";
import Router, { useRouter } from "next/router";
import * as yup from "yup";
import { LocalizationProvider, DatePicker } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import brLocale from "date-fns/locale/pt-BR";
import {
  Autocomplete,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from "@mui/material";
import { isValidCPF, isValidDate } from "src/utils/validate";
import ModalPergunta from "src/components/modalPergunta";
import ModalAviso from "src/components/modalAviso";
import { format } from "date-fns";

export function FormEditStudent({ student }) {
  const [modalShowConfirm, setModalShowConfirm] = useState(false);
  const [modalShowWarning, setModalShowWarning] = useState(false);
  const [modalShowQuestion, setModalShowQuestion] = useState(false);
  const [modalShowConfirmQuestion, setModalShowConfirmQuestion] =
    useState(false);
  const [modalStatus, setModalStatus] = useState(true);
  const [active, setActive] = useState(student?.ALU_ATIVO);
  const [_uf, setUf] = useState("");
  const [listUf, setListUf] = useState([]);
  const [listCity, setListCity] = useState([]);
  const [listSchool, setListSchool] = useState([]);
  const [listGender, setListGender] = useState([]);
  const [listSkin, setListSkin] = useState([]);
  const [listPcd, setListPcd] = useState([]);
  const [school, setSchool] = useState(student.ALU_ESC);
  const [nasc, setNasc] = useState(null);
  const [logo, setLogo] = useState(null);
  const [createObjectURL, setCreateObjectURL] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isPcd, setIsPcd] = useState('Não');
  const [selectedPcds, setSelectedPcds] = useState(student?.ALU_DEFICIENCIAS || []);
  const [errorPcds, setErrorPcds] = useState(false);
  const numberRef = useRef(null);
  const { query } = useRouter();

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({
      accept: "image/png, image/gif, image/jpeg",
      maxFiles: 1,
      onDrop: (acceptedFiles) => {
        setLogo(acceptedFiles[0]);
        setCreateObjectURL(URL.createObjectURL(acceptedFiles[0]));
      },
    });

  const validationSchema = yup.object({
    ALU_ESC: yup.string().required("Campo obrigatório"),
    ALU_SER: yup.string(),
    ALU_TUR: yup.string(),
    ALU_CPF: yup
    .string()
    .min(11, "Deve ter no mínimo 11 números")
    .test("CPF inválido.", (ALU_CPF) => {
      console.log('ALU_CPF', ALU_CPF)
      let result = !ALU_CPF ? true : isValidCPF(ALU_CPF) 
      return result
    })
    .nullable(),
    ALU_INEP: yup.string()
    .nullable(),
    // .min(8, "Deve ter no minimo 8 caracteres")
    // .max(9, "Deve ter no máximo 9 caracteres"),
    ALU_NOME: yup
      .string()
      .min(6, "Deve ter no minimo 6 caracteres")
      .required("Campo obrigatório"),
    ALU_GEN: yup.string(),
    ALU_PEL: yup.string(),
    ALU_NOME_MAE: yup
      .string()
      .required("Campo obrigatório")
      .min(6, "Deve ter no minimo 6 caracteres"),
    ALU_NOME_RESP: yup
      .string()
      .min(6, "Deve ter no minimo 6 caracteres"),
    ALU_TEL1: yup
      .string()
      .min(14, "Deve ter no minimo 14 caracteres"),
    ALU_EMAIL: yup
      .string()
      .email("Email inválido"),
    ALU_DT_NASC: yup
      .string()
      .required('Campo obrigatório')
      .test('Data inválida', (ALU_DT_NASC) => {
        if(isValidDate(ALU_DT_NASC) && new Date(ALU_DT_NASC)?.getFullYear() > 1900 )
          return true
        return false
      }),
    ALU_CEP: yup
      .string()
      .min(9, "CEP com formato inválido")
      .max(9, "CEP com formato inválido"),
    ALU_UF: yup
      .string()
      .min(2, "Deve ter no minimo 2 caracteres").nullable(),
    ALU_CIDADE: yup
      .string()
      .min(2, "Deve ter no minimo 2 caracteres").nullable(),
    ALU_ENDERECO: yup
      .string()
      .min(6, "Deve ter no minimo 6 caracteres").nullable(),
    ALU_NUMERO: yup.string(),
    ALU_BAIRRO: yup
      .string()
      .min(6, "Deve ter no minimo 6 caracteres").nullable(),
  });

  useEffect(() => {
    if (student?.ALU_DT_NASC) {
      setNasc(student?.ALU_DT_NASC);
    }
    if(student?.ALU_DEFICIENCIAS?.length > 0 || student?.ALU_DEFICIENCIA_BY_IMPORT){
      setIsPcd('Sim')
    }
  }, [student]);

  async function changeAluno() {
    setModalShowQuestion(false);

    const data = {
      ALU_ATIVO: !student.ALU_ATIVO,
    };

    setIsDisabled(true)
    let response = null;
    try{
      response = await editStudent(student?.ALU_ID, data, null);
    }
    catch (err) {
      setIsDisabled(false)
    } finally {
      setIsDisabled(false)
    }
    if (!response?.data?.message) {
      formik.values.ALU_ATIVO = !active;
      setActive(!active);
      setModalShowConfirmQuestion(true);
      setModalStatus(true);
    } else {
      setModalStatus(false);
      setModalShowConfirm(true);
      setErrorMessage(response.data.message || "Erro ao editar aluno");
    }
  }

  const loadSchool = async () => {
    const respSchool = await getSchools(null, 1, 999999, null, "ASC", null, query?.id?.toString(), '1');

    setListSchool(respSchool.data?.items);

  };

  const loadGender = async () => {
    const respGender = await getAllGender();

    setListGender(respGender.data);
  };

  const loadSkin = async () => {
    const respSkin = await getAllSkin();

    setListSkin(respSkin.data);
  };

  const loadPcd = async () => {
    const respPcd = await getAllPcd();

    setListPcd(respPcd.data);
  };

  useEffect(() => {
    loadSchool();
    loadGender();
    loadSkin();
    loadPcd();

    async function fetchAPI() {
      setListUf(await loadUf());
    }
    fetchAPI();
  }, []);

  const formik = useFormik({
    initialValues: {
      ALU_ESC: student?.ALU_ESC?.ESC_ID,
      ALU_SER: student?.ALU_SER?.SER_ID,
      ALU_TUR: student?.ALU_TUR?.TUR_ID,
      ALU_CPF: student?.ALU_CPF,
      ALU_AVATAR: student?.ALU_AVATAR ? student?.ALU_AVATAR : "",
      ALU_INEP: student?.ALU_INEP ? student?.ALU_INEP : "",
      ALU_NOME: student?.ALU_NOME ? student?.ALU_NOME : "",
      ALU_GEN: student?.ALU_GEN?.GEN_ID,
      ALU_NOME_MAE: student?.ALU_NOME_MAE ? student?.ALU_NOME_MAE : "",
      ALU_NOME_PAI: student?.ALU_NOME_PAI ? student?.ALU_NOME_PAI : "",
      ALU_NOME_RESP: student?.ALU_NOME_RESP ? student?.ALU_NOME_RESP : "",
      ALU_TEL1: student?.ALU_TEL1 ? student?.ALU_TEL1 : "",
      ALU_TEL2: student?.ALU_TEL2 ? student?.ALU_TEL2 : "",
      ALU_EMAIL: student?.ALU_EMAIL ? student?.ALU_EMAIL : "",
      ALU_DEFICIENCIAS: student?.ALU_DEFICIENCIAS,
      ALU_DEFICIENCIA_BY_IMPORT: student?.ALU_DEFICIENCIA_BY_IMPORT,
      ALU_PEL: student?.ALU_PEL?.PEL_ID,
      ALU_DT_NASC: student?.ALU_DT_NASC ? student?.ALU_DT_NASC : "",
      ALU_CEP: student?.ALU_CEP ? student?.ALU_CEP : "",
      ALU_UF: student?.ALU_UF ? student?.ALU_UF : null,
      ALU_CIDADE: student?.ALU_CIDADE ? student?.ALU_CIDADE : null,
      ALU_ENDERECO: student?.ALU_ENDERECO ? student?.ALU_ENDERECO : "",
      ALU_NUMERO: student?.ALU_NUMERO ? student?.ALU_NUMERO : "",
      ALU_COMPLEMENTO: student?.ALU_COMPLEMENTO ? student?.ALU_COMPLEMENTO : "",
      ALU_BAIRRO: student?.ALU_BAIRRO ? student?.ALU_BAIRRO : "",
      ALU_ATIVO: student?.ALU_ATIVO,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {

      if(isPcd === 'Sim' && !values.ALU_DEFICIENCIA_BY_IMPORT && selectedPcds.length === 0){
        setErrorPcds(true);
        return;
      } else {
        setErrorPcds(false);
      }

      values.ALU_DT_NASC = format(new Date(values.ALU_DT_NASC), 'yyyy-MM-dd 23:59:59')
      values.ALU_NOME = values.ALU_NOME.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ')
      values.ALU_NOME_MAE = values.ALU_NOME_MAE.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ')
      values.ALU_NOME_PAI = values.ALU_NOME_PAI.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ')
      values.ALU_NOME_RESP = values.ALU_NOME_RESP.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ')

      if(selectedPcds.length > 0){
        values.ALU_DEFICIENCIAS = selectedPcds.map(pcd => {return {PCD_ID: pcd?.PCD_ID}})
      } else {
        values.ALU_DEFICIENCIAS = []
      }
      
      let avatar = null;
      if (logo) {
        avatar = logo;
      }

      setIsDisabled(true)
      let response = null;
      try{
        response = await editStudent(student.ALU_ID, values, avatar);
      }
      catch (err) {
        setIsDisabled(false)
      } finally {
        setIsDisabled(false)
      }
      if (!response?.data?.message) {
        setModalStatus(true);
        setModalShowConfirm(true);
      } else {
        setModalStatus(false);
        setModalShowConfirm(true);
        setErrorMessage(response.data.message || "Erro ao editar aluno");
      }
    }
  });

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    async function fetchAPI() {
      if (formik.values.ALU_UF) {
        setListCity(await loadCity(formik.values.ALU_UF));
      }
    }
    fetchAPI();
  }, [formik.values.ALU_UF]);

  function hideConfirm() {
    setModalShowConfirm(false);
    if (errorMessage) {
      formik.resetForm();
      return true;
    }
    Router.reload();
  }

  const handleChangeIsPCD = (e) => {    
    setIsPcd(e.target.value);
    setSelectedPcds([])
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    async function fetchAPI() {
      const resp = await completeCEP(formik.values.ALU_CEP)

      if(!resp?.erro && formik.dirty){

        formik.values.ALU_UF = resp?.uf ? resp?.uf : null;
        formik.values.ALU_CIDADE = resp?.localidade ? resp?.localidade : null;
        formik.values.ALU_ENDERECO = resp?.logradouro ? resp?.logradouro : '';
        formik.values.ALU_BAIRRO = resp?.bairro ? resp?.bairro : '';
        formik.setTouched({ ...formik.touched, ['ALU_UF']: true });
        formik.setTouched({ ...formik.touched, ['ALU_CIDADE']: true });
        formik.setTouched({ ...formik.touched, ['ALU_ENDERECO']: true });
        formik.setTouched({ ...formik.touched, ['ALU_BAIRRO']: true });
        numberRef.current.focus();
        formik.handleChange;
        setUf(resp?.uf)
        async () => {
          setListCity(await loadCity(resp?.uf));
        }
      }
    }
    fetchAPI()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.ALU_CEP])

  const handleChangeSchool = (newValues) => {
    setSchool(newValues);
  };

  return (
    <>
      <Card className="reset">
        <Form onSubmit={formik.handleSubmit}>
          <div className="card-box">
            <div>
              <strong>Definir Escola</strong>
            </div>
            <InputGroup3Dashed className="" controlId="formBasic">
              <div>
                <FormControl fullWidth size="small">
                  <Autocomplete
                    className=""
                    id="size-small-outlined"
                    size="small"
                    value={school}
                    noOptionsText="Selecionar Escola"
                    options={listSchool}
                    getOptionLabel={(option) =>  `${option?.ESC_NOME}`}
                    onChange={(_event, newValue) => {
                      handleChangeSchool(newValue)}}
                    renderInput={(params) => <TextField size="small" {...params} label="Selecionar Escola" />}
                    disabled
                  />
                </FormControl>
                {formik.touched.ALU_ESC && formik.errors.ALU_ESC ? (
                  <ErrorText>{formik.errors.ALU_ESC}</ErrorText>
                ) : null}
              </div>
            </InputGroup3Dashed>
            <InputGroup3>
              <InputGroup2>
                <div>
                  <TextField
                    fullWidth
                    label="UF"
                    id="ESC_UF"
                    defaultValue={student?.ALU_ESC?.ESC_UF}
                    value={school?.ESC_UF}
                    size="small"
                    disabled
                    InputLabelProps={{
                      shrink: student?.ALU_ESC?.ESC_UF ? true : false,
                    }}
                  />
                </div>
                <div>
                  <TextField
                    fullWidth
                    label="Municipio"
                    id="ESC_CIDADE"
                    defaultValue={student?.ALU_ESC?.ESC_CIDADE}
                    value={school?.ESC_CIDADE}
                    size="small"
                    disabled
                    InputLabelProps={{
                      shrink: student?.ALU_ESC?.ESC_CIDADE ? true : false,
                    }}
                  />
                </div>
              </InputGroup2>
              <div>
                <TextField
                  fullWidth
                  label="Escola"
                  id="ESC_ENDERECO"
                  defaultValue={student?.ALU_ESC?.ESC_ENDERECO}
                  value={school?.ESC_ENDERECO}
                  size="small"
                  disabled
                  InputLabelProps={{
                    shrink: student?.ALU_ESC?.ESC_ENDERECO ? true : false,
                  }}
                />
              </div>
              <div>
                <TextField
                  fullWidth
                  label="Código INEP"
                  id="ESC_INEP"
                  value={school?.ESC_INEP}
                  defaultValue={student?.ALU_ESC?.ESC_INEP}
                  size="small"
                  disabled
                  InputLabelProps={{
                    shrink: student?.ALU_ESC?.ESC_INEP ? true : false,
                  }}
                />
              </div>
            </InputGroup3>
          </div>

          <div className="card-box">
            <div>
              <strong>Enturmação</strong>
            </div>

            <InputGroup3>
              <div>
                <TextField
                  fullWidth
                  label="Série"
                  id="ALU_SER"
                  defaultValue={student?.ALU_SER?.SER_NOME}
                  value={student?.ALU_SER?.SER_NOME}
                  size="small"
                  disabled
                  InputLabelProps={{
                    shrink: student?.ALU_SER?.SER_NOME,
                  }}
                />
              </div>
              <div>
                <TextField
                  fullWidth
                  label="Turma"
                  id="ALU_TUR"
                  defaultValue={student?.ALU_TUR?.TUR_NOME}
                  value={student?.ALU_TUR?.TUR_NOME}
                  size="small"
                  disabled
                  InputLabelProps={{
                    shrink: student?.ALU_TUR?.TUR_NOME ? true : false,
                  }}
                />
              </div>
              <div className="d-flex justify-content-around">
                <div style={{width: 160}}>
                  <ButtonPadrao onClick={() => Router.push("/enturmar-alunos")}>
                    Enturmar Aluno
                  </ButtonPadrao>
                </div>
                <div style={{width: 160}}>
                  <ButtonPadrao onClick={() => Router.push(`/transferencia/aluno/${student?.ALU_ID}`)}>
                    Transferir Aluno
                  </ButtonPadrao>
                </div>
              </div>
            </InputGroup3>
          </div>

          <div className="card-box">
            <div>
              <strong>Dados do Aluno</strong>
            </div>
            <InputGroup3Dashed>
              <div>
                <Form.Label>Foto: </Form.Label>
                <div className="d-flex">
                  <div className="d-flex gap-3 justify-content-center align-items-center">
                    {student?.ALU_AVATAR && !createObjectURL && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={student?.ALU_AVATAR_URL}
                        width={150}
                        alt="foto"
                      />
                    )}

                    <Container
                      {...getRootProps({
                        isFocused,
                        isDragAccept,
                        isDragReject,
                      })}
                    >
                      <input {...getInputProps()} />
                      {createObjectURL ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={createObjectURL} width={150} alt="foto" />
                      ) : (
                        <ButtonWhite type="button" onClick={() => { /* TODO document why this arrow function is empty */ }}>
                          Alterar Foto
                        </ButtonWhite>
                      )}
                    </Container>
                    {logo && <div style={{ width: 160 }}></div>}
                  </div>
                </div>
              </div>
            </InputGroup3Dashed>
            <InputGroup3>
              <div>
                <TextField
                  fullWidth
                  label="Número do INEP"
                  name="ALU_INEP"
                  id="ALU_INEP"
                  value={formik.values.ALU_INEP}
                  onChange={formik.handleChange}
                  size="small"
                />
                {formik.touched.ALU_INEP && formik.errors.ALU_INEP ? (
                  <ErrorText>{formik.errors.ALU_INEP}</ErrorText>
                ) : null}
              </div>
              <div style={{ position: "relative" }}>
                <div>
                  <div className="">
                    <TextField
                      fullWidth
                      label="Nome"
                      name="ALU_NOME"
                      id="ALU_NOME"
                      value={formik.values.ALU_NOME}
                      onChange={formik.handleChange}
                      size="small"
                    />
                  </div>
                  {formik.touched.ALU_NOME && formik.errors.ALU_NOME ? (
                    <ErrorText>{formik.errors.ALU_NOME}</ErrorText>
                  ) : null}
                </div>
              </div>
              <div style={{ position: "relative" }}>
                <div className="">
                  <TextField
                    fullWidth
                    label="CPF"
                    name="ALU_CPF"
                    id="ALU_CPF"
                    value={maskCPF(formik.values.ALU_CPF)}
                    onChange={formik.handleChange}
                    size="small"
                    inputProps={{ maxLength: 14 }}
                  />
                </div>
                {formik.touched.ALU_CPF && formik.errors.ALU_CPF ? (
                  <ErrorText>
                  {formik.errors.ALU_CPF === "ALU_CPF is invalid" ?
                    "CPF inválido." : formik.errors.ALU_CPF
                    && formik.errors.ALU_CPF}
                  </ErrorText>
                ) : null}
              </div>
             
            </InputGroup3>

            <InputGroup3>
              <div>
                <TextField
                  fullWidth
                  label="Nome da Mãe"
                  name="ALU_NOME_MAE"
                  id="ALU_NOME_MAE"
                  value={formik.values.ALU_NOME_MAE}
                  onChange={formik.handleChange}
                  size="small"
                />
                {formik.touched.ALU_NOME_MAE && formik.errors.ALU_NOME_MAE ? (
                  <ErrorText>{formik.errors.ALU_NOME_MAE}</ErrorText>
                ) : null}
              </div>
              <div>
                <TextField
                  fullWidth
                  label="Nome do Pai"
                  name="ALU_NOME_PAI"
                  id="ALU_NOME_PAI"
                  value={formik.values.ALU_NOME_PAI}
                  onChange={formik.handleChange}
                  size="small"
                />
                {formik.touched.ALU_NOME_PAI && formik.errors.ALU_NOME_PAI ? (
                  <ErrorText>{formik.errors.ALU_NOME_PAI}</ErrorText>
                ) : null}
              </div>
              <div>
                <TextField
                  fullWidth
                  label="Nome do Responsável"
                  name="ALU_NOME_RESP"
                  id="ALU_NOME_RESP"
                  value={formik.values.ALU_NOME_RESP}
                  onChange={formik.handleChange}
                  size="small"
                />
                {formik.touched.ALU_NOME_RESP && formik.errors.ALU_NOME_RESP ? (
                  <ErrorText>{formik.errors.ALU_NOME_RESP}</ErrorText>
                ) : null}
              </div>
            </InputGroup3>

            <InputGroup3>
              <div>
                <TextField
                  fullWidth
                  label="Telefone 1"
                  name="ALU_TEL1"
                  id="ALU_TEL1"
                  inputProps={{ maxLength: 14 }}
                  value={maskPhone(formik.values.ALU_TEL1)}
                  onChange={formik.handleChange}
                  size="small"
                />
                {formik.touched.ALU_TEL1 && formik.errors.ALU_TEL1 ? (
                  <ErrorText>{formik.errors.ALU_TEL1}</ErrorText>
                ) : null}
              </div>
              <div>
                <TextField
                  fullWidth
                  label="Telefone 2"
                  name="ALU_TEL2"
                  id="ALU_TEL2"
                  inputProps={{ maxLength: 14 }}
                  value={maskPhone(formik.values.ALU_TEL2)}
                  onChange={formik.handleChange}
                  size="small"
                />
                {formik.touched.ALU_TEL2 && formik.errors.ALU_TEL2 ? (
                  <ErrorText>{formik.errors.ALU_TEL2}</ErrorText>
                ) : null}
              </div>
              <div>
                <TextField
                  fullWidth
                  label="Email"
                  name="ALU_EMAIL"
                  id="ALU_EMAIL"
                  value={formik.values.ALU_EMAIL}
                  onChange={formik.handleChange}
                  size="small"
                />
                {formik.touched.ALU_EMAIL && formik.errors.ALU_EMAIL ? (
                  <ErrorText>{formik.errors.ALU_EMAIL}</ErrorText>
                ) : null}
              </div>
            </InputGroup3>
            <InputGroup3Dashed className="" controlId="formBasic">
              <div className="">
                <LocalizationProvider
                  dateAdapter={AdapterDateFns}
                  locale={brLocale}
                >
                  <DatePicker
                    openTo="year"
                    views={["year", "month", "day"]}
                    label="Data de Nascimento"
                    value={nasc}
                    onChange={(val) => {
                      if (isValidDate(val)) {
                        setNasc(val);
                        formik.values.ALU_DT_NASC = val;
                        return;
                      }
                      formik.values.ALU_DT_NASC = "";
                      setNasc("");
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
                {formik.touched.ALU_DT_NASC && formik.errors.ALU_DT_NASC ? (
                  <ErrorText>{"Campo obrigatório"}</ErrorText>
                ) : null}
              </div>
              <InputGroup2>

              <div>
                <FormControl fullWidth size="small">
                  <InputLabel id="ALU_GEN">Sexo</InputLabel>
                  <Select
                    labelId="ALU_GEN"
                    id="ALU_GEN"
                    name="ALU_GEN"
                    value={formik.values.ALU_GEN}
                    label="Sexo"
                    onChange={formik.handleChange}
                  >
                    {listGender?.map((item) => (
                      <MenuItem key={item.GEN_ID} value={item.GEN_ID}>
                        {item.GEN_NOME}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {formik.touched.ALU_GEN && formik.errors.ALU_GEN ? (
                  <ErrorText>{formik.errors.ALU_GEN}</ErrorText>
                ) : null}
              </div>
              <div>
                <FormControl fullWidth size="small">
                  <InputLabel id="ALU_PEL">Cor/Raça</InputLabel>
                  <Select
                    labelId="ALU_PEL"
                    id="ALU_PEL"
                    name="ALU_PEL"
                    value={formik.values.ALU_PEL}
                    label="Cor/Raça"
                    onChange={formik.handleChange}
                  >
                    {listSkin?.map((item) => (
                      <MenuItem key={item.PEL_ID} value={item.PEL_ID}>
                        {item.PEL_NOME}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {formik.touched.ALU_PEL && formik.errors.ALU_PEL ? (
                  <ErrorText>{formik.errors.ALU_PEL}</ErrorText>
                ) : null}
              </div>
              </InputGroup2>

            </InputGroup3Dashed>

            <InputGroup3>
              <div>
                <TextField
                  fullWidth
                  label="CEP"
                  name="ALU_CEP"
                  id="ALU_CEP"
                  value={maskCEP(formik.values.ALU_CEP)}
                  onChange={formik.handleChange}
                  size="small"
                />
                {formik.touched.ALU_CEP && formik.errors.ALU_CEP ? (
                  <ErrorText>{formik.errors.ALU_CEP}</ErrorText>
                ) : null}
              </div>
              <div>
                <FormControl fullWidth size="small">
                  <InputLabel id="Estado">Estado</InputLabel>
                  <Select
                    labelId="Estado"
                    id="ALU_UF"
                    name="ALU_UF"
                    value={formik.values.ALU_UF}
                    label="Estado"
                    onChange={formik.handleChange}
                  >
                    <MenuItem value={null}>
                      Não Informado
                    </MenuItem>
                    {listUf?.map((item, index) => (
                      <MenuItem key={index} value={item.sigla}>
                        {item.sigla} - {item.nome}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {formik.touched.ALU_UF && formik.errors.ALU_UF ? (
                <ErrorText>{formik.errors.ALU_UF}</ErrorText>
              ) : null}
              </div>
              <div>
                <FormControl fullWidth size="small">
                  <InputLabel id="ALU_CIDADE">Município</InputLabel>
                  <Select
                    labelId="ALU_CIDADE"
                    id="ALU_CIDADE"
                    name="ALU_CIDADE"
                    value={formik.values.ALU_CIDADE}
                    label="Município"
                    onChange={formik.handleChange}
                  >
                    <MenuItem value={null}>
                      Não Informado
                    </MenuItem>
                    {listCity.map((item, index) => (
                      <MenuItem key={index} value={item.nome}>
                        {item.nome}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {formik.touched.ALU_CIDADE && formik.errors.ALU_CIDADE ? (
                  <ErrorText>{formik.errors.ALU_CIDADE}</ErrorText>
                ) : null}
              </div>
            </InputGroup3>
            <InputGroup3>
              <div>
                <TextField
                  fullWidth
                  label="Endereço"
                  id="ALU_ENDERECO"
                  name="ALU_ENDERECO"
                  value={formik.values.ALU_ENDERECO}
                  onChange={formik.handleChange}
                  size="small"
                />
                {formik.touched.ALU_ENDERECO && formik.errors.ALU_ENDERECO ? (
                  <ErrorText>{formik.errors.ALU_ENDERECO}</ErrorText>
                ) : null}
              </div>
              <div>
                <TextField
                  fullWidth
                  label="Bairro"
                  name="ALU_BAIRRO"
                  id="ALU_BAIRRO"
                  value={formik.values.ALU_BAIRRO}
                  onChange={formik.handleChange}
                  size="small"
                />
                {formik.touched.ALU_BAIRRO && formik.errors.ALU_BAIRRO ? (
                  <ErrorText>{formik.errors.ALU_BAIRRO}</ErrorText>
                ) : null}
              </div>
              <InputGroup2>
                <div>
                  <TextField
                    fullWidth
                    label="Numero"
                    id="ALU_NUMERO"
                    name="ALU_NUMERO"
                    value={formik.values.ALU_NUMERO}
                    onChange={formik.handleChange}
                    size="small"
                    ref={numberRef}
                  />
                  {formik.touched.ALU_NUMERO && formik.errors.ALU_NUMERO ? (
                    <ErrorText>{formik.errors.ALU_NUMERO}</ErrorText>
                  ) : null}
                </div>
                <div>
                  <TextField
                    fullWidth
                    label="Complemento"
                    id="ALU_COMPLEMENTO"
                    name="ALU_COMPLEMENTO"
                    value={formik.values.ALU_COMPLEMENTO}
                    onChange={formik.handleChange}
                    size="small"
                  />
                </div>
              </InputGroup2>
            </InputGroup3>
            <InputGroup3>
              <div>
                <FormControl fullWidth size="small">
                  <InputLabel id="ALU_DEFICIENCIAS2">Possuí Deficiência?</InputLabel>
                  <Select
                    labelId="ALU_DEFICIENCIAS2"
                    id="ALU_DEFICIENCIAS2"
                    name="ALU_DEFICIENCIAS2"
                    value={isPcd}
                    label="Possuí Deficiência?"
                    onChange={(e) => handleChangeIsPCD(e)}
                    disabled={!school}
                  >
                      <MenuItem key={'Sim'} value={'Sim'}>
                        Sim
                      </MenuItem>
                      <MenuItem key={'Sim'} value={'Não'}>
                        Não
                      </MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div>
                <Autocomplete
                  multiple
                  className=""
                  id="size-small-outlined"
                  size="small"
                  value={selectedPcds}
                  noOptionsText="Qual/Quais Deficiências?"
                  options={listPcd}
                  getOptionLabel={(option) => `${option.PCD_NOME}`}
                  onChange={(_event, newValue) => {
                    setSelectedPcds(newValue);
                  }}
                  disabled={school ? isPcd === 'Não' : true}
                  renderInput={(params) => (
                    <TextField size="small" {...params} label="Qual/Quais Deficiências?" />
                  )}
                />
                {errorPcds && (
                  <ErrorText>Campo Obrigatório</ErrorText>
                )}
              </div>
              <div>
                <TextField
                  fullWidth
                  label="Tipo de Deficiência (Via Planilha)"
                  id="ALU_DEFICIENCIAS"
                  name="ALU_DEFICIENCIAS"
                  size="small"
                  value={formik.values.ALU_DEFICIENCIA_BY_IMPORT}
                  disabled
                />
              </div>
            </InputGroup3>
            <br />
            <br />

            <ButtonGroupEnd>
              <div style={{ width: 160 }}>
                {active ? (
                  <ButtonDisable
                    type="button"
                    onClick={() => setModalShowQuestion(true)}
                  >
                    Desativar
                  </ButtonDisable>
                ) : (
                  <ButtonPadrao type="button" onClick={() => setModalShowQuestion(true)}>
                    Ativar
                  </ButtonPadrao>
                )}
              </div>

              <div style={{ display: "flex" }}>
                <div style={{ width: 160 }}>
                  <ButtonWhite
                    type="button"
                    onClick={() => setModalShowWarning(true)}
                  >
                    Descartar Alterações
                  </ButtonWhite>
                </div>
                <div className="ms-3" style={{ width: 160 }}>
                  <ButtonPadrao
                    type="submit"
                    disable={isDisabled}
                    onClick={(e) => {
                      e.preventDefault();
                      formik.handleSubmit(e);
                    }}
                  >
                    Salvar
                  </ButtonPadrao>
                </div>
              </div>
            </ButtonGroupEnd>
          </div>
        </Form>
      </Card>
      <ModalConfirmacao
        show={modalShowConfirm}
        onHide={hideConfirm}
        text={
          modalStatus
            ? `Aluno ${formik.values.ALU_NOME} alterado com sucesso!`
            : errorMessage
        }
        status={modalStatus}
      />
      <ModalPergunta
        show={modalShowQuestion}
        onHide={() => setModalShowQuestion(false)}
        onConfirm={changeAluno}
        buttonNo={`Não ${!active ? "Ativar" : "Desativar"}`}
        buttonYes={"Sim, Tenho Certeza"}
        text={`Você está ${active ? "desativando" : "ativando"} o aluno(a) “${
          student?.ALU_NOME
        }”.`}
        status={!active}
        size="lg"
      />
      <ModalConfirmacao
        show={modalShowConfirmQuestion}
        onHide={() => {
          setModalShowConfirmQuestion(false);
        }}
        text={modalStatus ? `${student?.ALU_NOME} ${
          !active === true ? "desativado" : "ativado"
        } com sucesso!` : `Erro ao ${active ? "ativar" : "desativar"}`}
        status={modalStatus}
      />

      <ModalAviso
        show={modalShowWarning}
        onHide={() => setModalShowWarning(false)}
        onConfirm={() => {
          Router.push(`/municipio/${query.id}/escola/${query.escId}/aluno/${student.ALU_ID}`);
        }}
        buttonYes={"Sim, Descartar Informações"}
        buttonNo={"Não Descartar Informações"}
        text={`Ao confirmar essa opção todas as informações serão perdidas.`}
      />
    </>
  );
}
