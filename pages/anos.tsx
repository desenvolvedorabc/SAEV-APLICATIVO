import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import {useState, useEffect} from 'react';
import TableAnos from "src/components/ano/tableAnos";
import Layout from "src/components/layout";
import type { ReactElement } from 'react'
import { withSSRAuth } from "src/utils/withSSRAuth";

export default function Anos() {
  

  return (
    <PageContainer>
      <Top title={"Anos Letivos"}/>
      <TableAnos/>
    </PageContainer>
  );
}

Anos.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout  header={"Anos Letivos"}>{page}</Layout>
  )
}

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    return {
      props: {},
    };
  },
  {
    roles: ["JOR_PED", "ANO_LET"],
  }
);