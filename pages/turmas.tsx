import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import TableTurmas from "src/components/turma/tableTurmas";
import Layout from "src/components/layout";
import type { ReactElement } from 'react'
import { withSSRAuth } from "src/utils/withSSRAuth";

export default function Turmas() {
  return (
    <PageContainer>
      <Top title={"Turmas"}/>
      <TableTurmas/>
    </PageContainer>
  );
}

Turmas.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout header={"Turmas"}>{page}</Layout>
  )
}

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    return {
      props: {},
    };
  },
  {
    roles: ["JOR_PED", "TUR"],
  }
);