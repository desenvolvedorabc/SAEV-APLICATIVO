import styled from "styled-components";
import { Form } from "react-bootstrap";

export const ButtonExcluir = styled.button`
  background-color: transparent;
  height: 100%;
  width: 100%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const FormCheck = styled(Form.Check)`
  display: flex;
  align-items: center;
  border-bottom: 1px solid #d5d5d5;
  padding: 11px 21px;
`;

export const FormCheckLabel = styled(Form.Check.Label)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 8px;
`;

export const Card = styled.div`
  background-color: #fff;
  border-top: 8px #3e8277 solid;
`;

export const AvailableSide = styled.div`
  background-color: #f2f0f9;
  border-right: 1px solid #3e8277;
`;

export const AddSide = styled.div`
  background-color: #fff;
`;

export const Title = styled.div`
  color: #000;
  margin-bottom: 12px;
`;

export const TestList = styled.div`
  color: #000;
  border-top: 1px solid #989898;
  border-bottom: 1px solid #989898;
`;

export const TestListOverflow = styled.div`
  max-height: 420px;
  overflow: auto;
`;
