import { Modal } from "react-bootstrap";
import { Loading } from "../Loading";

export default function ModalLoading(props) {
  return (
    <Modal
      {...props}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body className="d-flex flex-column text-center px-5">
        <div>Upload em andamento. Aguarde um momento.</div>
        <Loading />
      </Modal.Body>
    </Modal>
  );
}
