import styled from "styled-components";
import TableCell from "@mui/material/TableCell";
import TableSortLabel from "@mui/material/TableSortLabel";
import { Button, Popover } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { MdSearch } from "react-icons/md";
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

export const TableSortLabelStyled = styled(TableSortLabel)`
  background-color: #e0f1e0 !important;
  color: #68936a !important;
  font-weight: 600;
`;

export const Circle = styled.div`
  height: 20px;
  width: 20px;
  background-color: ${(props) => props.color};
  border-radius: 50%;
  margin: auto;
`;

export const Container = styled.div`
  background-color: #fff;
  border-radius: 4px;
  border-bottom-right-radius: 50px;
  border-bottom-left-radius: 50px;
`;

export const Title = styled.div`
  padding: 27px;
  color: #000;
  font-weight: 500;
  font-size: 21px;
`;

export const TopContainer = styled.div`
  padding: 15px 10px 5px 10px;
  display: flex;
  justify-content: space-between;
  border-radius: 4px;
`;

export const FilterSelectedContainer = styled.div`
  background-color: #f2f0f9;
  display: flex;
  padding: 10px;
  align-items: end;
`;

export const FilterStatusContainer = styled.div`
  background-color: #f2f0f9;
  display: flex;
  padding: 10px;
  align-items: end;
`;

export const ButtonStyled = styled(Button)`
  background-color: #fff;
  border: 1px solid #20423d;
  color: #3e8277;
  margin-left: 10px;
`;

export const Marker = styled(Button)`
  background-color: #5ec2b1;
  padding: 5px 7px;
  border: none;
  margin-right: 20px;
`;

export const InputSearch = styled(Form.Control)`
  background: #f4f2ff;
  padding-left: 30px;
  width: 400px;
  margin-left: 21px;
`;

export const IconSearch = styled(MdSearch)`
  position: "absolute";
  margin-right: -51px;
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

export const PopoverStyled = styled(Popover)`
  padding: 6px 14px;
`;
