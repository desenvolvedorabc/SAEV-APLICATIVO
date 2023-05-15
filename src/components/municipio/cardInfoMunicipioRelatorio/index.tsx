import { CardStyled, City, Circle, BorderRight, Indicators, Number } from "./styledComponents";
import Router from 'next/router'
import ButtonWhite from "../../buttons/buttonWhite";
import ItemIndicador from "../../itemIndicador";
import { MdPersonAddAlt } from "react-icons/md"; 
import Chair from "public/assets/images/chair2.svg";
import Document from "public/assets/images/document.svg";

export default function CardInfoMunicipioRelatorio({municipio}) {

  const statusColor=(status) => {
    if(status === 'verde')
      return '#007F00'
    if(status === 'amarelo')
      return "#FAD036"
    return '#FF6868'
  }

  return (
    <CardStyled>
      <div className="col-3 d-flex align-items-start">
        <div className="d-flex align-items-center">
          {municipio?.MUN_LOGO ? 
            // eslint-disable-next-line @next/next/no-img-element
            <img src={municipio?.MUN_LOGO_URL} className="" width={60} height={60} alt="logo municipio" />
          :
            null
          }
          <Circle color={statusColor(municipio?.MUN_STATUS)} className="mx-2"/>
          <City><strong>{municipio?.MUN_NOME}</strong></City>
        </div>
      </div>
      <div className="col d-flex align-items-center justify-content-between">
        <div className="d-flex">
          <div className="d-flex flex-column justify-center align-items-center" style={{marginRight: 27, paddingLeft: 26}}>
            <div className="d-flex">
              <Document color={"#3E8277"} size={21}/>
              <Number>{municipio?.totalTests}</Number>
            </div>
            <div style={{ fontSize: 11}}>
              Testes Disponíveis
            </div>
          </div>
          <div className="d-flex  align-items-center">
            <div style={{width:140, paddingRight:8, borderRight: "1px solid #D4D4D4", marginRight: 8}}>
              <ButtonWhite onClick={() => {Router.push(`/municipio/${municipio?.MUN_ID}/escola/${null}/testes-disponiveis`)}} >Visualizar Testes</ButtonWhite>
            </div>
          </div>
        </div>
        <div className="d-flex">
          {/* <Indicators> */}
            <BorderRight className="me-3">
              <ItemIndicador icon={<MdPersonAddAlt color={"#3E8277"} size={26}/>} number={municipio?.ENTURMADOS ? `${municipio?.ENTURMADOS}%` : "0%"} title={"Enturmação"} />
            </BorderRight>
            {/* <ItemIndicador icon={<Chair color={"#3E8277"}/>} number={`${municipio?.INFREQUENCIA ? municipio?.INFREQUENCIA : 0 }%`} title={"Infrequência"} /> */}
          {/* </Indicators> */}
          <div className="d-flex justify-content-between align-items-center">
            <div style={{width:140}}>
              <ButtonWhite onClick={() => {Router.push(`/municipio/editar/${municipio?.MUN_ID}`)}} >Editar</ButtonWhite>
            </div>
          </div>
        </div>
      </div>
      
    </CardStyled>
  );


}

