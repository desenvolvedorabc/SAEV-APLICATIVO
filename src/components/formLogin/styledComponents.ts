import styled from "styled-components";
import { Form } from "react-bootstrap";
import { MdMailOutline, MdLock } from "react-icons/md";

export const InputLogin = styled(Form.Control)`
  background-color: #f5f5f5;
  padding-right: 40px;
`;

export const IconLock = styled(MdLock)`
  position: "absolute";
  margin-left: -35px;
`;

export const IconMail = styled(MdMailOutline)`
  position: "absolute";
  margin-left: -35px;
`;

export const A = styled.a`
  color: #20423d !important;
  text-decoration: none !important;
  cursor: pointer;

  &:hover {
    text-decoration: none !important;
    color: #20423d !important;
  }
`;
