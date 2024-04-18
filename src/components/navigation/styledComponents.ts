import styled from "styled-components";
import Link from "next/link";
import Image from "next/image";

// export const Nav = styled.div`
//   background-color: #3e8277;
//   min-width: 270px !important;
//   width: 270px;
//   min-height: 100vh;
// `;

export const Nav = styled.div`
  background-color: #3e8277;
  min-width: 270px !important;
  width: 270px;
  height: 100vh;
  overflow-x: hidden;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
`;

export const SubTitle = styled.div`
  color: white;
  font-size: 11px;
  margin-left: 5px;
  margin-top: 2px;
  line-height: 1;
`;

export const UserWrapper = styled.div`
  background-color: #20423d;
  padding: 8px;
`;

export const UserInfo = styled.div`
  color: white;
`;

export const ButtonLogout = styled.button`
  background-color: transparent;
  border: none;
`;

export const Ul = styled.ul`
  list-style: none;
  padding: 0 0;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const Active = styled.div`
  background-color: #30615a;
  color: #fad036;
  width: 100%;
  padding: 0.7rem 1rem;
  border-bottom: 1px solid rgb(246, 246, 246, 0.15);
  display: flex;
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
`;

export const ButtonLink = styled.button`
  color: white;
  background-color: #3e8277;
  border: none;
  border-bottom: 1px solid rgb(246, 246, 246, 0.15);
  height: 100%;
  width: 100%;
  display: flex;
  padding: 0.7rem 1rem;
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;

  &:hover {
    color: #fad036;
  }

  &:focus {
    color: #fad036;
  }
`;

export const ImageStyled = styled(Image)`
  cursor: pointer;
`;

export const TitleGroup = styled.div`
  font-weight: 600;
  color: #fad036;
  font-size: 10px;
  border-bottom: 1px solid rgb(246, 246, 246, 0.15);
  padding: 20px 0px 3px 17px;
`;
