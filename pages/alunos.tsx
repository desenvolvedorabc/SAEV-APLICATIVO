import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import { useState, useEffect } from "react";
import { TableAlunos } from "src/components/aluno/tableAlunos";
import Layout from "src/components/layout";
import type { ReactElement } from "react";
import { withSSRAuth } from "src/utils/withSSRAuth";

export default function Alunos() {
  return (
    <PageContainer>
      <Top title={"Alunos"} />
      <TableAlunos idMun={null} idEsc={null} />
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
