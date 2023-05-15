import styled from "styled-components";

export const Container = styled.div`
  > div {
    display: flex;

    span {
      width: 40px;
      height: 40px;
      border: 1px solid #d5d5d5;
      font-weight: 400;
      font-size: 15px;
      color: #4b4b4b;
      display: flex;
      align-items: center;
      justify-content: center;

      &:first-child {
        background: #e0f1e0;
        color: #3e8277;
        border-radius: 4px 0px 0px 4px;
        border: 0;
        font-weight: 700;
      }

      &.checked {
        border: 1px solid #d5d5d5;
        color: #ffffff;
        background: #3e8277;
      }

      &:nth-child(2) {
        width: 200px;
        cursor: pointer;
      }
    }
  }

  &.disable {
    span {
      cursor: not-allowed !important;

      opacity: 0.8;
    }
  }
`;
