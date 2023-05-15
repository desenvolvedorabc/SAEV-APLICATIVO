import styled from "styled-components";

export const Container = styled.div`
  height: 90px;
  padding: 0 1rem !important;
  background-color: #f6f6f6;
  text-align: center;
  border-radius: 4px;
  margin-bottom: 26px;

  display: flex;
  align-items: center;
  gap: 2rem;

  > p {
    color: #20423d;
    font-weight: 700;
  }

  > div {
    flex: 1;
    background: #d5d5d5;
    border-radius: 5px;
    height: 20px;

    display: flex;
    align-items: center;
    position: relative;

    > div {
      width: 13px;
      height: 13px;
      border: 2px solid #ffffff;
      border-radius: 50%;

      position: absolute;

      &.min {
        background-color: #ff6868;
        color: #ff6868;
      }

      &.media {
        background-color: #3b51c7;
        color: #3b51c7;
      }

      &.max {
        background-color: #3e8277;
        color: #3e8277;
      }

      > p {
        position: absolute;
        top: -28px;
        left: -5px;
        font-weight: 600;
        font-size: 15px;
      }
    }
  }
`;
