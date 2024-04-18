import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import Layout from "src/components/layout";
import type { ReactElement } from 'react'
import { withSSRAuth } from "src/utils/withSSRAuth";
import { TableTesteAvailable } from "src/components/testeAvailable/tableTesteAvailable";

export default function TestesDisponíveis({ id, escId, url}) {
  
  return (
    <PageContainer>
      <Top title={"Testes Disponíveis"}/>
      <TableTesteAvailable id={id} escId={escId} url={url}/>
    </PageContainer>
  );
}

TestesDisponíveis.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout header={"Testes Disponíveis"}>{page}</Layout>
  )
}

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    let { id, escId} = ctx.params
    
    if(escId === 'null')
      escId = null

    return {
      props: {
        id,
        escId,
        url: process.env.NEXT_PUBLIC_API_URL
      }
    }
  },
  {
    roles: [],
    // roles: ["Avaliações", "Testes"],
  }
);