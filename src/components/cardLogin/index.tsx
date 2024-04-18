import Image from "next/image";
import { CardStyled, HeaderStyled, BodyStyled, ImageBox} from "./styledComponents";

export default function CardLogin(props){
  return(
    <CardStyled>
      <HeaderStyled> 
        <ImageBox>
          {/* <Image src="/assets/images/logoSaev.png" width={172} height={53} alt="SAEV"/> */}
          <Image src="/assets/images/Logo_SAEV_TelaLogin3.png" width={172} height={53} alt="SAEV"/>
        </ImageBox>
        <div>Sistema de Avaliação <br/>Educar pra Valer</div>
      </HeaderStyled>
      <BodyStyled>
        {props.children}
      </BodyStyled>
    </CardStyled>
  )
}