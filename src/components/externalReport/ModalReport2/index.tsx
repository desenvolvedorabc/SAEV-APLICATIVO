import {ButtonPadrao} from
 "src/components/buttons/buttonPadrao";
import { MdCheckCircleOutline, MdOutlineHighlightOff, MdOutlineWarning} from "react-icons/md";
import ButtonWhite from "src/components/buttons/buttonWhite";
import { Title, Top } from "./styledComponents";
import { Modal } from "react-bootstrap";

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90vw',
  height: '90vh',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  overflow: 'auto',
};

export default function ModalReport2(props) {

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header className=" justify-content-center border-0 px-5">
        
      <div></div>
            <Title>{props.name}</Title>
            <div style={{width: 107}}>
              <ButtonWhite border onClick={props.handleClose}>Voltar</ButtonWhite>
            </div>
      </Modal.Header>
      <Modal.Body className="d-flex justify-content-center text-center px-5">
          <iframe title={props.name} width="100%" height="100%" src={props.link}  allowFullScreen={true}></iframe>
      </Modal.Body>
    </Modal>
  );
}