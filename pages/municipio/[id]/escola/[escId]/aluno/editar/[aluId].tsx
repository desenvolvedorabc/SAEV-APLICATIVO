import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import {useState, useEffect} from 'react';
import { getStudent } from "src/services/alunos.service";
import Layout from "src/components/layout";
import type { ReactElement } from 'react'
import { FormEditStudent } from "src/components/aluno/formEditAluno";


export default function EditarAluno({aluId, url}) {
  const [aluno, setAluno] = useState(null)
  useEffect(() => {
    loadInfos()
  },[]);

  const loadInfos = async () => {

    const resp = await getStudent(aluId)
    resp.data = {
      ...resp,
      ALU_AVATAR_URL: `${url}/student/avatar/${resp.ALU_AVATAR}`
    }
    setAluno(resp.data)
  }

  return (
    <PageContainer>
      <Top title={`Alunos > Editar`}/>
      {aluno &&
        <FormEditStudent student={aluno}/>
      }
    </PageContainer>
  );
}

EditarAluno.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout header={"Editar Aluno"}>{page}</Layout>
  )
}

export async function getServerSideProps(context){
  const {aluId} = context.params
  return {
    props: {
      aluId,
      url: process.env.NEXT_PUBLIC_API_URL
    }
  }
}