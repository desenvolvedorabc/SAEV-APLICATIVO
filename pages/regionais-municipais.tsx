import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import Layout from "src/components/layout";
import type { ReactElement } from 'react'
import { withSSRAuth } from "src/utils/withSSRAuth";
import TableRegionaisMunicipais from "src/components/regionaisMunicipais/tableRegionaisMunicipais";

export default function RegionaisMunicipais() {
  return (
    <PageContainer>
      <Top title={"Regionais Municipais"}/>
      <TableRegionaisMunicipais/>
    </PageContainer>
  );
}

RegionaisMunicipais.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout header={"Regionais Municipais"}>{page}</Layout>
  )
}

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    return {
      props: {},
    };
  },
  {
    roles: ['REG_MUN'],
  }
);