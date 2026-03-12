import { OverlayTrigger, Tooltip } from "react-bootstrap";
import * as S from "./styles";
import { FooterTable } from "./FooterTable";
import { ReportStudentData } from "src/services/report-student";

type ReportStudentProps = { info: ReportStudentData };

export default function ReportStudent({
  info
}: ReportStudentProps) {
  return <>
    <S.Container>
      <S.Content borderless striped>
        <thead>
          <tr>
            <th>Aluno</th>
            {info?.quests?.descriptors?.map((data, index) => (
              <th style={{ textAlign: 'center' }} key={data.id}>
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
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{info?.student?.ALU_NOME}</td>
            {info?.student?.quests?.length > 0 ? info?.quests?.descriptors.map((descriptor, index) => {
              const quest = info?.student?.quests?.find((quest) => quest.questionId === descriptor.id)
              if (quest) {
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
              info?.quests?.descriptors?.map((x, index) => (
                <td
                  style={{ textAlign: "center" }}
                  key={index}
                  className={"wrong"}
                >
                  -
                </td>
              ))
            }
            <td style={{ textAlign: "center" }}>{info?.student?.avg}%</td>
          </tr>
        </tbody>
      </S.Content>
    </S.Container>
    <FooterTable />
  </>;
}