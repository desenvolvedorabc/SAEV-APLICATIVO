import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import {
  Container,
  FormStyled,
} from "./styles";
import { ButtonPadrao } from "../buttons/buttonPadrao";
import { Autocomplete, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { getAllYearsAssessments } from "src/services/avaliaoces.service";
import { AutoCompletePagStudent } from "../AutoCompletePag/AutoCompletePagStudent";
import { AutoCompletePagMun } from "../AutoCompletePag/AutoCompletePagMun";
import { AutoCompletePagEscMun } from "../AutoCompletePag/AutoCompletePagEscMun";

export function SearchEvolutionaryLine({changeYear, changeStudent, updateStudent}) {

  const [listAno, setListAno] = useState([])
  const [selectedYear, setSelectedYear] = useState("")
  const [_selectedStudent, setSelectedStudent] = useState(null)
  const [county, setCounty] = useState(null)
  const [school, setSchool] = useState(null)

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

  function handleSelectYear(e) {
    setSelectedYear(e.target.value);
    changeYear(e.target.value)
  }

  const handleChangeCounty = (newValue) => {
    setCounty(newValue)
  }

  const handleChangeSchool = (newValue) => {
    setSchool(newValue)
  }

  return (
    <Container>
      <FormStyled className="col-10 px-1">
        <Form.Group controlId="formBasicEmail" style={{position: "relative"}}>
          <div className="d-flex align-items-center col-12">
            <div className="col-2 me-2">
              <FormControl fullWidth size="small">
                <InputLabel id="AVA_ANO">Ano</InputLabel>
                <Select
                  labelId="AVA_ANO"
                  id="AVA_ANO"
                  value={selectedYear}
                  label="Ano"
                  onChange={(e) => handleSelectYear(e)}
                >
                  {listAno.map((item) => (
                    <MenuItem key={item.ANO} value={item.ANO}>
                      {item.ANO}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div style={{marginRight: 10}}>
              <AutoCompletePagMun county={county} changeCounty={handleChangeCounty} width="173px"/>
            </div>
            <div style={{marginRight: 10}}>
              <AutoCompletePagEscMun mun={county} school={school} changeSchool={handleChangeSchool} width={"173px"} />
            </div>
            <AutoCompletePagStudent student={_selectedStudent} handleChangeStudent={handleChangeStudent} county={county?.MUN_ID} school={school?.ESC_ID} />
          </div>
        </Form.Group>
      </FormStyled>

      <ButtonPadrao disable={!selectedYear || !_selectedStudent} onClick={() => {updateStudent()}}>Atualizar</ButtonPadrao>
    </Container>
  );
}
