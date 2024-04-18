import { Button } from "react-bootstrap";
import styled from "styled-components";

export const ButtonStyled = styled(Button)`
  background-color: #ff6868;
  width: 100%;
  border: none;
  font-size: 12px;
  min-height: 40px;

  &:hover {
    background-color: #bb4646;
  }
  &:active {
    background-color: #bb4646;
  }
  &:focus {
    background-color: #bb4646;
  }
`;
