import Image from "next/image";
import { differenceBetweenYears, formatDate } from "src/utils/date";
import * as S from "./styles";

import DoubleArrowGreen from "public/assets/images/double-arrow-green.svg";
import DoubleArrowBlue from "public/assets/images/double-arrow-blue.svg";

type TransferenceProps = {
  status: "TAPROVADO" | "TREPROVADO" | "ABERTO" | "loading";
  type: "ENVIADO" | "RECEBIDO";
  transfer: any;
  url: string;
  handleCancel;
  handleApprov;
  handleUnapprov;
  handleInfo;
};

export function Transference(props: TransferenceProps) {
  return (
    <S.Container>
      <header>
        <div>
          {props.transfer.ALU_AVATAR ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`${props.url}/student/avatar/${props.transfer.ALU_AVATAR}`}
              width={30}
              className="rounded-circle"
              alt="foto"
            />
          ) : (
            <Image
              src="/assets/images/avatar.png"
              className="rounded-circle"
              width={30}
              height={30}
              alt="avatar"
            />
          )}
          <strong>
            {props?.transfer?.ALU_NOME},{" "}
            {differenceBetweenYears(props?.transfer?.ALU_DT_NASC)}
          </strong>

          <span>(Núm. INEP {props?.transfer?.ALU_INEP})</span>
        </div>

        <p>
          {formatDate(props.transfer.TRF_DT_CRIACAO)}
        </p>
      </header>

      <div>
        {props.type === "ENVIADO" ? (
          <>
            <div>
              <h4>
                {props.transfer.ESC_NOME_ORIGEM} de{" "}
                {props.transfer.MUN_NOME_ORIGEM}
              </h4>
              <h2>
                {props.transfer.SER_NOME_ORIGEM} -{" "}
                {props.transfer.TUR_NOME_ORIGEM}{" "}
                {props.transfer.TUR_PERIODO_ORIGEM}
              </h2>
            </div>
            <div className="flex">
              <DoubleArrowGreen />
            </div>
            <div>
              {" "}
              <h4>
                {props.transfer.ESC_NOME_DESTINO} de{" "}
                {props.transfer.MUN_NOME_DESTINO}
              </h4>
              <h2>
                {props.transfer.SER_NOME_DESTINO} -{" "}
                {props.transfer.TUR_NOME_DESTINO}{" "}
                {props.transfer.TUR_PERIODO_DESTINO}
              </h2>
            </div>
            <div>
              {props.status === "TAPROVADO" && (
                <p className="approved">
                  Transferência aprovada:
                  <br />
                  {formatDate(props.transfer.TRF_DT_ATUALIZACAO)}
                </p>
              )}

              {props.status === "TREPROVADO" && (
                <p className="reproved">
                  Transferência reprovada:
                  <br />
                  {formatDate(props.transfer.TRF_DT_ATUALIZACAO)}
                  <br></br>
                  <S.ButtonStyledLeft
                    onClick={(e) => {
                      e.preventDefault();
                      props.handleInfo(props.transfer.TRF_ID);
                    }}
                  >
                    <span
                      style={{ color: "#333333", textDecoration: "underline" }}
                    >
                      Justificativa
                    </span>
                  </S.ButtonStyledLeft>
                </p>
              )}
              {props.status === "ABERTO" && (
                <>
                  <p>Pedido de Transferência Enviado</p>
                  <S.ButtonStyled
                    style={{ backgroundColor: "#FF6868" }}
                    onClick={(e) => {
                      e.preventDefault();
                      props.handleCancel(props.transfer.TRF_ID);
                    }}
                  >
                    Cancelar
                  </S.ButtonStyled>
                </>
              )}
            </div>
          </>
        ) : (
          <>
            <div>
              {" "}
              <h4>
                {props.transfer.ESC_NOME_DESTINO} de{" "}
                {props.transfer.MUN_NOME_DESTINO}
              </h4>
              <h2>
                {props.transfer.SER_NOME_DESTINO} -{" "}
                {props.transfer.TUR_NOME_DESTINO}{" "}
                {props.transfer.TUR_PERIODO_DESTINO}
              </h2>
            </div>

            <div className="flex">
              <DoubleArrowBlue />
            </div>
            <div>
              <h4>
                {props.transfer.ESC_NOME_ORIGEM} de{" "}
                {props.transfer.MUN_NOME_ORIGEM}
              </h4>
              <h2>
                {props.transfer.SER_NOME_ORIGEM} -{" "}
                {props.transfer.TUR_NOME_ORIGEM}{" "}
                {props.transfer.TUR_PERIODO_ORIGEM}
              </h2>
            </div>
            <div>
              {props.status === "TAPROVADO" && (
                <p className="approved">
                  Transferência aprovada:
                  <br />
                  {formatDate(props.transfer.TRF_DT_ATUALIZACAO)}
                </p>
              )}

              {props.status === "TREPROVADO" && (
                <p className="reproved">
                  Transferência reprovada:
                  <br />
                  {formatDate(props.transfer.TRF_DT_ATUALIZACAO)}
                  <br></br>
                  <S.ButtonStyledLeft
                    onClick={(e) => {
                      e.preventDefault();
                      props.handleInfo(props.transfer.TRF_ID);
                    }}
                  >
                    <span
                      style={{ color: "#333333", textDecoration: "underline" }}
                    >
                      Justificativa
                    </span>
                  </S.ButtonStyledLeft>
                </p>
              )}

              {props.status === "ABERTO" && (
                <>
                  <S.ButtonStyled
                    style={{ backgroundColor: "#FF6868" }}
                    onClick={(e) => {
                      e.preventDefault();
                      props.handleUnapprov(props.transfer.TRF_ID);
                    }}
                  >
                    Reprovar
                  </S.ButtonStyled>

                  <S.ButtonStyled
                    style={{ backgroundColor: "#3E8277" }}
                    onClick={(e) => {
                      e.preventDefault();
                      props.handleApprov(props.transfer.TRF_ID);
                    }}
                  >
                    Aprovar
                  </S.ButtonStyled>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </S.Container>
  );
}
