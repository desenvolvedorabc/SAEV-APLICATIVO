import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useFormik } from "formik";
import Router from "next/router";
import { useState } from "react";
import { ButtonPadrao } from "src/components/buttons/buttonPadrao";
import { CardDefault } from "src/components/cardDefault";
import ErrorText from "src/components/ErrorText";
import InputFile from "src/components/InputFile";
import ModalConfirmacao from "src/components/modalConfirmacao";
import { ImportStudent, ImportUser } from "src/services/importar.service";
import { Title, InputGroup } from "./styledComponents";

type ValidationErrors = Partial<{ TIPO: string; ARQ: string }>;

export function ImportExport() {
  const [type, setType] = useState('aluno');
  const [file, setFile] = useState(null);
  const [ModalShowConfirm, setModalShowConfirm] = useState(false);
  const [modalStatus, setModalStatus] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);

  const validate = (values) => {
    const errors: ValidationErrors = {};
    if (!file) {
      errors.ARQ = "Campo obrigatório";
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      ARQ: "",
    },
    validate,
    onSubmit: async (values) => {      
      const data = new FormData();
      data.append("file", file);

      let resp;

      setIsDisabled(true)
      let response = null;
      try{
        if(type === 'aluno') {
          resp = await ImportStudent(data)
        }
        if(type === 'usuario') {
          resp = await ImportUser(data)
        }
      }
      catch (err) {
        setIsDisabled(false)
      } finally {
        setIsDisabled(false)
      }


      if (
        resp?.status === 200 || resp?.status === 201
      ) {
        setModalStatus(true);
        setModalShowConfirm(true);
      } else {
        setModalStatus(false);
        setModalShowConfirm(true);
        setErrorMessage(resp?.data?.message)
      }
      // TODO document why this async method 'onSubmit' is empty
    },
  });

  const onFileChange = (e) => {
    setFile(e.target.value)
  }

  return (
    <div>
      <CardDefault>
        <Title>Importar</Title>
        <div>
          <InputGroup>
            <div className="col me-2" >
              <FormControl fullWidth size="small">
                <InputLabel id="TIPO">Tipo de Importação</InputLabel>
                <Select
                  labelId="TIPO"
                  id="TIPO"
                  value={type}
                  label="Tipo de Importação"
                  name="TIPO"
                  onChange={(e) => setType(e.target.value)}
                >
                  <MenuItem value={"aluno"}>Alunos</MenuItem>
                  <MenuItem value={"usuario"}>Usuários</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div style={{ marginBottom: 17 }}>
              <InputFile
                label="Arquivo"
                onChange={(e) => onFileChange(e)}
                error={formik.errors.ARQ}
                acceptFile={".csv"}
              />
              {formik.errors.ARQ ? <ErrorText>{formik.errors.ARQ}</ErrorText> : null}
            </div>
          </InputGroup>
          <div>
            <ButtonPadrao onClick={formik.handleSubmit} type="submit" disable={isDisabled}>
              Enviar
            </ButtonPadrao>
          </div>
        </div>
      </CardDefault>
      <ModalConfirmacao
        show={ModalShowConfirm}
        onHide={() => {
          setModalShowConfirm(false),
            modalStatus && Router.reload();
        }}
        text={
          modalStatus
            ? `Informações salvas com sucesso!`
            : errorMessage
        }
        status={modalStatus}
      />
    </div>
  );
}
