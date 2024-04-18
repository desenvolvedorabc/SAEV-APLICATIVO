import { Autocomplete, TextField } from "@mui/material"
import { useState } from "react"
import { BoxFilter, BoxSelect } from "./styledComponents"
import { AutoCompletePagMun } from "src/components/AutoCompletePag/AutoCompletePagMun";
import { useGetYears } from "src/services/anos.service";
import { useGetAssessmentsRelease } from "src/services/avaliaoces.service";
import ButtonWhite from "src/components/buttons/buttonWhite";
import ModalConfirmacao from "src/components/modalConfirmacao";
import { getExportEvaluation, getExportInfrequency, getExportStudents } from "src/services/exportar.service";

enum ExportFormat {
  ponto_virgula = "Ponto e Vírgula",
  tabulacao = "Tabulação",
  virgula = "Vírgula",
  pipe = "Pipe",
}

export function Export(){
  const [type, setType] = useState("")
  const [city, setCity] = useState(null)
  const [year, setYear] = useState(null)
  const [edition, setEdition] = useState(null)
  const [format, setFormat] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalStatus, setModalStatus] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [isDisabled, setIsDisabled] = useState(false)

  const { data: dataYear, isLoading: isLoadingYear } = useGetYears(null, 1, 999999, null, 'DESC', true);

  const { data: editionsList, isLoading: isLoadingEdition } = useGetAssessmentsRelease(null, 1, 99999, null, null, city?.MUN_ID, null, null, null, year, null, type === 'Avaliação');

  const getDisabled = () => {
    if(type && city && format && !isDisabled){
      if(type !== 'Alunos' && !year){
        return true;
      }
      return false;
    }
    return true
  }

  const handleExport = async () => {
    
    setIsDisabled(true)
    let response = null;
    try{
      if(type === 'Avaliação'){
        response = await getExportEvaluation(city?.MUN_ID, year, edition?.AVA_ID, format);
      }
      else if(type === 'Alunos'){
        response = await getExportStudents(city?.MUN_ID, format);
      }
      else if(type === 'Infrequência'){
        response = await getExportInfrequency(city?.MUN_ID, year, format);
      }
    }
    catch (err) {
      setIsDisabled(false)
    } finally {
      setIsDisabled(false)
    }
    if (!response?.data?.message) {
      setModalOpen(true);
      setModalStatus(true);
    } else {
      setModalStatus(false);
      setModalOpen(true);
      setErrorMessage(response.data.message || "Erro ao exportar dados");
    }
  }

  const handleChangeCity = (newValue) => {
    setCity(newValue);
    setEdition(null);
  }

  const handleChangeType = (newValue) => {
    setType(newValue);
    setYear(null);
    setEdition(null);
  }

  const getYearList = () => {
    if(dataYear?.items){      
      let listNumber = dataYear?.items.map((x) => {
        return Number(x.ANO_NOME)
      })

      return listNumber.filter((value, index, array) => array.indexOf(value) === index);
    }


    return []
  }


  const getEditionDisable = () => {
    if(type != "Avaliação")
      return true;
    if(!year)
      return true;
    return false;
  }

  return(
    <>
      <BoxFilter>
        <BoxSelect border>
          <Autocomplete
            style={{background: "#FFF"}}
            className=""
            id="type"
            size="small"
            value={type}
            noOptionsText="Tipo de Microdado"
            options={["Alunos", "Avaliação", "Infrequência"]}
            onChange={(_event, newValue) => {
              handleChangeType(newValue)
            }}
            renderInput={(params) => <TextField size="small" {...params} label="Tipo de Microdado" />}
          />
        </BoxSelect>
        <BoxSelect border>
          <AutoCompletePagMun county={city} changeCounty={handleChangeCity} />
        </BoxSelect>
        <BoxSelect border>
          <Autocomplete
            style={{background: "#FFF"}}
            className=""
            id="type"
            size="small"
            value={year}
            noOptionsText="Ano"
            options={getYearList()}
            // getOptionLabel={(option) => option.ANO_NOME}
            onChange={(_event, newValue) => {
              setYear(newValue)
              setEdition(null)
            }}
            renderInput={(params) => <TextField size="small" {...params} label="Ano" />}
            loading={isLoadingYear}
            disabled={type === "Alunos"}
          />
        </BoxSelect>
        <BoxSelect border>
          <Autocomplete
            style={{background: "#FFF"}}
            className=""
            id="type"
            size="small"
            value={edition}
            noOptionsText="Edição"
            options={editionsList?.items ? editionsList?.items : []}
            getOptionLabel={(option) => option.AVA_NOME}
            onChange={(_event, newValue) => {
              setEdition(newValue)
            }}
            renderInput={(params) => <TextField size="small" {...params} label="Edição" />}
            loading={isLoadingEdition}
            disabled={getEditionDisable()}
          />
        </BoxSelect>
        <BoxSelect>
          <Autocomplete
            style={{background: "#FFF"}}
            className=""
            id="type"
            size="small"
            value={format}
            noOptionsText="Formato de Exportação"
            options={Object.keys(ExportFormat)}
            getOptionLabel={(option) => ExportFormat[option]}
            onChange={(_event, newValue) => {
              setFormat(newValue)
            }}
            renderInput={(params) => <TextField size="small" {...params} label="Formato de Exportação" />}
          />
        </BoxSelect>
        <div>
          <ButtonWhite onClick={() => handleExport()} border={true} disable={getDisabled()} >
            Exportar Dados
          </ButtonWhite>
        </div>
      </BoxFilter>
        <ModalConfirmacao
          show={modalOpen}
          onHide={() => {
            setModalOpen(false);
          }}
          text={modalStatus ? "Se os filtros combinados gerarem um resultado para exportar, enviaremos um link para o seu e-mail para download" : errorMessage}
          status={modalStatus}
        />
    </>
  )
}