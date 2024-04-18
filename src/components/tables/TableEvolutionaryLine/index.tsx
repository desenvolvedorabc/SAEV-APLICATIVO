import * as S from "./styles";
import { MdCheckCircleOutline } from "react-icons/md";
import { AiOutlineCloseCircle } from "react-icons/ai";

const types = {
  nao_leitor: 'Não Leitor',
  fluente: 'Fluente',
  nao_informado: 'Não Informado',
  frases: 'Frases',
  palavras: 'Palavras',
  silabas: 'Silabas',
  nao_avaliado: 'Não Avaliado',
  nao_fluente: 'Não Fluente'
}

export function TableEvolutionaryLine({ info, subjects, type }) {
  function getParticipacao(item, subject) {
    let value = null;

    let sub = item?.subjects?.find(x => x.name === subject.name)

    if(sub){
      if (type === "general") value = Number(sub.percentageFinished).toFixed(0);
      else value = sub.isParticipated;
    }

    // item?.subjects?.forEach((sub) => {
    //   if (subject === sub.name) {
    //     if (type === "general") value = sub.percentageFinished;
    //     else value = sub.isParticipated;
    //   }
    // });
    return value;
  }

  function getResultado(item, subject) {
    let value = null;

    let findSubject = item?.subjects?.find(x => x.name === subject.name)

    if(findSubject){
      if (type === "general") value = `${Number(findSubject.percentageRightQuestions).toFixed(0)}%`;
      else {
        if(String(findSubject.name).toLowerCase() === 'leitura') {
          value = types[findSubject?.readType];
        } else {
          value = `${Number(findSubject.totalRightQuestions).toFixed(0)}%`;
        }
      }
    }
    return value;
  }

  return (
    <>
      <S.Container>
        <S.Content borderless>
          <thead>
            <tr>
              <th className="rowSpan"></th>
              <th className="tooltipTable" style={{ paddingBottom: 25 }}>
                <span>
                  ?{" "}
                  <div className="tooltiptext">
                    <strong>Objetivas</strong>: percentual médio de acerto nas
                    provas objetivas de L. Portuguesa e Matemática
                    <br />
                    <strong>Leitura Oral</strong>: percentual de alunos que
                    atingiram os níveis satisfatórios de leitura de acordo com a
                    série.
                    <br />
                    <strong>1º EF</strong>: leitor de frases + leitor sem
                    fluência + leitor fluente
                    <br />
                    <strong>2º EF</strong> e <strong>3º EF</strong>: leitor sem
                    fluência + leitor fluente
                    <br />
                    <strong>4º EF</strong> e <strong>5º EF</strong>: leitor
                    fluente
                  </div>
                </span>
              </th>
              {subjects.map((subject) => (
                <th style={{fontSize: 14}} className="tooltipTable" key={subject.id}>
                  {subject.name}{" "}
                </th>
              ))}
            </tr>
          </thead>
          {info?.map((x) => (
            <tbody key={x.id}>
              <tr>
                <td
                  style={{
                    textAlign: "left",
                    width: "200px",
                    paddingLeft: "20px",
                  }}
                  className="rowSpan"
                  rowSpan={2}
                >
                  <p>{x.name}</p>
                </td>
                <td>Participação</td>
                {type === "general"
                  ? subjects.map((subject) => (
                      <S.TableInfo
                        key={`Part ${subject.id}`}
                        background={getParticipacao(x, subject)}
                      >
                        {getParticipacao(x, subject) != null &&
                          getParticipacao(x, subject) + "%"}
                      </S.TableInfo>
                    ))
                  : subjects.map((subject) => (
                      <S.TableInfo
                        key={`Part ${subject}`}
                        background={getParticipacao(x, subject)}
                      >
                        {getParticipacao(x, subject) ? (
                          getParticipacao(x, subject) ? (
                            <MdCheckCircleOutline />
                          ) : (
                            <AiOutlineCloseCircle />
                          )
                        ) : null}
                      </S.TableInfo>
                    ))}
              </tr>

              <tr>
                <td>Resultado</td>
                {subjects.map((subject) => (
                  <S.TableInfo
                    key={`Result ${subject}`}
                    background={getResultado(x, subject)}
                  >
                    {getResultado(x, subject) != null &&
                      getResultado(x, subject)}
                  </S.TableInfo>
                ))}
              </tr>
            </tbody>
          ))}
        </S.Content>
      </S.Container>
    </>
  );
}
