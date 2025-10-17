import { useAuth } from "src/context/AuthContext";
import { Transference } from "./Transference";

import * as S from "./styles";

type Props = {
  transfers: any[];
  url: string;
  school: string;
  handleCancel;
  handleApprov;
  handleUnapprov;
  handleInfo;
};

export function ContentSectionTranfers({ transfers, url, school, handleCancel, handleApprov, handleUnapprov, handleInfo }: Props) {
  const { user } = useAuth()
  
  const verifyApprove = (data) => {
  console.log('data :', data);
    if(user?.USU_SPE?.role === "SAEV"){
      return true;
    }
    if(user?.USU_SPE?.role === "ESTADO" && user?.stateId === data?.ESTADO_ORIGEM_ID && data?.ESC_TIPO_ORIGEM === 'ESTADUAL'){
      return true;
    }
    if(user?.USU_SPE?.role === "ESTADO" && user?.stateId === data?.ESTADO_ORIGEM_ID && data?.ESC_TIPO_ORIGEM === 'MUNICIPAL' && data?.MUN_ORIGEM_COMPARTILHA_DADOS === 1){
      return true;
    }
    if(
      user?.USU_SPE?.role === "MUNICIPIO_ESTADUAL" && (data?.ESC_TIPO_ORIGEM === 'ESTADUAL'
      || data?.ESC_TIPO_DESTINO === 'ESTADUAL')
    ){
      return true;
    }
    if(
      user?.USU_SPE?.role === "MUNICIPIO_MUNICIPAL" && (data?.ESC_TIPO_ORIGEM === 'MUNICIPAL'
      || data?.ESC_TIPO_DESTINO === 'MUNICIPAL')
    ){
      return true;
    }
    return false;
  }

  return (
    <S.Container>
      {transfers?.map((data, index) => {
        return (
          <Transference
            key={index}
            transfer={data}
            type={
              (verifyApprove(data))
                ? "RECEBIDO"
                : "ENVIADO"
            }
            status={data.TRF_STATUS}
            url={url}
            handleCancel={handleCancel}
            handleApprov={handleApprov}
            handleUnapprov={handleUnapprov}
            handleInfo={handleInfo}
          />
        );
      })}
    </S.Container>
  );
}
