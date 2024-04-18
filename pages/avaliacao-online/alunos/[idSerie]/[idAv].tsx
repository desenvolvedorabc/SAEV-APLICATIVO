import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import Layout from "src/components/layout";
import { withSSRAuth } from "src/utils/withSSRAuth";
import TableAvaliacaoOnlineStudents from "src/components/avaliacaoOnline/TableAvaliacaoOnlineStudents";
import type { ReactElement } from "react";

export default function AvaliacoesOnline({id, idSerie}) {

  return (
    <PageContainer>
      <Top title={"Avaliações Online > Selecionar Aluno"} />
      <TableAvaliacaoOnlineStudents idAva={id} idSerie={idSerie} />
    </PageContainer>
  );
}

AvaliacoesOnline.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={"Avaliações Online"}>{page}</Layout>;
};

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    const {idSerie, idAv} = ctx.params

    return {
      props: {id: idAv, idSerie},
    };
  },
  {
    // roles: ["AVA_ON"],
    roles: [],
  }
);
