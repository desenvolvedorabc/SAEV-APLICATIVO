import { parseCookies } from "nookies";
import TopHome from "../src/components/homeComponents/topHome";
import SessionTimeout from "../src/components/timeOut/sessionTimeout";
import Router from "next/router";
import { useEffect, useState } from "react";
import PageContainer from "src/components/pageContainer";
import Graph from "src/components/homeComponents/graph";
import { destroyCookies } from "src/utils/auth";
import Layout from "src/components/layout";
import type { ReactElement } from "react";
import { useGetSerieReport } from "src/services/series.service";
import { withSSRAuth } from "src/utils/withSSRAuth";
import { Loading } from "src/components/Loading";
import { useAuth } from "src/context/AuthContext";

export default function Home({ userInfo }) {
  const [isAuthenticated, setAuth] = useState(true);
  const { user } = useAuth()

  useEffect(() => {
    if(user){
      if(user?.USU_SPE?.role === "ESCOLA") {
        Router.push(`/municipio/${user?.USU_MUN.MUN_ID}/escola/${user?.USU_ESC.ESC_ID}`)
      } else if(user?.USU_SPE?.role === "MUNICIPIO_ESTADUAL"){
        Router.push(`/municipio/${user?.USU_MUN.MUN_ID}`)
      } else if(user?.USU_SPE?.role === "MUNICIPIO_MUNICIPAL"){
        Router.push(`/municipio/${user?.USU_MUN.MUN_ID}`)
      } else if(user?.USU_SPE?.role === "ESTADO"){
        Router.push(`/municipios`)
      }
    }
  },[user])

  const handleClick = () => {
    setAuth(!isAuthenticated);
    destroyCookies();
    Router.push("/login");
  };

  const [listSubjects, setListSubjects] = useState([]);
  const [serieId] = useState("18");

  const {data: report, isLoading} = useGetSerieReport(serieId)

  useEffect(() => {
    let _listSubjects = [];
    report?.assessments?.items?.map((x) => {
      x.subjects?.map((subject) => {
        if (!_listSubjects.find(x => x.id === subject.id))
          _listSubjects.push(subject);
      });
    });

    setListSubjects(_listSubjects);
  }, [report]);


  return (
    <>
      <SessionTimeout logOut={handleClick} />
      <PageContainer>
        <TopHome title={"Home"} searchOpen={true} />
        <>
          {isLoading ? (
            <Loading />
          ) : (
            <Graph
              listEdicoes={report?.assessments?.items}
              subjects={listSubjects}
            />
          )}
        </>
      </PageContainer>
    </>
  );
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={"Home"}>{page}</Layout>;
};

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    let cookies = parseCookies(ctx);

    cookies = {
      ...cookies,
      USU_AVATAR: `${process.env.NEXT_PUBLIC_API_URL}/users/avatar/${cookies["USU_AVATAR"]}`,
    };

    return {
      props: {
        userInfo: cookies,
      },
    };
  },
  {
    profiles: ["SAEV"],
    roles: [],
  }
);
