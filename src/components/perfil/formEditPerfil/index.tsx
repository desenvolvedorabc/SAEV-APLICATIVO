import { Form } from "react-bootstrap";
import { useFormik } from 'formik';
import {ButtonPadrao} from 'src/components/buttons/buttonPadrao';
import { 
  FormCheckLabel,
  CardBloco,
  TopoCard,
  CheckGroup,
  FormCheck 
} from './styledComponents';
import { Card, ButtonGroupBetween } from 'src/shared/styledForms'
import ButtonWhite from 'src/components/buttons/buttonWhite';
import { editSubPerfil } from 'src/services/sub-perfis.service';
import ErrorText from 'src/components/ErrorText';
import ModalConfirmacao from 'src/components/modalConfirmacao';
import { useEffect, useState, useMemo } from 'react';
import Router from 'next/router'
import ModalPergunta from "src/components/modalPergunta";
import {getAllPerfis} from 'src/services/perfis.service'
import { getAllAreas } from "src/services/areas.service";
import ButtonVermelho from "src/components/buttons/buttonVermelho";
import { getAreasByPerfil } from "src/services/areas.service";
import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { ADMINLINKS } from "src/utils/menu";

type ValidationErrors = Partial<{ SPE_PER: string, SPE_NOME: string, AREAS: string }>

