import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import Layout from "src/components/layout";
import type { ReactElement } from "react";
import { useState } from "react";
import { withSSRAuth } from "src/utils/withSSRAuth";
import FormCreateMessageTutores from "src/components/mensagem-tutores/formCreateMessageTutores";
import { MessageTutoresFilter } from "src/components/mensagem-tutores/messageTutoresFilter";

export default function NovaMensagemTutores() {
  const [county, setCounty] = useState(null);
  const [school, setSchool] = useState(null);
  const [serie, setSerie] = useState(null);
  const [schoolClass, setSchoolClass] = useState(null);

  return (
    <PageContainer>
      <Top title={"Mensagens aos Tutores > Nova"} />
      <MessageTutoresFilter
        changeSchool={setSchool} 
        changeSerie={setSerie} 
        changeSchoolClass={setSchoolClass}  
      />
      <div>
        
      </div>
      <FormCreateMessageTutores county={county} school={school} serie={serie} schoolClass={schoolClass}/>
    </PageContainer>
  );
}

NovaMensagemTutores.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={"Nova Mensagem aos Tutores"}>{page}</Layout>;
};

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    return {
      props: {},
    };
  },
  {
    roles: ["MEN"],
  }
);
