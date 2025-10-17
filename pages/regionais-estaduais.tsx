import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import Layout from "src/components/layout";
import type { ReactElement } from 'react'
import { withSSRAuth } from "src/utils/withSSRAuth";
import TableRegionaisEstaduais from "src/components/regionaisEstaduais/tableRegionaisEstaduais";

export default function RegionaisEstaduais() {
  return (
    <PageContainer>
      <Top title={"Regionais Estaduais"}/>
      <TableRegionaisEstaduais/>
    </PageContainer>
  );
}

RegionaisEstaduais.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout header={"Regionais Estaduais"}>{page}</Layout>
  )
}

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    return {
      props: {},
    };
  },
  {
    roles: ['REG_EST'],
  }
);