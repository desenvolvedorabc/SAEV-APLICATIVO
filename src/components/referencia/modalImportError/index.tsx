import ButtonYellow from
 "src/components/buttons/buttonYellow";
import { Modal } from "react-bootstrap";
import { MdWarning} from "react-icons/md";


export function ModalImportError(props) {

  return (
    <Modal
      {...props}
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header className=" justify-content-center border-0 px-5">
        <Modal.Title id="contained-modal-title-vcenter">
          <MdWarning color={'#EFD700'} size={32}/>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex justify-content-center text-center px-5">
        <p><strong>Template fora do padrão.</strong></p>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center border-0 px-5">
        <ButtonYellow onClick={props.onHide}>Fechar</ButtonYellow>
      </Modal.Footer>
    </Modal>
  );
}