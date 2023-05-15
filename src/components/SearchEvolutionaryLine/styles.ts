import styled from "styled-components";
import { Form } from "react-bootstrap";

export const Container = styled.div`
  display: flex;
  background: #ffffff;
  padding: 11px 24px;

  margin-bottom: 12px;

  > button {
    width: 12%;
  }
`;

export const FormStyled = styled(Form)`
  flex: 1;
`;

export const SelectStyled = styled(Form.Select)`
  width: 140px;
`;

export const Button = styled.div`
  background-color: transparent;
  height: 35px;
  border: none;
  border-radius: 4px;
  margin-left: -30px;
  padding: 0;
  display: flex;
  align-items: center;
`;

export const ButtonClose = styled.button`
  background-color: #fff;
  height: 35px;
  width: 35px;
  border: none;
  padding: 0;
`;

export const RespBox = styled.div`
  position: absolute;
  top: 38px;
  width: 850px;
  z-index: 3;
  background-color: #fff;
  padding: 10px;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
  max-height: 350px;
  overflow: auto;
  border: 1px solid #ccc;
  border-radius: 3px;
`;

export const Title = styled.div`
  padding-bottom: 5px;
`;

export const Text = styled.div`
  padding: 5px 3px;
  border-radius: 3px;

  &:hover {
    background-color: #5ec2b1;
  }
`;
