import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import {useState, useEffect} from 'react';
import FormEditTurma from "src/components/turma/formEditTurma";
import { getSchoolClass } from "src/services/turmas.service";
import Layout from "src/components/layout";
import type { ReactElement } from 'react'


export default function EditarTurma({id}) {
  const [turma, setTurma] = useState(null)
  useEffect(() => {
    loadInfos()
  },[]);

  const loadInfos = async () => {

    const resp = await getSchoolClass(id)
    setTurma(resp.data)
  }

  return (
    <PageContainer>
      <Top link={`/turmas`}  title={`Turmas > Editar`}/>
      {turma &&
        <FormEditTurma turma={turma}/>
      }
    </PageContainer>
  );
}

EditarTurma.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout header={"Editar Turma"}>{page}</Layout>
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