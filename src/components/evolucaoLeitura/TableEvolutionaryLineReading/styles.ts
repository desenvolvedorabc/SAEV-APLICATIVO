import styled from "styled-components";
import Table from "react-bootstrap/Table";

export const Container = styled.div`
  padding: 10px 40px;
  background: #ffffff;
  width: 100%;
  font-size: 14px;
`;

export const TableInfo = styled.td`
  background: ${(props) =>
    props.background === null
      ? "#DCDCDC !important"
      : "transparent !important"};
`;

export const Content = styled(Table)`
  background: #ffffff;
  width: 100%;

  thead {
    font-size: 16px;
    margin-bottom: 10px;
    font-weight: 700;
  }

  th {
    &:not(:last-child) {
      border-right: 1px solid #b1c9b1;
    }

    position: relative;

    span:nth-child(1) {
      font-size: 12px;
      position: absolute;
      right: 20px;
      display: inline-block;
      background: #4b4b4b;
      color: #ffffff;
      width: 17px;
      height: 17px;
      border-radius: 50%;
      cursor: pointer;

      .tooltiptext {
        display: none;
        width: 300px;
        color: #4b4b4b;
        text-align: start;
        background: #ffffff !important;
        border-radius: 1.62138px;
        padding: 10px 10px;
        bottom: 160%;
        left: 50%;
        margin-left: -100px;
        font-size: 12px;
        font-weight: 500;
        line-height: 13px;
        border: 1px solid #d5d5d5;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

        position: absolute;
        z-index: 1;
      }

      &:hover .tooltiptext {
        display: block;
        background: black;
      }
    }
  }

  th,
  td {
    color: #4b4b4b;
    text-align: center;
  }
  tbody:nth-child(odd) {
    background: #f5f5f5;
  }

  tbody {
    tr {
      &:nth-child(2n) {
        border-top: 1px dashed #b1c9b1;
      }
    }

    td: not(: last-child) {
      border-right: 1px solid #b1c9b1;
    }

    td.rowSpan {
      font-weight: 700;
      align-items: center;
      text-align: center;
      position: relative;
      width: 150px;
      border: 0 !important;

      p {
        position: absolute;
        top: 30%;
      }
    }
  }
`;
