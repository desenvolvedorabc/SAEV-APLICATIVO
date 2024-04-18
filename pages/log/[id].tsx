import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import { useEffect, useState } from "react";
import LogDetails from "src/components/logs/logDetails";
import Layout from "src/components/layout";
import type { ReactElement } from "react";
import { withSSRAuth } from "src/utils/withSSRAuth";
import { getLog } from "src/services/logs.service";

export default function DetalhesLog({id}) {
  const [log, setLog] = useState(null)

  const loadLog = async () => {
    const resp = await getLog(id);
    setLog(resp?.data);
  }

  useEffect(() => {
    loadLog()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  return (
    <PageContainer>
      <Top link={"/logs"} title={"Logs do Sistema > Detalhes"} />
      {log &&
        <LogDetails log={log} />
      }
    </PageContainer>
  );
}

DetalhesLog.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={"Detalhes Log"}>{page}</Layout>;
};

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    const { id } = ctx.params;
    return {
      props: {id},
    };
  },
  {
    roles: [],
  }
);
