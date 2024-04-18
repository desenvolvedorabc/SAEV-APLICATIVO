import styled from "styled-components";
import { Button, MenuItem } from "@mui/material";

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 25px 0 25px;
  background-color: #ffffff;

  border-bottom: 1px solid #d5d5d5;

  > div {
    display: flex;
    gap: 10px;
    > button {
      padding-bottom: 10px;

      color: #7c7c7c;

      > span {
        color: #3e8277;
      }

      &.export {
        position: relative;
        &:before {
          content: "";
          display: block;
          position: absolute;
          left: -7px;
          top: -2px;
          width: 1px;
          height: 30px;
          background: #d5d5d5;
        }
      }
    }
  }

  > div:nth-child(1) {
    > button {
      margin-right: 10px;

      &:hover,
      &.checked {
        color: #3e8277;
        border-bottom: 1px solid #3e8277;
      }
    }
  }
`;

export const ButtonMenu = styled(Button)`
  font-family: "Inter", sans-serif;
  color: #20423d;
  font-weight: 400;
  text-transform: none !important;
  font-size: 16px;

  &:hover {
    background-color: #fff;
  }
`;

export const MenuItemStyled = styled(MenuItem)`
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  padding: 0;
  cursor: unset;
  margin: 0 14px;

  label {
    width: 100% !important;
    padding: 10px;
  }
  input,
  label {
    cursor: pointer !important;
  }

  input {
    margin: 0;
    margin-top: 14px;
    float: none;
  }

  &.button {
    cursor: pointer;
    padding: 10px;
  }
`;
