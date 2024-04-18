import {ButtonPadrao} from
 "src/components/buttons/buttonPadrao";
import { Form, Modal } from "react-bootstrap";
import { useState } from "react";
import { Button } from "./styledComponents";
import { DatePicker, LocalizationProvider } from "@mui/lab";
import { TextField } from "@mui/material";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import brLocale from 'date-fns/locale/pt-BR';
import { isValidDate } from "src/utils/validate";
import { format } from 'date-fns';
import { useFormik } from 'formik';
import ErrorText from "src/components/ErrorText";
import { createAssessment } from "src/services/avaliaoces.service";
import ModalConfirmacao from 'src/components/modalConfirmacao';
import Router from "next/router";

type ValidationErrors = Partial<{ AVA_NOME: string, AVA_AVM: string, AVA_TES: string, AVA_ANO: string }>

export default function ModalDuplicate(props) {
  const [disp, setDisp] = useState(null)
  const [errorDisp, setErrorDisp] = useState(true)
  const [errorDispText, setErrorDispText] = useState("")
  const [lancInicio, setLancInicio] = useState(null)
  const [errorModalLancInicio, setErrorModalLancInicio] = useState(true)
  const [errorModalLancInicioText, setErrorModalLancInicioText] = useState("")
  const [lancFim, setLancFim] = useState(null)
  const [errorModalLancFimText, setErrorModalLancFimText] = useState("")
  const [errorModalLancFim, setErrorModalLancFim] = useState(true)
  const [ModalShowConfirm, setModalShowConfirm] = useState(false)
  const [modalStatus, setModalStatus] = useState(true)
  const [errorMessage, setErrorMessage] = useState(true)
  const [respId, setRespId] = useState("")

  const validate = values => {
    const errors: ValidationErrors = {};
    if (!values.AVA_NOME) {
      errors.AVA_NOME = 'Campo obrigatório';
    } else if (values.AVA_NOME.length < 6) {
      errors.AVA_NOME = 'Deve ter no minimo 6 caracteres';
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      AVA_NOME: "",
      AVA_ANO: props.avaliacao.AVA_ANO,
      AVA_AVM: [],
      AVA_TES: props.avaliacao.AVA_TES,
      AVA_ATIVO: true,
    },
    validate,
    onSubmit: async (values) => {

      props.avaliacao.AVA_AVM.map(x => {
        values.AVA_AVM.push({
          AVM_DT_DISPONIVEL: disp,
          AVM_DT_FIM: lancFim,
          AVM_DT_INICIO: lancInicio,
          AVM_MUN_ID: x.AVM_MUN.MUN_ID,
        })
      })

      const response = await createAssessment(values)
      if (response.status === 200 && response.data.AVA_NOME === values.AVA_NOME) {
        setRespId(response.data.AVA_ID)
        setModalStatus(true)
        setModalShowConfirm(true)
      }
      else {
        setErrorMessage(response.data.message || 'Erro ao duplicar edição')
        setModalStatus(false)
        setModalShowConfirm(true)
      }
    }
  })

  return (
    <>
      <Modal {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered>
        <Modal.Header closeButton>
          <Modal.Title>Duplicar Avaliação</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex flex-column align-items-center mt-3">
          <Form className="d-flex flex-column mt-3 col-12 px-5 pb-4 pt-2 justify-content-center align-items-center">
            <div className="mb-3 col-12">
              <TextField
                fullWidth
                label="Título da Nova Avaliação"
                name="AVA_NOME"
                id="AVA_NOME"
                value={formik.values.AVA_NOME}
                onChange={formik.handleChange}
                size="small"
              />
              {formik.errors.AVA_NOME ? <ErrorText>{formik.errors.AVA_NOME}</ErrorText> : null}
            </div>
            <div className="mb-2 col-12">
              <LocalizationProvider dateAdapter={AdapterDateFns} locale={brLocale}>
                <DatePicker
                  openTo="year"
                  views={['year', 'month', 'day']}
                  label="Disponível Em:"
                  value={disp}
                  minDate={new Date()}
                  onError={(error) => { 
                    if(error === "invalidDate"){
                      setErrorDispText("Data inválida")
                      setErrorDisp(true)
                      return
                    }
                    if(error === "minDate"){
                      setErrorDispText("Data inferior à atual")
                      setErrorDisp(true)
                      return
                    } 
                    if(!error){
                      setErrorDispText("")
                      setErrorDisp(false)
                    }
                  }}
                  onChange={(val) => {
                    if (isValidDate(val)) { 
                        val = format(new Date(val), 'yyyy-MM-dd 23:59:59')
                        setDisp(val)
                        return 
                    }
                    setDisp("")
                  }}
                  renderInput={(params) => <TextField size="small" {...params} fullWidth sx={{backgroundColor:"#FFF"}} />}
                />
              </LocalizationProvider>
              {errorDispText ? <ErrorText>{errorDispText}</ErrorText> : null}
            </div>
            <div className="mb-2 col-12">
              <LocalizationProvider dateAdapter={AdapterDateFns} locale={brLocale}>
                <DatePicker
                  openTo="year"
                  views={['year', 'month', 'day']}
                  label="Lançamento Início:"
                  value={lancInicio}
                  minDate={new Date(disp)}
                  onError={(error) => { 
                    if(error === "invalidDate"){
                      setErrorModalLancInicioText("Data inválida")
                      setErrorModalLancInicio(true)
                      return
                    }
                    if(error === "minDate"){
                      setErrorModalLancInicioText("Data inferior à disponibilidade")
                      setErrorModalLancInicio(true)
                      return
                    } 
                    if(!error){
                      setErrorModalLancInicioText("")
                      setErrorModalLancInicio(false)
                    }
                  }}
                  onChange={(val) => {
                    if (isValidDate(val)) { 
                        val = format(new Date(val), 'yyyy-MM-dd 23:59:59')
                        setLancInicio(val)
                        return 
                    }
                    setLancInicio("")
                    setErrorModalLancInicioText("Data inválida")
                  }}
                  renderInput={(params) => <TextField size="small" fullWidth {...params} sx={{backgroundColor:"#FFF"}} />}
                />
              </LocalizationProvider>
              {errorModalLancInicioText ? <ErrorText>{errorModalLancInicioText}</ErrorText> : null}
            </div>
            <div className="mb-2 col-12">
              <LocalizationProvider dateAdapter={AdapterDateFns} locale={brLocale}>
                <DatePicker
                  openTo="year"
                  views={['year', 'month', 'day']}
                  label="Lançamento Fim:"
                  value={lancFim}
                  minDate={new Date(lancInicio)}
                  onError={(error) => { 
                    if(error === "invalidDate"){
                      setErrorModalLancFimText("Data inválida")
                      setErrorModalLancFim(true)
                      return
                    }
                    if(error === "minDate"){
                      setErrorModalLancFimText("Data inferior à Lançamento inicial")
                      setErrorModalLancFim(true)
                      return
                    } 
                    if(!error){
                      setErrorModalLancFimText("")
                      setErrorModalLancFim(false)
                    }
                  }}
                  onChange={(val) => {
                    if (isValidDate(val)) {
                      val = format(new Date(val), 'yyyy-MM-dd 23:59:59')
                      setLancFim(val) 
                      return
                    }
                    setLancFim("")
                    setErrorModalLancFimText("Data inválida")
                  }}
                  renderInput={(params) => <TextField size="small" fullWidth {...params} sx={{backgroundColor:"#FFF"}} />}
                />
              </LocalizationProvider>
              {errorModalLancFimText ? <ErrorText>{errorModalLancFimText}</ErrorText> : null}
            </div>
            <div className="my-3" style={{width:160}}>
              <ButtonPadrao type="button" onClick={formik.handleSubmit} disable={
                lancInicio == "1969-12-31 23:59:59" ||
                 !isValidDate(lancInicio)  ||
                lancFim == "1969-12-31 23:59:59" ||
                !isValidDate(lancFim) || 
                disp == "1969-12-31 23:59:59" ||
                !isValidDate(disp)  ||
                errorModalLancInicio ||
                errorModalLancFim||
                errorDisp ||
                !(formik.isValid)
              }>
                Duplicar
              </ButtonPadrao>
            </div>
            <div className="d-flex justify-content-center">
              <Button onClick={props.onHide}>
                Cancelar
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
      <ModalConfirmacao
        show={ModalShowConfirm}
        onHide={() => { setModalShowConfirm(false); props.onHide(); Router.push(`/edicao/editar/${respId}`)}}
        text={modalStatus ? `Edição "${formik.values.AVA_NOME}" duplicado com sucesso!` : errorMessage}
        status={modalStatus}
      />
    </>
  );
}