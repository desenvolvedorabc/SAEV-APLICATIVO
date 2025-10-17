import { PageTitleStyled } from "./styledComponents";

export default function PageTitle({children, dataTest = ""}) {
  return (
    <PageTitleStyled data-test={dataTest}>
      {children}
    </PageTitleStyled>
  );


}

