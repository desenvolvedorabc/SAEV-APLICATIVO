import Image from "next/image";
import { memo, useEffect, useMemo, useState } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import ButtonWhite from "src/components/buttons/buttonWhite";
import ModalConfirmacao from "src/components/modalConfirmacao";
import { ObjectiveQuestion } from "../ObjectiveQuestion";
import { ReadingQuestion } from "../ReadingQuestion";
import * as S from "./styles";
import {
  deleteReleasesResults,
  ReleasesResults,
  sendReleasesResults,
} from "src/services/lancar-resultados.service";
import ModalAviso from "src/components/modalAviso";
import { MdCheckCircleOutline } from "react-icons/md";
import { format } from "date-fns";
import { ButtonPadrao } from "src/components/buttons/buttonPadrao";
import { toast } from "react-toastify";

type DetailsProps = {
  totalStudents: number;
  selectedReleaseSubject: ReleasesResults;
  isEditionAvailable: boolean;
  index: number;
  subject: string;
  data: any;
  setCountFinished: any;
  url: string;
  changeQuantityLoading: any;
};

type SelectQuestion = {
  ATR_RESPOSTA: string;
  ATR_TEG: number;
};

export function DetailsStudentRelease({
  data,
  subject,
  selectedReleaseSubject,
  totalStudents,
  isEditionAvailable,
  index,
  setCountFinished,
  url,
  changeQuantityLoading,
}: DetailsProps) {
  const [isReset, setIsReset] = useState(false);
  const [selectQuestions, setSelectQuestions] = useState<SelectQuestion[]>([]);
  const [selectOptionReading, setSelectOptionReading] = useState("");
  const [isPerformedActivity, setIsPerformedActivity] = useState(true);
  const [feedbackSaveUser, setFeedbackSaveUser] = useState("");
  const [justificativa, setJustificativa] = useState("");
  const [isQuestionsFinish, setIsQuestionsFinish] = useState(false);
  const [modalShowWarning, setModalShowWarning] = useState(false);
  const [questionsUser, setQuestionsUser] = useState([]);
  const [textModalWarningRelease, setTextModalWarningRelease] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  let count = 0;

  async function handleSelectQuestion(option: string, idQuestion: number) {
    const newSelectQuestion = {
      ATR_RESPOSTA: option.toUpperCase(),
      ATR_TEG: idQuestion,
    };

    const newSelectQuestionUser = {
      ATR_RESPOSTA: option.toUpperCase(),
      questionTemplateTEGID: idQuestion,
    };

    const filterQuestions = selectQuestions.filter(
      (data) => data.ATR_TEG !== newSelectQuestion.ATR_TEG
    );

    const formattedData = [...filterQuestions, newSelectQuestion];
    const filterQuestionsUser = questionsUser.filter(
      (data) =>
        data.questionTemplateTEGID !==
        newSelectQuestionUser.questionTemplateTEGID
    );

    const formattedQuestionUser = [
      ...filterQuestionsUser,
      newSelectQuestionUser,
    ];

    setSelectQuestions(formattedData);
  }

  async function handleSelectJustificativa(value: string) {
    if (isEditionAvailable) {
      return;
    }

    setJustificativa(value);
    setSelectOptionReading("");

    if (!justificativa.trim()) {
      setCountFinished((oldValue) => oldValue + 1);
    }
  }

  useEffect(() => {
    if (data?.answers?.length) {
      setIsPerformedActivity(!!data?.answers[0]?.ALT_FINALIZADO);
    }
    setJustificativa(data?.answers[0]?.ALT_JUSTIFICATIVA ?? "");
    setQuestionsUser(data.answers);
    setSelectOptionReading(data?.answers[0]?.ATR_RESPOSTA ?? "");

    const filterQuestionsStudent = data?.answers.filter(
      (data) => !!data?.questionTemplateTEGID
    );

    setIsQuestionsFinish(
      data?.template?.length === filterQuestionsStudent?.length
    );
  }, [data.answers, data?.template]);

  const filterQuestions = useMemo(() => {
    return data?.template?.sort((a, b) => a.TEG_ORDEM - b.TEG_ORDEM);
  }, [data?.template]);

  const questions = useMemo(() => {
    let corte = 0;
    if (filterQuestions?.length > 20) {
      corte = Math.floor(filterQuestions?.length / 3);
    } else if (filterQuestions?.length > 10) {
      corte = Math.floor(filterQuestions?.length / 2);
    } else {
      corte = 10;
    }

    const meuArray = filterQuestions,
      novoArray = [];

    for (let i = 0; i < meuArray.length; i = i + corte) {
      novoArray.push(meuArray.slice(i, i + corte));
    }

    return novoArray;
  }, [filterQuestions]);

  async function handleClearAnswers() {
    if (isEditionAvailable || isLoading) {
      return;
    }
    
    const formattedQuestions = data?.answers.map((a) => {
      return {
        ATR_RESPOSTA: a?.ATR_RESPOSTA,
        ATR_TEG: a?.questionTemplateTEGID,
      };
    });

    const newData = {
      ALT_ATIVO: true,
      ALT_TES: selectedReleaseSubject?.subjects[0]?.TES_ID,
      ALT_ALU: data?.ALU_ID,
      ALT_FINALIZADO: isPerformedActivity,
      ALT_JUSTIFICATIVA: justificativa,
      ALT_RESPOSTAS:
        subject === "Leitura"
          ? formattedQuestions
          : [
              {
                ALT_RESPOSTA: selectOptionReading,
                ATR_TEG: null,
              },
            ],
    };

    try {
      setFeedbackSaveUser(" | Salvando...");
      setIsLoading(true);
      changeQuantityLoading(true);
      await deleteReleasesResults(newData);
      setFeedbackSaveUser(" | Salvo ✅");
      setIsReset(true);
      setSelectOptionReading("");
      setIsPerformedActivity(true);
      setJustificativa("");
      setQuestionsUser([]);
      setSelectQuestions([]);
      setIsQuestionsFinish(false);
      setModalShowWarning(false);

      if (
        isQuestionsFinish ||
        justificativa.trim() ||
        selectOptionReading.trim()
      ) {
        setCountFinished((oldValue) => oldValue - 1);
      }
    } catch (e) {
      setIsLoading(false);
      setFeedbackSaveUser(" | Não Salvo ❌");
      changeQuantityLoading(false);
    } finally {
      setIsLoading(false);
      changeQuantityLoading(false);
    }
  }

  async function saveResults() {
    if (isEditionAvailable || isLoading) {
      return;
    }

    if (!isPerformedActivity && !justificativa.trim()) {
      return setTextModalWarningRelease(
        "Informe uma justificativa pra esse aluno."
      );
    }

    if (
      !selectQuestions.length &&
      !justificativa.trim() &&
      !selectOptionReading?.trim()
    ) {
      return setTextModalWarningRelease(
        "Você não pode salvar um cartão resposta vazio."
      );
    }

    if (
      isPerformedActivity &&
      !selectOptionReading &&
      selectQuestions.length !== data?.template?.length
    ) {
      return setTextModalWarningRelease(
        "O primeiro lançamento precisa que o cartão esteja todo preenchido."
      );
    }

    const newData = {
      ALT_ATIVO: isPerformedActivity,
      ALT_TES: selectedReleaseSubject?.subjects[0]?.TES_ID,
      ALT_ALU: data?.ALU_ID,
      ALT_FINALIZADO: isPerformedActivity,
      ALT_JUSTIFICATIVA: isPerformedActivity ? "" : justificativa,
      ALT_RESPOSTAS: !isPerformedActivity ? [] : selectQuestions,
    };

    try {
      setFeedbackSaveUser(" | Salvando...");
      setIsLoading(true);
      changeQuantityLoading(true);
      await sendReleasesResults(newData);
      setFeedbackSaveUser(" | Salvo ✅");
      toast.success(`${data.ALU_NOME} lançado com sucesso.`);

      if (subject?.toLowerCase() !== "leitura") {
        setIsQuestionsFinish(true);
      }
    } catch (e) {
      setIsLoading(false);
      setFeedbackSaveUser(" | Não Salvo ❌");
      toast.error(`${data.ALU_NOME} não lançado.`);
      changeQuantityLoading(false);
    } finally {
      setIsLoading(false);
      changeQuantityLoading(false);
    }
  }

  async function handleSelectOptionReading(option: string) {
    const oldOption = selectOptionReading;
    if (oldOption === option || isLoading) {
      return;
    }

    const formattedData = {
      ATR_RESPOSTA: option,
      ATR_TEG: null,
      ATR_ID: questionsUser[0]?.ATR_ID,
    };

    const newData = {
      ALT_ATIVO: true,
      ALT_TES: selectedReleaseSubject?.subjects[0]?.TES_ID,
      ALT_ALU: data?.ALU_ID,
      ALT_FINALIZADO: isPerformedActivity,
      ALT_JUSTIFICATIVA: "",
      ALT_RESPOSTAS: [formattedData],
    };

    setSelectQuestions([formattedData]);

    setJustificativa("");
    setSelectOptionReading(option);
    if (!selectOptionReading.trim()) {
      setCountFinished((oldValue) => oldValue + 1);
    }
  }

  return (
    <>
      <S.Container>
        <header>
          <p>
            Aluno(a) {index + 1} de {totalStudents} {feedbackSaveUser}
          </p>

          <p>
            <span>
              {selectedReleaseSubject?.AVA_NOME} - Teste de {subject}
            </span>
          </p>

          <div style={{ width: 160 }}>
            <ButtonWhite
              disable={isEditionAvailable || isLoading}
              type="button"
              onClick={() => setModalShowWarning(true)}
            >
              Limpar Respostas
            </ButtonWhite>
          </div>
        </header>

        <S.DetailsStudent>
          <div>
            <div className="rounded-circle">
              {data?.ALU_AVATAR?.trim() ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`${url}/${data?.ALU_AVATAR}`}
                  className="rounded-circle"
                  width={100}
                  height={100}
                  alt="avatar"
                />
              ) : (
                <Image
                  src="/assets/images/avatar.png"
                  className="rounded-circle"
                  width={100}
                  height={100}
                  alt="avatar"
                />
              )}
            </div>
            <div>
              <h4>
                {data.ALU_NOME} (INEP {data.ALU_INEP})
              </h4>
              <h6>
                {data.ALU_SER.SER_NOME} - {data.ALU_TUR.TUR_NOME}{" "}
                {data.ALU_TUR.TUR_PERIODO}
              </h6>

              <p>{data.ALU_ESC.ESC_NOME}</p>
            </div>
          </div>

          <div>
            <FormControl className="w-100" size="small">
              <InputLabel id="periodo">Realizou a Atividade?</InputLabel>
              <Select
                labelId="periodo"
                id="periodo"
                disabled={isEditionAvailable || isLoading}
                value={isPerformedActivity ? "sim" : "nao"}
                defaultValue="sim"
                label="Realizou a Atividade?"
                onChange={(e) =>{
                  setIsPerformedActivity(e.target.value === "sim"),
                  handleSelectJustificativa(""),
                  setSelectQuestions([])
                }}
              >
                <MenuItem value="sim">Sim</MenuItem>
                <MenuItem value="nao">Não</MenuItem>
              </Select>
            </FormControl>

            {!isPerformedActivity && (
              <FormControl className="w-100" size="small">
                <InputLabel id="periodo">Justificativa</InputLabel>
                <Select
                  labelId="periodo"
                  disabled={isEditionAvailable || isLoading}
                  id="periodo"
                  value={justificativa}
                  defaultValue="sim"
                  label="Justificativa"
                  onChange={(e) => {
                    handleSelectJustificativa(e.target.value);
                  }}
                >
                  <MenuItem value="Recusou-se a participar">
                    Recusou-se a participar
                  </MenuItem>
                  <MenuItem value="Faltou mas está Frequentando a escola">
                    Faltou mas está Frequentando a escola
                  </MenuItem>
                  <MenuItem value="Abandonou a escola">
                    Abandonou a escola
                  </MenuItem>
                  <MenuItem value="Foi Transferido para outra escola">
                    Foi Transferido para outra escola
                  </MenuItem>
                  <MenuItem value="Motivos de deficiência">
                    Motivos de deficiência
                  </MenuItem>
                  <MenuItem value="Não participou">Não participou</MenuItem>
                </Select>
              </FormControl>
            )}
          </div>
        </S.DetailsStudent>

        <S.ContentQuestions
          quantity={subject != "Leitura" ? questions?.length : 1}
        >
          {subject === "Leitura" && isPerformedActivity ? (
            <ReadingQuestion
              isEditionAvailable={isEditionAvailable || isLoading}
              isReset={isReset}
              selectOptionReading={selectOptionReading}
              handleSelectOptionReading={handleSelectOptionReading}
              setIsReset={setIsReset}
            />
          ) : (
            <>
              {isPerformedActivity && (
                <>
                  {questions.map((question, indexQuestion) => (
                    <div key={index}>
                      {question.map((temp, index) => {
                        count++;

                        const questionUser = questionsUser.find(
                          (data) => data.questionTemplateTEGID === temp.TEG_ID
                        );

                        return (
                          <ObjectiveQuestion
                            key={temp?.TEG_ID}
                            setIsReset={setIsReset}
                            questionsUser={questionsUser}
                            isEditionAvailable={isEditionAvailable || isLoading}
                            id={temp?.TEG_ID}
                            selectQuestion={handleSelectQuestion}
                            questionUserSelect={
                              questionUser?.ATR_RESPOSTA?.toLowerCase() ?? ""
                            }
                            isReset={isReset}
                            number_question={count}
                          />
                        );
                      })}
                    </div>
                  ))}
                </>
              )}
            </>
          )}
        </S.ContentQuestions>
        <S.BottomContent>
          <div>
            {data?.answers[0]?.USU_NOME ? (
              <p>
                Lançado dia{" "}
                {data?.answers[0]?.ALT_DT_ATUALIZACAO &&
                  format(
                    new Date(data?.answers[0]?.ALT_DT_ATUALIZACAO),
                    "dd/MM/yyyy HH:mm:ss"
                  )}{" "}
                por {data?.answers[0]?.USU_NOME}
              </p>
            ) : (
              <div />
            )}

            <ButtonPadrao
              type="button"
              disable={isEditionAvailable || isLoading}
              onClick={saveResults}
            >
              {isLoading ? (
                <b style={{ color: "black" }}>Salvando...</b>
              ) : (
                "Salvar"
              )}
            </ButtonPadrao>
          </div>
          {data?.answers[0]?.ALT_BY_HERBY ? (
            <S.FlagHerby>
              <S.TextFlag>Resultado Processado pelo Herby</S.TextFlag>
              <div>
                <MdCheckCircleOutline size={18} />{" "}
              </div>
            </S.FlagHerby>
          ) : data?.answers[0]?.ALT_BY_EDLER ? (
            <S.FlagHerby>
              <S.TextFlag>Resultado Processado pelo Édeler</S.TextFlag>
              <div>
                <MdCheckCircleOutline size={18} />{" "}
              </div>
            </S.FlagHerby>
          ) : data?.answers[0]?.ALT_BY_AVA_ONLINE ? (
            <S.FlagHerby>
              <S.TextFlag>Resultado Processado pela Avaliação Online</S.TextFlag>
              <div>
                <MdCheckCircleOutline size={18} />{" "}
              </div>
            </S.FlagHerby>
          ) : null}
        </S.BottomContent>
      </S.Container>
      <ModalConfirmacao
        show={textModalWarningRelease?.trim()}
        onHide={() => setTextModalWarningRelease(null)}
        text={textModalWarningRelease}
        textConfirm="Fechar"
        warning
        status={false}
      />
      <ModalAviso
        show={modalShowWarning}
        onConfirm={handleClearAnswers}
        onHide={() => {
          // setModalShowConfirm(true);
          setModalShowWarning(false);
          // setModalTextConfirm("Dados de infrequência descartados.");
          // Router.reload();
        }}
        buttonNo={"Manter respostas"}
        buttonYes={"Sim, Limpar"}
        text={`Tem certeza que deseja limpar as respostas desse aluno?`}
        warning
      />
    </>
  );
}

export const DetailsStudent = memo(DetailsStudentRelease);
