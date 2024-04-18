import {
  Container,
  Box,
  Title,
  BarBox,
  Bar,
  Score,
  ButtonAccordeon,
  ContainerTopic,
  ContainerDescriptor,
  Nome,
  BarBoxDesc,
  BarDesc,
  ScoreDesc,
  BoxDesc,
} from "./styledComponents";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import { useState, useEffect, useMemo } from "react";

export function TopicScore({ topico, expandAll = false, orderBy = 'porNome' }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(expandAll);
  }, [expandAll]);

  const descritores = useMemo(() => {
    let descritores = [];

    if (orderBy === "menorMedia") {
      descritores = topico?.descritores?.sort((a, b) => {
        return a.value - b.value;
      });
    } else if (orderBy === "maiorMedia") {
      descritores = topico?.descritores?.sort((a, b) => {
        return b.value - a.value;
      });
    } else if (orderBy === "porNome") {
      descritores = topico?.descritores?.sort((a, b) => {
        return ("" + a.cod).localeCompare(b.cod);
      });
    }

    return descritores;
  }, [orderBy, topico]);

  return (
    <Container>
      <ContainerTopic>
        <Title>Tópico &quot;{topico.name}&quot;</Title>
        <Box>
          <BarBox>
            <Bar width={topico.value}></Bar>
            <Score>{topico.value}%</Score>
          </BarBox>
          <ButtonAccordeon onClick={() => setOpen(!open)}>
            {open ? <MdExpandLess size={26} /> : <MdExpandMore size={26} />}
          </ButtonAccordeon>
        </Box>
      </ContainerTopic>
      {open && (
        <ContainerDescriptor>
          {descritores?.map((descritor) => (
            <BoxDesc key={descritor.id}>
              <Nome>{descritor?.cod} - {descritor.name}</Nome>
              <BarBoxDesc>
                <BarDesc width={descritor.value}></BarDesc>
                <ScoreDesc>{descritor.value}%</ScoreDesc>
              </BarBoxDesc>
            </BoxDesc>
          ))}
        </ContainerDescriptor>
      )}
    </Container>
  );
}
