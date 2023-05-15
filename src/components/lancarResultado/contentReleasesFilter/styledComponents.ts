import { Select } from "@mui/material";
import styled from "styled-components";

export const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-gap: 10px;
  background-color: #fff;
  padding: 10px 20px;
  margin-bottom: 12px;

  &.not-edition {
    grid-template-columns: 1fr 2fr 2fr 1fr 1fr;
  }
`;
