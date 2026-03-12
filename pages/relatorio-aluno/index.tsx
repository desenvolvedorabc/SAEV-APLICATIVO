import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import { Header } from "src/components/header";
import PageTitle from "src/components/pageTitle";
import { getReportStudent, ReportStudentData } from "src/services/report-student";
import { useRouter } from 'next/router'
import ReportStudent from "src/components/reportStudent";
import { ContentOptionsExams } from "src/components/reportStudent/contentOptionsExams";
import { TableNotesReading } from "src/components/reportStudent/TableNotesReading";
import { useGenearePdf } from "src/utils/generatePdf";

export default function RelatorioAluno({ url }) {
  const router = useRouter();
  const { assessmentId, studentId, token } = router.query;
  const [info, setInfo] = useState<ReportStudentData[] | null>(null);
  const [examId, setExamId] = useState(null);
  const [selectedDiscipline, setSelectedDiscipline] = useState(null);

  const { handlePrint, componentRef } = useGenearePdf();
  

  const loadInfo = async () => {
    const resp = await getReportStudent({assessmentId, studentId, token});
    if(resp?.data?.items){
      setInfo(resp?.data?.items)
    }
  }

  useEffect(() => {
    loadInfo();
  }, []);

  const selectExamId = (id) => {
    setExamId(id);

    const item = info.find((item) => item.id === id);
    setSelectedDiscipline(item);
  };
  

  return (
    <>
      <Header title={"Relatório Aluno"} />
      <div style={{ margin: 50 }}>
        <PageTitle dataTest={"relatorioAluno"}>Relatório Aluno</PageTitle>
        <ContentOptionsExams examId={examId} selectExamId={selectExamId} items={info} handlePrint={handlePrint} />
        {selectedDiscipline?.type === "Objetiva" ? 
          <ReportStudent info={selectedDiscipline} />
          :
          <TableNotesReading selectedItem={selectedDiscipline} />
        }
      </div>

      <GeneratePdfPage
        componentRef={componentRef}
        examId={examId}
        info={info}
        selectedDiscipline={selectedDiscipline}
      />
    </>
  );
}

function GeneratePdfPage({
  componentRef,
  examId,
  info,
  selectedDiscipline,
}) {

  return (
    <div className="pdf">
      <div ref={componentRef} className="print-container">
        <Header title={"Relatório Aluno"} />
        <div style={{ margin: 50 }}>
          <PageTitle dataTest={"relatorioAluno"}>Relatório Aluno</PageTitle>
          <ContentOptionsExams examId={examId} selectExamId={() => {}} items={info} handlePrint={() => {}} />
          {selectedDiscipline?.type === "Objetiva" ? 
            <ReportStudent info={selectedDiscipline} />
            :
            <TableNotesReading selectedItem={selectedDiscipline} />
          }
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {
      url: process.env.NEXT_PUBLIC_API_URL,
    },
  };  
};