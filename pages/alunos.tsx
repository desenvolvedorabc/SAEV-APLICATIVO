import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import { useState, useEffect } from "react";
import { TableAlunos } from "src/components/aluno/tableAlunos";
import Layout from "src/components/layout";
import type { ReactElement } from "react";
import { withSSRAuth } from "src/utils/withSSRAuth";
import { useRouter } from "next/router";

export default function Alunos() {
  const {query} = useRouter();

  return (
    <PageContainer>
      <Top title={"Alunos"} />
      <TableAlunos idMun={query?.id} idEsc={query?.escId} />
    </PageContainer>
  );
}

Alunos.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={"Alunos"}>{page}</Layout>;
};

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    return {
      props: {},
    };
  },
  {
    roles: ["ALU"],
  }
);
