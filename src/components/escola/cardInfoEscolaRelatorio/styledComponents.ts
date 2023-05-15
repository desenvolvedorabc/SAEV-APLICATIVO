import styled from "styled-components";

export const CardStyled = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  border-radius: 4px;
  background-color: #fff;
  padding: 1rem;
  border-top: 5px solid #007f00;
  margin-bottom: 20px;
`;

export const Indicators = styled.div`
  display: grid;
  // grid-template-columns: 1fr 1fr 1fr;
  grid-template-columns: 1fr 1fr;
`;

export const Indicators2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

export const City = styled.div`
  font-size: 1rem;
`;

export const BorderRight = styled.div`
  border-right: 1px solid #d5d5d5;
`;

export const BorderBottom = styled.div`
  padding-top: 5px;
  border-bottom: 1px solid #d5d5d5;
  margin-bottom: 5px;
  width: 70%;
`;

export const Title = styled.div`
  font-size: 11px;
  color: ${(props) => props.color};
  padding: 0 5px;
`;

export const Number = styled.div`
  font-weight: 400;
  font-size: 21px;
  margin-left: 7px;
`;
