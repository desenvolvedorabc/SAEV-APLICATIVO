import { Form } from "react-bootstrap";
import { useFormik } from 'formik';
import {ButtonPadrao} from 'src/components/buttons/buttonPadrao';
import { ButtonGroup, Card, ButtonArea } from './styledComponents';
import ButtonWhite from 'src/components/buttons/buttonWhite';
import ErrorText from 'src/components/ErrorText';
import ModalConfirmacao from 'src/components/modalConfirmacao';
import ModalAviso from 'src/components/modalAviso';
import { useEffect, useState } from 'react';
import Router from 'next/router'
import ModalPergunta from "src/components/modalPergunta";
import ButtonVermelho from "src/components/buttons/buttonVermelho";
import {Autocomplete, TextField} from '@mui/material';

import TestePage from "../testePage";
import MunPage from "../munPage";
import { createAssessment, editAssessment } from "src/services/avaliaoces.service";
import ModalDuplicate from "../modalDuplicate";
import { useGetYears } from "src/services/anos.service";

type ValidationErrors = Partial<{ AVA_NOME: string, AVA_AVM: string, AVA_TES: string, AVA_ANO: string }>

export default function FormEditAvaliacao({ avaliacao }) {
  const [ModalShowConfirm, setModalShowConfirm] = useState(false)
  const [modalStatus, setModalStatus] = useState(true)
  const [modalShowDuplicate, setModalShowDuplicate] = useState(false)
  const [modalShowQuestion, setModalShowQuestion] = useState(false)
  const [modalShowConfirmQuestion, setModalShowConfirmQuestion] = useState(false)
  const [modalShowWarning, setModalShowWarning] = useState(false)
  const [active, setActive] = useState(false)
  const [errorMessage, setErrorMessage] = useState(true)
  const [areaActive, setAreaActive] = useState(true)
  const [idResp, setIdResp] = useState("")
  const [selectedYear, setSelectedYear] = useState(null)
  const [isDisabled, setIsDisabled] = useState(false);

  const [listTestesAdd, setListTestesAdd] = useState([])
  const [listMunAdd, setListMunAdd] = useState([])

  const { data: dataYears } = useGetYears(null, 1, 999999, null, 'DESC', true);

  useEffect(() => {
      let find = dataYears?.items?.find(x =>  x.ANO_NOME == avaliacao.AVA_ANO);

      if(find) {
        setSelectedYear(find);
      }
  }, [avaliacao.AVA_ANO, dataYears] )

  const validate = values => {
    const errors: ValidationErrors = {};
    if (!values.AVA_NOME) {
      errors.AVA_NOME = 'Campo obrigatório';
    } else if (values.AVA_NOME.length < 6) {
      errors.AVA_NOME = 'Deve ter no minimo 6 caracteres';
    }
    if (!values.AVA_TES) {
      errors.AVA_TES = 'Campo obrigatório';
    }
    if (!values.AVA_ANO) {
      errors.AVA_ANO = 'Campo obrigatório';
    }
    if (!values.AVA_AVM) {
      errors.AVA_AVM = 'Campo obrigatório';
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      AVA_NOME: avaliacao.AVA_NOME,
      AVA_ANO: avaliacao.AVA_ANO,
      AVA_AVM: avaliacao.AVA_AVM,
      AVA_TES: avaliacao.AVA_TES,
      AVA_ATIVO: avaliacao.AVA_ATIVO,
    },
    validate,
    onSubmit: async (values) => {
      setIsDisabled(true)

      values.AVA_ATIVO = avaliacao.AVA_ID ? avaliacao.AVA_ATIVO : true
      
      let response
    
      try{
        response = avaliacao.AVA_ID ? await editAssessment(avaliacao.AVA_ID, values) : await createAssessment(values)
      }
      catch (err) {
        setIsDisabled(false)
      } finally {
        setIsDisabled(false)
      }
      
      if (response.status === 200 && response.data.AVA_NOME === values.AVA_NOME) {
        setIdResp(response.data.AVA_ID)
        setModalStatus(true)
        setModalShowConfirm(true)
      }
      else {
        setErrorMessage(response.data.message || 'Erro ao criar/atualizar avaliação')
        setModalStatus(false)
        setModalShowConfirm(true)
      }
    }
  });

  async function changeAvaliacao() {
    setModalShowQuestion(false)
    avaliacao = {
      AVA_ID: avaliacao.AVA_ID,
      AVA_ATIVO: !formik.values.AVA_ATIVO
    }

    setIsDisabled(true)
    let response = null;
    try{
      response = await editAssessment(avaliacao.AVA_ID, avaliacao)
    }
    catch (err) {
      setIsDisabled(false)
    } finally {
      setIsDisabled(false)
    }

    if (response.status === 200 && response.data.AVA_NOME === avaliacao.AVA_NOME) {
      setActive(avaliacao.AVA_ATIVO)
      setModalShowConfirmQuestion(true)
      setModalStatus(true)
      formik.values.AVA_ATIVO = avaliacao.AVA_ATIVO

    }
    else {
      setModalStatus(false)
      setModalShowConfirmQuestion(true)
    }
  }

  const changeListAdd = (list) => {
    setListTestesAdd(list)
    formik.values.AVA_TES = list
    formik.setTouched({ ...formik.touched, ['AVA_TES']: true });
    formik.handleChange
  }

  const changeListMunAdd = (list) => {
    setListMunAdd(list)
    formik.values.AVA_AVM = list
    formik.setTouched({ ...formik.touched, ['AVA_AVM']: true });
    formik.handleChange
  }

  function onKeyDown(keyEvent) {
    if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
      keyEvent.preventDefault();
    }
  }

  useEffect(() => {
    if (formik.values.AVA_TES) {
      let list = []
      formik.values.AVA_TES.map(x => {
        list.push({
          id: x.TES_ID,
          TES_ID: x.TES_ID,
          TES_NOME: x.TES_NOME,
          TES_DIS: x.TES_DIS?.DIS_NOME,
          TES_ANO: x.TES_ANO,
        })
      })
      changeListAdd(list)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (formik.values.AVA_AVM) {
      let list = []
      formik.values.AVA_AVM.map(x => {
        list.push({
          id: x.AVM_MUN?.MUN_ID,
          AVM_MUN_ID: x.AVM_MUN?.MUN_ID,
          AVM_MUN_NOME: x.AVM_MUN?.MUN_NOME,
          AVM_DT_INICIO: x.AVM_DT_INICIO,
          AVM_DT_FIM: x.AVM_DT_FIM,
          AVM_DT_DISPONIVEL: x.AVM_DT_DISPONIVEL,
          AVM_ATIVO: x.AVM_ATIVO
        })
      })
      changeListMunAdd(list)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangeYear = (newValue) => {
    setSelectedYear(newValue);
    formik.setFieldValue('AVA_ANO', newValue?.ANO_NOME, true);
  }

  return (
    <>
      <Form onSubmit={(e) => { e.preventDefault(); }} onKeyDown={onKeyDown}>
        <Card>
          <div className="d-flex">
            <div className="" style={{ width: 226, marginRight: 20}} >
              
            <Autocomplete
                style={{background: "#FFF"}}
                className=""
                id="ano"
                size="small"
                value={selectedYear}
                noOptionsText="Ano"
                options={dataYears?.items ? dataYears?.items : []}
                getOptionLabel={(option) =>  `${option?.ANO_NOME}`}

                onChange={(_event, newValue) => {
                  handleChangeYear(newValue)
                }}
                renderInput={(params) => <TextField size="small" {...params} label="Ano" />}
              />
              {/* <Form.Select name="AVA_ANO" value={formik.values.AVA_ANO} onChange={formik.handleChange}>
                <option value="">Ano</option>
                {dataYears?.items?.map((item) => (
                  <option key={item.ANO_ID} value={item.ANO_NOME}>{item.ANO_NOME}</option>
                ))}
              </Form.Select> */}
              {formik.errors.AVA_ANO ? <ErrorText>{formik.errors.AVA_ANO}</ErrorText> : null}
            </div>
            <div className="" style={{ width: 226}}>
              <TextField
                fullWidth
                label="Nome"
                name="AVA_NOME"
                id="AVA_NOME"
                value={formik.values.AVA_NOME}
                onChange={formik.handleChange}
                size="small"
              />
              {formik.errors.AVA_NOME ? <ErrorText>{formik.errors.AVA_NOME}</ErrorText> : null}
            </div>
          </div>
          {avaliacao.AVA_ID === true ? null : 
            <div className="" style={{width:120}}>
              <ButtonWhite onClick={() => {setModalShowDuplicate(true)}}>
                Duplicar
              </ButtonWhite>
            </div>
          }
        </Card>
        <div>
          <div className="d-flex">
            <ButtonArea type="button" onClick={() => { setAreaActive(true) }} active={areaActive} className="me-2">
              Testes
            </ButtonArea>
            <ButtonArea type="button" onClick={() => { setAreaActive(false) }} active={!areaActive}>
              Municípios
            </ButtonArea>
          </div>
          {areaActive ?
            <TestePage listTestesAdd={listTestesAdd} changeListAdd={changeListAdd} listSelected={formik.values.AVA_TES} />
            :
            <MunPage changeListMunAdd={changeListMunAdd} listMunAdd={listMunAdd} listSelected={formik.values.AVA_AVM}/>
          }
        </div>
        <ButtonGroup >
          <div>
            {formik.values.AVA_ATIVO && avaliacao.AVA_ID ? (
              <ButtonVermelho onClick={(e) => { e.preventDefault(); setModalShowQuestion(true) }}>
                Desativar
              </ButtonVermelho>) : null}

            {!formik.values.AVA_ATIVO && avaliacao.AVA_ID ? (
              <ButtonPadrao onClick={(e) => { e.preventDefault(); setModalShowQuestion(true) }}>
                Ativar
              </ButtonPadrao>) : null}
          </div>
          <div className="d-flex">
            <div style={{width:160}}>
              <ButtonWhite onClick={() => { setModalShowWarning(true) }}>
                Cancelar
              </ButtonWhite>
            </div>
            <div className="ms-3" style={{width:160}}>
              <ButtonPadrao type="submit" onClick={(e) => { e.preventDefault(); formik.handleSubmit(e) }} disable={!(formik.isValid) || isDisabled}>
                Salvar
              </ButtonPadrao>
            </div>
          </div>
        </ButtonGroup>
      </Form>
      <ModalConfirmacao
        show={ModalShowConfirm}
        onHide={() => { setModalShowConfirm(false); modalStatus && Router.push('/edicoes')  }}
        text={modalStatus ? `Edição "${formik.values.AVA_NOME}" ${avaliacao.AVA_ID === true ? 'adicionado' : 'alterado'} com sucesso!` : errorMessage}
        status={modalStatus}
      />
      <ModalPergunta
        show={modalShowQuestion}
        onHide={() => setModalShowQuestion(false)}
        onConfirm={() => changeAvaliacao()}
        buttonNo={!active ? 'Não Desativar': 'Não Ativar'}
        buttonYes={'Sim, Tenho Certeza'}
        text={`Você está ${!active === true ? 'ativando(a)' : 'desativando(a)'} o(a) “${formik.values.AVA_NOME}”, isso tirará todos os acessos, os dados serão desconsiderados do relatório. Você pode ${active === true ? 'ativar' : 'desativar'} novamente a qualquer momento.`}
        status={active}
        size="lg"
      />
      <ModalConfirmacao
        show={modalShowConfirmQuestion}
        onHide={() => { setModalShowConfirmQuestion(false) }}
        text={modalStatus ? `${formik.values.AVA_NOME} ${active === true ? 'ativado' : 'desativado'} com sucesso!` : `Erro ao ${active ? "ativar" : "desativar"}`}
        status={modalStatus}
      />
      <ModalAviso
        show={modalShowWarning}
        onHide={() => setModalShowWarning(false)}
        onConfirm={() => { Router.push('/edicoes') }}
        buttonYes={'Sim, Descartar Informações'}
        buttonNo={'Não Descartar Informações'}
        text={`Ao confirmar essa opção todas as informações serão perdidas.`}
      />
      <ModalDuplicate
        show={modalShowDuplicate}
        onHide={() => { setModalShowDuplicate(false) }}
        avaliacao={avaliacao}
      />
    </>
  )
}