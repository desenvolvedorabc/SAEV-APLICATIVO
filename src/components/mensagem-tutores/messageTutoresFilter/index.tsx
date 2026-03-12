import { Autocomplete, FormControl, ListItemText, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { useGetSchoolClasses, useGetAllSchoolClass } from "src/services/turmas.service";
import { Container } from "./styledComponents";
import { ButtonPadrao } from "src/components/buttons/buttonPadrao";
import { useGetSeries, useGetAllSeries } from "src/services/series.service";
import { mockMeses } from "src/utils/mocks/meses";
import { AutoCompletePagEscMun } from "src/components/AutoCompletePag/AutoCompletePagEscMun";
import { useAuth } from "src/context/AuthContext";
import { useGetStates } from "src/services/estados.service";
import { AutoCompletePagEsc } from "src/components/AutoCompletePag/AutoCompletePagEsc";
import { AutoCompleteWithAllOption } from "src/components/AutoCompletePag/AutoCompleteWithAllOption";

enum enumType {
  ESTADUAL = 'Estadual',
  MUNICIPAL = 'Municipal',
  PUBLICA = 'Publica'
}

export function MessageTutoresFilter({
  changeSchool,
  changeSerie,
  changeSchoolClass,
  triggerReload,
}) {
  const [school, setSchool] = useState(null);
  const [serie, setSerie] = useState(null);
  const [schoolClass, setSchoolClass] = useState(null);
  const [resetSchool, setResetSchool] = useState(false)
  
  const { user } = useAuth();
  const isSchoolUser = user?.USU_SPE?.role === 'ESCOLA';


  const { data: allSeries, isLoading: isLoadingAllSeries } = useGetAllSeries('1');
  const { data: allSchoolClass, isLoading: isLoadingAllSchoolClass } = useGetAllSchoolClass();

  const { data: classList, isLoading: isLoadingSchoolClass } = useGetSchoolClasses(
    null, 
    1, 
    9999, 
    'TURMA_TUR_ANO', 
    "ASC", 
    null,
    null,
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

  const seriesOptions = seriesList?.items || [];

  const classOptions = classList?.items || [];

  const userRole = user?.USU_SPE?.role;

  const handleChangeSchool = (newValue) => {
    setSchool(newValue);
    setSerie(null);
    setSchoolClass(null);
  };

  const handleChangeSerie = (newValue) => {
    setSerie(newValue);
    setSchoolClass(null);
  };

  const handleChangeClass = (newValue) => {
    setSchoolClass(newValue);
  };

  const handleSelect = () => {
    changeSchool(school);
    changeSerie(serie);
    changeSchoolClass(schoolClass);
    if (triggerReload) {
      triggerReload();
    }
  };

  useEffect(() => {
    if (isSchoolUser && user?.USU_ESC && !school) {
      setSchool(user.USU_ESC);
    }
  }, [isSchoolUser, user?.USU_ESC, school]);



  return (
    <Container>
      <AutoCompletePagEsc
        school={school}
        changeSchool={handleChangeSchool}
        width={"100%"}
        active={'1'}
      />
      <AutoCompleteWithAllOption
        value={serie}
        onChange={handleChangeSerie}
        options={seriesOptions}
        getOptionLabel={(option) => `${option.SER_NOME}`}
        label="Série"
        width="100%"
        disabled={school === null}
        loading={isLoadingSerie}
        noOptionsText="Série"
        getOptionKey={(option) => option.SER_ID}
      />
      <AutoCompleteWithAllOption
        value={schoolClass}
        onChange={handleChangeClass}
        options={classOptions}
        getOptionLabel={(option) => `${option.TURMA_TUR_NOME}`}
        label="Turma"
        width="100%"
        disabled={serie === null}
        loading={isLoadingSchoolClass}
        noOptionsText="Turma"
        getOptionKey={(option) => option.TURMA_TUR_ID}
      />
      <div style={{ marginLeft: 20 }}>
        <ButtonPadrao dataTest="filter" disable={!school} onClick={handleSelect}>Selecionar</ButtonPadrao>
      </div>
    </Container>
  );
}
