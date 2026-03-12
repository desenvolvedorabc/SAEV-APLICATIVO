import { useMemo } from "react";
import { ItemSubject } from "src/services/sintese-geral.service";
import {
  PerformanceHistoryItem,
  PerformanceHistoryTest,
} from "src/services/historico-desempenho.service";
import {
  PerfHistoryNiveisReading,
  PerfHistoryNiveisReadingColor,
} from "pages/historico-desempenho";

const LEVELS = {
  students: "Alunos",
  schoolClass: "Turmas",
  school: "Escolas",
  regional: "Regionais",
};

type TableProps = {
  level: string,
  items: PerformanceHistoryItem[];
  selectedSubject: ItemSubject;
  isPdf?: boolean;
};

type TableData = {
  studentId: number;
  studentName: string;
  tests: {
    assessmentId: string;
    assessmentName: string;
    type: string;
  }[];
};

export function TableClassReadingPerformanceHistory({
  level,
  items,
  selectedSubject,
  isPdf = false,
}: TableProps) {
  const tests = useMemo(() => {
    let aux: ({
      assessmentId: string;
      assessmentName: string;
    } & PerformanceHistoryTest)[] = [];

    for (const item of items) {
      const subjectTests = item.tests.filter(
        (x) => x.subject === selectedSubject.subject
      );
      aux.push(
        ...subjectTests.map((x) => ({
          ...x,
          assessmentId: item.id,
          assessmentName: item.name,
        }))
      );
    }

    return aux;
  }, [items]);

  const data: TableData[] = useMemo(() => {
    let students = tests[0]?.data;

    if (!students) return [];

    return students.map((student) => {
      const studentTests = tests.filter((x) =>
        x.data.find((y) => y.id === student.id)
      );
      return {
        studentId: student.id,
        studentName: student.name,
        tests: studentTests.map((test) => {
          const testStudent = test.data.find((x) => x.id === student.id);

          return {
            assessmentId: test.assessmentId,
            assessmentName: test.assessmentName,
            type: testStudent.type,
          };
        }),
      };
    });
  }, [tests]);

  return (
    <>
      <div style={{
        overflowX: isPdf ? "visible" : "scroll",
        display: "flex",
        fontSize: isPdf ? "5px" : "inherit",
        width: isPdf ? "auto" : "auto"
      }}>
        <div
          style={{
            border: "1px solid #D4D4D4",
            borderBottom: "none",
            marginRight: isPdf ? "0.3rem" : "1rem",
            minWidth: isPdf ? "auto" : "max-content",
            width: isPdf ? "150px" : "auto"
          }}
        >
          <div
            style={{
              padding: isPdf ? "2px" : "10px",
              textAlign: "center",
              borderBottom: "1px solid #D4D4D4",
              fontWeight: 500,
              fontSize: isPdf ? "5px" : "inherit",
              minHeight: isPdf ? "18px" : "auto",
              height: isPdf ? "18px" : "auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {LEVELS[level]}
          </div>

          {data?.map((data, index) => (
            <div
            key={data.studentId}
              style={{
                display: "flex",
                alignItems: "center",
                padding: isPdf ? "2px" : "5px",
                borderBottom: "1px solid #D4D4D4",
                whiteSpace: isPdf ? "nowrap" : "nowrap",
                wordBreak: isPdf ? "normal" : "normal",
                fontSize: isPdf ? "5px" : "inherit",
                lineHeight: isPdf ? "1.2" : "normal",
                minHeight: isPdf ? "14px" : "auto",
                height: isPdf ? "14px" : "auto",
                overflow: isPdf ? "hidden" : "visible",
                textOverflow: isPdf ? "ellipsis" : "clip"
              }}
            >
              {data.studentName}
            </div>
          ))}
        </div>

        <div
          style={{
            overflowX: isPdf ? "visible" : "scroll",
            display: "flex",
            flex: 1,
            border: "1px solid #D4D4D4",
            borderBottom: "none",
          }}
        >
          {items.map((item, index) => (
            <div key={item.id} style={{
              flex: 1,
              minWidth: isPdf ? "40px" : "200px",
              display:'flex',
              flexDirection: 'column'
            }}>
              <div
                style={{
                  padding: isPdf ? "2px 1px" : "10px",
                  textAlign: "center",
                  borderBottom: "1px solid #D4D4D4",
                  justifyContent: "center",
                  fontWeight: 500,
                  overflow: 'hidden',
                  whiteSpace: isPdf ? 'normal' : 'nowrap',
                  textOverflow: 'ellipsis',
                  fontSize: isPdf ? "4.5px" : "inherit",
                  wordBreak: isPdf ? "break-word" : "normal",
                  lineHeight: isPdf ? "1.2" : "normal",
                  minHeight: isPdf ? "18px" : "auto",
                  height: isPdf ? "auto" : "auto",
                  display: "flex",
                  alignItems: "center"
                }}
              title={item.name}
              >
                {item.name}
              </div>

              {data?.map((data) => {
                const studentTest = data.tests.find(
                  (x) => x.assessmentId === item.id
                );
                const nivel = studentTest?.type ?? 'nao_informado';
                const nivelText = PerfHistoryNiveisReading[nivel];
                return (
                  <div
                  key={data.studentId}
                    style={{
                      display: "flex",
                      padding: isPdf ? "2px 1px" : "5px",
                      borderBottom: "1px solid #D4D4D4",
                      borderRight:
                        index === items.length - 1
                          ? "none"
                          : "1px solid #D4D4D4",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: PerfHistoryNiveisReadingColor[nivel],
                      color: "white",
                      fontWeight: 500,
                      fontSize: isPdf ? "4.5px" : "inherit",
                      whiteSpace: isPdf ? "normal" : "nowrap",
                      wordBreak: isPdf ? "break-word" : "normal",
                      textAlign: "center",
                      lineHeight: isPdf ? "1.2" : "normal",
                      minHeight: isPdf ? "14px" : "auto",
                      height: isPdf ? "14px" : "auto"
                    }}
                  >
                    {nivelText}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
