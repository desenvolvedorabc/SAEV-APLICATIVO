import PageContainer from "src/components/pageContainer";
import { useState, useEffect } from "react";
import Layout from "src/components/layout";
import type { ReactElement } from "react";
import { useBreadcrumbContext } from "src/context/breadcrumb.context";
import Top from "src/components/top";
import { TableInfrequencia } from "src/components/infrequencia/TableInfrequencia";
import { ContentInfrequenciaFilter } from "src/components/infrequencia/contentReleasesFilter";
import { withSSRAuth } from "src/utils/withSSRAuth";

export default function Infrequencia() {
  const [county, setCounty] = useState(null);
  const [school, setSchool] = useState(null);
  const [serie, setSerie] = useState(null);
  const [schoolClass, setSchoolClass] = useState(null);
  const [year, setYear] = useState(null);
  const [mes, setMes] = useState(null);

  const { resetBreadcrumbs, handleUnClickBar } = useBreadcrumbContext();

  useEffect(() => {
    resetBreadcrumbs();
    handleUnClickBar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <PageContainer>
        <Top title="Infrequência" />
        <ContentInfrequenciaFilter
          changeCounty={setCounty}
          changeSchool={setSchool}
          changeSerie={setSerie}
          changeSchoolClass={setSchoolClass}
          changeYear={setYear}
          changeMes={setMes}
        />

        {!!mes && (
          <TableInfrequencia
            county={county}
            school={school}
            serie={serie}
            schoolClass={schoolClass}
            year={year}
            month={mes}
          />
        )}
      </PageContainer>
    </>
  );
}

Infrequencia.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={"Infrequência"}>{page}</Layout>;
};


export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    return {
      props: {},
    };
  },
  {
    roles: ["INF"],
  }
);