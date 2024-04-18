import styled from "styled-components";
import TableCell from "@mui/material/TableCell";
import { TableRow } from "@mui/material";

export const Pagination = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
  font-size: 0.9rem;
  background-color: #e0f1e0 !important;
  color: #68936a !important;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
  padding: 16px 10px;
`;

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

export const FormSelectStyled = styled.select`
  background-color: #e0f1e0 !important;
  color: #68936a !important;
  border: none;
  width: 50px;
  font-size: 0.9rem;
  text-align: center;
  margin: 0 15px 0 10px;
`;

export const ButtonPage = styled.button`
  background-color: #e0f1e0 !important;
  color: #68936a !important;
  border: none;
  border-radius: 50%;

  &:disabled {
    color: #9dc79f !important;
  }
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

export const Selected = styled(TableCell)`
  border-left: 1px solid #d4d4d4;
  background-color: #D4D4D4;
  text-align: -webkit-center;
`

export const Circle = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 99999px;
  background-color: #989898;
`

export const Row = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`