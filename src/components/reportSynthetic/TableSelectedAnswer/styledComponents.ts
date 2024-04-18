import { TableCell, TableRow } from "@mui/material";
import styled from "styled-components";


export const Container = styled.div`
  ${(props) =>
    !props.isPdf
      ? "background: #ffffff; overflow-y: auto;"
      : ""};
`;

export const TableRowStyled = styled(TableRow)`
  &:nth-of-type(odd) {
    background-color: #F5F5F5;
  }

  &:hover {
    background-color: #5ec2b1;
  }

  &.total {
    background: #f4fffd;
    > th:nth-of-type(1) {
      /* width: 100%; */
    }
    > th,
    td {
      color: #22282c;
      font-weight: 700;
    }
  }
`;

export const TableCellStyled = styled.div`
  ${(props) =>
    !props.isPdf
      ? "background: #ffffff; overflow-y: auto; max-height: 600px;"
      : ""};
`;


export const TableCellBorder = styled(TableCell)`
  border-left: 1px solid #d4d4d4;
  ${(props) => props.correct ? "background-color: #E0F1E0;" : null}
`;

export const Descriptor = styled.div`
  height: 30px;
  width: 100%;
  overflow-x: auto;
  text-wrap: nowrap;

  ::-webkit-scrollbar {
    height: 4px !important;
    border-radius: 2px !important;
    padding-top: 2px !important;
  };
`;