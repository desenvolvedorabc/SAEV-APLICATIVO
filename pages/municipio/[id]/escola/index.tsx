import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import FormAddEscola from "src/components/escola/formAddEscola";
import { useGetCounty } from "src/services/municipios.service";
import Layout from "src/components/layout";
import type { ReactElement } from 'react'


export default function AdicionarEscola({id}) {
  const { data: city } = useGetCounty(id);
  return (
    <PageContainer>
      <Top link={`/municipio/${id}/escolas`}  title={`Municípios > ${city?.MUN_NOME} > Escola > Adicionar`}/>
      <FormAddEscola munId={id}/>
    </PageContainer>
  );
}

AdicionarEscola.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout header={"Adicionar Escola"}>{page}</Layout>
  )
}

export async function getServerSideProps(context){
  const {id} = context.params

  return {
    props: {
      id,
    }
  }
}