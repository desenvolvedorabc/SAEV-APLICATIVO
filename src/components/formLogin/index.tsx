// import * as React from "react";
import { Form } from "react-bootstrap";
import Link from "next/link";
import { useFormik } from "formik";
import { ButtonPadrao } from "src/components/buttons/buttonPadrao";
import { InputLogin, IconLock, IconMail, A } from "./styledComponents";
import ErrorText from "../ErrorText";
import { useState } from "react";
import { useAuth } from "src/context/AuthContext";

type ValidationErrors = Partial<{ email: string; password: string }>;

export default function FormLogin(props) {
  const [error, setError] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);

  const { signIn } = useAuth();

  const validate = (values) => {
    const errors: ValidationErrors = {};

    if (!values.email) {
      errors.email = "Email é obrigatório";
    } else if (
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        values.email
      )
    ) {
      errors.email = "Email com formato inválido";
    }
    if (!values.password) {
      errors.password = "Senha é obrigatória";
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate,
    onSubmit: async (values) => {
      
      setIsDisabled(true)
      let response = null;
      try{
        response = await signIn(values);
      }
      catch (err) {
        setIsDisabled(false)
      } finally {
        setIsDisabled(false)
      }
      if (response.data.status != 200) {
        setError(response.data.message);
      }
    },
  });

  return (
    <>
      <Form onSubmit={formik.handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <div className="d-flex align-items-center">
            <InputLogin
              type="email"
              name="email"
              placeholder="Email"
              onChange={formik.handleChange}
            />
            <IconMail color={"#7C7C7C"} />
          </div>
          {formik.errors.email ? (
            <ErrorText>{formik.errors.email}</ErrorText>
          ) : null}
          {error ? <ErrorText>{error}</ErrorText> : null}
        </Form.Group>

        <Form.Group className="mb-4" controlId="formBasicPassword">
          <div className="d-flex align-items-center">
            <InputLogin
              type="password"
              name="password"
              placeholder="Senha"
              onChange={formik.handleChange}
            />
            <IconLock color={"#7C7C7C"} size={16} />
          </div>
          {formik.errors.password ? (
            <ErrorText>{formik.errors.password}</ErrorText>
          ) : null}
        </Form.Group>
        <ButtonPadrao
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            formik.handleSubmit(e);
          }}
          disable={!(formik.isValid && formik.dirty) || isDisabled}
        >
          Entrar
        </ButtonPadrao>
      </Form>
      <div className="mt-3">
        <Link href="/recuperar-senha">
          <A>Esqueci minha senha</A>
        </Link>
      </div>
    </>
  );
}
