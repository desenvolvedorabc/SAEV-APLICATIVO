import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import {useState, useEffect} from 'react';
import Layout from "src/components/layout";
import type { ReactElement } from 'react'
import FormEditOnlineTest from "src/components/avaliacaoOnline/FormEditOnlineTest";
import { getAssessmentOnline } from "src/services/avaliacao-online";
import { withSSRAuth } from "src/utils/withSSRAuth";


export default function EditarAvaliacaoOnline({id, idTest}) {
  const [onlineTest, setOnlineTest] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    loadInfos()
  },[]);

  const loadInfos = async () => {
    if(id !== 'cadastro'){
      const resp = await getAssessmentOnline(id)
      if(resp?.assessmentOnline)
        setOnlineTest(resp?.assessmentOnline)
    }
    setLoading(false)
  }

  return (
    <PageContainer>
      <Top title={`Testes > Editar Teste > Avaliação Online`}/>
      {!loading &&
        <FormEditOnlineTest idTest={idTest} onlineTest={onlineTest}/>
      }
    </PageContainer>
  );
}

EditarAvaliacaoOnline.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout header={"Avaliação Online"}>{page}</Layout>
  )
}


export const getServerSideProps = withSSRAuth(
  async (ctx) => {
  const {id, idTest} = ctx.params
  return {
      props: {
        id,
        idTest
      },
    };
  },
  {
    // roles: ["AVA_ON"],
    roles: [],
  }
);