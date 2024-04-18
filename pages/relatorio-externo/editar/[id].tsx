import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import {useState, useEffect} from 'react';
import { getSchoolClass } from "src/services/turmas.service";
import Layout from "src/components/layout";
import type { ReactElement } from 'react'
import FormEditExternalReport from "src/components/externalReport/FormEditExternalReport";
import { withSSRAuth } from "src/utils/withSSRAuth";
import { getExternalReport } from "src/services/relatorio-externo";


export default function EditarRelatorioExterno({id}) {
  const [report, setReport] = useState(null)
  useEffect(() => {
    loadInfos()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  const loadInfos = async () => {

    const resp = await getExternalReport(id)
    setReport(resp?.data?.externalReport)
  }

  return (
    <PageContainer>
      <Top title={`Relatórios Externos > Editar Link`}/>
      {report &&
        <FormEditExternalReport report={report}/>
      }
    </PageContainer>
  );
}

EditarRelatorioExterno.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout header={"Relatórios Externos"}>{page}</Layout>
  )
}

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    const {id} = ctx.params

    return {
      props: {
        id
      },
    };
  },
  {
    roles: ["REL_EXT"],
  }
);