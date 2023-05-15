import { useState } from "react";
import { Modal } from "react-bootstrap";
import { ButtonPadrao } from "src/components/buttons/buttonPadrao";
import ButtonWhite from "src/components/buttons/buttonWhite";
import InputFile from "src/components/InputFile";
import ModalAviso from "src/components/modalAviso";
import { generateDataImportExcel } from "src/utils/import-excel";
import { ModalImportError } from "../modalImportError";

export function ModalImportMatriz(props) {
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

      if(keys[0] === "NOME" && keys[1] === "DISCIPLINA" && keys[2] === "SERIE" && keys[3] === "TOPICO" && keys[4] === "DESCRITOR" && size === 5){
        let matriz = {
          MAR_NOME: "",
          MAR_DIS: "",
          MAR_SER: [],
          MAR_MTO: [],
          MAR_ATIVO: true,
        }
  
        if(info.length > 0){
          matriz.MAR_NOME = info[0].NOME
          matriz.MAR_DIS = info[0].DISCIPLINA
          info.map(x => {
            let find = props.series.find((serie) => serie.SER_NUMBER === x.SERIE)
            if(find)
              matriz.MAR_SER.push(find)
          })
          // matriz.MAR_SER = info[0].SERIE.split(',')
    
          let topicoAtual = info[0].TOPICO
          matriz.MAR_MTO.push({
            MTO_NOME: info[0].TOPICO,
            MTO_MTI: []
          })
          let indice = 0
          info.map(x => {
            if(x.TOPICO != topicoAtual){
              topicoAtual = x.TOPICO
              indice++
  
              matriz.MAR_MTO.push({
                MTO_NOME: x.TOPICO,
                MTO_MTI: []
              })
            }
            matriz.MAR_MTO[indice].MTO_MTI.push(
              { MTI_CODIGO: x.DESCRITOR.split(' - ')[0], MTI_DESCRITOR: x.DESCRITOR.split(' - ')[1] })
          })
        }
        
        props.changeMatriz(matriz)
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
          Importar Matriz
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex flex-column justify-content-center text-center px-5">
        <InputFile label="Selecione um arquivo .XLSX" onChange={(e) => handleChangeImport(e)} error={""} acceptFile={".xls, .xlsx"} />
        <a style={{marginTop: 10, fontSize: 12}} href='/assets/templates/modelo-importacao-matriz-referencia.xlsx' target="_blank" download>
          Baixar modelo de importação
        </a>
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
