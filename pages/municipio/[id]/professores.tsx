import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import TableProfessores from "src/components/professor/tableProfessores";
import { useGetCounty, useGetCountyReport } from "src/services/municipios.service";
import CardInfoMunicipioRelatorio from "src/components/municipio/cardInfoMunicipioRelatorio";
import Layout from "src/components/layout";
import type { ReactElement } from 'react'

export default function Professores({id, url}) {
  const { data: municipio, isLoading: loading } = useGetCountyReport(id, url);

  return (
    <PageContainer>
      <Top link={`/municipio/${id}`} title={"Professores"}/>
      <CardInfoMunicipioRelatorio municipio={municipio} />
      <TableProfessores munId={id}/>
    </PageContainer>
  );
}

Professores.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout header={"Professores"}>{page}</Layout>
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