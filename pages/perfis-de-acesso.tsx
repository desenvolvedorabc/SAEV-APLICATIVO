import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import {useState, useEffect} from 'react';
import TablePerfil from "src/components/perfil/tablePerfil";
import Layout from "src/components/layout";
import type { ReactElement } from 'react'
import { withSSRAuth } from "src/utils/withSSRAuth";

export default function PerfisAcesso() {

  return (
    <PageContainer>
      <Top title={"Perfis de Acesso"}/>
      <TablePerfil/>
    </PageContainer>
  );
}

PerfisAcesso.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout header={"Perfis de Acesso"}>{page}</Layout>
  )
}

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    return {
      props: {},
    };
  },
  {
    roles: [],
  }
);