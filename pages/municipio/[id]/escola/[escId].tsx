import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import {useState} from 'react';
import RelatoriosEscolas from "src/components/escola/relatoriosEscolas";
import { useGetSchool, useGetSchoolReport } from "src/services/escolas.service";
import { useGetCounty, useGetCountyReport } from "src/services/municipios.service";
import CardInfoEscolaRelatorio from "src/components/escola/cardInfoEscolaRelatorio";
import Layout from "src/components/layout";
import type { ReactElement } from 'react'
import LoadingScreen from "src/components/loadingPage";


export default function EscolaDetalhe({id, escId, url}) {
  const { data: city, isLoading: loadingCounty } = useGetCountyReport(id, url);
  const { data: escola, isLoading: loadingSchool } = useGetSchoolReport(escId, url);

  return (
    <>
      {!loadingCounty && !loadingSchool ? (
        <PageContainer>
          <Top link={`/municipio/${id}/escolas`}  title={`Municípios > ${city?.MUN_NOME} > Escolas > ${escola?.ESC_NOME}`}/>
          <CardInfoEscolaRelatorio escola={escola} municipio={city} />
          <RelatoriosEscolas escola={escola} munId={id}/>
        </PageContainer>
      ) : (
        <LoadingScreen />
      )}
    </>
  );
}

EscolaDetalhe.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout header={"Detalhes Escola"}>{page}</Layout>
  )
}

export async function getServerSideProps(context){
  const {id, escId} = context.params
  return {
    props: {
      id,
      escId,
      url: process.env.NEXT_PUBLIC_API_URL
    }
  }
}