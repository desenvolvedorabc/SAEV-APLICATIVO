import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import { useState, useEffect } from "react";
import { getStudent } from "src/services/alunos.service";
import { CardInfoAlunoTransfer } from "src/components/transfers/cardInfoAlunoTransfer";
import Layout from "src/components/layout";
import type { ReactElement } from "react";
import { withSSRAuth } from "src/utils/withSSRAuth";

export default function AlunoDetalhe({ id, url }) {
  const [aluno, setAluno] = useState(null);

  useEffect(() => {
    loadInfos();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadInfos = async () => {    
    let resp = await getStudent(id);
    setAluno(resp);
  };

  return (
    <PageContainer>
      <Top
        title={`Transferências > Nova Transferência > Perfil`}
      />
      {aluno && 
        <CardInfoAlunoTransfer aluno={aluno} url={url} />
      }
    </PageContainer>
  );
}

AlunoDetalhe.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={"Nova Transferência"}>{page}</Layout>;
};

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    const {id} = ctx.params
    return {
      props: { 
        id,
        url: process.env.NEXT_PUBLIC_API_URL
      },
    };
  },
  {
    roles: [],
  }
);
