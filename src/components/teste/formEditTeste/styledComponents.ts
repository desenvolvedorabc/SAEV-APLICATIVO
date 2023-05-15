import styled from "styled-components";
import { Form } from "react-bootstrap";

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

export const ButtonDownload = styled.a`
  background-color: #fff;
  border-radius: 4px;
  height: 40px;
  width: 40px;
  border: 1px solid #d5d5d5;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ButtonAnswer = styled.button`
  ${(props) =>
    props.active
      ? `
    background-color: #3E8277;
    color: #FFF;
    width: 40px;
    height: 40px;
    border: 1px solid #d5d5d5;
    display: flex;
    align-items: center;
    justify-content: center;
    `
      : `
    background-color: #FFF;
    color: #000;
    width: 40px;
    height: 40px;
    border: 1px solid #d5d5d5;
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
`;

export const Card2 = styled.div`
  background-color: #fff;
  padding: 10px;
  padding-right: 20px;
  margin-bottom: 20px;
`;

export const AnswerNumber = styled.div`
  background-color: #e0f1e0;
  color: #3e8277;
  width: 60px;
  // padding: 20px;
  margin-bottom: 20px;
`;

export const InputGroup = styled(Form.Group)`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 10px;
  padding-bottom: 10px;
  padding-top: 10px;
`;

export const InputGroup2 = styled(Form.Group)`
  display: grid;
  grid-template-columns: 1fr 1fr 2fr;
  grid-gap: 10px;
  padding-bottom: 10px;
`;

export const RepeatableInput = styled(Form.Group)`
  display: flex;
`;

export const FormSelect = styled(Form.Select)`
  height: 40px;
`;
