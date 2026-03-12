import { useFormik } from 'formik';
import { MessageSide, TopMessage, CardButtons } from './styledComponents'
import {ButtonPadrao} from 'src/components/buttons/buttonPadrao';
import ModalConfirmacao from 'src/components/modalConfirmacao';
import ModalAviso from 'src/components/modalAviso';
import { useEffect, useState } from 'react';
import Router from 'next/router'
import ButtonVermelho from "src/components/buttons/buttonVermelho";
import { Autocomplete, TextField } from '@mui/material';
import { Editor } from "src/components/editor";
import { queryClient } from "src/lib/react-query";
import { limparHTML } from "src/utils/limparHtml";
import ErrorText from "src/components/ErrorText";
import { activeNotificationRules, createNotificationRules, deleteNotificationRules, editNotificationRules, NotificationRuleType } from 'src/services/mensagens-automaticas.service';
import ButtonVermelhoBorder from 'src/components/buttons/buttonVermelhoBorder';

type ValidationErrors = Partial<{ title: string, content: string, ruleType: string }>

export default function FormCreateRegrasAutomaticas({ rule = null }) {
  const [ModalShowConfirm, setModalShowConfirm] = useState(false)
  const [modalStatus, setModalStatus] = useState(true)
  const [modalShowWarning, setModalShowWarning] = useState(false)
  // const [modalShowWarningDelete, setModalShowWarningDelete] = useState(false)
  const [modalShowWarningDisable, setModalShowWarningDisable] = useState(false)
  const [modalMessage, setModalMessage] = useState('')
  const [text, setText] = useState("")
  const [selectedType, setSelectedType] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    if (rule) {
      setText(rule.content)
      setSelectedType(rule.ruleType)
    }
  }, [rule])

  const validate = values => {
    const errors: ValidationErrors = {};
    if (!values.title) {
      errors.title = 'Campo obrigatório';
    } else if (values.title.length < 6) {
      errors.title = 'Deve ter no minimo 6 caracteres';
    }
    if(!selectedType) {
      errors.ruleType = 'Campo obrigatório'
    }
    if (!limparHTML(text)) {
      errors.content = 'Campo obrigatório';
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      title: rule ? rule.title : "",
      ruleType: rule ? rule.ruleType : "",
      content: rule ? rule.content : "",
  },
    validate,
    onSubmit: async (values) => {
      const data = {
        ...values,
        title: values.title,
        ruleType: selectedType,
        content: text,
        parameters: {
          minimumPerformance: 60,
          maximumFouls: 10
        }
      }
      
      setIsDisabled(true)
      let response = null;
      try{
        rule ? 
          response = await editNotificationRules(rule.id, data)
          :
          response = await createNotificationRules(data)
        }
      catch (err) {
        setIsDisabled(false)
      } finally {
        setIsDisabled(false)
      }
      if (!response.data.message) {
        setModalMessage('Regra salva com sucesso.')
        setModalStatus(true)
        setModalShowConfirm(true)
        queryClient.invalidateQueries(['notification-rules'])
        rule && queryClient.invalidateQueries({queryKey: ['notifications-rule', { id: rule.id }],})
      }
      else {
        setModalMessage(response.data.message || 'Erro ao enviar mensagem')
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

  // const handleDelete = async () => {
  //   setModalShowWarningDelete(true)
  //   const resp = await deleteNotificationRules(rule.id)
    
  //   if (!resp.data.message) {
  //     setModalMessage('Regra excluida com sucesso!')
  //     setModalStatus(true)
  //     setModalShowConfirm(true)      

  //     queryClient.invalidateQueries(['notification-rules'])
  //     rule && queryClient.invalidateQueries({queryKey: ['notification-rule', { id: rule.id }],})
  //   }
  //   else {
  //     setModalMessage(resp.data.message || 'Erro ao excluir mensagem')
  //     setModalStatus(false)
  //     setModalShowConfirm(true)
  //   }
  // }

  const handleDisable = async () => {
    setModalShowWarningDisable(true)
    const resp = await activeNotificationRules(rule.id)
    
    if (!resp.data.message) {
      setModalMessage(`Regra ${rule.active ? 'inativada' : 'ativada'} com sucesso!`)
      setModalStatus(true)
      setModalShowConfirm(true)      

      queryClient.invalidateQueries(['notification-rules'])
      rule && queryClient.invalidateQueries({queryKey: ['notifications-rule', { id: rule.id }],})
    }
    else {
      setModalMessage(resp.data.message || `Erro ao ${rule.active ? 'inativar' : 'ativar'} mensagem`)
      setModalStatus(false)
      setModalShowConfirm(true)
    }
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
            <div style={{width: "100%"}} >
              <Autocomplete
                sx={{background: "#FFF"}}
                fullWidth
                className=""
                data-test='ruleType'
                id="ruleType"
                size="small"
                value={selectedType}
                noOptionsText="Tipo"
                options={Object.keys(NotificationRuleType)}
                getOptionLabel={option => NotificationRuleType[option]}
                onChange={(_event, newValue) => {
                  setSelectedType(newValue)
                }}
                renderInput={(params) => <TextField size="small" {...params} label="Tipo" />}
                disabled={rule ? true : false}
              />
              {formik.errors.ruleType !== undefined && (
                <ErrorText>{formik.errors.ruleType}</ErrorText>
              )}
            </div>

          </TopMessage>
          <div className="col-11" style={{margin: 'auto'}}>
            <Editor initialValue={rule ? rule.content : ""} changeText={handleChangeText} minHeight={"400px"} tutor />
            {formik.touched.content && formik.errors.content !== undefined && (
              <ErrorText>{formik.errors.content}</ErrorText>
            )}
          </div>
        </MessageSide>
      </div>
      <CardButtons>
        {rule ? (
          <div style={{ display: 'flex' }}>
            {/* <div style={{ width: 135, marginRight: 15 }}>
              <ButtonVermelho 
                onClick={() => {setModalShowWarningDelete(true)}} 
                disable={isDisabled}

              >
                Excluir
              </ButtonVermelho>
            </div> */}
            <div style={{width: 135}}>
              <ButtonVermelhoBorder 
                onClick={() => {setModalShowWarningDisable(true)}} 
                disable={isDisabled}
              >
                {rule?.active ? 'Inativar' : 'Ativar'}
              </ButtonVermelhoBorder>
            </div>
          </div>
        ) :
          <div style={{width: 135}}>
            <ButtonVermelho onClick={() => {setModalShowWarning(true)}}>
              Descartar
            </ButtonVermelho>
          </div>
        }
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
            query: { view: 3 },
          })
        }}
        text={modalMessage}
        status={modalStatus}
      />
      <ModalAviso
        show={modalShowWarning}
        onHide={() => setModalShowWarning(false)}
        onConfirm={() => {
          Router.push({
            pathname: "/mensagens-tutores",
            query: { view: 3 },
          }) 
        }}
        buttonYes={'Sim, Descartar Regra'}
        buttonNo={'Manter Regra'}
        text={`Tem certeza que deseja descartar essa regra?`}
      />
      <ModalAviso
        show={modalShowWarningDisable}
        onHide={() => setModalShowWarningDisable(false)}
        onConfirm={() => {
          handleDisable() 
        }}
        buttonYes={`Sim, ${rule?.active ? 'Inativar' : 'Ativar'} Regra`}
        buttonNo={`Não ${rule?.active ? 'Inativar' : 'Ativar'} Regra`}
        text={`Tem certeza que deseja ${rule?.active ? 'inativar' : 'ativar'} essa regra?`}
      />
      {/* <ModalAviso
        show={modalShowWarningDelete}
        onHide={() => setModalShowWarningDelete(false)}
        onConfirm={() => {
          handleDelete() 
        }}
        buttonYes={'Sim, Excluir Regra'}
        buttonNo={'Manter Regra'}
        text={`Tem certeza que deseja excluir essa regra?`}
      /> */}
    </>
  )
}