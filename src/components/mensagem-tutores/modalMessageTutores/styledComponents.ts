import styled from "styled-components";

export const Data = styled.div`
  font-size: 14px;
`;

export const Text = styled.p`
  width: 100%;
  word-wrap: break-word;
`;

export const BoxDestinatario = styled.div`
  height: 230px;
  border: 1px solid #D5D5D5;
  border-radius: 8px !important;
  padding: 10px;
  margin-bottom: 10px;
  overflow: auto;
`;

export const LineBox = styled.tr`
  margin-bottom: 10px;
`;

export const Status = styled.td`
  color: ${props => props.color === 'FALHOU' || props.color === 'NAO_ENVIADO' ? '#D30000' : props.color === 'PENDENTE' ? '#FFA500' : '#007F00'};
  text-align: center;
`;