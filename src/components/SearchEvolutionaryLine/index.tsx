import { useEffect, useState } from "react";
import {
  Container,
  FiltersFirstGroup,
  FiltersSecondaryGroup,
} from "./styles";
import { ButtonPadrao } from "../buttons/buttonPadrao";
import { Autocomplete, TextField } from "@mui/material";
import { getAllYearsAssessments } from "src/services/avaliaoces.service";
import { AutoCompletePagStudent } from "../AutoCompletePag/AutoCompletePagStudent";
import { useGetStates } from "src/services/estados.service";
import { useGetRegionaisByFilter } from "src/services/regionais-estaduais.service";
import { useAuth } from "src/context/AuthContext";

enum enumType {
  ESTADUAL = 'Estadual',
  MUNICIPAL = 'Municipal',
  PUBLICA = 'Publica'
}

export function SearchEvolutionaryLine({changeYear, changeStudent, updateStudent}) {

  const [listAno, setListAno] = useState([])
  const [selectedYear, setSelectedYear] = useState(null)
  const [_selectedStudent, setSelectedStudent] = useState(null)
  const [type, setType] = useState(null)
  const [typeList, setTypeList] = useState([])
  const [state, setState] = useState(null)
  const [stateRegional, setStateRegional] = useState(null)
  const [county, setCounty] = useState(null)
  const [countyRegional, setCountyRegional] = useState(null)
  const [school, setSchool] = useState(null)
  const { user } = useAuth() 

  useEffect(() => {
    if(user){
      if(user?.USU_SPE?.role === 'MUNICIPIO_MUNICIPAL'){
        setTypeList(['MUNICIPAL'])
      } else if(user?.USU_SPE?.role === 'ESCOLA' ){
        setTypeList([user?.USU_ESC?.ESC_TIPO])   
      } else {
        setTypeList(['ESTADUAL', 'MUNICIPAL', 'PUBLICA'])
      }
    }
  }, [user])

  const { data: states, isLoading: isLoadingStates } = useGetStates();

  const { data: stateRegionals, isLoading: isLoadingStateRegionals } = useGetRegionaisByFilter(null, 1, 9999999, null, 'ASC', null, state?.id, 'ESTADUAL', type === 'PUBLICA' ? null : type);
  
  const { data: countyRegionals, isLoading: isLoadingCountyRegionals } = useGetRegionaisByFilter(null, 1, 9999999, null, 'ASC', county?.MUN_ID, null, type === 'PUBLICA' ? null : type === 'ESTADUAL' ? 'UNICA' : 'MUNICIPAL', type === 'PUBLICA' ? null : type, !!county);

  useEffect(() => {
    loadYears();
  }, []);

  const loadYears = async () => {
    const resp = await getAllYearsAssessments();
    if (resp.data) setListAno(resp.data.sort((a, b) => b.ANO - a.ANO));
  };

  function handleChangeStudent(student) {
    setSelectedStudent(student)
    changeStudent(student)
  }

  function handleSelectYear(newValue) {
    setSelectedYear(newValue);
    changeYear(newValue)
  }

  const handleChangeType = (newValue) => {
    setType(newValue)
    handleChangeState(null)
  }

  const handleChangeState = (newValue) => {
    setState(newValue)
    handleChangeStateRegional(null)
  }

  const handleChangeStateRegional = (newValue) => {
    setStateRegional(newValue)
    handleChangeCounty(null)
  }

  const handleChangeCounty = (newValue) => {
    setCounty(newValue)
    handleChangeCountyRegional(null)
  }

  const handleChangeCountyRegional = (newValue) => {
    setCountyRegional(newValue)
    handleChangeSchool(null)
  }

  const handleChangeSchool = (newValue) => {
    setSchool(newValue)
  }

  return (
    <Container>
      <div style={{ width: '100%', marginRight: 15}}>
        <FiltersFirstGroup>
          <div>
            <Autocomplete
              className=""
              id="size-small-outlined"
              size="small"
              value={selectedYear}
              noOptionsText="Ano"
              options={listAno}
              getOptionLabel={(option) => `${option.ANO}`}
              onChange={(_event, newValue) => {
                handleSelectYear(newValue);
              }}
              renderInput={(params) => (
                <TextField size="small" {...params} label="Ano" />
              )}
            />
          </div>
          <div>
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
              // disabled={disableRede()}
              sx={{
                "& .Mui-disabled": {
                  background: "#D3D3D3",
                },
              }}
              renderInput={(params) => (
                <TextField size="small" {...params} label="Rede" />
              )}
            />
          </div>
          <div>
            <Autocomplete
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
              disabled={!type}
              onChange={(_event, newValue) => {
                handleChangeState(newValue)
              }}
              renderInput={(params) => <TextField size="small" {...params} label="Estado" />}
              sx={{
                "& .Mui-disabled": {
                  background: "#D3D3D3",
                },
              }}
            />
          </div>
          <div>
            <Autocomplete
              fullWidth
              className=""
              data-test='stateRegional'
              id="stateRegional"
              size="small"
              value={stateRegional}
              noOptionsText="Regionais Estaduais"
              options={stateRegionals?.items || []}
              loading={isLoadingStateRegionals}
              getOptionLabel={option => option.name}
              disabled={!state}
              onChange={(_event, newValue) => {
                handleChangeStateRegional(newValue)
              }}
              renderInput={(params) => <TextField size="small" {...params} label="Regionais Estaduais" />}
              sx={{
                "& .Mui-disabled": {
                  background: "#D3D3D3",
                },
              }}
            />
          </div>
        </FiltersFirstGroup>
        <FiltersSecondaryGroup>
          <div>
            <Autocomplete
              className=""
              id="size-small-outlined"
              size="small"
              value={county}
              noOptionsText="Município"
              options={stateRegional?.counties || []}
              getOptionLabel={(option) => `${option?.MUN_NOME}`}
              onChange={(_event, newValue) => {
                handleChangeCounty(newValue);
              }}
              disabled={!stateRegional}
              sx={{
                "& .Mui-disabled": {
                  background: "#D3D3D3",
                },
              }}
              renderInput={(params) => (
                <TextField size="small" {...params} label="Município" />
              )}
            />
          </div>
          <Autocomplete
            fullWidth
            className=""
            data-test='countyRegional'
            id="countyRegional"
            size="small"
            value={countyRegional}
            noOptionsText="Regionais Municípais / Únicas"
            options={countyRegionals?.items || []}
            loading={isLoadingCountyRegionals}
            getOptionLabel={option => option.name}
            disabled={!county}
            onChange={(_event, newValue) => {
              handleChangeCountyRegional(newValue)
            }}
            renderInput={(params) => <TextField size="small" {...params} label="Regionais Municípais / Únicas" />}
            sx={{
              "& .Mui-disabled": {
                background: "#D3D3D3",
              },
            }}
          />
          <div>
          <Autocomplete
            className=""
            id="school"
            size="small"
            value={school}
            noOptionsText="Escola"
            options={countyRegional?.schools || []}
            getOptionLabel={(option) => `${option.ESC_NOME}`}
            onChange={(_event, newValue) => {
              handleChangeSchool(newValue);
            }}
            disabled={!countyRegional}
            sx={{
              "& .Mui-disabled": {
                background: "#D3D3D3",
              },
            }}
            renderInput={(params) => (
              <TextField size="small" {...params} label="Escola" />
            )}
          />
          </div>
        </FiltersSecondaryGroup>
        <AutoCompletePagStudent student={_selectedStudent} handleChangeStudent={handleChangeStudent} type={type} state={state?.id} stateRegional={stateRegional?.id} county={county?.MUN_ID} countyRegional={countyRegional?.id} school={school?.ESC_ID} />
      </div>
      <div style={{ margin: 'auto', width: 120}}>
        <ButtonPadrao disable={!selectedYear || !_selectedStudent} onClick={() => {updateStudent()}}>Atualizar</ButtonPadrao>
      </div>
    </Container>
  );
}
