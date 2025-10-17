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

export default function ModalMunicipiosRegional(props) {
console.log('props :', props);
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
            {props.show?.name}
          </div>
        </div>

      </Modal.Header>
      <Modal.Body className="px-4 py-0">
        {
          props.show?.counties.map((county, index) => {
            return <Items key={index}>{county?.MUN_NOME}</Items>
          }
          )}
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center px-5">
        <ButtonPadrao onClick={props.onHide}>Fechar</ButtonPadrao>
      </Modal.Footer>
    </Modal>
  );
}