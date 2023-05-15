import { parseCookies } from "nookies";
import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import {useState, useEffect} from 'react';
import FormEditMatriz from "src/components/referencia/formEditMatriz";
import { getReference } from "src/services/referencias.service";
import Layout from "src/components/layout";
import type { ReactElement } from 'react'


export default function EditarMatriz({id, url}) {
  const [matriz, setMatriz] = useState(null)
  useEffect(() => {
    loadInfos()
  },[]);

  const loadInfos = async () => {

    const resp = await getReference(id)
    resp.data = {
      ...resp.data,
      USU_AVATAR_URL: `${url}/users/avatar/${resp.data.USU_AVATAR}`
    }
    setMatriz(resp.data)
  }

  return (
    <PageContainer>
      <Top link={`/matrizes-de-referencia`} title={`Matriz de Referência > Editar Matriz`}/>
      {matriz &&
        <FormEditMatriz matriz={matriz}/>
      }
    </PageContainer>
  );
}

EditarMatriz.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout header={"Editar Matriz de Referência"}>{page}</Layout>
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