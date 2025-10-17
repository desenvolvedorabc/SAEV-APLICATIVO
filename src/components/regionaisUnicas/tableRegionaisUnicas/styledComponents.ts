import styled from "styled-components";

export const Container = styled.div`
  background-color: #fff;
  border-radius: 10px;
  border-bottom-right-radius: 50px;
  border-bottom-left-radius: 50px;
`;

export const TopContainer = styled.div`
  margin-top: 40px;
  padding: 15px 10px 5px 10px;
  display: flex;
  justify-content: space-between;
`;

export const FilterStatusContainer = styled.div`
  background-color: #f2f0f9;
  display: flex;
  padding: 10px;
  align-items: end;
`;

export const ButtonMun = styled.button`
  background-color: transparent;
  border: none;
  height: 100%;
  width: 100%;
  color: #3b51c7;

  &:hover {
    color: #3b51c7;
    background-color: transparent;
    border: none;
  }

  &:active {
    background-color: transparent;
    border: none;
  }
`;