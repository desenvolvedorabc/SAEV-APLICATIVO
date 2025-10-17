import { TableSortLabel } from "@mui/material";
import { useMemo, useState } from "react";
import { useBreadcrumbContext } from "src/context/breadcrumb.context";
import { ItemSubject } from "src/services/sintese-geral.service";
import * as S from "./styles";

const arrayFake = [];

enum Niveis {
  regional = 'Regionais Estaduais',
  county = "Municípios",
  regionalSchool = 'Regionais Municipais/Únicas',
  school = "Escolas",
  schoolClass = "Turmas",
}

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
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [selectedColumn, setSelectedColumn] = useState("name");

  const {
    addBreadcrumbs,
    changeState,
    changeStateRegional,
    changeCounty,
    changeCountyRegional,
    changeSchool,
    changeSchoolClass,
    handleClickBar,
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
    if (selectedItem.level === "state") {
      changeState({
        id: id,
        name: name,
      });
      changeStateRegional(null);
      const url = window.location.href.split('&state=')
      const newUrl = url[0].concat('&state=' + id)
      window.history.pushState({ path: newUrl }, '', newUrl);
    } else if (selectedItem.level === "regional") {
      changeStateRegional({
        id: id,
        name: name,
      });
      changeCounty(null);
      const url = window.location.href.split('&stateRegional=')
      const newUrl = url[0].concat('&stateRegional=' + id)
      window.history.pushState({ path: newUrl }, '', newUrl);
    } else if (selectedItem.level === "county") {
      changeCounty({
        MUN_ID: id,
        MUN_NOME: name,
      });
      changeCountyRegional(null);
      const url = window.location.href.split('&countyId=')
      const newUrl = url[0].concat('&countyId=' + id + '&countyName=' + name)
      window.history.pushState({ path: newUrl }, '', newUrl);
    } else if (selectedItem.level === "regionalSchool") {
      changeCountyRegional({
        id: id,
        name: name,
      });
      changeSchool(null);
      const url = window.location.href.split('&countyRegional=')
      const newUrl = url[0].concat('&countyRegional=' + id)
      window.history.pushState({ path: newUrl }, '', newUrl);
    } else if (selectedItem.level === "school") {
      changeSchool({
        ESC_ID: id,
        ESC_NOME: name,
      });
      changeSchoolClass(null);
      const url = window.location.href.split('&school=')
      const newUrl = url[0].concat('&school=' + id)
      window.history.pushState({ path: newUrl }, '', newUrl);
    } else if (
      selectedItem.level === "schoolClass"
    ) {
      changeSchoolClass({
        TUR_ID: id,
        TUR_NOME: name,
      });
      const url = window.location.href.split('&schoolClass=')
      const newUrl = url[0].concat('&schoolClass=' + id)
      window.history.pushState({ path: newUrl }, '', newUrl);
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
                {Niveis[selectedItem.level] || selectedItem.level} (
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
                  <td>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      {data.name} 
                      {selectedItem.level === "school" ?
                        <div style={{ backgroundColor: '#989898', minWidth: '26px', height: '21px', borderRadius: '16px', textAlign: 'center', marginRight: '8px', color: '#fff', fontSize: '14px' }}>
                          {data.type === 'MUNICIPAL' ? 'M' : 'E'}
                        </div>
                        :
                        <div></div>
                      }
                    </div>
                  </td>
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
