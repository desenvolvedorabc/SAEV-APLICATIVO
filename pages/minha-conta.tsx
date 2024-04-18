import { parseCookies, setCookie } from "nookies";
import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { getUser } from "src/services/usuarios.service";
import CardInfoMinhaConta from "src/components/cardInfoMinhaConta";
import { destroyCookies } from "src/utils/auth";
import Router from "next/router";
import Layout from "src/components/layout";
import type { ReactElement } from "react";
import { withSSRAuth } from "src/utils/withSSRAuth";

const Termo = styled.div`
  background-color: #fff;
  padding: 25px;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  margin-top: 25px;
`
export default function MinhaConta({ userInfo, url }) {
  const [usuario, setUsuario] = useState(null)
  let cookies = parseCookies()


  useEffect(() => {
    loadInfos();
  }, []);


  const loadInfos = async () => {
    const id = cookies["USU_ID"];

    let resp = await getUser(id)
    if (resp.data.error?.status === 401) {
      if (userInfo.USU_RETRY === "0") {
        setCookie(null, "USU_RETRY", "1", {
          path: "/",
        });
        Router.reload();
      }
    }

    if (resp.data.error?.status === 401) {
      if (userInfo.USU_RETRY === "1" || !userInfo.__session) {
        destroyCookies();
        Router.push("/login");
      }
    }
    resp.data = {
      ...resp.data,
      USU_AVATAR_URL: `${url}/users/avatar/${resp.data.USU_AVATAR}`,
    };
    setUsuario(resp.data);
  };

  return (
    <PageContainer>
      <Top title={`Minha Conta`} />
      {usuario && <CardInfoMinhaConta usuario={usuario} />}
    </PageContainer>
  );
}

MinhaConta.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={"Minha Conta"}>{page}</Layout>;
};

export const getServerSideProps = withSSRAuth(
  async function getServerSideProps(context) {
    let cookies = parseCookies(context)
    if (JSON.stringify(cookies).length > 2) {
      cookies = {
        ...cookies,
        USU_AVATAR: `${process.env.NEXT_PUBLIC_API_URL}/users/avatar/${cookies["USU_AVATAR"]}`
      }
    }

    return {
      props: {
        userInfo: cookies,
        url: process.env.NEXT_PUBLIC_API_URL
      }
    }
  },
  {
    roles: [],
  }
);
