import styled from "styled-components";
import { Form } from "react-bootstrap";

export const InputGroupCheck = styled(Form.Group)`
  display: flex;
  flex-direction: column;
`;

export const BoxLeft = styled(Form.Check)`
  border-right: 1px solid #d5d5d5;
  padding-right: 50px;
`;

export const FormCheckLabel = styled(Form.Check.Label)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 8px;
`;
