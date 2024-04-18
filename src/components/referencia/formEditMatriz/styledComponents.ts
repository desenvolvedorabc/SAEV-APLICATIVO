import styled from "styled-components";
import { Form } from "react-bootstrap";
import { Select } from "@material-ui/core";

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

export const ButtonAdicionar = styled.button`
  background-color: #64bc47;
  border-radius: 4px;
  height: 40px;
  width: 40px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ButtonAddTopico = styled.button`
  background-color: #f2f0f9;
  border-radius: 4px;
  height: 85px;
  width: 100%;
  border: 1px dashed #d4d4d4;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`;

export const SelectMultiple = styled(Select)`
  padding: 0px;
  & > div {
    padding: 8.5px;
  }
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
`;

export const InputGroup = styled(Form.Group)`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 100px;
  grid-gap: 10px;
  padding-bottom: 10px;
  padding-top: 10px;
`;

export const InputGroup2 = styled(Form.Group)`
  padding-bottom: 20px;
  padding-top: 20px;
  border-bottom: 1px solid #d5d5d5;
  margin-bottom: 20px;
`;

export const AddInputGroup = styled(Form.Group)`
  display: flex;
  padding-bottom: 10px;
`;

export const RepeatableInput = styled(Form.Group)`
  display: flex;
  padding-bottom: 10px;
`;

export const InputControl = styled(Form.Control)`
  &:disabled {
    background-color: #fff;
    color: #ababab;
    border: 1px dashed #ababab;
  }
`;

export const FormSelect = styled(Form.Select)`
  height: 40px;
`;
