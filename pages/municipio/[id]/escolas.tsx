import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import TableEscolas from "src/components/escola/tableEscolas";
import { useGetCountyReport } from "src/services/municipios.service";
import CardInfoMunicipioRelatorio from "src/components/municipio/cardInfoMunicipioRelatorio";
import Layout from "src/components/layout";
import type { ReactElement } from 'react'
import LoadingScreen from "src/components/loadingPage";


export default function Escolas({id, url}) {
  const { data: municipio, isLoading: loading } = useGetCountyReport(id, url);  

  return (
    <>
      {!loading ? (
        <PageContainer>
          <Top link={`/municipio/${id}`} title={"Escolas"}/>
          <CardInfoMunicipioRelatorio municipio={municipio} />
          <TableEscolas munId={id}/>
        </PageContainer>
      ) : (
        <LoadingScreen />
      )}
    </>
  );
}

Escolas.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout header={"Escolas"}>{page}</Layout>
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