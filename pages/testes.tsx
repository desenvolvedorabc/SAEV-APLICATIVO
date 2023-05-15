import { parseCookies } from "nookies";
import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import {useState, useEffect} from 'react';
import TableTeste from "src/components/teste/tableTeste";
import Layout from "src/components/layout";
import type { ReactElement } from 'react'
import { withSSRAuth } from "src/utils/withSSRAuth";

export default function Testes() {
  
  

  return (
    <PageContainer>
      <Top title={"Testes"}/>
      <TableTeste/>
    </PageContainer>
  );
}

Testes.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout header={"Testes"}>{page}</Layout>
  )
}

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    return {
      props: {},
    };
  },
  {
    roles: ["AVA", "TES"],
  }
);