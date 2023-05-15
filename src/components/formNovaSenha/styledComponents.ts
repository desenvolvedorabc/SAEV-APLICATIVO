import styled from "styled-components";
import { Form } from "react-bootstrap";
import { MdMailOutline, MdLock } from "react-icons/md";

export const BoxPassword = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  margin-bottom: 25px;
`;
export const BoxItem = styled.div`
  text-align: start;
  flex-direction: row;
  font-size: 14px;
`;

export const IconLock = styled(MdLock)`
  position: "absolute";
  margin-left: -35px;
`;
export const InputLogin = styled(Form.Control)`
  background-color: #f5f5f5;
  padding-right: 40px;
`;
export const TitlePassword = styled.div`
  text-align: start;
  font-size: 14px;
`;
