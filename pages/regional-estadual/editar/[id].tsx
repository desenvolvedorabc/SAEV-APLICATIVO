import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import Layout from "src/components/layout";
import type { ReactElement } from "react";
import { withSSRAuth } from "src/utils/withSSRAuth";
import FormEditRegionalEstadual from "src/components/regionaisEstaduais/FormEditRegionalEstadual";
import { useGetRegional } from "src/services/regionais-estaduais.service";

export default function EditarRegionalEstadual({id}) {
  const { data, isLoading } = useGetRegional(id);
  console.log('regional :', data);

  return (
    <PageContainer>
      <Top title={"Regional Estadual > Editar"} />
      {!isLoading &&
        <FormEditRegionalEstadual regional={data?.regional} />
      }
    </PageContainer>
  );
}

EditarRegionalEstadual.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={"Editar Regional Estadual"}>{page}</Layout>;
};

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    const { id } = ctx.params;

    return {
      props: {
        id,
      },
    };
  },
  {
    roles: ['REG_EST'],
  }
);
