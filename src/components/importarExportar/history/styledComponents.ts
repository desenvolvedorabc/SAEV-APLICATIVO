import styled from "styled-components";
import TableCell from "@mui/material/TableCell";
import TableSortLabel from "@mui/material/TableSortLabel";
import { Button, Form } from "react-bootstrap";
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

export const Container = styled.div`
  background-color: #fff;
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.1);
  margin-top: 14px;
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

export const Title = styled.div`
  color: #000;
  font-weight: 700;
`;

export const Status = styled.div`
  background-color: ${(props) =>
    props.color === "SUCCESS"
      ? "#CDFFCD"
      : props.color === "ERROR"
      ? "#FFE0E0"
      : "#E8E01D"};
  color: ${(props) =>
    props.color === "SUCCESS"
      ? "#007F00"
      : props.color === "ERROR"
      ? "#D30000"
      : "#000"};
  border-radius: 10px;
  text-align: center;
  padding-top: 2px;
  padding-bottom: 2px;
`;

export const ButtonDelete = styled.button`
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

export const Text = styled.div`
  max-height: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 12px;
`;

export const ButtonDownload = styled.a`
  background-color: transparent;
  border: none;
  height: 100%;
  width: 100%;
  cursor: pointer;

  &:hover {
    color: #0a58ca;
    background-color: transparent;
    border: none;
  }

  &:active {
    background-color: transparent;
    border: none;
  }
`;
