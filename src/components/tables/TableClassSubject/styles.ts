import styled from "styled-components";
import Table from "react-bootstrap/Table";

export const Container = styled.div`
  ${(props) =>
    !props.isPdf
      ? "background: #ffffff; overflow-y: auto; max-height: 600px;"
      : "background: #ffffff; page-break-inside: avoid;"};
`;

export const Content = styled(Table)`
  background: #ffffff;
  ${(props) => props.isPdf ? "width: 100%;" : ""};

  thead {
    font-size: 12px;
    margin-bottom: 10px;

    tr {
      ${(props) => !props.isPdf ? "position: sticky; top: 0px;" : ""};
      background-color: #fff;
      ${(props) => !props.isPdf ? "z-index: 10;" : ""};
    }
  }

  th:nth-child(1),
  td:nth-child(1) {
    text-align: left;
    ${(props) => props.isPdf ? "width: 40%;" : "width: 252px;"};
    padding-left: 15px;
    ${(props) => props.isPdf ? "word-wrap: break-word; white-space: normal;" : ""};
  }

  th:nth-child(2),
  td:nth-child(2) {
    text-align: center;
    ${(props) => props.isPdf ? "width: 15%;" : "width: 120px;"};
  }

  th:nth-child(3),
  td:nth-child(3) {
    text-align: left;
    ${(props) => props.isPdf ? "width: 45%;" : "width: auto;"};
  }

  th,
  td {
    color: #4b4b4b;
    text-align: center;
    ${(props) => props.isPdf ? "padding: 8px; font-size: 11px;" : ""};
  }

  tbody {
    font-size: 0.875rem;
    td {
      border-right: 1px solid #d5d5d5;
    }

    ${(props) => props.isPdf ? `
      tr {
        page-break-inside: avoid;
      }
    ` : ""};
  }
`;
