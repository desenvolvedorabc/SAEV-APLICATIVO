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

type TableProps = {
  items: PerformanceHistoryItem[];
  selectedSubject: ItemSubject;
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
  items,
  selectedSubject,
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
    let students = tests[0]?.students;

    return students.map((student) => {
      const studentTests = tests.filter((x) =>
        x.students.find((y) => y.id === student.id)
      );
      return {
        studentId: student.id,
        studentName: student.name,
        tests: studentTests.map((test) => {
          const testStudent = test.students.find((x) => x.id === student.id);

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
      <div style={{ overflowX: "scroll", display: "flex" }}>
        <div
          style={{
            border: "1px solid #D4D4D4",
            borderBottom: "none",
            marginRight: "1rem",
            minWidth: "max-content",
          }}
        >
          <div
            style={{
              padding: "10px",
              textAlign: "center",
              borderBottom: "1px solid #D4D4D4",
              fontWeight: 500,
            }}
          >
            Alunos
          </div>

          {data?.map((data) => (
            <div
            key={data.studentId}
              style={{
                display: "flex",
                padding: "5px",
                borderBottom: "1px solid #D4D4D4",
              }}
            >
              {data.studentName}
            </div>
          ))}
        </div>

        <div
          style={{
            overflowX: "scroll",
            display: "flex",
            flex: 1,
            border: "1px solid #D4D4D4",
            borderBottom: "none",
          }}
        >
          {items.map((item, index) => (
            <div key={item.id} style={{ flex: 1, minWidth: "200px", display:'flex', flexDirection: 'column' }}>
              <div
                style={{
                  padding: "10px",
                  textAlign: "center",
                  borderBottom: "1px solid #D4D4D4",
                  justifyContent: "center",
                  fontWeight: 500,
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis'
                }
                
              } 
              title={item.name} 
              >
                {item.name}
              </div>

              {data?.map((data) => {
                const studentTest = data.tests.find(
                  (x) => x.assessmentId === item.id
                );
                return (
                  <div
                  key={data.studentId}
                    style={{
                      display: "flex",
                      padding: "5px",
                      borderBottom: "1px solid #D4D4D4",
                      borderRight:
                        index === items.length - 1
                          ? "none"
                          : "1px solid #D4D4D4",
                      justifyContent: "center",
                      backgroundColor: PerfHistoryNiveisReadingColor[studentTest?.type ?? 'nao_informado'],
                      color: "white",
                      fontWeight: 500,
                    }}
                  >
                    {PerfHistoryNiveisReading[studentTest?.type ?? 'nao_informado']}
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
