import styled from "styled-components";
import TableCell from "@mui/material/TableCell";

export const Container = styled.div`
  background-color: #fff;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.1);

  > footer {
    display: flex;
    justify-content: space-between;
    padding: 30px 20px;
  }
`;

export const TopContainer = styled.div`
  //margin-top: 40px;
  padding: 15px 15px 5px 15px;

  h3 {
    font-weight: 700;
    font-size: 16px;
    line-height: 19px;
    margin: 5px 0 15px 0;
  }
`;

export const TableCellBorderWidth = styled(TableCell)`
  border-left: 1px solid #d4d4d4;
  min-width: 150px;
`;
