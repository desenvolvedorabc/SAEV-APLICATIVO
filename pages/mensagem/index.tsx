import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import { useState, useEffect } from "react";
import FormCreateMessage from "src/components/mensagem/formCreateMessage";
import Layout from "src/components/layout";
import type { ReactElement } from "react";
import { withSSRAuth } from "src/utils/withSSRAuth";

export default function NovaMensagem() {
  return (
    <PageContainer>
      <Top link={"/mensagens"} title={"Mensagens > Nova"} />
      <FormCreateMessage />
    </PageContainer>
  );
}

NovaMensagem.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={"Nova Mensagem"}>{page}</Layout>;
};

// export const getServerSideProps = withSSRAuth(
//   async (ctx) => {
//     return {
//       props: {},
//     };
//   },
//   {
//     roles: ["MEN"],
//   }
// );
