import styled from "styled-components";

export const CardStyled = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 4px;
  background-color: #fff;
  padding: 20px 24px 30px 20px;
  margin-bottom: 20px;
`;

export const Name = styled.div`
  font-size: ${props => props.nameSize}px;
  margin-bottom: ${props => props.nameMarginBottom}px;
`;

export const Role = styled.div`
  font-size: 0.9rem;
  color: #7c7c7c;
  margin-bottom: 16px;
`;
export const Infos = styled.div`
  // font-size: 0.9rem;
`;

export const Logo = styled.div`
  border: 9px solid #f6f6f6 !important;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.15);
  width: ${props => props.size}px;
  height: ${props => props.size}px;
`;

export const DivInfos = styled.div`
  border-right: 1px dashed #d5d5d5;
`;
