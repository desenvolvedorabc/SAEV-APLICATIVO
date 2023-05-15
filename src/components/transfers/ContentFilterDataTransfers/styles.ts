import { Select } from "@mui/material";
import styled from "styled-components";

export const Container = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 4fr 4fr 1fr 2fr;
  grid-gap: 10px;
  background-color: #fff;
  margin-bottom: 12px;
  padding: 0 0 0 20px;

  > div:last-child {
    padding: 15px 20px;
    border-left: 1px dashed #7c7c7c;
  }
`;
