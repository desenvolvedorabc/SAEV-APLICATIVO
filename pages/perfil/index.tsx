import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import FormAddPerfil from "src/components/perfil/formAddPerfil";
import Layout from "src/components/layout";
import type { ReactElement } from 'react'


export default function AdicionarPerfil() {

  return (
    <PageContainer>
      <Top link={'/perfis-de-acesso'}  title={"Perfis de Acesso > Novo Perfil"}/>
      <FormAddPerfil/>
    </PageContainer>
  );
}

AdicionarPerfil.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout header={"Novo Perfil de Acesso"}>{page}</Layout>
  )
}