import styled from "styled-components";
import TableCell from "@mui/material/TableCell";
import { TableRow } from "@mui/material";

export const TableCellStyled = styled(TableCell)`
  background-color: #e0f1e0 !important;
  color: #68936a !important;
`;

export const Container = styled.div`
  background-color: #fff;
  // border-radius: 10px;
  border-bottom-right-radius: 50px;
  border-bottom-left-radius: 50px;
`;

export const TableCellBorder = styled(TableCell)`
  border-left: 1px solid #d4d4d4;

  background-color: ${(props) => props.color};
`;

export const TableRowStyled = styled(TableRow)`
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