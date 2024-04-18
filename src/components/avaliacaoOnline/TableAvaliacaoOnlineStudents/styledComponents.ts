import styled from "styled-components";
import TablePagination from "@mui/material/TablePagination";
import TableCell from "@mui/material/TableCell";
import TableSortLabel from "@mui/material/TableSortLabel";
import { Button } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { MdSearch } from "react-icons/md";
import Link from "next/link";
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

export const Container = styled.div`
  background-color: #fff;
  border-bottom-right-radius: 50px;
  border-bottom-left-radius: 50px;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.1);
`;

export const TopContainer = styled.div`
  //margin-top: 40px;
  padding: 15px 10px 5px 10px;
  display: flex;
  justify-content: space-between;
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
  width: 300px;
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
  &:hover {
    background-color: #5ec2b1;
  }
`;

export const Status = styled.div`
  background-color: ${(props) => (props.available ? "#E6E6F2" : "#CDFFCD")};
  width: 150px;
  padding: 2px;
  border-radius: 20px;
  display: flex;
  align-items: center;
`;

export const Circle = styled.div`
  background-color: ${(props) => (props.available ? "#4A4AFF" : "#CDFFCD")};
  height: 6px;
  width: 6px;
  border-radius: 50%;
  margin: 0 5px;
`;

export const Text = styled.div`
  text-align: center;
  width: 100%;
  color: ${(props) => (props.available ? "#4A4AFF" : "#007F00")};
`;

export const ButtonStart = styled.button`
  width: 178px;
  height: 34px;
  border-radius: 4px;
  border: 1px solid #3e8277;
  color: #3e8277;
  font-size: 12px;
  text-align: center;
  cursor: pointer;

  &:disabled {
    color: #d4d4d4;
    border: 1px solid #d4d4d4;
    cursor: default;
  }
`;
