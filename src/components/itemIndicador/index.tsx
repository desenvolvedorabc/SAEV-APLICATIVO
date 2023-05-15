import { Container, Number, Title } from "./styledComponents";
import Router from 'next/router'

export default function ItemIndicador({icon, number, title = null}) {

  return (
    <Container className="d-flex align-items-center flex-column">
      <div className="d-flex align-items-center">
        {icon}
        <Number>{number}</Number>
      </div>
      <Title>{title}</Title>
    </Container>
  );


}

