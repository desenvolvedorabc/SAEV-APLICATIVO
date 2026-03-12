import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import Layout from "src/components/layout";
import type { ReactElement } from 'react'
import { useEffect, useState} from 'react'
import { withSSRAuth } from "src/utils/withSSRAuth";
import TableMensagensTutores from "src/components/mensagem-tutores/tableMensagensTutores";
import TableMensagensModelos from "src/components/mensagem-tutores/tableMensagensModelos";
import { useRouter } from "next/router";
import TableMensagensAutomaticas from "src/components/mensagem-tutores/tableMensagensAutomaticas";
import TableMensagensRegras from "src/components/mensagem-tutores/tableMensagensRegras";

export default function Mensagens() {
  const router = useRouter();
  const { view } = router.query;
  const [selectedTable, setSelectedTable] = useState(0);

  useEffect(() => {
    if (view) {
      setSelectedTable(Number(view));
    }
  }, [view]);

  const getActiveView = () => {
    switch (selectedTable) {
      case 0:
        return <TableMensagensTutores />;
      case 1:
        return <TableMensagensModelos />;
      case 2:
        return <TableMensagensAutomaticas />;
      case 3:
        return <TableMensagensRegras />;
      default:
        return <TableMensagensTutores />;
    }
  };
  
  return (
    <PageContainer>
      <Top title={"Mensagens aos Tutores"}/>
      <div style={{ width: "100%", marginBottom: 20, borderBottom: "2px solid #D5D5D5" }}>
        <button style={{ color: selectedTable === 0 ? "#3E8277" : "#7C7C7C", padding: "8px", borderBottom: selectedTable === 0 ? "1px solid #3E8277" : "none", marginRight: 10, fontWeight: selectedTable === 0 ? "500" : "400" }} onClick={() => {
          setSelectedTable(0)
          router.push(
            {
              pathname: router.pathname, // mantém a mesma página
              query: { ...router.query, view: 0 },
            },
            undefined,
            { shallow: true } // evita reload e refetch
          );
        }}>
          Mensagens Enviadas
        </button>
        <button style={{ color: selectedTable === 1 ? "#3E8277" : "#7C7C7C", padding: "8px", borderBottom: selectedTable === 1 ? "1px solid #3E8277" : "none", marginRight: 10, fontWeight: selectedTable === 1 ? "500" : "400" }} onClick={() => {
          setSelectedTable(1)
          router.push(
            {
              pathname: router.pathname, // mantém a mesma página
              query: { ...router.query, view: 1 },
            },
            undefined,
            { shallow: true } // evita reload e refetch
          );
        }}>
          Modelos
        </button>
        <button style={{ color: selectedTable === 2 ? "#3E8277" : "#7C7C7C", padding: "8px", borderBottom: selectedTable === 2 ? "1px solid #3E8277" : "none", marginRight: 10, fontWeight: selectedTable === 2 ? "500" : "400" }} onClick={() => {
          setSelectedTable(2)
          router.push(
            {
              pathname: router.pathname, // mantém a mesma página
              query: { ...router.query, view: 2 },
            },
            undefined,
            { shallow: true } // evita reload e refetch
          );
        }}>
          Mensagens Automáticas
        </button>
        <button style={{ color: selectedTable === 3 ? "#3E8277" : "#7C7C7C", padding: "8px", borderBottom: selectedTable === 3 ? "1px solid #3E8277" : "none", fontWeight: selectedTable === 3 ? "500" : "400" }} onClick={() => {
          setSelectedTable(3)
          router.push(
            {
              pathname: router.pathname, // mantém a mesma página
              query: { ...router.query, view: 3 },
            },
            undefined,
            { shallow: true } // evita reload e refetch
          );
        }}>
          Regras Automáticas
        </button>
      </div>
      {getActiveView()}
      
    </PageContainer>
  );
}

Mensagens.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout  header={"Mensagens aos Tutores"}>{page}</Layout>
  )
}

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    return {
      props: {},
    };
  },
  {
    roles: ["Outros", "MEN_TUT"],
  }
);