import * as React from "react";
import { Form } from "react-bootstrap";
import { useFormik } from "formik";
import { ButtonPadrao } from "src/components/buttons/buttonPadrao";
import {
  InputGroup2,
  ButtonGroupBetween,
  Card,
  Container,
  ButtonNoBorder,
  FormCheck,
} from "src/shared/styledForms";
import { InputGroupCheck, FormCheckLabel, BoxLeft } from "./styledComponents";
import ButtonWhite from "src/components/buttons/buttonWhite";
import { editUser } from "src/services/usuarios.service";
import ErrorText from "src/components/ErrorText";
import ModalConfirmacao from "src/components/modalConfirmacao";
import { useEffect, useState } from "react";
import { maskCPF, maskPhone } from "src/utils/masks";
import { useDropzone } from "react-dropzone";
import { MdOutlineLock } from "react-icons/md";
import ModalPergunta from "src/components/modalPergunta";
import ButtonVermelho from "src/components/buttons/buttonVermelho";
import Router from "next/router";
import { setCookie, parseCookies } from "nookies";
import { useGetAllPerfis } from "src/services/perfis.service";
import { useGetSubBase } from "src/services/sub-perfis.service";
import { isValidCPF } from "src/utils/validate";
import { Autocomplete, TextField } from "@mui/material";
import { AutoCompletePagMun } from "src/components/AutoCompletePag/AutoCompletePagMun";
import { AutoCompletePagEscMun } from "src/components/AutoCompletePag/AutoCompletePagEscMun";

type ValidationErrors = Partial<{
  USU_SPE: string;
  USU_MUN: string;
  USU_ESC: string;
  USU_NOME: string;
  USU_EMAIL: string;
  USU_DOCUMENTO: string;
  USU_FONE: string;
}>;

