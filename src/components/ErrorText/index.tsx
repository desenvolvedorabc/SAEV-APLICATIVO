import { ErrorStyled } from "./styledComponents";

export default function ErrorText({children, id= null}) {
  return (
    <ErrorStyled data-test={id}>
      {children}
    </ErrorStyled>
  );


}

