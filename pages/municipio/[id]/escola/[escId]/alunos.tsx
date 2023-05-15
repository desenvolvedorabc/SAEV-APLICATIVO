import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import { useState, useEffect } from "react";
import { TableAlunos } from "src/components/aluno/tableAlunos";
import Layout from "src/components/layout";
import type { ReactElement } from "react";
import { withSSRAuth } from "src/utils/withSSRAuth";

export default function Alunos({id, escId}) {
  return (
    <PageContainer>
      <Top title={"Alunos"} />
      <TableAlunos idMun={id} idEsc={escId} />
    </PageContainer>
  );
}

Alunos.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={"Alunos"}>{page}</Layout>;
};

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    const {id, escId} = ctx.params
    return {
      props: {
        id,
        escId,
      },
    };
  },
  {
    roles: ["ALU"],
  }
);
