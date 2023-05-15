import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import RelatoriosMunicipios from "src/components/municipio/relatoriosMunicipios";
import styled from "styled-components";
import { useGetCountyReport } from "src/services/municipios.service";
import CardInfoMunicipioRelatorio from "src/components/municipio/cardInfoMunicipioRelatorio";
import Layout from "src/components/layout";
import type { ReactElement } from "react";
import { format } from "date-fns";
import LoadingScreen from "src/components/loadingPage";
import { withSSRAuth } from "src/utils/withSSRAuth";

const Termo = styled.div`
  background-color: #fff;
  padding: 25px;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  margin-top: 25px;
  font-size: 14px;
`;
export default function MunicipiosDetalhe({ id, url }) {
  const { data: municipio, isLoading: loading } = useGetCountyReport(id, url);

  return (
    <>
      {!loading ? (
        <PageContainer>
          <Top
            link={"/municipios"}
            title={`Municípios > ${municipio?.MUN_NOME}`}
          />
          <CardInfoMunicipioRelatorio municipio={municipio} />
          <RelatoriosMunicipios municipio={municipio} />
          <Termo>
            <div>
              Termo de Colaboração entre{" "}
              {format(
                new Date(
                  municipio?.MUN_DT_INICIO
                    ? new Date(municipio?.MUN_DT_INICIO)
                    : new Date()
                ),
                "yyyy"
              )}{" "}
              e{" "}
              {format(
                new Date(
                  municipio?.MUN_DT_FIM
                    ? new Date(municipio?.MUN_DT_FIM)
                    : new Date()
                ),
                "yyyy"
              )}
              .
            </div>
            {municipio?.MUN_ARQ_CONVENIO ? (
              <a
                href={`${url}/counties/file/${municipio?.MUN_ARQ_CONVENIO}`}
                target="_blank"
                rel="noreferrer"
              >
                Baixar PDF do Termo
              </a>
            ) : (
              <div>Baixar PDF do Termo</div>
            )}
          </Termo>
        </PageContainer>
      ) : (
        <LoadingScreen />
      )}
    </>
  );
}

MunicipiosDetalhe.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={"Municípios"}>{page}</Layout>;
};

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    const { id } = ctx.params;
    return {
      props: {
        id,
        url: process.env.NEXT_PUBLIC_API_URL,
      },
    };
  },
  {
    profiles: ["SAEV", "Município"],
    roles: [],
  }
);
