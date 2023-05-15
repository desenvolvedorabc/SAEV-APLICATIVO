import {ButtonPadrao} from
 "src/components/buttons/buttonPadrao";
import { Modal } from "react-bootstrap";
import { MdCheckCircleOutline, MdOutlineHighlightOff } from "react-icons/md";
import styled from "styled-components";

const Items = styled.div`
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);  
  width: 100%;
  padding:10px 0 ;
`;

export default function ModalMunicipios(props) {
  return (
    <Modal
      {...props}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton className=" justify-content-center px-5">
        <div className="d-flex flex-column align-items-center">
          <Modal.Title id="contained-modal-title-vcenter">
            Municípios
          </Modal.Title>
          <div>
            {props.show?.AVALIACAO_AVA_NOME}
          </div>
        </div>

      </Modal.Header>
      <Modal.Body className="px-4 py-0">
        {
          props.show?.AVALIACAO_MUNICIPIO.map((row, index) => {
            return <Items key={index}>{row}</Items>
          }
          )}
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center px-5">
        <ButtonPadrao onClick={props.onHide}>Fechar</ButtonPadrao>
      </Modal.Footer>
    </Modal>
  );
}