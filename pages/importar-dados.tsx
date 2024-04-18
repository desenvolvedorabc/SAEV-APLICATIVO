import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import Layout from "src/components/layout";
import { ReactElement } from 'react'
import { ImportExport } from "src/components/importarExportar/importExport";
import { History } from "src/components/importarExportar/history";
import { TemplateList } from "src/components/importarExportar/templateList";
import { withSSRAuth } from "src/utils/withSSRAuth";

export default function ImportarExportar({url}) {
  
  return (
    <PageContainer>
      <Top title={"Importar Dados"}/>
      <div className="d-flex">
        <div className="">
          <ImportExport />
          <History url={url}/>
        </div>
        <div className="ms-3 col">
          <TemplateList />
        </div>
      </div>
    </PageContainer>
  );
}

ImportarExportar.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout header={"Importar Dados"}>{page}</Layout>
  )
}


export const getServerSideProps = withSSRAuth(
  async function getServerSideProps(context) {
    return{
      props: {
        url: process.env.NEXT_PUBLIC_API_URL_IMPORT
      }
    }
  },
  {
    roles: ["Outros", "IMP_EXP"],
  }
);