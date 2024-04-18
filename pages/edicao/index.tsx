import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import {useState, useEffect} from 'react';
import FormEditAvaliacao from "src/components/avaliacao/formEditAvaliacao";
import Layout from "src/components/layout";
import type { ReactElement } from 'react'
import { withSSRAuth } from "src/utils/withSSRAuth";


export default function AdicionarEdicao() {

  return (
    <PageContainer>
      <Top link={'/edicoes'} title={"Edição > Adicionar Edição"}/>
      <FormEditAvaliacao avaliacao />
    </PageContainer>
  );
}

AdicionarEdicao.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout header={"Nova Edição"}>{page}</Layout>
  )
}


export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    return {
      props: {},
    };
  },
  {
    roles: ['AVA', "EDI"],
  }
);