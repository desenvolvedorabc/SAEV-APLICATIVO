import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import {useState, useEffect} from 'react';
import TableSeries from "src/components/serie/tableSeries";
import Layout from "src/components/layout";
import type { ReactElement } from 'react'
import { withSSRAuth } from "src/utils/withSSRAuth";

export default function Series() {

  return (
    <PageContainer>
      <Top title={"Séries"}/>
      <TableSeries/>
    </PageContainer>
  );
}

Series.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout  header={"Séries"}>{page}</Layout>
  )
}

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    return {
      props: {},
    };
  },
  {
    roles: ["JOR_PED", "SER"],
  }
);