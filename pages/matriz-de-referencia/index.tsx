import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import FormAddMatriz from "src/components/referencia/formAddMatriz";
import Layout from "src/components/layout";
import type { ReactElement } from "react";
import { withSSRAuth } from "src/utils/withSSRAuth";

export default function AdicionarMatriz() {
  return (
    <PageContainer>
      <Top
        link={"/matrizes-de-referencia"}
        title={"Matriz de Referência > Adicionar Matriz"}
      />
      <FormAddMatriz />
    </PageContainer>
  );
}

AdicionarMatriz.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={"Nova Matriz de Referência"}>{page}</Layout>;
};

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    return {
      props: {},
    };
  },
  {
    roles: ["MAT_REF"],
  }
);
