import { useEffect, useState } from "react";
import * as S from "./styles";

type ReadingProps = {
  isReset: boolean;
  isEditionAvailable: boolean;
  selectOptionReading: string;
  setIsReset: (value: boolean) => void;
  handleSelectOptionReading: (option: string) => void;
};

export function ReadingQuestion({ isReset, setIsReset, isEditionAvailable,handleSelectOptionReading, selectOptionReading}: ReadingProps) {
  const [selectedOption, setSelectedOption] = useState(selectOptionReading);
  
  useEffect(() => {
    if (isReset) {
      setSelectedOption("");
      setIsReset(false);
    }
  }, [isReset, setIsReset]);

  useEffect(() => {
    setSelectedOption(selectOptionReading)
  }, [selectOptionReading])

  function handleSelectOption(option: string) {
    if(isEditionAvailable) {
      return;
    }

    handleSelectOptionReading(option);
    setSelectedOption(option);
  }

  useEffect(() => {
    setSelectedOption(selectOptionReading)
  }, [selectOptionReading])

  return (
    <S.Container className={isEditionAvailable && 'disable'}>
      <div>
        <span>1</span>
        <span
          onClick={() => handleSelectOption("nao_leitor")}
          className={selectedOption === "nao_leitor" && "checked"}
        >
          Não Leitor
        </span>
      </div>
      <div>
        <span>2</span>
        <span
          onClick={() => handleSelectOption("silabas")}
          className={selectedOption === "silabas" && "checked"}
        >
          Sílabas
        </span>
      </div>
      <div>
        <span>3</span>
        <span
          onClick={() => handleSelectOption("palavras")}
          className={selectedOption === "palavras" && "checked"}
        >
          Palavras
        </span>
      </div>
      <div>
        <span>4</span>
        <span
          onClick={() => handleSelectOption("frases")}
          className={selectedOption === "frases" && "checked"}
        >
          Frase
        </span>
      </div>
      <div>
        <span>5</span>
        <span
          onClick={() => handleSelectOption("nao_fluente")}
          className={selectedOption === "nao_fluente" && "checked"}
        >
          Sem Fluência{" "}
        </span>
      </div>
      <div>
        <span>6</span>
        <span
          onClick={() => handleSelectOption("fluente")}
          className={selectedOption === "fluente" && "checked"}
        >
          Fluente
        </span>
      </div>
    </S.Container>
  );
}
