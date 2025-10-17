import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import Layout from "src/components/layout";
import type { ReactElement } from "react";
import { withSSRAuth } from "src/utils/withSSRAuth";
import FormEditRegionalEstadual from "src/components/regionaisEstaduais/FormEditRegionalEstadual";

export default function AdicionarRegionalEstadual() {

  return (
    <PageContainer>
      <Top title={"Regional Estadual > Adicionar"} />
      <FormEditRegionalEstadual regional={null} />
    </PageContainer>
  );
}

AdicionarRegionalEstadual.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={"Adicionar Regional Estadual"}>{page}</Layout>;
};

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    return {
      props: {},
    };
  },
  {
    roles: ['REG_EST'],
  }
);
