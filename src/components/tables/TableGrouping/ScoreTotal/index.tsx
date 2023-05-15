import { useMemo } from "react";
import { Bar, Container, Nome, BarBox, Score } from "./styledComponents";

interface ScorebarProps {
  qnt: number;
  total: number;
}

export default function ScoreTotal({ qnt, total }: ScorebarProps) {
  const amountInPercentage = useMemo(() => {

    const value = ((qnt / total) * 100).toFixed(0);

    if(!!+value) {
      return +value;
    } else {
      return 0;
    }

  } , [qnt, total]);

  return (
    <Container>
      <Nome>Total</Nome>
      <BarBox>
        <Bar style={{ width: `${amountInPercentage}%` }}></Bar>
      </BarBox>
      <Score>{amountInPercentage}% - {qnt?.toLocaleString('pt-BR')}/{total?.toLocaleString('pt-BR')}</Score>
    </Container>
  );
}
