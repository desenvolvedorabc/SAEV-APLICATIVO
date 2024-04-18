import { Autocomplete, TextField } from "@mui/material";
import { useState } from "react";
import { useGetAssessmentsRelease } from "src/services/avaliaoces.service";
import { useGetSchoolClasses } from "src/services/turmas.service";
import { Container } from "./styledComponents";
import { ButtonPadrao } from "src/components/buttons/buttonPadrao";
import { useGetSeries } from "src/services/series.service";
import { AutoCompletePagMun } from "src/components/AutoCompletePag/AutoCompletePagMun";
import { AutoCompletePagEscMun } from "src/components/AutoCompletePag/AutoCompletePagEscMun";
import { useGetYears } from "src/services/anos.service";

export function ContentReleasesFilter({
  changeCounty,
  changeSchool,
  changeSerie,
  changeSchoolClass,
  setIsLoadingData,
  changeEdition,
}) {
  const [county, setCounty] = useState(null);
  const [school, setSchool] = useState(null);
  const [serie, setSerie] = useState(null);
  const [year, setYear] = useState(null);
  const [schoolClass, setSchoolClass] = useState(null);
  const [edition, setEdition] = useState(null);
  const [resetSchool, setResetSchool] = useState(false)

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

  const handleChangeCounty = (newValue) => {
    setCounty(newValue);
    setSchool(null);
    setYear(null);
    setSerie(null);
    setSchoolClass(null);
    setEdition(null);
  };

  const handleChangeSchool = (newValue) => {
    setSchool(newValue);
    setYear(null);
    setSerie(null);
    setSchoolClass(null);
    setEdition(null);
  };

  const handleChangeYear = (newValue) => {
    setYear(newValue);
    setSerie(null);
    setSchoolClass(null);
    setEdition(null);
  };

  const handleChangeSerie = (newValue) => {
    setSerie(newValue);
    setSchoolClass(null);
    setEdition(null);
  };

  const handleChangeClass = (newValue) => {
    setSchoolClass(newValue);
    setEdition(null);
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
      <AutoCompletePagMun county={county} changeCounty={handleChangeCounty} active={'1'} />
      <AutoCompletePagEscMun school={school} changeSchool={handleChangeSchool} mun={county} resetSchools={resetSchool} active={'1'} />
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
    </Container>
  );
}
