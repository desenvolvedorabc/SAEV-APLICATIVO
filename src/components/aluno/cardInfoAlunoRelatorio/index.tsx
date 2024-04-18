import {
  CardStyled,
  Name,
  Logo,
  Enturmado,
  Serie,
  School,
  BoxAvatar,
  BoxName,
  BoxPersonalInfos,
  TitlePersonalInfos,
  InfosPersonalInfos,
  BorderedPersonalInfos,
  CardButtons,
} from "./styledComponents";
import Router, { useRouter } from "next/router";
import Image from "next/image";
import { ButtonPadrao } from "src/components/buttons/buttonPadrao";
import ButtonVermelho from "src/components/buttons/buttonVermelho";
import ModalPergunta from "src/components/modalPergunta";
import ModalConfirmacao from "src/components/modalConfirmacao";
import { useEffect, useState } from "react";
import { editStudent } from "src/services/alunos.service";
import { format } from "date-fns";
import { isValidDate } from "src/utils/validate";


export function CardInfoAlunoRelatorio({ aluno }) {
  const [modalShowQuestion, setModalShowQuestion] = useState(false);
  const [modalShowConfirmQuestion, setModalShowConfirmQuestion] =
    useState(false);
  const [active, setActive] = useState(aluno?.ALU_ATIVO);
  const [modalStatus, setModalStatus] = useState(false);
  const [modalErrorMessage, setModalErrorMessage] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const {query} = useRouter()

  async function changeAluno() {
    setModalShowQuestion(false);

    const data = {
      ALU_ATIVO: !aluno.ALU_ATIVO,
    };

    setIsDisabled(true)
    let response = null;
    try{
      response = await editStudent(aluno?.ALU_ID, data, null);
    }
    catch (err) {
      setIsDisabled(false)
    } finally {
      setIsDisabled(false)
    }
    if (!response?.data?.message) {
      setActive(!active);
      setModalShowConfirmQuestion(true);
      setModalStatus(true);
    } else {
      setModalStatus(false);
      setModalShowConfirmQuestion(true);
      setModalErrorMessage(response.data.message || "Erro ao editar aluno");
    }
  }

  useEffect(() => {
    setActive(aluno?.ALU_ATIVO);
  }, [aluno?.ALU_ATIVO]);

  const getStudentCountyId = () => {
    if(query?.id !== 'undefined' && query?.id !== 'null'){
      return query?.id
    }
    return aluno?.ALU_ESC?.ESC_MUN_ID
  }

  const getStudentSchoolId = () => {
    if(query?.escId !== 'undefined' && query?.escId !== 'null'){
      return query?.escId
    }
    return aluno?.ALU_ESC?.ESC_ID
  }

  const getPcd = () => {
    let pcdString = ''
    aluno?.ALU_DEFICIENCIAS?.forEach((pcd, index) => 
      { 
        pcdString = pcdString.concat(pcd.PCD_NOME)
        if(index < aluno?.ALU_DEFICIENCIAS.length - 1){
          pcdString = pcdString.concat(', ')
        }
      }
    )

    if(aluno?.ALU_DEFICIENCIAS.length > 0 && aluno?.ALU_DEFICIENCIA_BY_IMPORT){
      pcdString = pcdString.concat(', ')
    }
    pcdString = pcdString.concat(aluno?.ALU_DEFICIENCIA_BY_IMPORT)

    return pcdString
  }

  return (
    <>
      <CardStyled>
        <div className="d-flex">
          <BoxAvatar className="d-flex flex-column">
            <Logo className="rounded-circle">
              {aluno?.ALU_AVATAR ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={aluno?.ALU_AVATAR_URL}
                  className="rounded-circle"
                  width={128}
                  height={128}
                  alt="avatar"
                />
              ) : (
                <Image
                  src="/assets/images/avatar.png"
                  className="rounded-circle"
                  width={130}
                  height={130}
                  alt="avatar"
                />
              )}
            </Logo>
            <Enturmado color={aluno?.ALU_STATUS}>{aluno?.ALU_STATUS}</Enturmado>
          </BoxAvatar>
          <BoxName>
            <div>
              <Name>
                {aluno?.ALU_NOME} (INEP {aluno?.ALU_INEP})
              </Name>
              <Serie>
                {aluno?.ALU_SER?.SER_NOME} - {aluno?.ALU_TUR?.TUR_NOME}
              </Serie>
              <School>
                {aluno?.ALU_ESC?.ESC_NOME} | {aluno?.ALU_ESC?.ESC_CIDADE}
              </School>
            </div>
          </BoxName>
        </div>
        <BoxPersonalInfos>
          <BorderedPersonalInfos>
            <div style={{ marginBottom: 16 }}>
              <TitlePersonalInfos>DATA DE NASCIMENTO</TitlePersonalInfos>
              <InfosPersonalInfos>
                {isValidDate(aluno?.ALU_DT_NASC)  &&
                  format(new Date(aluno?.ALU_DT_NASC), "dd/MM/yyyy")}
              </InfosPersonalInfos>
            </div>
            <div style={{ marginBottom: 16 }}>
              <TitlePersonalInfos>SEXO</TitlePersonalInfos>
              <InfosPersonalInfos>
                {aluno?.ALU_GEN?.GEN_NOME}
              </InfosPersonalInfos>
            </div>
            <div style={{ marginBottom: 16 }}>
              <TitlePersonalInfos>DEFICIÊNCIA</TitlePersonalInfos>
              <InfosPersonalInfos>
                {getPcd()}
              </InfosPersonalInfos>
            </div>
          </BorderedPersonalInfos>
          <BorderedPersonalInfos>
            <div style={{ marginBottom: 16 }}>
              <TitlePersonalInfos>NOME DA MÃE</TitlePersonalInfos>
              <InfosPersonalInfos>{aluno?.ALU_NOME_MAE}</InfosPersonalInfos>
            </div>
            <div style={{ marginBottom: 16 }}>
              <TitlePersonalInfos>NOME DO PAI</TitlePersonalInfos>
              <InfosPersonalInfos>{aluno?.ALU_NOME_PAI}</InfosPersonalInfos>
            </div>
            <div style={{ marginBottom: 16 }}>
              <TitlePersonalInfos>NOME DO RESPONSÁVEL</TitlePersonalInfos>
              <InfosPersonalInfos>{aluno?.ALU_NOME_RESP}</InfosPersonalInfos>
            </div>
          </BorderedPersonalInfos>
          <div>
            <div style={{ marginBottom: 16 }}>
              <TitlePersonalInfos>EMAIL</TitlePersonalInfos>
              <InfosPersonalInfos>
                {aluno?.ALU_EMAIL?.trim() ? aluno?.ALU_EMAIL : "-"}
              </InfosPersonalInfos>
            </div>
            <div style={{ marginBottom: 16 }}>
              <TitlePersonalInfos>ENDEREÇO</TitlePersonalInfos>
              <InfosPersonalInfos>{aluno?.ALU_ENDERECO},</InfosPersonalInfos>
              <InfosPersonalInfos>
                {aluno?.ALU_NUMERO} {aluno?.ALU_CIDADE} -
              </InfosPersonalInfos>
              <InfosPersonalInfos>{aluno?.ALU_UF},</InfosPersonalInfos>
              <InfosPersonalInfos>{aluno?.ALU_CEP}</InfosPersonalInfos>
            </div>
          </div>
        </BoxPersonalInfos>
      </CardStyled>
      <CardButtons>
        <div style={{ width: 140 }}>
          {active ? (
            <ButtonVermelho
              onClick={(e) => {
                e.preventDefault();
                setModalShowQuestion(true);
              }}
            >
              Desativar
            </ButtonVermelho>
          ) : (
            <ButtonPadrao
              onClick={(e) => {
                e.preventDefault();
                setModalShowQuestion(true);
              }}
            >
              Ativar
            </ButtonPadrao>
          )}
        </div>
        <div className="d-flex">
          <div style={{ width: 185, marginRight: 13 }}>
            <ButtonPadrao
              onClick={(e) => {
                e.preventDefault();
                Router.push(`/transferencia/aluno/${aluno?.ALU_ID}`)
              }}
            >
              Solicitar Transferência
            </ButtonPadrao>
          </div>
          <div style={{ width: 140 }}>
            <ButtonPadrao
              onClick={(e) => {
                e.preventDefault();
                Router.push(`/municipio/${getStudentCountyId()}/escola/${getStudentSchoolId()}/aluno/editar/${aluno?.ALU_ID}`);
              }}
            >
              Editar
            </ButtonPadrao>
          </div>
        </div>
      </CardButtons>
      <ModalPergunta
        show={modalShowQuestion}
        onHide={() => setModalShowQuestion(false)}
        onConfirm={changeAluno}
        buttonNo={`Não ${!active ? "Ativar" : "Desativar"}`}
        buttonYes={"Sim, Tenho Certeza"}
        text={`Você está ${active ? "desativando" : "ativando"} o aluno(a) “${
          aluno?.ALU_NOME
        }”.`}
        status={!active}
        size="lg"
      />
      <ModalConfirmacao
        show={modalShowConfirmQuestion}
        onHide={() => {
          setModalShowConfirmQuestion(false);
        }}
        text={modalStatus ? `${aluno?.ALU_NOME} ${
          !active ? "desativado" : "ativado"
        } com sucesso!` : modalErrorMessage ? modalErrorMessage : `Erro ao ${active ? "desativar" : "ativar"}`}
        status={modalStatus}
      />
    </>
  );
}
