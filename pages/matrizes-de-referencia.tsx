import { parseCookies } from "nookies";
import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import TableReferencia from "src/components/referencia/tableReferencia";
import Layout from "src/components/layout";
import type { ReactElement } from "react";
import { withSSRAuth } from "src/utils/withSSRAuth";

export default function MatrizesReferencia({ userInfo, url }) {
  return (
    <PageContainer>
      <Top title={"Matriz de Referência"} />
      <TableReferencia />
    </PageContainer>
  );
}

MatrizesReferencia.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={"Matriz de Referência"}>{page}</Layout>;
};

export const getServerSideProps = withSSRAuth(
  async function getServerSideProps(context) {
    let cookies = parseCookies(context);
    cookies = {
      ...cookies,
      USU_AVATAR: `${process.env.NEXT_PUBLIC_API_URL}/users/avatar/${cookies["USU_AVATAR"]}`,
    };

    return {
      props: {
        userInfo: cookies,
        url: process.env.NEXT_PUBLIC_API_URL,
      },
    };
  },
  {
    roles: ["AVA", "MAT_REF"],
  }
);
