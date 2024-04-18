import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import {useState, useEffect} from 'react';
import FormEditTeste from "src/components/teste/formEditTeste";
import { getTest } from "src/services/testes.service";
import Layout from "src/components/layout";
import type { ReactElement } from 'react'


export default function EditarTeste({id, url}) {
  const [teste, setTeste] = useState(null)
  useEffect(() => {
    loadInfos()
  },[]);

  const loadInfos = async () => {

    const resp = await getTest(id)

    resp.data = {
      ...resp.data,
      USU_AVATAR_URL: `${url}/users/avatar/${resp.data.USU_AVATAR}`,
      TES_ARQUIVO_URL: `${url}/tests/file/${resp.data.TES_ARQUIVO}`,
      TES_MANUAL_URL: `${url}/tests/manual/${resp.data.TES_MANUAL}`,
    }

    setTeste(resp.data)
  }

  return (
    <PageContainer>
      <Top link={`/testes`}  title={`Teste > Editar Teste`}/>
      {teste &&
        <FormEditTeste teste={teste}/>
      }
    </PageContainer>
  );
}

EditarTeste.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout header={"Editar Teste"}>{page}</Layout>
  )
}

export async function getServerSideProps(context){
  const {id} = context.params
  return {
    props: {
      id,
      url: process.env.NEXT_PUBLIC_API_URL
    }
  }
}