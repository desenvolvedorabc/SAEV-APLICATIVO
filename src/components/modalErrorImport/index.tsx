import {ButtonPadrao} from
 "src/components/buttons/buttonPadrao";
import { Modal } from "react-bootstrap";
import { MdCheckCircleOutline, MdOutlineHighlightOff, MdOutlineWarning} from "react-icons/md";
import ButtonYellow from "../buttons/buttonYellow";
import { ButtonDownload } from "./styledComponents";
import ButtonWhite from "../buttons/buttonWhite";


export default function ModalErrorImport(props) {
  return (
    <Modal
      {...props}
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header className=" justify-content-center border-0 px-5">
        <Modal.Title id="contained-modal-title-vcenter">
          <MdOutlineWarning color={'#EFD700'} size={32}/>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex justify-content-center text-center px-5">
        <p><strong>
          Importação não realizada. 
          <br/><br/>
          Dados inconsistentes, geramos um arquivo apontando as inconsistências
        </strong></p>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center border-0 px-5">
          <ButtonDownload 
            href={props.errorUrl}
            target="_blank"
            rel="noreferrer"
          >
            <span>
              {'Baixar Relatório de Erros'}
            </span>
          </ButtonDownload>
          <ButtonWhite onClick={props.onHide}>
            Fechar
          </ButtonWhite>
      </Modal.Footer>
    </Modal>
  );
}