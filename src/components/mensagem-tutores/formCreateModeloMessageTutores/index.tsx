import { useFormik } from 'formik';
import { MessageSide, TopMessage, CardButtons } from './styledComponents'
import {ButtonPadrao} from 'src/components/buttons/buttonPadrao';
import ModalConfirmacao from 'src/components/modalConfirmacao';
import ModalAviso from 'src/components/modalAviso';
import { useState } from 'react';
import Router from 'next/router'
import ButtonVermelho from "src/components/buttons/buttonVermelho";
import { TextField } from '@mui/material';
import { Editor } from "src/components/editor";
import { createMessageTemplate, editMessageTemplate } from "src/services/mensagens-tutores.service";
import { queryClient } from "src/lib/react-query";
import { limparHTML } from "src/utils/limparHtml";
import ErrorText from "src/components/ErrorText";

type ValidationErrors = Partial<{ title: string, content: string, MUNICIPIOS: string, ESCOLAS: string }>

export default function FormCreateModeloMessageTutores({ template = null }) {
  const [ModalShowConfirm, setModalShowConfirm] = useState(false)
  const [modalStatus, setModalStatus] = useState(true)
  const [modalShowWarning, setModalShowWarning] = useState(false)
  const [errorMessage, setErrorMessage] = useState(true)
  const [text, setText] = useState("")
  const [isDisabled, setIsDisabled] = useState(false);

  const validate = values => {
    const errors: ValidationErrors = {};
    if (!values.title) {
      errors.title = 'Campo obrigatório';
    } else if (values.title.length < 6) {
      errors.title = 'Deve ter no minimo 6 caracteres';
    }
    if (!limparHTML(text)) {
      errors.content = 'Campo obrigatório';
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      title: template ? template.title : "",
      content: template ? template.content : "",
  },
    validate,
    onSubmit: async (values) => {
      values.content = text
      
      setIsDisabled(true)
      let response = null;
      try{
        template ? 
          response = await editMessageTemplate(template.id, values)
          :
          response = await createMessageTemplate(values)
        }
      catch (err) {
        setIsDisabled(false)
      } finally {
        setIsDisabled(false)
      }
      if (!response.data.message) {
        setModalStatus(true)
        setModalShowConfirm(true)
        queryClient.invalidateQueries(['message-templates'])
        template && queryClient.invalidateQueries({queryKey: ['message-template', { id: template.id }],})
      }
      else {
        setErrorMessage(response.data.message || 'Erro ao enviar mensagem')
        setModalStatus(false)
        setModalShowConfirm(true)
      }
    }
  });

  function onKeyDown(keyEvent) {
    if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
      keyEvent.preventDefault();
    }
  }

  const handleChangeText = (value) => {
    setText(value)
  }

  return (
    <>
      <div className="d-flex">
        <MessageSide className="col">
          <TopMessage>
            <TextField
              fullWidth
              label="Título da Mensagem"
              name="title"
              id="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onKeyDown={onKeyDown} 
              onDragEnter={(e) => e.preventDefault()} 
              onSubmit={(e) => e.preventDefault()}
              size="small"
              error={formik.touched.title && formik.errors.title !== undefined}
              helperText={formik.touched.title && formik.errors.title}
              sx={{
                backgroundColor: "#FFF"
              }}
            />
          </TopMessage>
          <div className="col-11" style={{margin: 'auto'}}>
            <Editor initialValue={template ? template.content : ""} changeText={handleChangeText} minHeight={"400px"} tutor />
            {formik.touched.content && formik.errors.content !== undefined && (
              <ErrorText>{formik.errors.content}</ErrorText>
            )}
          </div>
        </MessageSide>
      </div>
      <CardButtons>
        <div style={{width: 135}}>
          <ButtonVermelho onClick={() => {setModalShowWarning(true)}}>
            Descartar
          </ButtonVermelho>
        </div>
        <div style={{width: 135}}>
          <ButtonPadrao 
            onClick={(e) => {formik.handleSubmit(e)}} 
            type="submit" 
            disable={isDisabled}
          >
            Salvar
          </ButtonPadrao>
        </div>
      </CardButtons>
      <ModalConfirmacao
        show={ModalShowConfirm}
        onHide={() => { 
          setModalShowConfirm(false), 
          modalStatus && Router.push({
            pathname: "/mensagens-tutores",
            query: { view: 1 },
          })
        }}
        text={modalStatus ? `Modelo salvo com sucesso.` : "Erro ao salvar modelo"}
        status={modalStatus}
      />
      <ModalAviso
        show={modalShowWarning}
        onHide={() => setModalShowWarning(false)}
        onConfirm={() => { 
          Router.push({
            pathname: "/mensagens-tutores",
            query: { view: 1 },
          })
        }}
        buttonYes={'Sim, Descartar Modelo'}
        buttonNo={'Manter Modelo'}
        text={`Tem certeza que deseja descartar a modelo atual?`}
      />
    </>
  )
}