import { Form } from "react-bootstrap";
import { useFormik } from "formik";
import { ButtonPadrao } from "src/components/buttons/buttonPadrao";
import {
  FormCheckLabel,
  CardBloco,
  TopoCard,
  CheckGroup,
  FormCheck
} from "./styledComponents";
import { ButtonGroupEnd, Card } from "src/shared/styledForms";
import ButtonWhite from "src/components/buttons/buttonWhite";
import ErrorText from "src/components/ErrorText";
import ModalConfirmacao from "src/components/modalConfirmacao";
import { useEffect, useState, useMemo } from "react";
import Router from "next/router";
import { RoleProfile, createPerfil, getAllPerfis } from "src/services/perfis.service";
import { getAreasByPerfil } from "src/services/areas.service";
import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { ADMINLINKS } from "src/utils/menu";
import { queryClient } from "src/lib/react-query";
import { useAuth } from "src/context/AuthContext";

type ValidationErrors = Partial<{ role: string; SPE_NOME: string }>;

export default function FormAddPerfil(props) {
  const [ModalShowConfirm, setModalShowConfirm] = useState(false);
  const [modalStatus, setModalStatus] = useState(true);
  const [listAreas, setListAreas] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [listProfiles, setListProfiles] = useState([]);
  const { user } = useAuth()

  useEffect(() => {
    if(user?.USU_SPE?.role === 'ESCOLA'){
      setListProfiles(['ESCOLA'])
    }
    if(user?.USU_SPE?.role === 'MUNICIPIO_MUNICIPAL'){
      setListProfiles(['MUNICIPIO_MUNICIPAL', 'ESCOLA'])
    }
    if(user?.USU_SPE?.role === 'MUNICIPIO_ESTADUAL'){
      setListProfiles(['MUNICIPIO_ESTADUAL', 'ESCOLA'])
    }
    if(user?.USU_SPE?.role === 'ESTADO'){
      setListProfiles(['ESTADO', 'MUNICIPIO_ESTADUAL', 'ESCOLA'])
    }
    if(user?.USU_SPE?.role === 'SAEV'){
      setListProfiles(['SAEV', 'ESTADO', 'MUNICIPIO_ESTADUAL', 'MUNICIPIO_MUNICIPAL', 'ESCOLA'])
    }
  },[user])

  const validate = (values) => {
    const errors: ValidationErrors = {};
    if (!values.role) {
      errors.role = "Campo obrigatório";
    }
    if (!values.SPE_NOME) {
      errors.SPE_NOME = "Campo obrigatório";
    } else if (values.SPE_NOME.length < 6) {
      errors.SPE_NOME = "Deve ter no minimo 6 caracteres";
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      SPE_NOME: "",
      role: "",
      AREAS: [],
    },
    validate,
    onSubmit: async (values) => {
      const list = [];
      values.AREAS.forEach((x) => {
        listAreas.forEach((area) => {
          if(x == area.ARE_NOME)
            list.push({ ARE_ID: area.ARE_ID });
        }
      )});
      values.AREAS = list;
      console.log('values :', values);

      
      setIsDisabled(true)
      let response = null;
      try{
        response = await createPerfil(values);
      }
      catch (err) {
        setIsDisabled(false)
      } finally {
        setIsDisabled(false)
      }
      if (
        !response?.data?.message
      ) {
        setModalStatus(true);
        setModalShowConfirm(true);
        queryClient.invalidateQueries(['profiles'])
      } else {
        setErrorMessage(response?.data?.message);
        setModalStatus(false);
        setModalShowConfirm(true);
      }
    },
  });

  const loadAreas = async (perfil: string) => {
      const resp = await getAreasByPerfil(perfil);
      // if(resp.data.length > 0)
        setListAreas(resp.data);
  };

  useEffect(() => {
    loadAreas(formik.values.role);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.role]);

  const filterLinks = useMemo(() => {
    const filter = ADMINLINKS.map((data) => {
      // let isVerify = false;

      // listAreas.forEach((area) => {
      //   if (area.ARE_NOME === data?.ARE_NOME) {
      //     isVerify = true;
      //   }
      // });

      // if (isVerify) {
      //   return data;
      // } else {
        const options = data?.items.filter((item: any) => {
          let verifyItem = false;
          
          listAreas.forEach((area) => {
            if (item?.validate || area.ARE_NOME === item.ARE_NOME) {
              verifyItem = true;
            }
          });

          return verifyItem;
        });

        if (options.length) {
          return {
            grupo: data.grupo ? data.grupo : "GERAL",
            items: options,
          };
        }
      // }
    });

    return filter;
  }, [listAreas]);

  const selectAll = (grupo) => {
    filterLinks.forEach((link) => {
      let list = formik.values.AREAS
      if(link?.grupo === grupo) {
        link.items.forEach((item) => {
          if(!formik.values.AREAS.includes(item.ARE_NOME)) {
            document.getElementById(item.ARE_NOME).click();
            list.push(item.ARE_NOME);
          }
        })
      }
      formik.values.AREAS = list
    })
  }

  return (
    <>
      <Card>
        <div className="mb-3">
          <strong>Novo Perfil de Acesso</strong>
        </div>
        <Form onSubmit={formik.handleSubmit}>
          <div className="d-flex">
            <div>
              <div className="mb-2">
                Perfil Base:
              </div>
              <div className="me-2 border-end border-white">
                <FormControl sx={{ width: 150 }} size="small">
                  <InputLabel id="role">Perfil Base</InputLabel>
                  <Select
                    labelId="role"
                    id="role"
                    value={formik.values.role}
                    label="Perfil Base"
                    name="role"
                    onChange={formik.handleChange}
                    sx={{
                      "& .Mui-disabled": {
                        background: "#D3D3D3",
                      },
                    }}
                  >
                    {listProfiles?.map((x) => (
                        <MenuItem key={x} value={x}>
                          {RoleProfile[x]}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </div>
            </div>
            <div className="col-4">
              <Form.Label>Nome do Perfil</Form.Label>
              <div className="mb-2">
                <TextField
                  fullWidth
                  label="Nome"
                  name="SPE_NOME"
                  id="SPE_NOME"
                  value={formik.values.SPE_NOME}
                  onChange={formik.handleChange}
                  size="small"
                />
                {formik.errors.SPE_NOME ? (
                  <ErrorText>{formik.errors.SPE_NOME}</ErrorText>
                ) : null}
              </div>
            </div>
          </div>
          <div>
            <div className="mt-5 mb-3">Permissões:</div>
            {formik.values.role && filterLinks.map((link) => (
              <>
              {link && 
                <CardBloco key={link?.grupo}>
                  <TopoCard>
                    <div style={{fontWeight: 500}}>
                      {link?.grupo}
                    </div>
                    <div style={{ width: 152 }}>
                      <ButtonPadrao onClick={() => {selectAll(link?.grupo)}} >
                        Marcar Todos
                      </ButtonPadrao>
                    </div>
                  </TopoCard>
                  <CheckGroup>
                    {link?.items.map((x) => (
                      <FormCheck
                        key={x.name}
                        id={x.name}
                        className="col-11"
                      >
                        <Form.Check.Input
                          onChange={formik.handleChange}
                          value={x.ARE_NOME}
                          id={x.ARE_NOME}
                          name="AREAS"
                          type={"checkbox"}
                          disabled={x.ARE_NOME === "HOME"}
                          defaultChecked={x.ARE_NOME === "HOME"}
                        />
                        <FormCheckLabel>
                          <div>{x.name}</div>
                        </FormCheckLabel>
                      </FormCheck>
                    ))}
                    {link?.grupo === "RELATÓRIOS" &&
                     <FormCheck
                        key={"aiAssistant"}
                        id={"aiAssistant"}
                        className="col-11"
                      >
                        <Form.Check.Input
                          onChange={formik.handleChange}
                          value={"AI_ASSIST"}
                          id={"AI_ASSIST"}
                          name="AREAS"
                          type={"checkbox"}
                          disabled={user?.USU_SPE?.role !== "SAEV"}
                        />
                        <FormCheckLabel>
                          <div>Assistente de IA</div>
                        </FormCheckLabel>
                      </FormCheck>
                    }
                  </CheckGroup>
                </CardBloco>
              }
              </>
            ))}
          </div>
          <ButtonGroupEnd style={{ marginTop: 93 }}>
            <div style={{ width: 160 }}>
              <ButtonWhite
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
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  formik.handleSubmit(e);
                }}
                disable={
                 !formik.values.AREAS?.length || isDisabled
                }
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
          setModalShowConfirm(false),
            modalStatus && Router.push("/perfis-de-acesso");
        }}
        text={
          modalStatus
            ? `Perfil ${formik.values.SPE_NOME} adicionado com sucesso!`
            : errorMessage || `Erro ao criar perfil`
        }
        status={modalStatus}
      />
    </>
  );
}
