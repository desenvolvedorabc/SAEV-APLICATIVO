import styled from "styled-components";

export const Container = styled.div`
  display: flex;

  span {
    width: 35px;
    height: 30px;
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

    &:not(:first-child) {
      cursor: pointer;
    }

    &.checked {
      border: 1px solid #d5d5d5;
      color: #ffffff;
      background: #3e8277;
    }

    &:last-child {
      border-radius: 0px 4px 4px 0px;
    }
  }

  &.disable {
    span {
      cursor: not-allowed;

      opacity: 0.8;
    }
  }
`;
