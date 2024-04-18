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

export const ButtonAnswer = styled.button`
  width: 40px;
  height: 40px;
  border: 1px solid #d5d5d5;
  display: flex;
  align-items: center;
  justify-content: center;

  ${(props) =>
    props.active
      ? `
        background-color: #3E8277;
        color: #FFF;
        `
      : `
        background-color: #FFF;
        color: #000;
    `};
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: end;
  padding-top: 30px;
  border-top: 1px solid #d5d5d5;
  margin-top: 20px;
`;

export const Card = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 30px;
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
  grid-template-columns: 1fr 1fr;
  column-gap: 20px;
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

export const File = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const FileText = styled.div`
  border: 1px solid #adb5bd;
  border-right: none;
  padding: 7.5px 15px;
  border-radius: 3px;
  margin-right: -2px;
  width: 400px;
`;

export const Page = styled.div`
  width: 130px;
  font-size: 24px;
  font-weight: 500;
`;

export const Line = styled.div`
  border-top: 1px solid #d5d5d5;
  width: 100%;
`;

export const PageNumbers = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 30px;
`;

export const ButtonTen = styled.button`
  background-color: #fff;
  border-radius: 50%;
  border: 1px solid #3e8277;
  height: 27px;
  width: 27px;
  color: #3e8277;
  font-size: 10px;
  font-weight: 600;
  margin: 0 2.5px;

  &:disabled {
    border: 1px solid #dedede;
    color: #dedede;
  }
`;

export const ButtonPage = styled.button`
  background-color: ${(props) => (props.active ? "#3e8277" : "#fff")};
  border-radius: 50%;
  border: 1px solid ${(props) => (props.active ? "#fff" : "#3e8277")};
  height: 34px;
  width: 34px;
  color: ${(props) => (props.active ? "#fff" : "#3e8277")};
  font-weight: 600;
  font-size: 15px;
  margin: 0 2.5px;
`;

export const ButtonDelete = styled.button`
  background-color: #f2f0f9;
  border-radius: 4px;
  height: 40px !important;
  width: 40px !important;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 16px;
`;
