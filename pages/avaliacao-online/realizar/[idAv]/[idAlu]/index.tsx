import Top from "src/components/top";
import {useState, useEffect} from 'react';
import { getAssessmentOnline } from "src/services/avaliacao-online";
import { withSSRAuth } from "src/utils/withSSRAuth";
import { Header } from "src/components/header";
import PerformAvaliation from "src/components/avaliacaoOnline/PerformAvaliation";


export default function RealizarAvaliacaoOnline({idAv, idAlu, url}) {
  const [onlineTest, setOnlineTest] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    loadInfos()
  },[]);

  const loadInfos = async () => {
    const resp = await getAssessmentOnline(idAv)
    if(resp?.assessmentOnline)
      setOnlineTest(resp?.assessmentOnline)
  
    setLoading(false)
  }

  return (
    <>
      <Header title={"Realizar Avaliação Online"} />
      <div style={{width: '100%', minHeight: '100vh', backgroundColor: 'var(--semi-dark, #30615A)'}}>
        {onlineTest &&
        <>
        <PerformAvaliation testId={onlineTest?.test?.TES_ID} idAlu={idAlu} questionPages={onlineTest?.pages} url={url} />
        </>
          // <FormEditOnlineTest idTest={idTest} onlineTest={onlineTest}/>
        }
      </div>
    </>
  );
}


export const getServerSideProps = withSSRAuth(
  async (ctx) => {
  const {idAv, idAlu} = ctx.params
  return {
      props: {
        idAv,
        idAlu,
        url: process.env.NEXT_PUBLIC_API_URL
      },
    };
  },
  {
    // roles: ["AVA_ON"],
    roles: [],
  }
);