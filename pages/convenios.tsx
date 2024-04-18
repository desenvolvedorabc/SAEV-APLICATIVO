import PageTitle from "src/components/pageTitle";
import PageContainer from "src/components/pageContainer";

import Layout from "src/components/layout";
import type { ReactElement } from 'react'

export default function Convenios() {

  return (
    <PageContainer>
      <PageTitle>Convênios</PageTitle>
    </PageContainer>
  );
}


Convenios.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout header={"Convênios"}>{page}</Layout>
  )
}