import { Button } from "react-bootstrap";
import styled from "styled-components";

export const ButtonStyled = styled(Button)`
  background-color: #3e8277;
  width: 100%;
  border: none;
  font-size: 13px;
  min-height: 40px;

  &:hover {
    background-color: #20423d;
  }
  &:active {
    background-color: #20423d;
  }
  &:focus {
    background-color: #20423d;
  }

  &:disabled {
    background-color: #d5d5d5;
  }
`;
