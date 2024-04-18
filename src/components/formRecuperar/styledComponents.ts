import styled from "styled-components"
import { Form } from "react-bootstrap";
import { MdMailOutline } from "react-icons/md";

export const InputLogin = styled(Form.Control)`
  background-color: #F5F5F5;
  padding-right: 40px;
`
export const IconMail = styled(MdMailOutline)`
  position: 'absolute';
  margin-left: -35px;
`

export const A = styled.a`  
  color: #20423D !important;
  text-decoration: none !important;
  cursor: pointer;

  &:hover{
    text-decoration: none !important;
    color: #20423D !important;
  }
`