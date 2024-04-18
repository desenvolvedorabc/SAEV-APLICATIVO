import styled from "styled-components";
import Image from "next/image";
import { MdMailOutline } from "react-icons/md";
import { Form } from "react-bootstrap";

export const Logo = styled.div`
  border: 9px solid #f6f6f6 !important;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.15);
  width: 180px;
  height: 180px;
`;

export const Button = styled.button`
  border: none;
  background-color: #fff;
  padding: 10px;
`;

export const InputLogin = styled(Form.Control)`
  background-color: #f5f5f5;
  //padding-right: 40px;
`;

export const BoxPassword = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  margin-bottom: 20px;
  font-size: 14px;
`;
export const BoxItem = styled.div`
  text-align: start;
  flex-direction: row;
`;

export const ButtonEye = styled.button`
  position: "absolute";
  margin-left: -35px;
  border: none;
  background-color: transparent;
`;
