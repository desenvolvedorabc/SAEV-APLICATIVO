import styled from "styled-components";
import { Form } from "react-bootstrap";

export const ButtonArea = styled.button`
  border-radius: 4px 4px 0px 0px;
  border: none;
  height: 50px;
  width: 135px;

  ${(props) =>
    props.active
      ? `
    background-color: #3E8277;
    color: #FFF;
    `
      : `
    background-color: #D4D4D4;
    color: #4B4B4B;
    display: flex;
    align-items: center;
    justify-content: center;
    `};
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 30px;
  border-top: 1px solid #d5d5d5;
  margin-top: 20px;
`;
export const Card = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
`;