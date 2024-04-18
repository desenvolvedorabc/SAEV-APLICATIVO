import styled from "styled-components";
import { Card } from "react-bootstrap";

export const CardStyled = styled(Card)`
  text-align: center;
  border: none;
  border-radius: 25px 25px 20px 20px;
  width: 380px;
`;
export const HeaderStyled = styled(Card.Header)`
  background: #3e8277;
  color: white;
  border-top-left-radius: 20px !important;
  border-top-right-radius: 20px !important;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
export const BodyStyled = styled(Card.Body)`
  padding: 35px;
`;

export const ImageBox = styled.div`
  width: 180px;
  margin: auto;
  margin-top: 10px;
`;
