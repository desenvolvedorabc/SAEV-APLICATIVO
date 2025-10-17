import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import Layout from "src/components/layout";
import type { ReactElement } from 'react'
import { withSSRAuth } from "src/utils/withSSRAuth";
import TableRegionaisUnicas from "src/components/regionaisUnicas/tableRegionaisUnicas";

export default function RegionaisUnicas() {
  return (
    <PageContainer>
      <Top title={"Regional Única"}/>
      <TableRegionaisUnicas/>
    </PageContainer>
  );
}

RegionaisUnicas.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout header={"Regional Única"}>{page}</Layout>
  )
}

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    return {
      props: {},
    };
  },
  {
    roles: ['REG_UNI'],
  }
);