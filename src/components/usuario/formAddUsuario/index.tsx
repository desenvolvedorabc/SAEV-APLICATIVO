import { Form } from "react-bootstrap";
import { useFormik } from "formik";
import { ButtonPadrao } from "src/components/buttons/buttonPadrao";
import {
  InputGroup2,
  ButtonGroupEnd,
  Card,
  Container,
  ButtonNoBorder,
  FormCheck,
} from "src/shared/styledForms";
import { InputGroupCheck, FormCheckLabel, BoxLeft } from "./styledComponents";
import ButtonWhite from "src/components/buttons/buttonWhite";
import { createUser } from "src/services/usuarios.service";
import ErrorText from "src/components/ErrorText";
import ModalConfirmacao from "src/components/modalConfirmacao";
import { useEffect, useState } from "react";
import { maskCPF, maskPhone } from "src/utils/masks";
import { useDropzone } from "react-dropzone";
import { MdOutlineLock } from "react-icons/md";
import Router from "next/router";
import { RoleProfile, useGetProfiles } from "src/services/perfis.service";
import { isValidCPF } from "src/utils/validate";
import { Autocomplete, TextField } from "@mui/material";
import { AutoCompletePagEscMun } from "src/components/AutoCompletePag/AutoCompletePagEscMun";
import { useGetStates } from "src/services/estados.service";
import { queryClient } from "src/lib/react-query";
import { useAuth } from "src/context/AuthContext";
import { AutoCompletePagMun2 } from "src/components/AutoCompletePag/AutoCompletePagMun2";

type ValidationErrors = Partial<{
  USU_SPE: string;
  USU_MUN: string;
  USU_ESC: string;
  USU_NOME: string;
  USU_EMAIL: string;
  USU_DOCUMENTO: string;
  USU_FONE: string;
  stateId: string;
}>;

