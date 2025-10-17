import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import Layout from "src/components/layout";
import type { ReactElement } from "react";
import { withSSRAuth } from "src/utils/withSSRAuth";
import FormEditRegionalUnica from "src/components/regionaisUnicas/FormEditRegionalUnica";
import { useGetRegional } from "src/services/regionais-estaduais.service";

export default function EditarRegionalUnica({id}) {
  const { data, isLoading } = useGetRegional(id);

  return (
    <PageContainer>
      <Top title={"Regional Única > Editar"} />
      {!isLoading &&
        <FormEditRegionalUnica regional={data?.regional} />
      }
    </PageContainer>
  );
}

EditarRegionalUnica.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={"Editar Regional Única"}>{page}</Layout>;
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
    roles: ['REG_UNI'],
  }
);
