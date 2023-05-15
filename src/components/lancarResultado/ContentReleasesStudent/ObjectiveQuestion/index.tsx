import { useEffect, useState } from "react";
import * as S from "./styles";

type ObjectiveQuestion = {
  number_question: number;
  isReset: boolean;
  id: number;
  questionUserSelect: string;
  questionsUser: any[];
  isEditionAvailable: boolean;
  setIsReset: (value: boolean) => void;
  selectQuestion: (option: string, idQuestion: number) => void;
};

export function ObjectiveQuestion({
  number_question,
  isReset,
  id,
  questionsUser,
  isEditionAvailable,
  selectQuestion,
  questionUserSelect,
  setIsReset,
}: ObjectiveQuestion) {
  const [selectedOption, setSelectedOption] = useState(questionUserSelect);

  useEffect(() => {
    if (isReset) {
      setSelectedOption("");
      setIsReset(false);
    }
  }, [isReset, setIsReset]);

  function handleSelectOption(option: string) {
    if (isEditionAvailable) {
      return;
    }
    setSelectedOption(option);
    selectQuestion(option, id);
  }

  useEffect(() => {
    const questionUser = questionsUser?.find((data) => data.questionTemplateTEGID === id);

    setSelectedOption(questionUser?.ATR_RESPOSTA?.toLowerCase() ?? "");
  }, [id, questionsUser]);

  return (
    <S.Container className={isEditionAvailable && "disable"}>
      <span>{number_question}</span>
      <span
        onClick={() => handleSelectOption("a")}
        className={selectedOption === "a" && "checked"}
      >
        A
      </span>
      <span
        onClick={() => handleSelectOption("b")}
        className={selectedOption === "b" && "checked"}
      >
        B
      </span>
      <span
        onClick={() => handleSelectOption("c")}
        className={selectedOption === "c" && "checked"}
      >
        C
      </span>
      <span
        onClick={() => handleSelectOption("d")}
        className={selectedOption === "d" && "checked"}
      >
        D
      </span>

      <span
        onClick={() => handleSelectOption("-")}
        className={selectedOption === "-" && "checked"}
      >
        -
      </span>
    </S.Container>
  );
}
