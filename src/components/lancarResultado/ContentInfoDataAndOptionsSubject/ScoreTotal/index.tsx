import { useMemo } from "react";
import { Bar, Container, Nome, BarBox, Score } from "./styledComponents";

interface ScorebarProps {
  qnt: number;
  total: number;
}

export default function ScoreTotal({ qnt, total }: ScorebarProps) {
  const amountInPercentage = useMemo(() => {

    const value = ((qnt / total) * 100).toFixed(0);

    return +value;

  } , [qnt, total]);

  return (
    <Container>
      <Nome>Lançamentos</Nome>
      <BarBox>
        <Bar style={{ width: `${amountInPercentage}%` }}></Bar>
      </BarBox>
      <Score>{amountInPercentage}% - {qnt} de {total}</Score>
    </Container>
  );
}
