import { Modal } from "react-bootstrap";
import { MdWarning } from "react-icons/md";
import ButtonYellow from "src/components/buttons/buttonYellow";
import ButtonWhite from "src/components/buttons/buttonWhite";
import { TextareaAutosize } from "@mui/material";

export default function ModalAvisoTexto(props) {
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
      <Modal.Body className="d-flex flex-column text-center px-5">
        <p>
          <strong>{props.text}</strong>
        </p>
        <p>
          <strong>Escola de Origem:</strong> {props.descriptionFrom.school} de{" "}
          {props.descriptionFrom.county}
          <br />
          {props.descriptionFrom.serie} - {props.descriptionFrom.schoolClass}
        </p>
        <p>
          <strong>Escola de Destino:</strong> {props.descriptionTo.school} de{" "}
          {props.descriptionTo.county}
          <br />
          {props.descriptionTo.serie} - {props.descriptionTo.schoolClass}
        </p>
        {props.input && (
          <TextareaAutosize
            name="TRF_JUSTIFICATIVA"
            placeholder="Espaço para justificativa de rejeição da transferência aqui..."
            onChange={props.onChange}
          />
        )}
      </Modal.Body>
      {props.newModalFormat ? (
        <Modal.Footer className="d-flex flex-column justify-content-center border-0 align-center px-5">
          <div style={{ width: 220 }}>
            <ButtonYellow disable={props.isLoading} onClick={props.onConfirm}>
              {props.buttonYes}{" "}
            </ButtonYellow>
          </div>
          <div style={{ width: 220 }}>
            <ButtonWhite
              border={props.warning && false}
              onClick={props.onHide}
            >
              {props.buttonNo}{" "}
            </ButtonWhite>
          </div>
        </Modal.Footer>
      ) : (
        <Modal.Footer className="d-flex flex-column justify-content-center border-0 align-center px-5">
          <div style={{ width: 220 }}>
            <ButtonYellow disable={props.isLoading} onClick={props.onConfirm}>
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
