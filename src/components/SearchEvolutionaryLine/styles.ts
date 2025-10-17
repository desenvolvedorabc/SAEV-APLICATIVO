import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  background: #ffffff;
  padding: 11px 24px;

  margin-bottom: 12px;

  > button {
    width: 12%;
  }
`;


export const FiltersFirstGroup = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  column-gap: 12px;
  padding-bottom: 12px;
`;


export const FiltersSecondaryGroup = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: 12px;
  padding-bottom: 12px;
`;