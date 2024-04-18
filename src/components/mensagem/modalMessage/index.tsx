import { Modal } from "react-bootstrap";
import {ButtonPadrao} from "src/components/buttons/buttonPadrao";
import { Data, Text } from "./styledComponents";
import { format } from 'date-fns'


export function ModalMessage(props) {

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton className=" justify-content-center border-0 px-5">
        <Modal.Title id="contained-modal-title-vcenter">
          {props.message?.MEN_TITLE}
          <Data>
            {props.message?.MEN_DT_CRIACAO &&
              format(new Date(props.message?.MEN_DT_CRIACAO), 'dd/MM/yyyy')
            }
          </Data>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex justify-content-center text-center px-5">
        <Text><div dangerouslySetInnerHTML={{__html: props.message?.MEN_TEXT}} /></Text>
      </Modal.Body>
      <Modal.Footer className="d-flex flex-column justify-content-center border-0 align-center px-5">
        <div style={{width: 220}}>
          <ButtonPadrao onClick={props.onHide}>Fechar</ButtonPadrao>
        </div>
      </Modal.Footer>
    </Modal>
  );
}