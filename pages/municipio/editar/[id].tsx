import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import {useState, useEffect} from 'react';
import FormEditMunicipio from "src/components/municipio/formEditMunicipio";
import { getCounty } from "src/services/municipios.service";
import Layout from "src/components/layout";
import type { ReactElement } from 'react'


export default function EditarMunicipio({id, url}) {
  const [municipio, setMunicipio] = useState(null)
  useEffect(() => {
    loadInfos()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  const loadInfos = async () => {

    const resp = await getCounty(id)
    resp.data = {
      ...resp.data,
      MUN_LOGO_URL:`${url}/counties/avatar/${resp.data.MUN_LOGO}`
    }

    setMunicipio(resp.data)
  }

  return (
    <PageContainer>
      <Top link={`/municipio/${municipio?.MUN_ID}`}  title={`Municípios > ${municipio?.MUN_NOME} > Editar`}/>
      {municipio &&
        <FormEditMunicipio municipio={municipio}/>
      }
    </PageContainer>
  );
}

EditarMunicipio.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout header={"Editar Municípios"}>{page}</Layout>
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