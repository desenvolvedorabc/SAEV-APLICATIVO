import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import { useGetCounty } from "src/services/municipios.service";
import Layout from "src/components/layout";
import type { ReactElement } from 'react'
import FormEditEscola from "src/components/escola/formEditEscola";
import { withSSRAuth } from "src/utils/withSSRAuth";


export default function AdicionarEscola({id}) {
  const { data: county, isLoading } = useGetCounty(id);
  return (
      <PageContainer>
        <Top link={`/municipio/${id}/escolas`}  title={`Municípios > ${county?.MUN_NOME} > Escola > Adicionar`}/>
        <FormEditEscola escola={null} county={county}/>
      </PageContainer>
  );
}

AdicionarEscola.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout header={"Adicionar Escola"}>{page}</Layout>
  )
}

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    const { id } = ctx.params;
    return {
      props: {
        id,
      },
    };
  },
  {
    roles: [],
  }
);