import { Button } from "react-bootstrap";
import styled from "styled-components";

export const ButtonStyled = styled(Button)`
  background-color: #ffc800;
  border: none;
  font-size: 12px;
  min-height: 40px;
  width: 100%;
  color: #000;

  &:hover {
    background-color: #fad036;
    color: #000;
  }

  &:active {
    background-color: #fad036;
    color: #000;
  }
  &:focus {
    background-color: #fad036;
    color: #000;
  }

  &:disabled {
    background-color: #d5d5d5;
  }
`;
