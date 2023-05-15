import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import { useEffect } from "react";
import FormAddTeste from "src/components/teste/formAddTeste";
import Layout from "src/components/layout";
import type { ReactElement } from "react";
import { withSSRAuth } from "src/utils/withSSRAuth";

export default function AdicionarTeste() {
  useEffect(() => {
    loadInfos();
  }, []);

  const loadInfos = async () => {};

  return (
    <PageContainer>
      <Top link={"/testes"} title={"Testes > Adicionar Teste"} />
      <FormAddTeste />
    </PageContainer>
  );
}

AdicionarTeste.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={"Adicionar Teste"}>{page}</Layout>;
};

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    return {
      props: {},
    };
  },
  {
    roles: ["AVA", "TES"],
  }
);
