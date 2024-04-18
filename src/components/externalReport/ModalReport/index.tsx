import {ButtonPadrao} from
 "src/components/buttons/buttonPadrao";
import { MdCheckCircleOutline, MdOutlineHighlightOff, MdOutlineWarning} from "react-icons/md";
import { Box, Modal } from "@mui/material";
import ButtonWhite from "src/components/buttons/buttonWhite";
import { Title, Top } from "./styledComponents";

const boxExt = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90vw',
  height: '90vh',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  // overflow: 'auto',
};

const boxInt = {
  position: 'relative',
  width: '100%',
  height: 'calc(100% - 68px)',
  overflow: 'auto',
};

export default function ModalReport(props) {

  console.log('props.link :', props.link);
  return (
    <Modal
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <>
        <Box sx={boxExt}>
          <Top>
            <div></div>
            <Title>{props.name}</Title>
            <div style={{width: 107}}>
              <ButtonWhite border onClick={props.handleClose}>Voltar</ButtonWhite>
            </div>
          </Top>
          <Box sx={boxInt}>
            <iframe title={props.name} width="100%" height="770" src={props.link}  allowFullScreen={true}></iframe>
          </Box>
        </Box>
      </>
    </Modal>
  );
}