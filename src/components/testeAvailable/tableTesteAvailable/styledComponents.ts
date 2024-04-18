import styled from "styled-components";

export const Container = styled.div`
  background-color: #fff;
  border-radius: 10px;
  border-bottom-right-radius: 50px;
  border-bottom-left-radius: 50px;
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.1);
`;

export const TopContainer = styled.div`
  margin-top: 15px;
  padding: 15px 10px 5px 10px;
  display: flex;
  justify-content: space-between;
`;

export const Loading = styled.div`
  position: absolute;
  top: ${(props) => props.top}px;
  left: 0;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.3);
`;
