import styled from "styled-components";

export const Container = styled.div`
  margin-bottom: 10px;
`;

export const ContainerTopic = styled.div`
  background-color: #f6f6f6;
  padding: 14px 25px 25px 33px;
`;

export const ContainerDescriptor = styled.div`
  background: #f2f0f9;
  border: 1px solid #d5d5d5;
  padding: 20px 40px 36px 40px;
  margin-bottom: 10px;
`;

export const Box = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  margin-top: 7px;
`;

export const Title = styled.div`
  color: #20423D;
  font-weight: 700;
`;

export const BarBox = styled.div`
  width: 100%;
  height: 34px;
  margin-right: 21px;
  background-color: #fff;
  padding: 7px 8px 7px 8px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  border: 1px solid #D5D5D5;
`;

export const Bar = styled.div`
  width: ${(props) => props.width}%;
  height: 20px;
  background-color: #3e8277;
  border-radius: 5px;
  margin-right: 6px;
`;

export const Score = styled.div`
  width: 45px;
  color: #3e8277;
  font-weight: 600;
`;

export const ButtonAccordeon = styled.button`
  width: 34px;
  height: 34px;
  background: #ffffff;
  border: 1px solid #d5d5d5;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const BarBoxDesc = styled.div`
  width: 100%;
  height: 34px;
  margin-right: 21px;
  background-color: #fff;
  padding: 7px 8px 7px 8px;
  border-radius: 5px;
  display: flex;
  align-items: center;
`;

export const BarDesc = styled.div`
  width: ${(props) => props.width}%;
  height: 20px;
  background-color: #5EC2B1;
  border-radius: 5px;
  margin-right: 6px;
`;

export const ScoreDesc = styled.div`
  width: 45px;
  color: #20423D;
  font-weight: 600;
`;

export const Nome = styled.div`
  font-size: 14px;
  margin-bottom: 8px;
  color: #20423D;
`;

export const BoxDesc = styled.div`
  margin-bottom: 10px;
`;
