import { CardStyled, Name, Role, Logo, Infos } from "./styledComponents";
import Router from 'next/router'
import Image from 'next/image'
import {ButtonPadrao} from
 "src/components/buttons/buttonPadrao";


export default function CardInfoProfessorRelatorio({ professor, moreDetails = true, size = 160, nameSize =24, nameMarginBottom = 10 }) {
  const getAge = (data_nasc) => {
    const date = new Date()
    const nasc = new Date(data_nasc)
    const diff = Math.abs(date.getTime() - nasc.getTime());
    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));

    return years
  }

  return (
    <CardStyled onClick={() => { }}>
      <div className="d-flex justify-content-between col-12">
        <div className="d-flex align-items-center pb-4">
          <Logo className="rounded-circle" size={size}>
            {professor?.PRO_AVATAR ?
              <img src={`${professor?.PRO_AVATAR_URL}`} className="rounded-circle" width={size * ( !moreDetails ? 0.67 : 0.875) } height={size * ( !moreDetails ? 0.67 : 0.875) } />
              :
              <Image src="/assets/images/avatar.png" className="rounded-circle" width={size * ( !moreDetails ? 0.67 : 0.875) } height={size * ( !moreDetails ? 0.67 : 0.875) } />
            }
          </Logo>
          <div className="ms-4">
            <Name nameSize={nameSize} nameMarginBottom={nameMarginBottom}><strong>{professor?.PRO_NOME}</strong></Name>
            <Role>{professor?.PRO_FOR?.FOR_NOME}</Role>
            {moreDetails && <>
              <Infos>{professor?.PRO_EMAIL}</Infos>
              <Infos>{professor?.PRO_FONE}</Infos>
              <Infos>{professor?.PRO_DOCUMENTO}</Infos>
              <Infos>{getAge(professor?.PRO_DT_NASC)} Anos</Infos>
              <Infos>{professor?.PRO_GEN?.GEN_NOME} - {professor?.PRO_PEL?.PEL_NOME}</Infos></>
            }
          </div>
        </div>
        {moreDetails && <>
          <div className="ms-2 d-flex align-items-end justify-content-end" style={{width:140}}>
            <ButtonPadrao onClick={() => { Router.push(`/municipio/${professor?.PRO_MUN?.MUN_ID}/professor/editar/${professor?.PRO_ID}`) }} >Editar</ButtonPadrao>
          </div></>}
      </div>
    </CardStyled>
  );


}

