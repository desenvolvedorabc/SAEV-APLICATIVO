import styled from "styled-components";

export const BoxFilter = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-gap: 21px;
  background-color: #f2f0f9;
  border: 1px solid #fff;
  padding: 15px 10px;
  margin-bottom: 24px;
`;

export const BoxSelect = styled.div`
  ${(props) => (props.border ? "border-right: 1px solid #fff" : null)};
  padding-right: 20px;
`;
