import { Button } from "react-bootstrap";
import styled, {css} from "styled-components";

type Props = {
  border: boolean;
}

export const ButtonStyled = styled(Button)<Props>`
  background-color: #fff;
  border: 1px solid #3e8277;
  color: #20423D;
  min-height: 40px;
  font-size: 12px;
  width: 100%;
  line-height: 15px;

  ${(props) => !props.border && css`
    border: 0;
  `}

  &:hover,
  &:focus {
    background-color: #5ec2b1;
    border: 1px solid #5ec2b1;
  }

  &:disabled {
    background-color: #fff;
    color: #ababab;
    border: 1px solid #ababab;
  }
`;
