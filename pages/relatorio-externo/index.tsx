import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import {useState, useEffect} from 'react';
import { getSchoolClass } from "src/services/turmas.service";
import Layout from "src/components/layout";
import type { ReactElement } from 'react'
import FormEditExternalReport from "src/components/externalReport/FormEditExternalReport";
import { withSSRAuth } from "src/utils/withSSRAuth";


export default function CriarRelatorioExterno({}) {

  return (
    <PageContainer>
      <Top title={`Relatórios Externos > Adicionar Link`}/>
      <FormEditExternalReport report={null}/>
    </PageContainer>
  );
}

CriarRelatorioExterno.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout header={"Relatórios Externos"}>{page}</Layout>
  )
}


export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    return {
      props: {},
    };
  },
  {
    roles: ["REL_EXT"],
  }
);