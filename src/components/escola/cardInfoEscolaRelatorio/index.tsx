import { CardStyled, City, BorderRight, BorderBottom, Title, Indicators, Indicators2, Number } from "./styledComponents";
import {Circle} from 'src/shared/styledForms'
import Router from 'next/router'
import ButtonWhite from "src/components/buttons/buttonWhite";
import ItemIndicador from "src/components/itemIndicador";
import { MdOutlineCorporateFare, MdOutlineFactCheck, MdPersonAddAlt, MdArrowForward } from "react-icons/md"; 
import Chair from "public/assets/images/chair2.svg";
import Document from "public/assets/images/document.svg";

export default function CardInfoEscolaRelatorio({escola, municipio}) {

  const statusColor=(status) => {
    if(status === 'verde')
      return '#007F00'
    if(status === 'amarelo')
      return "#FAD036"
    return '#FF6868'
  }

  return (
    <CardStyled>
      <div className="d-flex flex-column align-items-end col-12">
        <div className="d-flex justify-content-between col-12">
          <div className="d-flex align-items-start">
            <div className="d-flex align-items-center">
              {municipio?.MUN_LOGO ? 
                // eslint-disable-next-line @next/next/no-img-element
                <img src={`${municipio?.MUN_LOGO_URL}`} className="" width={46} height={46} alt="logo municipio" />
              :
              <MdOutlineCorporateFare color={'#3E8277'} size={46} />
              }
              <Circle color={statusColor(municipio?.MUN_STATUS)} className="mx-2"/>
              <City><strong>{municipio?.MUN_NOME}</strong></City>
            </div>
          </div>  
          <div className="d-flex" style={{width: 300}}>
            <div className="d-flex align-items-center">
              <MdArrowForward size={26}/>
            </div>
            <Indicators>
              <BorderRight className="d-flex flex-column align-items-center pb-2">
                <Title>
                  Enturmação
                </Title>
                <ItemIndicador icon={<MdPersonAddAlt color={"#3E8277"} size={26}/>} number={`${municipio?.ENTURMADOS ? municipio?.ENTURMADOS?.toLocaleString("pt-BR", {style: 'decimal', maximumFractionDigits: 2}) : "0"}%`} />
              </BorderRight>
              {/* <BorderRight className="d-flex flex-column align-items-center pb-2">
                <Title>
                  Infrequência
                </Title>
                <ItemIndicador icon={<Chair color={"#3E8277"}/>} number={`${municipio?.INFREQUENCIA ? municipio?.INFREQUENCIA?.toLocaleString("pt-BR", {style: 'decimal', maximumFractionDigits: 2}) : "0"}%`} />
              </BorderRight> */}
            </Indicators>
          </div>
        </div>
        <BorderBottom/>
        <div className="d-flex justify-content-between col-12 mt-2">
          <div className="col-3 me-2 d-flex align-items-center">
            <City><strong>{escola?.ESC_NOME}</strong></City>
          </div>  
          <div className="d-flex col justify-content-between">
            <div className="d-flex align-items-center" style={{ marginRight: 8 }}>
              <div className="d-flex flex-column justify-center align-items-center" style={{marginRight: 27, paddingLeft: 26}}>
                <div className="d-flex">
                  <Document color={"#3E8277"} size={21}/>
                  <Number>{escola?.totalTests}</Number>
                </div>
                <div style={{ fontSize: 11}}>
                  Testes Disponíveis
                </div>
              </div>
              <div style={{width:140, paddingRight:8, borderRight: "1px solid #D4D4D4"}}>
                <ButtonWhite onClick={() => {Router.push(`/municipio/${municipio?.MUN_ID}/escola/${escola?.ESC_ID}/testes-disponiveis`)}} >Visualizar Testes</ButtonWhite>
              </div>
            </div>
            <div className="d-flex" style={{width: 300}}>
              <div className="d-flex align-items-center">
                <MdArrowForward size={26}/>
              </div>
              {/* <Indicators2> */}
                <BorderRight className="d-flex flex-column align-items-center pb-2 me-3">
                  <Title>
                    Enturmação
                  </Title>
                  <ItemIndicador icon={<MdPersonAddAlt color={"#3E8277"} size={26}/>} number={`${escola?.ENTURMADOS ? escola?.ENTURMADOS : "0"}%`} />
                </BorderRight>
                {/* <div className="d-flex flex-column align-items-center pb-2">
                  <Title>
                    Infrequência
                  </Title>
                  <ItemIndicador icon={<Chair color={"#3E8277"}/>} number={`${escola?.INFREQUENCIA ? escola?.INFREQUENCIA : "0"}%`} />
                </div> */}
              {/* </Indicators2> */}
              <div className="d-flex justify-content-end align-items-center">
                <div style={{width:140}}>
                  <ButtonWhite onClick={() => {Router.push(`/municipio/${municipio?.MUN_ID}/escola/editar/${escola?.ESC_ID}`)}} >Editar</ButtonWhite>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </CardStyled>
  );
}
