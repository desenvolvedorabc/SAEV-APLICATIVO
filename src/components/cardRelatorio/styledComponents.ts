import styled from "styled-components";

export const CardRelatorioStyled = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background-color: #fff;
  border: 1px solid #F2F0F9;
  height: 140px;
`;

export const Numeros = styled.div`
  color: ${(props) => props.color};
  font-size: 21px;
`;

export const TextoCard = styled.div`
  font-size: 14px;
`;
