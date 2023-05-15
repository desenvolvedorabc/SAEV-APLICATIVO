import styled from "styled-components";
import { Form } from "react-bootstrap";

export const InputGroup = styled(Form.Group)`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 10px;
  padding-bottom: ${(props) => props.padding || 30}px;
  padding-top: ${(props) => props.padding || 30}px;
  border-bottom: 1px dashed #d5d5d5;
`;

export const InputGroup2 = styled(Form.Group)`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 10px;
  padding-bottom: 30px;
  padding-top: 30px;
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
  background-color: #fff;
  border: 1px solid #3e8277;
  color: #3e8277;
  border-radius: 4px;
  padding: 8px;

  &:hover {
    background-color: #5ec2b1;
    border: 1px solid #5ec2b1;
  }
`;
