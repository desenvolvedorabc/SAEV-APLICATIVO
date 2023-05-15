import { useEffect, useMemo, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import {
  ItemSubject,
  StudentsAnswers,
} from "src/services/sintese-geral.service";
import { FooterTable } from "./FooterTable";

import * as S from "./styles";

const colorsNivel = {
  1: "#FF6868",
  2: "#FAA036",
  3: "#5EC2B1",
  4: "#3E8277",
};

const nivelLeitura = {
  fluente: "Fluente",
  palavras: "Palavras",
  nao_fluente: "Não Fluente",
  frases: "Frases",
  silabas: "Sílabas",
  nao_leitor: "Não Leitor",
  nao_avaliado: "Não Avaliado",
  nao_informado: "Não Informado",
};

function returnLevel(number: number) {
  if (number >= 75) {
    return 4;
  } else if (number >= 50) {
    return 3;
  } else if (number >= 25) {
    return 2;
  } else {
    return 1;
  }
}

interface TableAnswersProps {
  order: string;
  classe: ItemSubject;
  leitura: ItemSubject;
  isPdf?: boolean;
}

export function TableAnswers({ classe, order, leitura, isPdf = false }: TableAnswersProps) {
  const [classeOrder, setClasseOrder] = useState<ItemSubject>(classe);
  const formattedStudents = useMemo(() => {
    const users = classe?.students?.map((student) => {
      return {
        ...student,
        level: returnLevel(student.avg),
      };
    });

    return users;
  }, [classe.students]);

  useEffect(() => {
    let newDataStudents = formattedStudents;

    if (order === "menorMedia") {
      newDataStudents = newDataStudents?.sort((a, b) => {
        return a.avg - b.avg;
      });
    } else if (order === "maiorMedia") {
      newDataStudents = newDataStudents?.sort((a, b) => {
        return b.avg - a.avg;
      });
    } else if (order === "porNome") {
      newDataStudents = newDataStudents?.sort((a, b) => {
        return ("" + a.name).localeCompare(b.name);
      });
    } else if (order === "menorNivel") {
      newDataStudents = newDataStudents?.sort((a, b) => {
        return a.level - b.level;
      });
    } else if (order === "maiorNivel") {
      newDataStudents = newDataStudents?.sort((a, b) => {
        return b.level - a.level;
      });
    }

    const data = {
      ...classe,
      students: newDataStudents,
    };

    setClasseOrder(data);
  }, [order, classe, formattedStudents]);

  const getLeitura = (idAluno) => {
    let student = leitura?.students?.find((x) => x.id === idAluno)
    return nivelLeitura[student?.type]
  }

  const descriptors = classeOrder?.quests?.descriptors.sort((a, b) => a.TEG_ORDEM - b.TEG_ORDEM)
  
  return (
    <>
      <S.Container isPdf={isPdf}>
        <S.Content borderless striped>
          <thead>
            <tr>
              <th>Alunos ({classeOrder?.students?.length})</th>
              {descriptors?.map((data, index) => (
                 <th style={{textAlign: 'center'}} key={data.id}>
                  <div>
                 <OverlayTrigger
                   key={"toolTip"}
                   placement={"top"}
                   overlay={<Tooltip id={`tooltip-top`} className="tooltip">
                     <>
                     {data.description}
                     </>
                   </Tooltip>}
                 >
                  <span>{index + 1}</span>
                 </OverlayTrigger>
                 </div>
                </th>
               
              ))}
              <th style={{ textAlign: "center" }}>MEDIA</th>
              <th style={{ textAlign: "center", display: "flex" }}>
                NÍVEL
                <div className="tooltipTable">
                <OverlayTrigger
                  key={"toolTip"}
                  placement={"top"}
                  overlay={<Tooltip id={`tooltip-top`} className="tooltip">
                    <>
                    <strong>Nível 4 -</strong> de 75% a 100% de acerto (verde escuro)
                    <br/>
                    <strong>Nível 3 -</strong> de 50% a 74% de acerto (verde claro)
                    <br/>
                    <strong>Nível 2 -</strong> de 25% a 49% de acerto (laranja)
                    <br/>
                    <strong>Nível 1 -</strong> de 0% a 24% de acerto (vermelho)
                    </>
                  </Tooltip>}
                >
                  <S.IconTooltip>?</S.IconTooltip>
                </OverlayTrigger>
                </div>
                  
              </th>
              <th style={{textAlign: 'center'}}>LEITURA</th>
            </tr>
          </thead>
          <tbody>
            {classeOrder.students?.map((data, index) => (
              <tr key={index}>
                <td>{data.name}</td>
                {data?.quests?.length > 0 ? descriptors.map((descriptor, index) => {
                  const quest = data?.quests?.find((quest) => quest.questionId === descriptor.id)
                  if(quest) {
                    return (
                      <td
                        style={{ textAlign: "center" }}
                        key={index}
                        className={quest?.type}
                      >
                        {quest?.letter}
                      </td>
                    )
                  }

                  return (
                    <td
                      style={{ textAlign: "center" }}
                      key={index}
                      className="wrong"
                    >
                      -
                    </td>
                  )
                })
                :
                descriptors?.map((x, index) => (
                  <td
                    style={{ textAlign: "center" }}
                    key={index}
                    className={"wrong"}
                  >
                    -
                  </td>
                ))
                }
                <td style={{ textAlign: "center" }}>{data.avg}%</td>
                <td
                  style={{
                    textAlign: "center",
                    color: colorsNivel[data.level],
                  }}
                >
                  {data.level}
                </td>
                <td style={{ textAlign: "center" }}>
                  {getLeitura(data?.id)}
                </td>
              </tr>
            ))}
          </tbody>
        </S.Content>
      </S.Container>
      {!isPdf &&
        <FooterTable />
      }
    </>
  );
}
