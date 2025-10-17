import styled from "styled-components";
import { Form } from "react-bootstrap";
import { Select } from "@mui/material";

export const InputGroup = styled(Form.Group)`
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-gap: 10px;
  padding-top: 30px;
`;

export const SelectMultiple = styled(Select)`
  padding: 0px;
  & > div {
    padding: 8.5px;
  }
`;

export const Title = styled.div`
  font-weight: bold;
  margin: 30px 0px;
`;

export const ButtonExcluir = styled.button`
  background-color: #f2f0f9;
  border-radius: 4px;
  height: 40px;
  width: 40px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const RepeatableInput = styled(Form.Group)`
  display: flex;
`;

export const Card2 = styled.div`
  background-color: #fff;
  padding: 10px;
  padding-right: 20px;
  margin-bottom: 20px;
`;

export const ButtonAddTopico = styled.button`
  background-color: #f2f0f9;
  border-radius: 4px;
  height: 60px;
  width: 100%;
  border: 1px dashed #d4d4d4;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;