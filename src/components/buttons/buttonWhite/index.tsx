import { ButtonStyled } from "./styledComponents";

export default function ButtonWhite({
  children,
  onClick,
  disable = false,
  type = "button",
  border = true,
  dataTest = ''
}) {
  return (
    <ButtonStyled
      type={type}
      border={border}
      onClick={onClick}
      disabled={disable}
      data-test={dataTest}
    >
      {children}
    </ButtonStyled>
  );
}
