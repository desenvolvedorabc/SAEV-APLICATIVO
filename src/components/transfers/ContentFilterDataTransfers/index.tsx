import { useEffect, useState } from "react";
import { Container } from "./styles";
import { ButtonPadrao } from "src/components/buttons/buttonPadrao";
import ButtonWhite from "src/components/buttons/buttonWhite";
import Router from "next/router";
import { AutoCompletePagMun } from "src/components/AutoCompletePag/AutoCompletePagMun";
import { AutoCompletePagEscMun } from "src/components/AutoCompletePag/AutoCompletePagEscMun";
import { useAuth } from "src/context/AuthContext";
import { useGetStates } from "src/services/estados.service";
import { Autocomplete, TextField } from "@mui/material";
import { AutoCompletePagMun2 } from "src/components/AutoCompletePag/AutoCompletePagMun2";

enum enumType {
  ESTADUAL = 'Estadual',
  MUNICIPAL = 'Municipal',
  PUBLICA = 'Publica'
}

export function ContentFilterDataTransfers({ changeState, changeCounty, changeType, changeSchool, handleSubmit }) {
  const [state, setState] = useState(null);
  const [county, setCounty] = useState(null);
  const [typeList, setTypeList] = useState([]);
  const [type, setType] = useState(null);
  const [school, setSchool] = useState(null);
  const [resetSchool, setResetSchool] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if(user){

      if(user?.USU_SPE?.role === 'MUNICIPIO_ESTADUAL'){
        setTypeList(['ESTADUAL'])
      } else if(user?.USU_SPE?.role === 'ESTADO'){
        setTypeList(['ESTADUAL', 'MUNICIPAL'])
      } else if(user?.USU_SPE?.role === 'MUNICIPIO_MUNICIPAL'){
        setTypeList(['MUNICIPAL'])
      } else if(user?.USU_SPE?.role === 'ESCOLA' ){
        setTypeList([user?.USU_ESC?.ESC_TIPO])      
      } else {
        setTypeList(['ESTADUAL', 'MUNICIPAL', 'PUBLICA'])
      }
    }
  }, [user])

  const { data: states, isLoading: isLoadingStates } = useGetStates();

  const handleChangeState = (newValue) => {
    setState(newValue);
    handleChangeCounty(null);
  };

  const handleChangeCounty = (newValue) => {
    setCounty(newValue);
    handleChangeType(null);
  };

  const handleChangeType = (newValue) => {
    setType(newValue);
    handleChangeSchool(null);
  };

  const handleChangeSchool = (newValue) => {
    setSchool(newValue)
  }

  const handleUpdate = () => {
    changeState(state) 
    changeCounty(county) 
    changeType(type)  
    changeSchool(school)
    handleSubmit(true)
  }
  return (
    <Container>
      <Autocomplete
        sx={{background: "#FFF"}}
        fullWidth
        className=""
        data-test='state'
        id="state"
        size="small"
        value={state}
        noOptionsText="Estado"
        options={states}
        loading={isLoadingStates}
        getOptionLabel={option => option.name}
        onChange={(_event, newValue) => {
          handleChangeState(newValue)
        }}
        renderInput={(params) => <TextField size="small" {...params} label="Estado" />}
      />
      <AutoCompletePagMun2 county={county} changeCounty={handleChangeCounty} active={'1'} stateId={state?.id} disabled={!state} width="100%" />
      <Autocomplete
        className=""
        id="type"
        size="small"
        value={type}
        noOptionsText="Rede"
        options={typeList}
        getOptionLabel={(option) => `${enumType[option]}`}
        onChange={(_event, newValue) => {
          handleChangeType(newValue);
        }}
        disabled={!county}
        sx={{
          background: "#FFF",
          "& .Mui-disabled": {
            background: "#D3D3D3",
          },
        }}
        renderInput={(params) => (
          <TextField size="small" {...params} label="Rede" />
        )}
      />
      <AutoCompletePagEscMun 
        school={school}
        changeSchool={handleChangeSchool}
        mun={county}
        resetSchools={resetSchool}
        width={"100%"}
        typeSchool={type}
        disabled={!type}
        enabled={!!type}
        active={'1'} 
      />
      <div>
        <ButtonWhite onClick={handleUpdate}>
          Buscar
        </ButtonWhite>
      </div>

      <div>
        <ButtonPadrao onClick={() => { Router.push(`/transferencia`)}}>
          Nova Transferência
        </ButtonPadrao>
      </div>
    </Container>
  );
}
