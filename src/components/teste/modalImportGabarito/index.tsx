import { useState } from "react";
import { Modal } from "react-bootstrap";
import { ButtonPadrao } from "src/components/buttons/buttonPadrao";
import ButtonWhite from "src/components/buttons/buttonWhite";
import InputFile from "src/components/InputFile";
import ModalAviso from "src/components/modalAviso";
import { ModalImportError } from "src/components/referencia/modalImportError";
import { generateDataImportExcel } from "src/utils/import-excel";
import { ButtonDownload } from "./styledComponents";

export function ModalImportGabarito(props) {
  const [modalShowWarning, setModalShowWarning] = useState(false);
  const [importFile, setImportFile] = useState(null)
  const [modalShowImportError, setModalShowImportError] = useState(null)

  const handleChangeImport = (e) => {
    setImportFile(e.target.value)
  }

  const handleSubmit = async () => {
    if(importFile != null){
      let info
      info = await generateDataImportExcel(importFile)
      let size = Object.keys(info[0]).length;

      let keys = Object.keys(info[0])

      if(keys[0] === "QUESTAO" && keys[1] === "GABARITO" && keys[2] === "COD_DESCRITOR" && size === 3){
        let gabarito = {
          TES_TEG: [],
        }
  
        if(info.length > 0){
          info.forEach(item => {
            item.COD_DESCRITOR = item.COD_DESCRITOR.toString()
            if(item.COD_DESCRITOR.length === 1)
              item.COD_DESCRITOR = "0" + item.COD_DESCRITOR
            gabarito.TES_TEG.push({
              TEG_ORDEM: item.QUESTAO,
              TEG_RESPOSTA_CORRETA: item.GABARITO,
              TEG_MTI: item.COD_DESCRITOR,
            })
          })
        }
        
        props.changeGabarito(gabarito)
        props.onHide()
        
      }
      else{
        setModalShowImportError(true)
      }
    }
  }


  return (
    <>
    <Modal
      {...props}
      size={props.size}
      aria-labelledby="contained-modal-title-center"
      centered
    >
      <Modal.Header closeButton className=" justify-content-center px-5">
        <Modal.Title id="contained-modal-title-vcenter pt-2">
          Importar Gabarito
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex flex-column justify-content-center text-center px-5 mt-4">
        <InputFile label="Selecione um arquivo .XLSX" onChange={(e) => handleChangeImport(e)} error={""} acceptFile={".xls, .xlsx"} />
        
        <div className="col-12 pt-2">
          <ButtonDownload 
            href={'/assets/templates/modelo_informacoes_teste.xlsx'} 
            target="_blank" 
            rel="noreferrer">
              Baixar Template
          </ButtonDownload>
        </div>
      </Modal.Body>
      <Modal.Footer className="d-flex flex-column justify-content-center border-0 align-center px-5">
        <div className="col-12">
          <ButtonPadrao onClick={() => setModalShowWarning(true)}>Importar</ButtonPadrao>
        </div>
        <div className="col-12">
          <ButtonWhite border={false} onClick={props.onHide}>
            Cancelar
          </ButtonWhite>
        </div>
      </Modal.Footer>
    </Modal>
    <ModalAviso 
      show={modalShowWarning}
      onHide={() => setModalShowWarning(false)}
      onConfirm={()=> {handleSubmit(); setModalShowWarning(false)}}
      buttonYes={"Importar e Substituir"}
      buttonNo={"Não Importar"}
      text={`Ao importar os descritores atuais serão perdidos e substituídos pelos novos.`}
    />
    <ModalImportError 
      show={modalShowImportError}
      onHide={() => setModalShowImportError(false)}
      />
    </>
  );
}
