import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import Layout from "src/components/layout";
import type { ReactElement } from "react";
import { withSSRAuth } from "src/utils/withSSRAuth";
import { Export } from "src/components/exportar/Export";
import { TableExport } from "src/components/exportar/TableExport";

export default function ExportarDados({ url }) {
  return (
    <PageContainer>
      <Top title={"Exportar Microdados"} />
      <Export />
      <TableExport url={url}/>
    </PageContainer>
  );
}

ExportarDados.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={"Exportar Microdados"}>{page}</Layout>;
};

export const getServerSideProps = withSSRAuth(
  async function getServerSideProps(context) {

    return {
      props: {
        url: process.env.NEXT_PUBLIC_API_URL,
      },
    };
  },
  {
    roles: ["EXP_DAD"],
  }
);
