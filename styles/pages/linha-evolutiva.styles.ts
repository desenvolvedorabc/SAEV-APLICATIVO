import styled from "styled-components";

export const ContentButton = styled.div`
  display: flex;
  gap: 10px;

  > button {
    padding: 13px 30px;
    background: #d5d5d5;
    font-weight: 400;
    font-size: 16px;
    border-radius: 4px 4px 0px 0px;

    &.active {
      color: #3E8277;
      background: #FFFFFF;
    }
  }
`;
