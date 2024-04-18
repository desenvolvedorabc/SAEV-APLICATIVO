import { FormControl, FormControlLabel, Radio, RadioGroup, TextField } from "@mui/material";
import { Card, Enunciation, Top } from "./styledComponents";
import { useEffect, useState } from 'react';
import InputFile from "src/components/InputFile";
import { updateAssessmentOnlineImage } from "src/services/avaliacao-online";
import ModalLoading from "src/components/modalLoading";
import ModalConfirmacao from "src/components/modalConfirmacao";

export default function Alternative({alternative, changeAlternative}) {
  const [type, setType] = useState('text')
  const [text, setText] = useState(alternative?.description);
  const [image, setImage] = useState(alternative?.image);
  const [loadingImage, setLoadingImage] = useState(false)
  const [errorMessageImage, setErrorMessageImage] = useState('Erro ao selecionar imagem')
  const [ModalShowErrorImage, setModalShowErrorImage] = useState(false)
  const [resetImageInput, setResetImageInput] = useState(false)

  useEffect(() => {
    if(alternative.image){
      setType('image');
      setImage(alternative?.image)
      setText('')
    }
    else {
      setType('text');
      setText(alternative?.description)
      setImage('')
    }
  }, [alternative])

  const handleChangeAlternative = async (type, e) => {
    if(type === 'text'){
      changeAlternative({...alternative, description: e.target.value, image: null})
      setText(e.target.value);
      setImage(null);
    }
    else{
      const data = new FormData();
      
      data.append('file', e.target.value)
      data.append('image', image)
      setLoadingImage(true)
      
      const resp = await updateAssessmentOnlineImage(data);

      if (resp.message) {
        if(resp.message === "Invalid file type"){
          setErrorMessageImage('Arquivo com tipo invalido');
        } else{
          setErrorMessageImage(resp.message);
        }
        setResetImageInput(!resetImageInput)
        setModalShowErrorImage(true)
      } else {
        setImage(resp.imageUrl);
        changeAlternative({...alternative, description: null, image: resp.imageUrl})
        setText(null);
      }
      setLoadingImage(false)
    }
  }

  const handleModalLimitSize = () => {
    setErrorMessageImage('Imagem muito pesada')
    setModalShowErrorImage(true)
  }

  return(
    <Card>
      <Top>
        <div>Alternativa { alternative.option }</div>
        <div>
          <FormControl>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              value={type}
              onChange={(e) => setType(e.target.value)}
              >
              <FormControlLabel defaultChecked value="text" control={<Radio color="success"/>} label="Texto" />
              <FormControlLabel value="image" control={<Radio  color="success"/>} label="Imagem" />
            </RadioGroup>
          </FormControl>
        </div>
      </Top>
      <Enunciation>
        <div style={{ width: '100%'}}>
          {type === 'text' ?
            <TextField
            fullWidth
            label="Enunciado"
            id="text"
            value={text}
            size="small"
            onChange={(e) => handleChangeAlternative('text', e)}
            />
            :
            <InputFile label="Enunciado" onChange={(e) => handleChangeAlternative('image', e)} error={null} acceptFile={".png"} initialValue={image} limitSize={1048576} errorLimitSize={handleModalLimitSize} reset={resetImageInput}/>
        }
        </div>
      </Enunciation>
      <ModalLoading
        show={loadingImage}
      />
      <ModalConfirmacao
        show={ModalShowErrorImage}
        onHide={() => { setModalShowErrorImage(false) }}
        text={errorMessageImage}
        status={false}
      />
    </Card>
  )
}