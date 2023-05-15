import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import {useState, useEffect} from 'react';
import FormEditPerfil from "src/components/perfil/formEditPerfil";
import { getSubPerfil } from "src/services/sub-perfis.service";
import Layout from "src/components/layout";
import type { ReactElement } from 'react'


export default function EditarPerfil({id}) {
  const [subPerfil, setSubPerfil] = useState(null)
  useEffect(() => {
    loadInfos()
  },[]);

  const loadInfos = async () => {

    const resp = await getSubPerfil(id)
    resp.data = {
      ...resp.data,
    }
    setSubPerfil(resp.data)
  }

  return (
    <PageContainer>
      <Top link={`/perfis-de-acesso/`}  title={`Usuário > Editar Perfil`}/>
      {subPerfil &&
        <FormEditPerfil subPerfil={subPerfil}/>
      }
    </PageContainer>
  );
}

EditarPerfil.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout header={"Editar Perfil"}>{page}</Layout>
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