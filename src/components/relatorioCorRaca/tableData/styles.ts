import styled from "styled-components";
import TableCell from "@mui/material/TableCell";
import { TableRow } from "@mui/material";

export const Header = styled.div`
  width: 100%;
  height: 100%;
  padding-top: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const Title = styled.h2`
  font-size: 16px;
  font-weight: 400;
  color: #000;
  text-transform: uppercase;
`

export const TableCellStyled = styled(TableCell)`
  border: 1px solid #D4D4D4;
  color: #4B4B4B !important;

  strong {
    font-size: 12px;
    font-weight: 600;
    color: #4B4B4B;
  }

`;

export const Container = styled.div`
  background-color: #fff;
  border: 1px solid #D4D4D4;
  
  border-top-right-radius: 8px;
  border-top-left-radius: 8px;
`;

export const TableCellBorder = styled(TableCell)`
  border-left: 1px solid #d4d4d4;

  background-color: ${(props) => props.color};

  span {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
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

export const TableRowStyledVar = styled(TableRow)`
  border-top: 1px solid #d4d4d4;
  border-top-left-radius: 30px !important;
`;