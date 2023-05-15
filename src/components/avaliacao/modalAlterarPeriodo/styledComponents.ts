import styled from "styled-components";
import { Select } from "@material-ui/core";

export const Button = styled.button`
  border: none;
  background-color: #fff;
`;

export const SelectMultiple = styled(Select)`
  padding: 0px;
  & > div {
    padding: 7.5px;
  }
`;
