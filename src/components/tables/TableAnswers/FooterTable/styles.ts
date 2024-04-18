import styled from "styled-components";

export const Container = styled.footer`
  display: flex;
  justify-content: space-between;

  background: #ffffff;
  height: 46px;
  border: 1px solid #d5d5d5;
  border-radius: 4px;
  padding: 0 20px;

  color: #4b4b4b;

  > div {
    display: flex;
    align-items: center;
    gap: 2rem;

    > div {
      display: flex;
      align-items: center;
      gap: 10px;

      > span {
        width: 1.25rem;
        display: inline-block;
        height: 1.25rem;
        border: 1px solid #4B4B4B;
      }
    }
  }

  > button {
    text-decoration: underline;
  }
`;
