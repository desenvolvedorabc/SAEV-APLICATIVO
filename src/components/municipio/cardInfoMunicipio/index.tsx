import { CardStyled, City, Address } from "./styledComponents";
import Router from 'next/router'

import ButtonWhite from "../../buttons/buttonWhite";


export default function CardInfoMunicipio({municipio}) {
  return (
    <CardStyled onClick={() => {}}>
      <div className="d-flex align-items-center">
        {municipio?.MUN_LOGO ? 
          // eslint-disable-next-line @next/next/no-img-element
          <img src={`${process.env.NEXT_PUBLIC_API_URL}/counties/avatar/${municipio?.MUN_LOGO}`} className="" width={60} height={60} alt="logo municipio" />
        :
          null
        }
        <div className="ms-3">
          <City><strong>{municipio?.MUN_NOME}</strong></City>
          <Address>{municipio?.MUN_ENDERECO}, {municipio?.MUN_NUMERO}, {municipio?.MUN_COMPLEMENTO ? municipio?.MUN_COMPLEMENTO + "," : ""} {municipio?.MUN_CEP}, {municipio?.MUN_BAIRRO}, {municipio?.MUN_CIDADE} - {municipio?.MUN_UF}</Address>
        </div>
      </div>
      <div className="d-flex align-items-center">
        <ButtonWhite onClick={() => {}} >Exportar Dados do Município</ButtonWhite>
        <div className="ms-2">
          <ButtonWhite onClick={() => {Router.push(`/municipio/editar/${municipio?.MUN_ID}`)}} >Editar</ButtonWhite>
        </div>
        
      </div>
      
    </CardStyled>
  );


}

