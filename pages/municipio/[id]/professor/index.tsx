import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import FormAddProfessor from "src/components/professor/formAddProfessor";
import { useGetCounty } from "src/services/municipios.service";
import Layout from "src/components/layout";
import type { ReactElement } from "react";

export default function AdicionarProfessor({ id }) {
  const { data: city, isLoading: loading } = useGetCounty(id);

  return (
    <PageContainer>
      <Top
        link={`/municipio/${id}/professores`}
        title={`Municípios > ${city?.MUN_NOME} > Professor > Adicionar`}
      />
      <FormAddProfessor munId={id} />
    </PageContainer>
  );
}

AdicionarProfessor.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={"Adicionar Professor"}>{page}</Layout>;
};

export async function getServerSideProps(context) {
  const { id } = context.params;

  return {
    props: {
      id,
    },
  };
}
