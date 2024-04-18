import { useState } from "react";
import { Container } from "./styles";
import { ButtonPadrao } from "src/components/buttons/buttonPadrao";
import ButtonWhite from "src/components/buttons/buttonWhite";
import Router from "next/router";
import { AutoCompletePagMun } from "src/components/AutoCompletePag/AutoCompletePagMun";
import { AutoCompletePagEscMun } from "src/components/AutoCompletePag/AutoCompletePagEscMun";


export function ContentFilterDataTransfers({ changeCounty, changeSchool, handleSubmit }) {
  const [county, setCounty] = useState(null);
  const [school, setSchool] = useState(null);
  const [resetSchool, setResetSchool] = useState(false)

  const handleChangeCounty = (newValue) => {
    setCounty(newValue);
    setResetSchool(!resetSchool)
    setSchool(null);
  };

  const handleChangeSchool = (newValue) => {
    setSchool(newValue);
  };

  const handleUpdate = () => {
    changeCounty(county);
    changeSchool(school);
    handleSubmit(true)
  };

  return (
    <Container>
      
      <AutoCompletePagMun county={county} changeCounty={handleChangeCounty} />      
      <AutoCompletePagEscMun school={school} changeSchool={handleChangeSchool} mun={county} resetSchools={resetSchool}  />
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
