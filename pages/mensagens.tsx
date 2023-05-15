import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import {useState, useEffect} from 'react';
import TableMensagens from "src/components/mensagem/tableMensagens";
import Layout from "src/components/layout";
import type { ReactElement } from 'react'
import { withSSRAuth } from "src/utils/withSSRAuth";

export default function Mensagens() {
  

  return (
    <PageContainer>
      <Top title={"Mensagens"}/>
      <TableMensagens/>
    </PageContainer>
  );
}

Mensagens.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout  header={"Mensagens"}>{page}</Layout>
  )
}

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    return {
      props: {},
    };
  },
  {
    roles: ["Outros", "MEN"],
  }
);