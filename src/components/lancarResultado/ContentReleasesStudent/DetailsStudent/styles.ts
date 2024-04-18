import styled from "styled-components";

export const Container = styled.div`
  border: 1px solid #989898;
  border-radius: 5px;
  margin: 0 120px;
  z-index: 9999;
  margin-bottom: 35px;

  header {
    background: #f5f5f5;
    padding: 15px;

    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 5px;

    p {
      span {
        font-weight: 700;
        color: #3e8277;
      }
    }
  }

  footer {
    padding: 15px 20px;
    p {
      font-weight: 400;
      font-size: 11px;
      line-height: 13px;
      color: #7c7c7c;
    }
  }
`;

export const DetailsStudent = styled.div`
  padding: 12px 15px;
  display: flex;
  margin-bottom: 10px;

  > div {
    width: 50%;
  }

  div:nth-child(1) {
    display: flex;
    gap: 10px;
    align-self: center;

    > div:nth-child(2) {
      flex: 1;
    }
  }

  > div:nth-child(2) {
    padding-left: 70px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    border-left: 1px solid #989898;
  }
`;

export const ContentQuestions = styled.div`
  padding: 10px 20px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: ${(props) =>
    props.quantity === 2 ? "start" : "space-between"};  
  
  > div {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
`;

export const BottomContent = styled.footer`
  > div:nth-child(1) {
    display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  p {
    font-weight: 400;
    font-size: 11px;
    line-height: 13px;
    color: #7c7c7c;
  }

  button {
    max-width: 150px;
  } 
  }
`;

export const FlagHerby = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 350px;
  border: 0.78022px solid #007f00;
  border-radius: 6.24176px;
  padding: 5px 13px 5px 13px;
  color: #007f00;
`;

export const TextFlag = styled.div`
  font-size: 14px;
`;
