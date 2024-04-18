import styled from "styled-components"

export const BorderRight = styled.div`
  border-right: 1px solid #d5d5d5;
`;

export const CardStyled = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  border-radius: 4px;
  background-color: #fff;
  padding: 1rem;
  margin-bottom: 20px;
`;

export const Title = styled.div`
  font-size: 11px;
  color: ${(props) => props.color};
  padding: 0 5px;
`;