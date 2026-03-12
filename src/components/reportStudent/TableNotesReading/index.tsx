import { useMemo, useState } from "react";
import * as S from "./styles";
import TableSortLabel from "@mui/material/TableSortLabel";
import { ReportStudentData } from "src/services/report-student";

const options = [
  "fluente",
  "nao_fluente",
  "frases",
  "palavras",
  "silabas",
  "nao_leitor",
  "nao_avaliado",
  "nao_informado",
];

type TableProps = {
  selectedItem: ReportStudentData;
  isPdf?: boolean;
};

export function TableNotesReading({ selectedItem, isPdf = false }: TableProps) {

  
  return (
    <>
      <S.Container isPdf={isPdf}>
        <S.Content borderless striped>
          <thead>
            <tr>
              <th>
                Aluno{" "}
              </th>
              <th>Fluente</th>
              <th>Não Fluente</th>
              <th>Frases</th>
              <th>Palavras</th>
              <th>Sílabas</th>
              <th>Não Leitor</th>
              <th>Não Avaliado</th>
              <th>Não informado</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td >{selectedItem?.student?.ALU_NOME}</td>
              {options.map((option) => (
                <td
                  key={option}
                  className={`${
                    selectedItem?.student?.type === option
                    ? "right"
                    : "wrong"
                  }`}
                ></td>
              ))}
            </tr>
          </tbody>
        </S.Content>
      </S.Container>
    </>
  );
}
