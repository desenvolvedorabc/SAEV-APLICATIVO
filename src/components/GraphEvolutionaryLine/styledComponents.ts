import styled from "styled-components";

export const CardStyled = styled.div`
  width: 100%;
  border-radius: 4px;
  background-color: #fff;
  padding: 1rem;
  margin-bottom: 20px;

  h3 {
    font-weight: 500;
    font-size: 21px;
    line-height: 25px;
  }

  > header {
    display: flex;
    margin: 33px 0 21px 0;
    align-items: center;
    justify-content: space-between;
  }

  text.highcharts-credits {
    display: none;
  }
`;

export const Content = styled.div`
  border: 2px solid #e5e5e5;
  border-radius: 4px;
  padding: 15px 30px;
`;

export const ContentSubjects = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  color: #4b4b4b;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;

  p {
    font-weight: 600;
    font-size: 12px;
    line-height: 15px;
    margin: 0;
    color: #3e8277;
  }

  label {
    display: flex;
    align-items: center;
    gap: 5px;

    input[type="checkbox"] {
      position: relative;
      cursor: pointer;
      margin-right: 5px;

      &[type="checkbox"]:before {
        content: "";
        display: block;
        position: absolute;
        width: 18px;
        height: 18px;
        top: -2px;
        border: 2px solid #555555;
        border-radius: 3px;
        background-color: white;
      }

      &[type="checkbox"]:checked:after {
        content: "";
        display: block;
        width: 5px;
        height: 10px;
        border: solid black;
        border-width: 0 2px 2px 0;
        -webkit-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        transform: rotate(45deg);
        position: absolute;
        top: 1px;
        left: 6px;
      }
    }
  }
`;
