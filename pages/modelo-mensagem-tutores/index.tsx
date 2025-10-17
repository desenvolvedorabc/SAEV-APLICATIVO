import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import Layout from "src/components/layout";
import type { ReactElement } from "react";
import { withSSRAuth } from "src/utils/withSSRAuth";
import FormCreateModeloMessageTutores from "src/components/mensagem-tutores/formCreateModeloMessageTutores";

export default function NovoModeloMensagemTutores() {

  return (
    <PageContainer>
      <Top title={"Mensagens aos Tutores > Novo Modelo"} />
      <FormCreateModeloMessageTutores />
    </PageContainer>
  );
}

NovoModeloMensagemTutores.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={"Novo Modelo Mensagem aos Tutores"}>{page}</Layout>;
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
