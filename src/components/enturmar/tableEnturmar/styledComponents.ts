import styled from "styled-components";

export const Text = styled.div`
  font-weight: 700;
  color: #22282C;
`;

export const TopContainer = styled.div`
  margin-top: 20px;
  padding: 19px 10px 5px 10px;
`;

export const Pagination = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
  font-size: 0.9rem;
  background-color: #e0f1e0 !important;
  color: #68936a !important;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
  padding: 16px 10px;
`;

export const Container = styled.div`
  background-color: #fff !important;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
`;

export const Status = styled.div`
  background-color: ${(props) =>
    props.status === "Enturmado" ? "#CDFFCD" : "#FFE0E0"};
  color: ${(props) =>
    props.status === "Enturmado" ? "#007F00" : "#D30000"};
  border-radius: 10px;
  text-align: center;
  padding-top: 2px;
  padding-bottom: 2px;
  width: 136px;
`;