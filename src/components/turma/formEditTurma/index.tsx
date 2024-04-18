import * as React from "react";
import { Form } from "react-bootstrap";
import { useFormik } from "formik";
import { ButtonPadrao } from "src/components/buttons/buttonPadrao";
import { InputGroup3, ButtonGroupBetween, Card } from "src/shared/styledForms";
import {
  ButtonAddTopico,
  ButtonExcluir,
  Card2,
  InputGroup,
  RepeatableInput,
  Title,
} from "./styledComponents";
import ButtonWhite from "src/components/buttons/buttonWhite";
import {
  editSchoolClass,
  createSchoolClass,
} from "src/services/turmas.service";
import ErrorText from "src/components/ErrorText";
import ModalConfirmacao from "src/components/modalConfirmacao";
import { useEffect, useState } from "react";
import ModalPergunta from "src/components/modalPergunta";
import ButtonVermelho from "src/components/buttons/buttonVermelho";
import Router from "next/router";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Autocomplete,
} from "@mui/material";
import { useGetYears } from "src/services/anos.service";
import { getAllSeries } from "src/services/series.service";
import { getCountyTeachers } from "src/services/professores.service";
import { BiTrash } from "react-icons/bi";
import { MdControlPoint } from "react-icons/md";
import PlusTen from "public/assets/images/plusTen.svg";
import { AutoCompletePagMun } from "src/components/AutoCompletePag/AutoCompletePagMun";
import { AutoCompletePagEscMun } from "src/components/AutoCompletePag/AutoCompletePagEscMun";

type ValidationErrors = Partial<{
  TUR_NOME: string;
  TUR_MUN: string;
  TUR_ESC: string;
  TUR_TIPO: string;
  TUR_PRO: string;
  TUR_SER: string;
  TUR_PERIODO: string;
  TUR_ANO: string;
}>;

