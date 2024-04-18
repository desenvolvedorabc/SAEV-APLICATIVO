import styled from "styled-components";
import { Select } from "@material-ui/core";

export const ButtonAtivar = styled.button`
  border: none;
  background-color: #fff;
  color: ${props => props.color === "verde" ? "#3E8277" : "#FF6868"}
`;

