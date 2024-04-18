import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import TableEscolas from "src/components/escola/tableEscolas";
import { useGetCountyReport } from "src/services/municipios.service";
import CardInfoMunicipioRelatorio from "src/components/municipio/cardInfoMunicipioRelatorio";
import Layout from "src/components/layout";
import type {ReactElement} from 'react'
import { useEffect, useState } from 'react'
import LoadingScreen from "src/components/loadingPage";
import { useAuth } from "src/context/AuthContext";
import { withSSRAuth } from "src/utils/withSSRAuth";


export default function Escolas({id, url}) {
  const [munId, setMunId] = useState(id !== 'null' ? id : null)
  const { data: municipio, isLoading: loading } = useGetCountyReport(munId, url); 
  const { user } = useAuth()

  useEffect(() => {
    if(user?.USU_SPE?.SPE_PER?.PER_NOME === "Município" || user?.USU_SPE?.SPE_PER?.PER_NOME === "Escola"){
      setMunId(user?.USU_MUN?.MUN_ID)
    }
  },[user]) 
 
  return (
    <>
      {!loading ? (
        <PageContainer>
          <Top link={`/municipio/${munId}`} title={"Escolas"}/>
          {munId &&
            <CardInfoMunicipioRelatorio municipio={municipio} />
          }
          <TableEscolas munId={munId}/>
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

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    const {id} = ctx.params
    return {
      props: {
        id,
        url: process.env.NEXT_PUBLIC_API_URL
      },
    };
  },
  {
    roles: ["ESC"],
  }
);