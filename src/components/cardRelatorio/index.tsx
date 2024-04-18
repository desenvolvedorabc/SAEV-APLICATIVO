import { CardRelatorioStyled, Numeros, TextoCard } from "./styledComponents";
import Router from "next/router";

export default function CardRelatorio({
  icon,
  title,
  subTitle,
  link,
  ARE_NOME = [],
}) {
  const checkPositive = (title) => {
    if (title[0] === "-") return false;
    else return true;
  };

  return (
    <CardRelatorioStyled onClick={() => Router.push(link)}>
      {icon}
      {checkPositive(title) ? (
        <Numeros color={"#3E8277"}>{title}</Numeros>
      ) : (
        <Numeros color={"#FF6868"}>{title}</Numeros>
      )}
      <TextoCard>{subTitle}</TextoCard>
    </CardRelatorioStyled>
  );
}
