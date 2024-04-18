import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import { useState, useEffect } from 'react';
import CardInfoMunicipioRelatorio from "src/components/municipio/cardInfoMunicipioRelatorio";
import { getTeacher } from "src/services/professores.service";
import { useGetCountyReport } from "src/services/municipios.service";
import CardInfoProfessorRelatorio from "src/components/professor/cardInfoProfessorRelatorio";
import Layout from "src/components/layout";
import type { ReactElement } from 'react'


export default function ProfessorDetalhe({ id, profId, url }) {
  const [professor, setProfessor] = useState()
  
  useEffect(() => {
    loadInfos()
  }, []);

  const { data: municipio, isLoading: loading } = useGetCountyReport(id, url);

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
      <Top link={`/municipio/${id}/professores`}  title={`Municípios > ${municipio?.MUN_NOME} > Professores > Perfil`} />
      <CardInfoMunicipioRelatorio municipio={municipio} />
      <CardInfoProfessorRelatorio professor={professor} />
    </PageContainer>
  );
}

ProfessorDetalhe.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout header={"Detalhes Professor"}>{page}</Layout>
  )
}

export async function getServerSideProps(context) {
  const { id, profId } = context.params
  return {
    props: {
      id,
      profId,
      url: process.env.NEXT_PUBLIC_API_URL
    }
  }
}