export default function FormEditPerfil({subPerfil}) {
  const [ModalShowConfirm, setModalShowConfirm] = useState(false)
  const [modalStatus, setModalStatus] = useState(true)
  const [modalShowQuestion, setModalShowQuestion] = useState(false)
  const [modalShowConfirmQuestion, setModalShowConfirmQuestion] = useState(false)
  const [active, setActive] = useState(subPerfil.SPE_ATIVO)
  const [listPerfis, setListPerfis] = useState([])
  const [listAreas, setListAreas] = useState([])
  const [isDisabled, setIsDisabled] = useState(false);

  const getAreasName = () => {
    let list = []
    if(subPerfil)
       subPerfil.AREAS.map(x => {
        list.push(x.ARE_NOME)
      })
    return list
  }
  const [oldAreas, setOldAreas] = useState(subPerfil.AREAS)

  const validate = values => {
    const errors: ValidationErrors = {};
    if (!values.SPE_PER) {
      errors.SPE_PER = 'Campo obrigatório';
    }
    if (!values.SPE_NOME) {
      errors.SPE_NOME = 'Campo obrigatório';
    } else if (values.SPE_NOME.length < 6) {
      errors.SPE_NOME = 'Deve ter no minimo 6 caracteres';
    }
    if (values.AREAS.length == 0 ) {
      errors.AREAS = 'Deve conter no minimo uma função';
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      SPE_NOME: subPerfil.SPE_NOME,
      SPE_PER: subPerfil.SPE_PER.PER_ID,
      AREAS: getAreasName(),
      SPE_ATIVO: subPerfil.SPE_ATIVO,
    },
    validate,
    onSubmit: async (values) => {
      let list = []
      values.AREAS.forEach((x) => {
        listAreas.forEach((area) => {
          if(x == area.ARE_NOME)
            list.push({ ARE_ID: area.ARE_ID });
        }
      )});
      values.AREAS = list;

      
      setIsDisabled(true)
      let response = null;
      try{
        response = await editSubPerfil(subPerfil.SPE_ID, values)
      }
      catch (err) {
        setIsDisabled(false)
      } finally {
        setIsDisabled(false)
      }
      if (response.status === 200 && response.data.SPE_NOME === values.SPE_NOME) {
        setModalStatus(true)
        setModalShowConfirm(true)
      }
      else {
        setModalStatus(false)
        setModalShowConfirm(true)
      }
    }
  });

  async function changePerfil() {
    setModalShowQuestion(false)
    subPerfil = {
      SPE_ID: subPerfil.SPE_ID,
      SPE_ATIVO: !subPerfil.SPE_ATIVO
    }

    const response = await editSubPerfil(subPerfil.SPE_ID, subPerfil)
    if (response.status === 200 && response.data.SPE_NOME === subPerfil.SPE_NOME) {
      setActive(subPerfil.SPE_ATIVO)
      setModalShowConfirmQuestion(true)
      setModalStatus(true);
    }
    else {
      setModalStatus(false)
      setModalShowConfirmQuestion(true)
    }
  }

  
  const loadPerfisBase = async () => {
    const resp = await getAllPerfis()
    setListPerfis(resp.data)
  }
  
  const loadAreas = async (idPerfil: string) => {
    const perfil = listPerfis.find((data) => data.PER_ID === idPerfil);

    if(perfil){
      const resp = await getAreasByPerfil(perfil.PER_NOME);
      if(resp.data.length > 0)
        setListAreas(resp.data);
    }
  }

  useEffect(() => {
    loadAreas(formik.values.SPE_PER);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.SPE_PER, listPerfis]);

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
        const options = data.items.filter((item) => {
          let verifyItem = false;

          listAreas.forEach((area) => {
            if (item.validate || area.ARE_NOME === item.ARE_NOME) {
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

  useEffect(() => {
    loadPerfisBase()
  }, [])

  const verifyCheckAreas = (ARE_NOME) => {
    const check = oldAreas.find(x => ARE_NOME === x.ARE_NOME)
    if(check)
      return true
    return false
  }

  const selectAll = (grupo) => {
    filterLinks.forEach((link) => {
      let list = formik.values.AREAS
      if(link?.grupo === grupo) {
        link?.items.forEach((item) => {
          if(!formik.values.AREAS.includes(item.ARE_NOME)) {
            document.getElementById(item.ARE_NOME).click();
            list.push(item.ARE_NOME);
          }
        })
      }
      formik.values.AREAS = list
    })

    formik.validateForm();
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
                  <InputLabel id="SPE_PER">Perfil Base</InputLabel>
                  <Select
                    labelId="SPE_PER"
                    id="SPE_PER"
                    value={formik.values.SPE_PER}
                    label="Perfil Base"
                    name="SPE_PER"
                    onChange={formik.handleChange}
                    sx={{
                      "& .Mui-disabled": {
                        background: "#D3D3D3",
                      },
                    }}
                  >
                    {listPerfis &&
                      listPerfis?.map((x) => (
                        <MenuItem key={x.PER_ID} value={x.PER_ID}>
                          {x.PER_NOME}
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
            {formik.values.SPE_PER && filterLinks.map((link) => (
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
                          name="AREAS"
                          id={x.ARE_NOME}
                          type={"checkbox"}
                          defaultChecked={verifyCheckAreas(x.ARE_NOME)}
                        />
                        <FormCheckLabel>
                          <div>{x.name}</div>
                        </FormCheckLabel>
                      </FormCheck>
                    ))}
                  </CheckGroup>
                </CardBloco>
              }
              </>
            ))}
          </div>
          <ButtonGroupBetween style={{marginTop:30}}>
            <div>
              {formik.values.SPE_ATIVO ? (
                <ButtonVermelho onClick={(e) => { e.preventDefault(); setModalShowQuestion(true) }}>
                  Desativar
                </ButtonVermelho>) : (
                <ButtonPadrao onClick={(e) => { e.preventDefault(); setModalShowQuestion(true) }}>
                  Ativar
                </ButtonPadrao>)}
            </div>
            <div className="d-flex">
              <div style={{width:160}}>
                <ButtonWhite onClick={(e) => { e.preventDefault(); formik.resetForm() }}>
                  Cancelar
                </ButtonWhite>
              </div>
              <div className="ms-3" style={{width:160}}>
                <ButtonPadrao type="submit" onClick={(e) => { e.preventDefault(); formik.handleSubmit(e) }} disable={ !formik.values.AREAS?.length || isDisabled }>
                  Salvar
                </ButtonPadrao>
              </div>
            </div>
          </ButtonGroupBetween>
        </Form>
      </Card>
      <ModalConfirmacao
        show={ModalShowConfirm}
        onHide={() => { setModalShowConfirm(false), modalStatus && Router.reload() }}
        text={modalStatus ? `Perfil ${formik.values.SPE_NOME} alterado com sucesso!` : `Erro ao alterar subPerfil`}
        status={modalStatus}
      /><ModalPergunta
        show={modalShowQuestion}
        onHide={() => setModalShowQuestion(false)}
        onConfirm={() => changePerfil()}
        buttonNo={ active ? 'Não Desativar' : 'Não Ativar'}
        buttonYes={'Sim, Tenho Certeza'}
        text={`Você está ${!active === true ? 'ativando(a)' : 'desativando(a)'} o(a) “${formik.values.SPE_NOME}”, isso tirará todos os acessos, os dados serão desconsiderados do relatório. Você pode ${active === true ? 'ativar' : 'desativar'} novamente a qualquer momento.`}
        status={!active}
        size="lg"
      />
      <ModalConfirmacao
        show={modalShowConfirmQuestion}
        onHide={() => { setModalShowConfirmQuestion(false); Router.reload() }}
        text={modalStatus ? `${formik.values.SPE_NOME} ${active === true ? 'ativado' : 'desativado'} com sucesso!` : `Erro ao ${active ? "ativar" : "desativar"}`}
        status={modalStatus}
      />
    </>
  )
}