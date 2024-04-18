import styled from "@emotion/styled";

export const Container = styled.div`
  width: 100%;
  padding: 0.5rem 3rem;
  margin-bottom: 20px;
  border-radius: 4px;
  background-color: #fff;

  header {
    display: flex;
    flex-direction: column;
  }

  h3 {
    font-weight: 500;
    font-size: 18px;
    line-height: 25px;
  }

  h4 {
    font-size: 16px;
    align-self: self-end;

    strong {
      font-weight: 600;
    }
  }

  > header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 33px 0 21px 0;
  }

  text.highcharts-credits {
    display: none;
  }
`