import { parseCookies } from "nookies";
import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import {useState, useEffect} from 'react';
import FormAddMunicipio from "src/components/municipio/formAddMunicipio";
import Layout from "src/components/layout";
import type { ReactElement } from 'react'


export default function AdicionarMunicipio() {

  return (
    <PageContainer>
      <Top link={'/municipios'} title={"Municípios > Adicionar"}/>
      <FormAddMunicipio/>
    </PageContainer>
  );
}

AdicionarMunicipio.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout header={"Adicionar Municípios"}>{page}</Layout>
  )
}