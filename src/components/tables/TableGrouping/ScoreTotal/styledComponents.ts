import { scaleBetween } from "src/utils/scaleBetween";
import styled from "styled-components";

export const Bar = styled.div`
  height: 20px;
  background-color: #3e8277;
  border-radius: 5px;
  margin-right: 6px;
`;

export const BarBox = styled.div`
  height: 20px;
flex: 1;
  background: #d5d5d5;
  border-radius: 5px;
`;

export const Nome = styled.div`
  background-color: #f6f6f6;
  text-transform: uppercase;

  color: #3e8277;
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
`;

export const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  height: 38px;
  width: 100%;
  background: #f6f6f6;
  padding: 0 10px;
  border-radius: 4px;
`;

export const Score = styled.div`
  display: flex;
`;
