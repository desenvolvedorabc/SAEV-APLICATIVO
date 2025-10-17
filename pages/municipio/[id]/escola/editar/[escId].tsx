import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import FormEditEscola from "src/components/escola/formEditEscola";
import { useGetSchool } from "src/services/escolas.service";
import { useGetCounty } from "src/services/municipios.service";
import Layout from "src/components/layout";
import type { ReactElement } from 'react'
import LoadingScreen from "src/components/loadingPage";
import { withSSRAuth } from "src/utils/withSSRAuth";


export default function EditarEscola({id, escId, url}) {

  const { data: escola, isLoading: loadingSchool } = useGetSchool(escId, url);
  const { data: county, isLoading: loadingCounty } = useGetCounty(id, url);

  return (
    <>
      {!loadingCounty && !loadingSchool ? (
        <PageContainer>
          <Top link={`/municipio/${id}/escola/${escola?.ESC_ID}`}  title={`Municípios > ${county?.MUN_NOME} > Escolas > ${escola?.ESC_NOME} > Editar`}/>
          {escola &&
            <FormEditEscola escola={escola} county={county}/>
          }
        </PageContainer>
        )
        :
        (
          <LoadingScreen />
        )
      }
    </>
  );
}

EditarEscola.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout header={"Editar Escola"}>{page}</Layout>
  )
}

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    const { id, escId } = ctx.params;
    return {
      props: {
        id,
        escId,
        url: process.env.NEXT_PUBLIC_API_URL
      },
    };
  },
  {
    roles: [],
  }
);