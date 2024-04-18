import { Autocomplete, FormControl, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { useGetSchoolClasses } from "src/services/turmas.service";
import { Container } from "./styledComponents";
import { ButtonPadrao } from "src/components/buttons/buttonPadrao";
import { getAllSeries, useGetSeries } from "src/services/series.service";
import { mockMeses } from "src/utils/mocks/meses";
import { AutoCompletePagMun } from "src/components/AutoCompletePag/AutoCompletePagMun";
import { AutoCompletePagEscMun } from "src/components/AutoCompletePag/AutoCompletePagEscMun";

export function ContentInfrequenciaFilter({
  changeCounty,
  changeSchool,
  changeSerie,
  changeSchoolClass,
  changeYear,
  changeMes,
}) {
  const [mesesList, setMesesList] = useState([]);
  const [county, setCounty] = useState(null);
  const [school, setSchool] = useState(null);
  const [serie, setSerie] = useState(null);
  const [schoolClass, setSchoolClass] = useState(null);
  const [mes, setMes] = useState(null);
  const [resetSchool, setResetSchool] = useState(false)

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

  const handleChangeCounty = (newValue) => {
    setCounty(newValue);
    setSchool(null);
    setSerie(null);
    setSchoolClass(null);
    setMes(null);
    setResetSchool(!resetSchool)
  };

  const handleChangeSchool = (newValue) => {
    setSchool(newValue);
    setSerie(null);
    setSchoolClass(null);
    setMes(null);
  };

  const handleChangeSerie = (newValue) => {
    setSerie(newValue);
    setSchoolClass(null);
    setMes(null);
  };

  const handleChangeClass = (newValue) => {
    setSchoolClass(newValue);
    setMes(null);
  };

  const handleChangeMes = (newValue) => {
    setMes(newValue);
  };

  const handleUpdate = () => {
    changeCounty(county);
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
      <AutoCompletePagMun county={county} changeCounty={handleChangeCounty} />
      <AutoCompletePagEscMun school={school} changeSchool={handleChangeSchool} mun={county} resetSchools={resetSchool} />
      <FormControl sx={{}} size="small">
        <Autocomplete
          className=""
          id="size-small-outlined"
          size="small"
          value={serie}
          noOptionsText="Série"
          options={seriesList?.items ? seriesList.items : []}
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
      <FormControl sx={{}} size="small">
        <Autocomplete
          className=""
          id="size-small-outlined"
          size="small"
          value={schoolClass}
          noOptionsText="Turma"
          options={classList?.items ? classList?.items : []}
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
        />
      </FormControl>
      <FormControl sx={{}} size="small">
        <Autocomplete
          className=""
          id="size-small-outlined"
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
        <ButtonPadrao disable={!mes} onClick={() => handleUpdate()}>Selecionar</ButtonPadrao>
      </div>
    </Container>
  );
}
