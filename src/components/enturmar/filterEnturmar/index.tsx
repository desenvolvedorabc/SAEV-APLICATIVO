import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";
import { AutoCompletePagEscMun } from "src/components/AutoCompletePag/AutoCompletePagEscMun";
import { AutoCompletePagMun } from "src/components/AutoCompletePag/AutoCompletePagMun";
import { ButtonPadrao } from "src/components/buttons/buttonPadrao";
import { CardDefault } from "src/components/cardDefault";
import { InputGroup } from "./styledComponents";


export function FilterEnturmar ({changeMun, changeSchool, changeStatus}) {
  const [mun, setMun] = useState(null)
  const [school, setSchool] = useState(null)
  const [status, setStatus] = useState(null)
  const [resetSchool, setResetSchool] = useState(false)

  const handleChangeMun = (newValue) => {
    setMun(newValue)
    setResetSchool(!resetSchool)
    setSchool(null)
  }

  const handleChangeSchool = (newValue) => {
    setSchool(newValue)
  }

  const handleChangeStatus = (e) => {
    setStatus(e.target.value)
    changeStatus(e.target.value)
  }

  const handleUpdate = () => {
    changeMun(mun) 
    changeSchool(school) 
    changeStatus(status)
  }

  return(
    <CardDefault>
      <div className="d-flex justify-content-between">
        <InputGroup>
          <AutoCompletePagMun county={mun} changeCounty={handleChangeMun} active="1" />
          <AutoCompletePagEscMun school={school} changeSchool={handleChangeSchool} mun={mun} resetSchools={resetSchool} active="1" />
          <FormControl sx={{}} size="small">
            <InputLabel id="status">Status</InputLabel>
            <Select
              labelId="status"
              id="status"
              value={status}
              label="Status"
              onChange={(e) => handleChangeStatus(e)}
            >
              <MenuItem value={null}>
                <em>Status</em>
              </MenuItem>
              <MenuItem value={"Enturmado"}>
                Enturmados
              </MenuItem>
              <MenuItem value={"Não Enturmado"}>
                Não Enturmados
              </MenuItem>
            </Select>
          </FormControl>
        </InputGroup>
        <div style={{width: 111}}>
          <ButtonPadrao onClick={() => handleUpdate()} disable={!school}>
            Selecionar
          </ButtonPadrao>
        </div>
      </div>
    </CardDefault>
  )
}