export default function FormAddUsuario(props) {
  const [ModalShowConfirm, setModalShowConfirm] = useState(false);
  const [modalStatus, setModalStatus] = useState(true);
  const [listPerfil, setListPerfil] = useState([])
  const [selectedPerfil, setSelectedPerfil] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCounty, setSelectedCounty] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [resetSchool, setResetSchool] = useState(false)
  const [avatar, setAvatar] = useState(null);
  const [createObjectURL, setCreateObjectURL] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const {user} = useAuth();

  const { data: listSubPerfis, isLoading: isLoadingSubPerfis } = useGetProfiles(null, 1, 999999, null, 'ASC', selectedPerfil, !!selectedPerfil);

  
  useEffect(() => {
    if(user){
      if(user?.USU_SPE?.role === 'SAEV'){
        setListPerfil(Object.keys(RoleProfile))
      } else if(user?.USU_SPE?.role === 'ESTADO'){
        setListPerfil(['ESTADO', 'MUNICIPIO_ESTADUAL', 'ESCOLA'])
      } else if(user?.USU_SPE?.role === 'MUNICIPIO_ESTADUAL'){
        setListPerfil(['MUNICIPIO_ESTADUAL', 'ESCOLA'])
      } else if(user?.USU_SPE?.role === 'MUNICIPIO_MUNICIPAL'){
        setListPerfil(['MUNICIPIO_MUNICIPAL', 'ESCOLA'])
      } else if(user?.USU_SPE?.role === 'ESCOLA'){
        setListPerfil(['ESCOLA'])
      }
    }
  },[user]);

  const { data: states, isLoading: isLoadingStates } = useGetStates();

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

    if (selectedPerfil !== "SAEV") {
      if (!values.stateId) {
        errors.stateId = "Campo obrigatório";
      }
      if(selectedPerfil !== "ESTADO") {
        if (!values.USU_MUN) {
          errors.USU_MUN = "Campo obrigatório";
        }
        if(selectedPerfil === "ESCOLA") {
          if (!values.USU_ESC) {
            errors.USU_ESC = "Campo obrigatório";
          }
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
      USU_MUN: null,
      USU_ESC: null,
      USU_NOME: "",
      USU_EMAIL: "",
      USU_DOCUMENTO: "",
      USU_FONE: "",
      USU_AVATAR: "",
      USU_SPE: null,
      USU_SENHA: "123456",
      stateId: null
    },
    validate,
    onSubmit: async (values) => {
      let file = null;
      if (avatar) {
        file = avatar;
      }

      values.USU_DOCUMENTO = maskCPF(values.USU_DOCUMENTO.trim())
      values.USU_FONE = maskPhone(values.USU_FONE.trim())

      // const newValues = {
      //   ...values,
      //   USU_MUN: values?.USU_MUN === 'MUNICIPIO' ? null : values.USU_MUN,
      //   USU_ESC: values?.USU_ESC === 'ESCOLA' ? null : values.USU_ESC,
      // }

      setIsDisabled(true)
      let response = null;
      try{
        response = await createUser(values, file);
      }
      catch (err) {
        setIsDisabled(false)
      } finally {
        setIsDisabled(false)
      }
      if (!response.data.message) {
        setModalStatus(true);
        setModalShowConfirm(true);
        queryClient.invalidateQueries(['users'])
        RemoveImage();
      } else {
        setErrorMessage(response.data.message)
        setModalStatus(false);
        setModalShowConfirm(true);
      }
    },
  });

  const RemoveImage = () => {
    setAvatar(null);
    setCreateObjectURL(null);
  };

  const handleChangePerfil = (newValue) => {
    setSelectedPerfil(newValue);
  };

  function onKeyDown(keyEvent) {
    if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
      keyEvent.preventDefault();
    }
  }


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
          <strong>Adicionar Novo Usuário</strong>
        </div>
        <Form onSubmit={formik.handleSubmit} onKeyDown={onKeyDown}>
          <div className="d-flex">
            <BoxLeft className="d-flex flex-column col-4">
              <Form.Label>Escolha um Perfil:</Form.Label>
              <div className="my-2">
              <Autocomplete
                  className=""
                  data-test='profile'
                  id="profile"
                  size="small"
                  value={selectedPerfil}
                  noOptionsText="Perfil Base"
                  options={listPerfil}
                  getOptionLabel={(option) =>  `${RoleProfile[option]}`}
                  onChange={(_event, newValue) => {
                    handleChangePerfil(newValue)}}
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
                {listSubPerfis?.items?.map((x) => {
                  return (
                    <FormCheck id={x.SPE_ID} key={x.SPE_ID} className="">
                      <Form.Check.Input
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
                    <Autocomplete
                      className=""
                      data-test='state'
                      id="state"
                      size="small"
                      value={selectedState}
                      noOptionsText="Estado"
                      options={states}
                      getOptionLabel={(option) =>  `${option?.name}`}
                      onChange={(_event, newValue) => {
                        setSelectedState(newValue)
                        formik.setFieldValue('stateId', newValue?.id, true)
                        setSelectedCounty(null)
                        formik.setFieldValue('USU_MUN', null, true)
                      }}
                      sx={{
                        "& .Mui-disabled": {
                          background: "#D3D3D3",
                        },
                      }}
                      renderInput={(params) => <TextField size="small" {...params} label="Estado" />}
                    />
                    {formik.errors.stateId ? (
                      <ErrorText>{formik.errors.stateId}</ErrorText>
                    ) : null}
                  </div>
                  <div>
                    <AutoCompletePagMun2 county={selectedCounty} changeCounty={handleSelectCounty} stateId={selectedState?.id} disabled={!selectedState}/>
                    {formik.errors.USU_MUN ? (
                      <ErrorText>{formik.errors.USU_MUN}</ErrorText>
                    ) : null}
                  </div>
                  <div>
                    <AutoCompletePagEscMun school={selectedSchool} changeSchool={handleSelectSchool} mun={selectedCounty} resetSchools={resetSchool} disabled={!selectedCounty} />
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
                            <img src={createObjectURL} width={150} alt=""/>
                          ) : (
                            <p>
                              Arraste uma imagem ou clique Para selecionar uma
                              imagem.
                            </p>
                          )}
                        </Container>
                        {avatar && (
                          <ButtonNoBorder type="button" onClick={RemoveImage}>
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
          <ButtonGroupEnd style={{ marginTop: "30px" }}>
            <div style={{ width: 160 }}>
              <ButtonWhite
                dataTest='cancel'
                onClick={(e) => {
                  e.preventDefault();
                  formik.resetForm();
                }}
              >
                Cancelar
              </ButtonWhite>
            </div>
            <div className="ms-3" style={{ width: 160 }}>
              <ButtonPadrao
                dataTest='save'
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  formik.handleSubmit(e);
                }}
                disable={!(formik.isValid && formik.dirty) || isDisabled}
              >
                Adicionar
              </ButtonPadrao>
            </div>
          </ButtonGroupEnd>
        </Form>
      </Card>
      <ModalConfirmacao
        show={ModalShowConfirm}
        onHide={() => {
          setModalShowConfirm(false), modalStatus && Router.push("/usuarios");
        }}
        text={
          modalStatus
            ? `Usuário ${formik.values.USU_NOME} adicionado com sucesso! \n Enviamos um Email para esse usuário contendo um link para a criação da primeira senha de acesso.`
            : errorMessage ? errorMessage : `Erro ao criar usuário`
        }
        status={modalStatus}
      />
    </>
  );
}
