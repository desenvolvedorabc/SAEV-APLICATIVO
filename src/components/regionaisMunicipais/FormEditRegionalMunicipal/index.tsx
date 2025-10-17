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
import { createRegionalMunicipal, editRegionalMunicipal } from "src/services/regionais-estaduais.service";
import ModalAviso from "src/components/modalAviso";
import { AutoCompletePagMun2 } from "src/components/AutoCompletePag/AutoCompletePagMun2";
import { useAuth } from "src/context/AuthContext";

export default function FormEditRegionalMunicipal({ regional }) {
  const [modalShowConfirm, setModalShowConfirm] = useState(false);
  const [modalShowWarning, setModalShowWarning] = useState(false);
  const [modalStatus, setModalStatus] = useState(true);
  const [errorMessage, setErrorMessage] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [state, setState] = useState(null);
  const [county, setCounty] = useState(null);
  const [listAdded, setListAdded] = useState(regional?.schools || [])
  const [listAdd, setListAdd] = useState([])
  const [listRemove, setListRemove] = useState([])
  const { user } = useAuth()

  const { data: states, isLoading: isLoadingStates } = useGetStates();

  useEffect(() => {
    if(regional && states?.length > 0){
      setState(states?.find(state => state.id === regional?.stateId))
      setCounty(regional?.county)
    }
  },[regional, states])

  const validationSchema = yup.object({
    name: yup
      .string()
      .required('Campo obrigatório'),
    stateId: yup
      .string()
      .required('Campo obrigatório'),
    countyId: yup
      .number()
      .required('Campo obrigatório'),
    // schoolsIds: yup.array().of(yup
    //   .number())
    //   .required('Campo obrigatório'),
  })

  const formik = useFormik({
    initialValues: {
      id: regional?.id,
      name: regional?.name,
      stateId: regional?.stateId,
      countyId: regional?.countyId,
      schoolsIds: regional ? regional.counties.map(county => county.ESC_ID) : [],
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      
      let newValues

      if(regional) {
        newValues = {
          ...values,
          addSchoolsIds: listAdd,
          removeSchoolsIds: listRemove
        }
      }

      setIsDisabled(true)
      let response = null;
      try{
        response = regional
          ? await editRegionalMunicipal(regional?.id, newValues)
          : await createRegionalMunicipal(values);
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

  useEffect(() => {
    if(user?.USU_SPE?.role === 'MUNICIPIO_MUNICIPAL'){
      setState(user?.state)
      formik.setFieldValue('stateId', user?.state?.id, true)
      setCounty(user?.USU_MUN)
      formik.setFieldValue('countyId', user?.USU_MUN?.MUN_ID, true)
    }
  },[user])

  function hideConfirm() {
    setModalShowConfirm(false);
    if (!errorMessage) {
      formik.resetForm();
      return true;
    }
    if (modalStatus) Router.reload();
  }

  const handleChangeState = (newValue) => {
    setListAdded([])
    formik.setFieldValue('schoolsIds', []);
    setCounty(null)
    formik.setFieldValue('countyId', null)
    setState(newValue)
    formik.setFieldValue('stateId', newValue?.id, true)
  }

  const handleChangeCounty = (newValue) => {
    setCounty(newValue)
    setListAdded([])
    formik.setFieldValue('schoolsIds', []);
    formik.setFieldValue('countyId', newValue?.MUN_ID, true)
  }

  const addItem = (item) => {
    setListAdded([...listAdded, {ESC_ID: item?.ESC_ID, ESC_NOME: item?.ESC_NOME}]);
    if(regional){
      setListAdd([...listAdd, item?.ESC_ID])
      const filter = listRemove.filter(removeItem => removeItem !== item.ESC_ID);
      setListRemove(filter);
    }

    const list = formik.values.schoolsIds
    list.push(item.ESC_ID)
    formik.setFieldValue('schoolsIds', list, true);
  }

  const removeItem = (item) => {
    const filter = listAdded.filter(addItem => addItem.ESC_ID !== item.ESC_ID);
    setListAdded(filter);
    
    if(regional){
      setListRemove([...listRemove, item?.ESC_ID])
      const filter = listAdd.filter(addItem => addItem !== item.ESC_ID);
      setListAdd(filter);
    }
    
    const filterIds = formik.values.schoolsIds.filter(addItem => addItem !== item.ESC_ID);
    formik.setFieldValue('schoolsIds', filterIds, true);
  }

  const getMunDisabled = () => {
    if(user?.USU_SPE?.role === 'MUNICIPIO_MUNICIPAL'|| regional || !state){
      return true;
    }
    return false;
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
                  disabled={regional || user?.USU_SPE?.role === 'MUNICIPIO_MUNICIPAL'}
                />
              </FormControl>
              {formik.touched.stateId && formik.errors.stateId ? (
                <ErrorText>{formik.errors.stateId}</ErrorText>
              ) : null}
            </div>
            <div>
              <AutoCompletePagMun2 county={county} changeCounty={handleChangeCounty} stateId={state?.id} disabled={getMunDisabled()} />
            </div>
          </InputGroup3>
          <div style={{ borderTop: '1px solid #D4D4D4', width:'100%', margin: '24px 0' }} />
          <div style={{ border: '1px solid #D4D4D4', padding: '0 8px 0 8px', borderRadius: '10px', display: 'flex' }}>
            <TableAdd listAdded={listAdded} addItem={addItem} county={county?.MUN_ID}/>
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
