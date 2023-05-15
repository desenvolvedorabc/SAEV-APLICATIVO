import { scaleBetween } from "src/utils/scaleBetween";
import styled from "styled-components";

export const Bar = styled.div`
  width: ${(props) => scaleBetween(props.width, 0, 100, 0, 100)}%;
  height: 20px;
  background-color: #5ec2b1;
  border-radius: 5px;
  margin-right: 6px;
`;

export const BarBox = styled.div`
  flex: auto;
  width: auto;
  background-color: #f6f6f6;
  padding: 7px 3px 7px 0;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  display: flex;
  align-items: center;
`;

export const Nome = styled.div`
  background-color: #f6f6f6;
  padding: 7px 0px 7px 8px;
  display: flex;
  padding-right: 10px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;

  direction: ltr;
  max-width: 30%;
  width: 100%;

  > span {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
`;

export const Container = styled.div`
  display: flex;
  align-items: center;
  width: auto;
  cursor: pointer;
  background-color: #f6f6f6;
  height: 38px;
  gap: 10px;
  margin-bottom: 10px;
`;

export const Score = styled.div`
  flex: 1;
`;
