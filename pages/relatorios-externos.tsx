import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import Layout from "src/components/layout";
import type { ReactElement } from 'react'
import { withSSRAuth } from "src/utils/withSSRAuth";
import { TableExternalReport } from "src/components/externalReport/TableExternalReport";


export default function RelatoriosExternos() {

  return (
    <PageContainer>
      <Top title={"Relatórios Externos"}/>
      <TableExternalReport />
    </PageContainer>
  );
}


RelatoriosExternos.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout header={"Relatórios Externos"}>{page}</Layout>
  )
}

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    return {
      props: {},
    };
  },
  {
    roles: ["REL_EXT"],
  }
);