export default function FormEditUsuario({ usuario }) {
  const [modalShowConfirm, setModalShowConfirm] = useState(false);
  const [modalShowQuestion, setModalShowQuestion] = useState(false);
  const [modalShowConfirmQuestion, setModalShowConfirmQuestion] =
    useState(false);
  const [active, setActive] = useState(usuario.USU_ATIVO);
  const [modalStatus, setModalStatus] = useState(true);
  const [selectedPerfil, setSelectedPerfil] = useState(
    usuario.USU_SPE?.SPE_PER
  );
  const [selectedCounty, setSelectedCounty] = useState(usuario?.USU_MUN);
  const [selectedSchool, setSelectedSchool] = useState(usuario?.USU_ESC);
  const [resetSchool, setResetSchool] = useState(false)
  const [avatar, setAvatar] = useState(null);
  const [createObjectURL, setCreateObjectURL] = useState(
    usuario.USU_AVATAR_URL
  );
  const [errorMessage, setErrorMessage] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);

  const { data: listPerfis, isLoading: isLoadingPerfis } = useGetAllPerfis();

  const { data: listSubPerfis, isLoading: isLoadingSubPerfis } = useGetSubBase(selectedPerfil?.PER_ID, !!selectedPerfil);

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({
      accept: "image/png, image/gif, image/jpeg",
      maxFiles: 1,
      onDrop: (acceptedFiles) => {
        setAvatar(acceptedFiles[0]);
        setCreateObjectURL(URL.createObjectURL(acceptedFiles[0]));
      },
    });

  const validate = (values) => {
    const errors: ValidationErrors = {};
    if (!values.USU_SPE) {
      errors.USU_SPE = "Campo obrigatório";
    }

    if (selectedPerfil?.PER_NOME !== "SAEV") {
      if (!values.USU_MUN) {
        errors.USU_MUN = "Campo obrigatório";
      }
      if (selectedPerfil?.PER_NOME !== "Município") {
        if (!values.USU_ESC) {
          errors.USU_ESC = "Campo obrigatório";
        }
      }
    }
    if (!values.USU_NOME) {
      errors.USU_NOME = "Campo obrigatório";
    } else if (values.USU_NOME.length < 6) {
      errors.USU_NOME = "Deve ter no minimo 6 caracteres";
    }
    if (!values.USU_EMAIL) {
      errors.USU_EMAIL = "Campo obrigatório";
    } else if (
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        values.USU_EMAIL
      )
    ) {
      errors.USU_EMAIL = "Email com formato inválido";
    }
    if (!values.USU_DOCUMENTO) {
      errors.USU_DOCUMENTO = "Campo obrigatório";
    } else if (!isValidCPF(values.USU_DOCUMENTO)) {
      errors.USU_DOCUMENTO = "Documento com formato inválido";
    }
    if (!values.USU_FONE) {
      errors.USU_FONE = "Campo obrigatório";
    } else if (values.USU_FONE.length < 14 || values.USU_FONE.length > 14) {
      errors.USU_FONE = "Telefone com formato inválido";
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      USU_MUN: usuario.USU_MUN?.MUN_ID ?? null,
      USU_ESC: usuario.USU_ESC?.ESC_ID ?? null,
      USU_NOME: usuario.USU_NOME,
      USU_EMAIL: usuario.USU_EMAIL,
      USU_DOCUMENTO: usuario.USU_DOCUMENTO,
      USU_FONE: usuario.USU_FONE,
      USU_ATIVO: usuario.USU_ATIVO,
      USU_AVATAR: usuario.USU_AVATAR,
      USU_SPE: usuario.USU_SPE?.SPE_ID ?? null,
      USU_SENHA: usuario.USU_SENHA,
    },
    validate,
    onSubmit: async (values) => {
      let file = null;
      if (avatar) {
        file = avatar;
      }

      values.USU_DOCUMENTO = values.USU_DOCUMENTO ? maskCPF(values.USU_DOCUMENTO.trim()) : null
      values.USU_FONE = values.USU_FONE ? maskPhone(values.USU_FONE.trim()) : null
      values.USU_MUN = values.USU_MUN ? parseInt(values.USU_MUN) : null
      values.USU_ESC = values.USU_ESC ? parseInt(values.USU_ESC) : null
      values.USU_SPE = values.USU_SPE ? parseInt(values.USU_SPE) : null

      const newValues = {
        ...values,
        USU_MUN: values?.USU_MUN === 'MUNICIPIO' ? null : values.USU_MUN,
        USU_ESC: values?.USU_ESC === 'ESCOLA' ? null : values.USU_ESC,
      }

      setIsDisabled(true)
      let response = null;
      try{
        response = await editUser(usuario.USU_ID, newValues, file);
      }
      catch (err) {
        setIsDisabled(false)
      } finally {
        setIsDisabled(false)
      }
      
      if (
        !response?.data?.message
      ) {
        const cookies = parseCookies();

        if (usuario.USU_ID === cookies["USU_ID"]) {
          setCookie(null, "USU_NOME", response.data.USU_NOME, {
            path: "/",
          });
          const usuSubPer = listSubPerfis?.find(
            (x) => x.SPE_ID == response.data.USU_SPE
          );

          setCookie(null, "USU_SPE", usuSubPer.SPE_NOME, {
            path: "/",
          });

          setCookie(null, "PER_NOME", usuSubPer.SPE_PER?.PER_NOME, {
            path: "/",
          });

          setCookie(null, "USU_SPE_ID", usuSubPer?.SPE_ID, {
            path: "/",
          });
          setCookie(null, "USU_EMAIL", response.data.USU_EMAIL, {
            path: "/",
          });
          setCookie(null, "USU_AVATAR", response.data.USU_AVATAR, {
            path: "/",
          });
          setCookie(null, "USU_RETRY", "0", {
            path: "/",
          });
        }
        setModalStatus(true);
        setModalShowConfirm(true);
      } else {
        setModalStatus(false);
        setModalShowConfirm(true);
        setErrorMessage(response.data.message || "Erro ao alterar usuário");
      }
    },
  });

  const RemoveImage = () => {
    setAvatar(null);
    setCreateObjectURL(null);
  };

  async function changeUser() {
    setModalShowQuestion(false);
    usuario = {
      USU_ID: usuario.USU_ID,
      USU_ATIVO: !usuario.USU_ATIVO,
    };
    const response = await editUser(usuario.USU_ID, usuario, null);
    if (
      response?.data?.message
    ) {
      setModalStatus(false);
      setModalShowConfirmQuestion(true);
      setErrorMessage(response.data.message || "Erro ao alterar turma");
    } else {
      setModalStatus(true);
      setModalShowConfirmQuestion(true);
    }
  }

  const handleChangePerfil = (newValue) => {
    setSelectedPerfil(newValue);
    formik.values.USU_SPE = null;
  };

  function hideConfirm() {
    setModalShowConfirm(false);
    if (!errorMessage) {
      formik.resetForm();
      return true;
    }
  }

  function onKeyDown(keyEvent) {
    if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
      keyEvent.preventDefault();
    }
  }

  const verifyCheckSubPerfil = (id) => {
    if (id == usuario.USU_SPE?.SPE_ID) return true;
    return false;
  };

  const handleSelectCounty = (newValue) => {
    formik.values.USU_MUN = newValue?.MUN_ID
    setSelectedCounty(newValue);

    formik.values.USU_ESC = null;
    setSelectedSchool(null);
    setResetSchool(!resetSchool)
  }

  const handleSelectSchool = (newValue) => {
    formik.values.USU_ESC = newValue?.ESC_ID
    setSelectedSchool(newValue);
  }

  useEffect(() => {
    formik.validateForm();
  },[formik.values.USU_MUN, formik.values.USU_ESC, selectedPerfil])

  return (
    <>
      <Card>
        <div className="mb-3">
          <strong>{usuario.USU_NOME}</strong>
        </div>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          onKeyDown={onKeyDown}
        >
          <div className="d-flex ">
            <BoxLeft className="d-flex flex-column col-4">
              <Form.Label>Escolha um Perfil:</Form.Label>
              <div className="my-2">
                <Autocomplete
                  className=""
                  id="size-small-outlined"
                  size="small"
                  value={selectedPerfil}
                  noOptionsText="Perfil Base"
                  options={listPerfis ? listPerfis : []}
                  getOptionLabel={(option) =>  `${option?.PER_NOME}`}
                  onChange={(_event, newValue) => {
                    handleChangePerfil(newValue)}}
                  loading={isLoadingPerfis}
                  sx={{
                    "& .Mui-disabled": {
                      background: "#D3D3D3",
                    },
                  }}
                  renderInput={(params) => <TextField size="small" {...params} label="Escolha um Perfil:" />}
                />
                {formik.errors.USU_SPE ? (
                  <ErrorText>{formik.errors.USU_SPE}</ErrorText>
                ) : null}
              </div>
              <InputGroupCheck
                key={"radio"}
                name="USU_SPE"
                onChange={formik.handleChange}
                value={formik.values.USU_SPE}
                className=""
              >
                {listSubPerfis?.map((x) => {
                  return (
                    <FormCheck id={x.SPE_ID} key={x.SPE_ID} className="">
                      <Form.Check.Input
                        defaultChecked={verifyCheckSubPerfil(x.SPE_ID)}
                        value={x.SPE_ID}
                        name="USU_SPE"
                        type={"radio"}
                      />
                      <FormCheckLabel>
                        {
                          <>
                            <div>{x.SPE_NOME}</div>
                            <div>
                              <MdOutlineLock color={"#3E8277"} size={20} />
                            </div>
                          </>
                        }
                      </FormCheckLabel>
                    </FormCheck>
                  );
                })}
              </InputGroupCheck>
            </BoxLeft>
            <div className="col-6 px-3">
              <div>
                <Form.Label>
                  Selecione o Município e a Escola do Usuário:
                </Form.Label>
                <InputGroup2 className="my-3">
                  <div>
                    <AutoCompletePagMun county={selectedCounty} changeCounty={handleSelectCounty} />
                    {formik.errors.USU_MUN ? (
                      <ErrorText>{formik.errors.USU_MUN}</ErrorText>
                    ) : null}
                  </div>
                  <div>
                    <AutoCompletePagEscMun school={selectedSchool} changeSchool={handleSelectSchool} mun={selectedCounty} resetSchools={resetSchool} />
                    {formik.errors.USU_ESC ? (
                      <ErrorText>{formik.errors.USU_ESC}</ErrorText>
                    ) : null}
                  </div>
                </InputGroup2>
              </div>
              <div>
                <Form.Label>Usuário:</Form.Label>
                <InputGroup2 className="my-3">
                  <div>
                    <TextField
                      fullWidth
                      label="Nome"
                      name="USU_NOME"
                      id="USU_NOME"
                      value={formik.values.USU_NOME}
                      onChange={formik.handleChange}
                      size="small"
                    />
                    {formik.errors.USU_NOME ? (
                      <ErrorText>{formik.errors.USU_NOME}</ErrorText>
                    ) : null}
                  </div>
                  <div>
                    <TextField
                      fullWidth
                      label="Email"
                      name="USU_EMAIL"
                      id="USU_EMAIL"
                      value={formik.values.USU_EMAIL}
                      onChange={formik.handleChange}
                      size="small"
                    />
                    {formik.errors.USU_EMAIL ? (
                      <ErrorText>{formik.errors.USU_EMAIL}</ErrorText>
                    ) : null}
                  </div>
                </InputGroup2>
                <InputGroup2 className="my-3">
                  <div>
                    <TextField
                      fullWidth
                      label="CPF"
                      name="USU_DOCUMENTO"
                      id="USU_DOCUMENTO"
                      value={maskCPF(formik.values.USU_DOCUMENTO)}
                      onChange={formik.handleChange}
                      size="small"
                    />
                    {formik.errors.USU_DOCUMENTO ? (
                      <ErrorText>{formik.errors.USU_DOCUMENTO}</ErrorText>
                    ) : null}
                  </div>
                  <div>
                    <TextField
                      fullWidth
                      label="Telefone"
                      name="USU_FONE"
                      id="USU_FONE"
                      value={maskPhone(formik.values.USU_FONE)}
                      onChange={formik.handleChange}
                      size="small"
                    />
                    {formik.errors.USU_FONE ? (
                      <ErrorText>{formik.errors.USU_FONE}</ErrorText>
                    ) : null}
                  </div>
                </InputGroup2>
                <InputGroup2>
                  <div>
                    <Form.Label>Avatar</Form.Label>
                    <div className="d-flex">
                      <div className=" d-flex flex-column justify-content-center align-items-center">
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
                            <img src={createObjectURL} width={150} alt="" />
                          ) : (
                            <p>
                              Arraste uma imagem ou clique Para selecionar uma
                              imagem.
                            </p>
                          )}
                        </Container>
                        {avatar && (
                          <ButtonNoBorder onClick={RemoveImage}>
                            Remover
                          </ButtonNoBorder>
                        )}
                      </div>
                    </div>
                  </div>
                </InputGroup2>
              </div>
            </div>
          </div>
          <ButtonGroupBetween style={{ marginTop: 30 }}>
            <div>
              {formik.values.USU_ATIVO ? (
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
          hideConfirm();
          modalStatus && Router.reload();
        }}
        text={
          modalStatus
            ? `Usuário ${formik.values.USU_NOME} alterado com sucesso!`
            : errorMessage
        }
        status={modalStatus}
      />
      <ModalPergunta
        show={modalShowQuestion}
        onHide={() => setModalShowQuestion(false)}
        onConfirm={() => changeUser()}
        buttonNo={active ? "Não Desativar": 'Não Ativar'}
        buttonYes={"Sim, Tenho Certeza"}
        text={`Você está ${
          !active === true
            ? `ativando(a) “${formik.values.USU_NOME}”.`
            : `desativando(a) “${formik.values.USU_NOME}”. isso tirará todos os acessos, os dados serão desconsiderados do relatório.`
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
          Router.push(`/usuario/${usuario.USU_ID}`);
        }}
        text={modalStatus ? `${formik.values.USU_NOME} ${
          !active ? "ativado" : "desativado"
        } com sucesso!` : `Erro ao ${active ? "ativar" : "desativar"}`}
        status={modalStatus}
      />
    </>
  );
}
