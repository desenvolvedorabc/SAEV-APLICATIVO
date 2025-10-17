import styled from "styled-components";
import { Button, MenuItem } from "@mui/material";

export const Container = styled.div`
  display: flex;
  justify-content: flex-end;
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
