import { Modal } from "react-bootstrap";
import { MdInfoOutline } from "react-icons/md";
import { ButtonBlue } from "../buttons/buttonBlue";

export default function ModalInformacao(props) {
  return (
    <Modal
      {...props}
      size="sm"
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
        <ButtonBlue onClick={props.onHide}>
          {props.textConfirm ?? "Fechar"}
        </ButtonBlue>
      </Modal.Footer>
    </Modal>
  );
}
