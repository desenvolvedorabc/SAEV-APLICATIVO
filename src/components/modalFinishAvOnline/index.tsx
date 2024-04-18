import {ButtonPadrao} from
 "src/components/buttons/buttonPadrao";
import { Modal } from "react-bootstrap";
import {HiOutlineInformationCircle} from "react-icons/hi";
import ButtonWhite from "../buttons/buttonWhite";
import Router from "next/router";
import { IconButton, InputAdornment, OutlinedInput, TextField } from "@mui/material";
import { useState } from "react"
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import ButtonVermelho from "../buttons/buttonVermelho";
import { IconLock, InputLogin } from "../formLogin/styledComponents";
import { loginRequest } from "src/services/login.service";
import { useAuth } from "src/context/AuthContext";
import ErrorText from "../ErrorText";


export default function ModalFinishAvOnline(props) {
  const [password, setPassword] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false);
  const [error, setError] = useState(false);
  const { user } = useAuth();
  console.log('user :', user);


  const checkPassword = async () => {
    const data = {
      email: user.USU_EMAIL,
      password: password,
    }
    setIsDisabled(true);
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
      setError(true)
    }
    else{
      setError(false)
      props.onConfirm()
    }

  }

  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header className=" justify-content-center border-0 px-5">
        <Modal.Title id="contained-modal-title-vcenter">
          <HiOutlineInformationCircle color={'#3B4BA2'} size={32}/>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex flex-column justify-content-center px-5">
        <p style={{textAlign: 'center', paddingBottom: 10}}>Necessário a senha de acesso para encerrar a avaliação.</p>
        
        <div>
          Digite sua senha:
          <div style={{marginTop: 5}} className="d-flex align-items-center">
            <InputLogin
              type="password"
              name="password"
              placeholder="Senha"
              onChange={(e) => setPassword(e.target.value)}
            />
            <IconLock color={"#7C7C7C"} size={16} />
          </div>
        </div>
        {error && <ErrorText>A senha está incorreta</ErrorText>}
      </Modal.Body>
      <Modal.Footer className="d-flex flex-column justify-content-center border-0 align-center px-5 ">
        <ButtonVermelho disable={isDisabled} onClick={props.onHide}>Voltar às Questões.</ButtonVermelho>

        <ButtonWhite disable={isDisabled} border={true} onClick={() => checkPassword()}>
          Encerrar Avaliação
        </ButtonWhite>
      </Modal.Footer>
    </Modal>
  );
}