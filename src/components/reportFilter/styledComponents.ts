import { Select } from "@mui/material";
import styled from "styled-components";

export const Container = styled.div`
  padding: 10px 20px;
  margin-bottom: 12px;
  background-color: #fff;
  display: flex;
`;

export const ContainerFilters = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 2fr 2fr 1fr;
  grid-gap: 10px;
  width: 100%;

  &.not-edition {
    grid-template-columns: 1fr 2fr 2fr 1fr;
  }

  &.not-year {
    grid-template-columns: 2fr 2fr 2fr 1fr;
  }

  &.not-class {
    grid-template-columns: 1fr 1fr 1fr;
  }

  &.serie-first {
    grid-template-columns: 1fr 2fr 2fr 1fr;
  }
`;

export const Series = styled.div`
  margin-bottom: 8px;
`;

export const Filters = styled.div`
  width: -webkit-fill-available;
`;

export const ButtonBox = styled.div`
  margin-left: 36px;
  margin-right: 7px;
  display: flex;
  align-items: center;
`;
