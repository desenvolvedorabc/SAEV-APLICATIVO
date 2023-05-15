import styled from "styled-components";

export const Container = styled.div`
  background-color: #fff;
  padding: 10px 25px;

  > h3 {
    margin-bottom: 24px;
    margin-top: 32px;
    font-weight: 700;
    font-size: 16px;
    line-height: 19px;

    color: #000000;
  }

  > div:nth-child(1) {
    padding: 0;
  }

 > header {
    border-bottom: 1px solid #d5d5d5;
    display: flex;
    justify-content: space-between;
    align-items: center;

    h2 {
      font-size: 16px;
      line-height: 19px;

      color: #22282c;
    }
    > div:nth-child(1) {
      padding: 0;
    }

    p {
      font-weight: 400;
      font-size: 14px;
      background: #e0f1e0;
      border-radius: 4px;
      max-width: 330px;
      padding: 5px;
      color: #20423d;
      margin-bottom: 0;
    }
  }
`;
