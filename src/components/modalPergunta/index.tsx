import { Modal } from "react-bootstrap";
import {
  MdCheckCircleOutline,
  MdOutlineHighlightOff,
  MdWarning,
} from "react-icons/md";
import ButtonVermelho from "../buttons/buttonVermelho";
import ButtonWhite from "../buttons/buttonWhite";

export default function ModalPergunta(props) {
  return (
    <Modal
      {...props}
      size={props.size}
      aria-labelledby="contained-modal-title-center"
      centered
    >
      <Modal.Header className=" justify-content-center border-0 px-5">
        <Modal.Title id="contained-modal-title-vcenter">
          {props.status ? (
            <MdCheckCircleOutline color={"#64BC47"} size={32} />
          ) : props.warning ? (
            <MdWarning color={"#FF6868"} size={32} />
          ) : (
            <MdOutlineHighlightOff color={"#FF6868"} size={32} />
          )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex justify-content-center text-center px-5">
        <p>
          <strong>{props.text}</strong>
        </p>
      </Modal.Body>
      <Modal.Footer className="d-flex flex-column justify-content-center border-0 align-center px-5 ">
        <div style={{width: props.size === "sm" ? 164 : 248}}>
          <ButtonVermelho onClick={props.onHide}>{props.buttonNo}</ButtonVermelho>
        </div>
        <div style={{width: props.size === "sm" ? 164 : 248}}>
          <ButtonWhite border={props.warning && false} onClick={props.onConfirm}>
            {props.buttonYes}
          </ButtonWhite>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
