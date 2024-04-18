import { FormControlLabel } from "@mui/material";
import styled from "styled-components";

export const BoxQuestion = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const QuestionNumber = styled.div`
  width: 121px;
  height: 51px;
  border-radius: 8px 8px 0px 0px;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  margin-bottom: 8px;
`;

export const BoxStatement = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 1056px;
  // min-height: 454px;
  border-radius: 0px 20px 20px 20px;
  background-color: #fff;
  padding: 24px;
`;

export const ImageBox = styled.div`
  width: 400px;
  height: 300px;
  overflow: auto;
  margin: 16px 0;
`;

export const QuestionImage = styled.img`
  display: flex;
  align-items: center;
  justify-content: center;
  // width: auto;
  // max-height: 300px;
`;

export const QuestionDescription = styled.div`
  border-radius: 8px;
  border: 1px dashed var(--dark-grey, #4b4b4b);
  width: 100%;
  padding: 8px;
  font-weight: 600;
`;

export const BoxAlternative = styled(FormControlLabel)`
  width: 1056px;
  min-height: 72px;
  border-radius: 20px;
  background-color: #fff;
  display: flex;
  align-items: center;
  margin-top: 16px;
  // padding: 16px;
  margin-left: 0px !important;
  margin-right: 0px !important;

  cursor: pointer;
`;

export const Option = styled.div`
  width: 40px !important;
  height: 40px !important;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${(props) => (props.checked ? "#2DCE92" : "#000")};
  border-radius: 50%;
  font-size: 24px;
  font-weight: 600;

  color: ${(props) => (props.checked ? "#fff" : "#000")};
  background-color: ${(props) => (props.checked ? "#2DCE92" : "#fff")};
`;

export const Text = styled.div`
  display: flex;
  flex-wrap: no-wrap;
  margin-left: 16px;
  max-width: 90%;
  font-family: "Inter", sans-serif;
`;

export const AlternativeImage = styled.img`
  display: flex;
  align-items: center;
  justify-content: center;
  width: auto;
  height: 130px;
  padding: 16px;
`;
