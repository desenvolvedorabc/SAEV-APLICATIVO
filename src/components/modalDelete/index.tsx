import { Modal } from "react-bootstrap";
import { BiTrash } from "react-icons/bi"
import ButtonVermelho from "src/components/buttons/buttonVermelho";
import ButtonWhite from "src/components/buttons/buttonWhite";


export function ModalDelete(props) {

  return (
    <Modal
      {...props}
      size={props.size}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header className=" justify-content-center border-0 px-5">
        <Modal.Title id="contained-modal-title-vcenter">
            <BiTrash color={'#FF6868'} size={32}/>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex justify-content-center text-center px-5">
        <p><strong>{props.text}</strong></p>
      </Modal.Body>
      <Modal.Footer className="d-flex flex-column justify-content-center border-0 align-center px-5">
        <div style={{width: 220}}>
          <ButtonVermelho onClick={props.onHide}>{props.buttonNo}</ButtonVermelho>
        </div>
        <div style={{width: 220}}>
          <ButtonWhite border={false} onClick={props.onConfirm}>{props.buttonYes}</ButtonWhite>
        </div>
      </Modal.Footer>
    </Modal>
  );
}