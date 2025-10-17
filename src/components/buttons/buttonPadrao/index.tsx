import { ButtonStyled } from "./styledComponents";

export function ButtonPadrao({children, onClick, disable = false, type="button", dataTest = ''}) {
  return (
    <ButtonStyled data-test={dataTest} type={type} onClick={onClick} disabled={disable}>
      {children}
    </ButtonStyled>
  );


}

