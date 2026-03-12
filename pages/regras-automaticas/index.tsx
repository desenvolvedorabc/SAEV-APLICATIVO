import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import Layout from "src/components/layout";
import type { ReactElement } from "react";
import { withSSRAuth } from "src/utils/withSSRAuth";
import FormCreateRegrasAutomaticas from "src/components/mensagem-tutores/formCreateRegrasAutomaticas";

export default function NovaRegraAutomatica() {

  return (
    <PageContainer>
      <Top title={"Regra Automática > Nova Regra"} />
      <FormCreateRegrasAutomaticas />
    </PageContainer>
  );
}

NovaRegraAutomatica.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={"Nova Regra Automática"}>{page}</Layout>;
};

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    return {
      props: {},
    };
  },
  {
    roles: ["MEN"],
  }
);
