import styled from "styled-components";
import Table from "react-bootstrap/Table";

export const Container = styled.div`
  ${(props) =>
    !props.isPdf
      ? "background: #ffffff; overflow-y: auto; max-height: 600px;"
      : ""};
`;

export const Content = styled(Table)`
  height: 100%;
  background: #ffffff;
  font-size: 14px;
  th,
  td {
    color: #4b4b4b !important;
    background-color: none;
  }
  th {
    &.tooltipTable {
      position: relative;
    }

    > span {
      visibility: hidden;
      width: 120px;
      background-color: black;
      color: #4b4b4b;
      text-align: center;
      padding: 5px 0;
      bottom: 100%;
      left: 50%;
      margin-left: -60px;
      background: #ffffff;
      /* #D5D5D5 */
      font-size: 12px;
      border: 1px solid #d5d5d5;
      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
      border-radius: 4px;

      position: absolute;
      z-index: 1;
    }

    &:hover span {
      visibility: visible;
    }
  }

  thead {
    tr {
      position: sticky;
      top: 0px;
      background-color: #fff;
    }
  }

  tbody {
    max-height: 50px;
    height: 100%;
    td {
      border-right: 1px solid #d5d5d5;

      &.right {
        background: #e0f1e0;
      }
      &.wrong {
        background: #ffcaca;
      }
    }
  }

  tooltip: {
    background-color: #fff;
    color: #000;
  }
`;

export const IconTooltip = styled.div`
  background: #4b4b4b;
  color: #fff;
  width: 17px;
  height: 17px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  font-size: 12px;
  margin-left: 2px;
`;
