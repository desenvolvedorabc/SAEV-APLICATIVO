import styled from "styled-components";

export const Container = styled.div`
  background-color: #fff;
  border-bottom-right-radius: 50px;
  border-bottom-left-radius: 50px;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.1);
`;

export const TopContainer = styled.div`
  padding: 15px 10px 5px 10px;
  display: flex;
  justify-content: space-between;
`;

export const IconEdit = styled.button`
  width: 34px;
  height: 34px;
  background-color: #f2f0f9;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
`;

export const Name = styled.div`
  ${(props) =>
    props.status &&
    "color: #2948b8;text-decoration: underline;cursor: pointer;"}
`;
