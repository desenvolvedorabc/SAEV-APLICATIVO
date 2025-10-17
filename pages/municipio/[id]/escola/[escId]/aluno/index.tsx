import { parseCookies } from "nookies";
import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import {useState, useEffect} from 'react';
import Layout from "src/components/layout";
import type { ReactElement } from 'react'
import { FormAddStudent } from "src/components/aluno/formAddAluno";
import { withSSRAuth } from "src/utils/withSSRAuth";


export default function AdicionarUsuario({munId}) {
 
  return (
    <PageContainer>
      <Top title={"Alunos > Adicionar"}/>
      <FormAddStudent munId={munId} />
    </PageContainer>
  );
}

AdicionarUsuario.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout header={"Adicionar Aluno"}>{page}</Layout>
  )
}

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    const { id } = ctx.params;
    return {
      props: {
        munId: id,
        url: process.env.NEXT_PUBLIC_API_URL,
      },
    };
  },
  {
    roles: [],
  }
);