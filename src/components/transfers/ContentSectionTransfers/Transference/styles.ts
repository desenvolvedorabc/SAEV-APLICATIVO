import styled from "styled-components";
import { Button } from "react-bootstrap";

export const Container = styled.div`
  background: #f5f5f5;

  border: 1px solid #d5d5d5;
  border-radius: 5px;
  overflow: hidden;

  p {
    margin: 0;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    padding: 5px 15px;
    border-bottom: 1px solid #d5d5d5;

    div {
      display: flex;
      align-items: center;
      gap: 10px;

      strong {
        color: #3e8277;
      }
    }
  }

  > div {
    display: grid;
    grid-template-columns: 5fr 1fr 5fr 3fr;

    > div {
      border-right: 1px solid #d5d5d5;
      padding: 20px 15px;

      h4 {
        font-weight: 400;
        font-size: 14px;
        line-height: 17px;
      }

      h2 {
        font-weight: 400;
        font-size: 21px;
        line-height: 25px;
      }

      &.flex {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
      }

      &:last-child {
        display: flex;
        flex-direction: row;
        gap: 5px;
        align-items: center;

        p {
          font-weight: 400;
          font-size: 14px;

          &.approved {
            font-weight: 700;
            color: #3e8277;
          }

          &.reproved {
            color: #ff6868;
          }
        }
      }
    }
  }
`;

export const ButtonStyled = styled.button`
  width: 100%;
  font-size: 13px;
  min-height: 40px;
  border-radius: 6px;
  color: #ffffff;

  &:hover {
    filter: brightness(0.8);
  }
`;

export const ButtonStyledLeft = styled.button`
  width: 100%;
  font-size: 13px;
  min-height: 40px;
  border-radius: 6px;
  color: #ffffff;
  text-align: left;

  &:hover {
    filter: brightness(0.8);
  }
`;
