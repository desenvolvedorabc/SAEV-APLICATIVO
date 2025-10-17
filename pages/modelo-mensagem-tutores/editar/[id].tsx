import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import Layout from "src/components/layout";
import { useEffect, useState } from "react";
import type { ReactElement } from "react";
import { withSSRAuth } from "src/utils/withSSRAuth";
import FormCreateModeloMessageTutores from "src/components/mensagem-tutores/formCreateModeloMessageTutores";
import { getMessageTemplate } from "src/services/mensagens-tutores.service";
import { Loading } from "src/components/Loading";

export default function EditarModeloMensagemTutores({ id }) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);


  useEffect(() => {
    const getData = async () => {
      const response = await getMessageTemplate(id);
      setData(response?.data?.messageTemplate);
      setIsLoading(false);
    };

    getData();
  }, [id]);
  
  return (
    <PageContainer>
      <Top title={"Mensagens aos Tutores > Editar Modelo"} />
      {isLoading ? 
        <Loading />
        :
        <FormCreateModeloMessageTutores template={data} />
      }
    </PageContainer>
  );
}

EditarModeloMensagemTutores.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={"Editar Modelo Mensagem aos Tutores"}>{page}</Layout>;
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
    roles: ["MEN"],
  }
);
