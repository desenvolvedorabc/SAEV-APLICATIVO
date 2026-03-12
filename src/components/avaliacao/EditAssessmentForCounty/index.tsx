import { Form } from "react-bootstrap";
import { Card } from "./styledComponents";
import { useState } from "react";
import { TextField } from "@mui/material";

import { MunPageForCounty } from "../MunPageForCounty";
import { AssessmentForCounty } from "src/services/assessment-county.service";
import ModalConfirmacao from "src/components/modalConfirmacao";
import { useRouter } from "next/router";

interface Props {
  assessment: AssessmentForCounty;
}

export function EditAssessmentForCounty({ assessment }: Props) {
  const [ModalShowConfirm, setModalShowConfirm] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();
  const [counties, setCounties] = useState([
    {
      id: assessment.county.MUN_ID,
      assessmentId: assessment.assessment.AVA_ID,
      AVM_MUN_ID: assessment.county.MUN_ID,
      AVM_MUN_NOME: assessment.county.MUN_NOME,
      AVM_TIPO: assessment.county.AVM_TIPO,
      AVM_DT_INICIO: assessment.county.AVM_DT_INICIO,
      AVM_DT_FIM: assessment.county.AVM_DT_FIM,
      AVM_DT_DISPONIVEL: assessment.county.AVM_DT_DISPONIVEL,
    },
  ]);

  return (
    <>
      <Form>
        <Card>
          <div className="d-flex gap-2">
            <div className="" style={{ width: 226 }}>
              <TextField
                fullWidth
                label="Ano"
                disabled={true}
                value={assessment?.assessment?.AVA_ANO}
                size="small"
              />
            </div>
            <div className="" style={{ width: 226 }}>
              <TextField
                fullWidth
                label="Nome"
                name="AVA_NOME"
                id="AVA_NOME"
                disabled={true}
                value={assessment?.assessment?.AVA_NOME}
                size="small"
              />
            </div>
            <div className="" style={{ width: 226 }}>
              <TextField
                fullWidth
                label="Data de Início"
                disabled={true}
                value={
                  assessment.assessment.AVA_DT_INICIO
                    ? new Date(assessment.assessment.AVA_DT_INICIO).toLocaleDateString('pt-BR')
                    : ''
                }
                size="small"
              />
            </div>
            <div className="" style={{ width: 226 }}>
              <TextField
                fullWidth
                label="Data de Fim"
                disabled={true}
                value={
                  assessment?.assessment?.AVA_DT_FIM
                    ? new Date(assessment?.assessment?.AVA_DT_FIM).toLocaleDateString('pt-BR')
                    : ''
                }
                size="small"
              />
            </div>
          </div>
        </Card>
        <div>
          <MunPageForCounty
            setCounties={setCounties}
            setModalShowConfirm={setModalShowConfirm}
            setErrorMessage={setErrorMessage}
            listMunAdd={counties}
          />
        </div>
      </Form>

      <ModalConfirmacao
        show={ModalShowConfirm}
        onHide={() => {
          setModalShowConfirm(false);
          router.reload()
        }}
        text={
          !errorMessage?.trim()
            ? `Edição "${
                assessment.assessment.AVA_NOME
              }" ${"alterado"} com sucesso!`
            : errorMessage
        }
        status={!errorMessage?.trim()}
      />
    </>
  );
}
