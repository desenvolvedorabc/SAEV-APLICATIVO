import { MdOutlineFactCheck, MdOutlineCalculate, MdTextRotationNone, MdFormatSize, MdPersonAddAlt, MdArrowForward } from "react-icons/md";
import Chair from "public/assets/images/chair2.svg";
import ItemIndicador from "../../itemIndicador";
import { BorderRight, CardStyled, Title } from './styledComponents';

export default function CardsHome({report}){
  
  return(
    <CardStyled>
    <div className="d-flex justify-content-end col-12">
          {/* <BorderRight className="d-flex flex-column align-items-left pb-2">
            <Title>
              Resultados Leitura
            </Title>
            <ItemIndicador icon={<MdTextRotationNone color={"#3E8277"} size={26}/>} number={report.LEITURA ? report.LEITURA+"%" : "0%"} />
          </BorderRight>
          <BorderRight className="d-flex flex-column align-items-left pb-2">
            <Title>
              Resultados Português
            </Title>
            <ItemIndicador icon={<MdFormatSize color={"#3E8277"} size={26}/>} number={report.PORTUGUES ? report.PORTUGUES+"%" : "0%"} />
          </BorderRight>
          <BorderRight className="d-flex flex-column align-items-left pb-2">
            <Title>
              Resultados Matem.
            </Title>
            <ItemIndicador icon={<MdOutlineCalculate color={"#3E8277"} size={26}/>} number={report.MATEMATICA ? report.MATEMATICA+"%" : "0%"} />
          </BorderRight> */}
          <BorderRight className="d-flex flex-column align-items-left pb-2">
            <Title>
              Enturmação
            </Title>
            <ItemIndicador icon={<MdPersonAddAlt color={"#3E8277"} size={26}/>} number={report.ENTURMADOS ? report.ENTURMADOS+"%" : "0%"} />
          </BorderRight>
          {/* <BorderRight className="d-flex flex-column align-items-left pb-2">
            <Title>
              Lançamentos
            </Title>
            <ItemIndicador icon={<MdOutlineFactCheck color={"#3E8277"} size={26}/>} number={report.LANCAMENTOS ? report.LANCAMENTOS+"%" : "0%"} />
          </BorderRight> */}
          <div className="d-flex flex-column align-items-left pb-2">
            <Title>
               Infrequência
            </Title>
            <ItemIndicador icon={<Chair color={"#3E8277"}/>} number={report.INFREQUENCIA ? report.INFREQUENCIA+"%" : "0%"} />
          </div>
    </div>
  </CardStyled>
  )
}