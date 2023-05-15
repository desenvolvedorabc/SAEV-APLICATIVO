import styled from "styled-components";
import Image from "next/image";

export const CardStyled = styled.div`
  width: 100%;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  background-color: #fff;
  padding: 45px 26px 26px 26px;
`;

export const BoxAvatar = styled.div`
  margin-left: 40px;
`;

export const BoxName = styled.div`
  padding: 0px 0px 26px 70px;
`;

export const Name = styled.div`
  font-weight: 500;
  font-size: 24px;
`;

export const TitleIcons = styled.div`
  font-size: 11px;
`;

export const BoxIcons = styled.div`
  font-size: 21px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  grid-gap: 15px;
  margin-top: 30px;
`;

export const BorderedIcon = styled.div`
  border-right: 1px solid #d5d5d5;
  padding-right: 5px;
`;

export const ValueIcons = styled.div`
  font-size: 21px;
  display: flex;
  align-items: center;
`;

export const Serie = styled.div`
  font-weight: 700;
  margin-bottom: 6px;
`;

export const School = styled.div``;

export const Logo = styled.div`
  border: 9px solid #f6f6f6 !important;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.15);
  width: 145px;
  height: 145px;
`;

export const DivInfos = styled.div`
  border-right: 1px dashed #d5d5d5;
`;

export const Enturmado = styled.div`
  background: #f2f0f9;
  border: 1px solid
    ${(props) => (props.color === "Enturmado" ? "#3e8277" : "#FF6868")};
  width: 147px;
  height: 27px;
  border-radius: 5px;
  font-weight: 600;
  font-size: 12px;
  color: ${(props) => (props.color === "Enturmado" ? "#3e8277" : "#FF6868")};
  text-transform: uppercase;
  margin-top: 20px;

  display: flex;
  justify-content: center;
  align-items: center;
`;

export const BoxPersonalInfos = styled.div`
  border-top: 1px solid #d5d5d5;
  margin-top: 26px;
  padding: 24px 18px 0 18px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 24px;
`;

export const BorderedPersonalInfos = styled.div`
  border-right: 1px solid #d5d5d5;
  padding-right: 24px;
`;

export const TitlePersonalInfos = styled.div`
  font-weight: 600;
  font-size: 12px;
`;

export const InfosPersonalInfos = styled.div`
  font-size: 14px;
`;

export const CardButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  background-color: #fff;
  padding: 22px 26px 22px 46px;
  margin-bottom: 20px;
  border-top: 1px solid #d5d5d5;
`;
