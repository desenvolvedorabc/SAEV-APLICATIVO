import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import Layout from "src/components/layout";
import type { ReactElement } from "react";
import { withSSRAuth } from "src/utils/withSSRAuth";
import FormEditRegionalMunicipal from "src/components/regionaisMunicipais/FormEditRegionalMunicipal";
import { useGetRegional } from "src/services/regionais-estaduais.service";

export default function EditarRegionalMunicipal({id}) {
  const { data, isLoading } = useGetRegional(id);

  return (
    <PageContainer>
      <Top title={"Regional Municipal > Editar"} />
      {!isLoading &&
        <FormEditRegionalMunicipal regional={data?.regional} />
      }
    </PageContainer>
  );
}

EditarRegionalMunicipal.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={"Editar Regional Municipal"}>{page}</Layout>;
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
    roles: ['REG_MUN'],
  }
);
