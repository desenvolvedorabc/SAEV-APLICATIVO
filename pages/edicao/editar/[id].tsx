import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import {useState, useEffect} from 'react';
import FormEditAvaliacao from "src/components/avaliacao/formEditAvaliacao";
import { getAssessment } from "src/services/avaliaoces.service";
import Layout from "src/components/layout";
import type { ReactElement } from 'react'


export default function EditarEdicao({id, url}) {
  const [avaliacao, setAvaliacao] = useState(null)
  useEffect(() => {
    loadInfos()
  },[]);

  const loadInfos = async () => {
    const resp = await getAssessment(id)
    resp.data = {
      ...resp.data,
      USU_AVATAR_URL: `${url}/users/avatar/${resp.data.USU_AVATAR}`
    }
    setAvaliacao(resp.data)
  }

  return (
    <PageContainer>
      <Top link={`/edicoes`} title={`Edições > Editar Edição`}/>
      {avaliacao &&
        <FormEditAvaliacao avaliacao={avaliacao}/>
      }
    </PageContainer>
  );
}

EditarEdicao.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout header={"Editar Edição"}>{page}</Layout>
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