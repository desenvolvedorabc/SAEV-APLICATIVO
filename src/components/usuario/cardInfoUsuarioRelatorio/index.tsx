import { CardStyled, Name, Role, Logo, DivInfos } from "./styledComponents";
import Router from "next/router";
import Image from "next/image";
import {
  MdOutlineEmail,
  MdOutlinePhoneAndroid,
  MdOutlineAccountCircle,
  MdOutlineSchool,
  MdOutlineLocationOn,
} from "react-icons/md";
import { ButtonPadrao } from "src/components/buttons/buttonPadrao";
import ButtonWhite from "src/components/buttons/buttonWhite";
import ModalConfirmacao from "src/components/modalConfirmacao";
import { useState } from "react";
import { resendEmailPassword } from "src/services/usuarios.service";

export default function CardInfoUsuarioRelatorio({ usuario }) {
  const [ModalShowConfirm, setModalShowConfirm] = useState(false);
  const [modalStatus, setModalStatus] = useState(true);

  const sendEmail = async () => {
    const resp = await resendEmailPassword(usuario?.USU_ID);
    if (resp.status === 200) {
      setModalStatus(true);
    } else {
      setModalStatus(false);
    }

    setModalShowConfirm(true);
  };

  return (
    <CardStyled onClick={() => {}}>
      <div className="d-flex justify-content-between col-12">
        <div className="d-flex align-items-center">
          <Logo className="rounded-circle">
            {usuario?.USU_AVATAR ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`${usuario?.USU_AVATAR_URL}`}
                className="rounded-circle"
                width={160}
                height={160}
                alt="avatar"
              />
            ) : (
              <Image
                src="/assets/images/avatar.png"
                className="rounded-circle"
                width={170}
                height={170}
                alt="avatar"
              />
            )}
          </Logo>
          <div className="ms-4">
            <Name>
              <strong>{usuario?.USU_NOME}</strong>
            </Name>
            <Role>{usuario?.USU_CARGO}</Role>
            <div className="d-flex">
              <DivInfos className="pe-4">
                <div className="d-flex">
                  <MdOutlineEmail size={24} />
                  <div className="ms-2 mb-3">{usuario?.USU_EMAIL}</div>
                </div>
                <div className="d-flex">
                  <MdOutlinePhoneAndroid size={24} />
                  <div className="ms-2 mb-3">{usuario?.USU_FONE}</div>
                </div>
                <div className="d-flex">
                  <MdOutlineAccountCircle size={24} />
                  <div className="ms-2 mb-3">{usuario?.USU_DOCUMENTO}</div>
                </div>
              </DivInfos>
              <div className="ms-4">
                <div className="d-flex">
                  <MdOutlineSchool size={24} />
                  <div className="ms-2 mb-3">{usuario?.USU_ESC?.ESC_NOME}</div>
                </div>
                <div className="d-flex">
                  <MdOutlineLocationOn size={24} />
                  <div className="ms-2 mb-3">{usuario?.USU_MUN?.MUN_NOME}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className=" d-flex align-items-end justify-content-end">
          {!usuario?.isChangePasswordWelcome && (
            <div className="" style={{ width: 140 }}>
              <ButtonWhite
                onClick={() => {
                  sendEmail();
                }}
              >
                Reenviar Email
              </ButtonWhite>
            </div>
          )}
          <div className="ms-2" style={{ width: 140 }}>
            <ButtonPadrao
              onClick={() => {
                Router.push(`/usuario/editar/${usuario?.USU_ID}`);
              }}
            >
              Editar
            </ButtonPadrao>
          </div>
        </div>
      </div>
      <ModalConfirmacao
        show={ModalShowConfirm}
        onHide={() => {
          setModalShowConfirm(false);
        }}
        text={
          modalStatus ? `Email enviado com sucesso` : `Erro ao enviar email`
        }
        status={modalStatus}
      />
    </CardStyled>
  );
}
