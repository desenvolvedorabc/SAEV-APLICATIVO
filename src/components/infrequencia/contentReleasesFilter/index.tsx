import { Autocomplete, FormControl, ListItemText, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { useGetSchoolClasses } from "src/services/turmas.service";
import { Container } from "./styledComponents";
import { ButtonPadrao } from "src/components/buttons/buttonPadrao";
import { useGetSeries } from "src/services/series.service";
import { mockMeses } from "src/utils/mocks/meses";
import { AutoCompletePagEscMun } from "src/components/AutoCompletePag/AutoCompletePagEscMun";
import { useAuth } from "src/context/AuthContext";
import { useGetStates } from "src/services/estados.service";
import { AutoCompletePagMun2 } from "src/components/AutoCompletePag/AutoCompletePagMun2";

enum enumType {
  ESTADUAL = 'Estadual',
  MUNICIPAL = 'Municipal',
  PUBLICA = 'Publica'
}

export function ContentInfrequenciaFilter({
  changeState,
  changeCounty,
  changeType,
  changeSchool,
  changeSerie,
  changeSchoolClass,
  changeYear,
  changeMes,
}) {
  const [mesesList, setMesesList] = useState([]);
  const [state, setState] = useState(null);
  const [county, setCounty] = useState(null);
  const [typeList, setTypeList] = useState([]);
  const [type, setType] = useState(null);
  const [school, setSchool] = useState(null);
  const [serie, setSerie] = useState(null);
  const [schoolClass, setSchoolClass] = useState(null);
  const [mes, setMes] = useState(null);
  const [resetSchool, setResetSchool] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if(user){

      if(user?.USU_SPE?.role === "ESTADO" || user?.USU_SPE?.role === 'MUNICIPIO_ESTADUAL'){
        setTypeList(['ESTADUAL'])
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

  const { data: classList, isLoading: isLoadingSchoolClass } = useGetSchoolClasses(
    null, 
    1, 
    9999, 
    'TURMA_TUR_ANO', 
    "ASC", 
    null,
    county?.MUN_ID,
    school?.ESC_ID,
    serie?.SER_ID,
    null,
    1,
    !!serie
  );

  const { data: seriesList, isLoading: isLoadingSerie } = useGetSeries(
    null, 
    1, 
    9999, 
    null, 
    "ASC", 
    school?.ESC_ID,
    '1',
    !!school
  );

  const loadMeses = async () => {
    let list = []
    const DataAtual = new Date()
    const mesAtual = DataAtual.getMonth()

    if(mesAtual !== 0){
      list.push(mockMeses[mesAtual-1])
    } else {
      list.push(mockMeses[11])
    }
    list.push(mockMeses[mesAtual])

    setMesesList(list);
  };

  useEffect(() => {
    loadMeses();
  }, [schoolClass]);

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
    setSchool(newValue);
    handleChangeSerie(null);
  };

  const handleChangeSerie = (newValue) => {
    setSerie(newValue);
    handleChangeClass(null);
  };

  const handleChangeClass = (newValue) => {
    setSchoolClass(newValue);
    handleChangeMes(null);
  };

  const handleChangeMes = (newValue) => {
    setMes(newValue);
  };

  const handleUpdate = () => {
    changeState(state);
    changeCounty(county);
    changeType(type);
    changeSchool(school);
    changeSerie(serie);
    changeSchoolClass(schoolClass);
    const dataAtual = new Date()

    if(dataAtual.getMonth() === 0 && mes?.MES_ID === 12) {
      changeYear(dataAtual.getFullYear() - 1);
    }
    else{
      changeYear(dataAtual.getFullYear());
    }
    changeMes(mes);
  };

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
        options={states || []}
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
          options={typeList || []}
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
      <FormControl sx={{}} size="small">
        <Autocomplete
          className=""
          id="serie"
          data-test="serie"
          size="small"
          value={serie}
          noOptionsText="Série"
          options={seriesList?.items || []}
          loading={isLoadingSerie}
          getOptionLabel={(option) =>  `${option.SER_NOME}`}
          onChange={(_event, newValue) => {
            handleChangeSerie(newValue)}}
          disabled={school === null}
          sx={{
            "& .Mui-disabled": {
              background: "#D3D3D3",
            },
          }}
          renderInput={(params) => <TextField size="small" {...params} label="Série" />}
        />
      </FormControl>
      {/* <FormControl sx={{}} size="small"> */}
        <Autocomplete
          className=""
          id="schoolClass"
          data-test="schoolClass"
          size="small"
          value={schoolClass}
          noOptionsText="Turma"
          options={classList?.items || []}
          getOptionLabel={(option) =>  `${option.TURMA_TUR_NOME}`}
          onChange={(_event, newValue) => {
            handleChangeClass(newValue)}}
          disabled={serie === null}
          loading={isLoadingSchoolClass}
          sx={{
            "& .Mui-disabled": {
              background: "#D3D3D3",
            },
          }}
          renderInput={(params) => <TextField size="small" {...params} label="Turma" />}
          renderOption={(props, item) => (
            <li {...props} key={item.TURMA_TUR_ID}>
              <ListItemText>{item.TURMA_TUR_NOME}</ListItemText>
            </li>
          )}
        />
      {/* </FormControl> */}
      <FormControl sx={{}} size="small">
        <Autocomplete
          className=""
          id="month"
          data-test="month"
          size="small"
          value={mes}
          noOptionsText="Mês"
          options={mesesList}
          getOptionLabel={(option) =>  `${option.MES_NOME}`}
          onChange={(_event, newValue) => {
            handleChangeMes(newValue)}}
          disabled={schoolClass === null}
          sx={{
            "& .Mui-disabled": {
              background: "#D3D3D3",
            },
          }}
          renderInput={(params) => <TextField size="small" {...params} label="Mês" />}
        />
      </FormControl>
      <div>
        <ButtonPadrao dataTest="filter" disable={!mes} onClick={() => handleUpdate()}>Selecionar</ButtonPadrao>
      </div>
    </Container>
  );
}
