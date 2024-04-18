import styled from "styled-components";
import TableCell from "@mui/material/TableCell";
import TableSortLabel from "@mui/material/TableSortLabel";
import { Button } from "react-bootstrap";
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

export const FilterSelectedContainer = styled.div`
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
  background-color: #f4f2ff;
  padding-left: 30px;
  width: 392px;
`;

export const IconSearch = styled(MdSearch)`
  position: "absolute";
  margin-right: -25px;
`;

export const TableCellBorder = styled(TableCell)`
  border-left: 1px solid #d4d4d4;
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
  &:not(.disable-hover) {
    &:hover {
      background-color: #5ec2b1;
    }
  }
`;

export const ActiveTag = styled.div`
  width: 100%;
  border-radius: 10px;
  height: 24px;
  color: ${(props) => (props.active ? "#007F00" : "#FF6868")};
  background-color: ${(props) => (props.active ? "#EAF2E6" : "#FFE0E0")};
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: space-around;
`;

export const PointActiveTag = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: ${(props) => (props.active ? "#007F00" : "#FF6868")};
`;


