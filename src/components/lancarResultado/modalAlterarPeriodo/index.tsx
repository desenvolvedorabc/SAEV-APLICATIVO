import {ButtonPadrao} from
 "src/components/buttons/buttonPadrao";
import { Form, Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Button } from "./styledComponents";
import { DatePicker, LocalizationProvider } from "@mui/lab";
import { TextField } from "@mui/material";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import brLocale from 'date-fns/locale/pt-BR';
import { isValidDate } from "src/utils/validate";
import { format } from 'date-fns';
import ErrorText from "src/components/ErrorText";
import { prorrogationAssessment } from "src/services/avaliaoces.service";
import ModalConfirmacao from "src/components/modalConfirmacao";

export default function ModalAlterarPeriodo(props) {
  const [lancFim, setLancFim] = useState(props.fim)
  const [errorModalLancFimText, setErrorModalLancFimText] = useState("")
  const [errorModalLancFim, setErrorModalLancFim] = useState(true)
  const [modalStatus, setModalStatus] = useState(false)
  const [modalShowConfirm, setModalShowConfirm] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  // const { data: editionsList } = useGetAssessments(null, 1, 99999, null, null, null, null, null, null, null);

  const handleSubmit = async () => {
    const data = {
      idsCounties: [props.county?.MUN_ID],
      newDate: new Date(lancFim)
    }

    try {
      const resp = await prorrogationAssessment(props.edition?.AVA_ID, data)

      setModalStatus(true)
      setModalShowConfirm(true)
      props.handlechangeperiodo(lancFim)

    } catch(err) {
      setErrorMessage(err?.response?.data?.message || 'Erro ao prorrogar lançamento')
      setModalStatus(false)
      setModalShowConfirm(true)
    }

  }

  // const checkLancFim = () => {
  //   const lanc = new Date(lancFim)

  //   let teste = false
  //   const inicioAlterando = new Date(props.inicio)
    
  //   if(inicioAlterando > lanc ){
  //     setErrorModalLancFimText("Data inferior ao inicio")
  //     setErrorModalLancFim(true)
  //     return
  //   }

  //   teste = editionsList?.items?.some((item) => {
  //     return item?.AVA_AVM?.some((x) => {
  //       const inicio = new Date(x.AVM_DT_INICIO)
  //       const fim = new Date(x.AVM_DT_FIM)
   
  //       if( inicio <= lanc && fim >= lanc && item.AVA_ID != props.edition?.AVA_ID && x.AVM_MUN.MUN_ID === props.county?.MUN_ID){
  //         return true
  //       }
  //       else{
  //         return false
  //       }
  //     })
  //   })
    
  //   if(teste){
  //     setErrorModalLancFimText("Já existe uma edição nessa data")
  //     setErrorModalLancFim(true)
  //   }
  //   else{
  //     setErrorModalLancFim(false)
  //   }
  // }

  // useEffect(() => {
  //   checkLancFim()
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [lancFim])

  return (
    <>
      <Modal {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered>
        <Modal.Header closeButton>
          <Modal.Title>Alterar Período de Lançamento</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex flex-column align-items-center mt-3">
          <Form className="d-flex flex-column mt-3 col-12 px-5 pb-4 pt-2 justify-content-center align-items-center">
            <div className="mb-2 col-12" >
            <TextField
              fullWidth
              label="Selecione o Município"
              name="Mun"
              id="Mun"
              value={props.county.MUN_NOME}
              size="small"
              disabled={true}
            />
            </div>
            <div className="mb-2 col-12">
              <LocalizationProvider dateAdapter={AdapterDateFns} locale={brLocale}>
                <DatePicker
                  openTo="year"
                  views={['year', 'month', 'day']}
                  label="Lançamento Início:"
                  value={props.inicio}
                  disabled={true}
                  onChange={(e) => {e.preventDefault();}}
                  renderInput={(params) => <TextField size="small" fullWidth {...params} sx={{backgroundColor:"#FFF"}} />}
                />
              </LocalizationProvider>
            </div>
            <div className="mb-2 col-12">
              <LocalizationProvider dateAdapter={AdapterDateFns} locale={brLocale}>
                <DatePicker
                  openTo="year"
                  views={['year', 'month', 'day']}
                  label="Lançamento Fim:"
                  value={lancFim}
                  minDate={new Date()}
                  onError={(error) => { 
                    if(error === "invalidDate"){
                      setErrorModalLancFimText("Data inválida")
                      setErrorModalLancFim(true)
                      return
                    }
                    if(error === "minDate"){
                      setErrorModalLancFimText("Data inferior à data atual")
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
                      setErrorModalLancFim(false)
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
            <div className="my-3">
              <ButtonPadrao type="button" onClick={() => { handleSubmit(); props.onHide() }} disable={errorModalLancFim}>
                Alterar Período de Lançamento
              </ButtonPadrao>
            </div>
            <div className="d-flex justify-content-center">
              <Button onClick={(e) => {e.preventDefault(); props.onHide()}}>
                Cancelar
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
      <ModalConfirmacao
        show={modalShowConfirm}
        onHide={() => {
          setModalShowConfirm(false); modalStatus && setModalShowConfirm(false);
        }}
        text={
          modalStatus
            ? `"Período prorrogado com sucesso."`
            : errorMessage
        }
        status={modalStatus}
      />
    </>
  );
}