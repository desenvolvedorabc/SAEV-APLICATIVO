import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { getUser } from "src/services/usuarios.service";
import CardInfoUsuarioRelatorio from "src/components/usuario/cardInfoUsuarioRelatorio";
import Layout from "src/components/layout";
import type { ReactElement } from "react";

const Termo = styled.div`
  background-color: #fff;
  padding: 25px;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  margin-top: 25px;
`;
export default function UsuarioDetalhe({ id, url }) {
  const [usuario, setUsuario] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    loadInfos();
  }, []);

  const loadInfos = async () => {
    setIsLoading(true);
    try {
      const resp = await getUser(id);
      resp.data = {
        ...resp.data,
        USU_AVATAR_URL: `${url}/users/avatar/${resp.data.USU_AVATAR}`,
      };
      setUsuario(resp.data);
    } catch (e) {
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer>
      <Top link={"/usuarios"} title={`Usuários > Perfil`} />
      {isLoading ? (
        <div className="d-flex align-items-center flex-column mt-5">
          <div className="spinner-border" role="status"></div>
        </div>
      ) : (
        <CardInfoUsuarioRelatorio usuario={usuario} />
      )}
    </PageContainer>
  );
}

UsuarioDetalhe.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={"Usuários"}>{page}</Layout>;
};

export async function getServerSideProps(context) {
  const { id } = context.params;
  return {
    props: {
      id,
      url: process.env.NEXT_PUBLIC_API_URL,
    },
  };
}
