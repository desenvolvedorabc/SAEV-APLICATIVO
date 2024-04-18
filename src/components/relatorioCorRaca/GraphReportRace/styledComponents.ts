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
