import { Button } from "react-bootstrap";
import styled from "styled-components";

export const ButtonStyled = styled(Button)`
  background-color: #3b4ba2;
  border: none;
  font-size: 12px;
  min-height: 40px;
  width: 100%;

  &:hover {
    background-color: #2337a1;
  }

  &:active {
    background-color: #2337a1;
  }
  &:focus {
    background-color: #2337a1;
  }
`;
