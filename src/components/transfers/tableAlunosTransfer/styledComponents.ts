import styled from "styled-components";
import TableCell from "@mui/material/TableCell";

export const Container = styled.div`
  background-color: #fff;
  border-bottom-right-radius: 50px;
  border-bottom-left-radius: 50px;
  // border-top-right-radius: 10px;
  // border-top-left-radius: 10px;
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.1);
`;

export const TopContainer = styled.div`
  //margin-top: 40px;
  padding: 15px 10px 5px 10px;
  display: flex;
  justify-content: space-between;
`;

export const TableCellBorderWidth = styled(TableCell)`
  border-left: 1px solid #d4d4d4;
  min-width: 150px;
`;
