import { Modal } from "react-bootstrap";
import { MdWarning } from "react-icons/md";
import ButtonYellow from "src/components/buttons/buttonYellow";
import Router from "next/router";

interface ModalPendingTransfersProps {
  show: boolean;
  count: number;
  onClose: () => void;
}

export default function ModalPendingTransfers({ show, count, onClose }: ModalPendingTransfersProps) {
  const handleRedirect = () => {
    onClose();
    Router.push("/transferencias");
  };

  return (
    <Modal
      show={show}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header className="justify-content-center border-0 px-5">
        <Modal.Title id="contained-modal-title-vcenter">
          <MdWarning color={"#EFD700"} size={32} />
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex flex-column justify-content-center text-center px-5">
        <h5><strong>Atenção</strong></h5>
        <p className="mt-3">
          Você possui{" "}
          <strong>
            {count} {count === 1 ? "transferência" : "transferências"}
          </strong>{" "}
          aguardando aprovação. Acesse a lista de transferências para visualizá-las.
        </p>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center border-0 px-5">
        <div style={{ width: 220 }}>
          <ButtonYellow onClick={handleRedirect}>
            Ver Transferências
          </ButtonYellow>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
