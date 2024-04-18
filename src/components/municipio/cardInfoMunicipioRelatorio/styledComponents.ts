import { ListSubheader, MenuItem } from "@mui/material";
import styled from "styled-components";

export const CardStyled = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  border-radius: 4px;
  background-color: #fff;
  padding: 1rem;
  border-top: 5px solid #007f00;
  margin-bottom: 20px;
`;

export const Indicators = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

export const City = styled.div`
  font-size: 1rem;
`;

export const Address = styled.div`
  font-size: 0.9rem;
`;

export const Circle = styled.div`
  height: 20px;
  width: 20px;
  background-color: ${(props) => props.color};
  border-radius: 50%;
`;

export const BorderRight = styled.div`
  border-right: 1px solid #d5d5d5;
`;

export const ListSubheaderStyled = styled(ListSubheader)`
  color: #3e8277;
  font-weight: 600;
  font-size: 12px;
`;

export const MenuItemStyled = styled(MenuItem)`
  font-weight: 400;
  font-size: 16px;
  color: #7c7c7c;
`;

export const Number = styled.div`
  font-weight: 400;
  font-size: 21px;
  margin-left: 7px;
`;
