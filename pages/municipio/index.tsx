import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import Layout from "src/components/layout";
import type { ReactElement } from 'react'
import FormEditMunicipio from "src/components/municipio/formEditMunicipio";
import { withSSRAuth } from "src/utils/withSSRAuth";


export default function AdicionarMunicipio() {

  return (
    <PageContainer>
      <Top title={"Municípios > Adicionar"}/>
      <FormEditMunicipio municipio={null}/>

    </PageContainer>
  );
}

AdicionarMunicipio.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout header={"Adicionar Municípios"}>{page}</Layout>
  )
}

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    return {
      props: { },
    };
  },
  {
    roles: [],
  }
);