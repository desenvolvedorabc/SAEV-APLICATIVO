import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import { useState, useEffect } from "react";
import { getStudentReports } from "src/services/alunos.service";
import { CardInfoAlunoRelatorio } from "src/components/aluno/cardInfoAlunoRelatorio";
import { TableStudentEditions } from "src/components/aluno/tableStudentEditions";
import Layout from "src/components/layout";
import type { ReactElement } from "react";

export default function AlunoDetalhe({ aluId, url }) {
  const [aluno, setAluno] = useState(null);
  const [history, setHistory] = useState(null);

  useEffect(() => {
    loadInfos();
  }, []);

  const loadInfos = async () => {    
    let resp = await getStudentReports(aluId);
    resp = {
      ...resp,
      ALU_AVATAR_URL: `${url}/student/avatar/${resp.ALU_AVATAR}`
    }
    setAluno(resp);

  };

  return (
    <PageContainer>
      <Top
        title={`Alunos > Perfil`}
      />
      {aluno && 
        <>
          <CardInfoAlunoRelatorio aluno={aluno} />
          <TableStudentEditions aluno={aluno} />
        </>
      }
    </PageContainer>
  );
}

AlunoDetalhe.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={"Detalhes Aluno"}>{page}</Layout>;
};

export async function getServerSideProps(context) {
  const { aluId } = context.params;
  return {
    props: {
      aluId,
      url: process.env.NEXT_PUBLIC_API_URL,
    },
  };
}
