import {ButtonPadrao} from "src/components/buttons/buttonPadrao";
import { useState, useEffect } from "react";
import { Button } from "./styledComponents";
import { DatePicker, LocalizationProvider } from "@mui/lab";
import { Autocomplete, TextField } from "@mui/material";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import brLocale from 'date-fns/locale/pt-BR';
import { isValidDate } from "src/utils/validate";
import { format, isAfter, isBefore } from 'date-fns';
import ErrorText from "src/components/ErrorText";
import { Form, Modal } from "react-bootstrap";

export default function ModalAlterarPeriodo(props) {
  const [selectedList, setSelectedList] = useState([])
  const [disp, setDisp] = useState(null)
  const [errorModalDisp, setErrorModalDisp] = useState(true)
  const [errorModalDispText, setErrorModalDispText] = useState("")
  const [lancInicio, setLancInicio] = useState(null)
  const [errorModalLancInicio, setErrorModalLancInicio] = useState(true)
  const [errorModalLancInicioText, setErrorModalLancInicioText] = useState("")
  const [lancFim, setLancFim] = useState(null)
  const [errorModalLancFimText, setErrorModalLancFimText] = useState("")
  const [errorModalLancFim, setErrorModalLancFim] = useState(true)
  const [initialDisp, setInitialDisp] = useState()

  useEffect(() => {
    if (props.selected) {
      setSelectedList(props.selected)

      let lastDate = props.selected[0]
      props.selected?.forEach(element => {
        if(isAfter(new Date(element?.AVM_DT_FIM), new Date(lastDate?.AVM_DT_FIM))){
          lastDate = element
        }
      });
      setInitialDisp(lastDate?.AVM_DT_DISPONIVEL)
      setDisp(lastDate?.AVM_DT_DISPONIVEL && format(new Date(lastDate?.AVM_DT_DISPONIVEL), 'yyyy-MM-dd 23:59:59'))
      setLancInicio(lastDate?.AVM_DT_INICIO)
      setLancFim(lastDate?.AVM_DT_FIM)
    }
  }, [props.selected])

  const handleChangeSelect = (newValue) => {
    setSelectedList(newValue)
  };

  const handleSubmit = () => {
    props.handlechangeperiodo(selectedList, disp, lancInicio, lancFim)
  }

  useEffect(() => {
    if(!isValidDate(disp)){
      setErrorModalDispText("Data inválida")
      setErrorModalDisp(true)
    } else if(isBefore(disp, new Date()) && disp !== initialDisp){
      setErrorModalDispText("Data inferior à atual")
      setErrorModalDisp(true)
    } else{
      setErrorModalDisp(false)
      setErrorModalDispText("")
    }
    if(!isValidDate(lancInicio)){
      setErrorModalLancInicioText("Data inválida")
      setErrorModalLancInicio(true)
    }
    else if(lancInicio < disp ){
      setErrorModalLancInicioText("Data inferior à disponibilidade")
      setErrorModalLancInicio(true)
    } else {
      setErrorModalLancInicioText("")
      setErrorModalLancInicio(false)
    }
    if(!isValidDate(lancFim)){
      setErrorModalLancFimText("Data inválida")
      setErrorModalLancFim(true)
    }
    else if(lancFim < lancInicio){
      setErrorModalLancFimText("Data inferior à Lançamento inicial")
      setErrorModalLancFim(true)
    } else {
      setErrorModalLancFimText("")
      setErrorModalLancFim(false)
    }
  }, [disp, lancInicio, lancFim, initialDisp])

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
              <Autocomplete
                multiple
                className=""
                id="size-small-outlined"
                size="small"
                value={selectedList}
                noOptionsText="Municípios"
                options={props.list || []}
                getOptionLabel={(option) => `${option.AVM_MUN_NOME}`}
                onChange={(_event, newValue) => {
                  handleChangeSelect(newValue);
                }}
                renderInput={(params) => (
                  <TextField size="small" {...params} label="Municípios" />
                )}
              />
            </div>
            <div className="mb-2 col-12">
              <LocalizationProvider dateAdapter={AdapterDateFns} locale={brLocale}>
                <DatePicker
                  openTo="year"
                  views={['year', 'month', 'day']}
                  label="Disponivel Em:"
                  value={disp}
                  minDate={new Date()}
                  onError={(error, value) => { 
                    if(error === "invalidDate" && value !== initialDisp) {
                      setErrorModalDispText("Data inválida")
                      setErrorModalDisp(true)
                      return
                    }
                    if(error === "minDate" && value !== initialDisp){
                    console.log('initialDisp :', initialDisp);
                    console.log('value :', value);
                      setErrorModalDispText("Data inferior à atual")
                      setErrorModalDisp(true)
                      return
                    } 
                    if(!error || value === initialDisp){
                      console.log('dawdad')
                      setErrorModalDispText("")
                      setErrorModalDisp(false)
                    }
                  }}
                  onChange={(val) => {
                    if (isValidDate(val)) { 
                        let value = format(new Date(val), 'yyyy-MM-dd 23:59:59')
                        setDisp(value)
                        return 
                    }
                    setDisp("")
                    setErrorModalDispText("Data inválida")
                  }}
                  renderInput={(params) => <TextField size="small" fullWidth {...params} sx={{backgroundColor:"#FFF"}} />}
                />
              </LocalizationProvider>
              {errorModalDispText ? <ErrorText>{errorModalDispText}</ErrorText> : null}
              {console.log('errorModalDispText :', errorModalDispText)}
            </div>
            <div className="mb-2 col-12">
              <LocalizationProvider dateAdapter={AdapterDateFns} locale={brLocale}>
                <DatePicker
                  openTo="year"
                  views={['year', 'month', 'day']}
                  label="Lançamento Início:"
                  value={lancInicio}
                  minDate={new Date(props.disp)}
                  onError={(error) => { 
                  console.log('error :', error);
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
                  console.log('error :', error);
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
            <div className="my-3">
              <ButtonPadrao type="button" onClick={() => { handleSubmit(); props.onHide() }} disable={disp == "1969-12-31 23:59:59" ||
              !isValidDate(disp) ||
              lancInicio == "1969-12-31 23:59:59" ||
              !isValidDate(lancInicio) ||
              lancFim == "1969-12-31 23:59:59" ||
              !isValidDate(lancFim) || 
              errorModalDisp ||
              errorModalLancInicio ||
              errorModalLancFim }>
                Alterar Período de Lançamento
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
    </>
  );
}