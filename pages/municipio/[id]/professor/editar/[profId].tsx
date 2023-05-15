import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import { useState, useEffect } from 'react';
import FormEditProfessor from "src/components/professor/formEditProfessor";
import { getTeacher } from "src/services/professores.service";
import { getCounty, useGetCounty } from "src/services/municipios.service";
import Layout from "src/components/layout";
import type { ReactElement } from 'react'


export default function EditarProfessor({ id, profId, url })  {
  const [professor, setProfessor] = useState()
  useEffect(() => {
    loadInfos()
  }, []);

  const { data: municipio, isLoading: loading } = useGetCounty(id);


  const loadInfos = async () => {
    if (profId) {
      const resp = await getTeacher(profId, id)
      resp.data = {
        ...resp.data,
        PRO_AVATAR_URL: `${url}/teachers/avatar/${resp.data.PRO_AVATAR}`,
      }
      setProfessor(resp.data)
    }
  }

  return (
    <PageContainer>
      <Top link={`/municipio/${id}/professor/${profId}`}  title={`Municípios > ${municipio?.MUN_NOME} > Professores > Editar`} />
      {( professor && municipio ) && 
        <FormEditProfessor professor={professor} municipio={municipio} />
      }
    </PageContainer>
  );
}

EditarProfessor.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout header={"Editar Professor"}>{page}</Layout>
  )
}

export async function getServerSideProps(context) {
  const { profId, id } = context.params
  return {
    props: {
      id,
      profId,
      url: process.env.NEXT_PUBLIC_API_URL
    }
  }
}