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
  user;
};

export function ContentSectionTranfers({ transfers, url, school, handleCancel, handleApprov, handleUnapprov, handleInfo, user }: Props) {
  
  const verifyApprove = (data) => {
    if(user?.USU_SPE?.SPE_PER?.PER_NOME === "SAEV"){
      return true;
    }
    if(user?.USU_SPE?.SPE_PER?.PER_NOME === "Município" && user?.USU_MUN?.MUN_ID === data?.MUN_ID_DESTINO){
      return true;
    }
    // if(user?.USU_SPE?.SPE_PER?.PER_NOME === "Escola" && user?.USU_ESC?.ESC_ID === data?.ESC_ID_DESTINO){
    //   return true;
    // }
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
