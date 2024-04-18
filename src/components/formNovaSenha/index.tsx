import { Form } from "react-bootstrap"
import { MdCheckCircleOutline, MdHighlightOff } from "react-icons/md"
import { useEffect, useState } from "react"
import { useFormik } from 'formik'
import { confirmarNovaSenhaRequest } from '../../services/login.service'
import {ButtonPadrao} from
 "src/components/buttons/buttonPadrao"
import Router, { useRouter } from "next/router"
import { InputLogin, BoxPassword, BoxItem, IconLock, TitlePassword } from "./styledComponents"
import ErrorText from "../ErrorText"
import ModalConfirmacao from "../modalConfirmacao"


type ValidationErrors = Partial<{ password: string, confirm: string }>

export default function FormNovaSenha(props){
  const { query } = useRouter()
  const [disable, setDisable] = useState(true)
  const [ModalShowConfirm, setModalShowConfirm] = useState(false)
  const [modalStatus, setModalStatus] = useState(false)
  const [errorMessage, serErrorMessage] = useState(null)
  const [isDisabled, setIsDisabled] = useState(false);

  const [checkPassword, setCheckPassword] = useState([
    false,
    false,
    false,
    false,
    false,
  ])

  const validate = values => {
    const errors: ValidationErrors = { }

    verifyPassword(values.password)

    let passwordOk = true
    checkPassword.map((x) => {
      if (!x) {
        passwordOk = false
      }
    })

    if (!passwordOk) {
      errors.password = 'Senha inválida'
    } 
    if (!values.confirm) {
      errors.confirm = 'Este campo é obrigatório'
    } else if (values.confirm != values.password) {
      errors.confirm = 'As senhas não estão iguais!'
    }
    return errors
  }
 
  const verifyPassword = (value) => {
    let letrasMaiusculas = /[A-Z]/
    let letrasMinusculas = /[a-z]/
    let numeros = /[0-9]/
    let caracteresEspeciais = /[!|@|#|$|%|^|&|*|(|)|-|_]/
    let checksTemp = checkPassword
    if (value.length > 7 && value.length < 16) {
      checksTemp[0] = true
    } else {
      checksTemp[0] = false
    }
    if (letrasMaiusculas.test(value)) {
      checksTemp[1] = true
    } else {
      checksTemp[1] = false
    }
    if (letrasMinusculas.test(value)) {
      checksTemp[2] = true
    } else {
      checksTemp[2] = false
    }
    if (numeros.test(value)) {
      checksTemp[3] = true
    } else {
      checksTemp[3] = false
    }
    if (caracteresEspeciais.test(value)) {
      checksTemp[4] = true
    } else {
      checksTemp[4] = false
    }
    setCheckPassword(checksTemp)
  }

  const formik = useFormik({
    initialValues: {
      password: '',
      confirm: '',
    },
      validate,
      onSubmit: async (values) => {
        const token = query.token
        const { password } = values

        setIsDisabled(true)
        let response = null;
        try{
          response = await confirmarNovaSenhaRequest(token, password)
          console.log('response', response)
        }
        catch (err) {
          setIsDisabled(false)
        } finally {
          setIsDisabled(false)
        }
        if (response.status === 200) {
          setModalShowConfirm(true)
          setModalStatus(true)
        }
        else{
          setModalShowConfirm(true)
          setModalStatus(false)
          serErrorMessage(response?.data?.message)

        }
    },
  })

  useEffect(() =>{
    if(Object.keys(formik.errors).length != 0 || checkPassword[0] === false){
      setDisable(true)
      // disable = false
    }
    else{
      setDisable(false)
      // disable = true
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[formik.errors.password, formik.errors.confirm])

  return(
    <>
      <div className="text-start mb-3"><strong>Definir nova senha</strong></div>
      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label className="text-start col-12">Informe sua nova senha:</Form.Label>
          <div className="d-flex align-items-center">
            <InputLogin type="password" name="password" placeholder="Nova Senha" onChange={formik.handleChange} />
            <IconLock color={'#7C7C7C'} size={16}/>
          </div>
        </Form.Group>
        <Form.Group className="mb-4" controlId="formBasicPassword">
          <div className="d-flex align-items-center">
            <InputLogin type="password" name="confirm" placeholder="Confirme Nova Senha" onChange={formik.handleChange} />
            <IconLock color={'#7C7C7C'} size={16}/>
          </div>
          {formik.errors.confirm ? <ErrorText>{formik.errors.confirm}</ErrorText> : null}
        </Form.Group>
        <BoxPassword>
          <TitlePassword className="col-12">
            Sua senha precisa de:
          </TitlePassword>
          <BoxItem className="col-12">
            {checkPassword[0] ? (
              <MdCheckCircleOutline color={"#64BC47"} />
            ) : (
              <MdHighlightOff color={"#FF6868"} />
            )}{" "}
            No mínimo 8 e no máximo 15 caracteres
          </BoxItem>
          <BoxItem className="col-12">
            {checkPassword[1] ? (
              <MdCheckCircleOutline color={"#64BC47"} />
            ) : (
              <MdHighlightOff color={"#FF6868"} />
            )}{" "}
            Uma letra maiúscula
          </BoxItem>
          <BoxItem className="col-12">
            {checkPassword[2] ? (
              <MdCheckCircleOutline color={"#64BC47"} />
            ) : (
              <MdHighlightOff color={"#FF6868"} />
            )}{" "}
            Uma letra minúscula
          </BoxItem>
          <BoxItem className="col-12">
            {checkPassword[3] ? (
              <MdCheckCircleOutline color={"#64BC47"} />
            ) : (
              <MdHighlightOff color={"#FF6868"} />
            )}{" "}
            Um número
          </BoxItem>
          <BoxItem className="col-12">
            {checkPassword[4] ? (
              <MdCheckCircleOutline color={"#64BC47"} />
            ) : (
              <MdHighlightOff color={"#FF6868"} />
            )}{" "}
            Um símbolo especial como @ ^ ~ #
          </BoxItem>
        </BoxPassword>
        <ButtonPadrao type="submit" onClick={(e) => { e.preventDefault(); formik.handleSubmit(e)}} disable={!(formik.isValid && formik.dirty) || isDisabled}>
          Salvar
        </ButtonPadrao>
      </Form>
      <ModalConfirmacao
        show={ModalShowConfirm}
        onHide={() => {
          setModalShowConfirm(false);
          modalStatus && Router.push('/login')
        }}
        text={modalStatus ? "Sua nova senha foi criada, agora você pode fazer o login" : errorMessage}
        status={modalStatus}
      />
    </>
  )
}