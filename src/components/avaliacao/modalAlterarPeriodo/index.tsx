import {ButtonPadrao} from "src/components/buttons/buttonPadrao";
import { useState, useEffect } from "react";
import { Button, SelectMultiple } from "./styledComponents";
import { DatePicker, LocalizationProvider } from "@mui/lab";
import { TextField } from "@mui/material";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import brLocale from 'date-fns/locale/pt-BR';
import { isValidDate } from "src/utils/validate";
import { format, isAfter } from 'date-fns';
import { Checkbox, FormControl, InputLabel, ListItemText, MenuItem, OutlinedInput, SelectChangeEvent } from "@mui/material";
import ErrorText from "src/components/ErrorText";
import { Form, Modal } from "react-bootstrap";
// import { useGetAssessments } from "src/services/avaliaoces.service";

export default function ModalAlterarPeriodo(props) {
  const [selectedList, setSelectedList] = useState([])
  const [selectedMun, setSelectedMun] = useState([]);
  const [disp, setDisp] = useState(props.disp)
  const [errorModalDisp, setErrorModalDisp] = useState(true)
  const [errorModalDispText, setErrorModalDispText] = useState("")
  const [lancInicio, setLancInicio] = useState(null)
  const [errorModalLancInicio, setErrorModalLancInicio] = useState(true)
  const [errorModalLancInicioText, setErrorModalLancInicioText] = useState("")
  const [lancFim, setLancFim] = useState(null)
  const [errorModalLancFimText, setErrorModalLancFimText] = useState("")
  const [errorModalLancFim, setErrorModalLancFim] = useState(true)
  const [initialDisp, setInitialDisp] = useState()

  // const { data: editionsList } = useGetAssessments(null, 1, 99999, null, null, null, null, null, null, null);

  const getSelectedMun = () => {
    let list = []
    props.selected.map(x => {
      list.push(x.AVM_MUN_NOME)
    })
    return list
  }

  useEffect(() => {
    if (props.selected) {
      setSelectedMun(getSelectedMun())
      setSelectedList(props.selected)

      let lastDate = props.selected[0]
      props.selected?.forEach(element => {
        if(isAfter(new Date(element?.AVM_DT_FIM), new Date(lastDate?.AVM_DT_FIM))){
          lastDate = element
        }
      });
      setInitialDisp(lastDate?.AVM_DT_DISPONIVEL)
      setDisp(lastDate?.AVM_DT_DISPONIVEL)
      setLancInicio(lastDate?.AVM_DT_INICIO)
      setLancFim(lastDate?.AVM_DT_FIM)
    }
  }, [props.selected])

  const handleChangeSelect = (event: SelectChangeEvent<typeof selectedMun>) => {
    const {
      target: { value },
    } = event;

    const aux = typeof value === 'string' ? value.split(',') : value

    setSelectedMun(aux);

    const selList = []
    aux.map((selected) => {
      props.list.map((mun) => {
        if (mun.AVM_MUN_NOME === selected) {
          selList.push(mun)
        }
      })
    })
    setSelectedList(selList)
  };

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

  const handleSubmit = () => {
    props.handlechangeperiodo(selectedList, disp, lancInicio, lancFim)
  }

  // const checkLancFim = () => {
  //   let teste = false

  //   teste = editionsList?.items?.some((item) => {
  //     console.log('item', item)
  //     return item?.AVA_AVM?.some((x) => {
  //       const inicio = new Date(x.AVM_DT_INICIO)
  //       const fim = new Date(x.AVM_DT_FIM)

  //       console.log('inicio', inicio, lancFim)
  //       console.log('fim', inicio, lancFim)
   
  //       if( inicio <= lancFim && fim >= lancFim && item.AVA_ID != props.edition?.AVA_ID && x.AVM_MUN.MUN_ID === props.county?.MUN_ID){
  //         return true
  //       }
  //       else{
  //         return false
  //       }
  //     })
  //   })
    
  //   console.log("teste", teste)
  //   console.log("errorModalDisp", errorModalDisp)
  //   console.log("errorModalLancInicio", errorModalLancInicio)
  //   console.log("errorModalLancFim", errorModalLancFim)
  //   if(teste){
  //     setErrorModalLancFimText("Já existe uma edição nessa data")
  //     setErrorModalLancFim(true)
  //   }
  //   // else{
  //   //   setErrorModalLancFim(false)
  //   // }
  // }

  // useEffect(() => {
  //   checkLancFim()
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [lancFim])

  useEffect(() => {
    if(!isValidDate(disp)){
      setErrorModalDispText("Data inválida")
      setErrorModalDisp(true)
    } else if(new Date(disp) < new Date() && disp !== initialDisp){
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
              <FormControl sx={{ m: 0, width: "100%", height: 38 }}>
                <InputLabel id="multiple-checkbox-label">Municípios</InputLabel>
                <SelectMultiple
                  labelId="multiple-checkbox-label"
                  id="multiple-checkbox"
                  multiple
                  value={selectedMun}
                  onChange={handleChangeSelect}
                  input={<OutlinedInput label="Municípios" />}
                  renderValue={(selected) => selected.join(', ')}
                  MenuProps={MenuProps}
                >
                  <MenuItem disabled value="">
                    <em>Município</em>
                  </MenuItem>
                  {props.list.map((mun) => (
                    <MenuItem key={mun.AVM_MUN_ID} value={mun.AVM_MUN_NOME}>
                      <Checkbox checked={selectedMun.indexOf(mun.AVM_MUN_NOME) > -1} />
                      <ListItemText primary={mun.AVM_MUN_NOME} />
                    </MenuItem>
                  ))}
                </SelectMultiple>
              </FormControl>
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
                      setErrorModalDispText("Data inferior à atual")
                      setErrorModalDisp(true)
                      return
                    } 
                    if(!error || value === initialDisp){
                      setErrorModalDispText("")
                      setErrorModalDisp(false)
                    }
                  }}
                  onChange={(val) => {
                    if (isValidDate(val)) { 
                        val = format(new Date(val), 'yyyy-MM-dd 23:59:59')
                        setDisp(val)
                        return 
                    }
                    setDisp("")
                    setErrorModalDispText("Data inválida")
                  }}
                  renderInput={(params) => <TextField size="small" fullWidth {...params} sx={{backgroundColor:"#FFF"}} />}
                />
              </LocalizationProvider>
              {errorModalDispText ? <ErrorText>{errorModalDispText}</ErrorText> : null}
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