import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import {useState, useEffect} from 'react';
import TableSubjects from "src/components/disciplina/tableSubjects";
import Layout from "src/components/layout";
import type { ReactElement } from 'react'
import { withSSRAuth } from "src/utils/withSSRAuth";

export default function Disciplinas() {

  return (
    <PageContainer>
      <Top title={"Disciplinas"}/>
      <TableSubjects/>
    </PageContainer>
  );
}

Disciplinas.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout  header={"Disciplinas"}>{page}</Layout>
  )
}


export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    return {
      props: {},
    };
  },
  {
    roles: ["JOR_PED", "DISC"],
  }
);