import styled from "styled-components";

export const Button = styled.button`
  background-color: #fff;
  height: 35px;
  border: none;
  border-radius: 4px;
  padding: 0;
`;
export const NotificationNumber = styled.span`
  background-color: #ff6868;
  display: flex;
  align-items: end;
  justify-content: center;
  position: relative;
  top: -2rem;
  right: -1rem;
  width: 1.125rem;
  height: 1.125rem;
  color: #fff;
  text-align: center;
  border-radius: 50%;
  font-size: 0.7rem;
`;

export const NotificationList = styled.div`
  height: 100vh;
  width: ${(props) => (props.open ? "414px" : "0")};
  position: absolute;
  background-color: #fff;
  top: 0;
  right: 0;
  z-index: 3;
  box-shadow: -5px 0px 10px rgba(0, 0, 0, 0.1);
  transition: "all .10s";
`;
export const Top = styled.div`
  border-bottom: 1px solid #4b4b4b;
  padding: 20px 0 24px 24px;
`;
export const Title = styled.div`
  font-weight: 700;
  color: #000;
  margin-top: 15px;
`;

export const CardNotification = styled.div`
  padding: 15px 39px 14px 23px;
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #d5d5d5;
`;

export const TitleNotification = styled.div`
  font-weight: ${(props) => (props.read ? "400" : "700")};
  color: ${(props) => (props.read ? "#22282C" : "#3e8277")};
  margin-top: 15px;
  margin-bottom: 8px;
`;

export const Data = styled.div`
  color: #7c7c7c;
`;
