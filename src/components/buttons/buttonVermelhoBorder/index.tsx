import { ButtonStyled } from "./styledComponents";

export default function ButtonVermelhoBorder({children, onClick, disable = false, type="button", dataTest = ''}) {
  return (
    <ButtonStyled type={type} onClick={onClick} disabled={disable} data-test={dataTest}>
      {children}
    </ButtonStyled>
  );


}

