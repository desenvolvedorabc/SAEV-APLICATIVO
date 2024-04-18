import * as S from "./styles";
import { MdCheckCircleOutline } from "react-icons/md";
import { AiOutlineCloseCircle } from "react-icons/ai";

const types = {
  fluente: 'Fluente',
  nao_fluente: 'Não Fluente',
  frases: 'Frases',
  palavras: 'Palavras',
  silabas: 'Silabas',
  nao_leitor: 'Não Leitor',
  nao_avaliado: 'Não Avaliado',
  nao_informado: 'Não Informado',
}

export function TableEvolutionaryLineReading({ info }) {
 
  return (
    <>
      <S.Container>
        <S.Content borderless>
          <thead>
            <tr>
              <th style={{fontSize: 14}} className="rowSpan">Edições</th>
              <th style={{fontSize: 14}} className="rowSpan">Total de Alunos</th>
              {Object.values(types).map((type) => (
                <th style={{fontSize: 14}} className="rowSpan" key={type}>
                  {type}{" "}
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
                  <td
                    style={{
                      borderLeft: '1px solid #b1c9b1',
                      margin: 'auto',
                    }}
                  >
                    {x?.subject?.countTotalStudents.toLocaleString('pt-BR')}
                  </td>
                  {Object.keys(types).map((key, index) => 
                    <td
                      key={`Part ${index}`}
                    >
                      {x?.subject[key].toLocaleString('pt-BR')}<br/>
                      ({(x?.subject[key] / x?.subject.countTotalStudents * 100).toFixed(1)}%)
                    </td>
                  )}
              </tr>
            </tbody>
          ))}
        </S.Content>
      </S.Container>
    </>
  );
}
