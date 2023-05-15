import PageContainer from "src/components/pageContainer";
import TableMunicipios from "src/components/municipio/tableMunicipios";
import Top from "src/components/top";
import Layout from "src/components/layout";
import type { ReactElement } from 'react'
import { withSSRAuth } from "src/utils/withSSRAuth";

export default function Municipios() {
  return (
    <PageContainer>
      <Top title={"Municípios"}/>
      <TableMunicipios/>
    </PageContainer>
  );
}

Municipios.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout header={"Municípios"}>{page}</Layout>
  )
}

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    return {
      props: {},
    };
  },
  {
    profiles: ['SAEV'],
    roles: ["MUN"],
  }
);