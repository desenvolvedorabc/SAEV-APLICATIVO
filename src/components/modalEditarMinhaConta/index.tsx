import {ButtonPadrao} from
 "src/components/buttons/buttonPadrao";
import ButtonWhite from "src/components/buttons/buttonWhite";
import Router from 'next/router'
import { Form, Modal } from "react-bootstrap";
import { useState, useRef, useEffect } from "react";
import { Logo, Button } from "./styledComponents";
import Image from 'next/image'
import { useFormik } from 'formik';
import ErrorText from "src/components/ErrorText";
import { maskCPF, maskPhone } from 'src/utils/masks';
import { editUser } from "src/services/usuarios.service";
import ModalConfirmacao from 'src/components/modalConfirmacao';
import { setCookie } from "nookies";
import { isValidCPF } from "src/utils/validate";

type ValidationErrors = Partial<{ USU_NOME: string, USU_EMAIL: string, USU_DOCUMENTO: string, USU_FONE: string }>

export default function ModalEditarMinhaConta(props, { _url }) {

  const [_show, setShow] = useState(false);
  const [userAvatar, setUserAvatar] = useState(null)
  const [avatar, setAvatar] = useState(null)
  const [createObjectURL, setCreateObjectURL] = useState(null)
  const [modalShowConfirm, setModalShowConfirm] = useState(false)
  const [modalStatus, setModalStatus] = useState(true)

  const handleClose = () => setShow(false);

  const validate = values => {
    const errors: ValidationErrors = {};
    if (!values.USU_NOME) {
      errors.USU_NOME = 'Campo obrigatório';
    } else if (values.USU_NOME.length < 6) {
      errors.USU_NOME = 'Deve ter no minimo 6 caracteres';
    }
    if (!values.USU_EMAIL) {
      errors.USU_EMAIL = 'Campo obrigatório';
    } else if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(values.USU_EMAIL)) {
      errors.USU_EMAIL = 'Email com formato inválido';
    }
    if (!values.USU_DOCUMENTO) {
      errors.USU_DOCUMENTO = 'Campo obrigatório';
    } else if (!isValidCPF(values.USU_DOCUMENTO)) {
      errors.USU_DOCUMENTO = 'Documento com formato inválido'
    }
    if (!values.USU_FONE) {
      errors.USU_FONE = 'Campo obrigatório';
    } else if (values.USU_FONE.length < 14 || values.USU_FONE.length > 14) {
      errors.USU_FONE = 'Telefone com formato inválido';
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      USU_SPE: props.usuario.USU_SPE?.SPE_ID,
      USU_MUN: props.usuario.USU_MUN?.MUN_ID,
      USU_ESC: props.usuario.USU_ESC?.ESC_ID,
      USU_NOME: props.usuario.USU_NOME,
      USU_EMAIL: props.usuario.USU_EMAIL,
      USU_DOCUMENTO: props.usuario.USU_DOCUMENTO,
      USU_FONE: props.usuario.USU_FONE,
      USU_ATIVO: props.usuario.USU_ATIVO,
      USU_AVATAR: props.usuario.USU_AVATAR,
      USU_SENHA: props.usuario.USU_SENHA,
    },
    validate,
    onSubmit: async (values) => {
      let file = null
      if (userAvatar) {
        file = userAvatar
      }

      values.USU_DOCUMENTO = maskCPF(values.USU_DOCUMENTO.trim())
      values.USU_FONE = maskPhone(values.USU_FONE.trim())

      const response = await editUser(props.usuario.USU_ID, values, file)

      if (response.status === 200 && response.data.USU_NOME === values.USU_NOME) {
        setCookie(null, "USU_NOME", response.data.USU_NOME, {
          path: "/",
        });
        setCookie(null, "USU_EMAIL", response.data.USU_EMAIL, {
          path: "/",
        });
        setCookie(null, "USU_AVATAR", response.data.USU_AVATAR, {
          path: "/",
        });
        setCookie(null, "USU_RETRY", "0", {
          path: "/",
        })
        setModalStatus(true)
        setModalShowConfirm(true)

      }
      else {
        setModalStatus(false)
        setModalShowConfirm(true)
      }
    }
  });

  const hiddenFileInput = useRef(null);

  const uploadAvatar = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0]
      setUserAvatar(i)
      setCreateObjectURL(URL.createObjectURL(i))
    }
  }

  const handleClickImage = event => {
    hiddenFileInput.current.click();
  };

  useEffect(() => {
    setAvatar(props.usuario.USU_AVATAR)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Modal {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered>
        <Modal.Header closeButton>
          <Modal.Title>Editando Perfil</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex flex-column align-items-center mt-3">
          <Logo className="rounded-circle mb-3">
            {createObjectURL ?
              <Image src={createObjectURL} className="rounded-circle" width={170} height={170} />
              :
              <>
                {avatar ?
                  <Image src={`${props.usuario?.USU_AVATAR_URL}`} className="rounded-circle" width={170} height={170} />
                  :
                  <Image src="/assets/images/avatar.png" className="rounded-circle" width={170} height={170} />}
              </>
            }
          </Logo>
          <input
            type="file"
            ref={hiddenFileInput}
            onChange={uploadAvatar}
            style={{ display: 'none' }}
          />
          <div style={{width:205}}>
            <ButtonWhite onClick={handleClickImage}>
              Alterar foto de perfil
            </ButtonWhite>
          </div>
          <Form className="d-flex flex-column mt-3 col-12 px-5 pb-4 pt-2 justify-content-center">
            <div className="my-2">
              <Form.Control type="text" name="USU_NOME" placeholder="Nome" onChange={formik.handleChange} value={formik.values.USU_NOME} />
              {formik.errors.USU_NOME ? <ErrorText>{formik.errors.USU_NOME}</ErrorText> : null}
            </div>
            <div className="my-2">
              <Form.Control type="text" name="USU_EMAIL" placeholder="Email" onChange={formik.handleChange} value={formik.values.USU_EMAIL} />
              {formik.errors.USU_EMAIL ? <ErrorText>{formik.errors.USU_EMAIL}</ErrorText> : null}
            </div>
            <div className="my-2">
              <Form.Control type="text" name="USU_DOCUMENTO" placeholder="CPF" onChange={formik.handleChange} value={maskCPF(formik.values.USU_DOCUMENTO)} />
              {formik.errors.USU_DOCUMENTO ? <ErrorText>{formik.errors.USU_DOCUMENTO}</ErrorText> : null}
            </div>
            <div className="my-2">
              <Form.Control type="text" name="USU_FONE" placeholder="Telefone" onChange={formik.handleChange} value={maskPhone(formik.values.USU_FONE)} />
              {formik.errors.USU_FONE ? <ErrorText>{formik.errors.USU_FONE}</ErrorText> : null}
            </div>
            <div className="my-3">
              <ButtonPadrao type="submit" onClick={(e) => { e.preventDefault(); formik.handleSubmit(e) }} disable={!(formik.isValid)}>
                Salvar
              </ButtonPadrao>
            </div>
            <div className="d-flex justify-content-center">
              <Button onClick={handleClose}>
                Cancelar
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
      <ModalConfirmacao
        show={modalShowConfirm}
        onHide={() => { setModalShowConfirm(false); if (modalStatus) Router.reload(); }}
        text={modalStatus ? `Usuário ${formik.values.USU_NOME} alterado com sucesso!` : `Erro ao alterar usuário`}
        status={modalStatus}
      />
    </>
  );
}