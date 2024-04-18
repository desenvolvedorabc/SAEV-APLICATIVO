import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import { useEffect } from "react";
import FormEditTurma from "src/components/turma/formEditTurma";
import Layout from "src/components/layout";
import type { ReactElement } from "react";
import { withSSRAuth } from "src/utils/withSSRAuth";

export default function AdicionarTurma() {
  useEffect(() => {
    loadInfos();
  }, []);

  const loadInfos = async () => {};

  return (
    <PageContainer>
      <Top link={"/turmas"} title={"Turma > Adicionar"} />
      <FormEditTurma turma={null} />
    </PageContainer>
  );
}

AdicionarTurma.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={"Nova Turma"}>{page}</Layout>;
};

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    return {
      props: {},
    };
  },
  {
    roles: ["JOR_PED", "TUR"],
  }
);
