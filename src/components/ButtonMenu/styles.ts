import styled from "styled-components";
import { Button, MenuItem } from "@mui/material";

export const ButtonMenu = styled(Button)`
  font-family: "Inter", sans-serif;
  color: #7c7c7c !important;
  font-weight: 400;
  text-transform: none !important;
  font-size: 16px;

  &:hover {
    background-color: #fff;
  }
`;

export const MenuItemStyled = styled(MenuItem)`
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  margin: 0 14px;
`;
