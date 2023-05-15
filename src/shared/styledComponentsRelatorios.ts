import styled from "styled-components";
import Image from "next/image";

export const CardStyled = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 4px;
  background-color: #fff;
  padding: 1rem;
  margin-bottom: 20px;
`;

export const Name = styled.div`
  font-size: 24px;
  margin-bottom: 10px;
`;

export const Role = styled.div`
  font-size: 0.9rem;
  color: #7c7c7c;
  margin-bottom: 16px;
`;

export const Logo = styled.div`
  border: 9px solid #f6f6f6 !important;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.15);
  width: 180px;
  height: 180px;
`;

export const DivInfos = styled.div`
  border-right: 1px dashed #d5d5d5;
`;

export const ButtonSubject = styled.button`
  padding-bottom: 10px;
  margin-right: 10px;
  margin-left: 10px;
  color: #7c7c7c;
  ${(props) =>
    props.active ? "border-bottom: 1px solid #3e8277; color: #3e8277;" : null}

  &:hover {
    border-bottom: 1px solid #3e8277;
    color: #3e8277;
  }
`;
