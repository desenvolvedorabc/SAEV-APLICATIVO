import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import Layout from "src/components/layout";
import type { ReactElement } from "react";
import { withSSRAuth } from "src/utils/withSSRAuth";
import FormEditRegionalUnica from "src/components/regionaisUnicas/FormEditRegionalUnica";

export default function AdicionarRegionalUnica() {

  return (
    <PageContainer>
      <Top title={"Regional Única > Adicionar"} />
      <FormEditRegionalUnica regional={null} />
    </PageContainer>
  );
}

AdicionarRegionalUnica.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={"Adicionar Regional Única"}>{page}</Layout>;
};

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    return {
      props: {},
    };
  },
  {
    roles: ['REG_UNI'],
  }
);
