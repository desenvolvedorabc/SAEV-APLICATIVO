import {ButtonPadrao} from
 "src/components/buttons/buttonPadrao";
import { Form, Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Button, TextBold, Text } from "./styledComponents";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import ErrorText from "src/components/ErrorText";
import { getSchoolClassSerie } from "src/services/turmas.service";
import { getAllSeries } from "src/services/referencias.service";
import { useFormik } from "formik";
import * as yup from "yup";
import { createGroup } from "src/services/enturmacao.service"
import ModalConfirmacao from "src/components/modalConfirmacao";

export function ModalEnturmar(props) {
  const [modalShowConfirm, setModalShowConfirm] = useState(false);
  const [modalStatus, setModalStatus] = useState(null);
  const [serieList, setSerieList] = useState([]);
  const [schoolClassList, setSchoolClassList] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false)
  const [errorMessage, setErrorMessage] = useState(true)


  const validationSchema = yup.object({
    ALU_SER: yup.string().required("Campo obrigatório"),
    ALU_TUR: yup.string().required("Campo obrigatório"),
  });

  const formik = useFormik({
    initialValues: {
      students: [],
      ALU_ESC: "",
      ALU_SER: "",
      ALU_TUR: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      values.ALU_ESC = props.school.ESC_ID;
      let students = []
      props.listSelected.forEach(x => students.push(x.ALU_ID))
      
      values.students = students
      
      setIsDisabled(true)
      let response = null;
      try{
        response = await createGroup(values);
      }
      catch (err) {
        setIsDisabled(false)
      } finally {
        setIsDisabled(false)
      }

      if ( !response?.data?.status ) {
        setModalStatus(true);
        setModalShowConfirm(true);
      } else {
        setModalStatus(false);
        setModalShowConfirm(true);
        setErrorMessage(response.data?.message?.text || "Erro ao enturmar aluno");
      }
    },
  });

  async function loadSerie(){
    const resp = await getAllSeries()
    setSerieList(resp.data)
  }

  async function loadSchoolClass(idSchool){
    const resp = await getSchoolClassSerie(idSchool, formik.values.ALU_SER, null, '1')

    let list = []
    if(resp.data.length > 0){
      list = resp.data.sort((a,b) => b.TUR_ANO - a.TUR_ANO)
    }
    setSchoolClassList(list)
  }

  useEffect(() => {
    loadSerie()
  }, [])
  
  useEffect(() => {
    formik.values.ALU_SER ? loadSchoolClass(props.school?.ESC_ID) : setSchoolClassList([])
  }, [formik.values.ALU_SER])

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
        top: 205
      },
    },
  };

  useEffect(() => {
    resetForm();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[props.reset]);

  const resetForm = () => {  
    formik.setFieldValue("students", [])
    formik.setFieldValue("ALU_ESC", "")
    formik.setFieldValue("ALU_SER", "")
    formik.setFieldValue("ALU_TUR", "")
    formik.resetForm()
  }
  return (
    <>
      <Modal {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {props.listSelected.length > 1 ? "Enturmar Vários Alunos" : "Enturmar" }
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex flex-column">
          <Form className="d-flex flex-column mt-3 col-12 px-5 pb-4 pt-2 justify-content-center">
            <TextBold className="mb-3">
              {props.listSelected.length > 1 ? 
                  `${props.listSelected.length} alunos selecionados.` 
                  : 
                  `Aluno(a): ${props.listSelected[0]?.ALU_NOME}`
              }
            </TextBold>
            <Text>
              Selecione a série e turma que deseja enturmar os alunos selecionados:
            </Text>
            <FormControl className="mb-3 mt-3" fullWidth size="small">
              <InputLabel id="serie">Série</InputLabel>
              <Select
                labelId="serie"
                id="serie"
                name="ALU_SER"
                value={formik.values.ALU_SER}
                label="Série"
                onChange={(e) => {formik.handleChange(e);}}
              >
                <MenuItem value={null}>
                  <em>Série</em>
                </MenuItem>
                {serieList?.map((x) => (
                  <MenuItem key={x.SER_ID} value={x.SER_ID}>
                    {x.SER_NOME}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {formik.touched.ALU_SER && formik.errors.ALU_SER ? (
              <ErrorText>{formik.errors.ALU_SER}</ErrorText>
            ) : null}
            <FormControl className="mb-4" fullWidth size="small">
              <InputLabel id="ALU_TUR">Turma</InputLabel>
              <Select
                labelId="ALU_TUR"
                id="ALU_TUR"
                name="ALU_TUR"
                value={formik.values.ALU_TUR}
                label="Turma"
                onChange={(e) => {formik.handleChange(e);}}
              >
                <MenuItem value={null}>
                  <em>Turma</em>
                </MenuItem>
                {schoolClassList?.map((x) => (
                  <MenuItem key={x.TUR_ID} value={x.TUR_ID}>
                    {x.TUR_ANO} - {x.TUR_NOME}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {formik.touched.ALU_TUR && formik.errors.ALU_TUR ? (
                  <ErrorText>{formik.errors.ALU_TUR}</ErrorText>
                ) : null}
            <div className="my-3">
              <ButtonPadrao type="button" disable={isDisabled} onClick={() => { formik.handleSubmit() }}>
                Enturmar
              </ButtonPadrao>
            </div>
            <div className="d-flex justify-content-center">
              <Button type="button" onClick={props.onHide}>
                Cancelar
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
      <ModalConfirmacao
        show={modalShowConfirm}
        onHide={() => { setModalShowConfirm(false); modalStatus && props.changeReload() }}
        text={modalStatus ? `Alunos enturmados com sucesso.` : errorMessage}
        status={modalStatus}
      />
    </>
  );
}