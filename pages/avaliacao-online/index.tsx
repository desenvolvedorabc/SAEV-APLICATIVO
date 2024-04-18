import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import Layout from "src/components/layout";
import type { ReactElement } from "react";
import { withSSRAuth } from "src/utils/withSSRAuth";
import TableAvaliacaoOnline from "src/components/avaliacaoOnline/TableAvaliacaoOnline";

export default function AvaliacoesOnline() {
  return (
    <PageContainer>
      <Top title={"Avaliações Online"} />
      <TableAvaliacaoOnline  />
    </PageContainer>
  );
}

AvaliacoesOnline.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={"Avaliações Online"}>{page}</Layout>;
};

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    return {
      props: {},
    };
  },
  {
    // roles: ["AVA_ON"],
    roles: [],
  }
);