export default function FormEditTurma({ turma }) {
  const [modalShowConfirm, setModalShowConfirm] = useState(false);
  const [modalShowQuestion, setModalShowQuestion] = useState(false);
  const [modalShowConfirmQuestion, setModalShowConfirmQuestion] =
    useState(false);
  const [active, setActive] = useState(turma?.TUR_ATIVO);
  const [modalStatus, setModalStatus] = useState(true);
  const [selectedMun, setSelectedMun] = useState(turma?.TUR_MUN);
  const [selectedSchool, setSelectedSchool] = useState(turma?.TUR_ESC);
  const [listSerie, setListSerie] = useState([]);
  const [listTeacher, setListTeacher] = useState([]);
  const [errorMessage, setErrorMessage] = useState(true);
  const [selectedTeachers, setSelectedTeachers] = useState([null]);
  const [resetSchool, setResetSchool] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const { data: dataYears } = useGetYears(null, 1, 999999, null, 'DESC', true);


  const validate = (values) => {
    const errors: ValidationErrors = {};
    if (!values.TUR_MUN) {
      errors.TUR_MUN = "Campo obrigatório";
    }
    if (!values.TUR_ESC) {
      errors.TUR_ESC = "Campo obrigatório";
    }
    if (!values.TUR_NOME?.trim()) {
      errors.TUR_NOME = "Campo obrigatório";
    } 
    // else if (values.TUR_NOME.length < 6) {
    //   errors.TUR_NOME = "Deve ter no minimo 6 caracteres";
    // }
    if (!values.TUR_TIPO) {
      errors.TUR_TIPO = "Campo obrigatório";
    }
    if (!values.TUR_SER) {
      errors.TUR_SER = "Campo obrigatório";
    }
    if (!values.TUR_PERIODO) {
      errors.TUR_PERIODO = "Campo obrigatório";
    }
    if (!values.TUR_ANO) {
      errors.TUR_ANO = "Campo obrigatório";
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      TUR_ID: turma?.TUR_ID,
      TUR_NOME: turma?.TUR_NOME,
      TUR_ANO: turma?.TUR_ANO,
      TUR_TIPO: turma?.TUR_TIPO,
      TUR_PRO: turma?.TUR_PRO,
      TUR_MUN: turma?.TUR_MUN?.MUN_ID,
      TUR_ESC: turma?.TUR_ESC?.ESC_ID,
      TUR_SER: turma?.TUR_SER?.SER_ID,
      TUR_PERIODO: turma?.TUR_PERIODO,
      TUR_TURNO: turma?.TUR_TURNO,
      TUR_ATIVO: turma?.TUR_ATIVO,
    },
    validate,
    onSubmit: async (values) => {

      if (!values.TUR_ATIVO) values.TUR_ATIVO = true;

      if (!values.TUR_TURNO) values.TUR_TURNO = "";

      setIsDisabled(true)
      let response = null;
      try{
        response = turma?.TUR_ID
          ? await editSchoolClass(turma?.TUR_ID, values)
          : await createSchoolClass(values);
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
        setErrorMessage(response.data.message || "Erro ao alterar turma");
      } else {
        setModalStatus(true);
        setModalShowConfirm(true);
      }
    },
  });

  const loadSerie = async () => {
    const resp = await getAllSeries();
    if (resp.data) {
      const filterData = resp?.data?.filter((data) => !!data?.SER_ATIVO);
      setListSerie(filterData);
    }
  };
  const loadTeacher = async (idMun) => {
    const resp = await getCountyTeachers(idMun);
    if (resp.data?.status != "401") {
      const filterData = resp?.data?.filter((data) => !!data?.PRO_ATIVO);

      setListTeacher(filterData);
    }
  };

  useEffect(() => {
    loadSerie();
    if (turma?.TUR_ID) setSelectedTeachers(turma?.TUR_PRO);
  }, []);

  useEffect(() => {
    if (formik.values.TUR_MUN) {
      loadTeacher(formik.values.TUR_MUN);
    }
  }, [formik.values.TUR_MUN]);

  async function changeClass() {
    setModalShowQuestion(false);
    turma = {
      ...turma,
      TUR_ESC: turma?.TUR_ESC?.ESC_ID,
      TUR_MUN: turma?.TUR_MUN?.MUN_ID,
      TUR_SER: turma?.TUR_SER?.SER_ID,
      TUR_ATIVO: !turma?.TUR_ATIVO,
      TUR_TURNO: "",
    };
    const response = await editSchoolClass(turma?.TUR_ID, turma);
    if (
      response?.data?.message
    ) {
      setModalStatus(false);
      setModalShowConfirm(true);
      setErrorMessage(response.data.message || "Erro ao alterar turma");
    } else {
      setModalStatus(true);
      setModalShowConfirm(true);
    }
  }

  function hideConfirm() {
    setModalShowConfirm(false);
    if (!errorMessage) {
      formik.resetForm();
      return true;
    }
    if (modalStatus) Router.reload();
  }

  function onKeyDown(keyEvent) {
    if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
      keyEvent.preventDefault();
    }
  }

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
        top: 205,
      },
    },
  };

  const handleChangeTeacher = (newValue, index) => {
    selectedTeachers[index] = newValue;
    setSelectedTeachers(selectedTeachers);
    formik.values.TUR_PRO = selectedTeachers;
    formik.validateForm();
  };

  const handleDeleteTeacher = (index) => {
    let list = selectedTeachers.filter((teacher, _index) => {
      return index != _index;
    });

    setSelectedTeachers(list);
    formik.values.TUR_PRO = list;
  };

  const AddTeacher = () => {
    setSelectedTeachers([...selectedTeachers, null]);
  };

  const AddTenTeachers = () => {
    let list = [];

    for (let index = 0; index < 10; index++) {
      list.push(null);
    }

    setSelectedTeachers([...selectedTeachers, ...list]);
  };

  const handleChangeMun = (newValue) => {
    formik.values.TUR_MUN = newValue?.MUN_ID;
    formik.values.TUR_ESC = null;
    formik.values.TUR_PRO = null;
    setSelectedMun(newValue);
    setResetSchool(!resetSchool);
    setSelectedTeachers([null]);
    formik.validateForm();
  };

  const handleChangeSchool = (newValue) => {
    formik.values.TUR_ESC = newValue?.ESC_ID;
    setSelectedSchool(newValue);
    formik.validateForm();
  };

  return (
    <>
      <Card>
        <div className="mb-3">
          <strong>
            Dados da Turma{" "}
            {turma?.TUR_ID && `: ${turma?.TUR_ATIVO ? "Ativo" : "Inativo"}`}{" "}
          </strong>
        </div>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          onKeyDown={onKeyDown}
        >
          <div>
            <InputGroup3>
              <div>
                <FormControl fullWidth size="small">
                  <InputLabel id="TUR_ANO">Ano Letivo</InputLabel>
                  <Select
                    labelId="TUR_ANO"
                    id="TUR_ANO"
                    name="TUR_ANO"
                    value={formik.values.TUR_ANO}
                    label="Ano Letivo"
                    onChange={formik.handleChange}
                    disabled={!!turma?.TUR_ID}
                  >
                    {dataYears?.items?.map((item) => (
                      <MenuItem key={item.ANO_ID} value={item.ANO_NOME}>
                        {item.ANO_NOME}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {formik.touched.TUR_ANO && formik.errors.TUR_ANO ? (
                  <ErrorText>{formik.errors.TUR_ANO}</ErrorText>
                ) : null}
              </div>
              <AutoCompletePagMun
                county={selectedMun}
                changeCounty={handleChangeMun}
                active="1"
              />
              <AutoCompletePagEscMun
                school={selectedSchool}
                changeSchool={handleChangeSchool}
                mun={selectedMun}
                active="1"
                resetSchools={resetSchool}
              />
            </InputGroup3>
            <InputGroup3>
              <div>
                <FormControl fullWidth size="small">
                  <InputLabel id="TUR_SER">Série</InputLabel>
                  <Select
                    labelId="TUR_SER"
                    id="TUR_SER"
                    name="TUR_SER"
                    value={formik.values.TUR_SER}
                    label="Série"
                    onChange={formik.handleChange}
                    disabled={turma}
                  >
                    {listSerie.map((item) => (
                      <MenuItem key={item.SER_ID} value={item.SER_ID}>
                        {item.SER_NOME}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {formik.touched.TUR_SER && formik.errors.TUR_SER ? (
                  <ErrorText>{formik.errors.TUR_SER}</ErrorText>
                ) : null}
              </div>
              <div>
                <FormControl fullWidth size="small">
                  <InputLabel id="TUR_PERIODO">Período</InputLabel>
                  <Select
                    labelId="TUR_PERIODO"
                    id="TUR_PERIODO"
                    name="TUR_PERIODO"
                    value={formik.values.TUR_PERIODO}
                    label="Período"
                    onChange={formik.handleChange}
                  >
                    <MenuItem key={"Manhã"} value={"Manhã"}>
                      Manhã
                    </MenuItem>
                    <MenuItem key={"Tarde"} value={"Tarde"}>
                      Tarde
                    </MenuItem>
                    <MenuItem key={"Integral"} value={"Integral"}>
                      Integral
                    </MenuItem>
                    <MenuItem key={"Noite"} value={"Noite"}>
                      Noite
                    </MenuItem>
                  </Select>
                </FormControl>
                {formik.touched.TUR_PERIODO && formik.errors.TUR_PERIODO ? (
                  <ErrorText>{formik.errors.TUR_PERIODO}</ErrorText>
                ) : null}
              </div>
              <div>
                <FormControl fullWidth size="small">
                  <InputLabel id="TUR_TIPO">Tipo</InputLabel>
                  <Select
                    labelId="TUR_TIPO"
                    id="TUR_TIPO"
                    name="TUR_TIPO"
                    value={formik.values.TUR_TIPO}
                    label="Tipo"
                    onChange={formik.handleChange}
                  >
                    <MenuItem key={"Regular"} value={"Regular"}>
                      Regular
                    </MenuItem>
                    <MenuItem key={"Multisseriada"} value={"Multisseriada"}>
                      Multisseriada
                    </MenuItem>
                  </Select>
                </FormControl>
                {formik.touched.TUR_TIPO && formik.errors.TUR_TIPO ? (
                  <ErrorText>{formik.errors.TUR_TIPO}</ErrorText>
                ) : null}
              </div>
            </InputGroup3>
            <InputGroup>
              <div className="">
                <TextField
                  fullWidth
                  label="Nome da Turma"
                  id="TUR_NOME"
                  name="TUR_NOME"
                  value={formik.values.TUR_NOME}
                  onChange={formik.handleChange}
                  size="small"
                />
                {formik.errors.TUR_NOME ? (
                  <ErrorText>{formik.errors.TUR_NOME}</ErrorText>
                ) : null}
              </div>
            </InputGroup>
          </div>
        </Form>
      </Card>
      <Title>Professores</Title>
      <Card>
        {selectedTeachers.map((teacher, index) => {
          return (
            <div key={index} className="d-flex rounded-start">
              <Card2 className="rounded-end col">
                <RepeatableInput className="">
                  <div className="col pe-3">
                   
                    <Autocomplete
                      key={`${teacher?.PRO_NOME}-${index}`}
                      //disablePortal
                      id="size-small-outlined"
                      size="small"
                      noOptionsText="Professor"
                      options={listTeacher}
                      value={teacher}
                      isOptionEqualToValue={(option, value) => {
                        return option.PRO_NOME === value.PRO_NOME;
                      }}
                      getOptionLabel={(option) => `${option?.PRO_NOME}`}
                      onChange={(event, newValue) => {
                        handleChangeTeacher(newValue, index);
                      }}
                      renderInput={(params) => (
                        <TextField size="small" {...params} label="Professor" />
                      )}
                    />
                  </div>
                  <div className="">
                    <ButtonExcluir
                      type="button"
                      onClick={() => handleDeleteTeacher(index)}
                    >
                      <BiTrash color={"#FF6868"} size={16} />
                    </ButtonExcluir>
                  </div>
                </RepeatableInput>
              </Card2>
            </div>
          );
        })}
      </Card>
      <ButtonAddTopico
        style={{ marginTop: 30 }}
        type="button"
        onClick={AddTeacher}
      >
        <MdControlPoint color={"#3E8277"} size={39} />
      </ButtonAddTopico>
      <ButtonAddTopico type="button" onClick={AddTenTeachers}>
        <PlusTen color={"#3E8277"} size={35} />
      </ButtonAddTopico>
      <ButtonGroupBetween style={{ marginTop: 30 }}>
        <div>
          {turma?.TUR_ID && (
            <>
              {formik.values.TUR_ATIVO ? (
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
              onClick={(e) => {
                e.preventDefault();
                Router.push("/turmas");
              }}
            >
              {turma?.TUR_ID ? "Descartar Alterações" : "Cancelar"}
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
              {turma?.TUR_ID ? "Salvar" : "Adicionar"}
            </ButtonPadrao>
          </div>
        </div>
      </ButtonGroupBetween>
      <ModalConfirmacao
        show={modalShowConfirm}
        onHide={() => {
          hideConfirm();
        }}
        text={
          modalStatus
            ? `Turma ${formik.values.TUR_NOME} ${turma?.TUR_ID ? 'alterada' : 'criada'} com sucesso!`
            : errorMessage
        }
        status={modalStatus}
      />
      <ModalPergunta
        show={modalShowQuestion}
        onHide={() => setModalShowQuestion(false)}
        onConfirm={() => changeClass()}
        buttonNo={!active ? "Não Ativar" : "Não Desativar"}
        buttonYes={"Sim, Tenho Certeza"}
        text={`Você está ${
          !active === true
            ? `ativando(a) “${formik.values.TUR_NOME}”.`
            : `desativando(a) “${formik.values.TUR_NOME}”. Ao desativar essa turma  todos os Alunos serão DESENTURMADOS, você tem certeza que deseja seguir em diante?`
        }${
          !active ? " Você pode inativar novamente a qualquer momento." : ''
        }`}
        status={!active}
        size="lg"
      />
      <ModalConfirmacao
        show={modalShowConfirmQuestion}
        onHide={() => {
          setModalShowConfirmQuestion(false);
          Router.reload();
        }}
        text={modalStatus ? `${formik.values.TUR_NOME} ${
          active === true
            ? "ativado com sucesso!"
            : "A turma foi desativada com sucesso e os alunos estão sendo DESENTURMADOS pelo sistema."
        }` : `Erro ao ${active ? "ativar" : "desativar"}`}
        status={modalStatus}
      />
    </>
  );
}
