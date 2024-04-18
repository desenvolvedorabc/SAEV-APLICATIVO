/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import { Form } from "react-bootstrap";
import { useFormik } from "formik";
import { ButtonPadrao } from "src/components/buttons/buttonPadrao";
import {
  InputGroup3Dashed,
  InputGroup3,
  InputGroup2,
  ButtonGroupEnd,
  Card,
  Container,
  ButtonNoBorder,
} from "src/shared/styledForms";
import ButtonWhite from "src/components/buttons/buttonWhite";
import {
  createStudent,
  getAllPcd,
} from "src/services/alunos.service";
import {
  getSerieSchool,
  getSchoolClassSerie,
} from "src/services/turmas.service";
import { getAllGender, getAllSkin } from "src/services/professores.service";
import { loadCity, loadUf, completeCEP } from 'src/utils/combos';
import ErrorText from "src/components/ErrorText";
import ModalConfirmacao from "src/components/modalConfirmacao";
import { useEffect, useRef, useState } from "react";
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
  TextField,
} from "@mui/material";
import { isValidCPF, isValidDate } from "src/utils/validate";
import ModalAviso from "src/components/modalAviso";
import { format } from "date-fns";
import { AutoCompletePagEscMun } from "src/components/AutoCompletePag/AutoCompletePagEscMun";

