import styled from "styled-components";
import { Form } from "react-bootstrap";
import { MdSearch } from "react-icons/md";

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

export const List = styled.div`
  color: #000;
  border-top: 1px solid #989898;
  border-bottom: 1px solid #989898;
`;

export const ListOverflow = styled.div`
  max-height: 320px;
  overflow: auto;
`;

export const Status = styled.div`
  background-color: #e6e6f2;
  width: 150px;
  padding: 2px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: space-around;
`;

export const Circle = styled.div`
  background-color: #4a4aff;
  height: 6px;
  width: 6px;
  border-radius: 50%;
  margin: 0 2px;
`;

export const Text = styled.div`
  color: #4a4aff;
`;

export const MdSearchStyled = styled(MdSearch)`
  margin-right: -20px;
  position: relative;
  left: 10px;
  z-index: 2;
`;

export const Pesquisar = styled(Form.Control)`
  padding-left: 35px;
  background-color: #f4f2ff;
`;
