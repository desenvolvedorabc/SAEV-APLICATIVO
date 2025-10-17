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
import { AutoCompletePagEsc } from "src/components/AutoCompletePag/AutoCompletePagEsc";

enum enumType {
  ESTADUAL = 'Estadual',
  MUNICIPAL = 'Municipal',
  PUBLICA = 'Publica'
}

export function MessageTutoresFilter({
  // changeCounty,
  changeSchool,
  changeSerie,
  changeSchoolClass,
}) {
  // const [county, setCounty] = useState(null);
  const [school, setSchool] = useState(null);
  const [serie, setSerie] = useState(null);
  const [schoolClass, setSchoolClass] = useState(null);
  const [resetSchool, setResetSchool] = useState(false)


  const { data: classList, isLoading: isLoadingSchoolClass } = useGetSchoolClasses(
    null, 
    1, 
    9999, 
    'TURMA_TUR_ANO', 
    "ASC", 
    null,
    //county?.MUN_ID,
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

  // const handleChangeCounty = (newValue) => {
  //   setCounty(newValue);
  //   handleChangeSchool(null);
  // };

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
  };

  const handleUpdate = () => {
    // changeCounty(county);
    changeSchool(school);
    changeSerie(serie);
    changeSchoolClass(schoolClass);
  };

  return (
    <Container>
      {/* <AutoCompletePagMun2 county={county} changeCounty={handleChangeCounty} active={'1'} width="100%" /> */}
      <AutoCompletePagEsc
        school={school}
        changeSchool={handleChangeSchool}
        // resetSchools={resetSchool}
        width={"100%"}
        active={'1'}
        // disabled={!county}
        // enabled={!!county}
        // active={'1'}
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
      <div style={{ marginLeft: 20 }}>
        <ButtonPadrao dataTest="filter" disable={!school} onClick={() => handleUpdate()}>Selecionar</ButtonPadrao>
      </div>
    </Container>
  );
}
