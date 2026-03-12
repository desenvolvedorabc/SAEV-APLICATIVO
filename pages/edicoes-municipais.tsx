import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import Layout from "src/components/layout";
import type { ReactElement } from "react";
import { withSSRAuth } from "src/utils/withSSRAuth";
import { TableAssessmentCounty } from "src/components/avaliacao/TableAssessmentCounty";

export default function AssessmentsCounty() {
  return (
    <PageContainer>
      <Top title={"Edições Municipais"} />
      <TableAssessmentCounty />
    </PageContainer>
  );
}

AssessmentsCounty.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={"Edições Municipais"}>{page}</Layout>;
};

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    return {
      props: {},
    };
  },
  {
    roles: ["EDI_MUN"],
  }
);
