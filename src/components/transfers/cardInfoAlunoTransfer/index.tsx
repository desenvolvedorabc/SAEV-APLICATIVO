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
import Router from "next/router";
import Image from "next/image";
import { ButtonPadrao } from "src/components/buttons/buttonPadrao";
import ButtonVermelho from "src/components/buttons/buttonVermelho";
import ModalConfirmacao from "src/components/modalConfirmacao";
import { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import { Autocomplete, TextField } from "@mui/material";
import { getSchoolsTransfer } from "src/services/escolas.service";
import { useGetSchoolClassesTransfer } from "src/services/turmas.service";
import { createTransfer } from "src/services/transferencias.service";
import { useAuth } from "src/context/AuthContext";
import { isValidDate } from "src/utils/validate";

enum SchoolType {
  ESTADUAL = "Estadual",
  MUNICIPAL = "Municipal",
}

export function CardInfoAlunoTransfer({ aluno, url }) {
  const { user } = useAuth();
  const [modalShowConfirm, setModalShowConfirm] = useState(false);
  const [modalStatus, setModalStatus] = useState(true);
  const [schoolList, setSchoolList] = useState([]);
  const [school, setSchool] = useState(null);
  const [schoolClass, setSchoolClass] = useState(null);
  const [type, setType] = useState(null);

  const typeOptions = (() => {
    const role = user?.USU_SPE?.role;
    if (role === "MUNICIPIO_MUNICIPAL") return ["MUNICIPAL"];
    if (role === "MUNICIPIO_ESTADUAL") return ["ESTADUAL"];
    if (role === "ESCOLA") return user?.USU_ESC?.ESC_TIPO ? [user.USU_ESC.ESC_TIPO] : [];
    return ["ESTADUAL", "MUNICIPAL"];
  })();

  const [isDisable, setIsDisable] = useState(true);
  const [errorMessage, setErrorMessage] = useState(true);

  const loadSchool = useCallback(async () => {
    try {
      const resp = await getSchoolsTransfer(
        null,
        1,
        9999,
        "ESC_NOME",
        "ASC",
        "1",
        null,
        type,
        true,
      );

      const allSchools = resp.data?.items || [];

      setSchoolList(allSchools);

      if (user?.USU_SPE?.role === "ESCOLA" && allSchools.length === 1) {
        setSchool(allSchools[0]);
      }
    } catch (error) {
      console.error("Error loading schools:", error);
      setSchoolList([]);
    }
  }, [type, user]);

  useEffect(() => {
    if (!user) return;

    if (user?.USU_SPE?.role !== "SAEV") {
      if (user?.USU_SPE?.role === "ESCOLA") {
        setType(user.USU_ESC.ESC_TIPO);
        return;
      }

      const types = {
        MUNICIPIO_ESTADUAL: "ESTADUAL",
        MUNICIPIO_MUNICIPAL: "MUNICIPAL",
      };

      const defaultType = types[user?.USU_SPE?.role];
      if (defaultType) {
        setType(defaultType);
      }
    } else {
      loadSchool();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (type && user?.USU_SPE?.role === "ESCOLA") {
      loadSchool();
    } else if (type) {
      loadSchool();
    }
  }, [type, loadSchool]);

  const { data: classList, isLoading: isLoadingSchoolClass } =
    useGetSchoolClassesTransfer(
      null,
      1,
      9999,
      "TURMA_TUR_ANO",
      "ASC",
      null,
      null,
      school?.ESC_ID,
      null,
      null,
      1,
      !!school,
    );

  async function handleTransfer() {
    const data = {
      TRF_ALU: aluno.ALU_ID,
      TRF_ESC_ORIGEM: aluno?.ALU_ESC?.ESC_ID ? aluno?.ALU_ESC?.ESC_ID : null,
      TRF_TUR_ORIGEM: aluno?.ALU_TUR?.TUR_ID ? aluno?.ALU_TUR?.TUR_ID : null,
      TRF_ESC_DESTINO: school?.ESC_ID,
      TRF_TUR_DESTINO: schoolClass?.TURMA_TUR_ID,
      TRF_STATUS: null,
      TRF_USU_STATUS: null,
      TRF_JUSTIFICATIVA: null,
    };

    setIsDisable(true);
    let response = null;
    try {
      response = await createTransfer(data);
    } catch (err) {
      setIsDisable(false);
    } finally {
      setIsDisable(false);
    }

    if (response.data?.status === 401) {
      setModalStatus(false);
      setModalShowConfirm(true);
      setErrorMessage(
        response.data?.message || "Erro ao solicitar transferência",
      );
    } else {
      setModalStatus(true);
      setModalShowConfirm(true);
    }
  }

  const handleChangeSchool = (newValue) => {
    setSchool(newValue);
    setSchoolClass(null);
    setIsDisable(true);
  };

  const handleChangeSchoolClass = (newValue) => {
    setSchoolClass(newValue);
    if (
      school &&
      newValue &&
      (school?.ESC_ID !== aluno?.ALU_ESC?.ESC_ID ||
        newValue?.TURMA_TUR_ID !== aluno?.ALU_TUR?.TUR_ID)
    ) {
      setIsDisable(false);
    } else {
      setIsDisable(true);
    }
  };

  const getPcd = () => {
    let pcdString = "";
    aluno?.ALU_DEFICIENCIAS?.forEach((pcd, index) => {
      pcdString = pcdString.concat(pcd.PCD_NOME);
      if (index < aluno?.ALU_DEFICIENCIAS.length - 1) {
        pcdString = pcdString.concat(", ");
      }
    });
    return pcdString;
  };

  return (
    <>
      <CardStyled>
        <div className="d-flex">
          <BoxAvatar className="d-flex flex-column">
            <Logo className="rounded-circle">
              {aluno?.ALU_AVATAR ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`${url}/student/avatar/${aluno?.ALU_AVATAR}`}
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
                {isValidDate(aluno?.ALU_DT_NASC) &&
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
                {aluno?.ALU_DEFICIENCIA_BY_IMPORT
                  ? ", " + aluno?.ALU_DEFICIENCIA_BY_IMPORT
                  : ""}
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
                {aluno?.ALU_EMAIL.trim() ? aluno?.ALU_EMAIL : "-"}
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
        <div style={{ width: 140, marginRight: 10 }}>
          <ButtonVermelho
            onClick={(e) => {
              Router.push("/transferencias");
            }}
          >
            Cancelar
          </ButtonVermelho>
        </div>
        <div className="d-flex">
          <div style={{ width: 150, marginRight: 10 }}>
            <Autocomplete
              className=""
              id="type"
              size="small"
              value={type}
              noOptionsText="Rede"
              options={typeOptions}
              getOptionLabel={(option) => `${SchoolType[option]}`}
              onChange={(_event, newValue) => {
                setType(newValue);
                handleChangeSchool(null);
              }}
              sx={{
                "& .Mui-disabled": {
                  background: "#D3D3D3",
                },
              }}
              renderInput={(params) => (
                <TextField size="small" {...params} label="Rede" />
              )}
            />
          </div>
          <div style={{ width: 380, marginRight: 10 }}>
            <Autocomplete
              style={{ background: "#FFF" }}
              className=""
              id="size-small-outlined"
              size="small"
              value={school}
              noOptionsText="Selecione a Escola de Destino"
              options={schoolList}
              getOptionLabel={(option) =>
                `${
                  !type
                    ? option?.ESC_TIPO === "MUNICIPAL"
                      ? "Escola Municipal"
                      : "Escola Estadual"
                    : ""
                } ${option?.ESC_NOME} - ${
                  option?.ESC_MUN?.MUN_NOME ? option?.ESC_MUN?.MUN_NOME : ""
                } - ${option?.ESC_UF}`
              }
              onChange={(_event, newValue) => {
                handleChangeSchool(newValue);
              }}
              sx={{
                "& .Mui-disabled": {
                  background: "#D3D3D3",
                },
              }}
              renderInput={(params) => (
                <TextField
                  size="small"
                  {...params}
                  label="Selecione a Escola de Destino"
                />
              )}
            />
          </div>
          <div style={{ width: 190, marginRight: 10 }}>
            <Autocomplete
              className=""
              id="size-small-outlined"
              size="small"
              value={schoolClass}
              noOptionsText="Turma"
              options={classList?.items ? classList?.items : []}
              getOptionLabel={(option) =>
                `${option?.TURMA_TUR_ANO} - ${option?.TURMA_TUR_NOME}`
              }
              onChange={(_event, newValue) => {
                handleChangeSchoolClass(newValue);
              }}
              disabled={school === null}
              loading={isLoadingSchoolClass}
              sx={{
                "& .Mui-disabled": {
                  background: "#D3D3D3",
                },
              }}
              renderInput={(params) => (
                <TextField size="small" {...params} label="Turma" />
              )}
            />
          </div>
          <div style={{ width: 185, marginRight: 10 }}>
            <ButtonPadrao
              onClick={(e) => {
                e.preventDefault();
                handleTransfer();
              }}
              disable={isDisable}
            >
              Solicitar Transferência
            </ButtonPadrao>
          </div>
        </div>
      </CardButtons>
      <ModalConfirmacao
        show={modalShowConfirm}
        onHide={() => {
          setModalShowConfirm(false);
        }}
        text={modalStatus ? "Pedido enviado com sucesso." : errorMessage}
        status={modalStatus}
      />
    </>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      url: process.env.NEXT_PUBLIC_API_URL,
    },
  };
}
