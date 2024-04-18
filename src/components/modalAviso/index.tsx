import { Modal } from "react-bootstrap";
import { MdWarning } from "react-icons/md";
import ButtonYellow from "src/components/buttons/buttonYellow";
import ButtonWhite from "src/components/buttons/buttonWhite";

export default function ModalAviso(props) {
  return (
    <Modal
      {...props}
      size={props.size}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header className=" justify-content-center border-0 px-5">
        <Modal.Title id="contained-modal-title-vcenter">
          <MdWarning color={"#EFD700"} size={32} />
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex justify-content-center text-center px-5">
        <p>
          <strong>{props.text}</strong>
        </p>
      </Modal.Body>
      {props.newModalFormat ? (
        <Modal.Footer className="d-flex flex-column justify-content-center border-0 align-center px-5">
          <div style={{ width: 220 }}>
            <ButtonYellow onClick={props.onHide}>{props.buttonNo}{" "}</ButtonYellow>
          </div>
          <div style={{ width: 220 }}>
            <ButtonWhite
              border={props.warning && false}
              onClick={props.onConfirm}
            >
              {props.buttonYes}{" "}
            </ButtonWhite>
          </div>
        </Modal.Footer>
      ) : (
        props.buttonInverted ? 
          <Modal.Footer className="d-flex flex-column justify-content-center border-0 align-center px-5">
            <div style={{ width: 220 }}>
              <ButtonYellow onClick={props.onHide}>
              {props.buttonNo}{" "}
              </ButtonYellow>
            </div>
            <div style={{ width: 220 }}>
              <ButtonWhite border={props.warning && false} onClick={props.onConfirm}>
              {props.buttonYes}
              </ButtonWhite>
            </div>
          </Modal.Footer>
        :
          <Modal.Footer className="d-flex flex-column justify-content-center border-0 align-center px-5">
            <div style={{ width: 220 }}>
              <ButtonYellow onClick={props.onConfirm}>
                {props.buttonYes}
              </ButtonYellow>
            </div>
            <div style={{ width: 220 }}>
              <ButtonWhite border={props.warning && false} onClick={props.onHide}>
                {props.buttonNo}{" "}
              </ButtonWhite>
            </div>
          </Modal.Footer>
      )}
    </Modal>
  );
}
