import {ButtonPadrao} from
 "src/components/buttons/buttonPadrao";
import Router from 'next/router'
import { Form, Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Button, InputLogin, ButtonEye, BoxPassword, BoxItem } from "./styledComponents";
import { useFormik } from 'formik';
import ErrorText from "../ErrorText";
import { confirmarNovaSenhaRequestLogged, loginRequest } from "src/services/login.service";
import { MdCheckCircleOutline, MdHighlightOff, MdOutlineRemoveRedEye } from "react-icons/md"
import { FaRegEyeSlash } from "react-icons/fa"
import { parseCookies } from "nookies";
import ModalConfirmacao from '../modalConfirmacao';


type ValidationErrors = Partial<{ password: string, newPassword: string, confirm: string }>

export default function ModalTrocarSenha(props) {

  const [show, setShow] = useState(false);
  const [modalShowConfirm, setModalShowConfirm] = useState(false)
  const [disable, setDisable] = useState(true)
  const [inputType1, setInputType1] = useState("password")
  const [inputType2, setInputType2] = useState("password")
  const [inputType3, setInputType3] = useState("password")
  const [error, setError] = useState(null)
  const [oldPassword, setOldPassword] = useState(null)
  const cookies = parseCookies();
  const [modalStatus, setModalStatus] = useState(true)
  const [isDisabled, setIsDisabled] = useState(false)

  const handleClose = () => setShow(false);

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
        setIsDisabled(true)

        const { password } = values

        const email = cookies["USU_EMAIL"];

        const data ={
          email: email,
          password: oldPassword
        }
        let resp
        try{
          resp = await loginRequest(data, false)
        }
        catch(err){
          console.log(err)
          setIsDisabled(false)
        }
        finally{
          setIsDisabled(false)
        }
              
        if (resp.data.status != 200) {
          setError("A senha está incorreta")
        }
        else{
          const response = await confirmarNovaSenhaRequestLogged(password)
          const { data } = response
          if (data.status === 200) {
            setModalStatus(true)
            setModalShowConfirm(true)
          }
          else {
            setModalStatus(false)
            setModalShowConfirm(true)
          }
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

  },[formik.errors.password, formik.errors.confirm])


  const handleChangeInputType1 = () => {
    if(inputType1 === "password")
      setInputType1("text")
    else
      setInputType1("password")
  }
  const handleChangeInputType2 = () => {
    if(inputType2 === "password")
      setInputType2("text")
    else
      setInputType2("password")
  }
  const handleChangeInputType3 = () => {
    if(inputType3 === "password")
      setInputType3("text")
    else
      setInputType3("password")
  }

  const handleChangeOldPassword = (e) => {
    setOldPassword(e.target.value)
  }

  return (
    <>
      <Modal {...props}
      aria-labelledby="contained-modal-title-vcenter"
      centered>
        <Modal.Header closeButton>
          <Modal.Title>Redefinir Senha</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex flex-column align-items-center">
          <Form className="col-8">
            <Form.Group className="mb-3" controlId="formBasicOld">
              <Form.Label className="text-start ">Senha Atual:</Form.Label>
              <div className="d-flex align-items-center">
                <InputLogin type={inputType1} name="oldPassword" placeholder="Senha Atual" onChange={handleChangeOldPassword} />
                {inputType1 === "password" ? 
                  <ButtonEye type="button" onClick={handleChangeInputType1}>
                    <MdOutlineRemoveRedEye color={'#3E8277'} size={24}/>
                  </ButtonEye>
                :
                  <ButtonEye type="button" onClick={handleChangeInputType1}>
                    <FaRegEyeSlash color={'#D5D5D5'} size={24}/>
                  </ButtonEye>
                }
              </div>
              <div>
                {error ? <ErrorText>{error}</ErrorText> : null}
              </div>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicNew">
              <Form.Label className="text-start ">Informe sua nova senha:</Form.Label>
              <div className="d-flex align-items-center">
                <InputLogin type={inputType2} name="password" placeholder="Nova Senha" onChange={formik.handleChange} />
                {inputType2 === "password" ? 
                  <ButtonEye type="button" onClick={handleChangeInputType2}>
                    <MdOutlineRemoveRedEye color={'#3E8277'} size={24}/>
                  </ButtonEye>
                :
                  <ButtonEye type="button" onClick={handleChangeInputType2}>
                    <FaRegEyeSlash color={'#D5D5D5'} size={24}/>
                  </ButtonEye>
                }
              </div>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <div className="d-flex align-items-center">
                <InputLogin type={inputType3} name="confirm" placeholder="Confirme Nova Senha" onChange={formik.handleChange} />
                {inputType3 === "password" ? 
                  <ButtonEye type="button" onClick={handleChangeInputType3}>
                    <MdOutlineRemoveRedEye color={'#3E8277'} size={24}/>
                  </ButtonEye>
                :
                  <ButtonEye type="button" onClick={handleChangeInputType3}>
                    <FaRegEyeSlash color={'#D5D5D5'} size={24}/>
                  </ButtonEye>
                }
              </div>
              {formik.errors.confirm ? <ErrorText>{formik.errors.confirm}</ErrorText> : null}
            </Form.Group>
            <BoxPassword>
              <div className="">
                Sua senha precisa de:
              </div>
              <BoxItem className="">
                {checkPassword[0] ? (
                  <MdCheckCircleOutline color={"#64BC47"} />
                ) : (
                  <MdHighlightOff color={"#FF6868"} />
                )}{" "}
                No mínimo 8 e no máximo 15 caracteres
              </BoxItem>
              <BoxItem className="">
                {checkPassword[1] ? (
                  <MdCheckCircleOutline color={"#64BC47"} />
                ) : (
                  <MdHighlightOff color={"#FF6868"} />
                )}{" "}
                Uma letra maiúscula
              </BoxItem>
              <BoxItem className="">
                {checkPassword[2] ? (
                  <MdCheckCircleOutline color={"#64BC47"} />
                ) : (
                  <MdHighlightOff color={"#FF6868"} />
                )}{" "}
                Uma letra minúscula
              </BoxItem>
              <BoxItem className="">
                {checkPassword[3] ? (
                  <MdCheckCircleOutline color={"#64BC47"} />
                ) : (
                  <MdHighlightOff color={"#FF6868"} />
                )}{" "}
                Um número
              </BoxItem>
              <BoxItem className=" mb-3">
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
            <div className="d-flex justify-content-center mt-2">
              <Button onClick={handleClose}>
                Cancelar
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
      <ModalConfirmacao
        show={modalShowConfirm}
        onHide={() => { setModalShowConfirm(false); if(modalStatus) Router.reload(); }}
        text={modalStatus ? `Nova senha redefinida com sucesso.` : `Erro ao redefir senha`}
        status={modalStatus}
      />
  </>
  );
}