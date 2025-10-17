import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import Layout from "src/components/layout";
import type { ReactElement } from "react";
import { withSSRAuth } from "src/utils/withSSRAuth";
import FormEditRegionalMunicipal from "src/components/regionaisMunicipais/FormEditRegionalMunicipal";

export default function AdicionarRegionalMunicipal() {

  return (
    <PageContainer>
      <Top title={"Regional Municipal > Adicionar"} />
      <FormEditRegionalMunicipal regional={null} />
    </PageContainer>
  );
}

AdicionarRegionalMunicipal.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={"Adicionar Regional Municipal"}>{page}</Layout>;
};

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    return {
      props: {},
    };
  },
  {
    roles: ['REG_MUN'],
  }
);
