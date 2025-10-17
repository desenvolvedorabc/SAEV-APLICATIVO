import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useGetAssessmentsRelease } from "src/services/avaliaoces.service";
import { useGetSchoolClasses } from "src/services/turmas.service";
import { Container, FistRow, SecondRow } from "./styledComponents";
import { ButtonPadrao } from "src/components/buttons/buttonPadrao";
import { useGetSeries } from "src/services/series.service";
import { AutoCompletePagEscMun } from "src/components/AutoCompletePag/AutoCompletePagEscMun";
import { useGetYears } from "src/services/anos.service";
import { useGetStates } from "src/services/estados.service";
import { AutoCompletePagMun2 } from "src/components/AutoCompletePag/AutoCompletePagMun2";
import { useAuth } from "src/context/AuthContext";

enum enumType {
  ESTADUAL = 'Estadual',
  MUNICIPAL = 'Municipal',
  PUBLICA = 'Publica'
}

export function ContentReleasesFilter({
  changeCounty,
  changeSchool,
  changeSerie,
  changeSchoolClass,
  setIsLoadingData,
  changeEdition,
}) {
  const [state, setState] = useState(null);
  const [county, setCounty] = useState(null);
  const [typeList, setTypeList] = useState(null);
  const [type, setType] = useState(null);
  const [school, setSchool] = useState(null);
  const [serie, setSerie] = useState(null);
  const [year, setYear] = useState(null);
  const [schoolClass, setSchoolClass] = useState(null);
  const [edition, setEdition] = useState(null);
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

  const { data: editionsList, isLoading: isLoadingEdition } = useGetAssessmentsRelease(null, 1, 99999, null, null, county?.MUN_ID, school?.ESC_ID, serie?.SER_ID, schoolClass?.TURMA_TUR_ID, year?.ANO_NOME, "1", !!schoolClass);
  
  const { data: yearsList, isLoading: isLoadingYear } = useGetYears(null, 1, 999999, null, 'DESC', true, !!school);

  const { data: seriesList, isLoading: isLoadingSerie } = useGetSeries(
    null, 
    1, 
    9999, 
    null, 
    "ASC", 
    school?.ESC_ID,
    '1',
    !!year
  );

  const { data: classList, isLoading: isLoadingSchoolClass } = useGetSchoolClasses(
    null, 
    1, 
    9999, 
    'TURMA_TUR_ANO', 
    "ASC", 
    year?.ANO_NOME,
    county?.MUN_ID,
    school?.ESC_ID,
    serie?.SER_ID,
    null,
    1,
    !!serie
  );

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
    handleChangeYear(null);
  };

  const handleChangeYear = (newValue) => {
    setYear(newValue);
    handleChangeSerie(null);
  };

  const handleChangeSerie = (newValue) => {
    setSerie(newValue);
    handleChangeClass(null);
  };

  const handleChangeClass = (newValue) => {
    setSchoolClass(newValue);
    handleChangeEdition(null);
  };

  const handleChangeEdition = (newValue) => {
    setEdition(newValue);
  };

  const handleUpdate = () => {
    changeCounty(county);
    changeSchool(school);
    changeSerie(serie);
    changeSchoolClass(schoolClass);
    changeEdition(edition);
    setIsLoadingData(true);
  };

  return (
    <Container>
      <FistRow>
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
      </FistRow>
      <SecondRow>
        <Autocomplete
          className=""
          id="size-small-outlined"
          size="small"
          value={year}
          noOptionsText="Ano"
          options={yearsList?.items ? yearsList?.items : []}
          getOptionLabel={(option) =>  `${option.ANO_NOME}`}
          onChange={(_event, newValue) => {
            handleChangeYear(newValue)}}
          disabled={school === null}
          loading={isLoadingYear}
          sx={{
            "& .Mui-disabled": {
              background: "#D3D3D3",
            },
          }}
          renderInput={(params) => <TextField size="small" {...params} label="Ano" />}
        />
        <Autocomplete
          className=""
          id="size-small-outlined"
          size="small"
          value={serie}
          noOptionsText="Série"
          options={seriesList?.items ? seriesList?.items : []}
          getOptionLabel={(option) =>  `${option.SER_NOME}`}
          onChange={(_event, newValue) => {
            handleChangeSerie(newValue)}}
          disabled={year === null}
          loading={isLoadingSerie}
          sx={{
            "& .Mui-disabled": {
              background: "#D3D3D3",
            },
          }}
          renderInput={(params) => <TextField size="small" {...params} label="Série" />}
        />
        <Autocomplete
          className=""
          id="size-small-outlined"
          size="small"
          value={schoolClass}
          noOptionsText="Turma"
          options={classList?.items ? classList?.items : []}
          getOptionLabel={(option) =>  `${option?.TURMA_TUR_ANO} - ${option?.TURMA_TUR_NOME}`}
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
        />
        <Autocomplete
          className=""
          id="size-small-outlined"
          size="small"
          value={edition}
          noOptionsText="Edição"
          options={editionsList?.items ? editionsList?.items : []}
          getOptionLabel={(option) =>  `${option?.AVA_NOME}`}
          onChange={(_event, newValue) => {
            handleChangeEdition(newValue)}}
          disabled={schoolClass === null}
          loading={isLoadingEdition}
          sx={{
            "& .Mui-disabled": {
              background: "#D3D3D3",
            },
          }}
          renderInput={(params) => <TextField size="small" {...params} label="Edição" />}
        />
        <div>
          <ButtonPadrao disable={!edition} onClick={() => handleUpdate()}>Selecionar</ButtonPadrao>
        </div>
      </SecondRow>
    </Container>
  );
}
