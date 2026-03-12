import { Button } from "react-bootstrap";
import styled from "styled-components";

export const ButtonStyled = styled(Button)`
  background-color: #fff;
  color: #ff6868;
  border: 1px solid #ff6868;
  width: 100%;
  font-size: 12px;
  min-height: 40px;

  &:hover {
    background-color: #bb4646;
    border: 1px solid #bb4646;
    color: #fff;
  }
  &:active {
    background-color: #bb4646;
    border: 1px solid #bb4646;
    color: #fff;
  }
  &:focus {
    background-color: #bb4646;
    border: 1px solid #bb4646;
    color: #fff;
  }
`;
