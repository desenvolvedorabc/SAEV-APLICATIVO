import { useMemo, useState } from "react";
import * as S from "./styles";
import TableSortLabel from "@mui/material/TableSortLabel";
import { ItemSubject } from "src/services/sintese-geral.service";

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
  orderBy: string;
  selectedItem: ItemSubject;
  isPdf?: boolean;
};

export function TableNotesReading({ orderBy, selectedItem, isPdf = false }: TableProps) {
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [selectedColumn, setSelectedColumn] = useState("name");

  const data = useMemo(() => {
    let data = selectedItem.students;

    if (order) {
      if (order === "asc") {
        data = data?.sort((a, b) => {
          return ("" + a[selectedColumn]).localeCompare(b[selectedColumn]);
        });
      } else {
        data = data?.sort((a, b) => {
          return ("" + b[selectedColumn]).localeCompare(a[selectedColumn]);
        });
      }
    }

    return data;
  }, [order, selectedColumn, selectedItem.students]);

  function handleSelectOrderByStatus(column: string) {
    setSelectedColumn(column);
    setOrder((oldValue) => (oldValue === "asc" ? "desc" : "asc"));
  }
  return (
    <>
      <S.Container isPdf={isPdf}>
        <S.Content borderless striped>
          <thead>
            <tr>
              <th>
                Alunos ({data.length}){" "}
                <TableSortLabel
                  active={selectedColumn === "name"}
                  onClick={() => handleSelectOrderByStatus("name")}
                  direction={order}
                />
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
            {data.map((data, index) => (
              <tr key={index}>
                <td >{data.name}</td>
                {options.map((option) => (
                  <td
                    key={option}
                    className={`${
                      data.type === option &&
                    (  selectedItem.optionsReading?.includes(data.type)
                        ? "right"
                        : "wrong")
                    }`}
                  ></td>
                ))}
              </tr>
            ))}
          </tbody>
        </S.Content>
      </S.Container>
    </>
  );
}
