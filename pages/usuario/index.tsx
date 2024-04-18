import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import { useEffect } from "react";
import FormAddUsuario from "src/components/usuario/formAddUsuario";
import Layout from "src/components/layout";
import type { ReactElement } from "react";
import { withSSRAuth } from "src/utils/withSSRAuth";

export default function AdicionarUsuario() {
  useEffect(() => {
    loadInfos();
  }, []);

  const loadInfos = async () => {};

  return (
    <PageContainer>
      <Top link={"/usuarios"} title={"Usuários > Adicionar"} />
      <FormAddUsuario />
    </PageContainer>
  );
}

AdicionarUsuario.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={"Adicionar Usuário"}>{page}</Layout>;
};

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    return {
      props: {},
    };
  },
  {
    roles: ["USU"],
  }
);
