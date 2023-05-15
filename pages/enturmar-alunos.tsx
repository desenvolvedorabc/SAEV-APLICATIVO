import PageContainer from "src/components/pageContainer";
import {TableEnturmar} from "src/components/enturmar/tableEnturmar";
import {FilterEnturmar} from "src/components/enturmar/filterEnturmar";
import Top from "src/components/top";
import {useState} from 'react';
import Layout from "src/components/layout";
import type { ReactElement } from 'react'
import { withSSRAuth } from "src/utils/withSSRAuth";


export default function Enturmar() {
  const [mun, setMun] = useState(null)
  const [school, setSchool] = useState(null)
  const [status, setStatus] = useState(null)

  return (
    <PageContainer>
      <Top title={"Enturmar Alunos"}/>
      <FilterEnturmar changeMun={setMun} changeSchool={setSchool} changeStatus={setStatus} />
      <TableEnturmar mun={mun} school={school} status={status} />
    </PageContainer>
  );
}


Enturmar.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout header={"Enturmar Alunos"}>{page}</Layout>
  )
}

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    return {
      props: {},
    };
  },
  {
    roles: ["ENT_ALU"],
  }
);