export function FormAddStudent({ munId }) {
  const [ModalShowConfirm, setModalShowConfirm] = useState(false);
  const [modalStatus, setModalStatus] = useState(true);
  const [_uf, setUf] = useState("");
  const [listUf, setListUf] = useState([]);
  const [listCity, setListCity] = useState([]);
  const [listSerie, setListSerie] = useState([]);
  const [listSchoolClass, setListSchoolClass] = useState([]);
  const [listGender, setListGender] = useState([]);
  const [listSkin, setListSkin] = useState([]);
  const [listPcd, setListPcd] = useState([]);
  const [school, setSchool] = useState(null);
  const [nasc, setNasc] = useState(null);
  const [logo, setLogo] = useState(null);
  const [createObjectURL, setCreateObjectURL] = useState(null);
  const [errorMessage, setErrorMessage] = useState(true);
  const numberRef = useRef(null);
  const nameRef = useRef(null);
  const [isRespOpen, setIsRespOpen] = useState<boolean>(false);
  const [modalShowWarning, setModalShowWarning] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isPcd, setIsPcd] = useState('Não');  
  const [errorPcds, setErrorPcds] = useState(false);
  const [selectedPcds, setSelectedPcds] = useState([]);

  const { query } = useRouter()  

  const handleRespOpen = () => {
    setIsRespOpen(!isRespOpen);
  };

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
    ALU_SER: yup.string()
    .nullable(),
    ALU_TUR: yup.string()
    .nullable(),
    ALU_INEP: yup
      .string()
      // .min(8, "Deve ter no minimo 8 caracteres")
      // .max(9, "Deve ter no máximo 9 caracteres")
      .nullable(),
    ALU_NOME: yup
      .string()
      .min(6, "Deve ter no minimo 6 caracteres")
      .required("Campo obrigatório")
      .nullable(),
      ALU_CPF: yup
      .string()
      .min(14, "Deve ter no minimo 14 caracteres")
      .max(14, "Deve ter no máximo 14 caracteres")
      .test("CPF inválido.", (ALU_CPF) => {
        let result = !ALU_CPF ? true : isValidCPF(ALU_CPF) 
        return result
      })
      .nullable(),
    ALU_GEN: yup.string()
    .nullable(),
    ALU_PEL: yup.string()
    .nullable(),
    // ALU_DEFICIENCIAS: yup
    // .nullable(),
    ALU_NOME_MAE: yup
      .string()
      .required("Campo obrigatório")
      .min(6, "Deve ter no mínimo 6 caracteres")
      .nullable(),
    ALU_NOME_RESP: yup
      .string()
      .min(6, "Deve ter no mínimo 6 caracteres")
      .nullable(),
    ALU_TEL1: yup
      .string()
      .min(14, "Deve ter no mínimo 14 caracteres")
      .max(14, "Deve ter no máximo 14 caracteres")
      .nullable(),
    ALU_EMAIL: yup
      .string()
      .email("Email inválido")
      .nullable(),
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
      .max(9, "CEP com formato inválido")
      .nullable(),
    ALU_UF: yup
      .string()
      .min(2, "Deve ter no minimo 2 caracteres")
      .nullable(),
    ALU_CIDADE: yup
      .string()
      .min(2, "Deve ter no minimo 2 caracteres")
      .nullable(),
    ALU_ENDERECO: yup
      .string()
      .min(6, "Deve ter no minimo 6 caracteres")
      .nullable(),
    ALU_NUMERO: yup.string()
    .nullable(),
    ALU_BAIRRO: yup
      .string()
      .min(6, "Deve ter no minimo 6 caracteres")
      .nullable(),
  });

  const loadSerie = async (idSchool) => {
    const respSerie = await getSerieSchool(idSchool);
    setListSerie(respSerie.data);
  };

  const loadSchoolClass = async (idSchool, idSerie) => {
    const respSchoolClass = await getSchoolClassSerie(idSchool, idSerie, null, '1');
    setListSchoolClass(respSchoolClass.data);
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
    loadGender();
    loadSkin();
    loadPcd();

    async function fetchAPI() {
      setListUf(await loadUf());
    }
    fetchAPI();
  }, []);

  useEffect(() => {
    loadSerie(school?.ESC_ID);
  }, [school]);


  const formik = useFormik({
    initialValues: {
      ALU_ESC: null,
      ALU_SER: null,
      ALU_TUR: null,
      ALU_CPF: null,
      ALU_AVATAR: "",
      ALU_INEP: "",
      ALU_NOME: "",
      ALU_GEN: null,
      ALU_NOME_MAE: "",
      ALU_NOME_PAI: "",
      ALU_NOME_RESP: "",
      ALU_TEL1: "",
      ALU_TEL2: "",
      ALU_EMAIL: "",
      ALU_DEFICIENCIAS: null,
      ALU_PEL: null,
      ALU_DT_NASC: "",
      ALU_CEP: "",
      ALU_UF: null,
      ALU_CIDADE: null,
      ALU_ENDERECO: "",
      ALU_NUMERO: "",
      ALU_COMPLEMENTO: "",
      ALU_BAIRRO: "",
      ALU_ATIVO: true,
      ALU_STATUS: null,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {

      if(isPcd === 'Sim' && selectedPcds.length === 0){
        setErrorPcds(true);
        return;
      } else {
        setErrorPcds(false);
      }

      values.ALU_DT_NASC = format(new Date(values.ALU_DT_NASC), 'yyyy-MM-dd 23:59:59')
      values.ALU_ESC = school.ESC_ID;
      values.ALU_STATUS = !!values?.ALU_TUR ? 'Enturmado' : 'Não Enturmado';
      values.ALU_NOME = values.ALU_NOME.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ')
      values.ALU_NOME_MAE = values.ALU_NOME_MAE.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ')
      values.ALU_NOME_PAI = values.ALU_NOME_PAI.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ')
      values.ALU_NOME_RESP = values.ALU_NOME_RESP.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ')

      if(selectedPcds.length > 0){
        values.ALU_DEFICIENCIAS = selectedPcds.map(pcd => {return {PCD_ID: pcd?.PCD_ID}})
      }
      let avatar = null;
      if (logo) {
        avatar = logo
      }

      setIsDisabled(true)
      let response = null;
      try{
        response = await createStudent(values, avatar);
      }
      catch (err) {
        setIsDisabled(false)
      } finally {
        setIsDisabled(false)
      }
      if (!response?.data?.message) {
        setModalStatus(true);
        setModalShowConfirm(true);
        RemoveImage();
      } else {
        setModalStatus(false);
        setModalShowConfirm(true);
        setErrorMessage(response.data.message || "Erro ao criar aluno");
      }
    },
  });

  useEffect(() => {
    async function fetchAPI() {
      if (formik.values.ALU_UF) {
        setListCity(await loadCity(formik.values.ALU_UF));
      }
    }
    fetchAPI();
  }, [formik.values.ALU_UF]);

  const RemoveImage = () => {
    setLogo(null);
    setCreateObjectURL(null);
  };

  function hideConfirm() {
    setModalShowConfirm(false);
    if (!errorMessage) {
      formik.resetForm();
      return true;
    }
    Router.reload();
  }

  useEffect(() => {
    loadSchoolClass(school?.ESC_ID, formik.values.ALU_SER);
  }, [formik.values.ALU_SER]);

  const handleClickStudent = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    idStudent: string
  ) => {
    e.preventDefault();
    handleRespOpen();
    window.open(`/municipio/${query.id}/escola/${query.escId}/aluno/${idStudent}`);
  };

  useEffect(() => {
    async function fetchAPI() {
      const resp = await completeCEP(formik.values.ALU_CEP);
      formik.values.ALU_UF = resp?.uf;
      formik.values.ALU_CIDADE = resp?.localidade;
      formik.values.ALU_ENDERECO = resp?.logradouro;
      formik.values.ALU_BAIRRO = resp?.bairro;
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
    fetchAPI()
  }, [formik.values.ALU_CEP])

  const handleChangeSchool = React.useCallback((newValue) => {
    setSchool(newValue);
  }, []);

  const mun = React.useMemo(() => ({ MUN_ID: munId }), [munId]);

  const handleChangeIsPCD = (e) => {    
    setIsPcd(e.target.value);
    setSelectedPcds([])
  }


  return (
    <>
      <Card className="reset">
        <Form
          onSubmit={formik.handleSubmit}
          onClick={() => setIsRespOpen(false)}
        >
          <div className="card-box">
            <div>
              <strong>Definir Escola</strong>
            </div>
            <InputGroup3Dashed className="" controlId="formBasic">
              <div>
                <AutoCompletePagEscMun changeSchool={handleChangeSchool} school={school} mun={mun} active={"1"}/>
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
                    value={school?.ESC_UF}
                    size="small"
                    disabled
                    InputLabelProps={{
                      shrink: school?.ESC_UF ? true : false,
                    }}
                  />
                </div>
                <div>
                  <TextField
                    fullWidth
                    label="Municipio"
                    id="ESC_CIDADE"
                    value={school?.ESC_CIDADE}
                    size="small"
                    disabled
                    InputLabelProps={{
                      shrink: school?.ESC_CIDADE ? true : false,
                    }}
                  />
                </div>
              </InputGroup2>
              <div>
                <TextField
                  fullWidth
                  label="Escola"
                  id="ESC_ENDERECO"
                  value={school?.ESC_ENDERECO}
                  size="small"
                  disabled
                  InputLabelProps={{
                    shrink: school?.ESC_ENDERECO ? true : false,
                  }}
                />
              </div>
              <div>
                <TextField
                  fullWidth
                  label="Código INEP"
                  id="ESC_INEP"
                  value={school?.ESC_INEP}
                  size="small"
                  disabled
                  InputLabelProps={{
                    shrink: school?.ESC_INEP ? true : false,
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
                <FormControl fullWidth size="small">
                  <InputLabel id="ALU_SER">Série</InputLabel>
                  <Select
                    labelId="ALU_SER"
                    id="ALU_SER"
                    name="ALU_SER"
                    value={formik.values.ALU_SER}
                    label="Série"
                    onChange={formik.handleChange}
                    disabled={!school}
                  >
                    {listSerie?.map((item) => (
                      <MenuItem key={item.SER_ID} value={item.SER_ID}>
                        {item.SER_NOME}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {formik.touched.ALU_SER && formik.errors.ALU_SER ? (
                  <ErrorText>{formik.errors.ALU_SER}</ErrorText>
                ) : null}
              </div>
              <div>
                <FormControl fullWidth size="small">
                  <InputLabel id="ALU_TUR">Turma</InputLabel>
                  <Select
                    labelId="ALU_TUR"
                    id="ALU_TUR"
                    name="ALU_TUR"
                    value={formik.values.ALU_TUR}
                    label="Turma"
                    onChange={formik.handleChange}
                    disabled={!formik.values.ALU_SER}
                  >
                    {listSchoolClass?.map((item) => (
                      <MenuItem key={item.TUR_ID} value={item.TUR_ID}>
                        {item.TUR_ANO} - {item.TUR_NOME}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {formik.touched.ALU_TUR && formik.errors.ALU_TUR ? (
                  <ErrorText>{formik.errors.ALU_TUR}</ErrorText>
                ) : null}
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
                  <div className="col-6 d-flex flex-column justify-content-center align-items-center">
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
                        <p>Clique para selecionar um arquivo.</p>
                      )}
                    </Container>
                    {logo && (
                      <ButtonNoBorder type="button" onClick={RemoveImage}>
                        Remover
                      </ButtonNoBorder>
                    )}
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
                  disabled={!school}
                  // inputProps={{ maxLength: 9 }}
                />
                {formik.touched.ALU_INEP && formik.errors.ALU_INEP ? (
                  <ErrorText>
                    {formik.errors.ALU_INEP === "ALU_INEP is invalid"
                      ? "Já existe aluno com esse INEP"
                      : formik.errors.ALU_INEP}
                  </ErrorText>
                ) : null}
              </div>
              <div style={{ position: "relative" }}>
                <div className="">
                  <TextField
                    ref={nameRef}
                    fullWidth
                    label="Nome"
                    name="ALU_NOME"
                    id="ALU_NOME"
                    value={formik.values.ALU_NOME}
                    onChange={formik.handleChange}
                    size="small"
                    disabled={!school}
                  />
                </div>
                {formik.touched.ALU_NOME && formik.errors.ALU_NOME ? (
                  <ErrorText>
                    {formik.errors.ALU_NOME 
                      //=== "ALU_NOME is invalid"
                      // ? "Já existe aluno com esse nome"
                      && formik.errors.ALU_NOME}
                  </ErrorText>
                ) : null}
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
                    disabled={!school}
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
                  disabled={!school}
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
                  disabled={!school}
                />
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
                  disabled={!school}
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
                  disabled={!school}
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
                  disabled={!school}
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
                  disabled={!school}
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
                    disabled={!school}
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
                  <ErrorText>{"Campo Obrigatório"}</ErrorText>
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
                    disabled={!school}

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
                    disabled={!school}

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
                  disabled={!school}

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
                    disabled={!school}
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
                    disabled={!school}

                  >
                    {listCity?.map((item, index) => (
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
                  disabled={!school}

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
                  disabled={!school}

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
                    disabled={!school}

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
                    disabled={!school}

                  />
                  {formik.touched.ALU_COMPLEMENTO &&
                  formik.errors.ALU_COMPLEMENTO ? (
                    <ErrorText>{formik.errors.ALU_COMPLEMENTO}</ErrorText>
                  ) : null}
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
                    label="Possui Deficiência?"
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
                  id="ALU_DEFICIENCIAS"
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
                  id="ALU_DEFICIENCIA_BY_IMPORT"
                  name="ALU_DEFICIENCIA_BY_IMPORT"
                  size="small"
                  disabled
                />
              </div>
            </InputGroup3>
            <br />
            <br />

            <ButtonGroupEnd>
              <div style={{ width: 160 }}>
                <ButtonWhite
                  onClick={(e) => {
                    e.preventDefault();
                    setModalShowWarning(true);
                  }}
                >
                  Cancelar
                </ButtonWhite>
              </div>
              <div className="ms-3" style={{ width: 160 }}>
                <ButtonPadrao
                  type="submit"
                  disable={isDisabled}
                  onClick={(e) => {
                    e.preventDefault();
                    formik.handleSubmit();
                  }}
                >
                  Adicionar
                </ButtonPadrao>
              </div>
            </ButtonGroupEnd>
          </div>
        </Form>
      </Card>
      <ModalConfirmacao
        show={ModalShowConfirm}
        onHide={() => {
          setModalShowConfirm(false); modalStatus && Router.back();
        }}
        text={
          modalStatus
            ? `Aluno ${formik.values.ALU_NOME} adicionado com sucesso!`
            : errorMessage
        }
        status={modalStatus}
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
