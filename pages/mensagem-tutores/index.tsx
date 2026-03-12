import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import Layout from "src/components/layout";
import type { ReactElement } from "react";
import { useState } from "react";
import { withSSRAuth } from "src/utils/withSSRAuth";
import FormCreateMessageTutores from "src/components/mensagem-tutores/formCreateMessageTutores";
import { MessageTutoresFilter } from "src/components/mensagem-tutores/messageTutoresFilter";

export default function NovaMensagemTutores() {
  const [school, setSchool] = useState(null);
  const [serie, setSerie] = useState(null);
  const [schoolClass, setSchoolClass] = useState(null);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  return (
    <PageContainer>
      <Top title={"Mensagens aos Tutores > Nova"} />
      <MessageTutoresFilter
        changeSchool={setSchool} 
        changeSerie={setSerie} 
        changeSchoolClass={setSchoolClass}
        triggerReload={() => setReloadTrigger(prev => prev + 1)}
      />
      <div>
        
      </div>
      <FormCreateMessageTutores 
        school={school} 
        serie={serie} 
        schoolClass={schoolClass}
        changeSerie={setSerie}
        changeSchoolClass={setSchoolClass}
        reloadTrigger={reloadTrigger}
      />
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
