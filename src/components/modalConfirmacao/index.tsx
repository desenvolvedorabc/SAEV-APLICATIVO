import {ButtonPadrao} from
 "src/components/buttons/buttonPadrao";
import { Modal } from "react-bootstrap";
import { MdCheckCircleOutline, MdOutlineHighlightOff, MdOutlineWarning} from "react-icons/md";
import ButtonYellow from "../buttons/buttonYellow";


export default function ModalConfirmacao(props) {

  return (
    <Modal
      {...props}
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header className=" justify-content-center border-0 px-5">
        <Modal.Title id="contained-modal-title-vcenter">
          {props.warning ?
            <MdOutlineWarning color={'#EFD700'} size={32}/>
          :
          props.status ? 
            <MdCheckCircleOutline color={'#64BC47'} size={32}/>
          :
            <MdOutlineHighlightOff color={'#FF6868'} size={32}/>
          }
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex justify-content-center text-center px-5">
        <p><strong>{props.text}</strong></p>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center border-0 px-5">
        {props.warning ?
          <ButtonYellow onClick={props.onHide}>{'Fechar'}</ButtonYellow>
        :
          <ButtonPadrao onClick={props.onHide}>{props.textConfirm ?? 'Entendi'}</ButtonPadrao>
        }
      </Modal.Footer>
    </Modal>
  );
}