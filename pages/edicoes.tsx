import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import {useState, useEffect} from 'react';
import TableAvaliacao from "src/components/avaliacao/tableAvaliacao";

import Layout from "src/components/layout";
import type { ReactElement } from 'react'
import { withSSRAuth } from "src/utils/withSSRAuth";


export default function Edicoes() {

  return (
    <PageContainer>
      <Top title={"Edições"}/>
      <TableAvaliacao/>
    </PageContainer>
  );
}

Edicoes.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout header={"Edições"}>{page}</Layout>
  )
}

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    return {
      props: {},
    };
  },
  {
    roles: ["AVA", "EDI"],
  }
);