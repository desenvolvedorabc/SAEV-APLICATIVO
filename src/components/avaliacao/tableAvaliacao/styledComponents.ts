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
  border-radius: 10px;
  border-bottom-right-radius: 50px;
  border-bottom-left-radius: 50px;
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.1);
`;

export const TopContainer = styled.div`
  margin-top: 15px;
  padding: 15px 10px 5px 10px;
  display: flex;
  justify-content: space-between;
`;

export const ButtonMun = styled.button`
  background-color: transparent;
  border: none;
  height: 100%;
  width: 100%;
  color: #3b51c7;

  &:hover {
    color: #3b51c7;
    background-color: transparent;
    border: none;
  }

  &:active {
    background-color: transparent;
    border: none;
  }
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
