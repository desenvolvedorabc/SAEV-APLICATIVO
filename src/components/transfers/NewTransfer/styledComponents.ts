import { Form } from "react-bootstrap";
import styled from "styled-components";

export const CardSearch = styled.div`
  background-color: #fff;
  padding: 10px 27px 20px 21px;
  margin-bottom: 25px;
`;

export const Title = styled.div`
  font-weight: 700;
  font-size: 16px;
  margin-bottom: 20px;
`;

export const InputGroupCheck = styled(Form.Group)`
  display: flex;
`;

export const FormCheckLabel = styled(Form.Check.Label)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 8px;
`;

export const FormCheck = styled(Form.Check)`
  display: flex;
  align-items: center;
  justify-items: start;
  font-size: 14px;
  color: #000;
`;
