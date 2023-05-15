import { Button } from "react-bootstrap";
import styled from "styled-components";

export const ButtonStyled = styled(Button)`
  background-color: #3e8277;
  width: 100%;
  min-height: 40px;
  font-size: 13px;

  &:hover {
    background-color: #5ec2b1;
  }
  &:active {
    background-color: #20423d;
  }
  &:focus {
    background-color: #20423d;
  }
`;
