import styled from "styled-components";
import Table from "react-bootstrap/Table";

export const Container = styled.div`
  ${(props) =>
    !props.isPdf
      ? "background: #ffffff; overflow-y: auto; max-height: 500px;"
      : ""};
`;

export const Content = styled(Table)`
  background: #ffffff;
  width: 100%;

  th:nth-child(1),
  td:nth-child(1) {
    text-align: left;
  }

  th,
  td {
    color: #4b4b4b;
    text-align: center;
  }

  thead {
    font-size: 12px;
    margin-bottom: 10px;

    th {
      position: sticky;
      top: 0px;
      background-color: #fff;
    }
  }

  tbody {
    font-size: 0.875rem !important;

    td {
      border-right: 1px solid #d5d5d5;
      flex: 1;
      &.right {
        background: #e0f1e0;
        background-image: url("assets/images/checked.svg");
        background-repeat: no-repeat;
        background-position: center;
      }
      &.wrong {
        background: #ffcaca;
        background-image: url("assets/images/error.svg");
        background-repeat: no-repeat;
        background-position: center;
      }
    }
  }
`;
