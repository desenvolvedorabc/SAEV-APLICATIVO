import {ButtonPadrao} from
 "src/components/buttons/buttonPadrao";
import { Modal } from "react-bootstrap";
import {HiOutlineInformationCircle} from "react-icons/hi";
import ButtonWhite from "../buttons/buttonWhite";
import Router from "next/router";


export default function ModalAvOnline(props) {

  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header className=" justify-content-center border-0 px-5">
        <Modal.Title id="contained-modal-title-vcenter">
          <HiOutlineInformationCircle color={'#3B4BA2'} size={32}/>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex justify-content-center text-center px-5">
        <p><strong>Deseja seguir com {props.idAvaliacao ? 'a alteração' : 'o cadastro'} da versão online para esse teste?</strong></p>
      </Modal.Body>
      <Modal.Footer className="d-flex flex-column justify-content-center border-0 align-center px-5 ">
        <ButtonPadrao onClick={() => Router.push(`/avaliacao-online/editar/${props.idTeste}/${props.idAvaliacao ? props.idAvaliacao : 'cadastro'}`)}>Sim, Seguir com {props.idAvaliacao ? 'a Alteração' : 'o Cadastro'}</ButtonPadrao>

        <ButtonWhite border={false} onClick={props.onHide}>
          Não, Deixar Para Depois
        </ButtonWhite>
      </Modal.Footer>
    </Modal>
  );
}