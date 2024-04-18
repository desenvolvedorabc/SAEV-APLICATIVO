import styled from "styled-components";
import { Form } from "react-bootstrap";

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

export const List = styled.div`
  color: #000;
  border-top: 1px solid #989898;
  border-bottom: 1px solid #989898;
`;

export const ListOverflow = styled.div`
  max-height: 320px;
  overflow: auto;
`;

export const SelectionSide = styled.div`
  // background-color: #fff;
  // padding: 17px;
  width: 285px;
`;

export const CardSelectionSide = styled.div`
  background-color: #fff;
  padding: 17px;
  height: 710px;
  margin-bottom: 11px;
`;

export const CardButtons = styled.div`
  background-color: #fff;
  padding: 17px;
  display: flex;
  justify-content: space-between;
  margin-top: 14px;
`;

export const Title = styled.div`
  color: #000;
  margin-bottom: 13px;
`;

export const MessageSide = styled.div`
  background-color: #fff;
`;

export const ButtonDest = styled.button`
  background-color: #f2f0f9;
  padding: 7px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
`;

export const ButtonDestList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  grid-gap: 7px;
  // background-color: #fff;
  // padding: 10px 20px;
  // margin-bottom: 12px;
`;

export const TopMessage = styled.div`
  padding: 14px 16px;
`;

export const ButtonArea = styled.button`
  border-radius: 4px 4px 0px 0px;
  border: none;
  height: 50px;
  width: 137px;

  ${(props) =>
    props.active
      ? `
    background-color: #FFF;
    color: #3E8277;
    `
      : `
    background-color: #D4D4D4;
    color: #4B4B4B;
    display: flex;
    align-items: center;
    justify-content: center;
    `};
`;

export const ButtonCard = styled.div`
  background-color: #fff;
  padding: 8px 17px;

`