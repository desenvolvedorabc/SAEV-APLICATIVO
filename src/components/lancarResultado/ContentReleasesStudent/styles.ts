import styled from "styled-components";

export const Container = styled.section`
  background: #ffffff;
  padding: 35px 0;

  p {
    margin: 0;
  }

  > footer {
    display: flex;
    justify-content: space-around;
    align-items: center;

    border-top: 1px solid #D5D5D5;
    margin-top: 70px;
    padding: 26px ;

    p {
      font-size: 14px;
      color: #4B4B4B;
    }
  }

  .carousel-control-prev, .carousel-control-next {
    width: 100px;
  }
`;

