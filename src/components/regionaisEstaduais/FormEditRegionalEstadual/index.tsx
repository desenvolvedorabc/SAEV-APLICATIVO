import * as React from "react";
import { Form } from "react-bootstrap";
import { useFormik } from "formik";
import { ButtonPadrao } from "src/components/buttons/buttonPadrao";
import { InputGroup3, ButtonGroupBetween, Card } from "src/shared/styledForms";
import ButtonWhite from "src/components/buttons/buttonWhite";
import ErrorText from "src/components/ErrorText";
import ModalConfirmacao from "src/components/modalConfirmacao";
import { useEffect, useState } from "react";
import Router from "next/router";
import {
  FormControl,
  TextField,
  Autocomplete,
} from "@mui/material";
import * as yup from 'yup'
import TableAdd from "../TableAdd";
import TableRemove from "../TableRemove";
import { useGetStates } from "src/services/estados.service";
import { createRegionalEstadual, editRegionalEstadual } from "src/services/regionais-estaduais.service";
import ModalAviso from "src/components/modalAviso";
import { useAuth } from "src/context/AuthContext";

export default function FormEditRegionalEstadual({ regional }) {
  const [modalShowConfirm, setModalShowConfirm] = useState(false);
  const [modalShowWarning, setModalShowWarning] = useState(false);
  const [modalStatus, setModalStatus] = useState(true);
  const [errorMessage, setErrorMessage] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [state, setState] = useState(null);
  const [listAdded, setListAdded] = useState(regional?.counties || [])
  const [listAdd, setListAdd] = useState([])
  const [listRemove, setListRemove] = useState([])
  const { user } = useAuth()

  const { data: states, isLoading: isLoadingStates } = useGetStates();

  useEffect(() => {
    if(regional && states?.length > 0){
      setState(states?.find(state => state.id === regional?.stateId))
    }
  },[regional, states])

  const validationSchema = yup.object({
    name: yup
      .string()
      .required('Campo obrigatório'),
    stateId: yup
      .string()
      .required('Campo obrigatório'),
    // countiesIds: yup.array().of(yup
    //   .number())
    //   .required('Campo obrigatório'),
  })

  const formik = useFormik({
    initialValues: {
      id: regional?.id,
      name: regional?.name,
      stateId: regional?.stateId,
      countiesIds: regional ? regional.counties.map(county => county.MUN_ID) : [],
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      
      let newValues

      if(regional) {
        newValues = {
          ...values,
          addCountiesIds: listAdd,
          removeCountiesIds: listRemove
        }
      }

      setIsDisabled(true)
      let response = null;
      try{
        response = regional
          ? await editRegionalEstadual(regional?.id, newValues)
          : await createRegionalEstadual(values);
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
        setErrorMessage(response.data.message || "Erro ao alterar regional");
      } else {
        setModalStatus(true);
        setModalShowConfirm(true);
      }
    },
  });

  function hideConfirm() {
    setModalShowConfirm(false);
    if (!errorMessage) {
      formik.resetForm();
      return true;
    }
    if (modalStatus) Router.reload();
  }
  
  useEffect(() => {
    if(user?.USU_SPE?.role === 'ESTADO' || user?.USU_SPE?.role === 'MUNICIPIO_ESTADUAL'){
      setState(user?.state)
      formik.setFieldValue('stateId', user?.state?.id, true)
    }
  }, [user])
  console.log('user :', user);
  console.log('states :', states);

  const handleChangeState = (newValue) => {
    setListAdded([])
    formik.setFieldValue('countiesIds', []);
    setState(newValue)
    formik.setFieldValue('stateId', newValue?.id, true)
  }

  const addItem = (item) => {
    setListAdded([...listAdded, {MUN_ID: item?.MUN_ID, MUN_NOME: item?.MUN_NOME}]);
    if(regional){
      setListAdd([...listAdd, item?.MUN_ID])
      const filter = listRemove.filter(removeItem => removeItem !== item.MUN_ID);
      setListRemove(filter);
    }

    const list = formik.values.countiesIds
    list.push(item.MUN_ID)
    formik.setFieldValue('countiesIds', list, true);
  }

  const removeItem = (item) => {
    const filter = listAdded.filter(addItem => addItem.MUN_ID !== item.MUN_ID);
    setListAdded(filter);
    
    if(regional){
      setListRemove([...listRemove, item?.MUN_ID])
      const filter = listAdd.filter(addItem => addItem !== item.MUN_ID);
      setListAdd(filter);
    }
    
    const filterIds = formik.values.countiesIds.filter(addItem => addItem !== item.MUN_ID);
    formik.setFieldValue('countiesIds', filterIds, true);
  }

  return (
    <>
      <Card>
        <div className="mb-3">
          <strong>
            {regional ? 'Editar Regional' : 'Adicionar Regional'}
          </strong>
        </div>
        <Form onSubmit={formik.handleSubmit}>
          <InputGroup3>
            <div>
              <TextField
                fullWidth
                label="Nome"
                name="name"
                id="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                size="small"
              />
              {formik.touched.name && formik.errors.name ? <ErrorText>{formik.errors.name}</ErrorText> : null}
            </div>
            <div>
              <FormControl fullWidth size="small">
                <Autocomplete
                  className=""
                  id="size-small-outlined"
                  size="small"
                  value={state}
                  noOptionsText="Estado"
                  options={states || []}
                  getOptionLabel={(option) =>  `${option?.name}`}
                  loading={isLoadingStates}
                  onChange={(_event, newValue) => {
                    handleChangeState(newValue)
                  }}
                  renderInput={(params) => <TextField size="small" {...params} label="Estado" />}
                  disabled={regional || user?.USU_SPE?.role === 'ESTADO' || user?.USU_SPE?.role === 'MUNICIPIO_ESTADUAL'}
                />
              </FormControl>
              {formik.touched.stateId && formik.errors.stateId ? (
                <ErrorText>{formik.errors.stateId}</ErrorText>
              ) : null}
            </div>
          </InputGroup3>
          <div style={{ borderTop: '1px solid #D4D4D4', width:'100%', margin: '24px 0' }} />
          <div style={{ border: '1px solid #D4D4D4', padding: '0 8px 0 8px', borderRadius: '10px', display: 'flex' }}>
            <TableAdd listAdded={listAdded} addItem={addItem} stateId={state?.id}/>
            <div style={{ borderRight: '1px solid #D4D4D4', margin: '0 16px' }}></div>
            <TableRemove listAdded={listAdded} removeItem={removeItem} />
          </div>
        </Form>
      </Card>
      <ButtonGroupBetween style={{ marginTop: 30 }}>
        <div>
        </div>
        <div className="d-flex">
          <div style={{ width: 160 }}>
            <ButtonWhite
              onClick={(e) => {
                e.preventDefault();
                setModalShowWarning(true)
              }}
            >
              {regional ? "Descartar Alterações" : "Cancelar"}
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
              {regional ? "Salvar" : "Adicionar"}
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
            ? `Regional ${formik.values.name} ${regional ? 'alterada' : 'criada'} com sucesso!`
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
