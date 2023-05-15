import styled from "styled-components";
import Table from "react-bootstrap/Table";

export const Container = styled.div`
  ${(props) =>
    !props.isPdf
      ? "background: #ffffff; overflow-y: auto; max-height: 600px;"
      : ""};
`;

export const Content = styled(Table)`
  background: #ffffff;

  thead {
    font-size: 12px;
    margin-bottom: 10px;

    tr {
      position: sticky;
      top: 0px;
      background-color: #fff;
    }
  }

  th:nth-child(1),
  td:nth-child(1) {
    text-align: left;
    width: 252px;
    padding-left: 15px;
  }

  th,
  td {
    color: #4b4b4b;
    text-align: center;
  }

  tbody {
    font-size: 0.875rem;
    td {
      border-right: 1px solid #d5d5d5;
    }
  }
`;
