import styled from "styled-components";

export const ButtonEncerrar = styled.button`
  width: 159px;
  height: 47px;
  border-radius: 0px 0px 0px 16px;
  background: #fff;
  color: #ff5353;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  text-decoration-line: underline;
`;

export const PageNumbers = styled.div`
  display: flex;
  align-items: center;
  margin-top: 30px;
  margin-left: 2rem;
  padding-bottom: 16px;
`;

export const ButtonsNavigation = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  width: 1056px;
`;

export const ButtonTen = styled.button`
  background-color: #fff;
  border-radius: 50%;
  border: 1px solid #3e8277;
  height: 27px;
  width: 27px;
  color: #3e8277;
  font-size: 10px;
  font-weight: 600;
  margin: 0 2.5px;

  &:disabled {
    border: 1px solid #dedede;
    color: #dedede;
  }
`;

export const ButtonPage = styled.button`
  position: relative;
  background-color: ${(props) => (props.active ? "#3e8277" : "#fff")};
  border-radius: 50%;
  border: 1px solid ${(props) => (props.active ? "#fff" : "#3e8277")};
  height: 34px;
  width: 34px;
  color: ${(props) => (props.active ? "#fff" : "#3e8277")};
  font-weight: 600;
  font-size: 15px;
  margin: 0 2.5px;
`;

export const IconAnswered = styled.div`
  width: 16px;
  height: 16px;
  position: absolute;
  top: -7px;
  right: -3px;
  background-color: #3e8277;
  border: 1px solid #fff;
  border-radius: 50%;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
`;
