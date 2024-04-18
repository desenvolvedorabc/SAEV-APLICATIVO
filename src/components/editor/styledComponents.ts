import styled from "styled-components";

export const EditorStyled = styled.div`
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  .ql-container {
    height: 100%;
  }

  .ql-editor {
    min-height: ${(props) => props.minHeight};
  }
`;
