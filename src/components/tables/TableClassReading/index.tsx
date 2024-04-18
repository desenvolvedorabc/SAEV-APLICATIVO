import { TableSortLabel } from "@mui/material";
import { useMemo, useState } from "react";
import { useBreadcrumbContext } from "src/context/breadcrumb.context";
import { ItemSubject } from "src/services/sintese-geral.service";
import { TableNotesReading } from "../TableNotesReading";
import * as S from "./styles";

const arrayFake = [];

for (let i = 0; i < 8; i++) {
  const person = {
    name: `Turma ${i}`,
    general: Math.floor(Math.random() * 100),
    fluente: Math.floor(Math.random() * 999),
    nao_fluente: Math.floor(Math.random() * 999),
    frases: Math.floor(Math.random() * 100),
    palavras: Math.floor(Math.random() * 100),
    silabas: Math.floor(Math.random() * 100),
    nao_leitor: Math.floor(Math.random() * 9999),
    nao_avaliado: Math.floor(Math.random() * 100),
    nao_informado: Math.floor(Math.random() * 100),
  };
  arrayFake.push(person);
}

type TableProps = {
  orderBy: string;
  selectedItem: ItemSubject;
  isPdf?: boolean;
};

export function TableClassReading({ orderBy, selectedItem, isPdf = false }: TableProps) {
  const [isVisibleClass, setIsVisibleClass] = useState(false);
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [selectedColumn, setSelectedColumn] = useState("name");

  const {
    addBreadcrumbs,
    changeSchool,
    changeSchoolClass,
    handleClickBar,
    changeCounty,
  } = useBreadcrumbContext();

  const data = useMemo(() => {
    let data = selectedItem.items;

    if (order) {
      if (order === "asc") {
        data = data?.sort((a, b) => {
          if (selectedColumn === "name") {
            return ("" + a[selectedColumn]).localeCompare(b[selectedColumn]);
          }

          return a[selectedColumn] - b[selectedColumn];
        });
      } else {
        data = data?.sort((a, b) => {
          if (selectedColumn === "name") {
            return ("" + b[selectedColumn]).localeCompare(a[selectedColumn]);
          }

          return b[selectedColumn] - a[selectedColumn];
        });
      }
    }

    return data;
  }, [order, selectedColumn, selectedItem]);

  function handleSelectClass(id: string, name: string) {
    console.log(id, name);
    
    if (selectedItem.level === "county") {
      changeCounty({
        AVM_MUN: {
          MUN_ID: id,
          MUN_NOME: name,
        },
      });
      changeSchool(null);
    } else if (selectedItem.level === "school") {
      changeSchool({
        ESC_ID: id,
        ESC_NOME: name,
      });
      changeSchoolClass(null);
    } else if (
      selectedItem.level === "school-class" ||
      selectedItem.level === "schoolClass"
    ) {
      changeSchoolClass({
        TUR_ID: id,
        TUR_NOME: name,
      });
    }

    addBreadcrumbs(id, name, selectedItem.level);
    handleClickBar();
  }

  function handleSelectOrderByStatus(column: string) {
    setSelectedColumn(column);
    setOrder((oldValue) => (oldValue === "asc" ? "desc" : "asc"));
  }

  function totalInPercentage(value: number, total: number) {
    const valueCalculate = ((value / total) * 100).toFixed(1);

    return !!total ? ` (${valueCalculate}%)` : " (0.0%)";
  }

  return (
    <>
      <S.Container isPdf={isPdf}>
        <S.Content borderless striped>
          <thead>
            <tr>
              <th>
                {selectedItem.level === "school" ? "Escolas" : "Turmas"} (
                {data?.length}){" "}
                <TableSortLabel
                  active={selectedColumn === "name"}
                  onClick={() => handleSelectOrderByStatus("name")}
                  direction={order}
                />
              </th>
              <th>
                Total Alunos{" "}
                <TableSortLabel
                  active={selectedColumn === "countTotalStudents"}
                  onClick={() => handleSelectOrderByStatus("countTotalStudents")}
                  direction={order}
                />
              </th>
              <th>
                Fluente{" "}
                <TableSortLabel
                  active={selectedColumn === "fluente"}
                  onClick={() => handleSelectOrderByStatus("fluente")}
                  direction={order}
                />
              </th>
              <th>
                Não Fluente{" "}
                <TableSortLabel
                  active={selectedColumn === "nao_fluente"}
                  onClick={() => handleSelectOrderByStatus("nao_fluente")}
                  direction={order}
                />
              </th>
              <th>
                Frases{" "}
                <TableSortLabel
                  active={selectedColumn === "frases"}
                  onClick={() => handleSelectOrderByStatus("frases")}
                  direction={order}
                />
              </th>
              <th>
                Palavras{" "}
                <TableSortLabel
                  active={selectedColumn === "palavras"}
                  onClick={() => handleSelectOrderByStatus("palavras")}
                  direction={order}
                />
              </th>
              <th>
                Sílabas{" "}
                <TableSortLabel
                  active={selectedColumn === "silabas"}
                  onClick={() => handleSelectOrderByStatus("silabas")}
                  direction={order}
                />
              </th>
              <th>
                Não Leitor{" "}
                <TableSortLabel
                  active={selectedColumn === "nao_leitor"}
                  onClick={() => handleSelectOrderByStatus("nao_leitor")}
                  direction={order}
                />
              </th>
              <th>
                Não Avaliado{" "}
                <TableSortLabel
                  active={selectedColumn === "nao_avaliado"}
                  onClick={() => handleSelectOrderByStatus("nao_avaliado")}
                  direction={order}
                />
              </th>
              <th>
                Não informado{" "}
                <TableSortLabel
                  active={selectedColumn === "nao_informado"}
                  onClick={() => handleSelectOrderByStatus("nao_informado")}
                  direction={order}
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.map((data, index) => (
              <tr key={index}>
                <button style={{minHeight: 58}} onClick={() => handleSelectClass(data.id, data.name)}>
                  <td>{data.name}</td>
                </button>
                <td>{data.countTotalStudents.toLocaleString("pt-BR")}</td>
                <td>
                  {data.fluente.toLocaleString("pt-BR")} <br/>
                  {totalInPercentage(data.fluente, data.countTotalStudents)}
                </td>
                <td>
                  {data.nao_fluente.toLocaleString("pt-BR")} <br/>
                  {totalInPercentage(data.nao_fluente, data.countTotalStudents)}
                </td>
                <td>
                  {data.frases.toLocaleString("pt-BR")} <br/>
                  {totalInPercentage(data.frases, data.countTotalStudents)}
                </td>
                <td>
                  {data.palavras.toLocaleString("pt-BR")} <br/>
                  {totalInPercentage(data.palavras, data.countTotalStudents)}
                </td>
                <td>
                  {data.silabas.toLocaleString("pt-BR")} <br/>
                  {totalInPercentage(data.silabas, data.countTotalStudents)}
                </td>
                <td>
                  {data.nao_leitor.toLocaleString("pt-BR")} <br/>
                  {totalInPercentage(data.nao_leitor, data.countTotalStudents)}
                </td>
                <td>
                  {data.nao_avaliado.toLocaleString("pt-BR")} <br/>
                  {totalInPercentage(
                    data.nao_avaliado,
                    data.countTotalStudents
                  )}
                </td>
                <td>
                  {data.nao_informado.toLocaleString("pt-BR")} <br/>
                  {totalInPercentage(
                    data.nao_informado,
                    data.countTotalStudents
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </S.Content>
      </S.Container>
    </>
  );
}
