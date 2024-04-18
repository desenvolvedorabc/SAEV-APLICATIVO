import {useState} from 'react'
import { CardStyled, Name, Role, Logo } from "./styledComponents";
import Image from 'next/image'
import { MdOutlineEmail, MdOutlinePhoneAndroid, MdOutlineAccountCircle } from "react-icons/md";
import {ButtonPadrao} from
 "src/components/buttons/buttonPadrao";
import ButtonWhite from "src/components/buttons/buttonWhite";
import ModalEditarMinhaConta from "src/components/modalEditarMinhaConta";
import ModalTrocarSenha from "src/components/modalTrocarSenha";
import { maskCPF } from 'src/utils/masks';

export default function CardInfoMinhaConta({usuario}) {
  const [modalEditarMinhaConta, setModalEditarMinhaConta] = useState(false)
  const [modalTrocarSenha, setModalTrocarSenha] = useState(false)
  return (
    <>
      <CardStyled onClick={() => {}}>
        <div className="d-flex justify-content-between col-12">
          <div className="d-flex align-items-center">
            <Logo className="rounded-circle">
              {usuario?.USU_AVATAR ? 
                <img src={`${usuario?.USU_AVATAR_URL}`} className="rounded-circle" width={160} height={160} />
              :
                  <Image src="/assets/images/avatar.png" className="rounded-circle" width={160} height={160} />
              }
            </Logo>
            <div className="ms-4">
              <Name><strong>{usuario?.USU_NOME}</strong></Name>
              <Role>{usuario?.USU_SPE?.SPE_NOME}</Role>
              <div className="d-flex">
                <div className="pe-4">
                  <div className="d-flex">
                    <MdOutlineEmail size={24} color={"#3E8277"} />
                    <div className="ms-2 mb-3">{usuario?.USU_EMAIL}</div>
                  </div>
                  <div className="d-flex">
                    <MdOutlinePhoneAndroid size={24} color={"#3E8277"} />
                    <div className="ms-2 mb-3">{usuario?.USU_FONE}</div>
                  </div>
                  <div className="d-flex">
                    <MdOutlineAccountCircle size={24} color={"#3E8277"} />
                    <div className="ms-2 mb-3">{maskCPF(usuario.USU_DOCUMENTO)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="ms-2 d-flex flex-column align-items-end justify-content-between">
            <div style={{width:140}}>
              <ButtonPadrao onClick={() => {setModalEditarMinhaConta(true)}} >Editar</ButtonPadrao>
            </div>
            <div style={{width:140}}>
              <ButtonWhite onClick={() => {setModalTrocarSenha(true)}} >Redefinir Senha</ButtonWhite>
            </div>
          </div>
        </div>
      </CardStyled>
      <ModalEditarMinhaConta
        show={modalEditarMinhaConta}
        onHide={() => { setModalEditarMinhaConta(false); }}
        usuario={usuario}
      />
      <ModalTrocarSenha
        show={modalTrocarSenha}
        onHide={() => { setModalTrocarSenha(false); }}
        usuario={usuario}
      />
    </>
  );


}

