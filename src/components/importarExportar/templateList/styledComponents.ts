import Link from "next/link";
import styled from "styled-components";

export const Title = styled.div`
  color: #000;
  font-weight: 700;
`;

export const ButtonDownload = styled(Link)`
  background-color: transparent;
  border: none;
  height: 100%;
  width: 100%;
  cursor: pointer;

  &:hover {
    color: #0a58ca;
    background-color: transparent;
    border: none;
  }

  &:active {
    background-color: transparent;
    border: none;
  }
`;
