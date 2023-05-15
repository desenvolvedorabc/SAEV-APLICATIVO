import Image from "next/image";
import { CardStyled, HeaderStyled, BodyStyled, ImageBox} from "./styledComponents";

export default function CardLogin(props){
  return(
    <CardStyled>
      <HeaderStyled> 
        <ImageBox>
          <Image src="/assets/images/logoSaev.png" width={167} height={71} />
        </ImageBox>
        <div>Sistema de Avaliação <br/>Educar pra Valer</div>
      </HeaderStyled>
      <BodyStyled>
        {props.children}
      </BodyStyled>
    </CardStyled>
  )
}