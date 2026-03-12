import { TableSortLabel } from "@mui/material";
import { useMemo, useState } from "react";
import { useBreadcrumbContext } from "src/context/breadcrumb.context";
import { ItemSubject } from "src/services/sintese-geral.service";
import * as S from "./styles";

enum Niveis {
  regional = 'Regionais Estaduais',
  county = "Municípios",
  regionalSchool = 'Regionais Municipais/Únicas',
  school = "Escolas",
  schoolClass = "Turmas",
}

type TableProps = {
  orderBy: string;
  selectedItem: ItemSubject;
  isPdf?: boolean;
};

export function TableClassSubject({ orderBy, selectedItem, isPdf = false }: TableProps) {
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
    } else if (selectedItem.level === "regional") {
      changeStateRegional({
        id: id,
        name: name,
      });
      changeCounty(null);
    } else if (selectedItem.level === "county") {
      changeCounty({
        MUN_ID: id,
        MUN_NOME: name,
      });
      changeCountyRegional(null);
    } else if (selectedItem.level === "regionalSchool") {
      changeCountyRegional({
        id: id,
        name: name,
      });
      changeSchool(null);
    } else if (selectedItem.level === "school") {
      changeSchool({
        ESC_ID: id,
        ESC_NOME: name,
      });
      changeSchoolClass(null);
    } else if (selectedItem.level === "schoolClass") {
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

  return (
    <>
      <S.Container isPdf={isPdf}>
        <S.Content borderless striped isPdf={isPdf}>
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
                Percentual{" "}
                <TableSortLabel
                  active={selectedColumn === "value"}
                  onClick={() => handleSelectOrderByStatus("value")}
                  direction={order}
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.map((data, index) => (
              <tr key={index}>
                {!isPdf ? (
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
                ) : (
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
                )}
                <td>{data.countTotalStudents?.toLocaleString("pt-BR") || 0}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '100%',
                      height: '24px',
                      backgroundColor: '#E8E8E8',
                      borderRadius: '4px',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${data.value}%`,
                        height: '100%',
                        backgroundColor: '#5EC2B1',
                        transition: 'width 0.3s ease'
                      }}></div>
                    </div>
                    <span style={{ minWidth: '45px', textAlign: 'right', fontSize: '14px', fontWeight: 500 }}>
                      {data.value}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </S.Content>
      </S.Container>
    </>
  );
}
