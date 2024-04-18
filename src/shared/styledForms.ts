import styled from "styled-components";
import { Form, Button } from "react-bootstrap";
import { ButtonPadrao } from "src/components/buttons/buttonPadrao";

export const InputGroup3Dashed = styled(Form.Group)`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 10px;
  padding-bottom: 30px;
  padding-top: 30px;
  border-bottom: 1px dashed #d5d5d5;
`;

export const InputGroup3 = styled(Form.Group)`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 10px;
  padding-top: 30px;
  padding-bottom: ${(props) => (props.paddingBottom ? "30px" : "0px")};
`;

export const ButtonDisable = styled(Button)`
  background-color: #ff6868;
  width: 100%;
  border: none;
  font-size: 13px;
  min-height: 40px;

  &:hover {
    background-color: #943030;
  }
  &:active {
    background-color: #943030;
  }
  &:focus {
    background-color: #943030;
  }

  &:disabled {
    background-color: #d5d5d5;
  }
`;

export const InputGroup2 = styled(Form.Group)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 10px;
  padding-bottom: ${(props) => (props.paddingBottom ? "30px" : "0px")};
`;

export const Circle = styled.div`
  height: 20px;
  width: 20px;
  background-color: ${(props) => props.color};
  border-radius: 50%;
`;

export const ButtonGroupBetween = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 30px;
  border-top: 1px solid #d5d5d5;
`;

export const ButtonGroupEnd = styled.div`
  display: flex;
  justify-content: end;
  padding-top: 30px;
  border-top: 1px solid #d5d5d5;
`;

export const Card = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;

  &.reset {
    background-color: transparent;
    border-radius: 0;
    padding: 0;
    .card-box {
      margin-bottom: 16px;
      background-color: #fff;
      border-radius: 10px;
      padding: 20px;
    }
  }
`;

const getColor = (props) => {
  if (props.isDragAccept) {
    return "#00e676";
  }
  if (props.isDragReject) {
    return "#ff1744";
  }
  if (props.isFocused) {
    return "#2196f3";
  }
  return "#eeeeee";
};

export const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-width: 2px;
  border-radius: 2px;
  border-color: ${(props) => getColor(props)};
  border-style: dashed;
  background-color: #fafafa;
  color: #bdbdbd;
  outline: none;
  transition: border 0.24s ease-in-out;
`;

export const ButtonNoBorder = styled.button`
  background-color: white;
  border: none;
  margin-top: 3px;
  font-size: 0.9rem;
`;

export const FormCheck = styled(Form.Check)`
  display: flex;
  align-items: center;
  border-bottom: 1px solid #d5d5d5;
`;

export const FormSelect = styled(Form.Select)`
  height: 40px;
`;
