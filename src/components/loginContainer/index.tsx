import { LoginContainerStyled } from "./styledComponents";

export default function LoginContainer({children}) {
  return (
    <LoginContainerStyled className="d-flex col-12">
      {children}
    </LoginContainerStyled>
  );


}


