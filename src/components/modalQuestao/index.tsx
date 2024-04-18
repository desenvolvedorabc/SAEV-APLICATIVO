import { Modal } from "react-bootstrap";
import { MdInfoOutline } from "react-icons/md";
import { ButtonPadrao } from "../buttons/buttonPadrao";
import ButtonWhite from "../buttons/buttonWhite";

export default function ModalQuestao(props) {
  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header className=" justify-content-center border-0 px-5">
        <Modal.Title id="contained-modal-title-vcenter">
          <MdInfoOutline color={"#3B51C7"} size={32} />
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex justify-content-center text-center px-5">
        <p style={{overflow: 'auto'}}>
          {props.text}
        </p>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center border-0 px-5">
        <ButtonPadrao onClick={props.onConfirm}>
          {props.textConfirm ?? "Sim, Desejo Continuar"}
        </ButtonPadrao>
        <ButtonWhite onClick={props.onHide}>
          {props.textHide ?? "Não, Desejo Voltar"}
        </ButtonWhite>
      </Modal.Footer>
    </Modal>
  );
}
