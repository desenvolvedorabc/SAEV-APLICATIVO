import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import Layout from "src/components/layout";
import type { ReactElement } from 'react'
import { useEffect, useState} from 'react'
import { withSSRAuth } from "src/utils/withSSRAuth";
import TableMensagensTutores from "src/components/mensagem-tutores/tableMensagensTutores";
import TableMensagensModelos from "src/components/mensagem-tutores/tableMensagensModelos";
import { useRouter } from "next/router";

export default function Mensagens() {
  const router = useRouter();
  const { modelo } = router.query;
  const [selectedTable, setSelectedTable] = useState(0);

  useEffect(() => {
    if (modelo) {
      setSelectedTable(Number(modelo));
    }
  }, [modelo]);
  
  return (
    <PageContainer>
      <Top title={"Mensagens aos Tutores"}/>
      <div style={{ width: "100%", marginBottom: 20, borderBottom: "2px solid #D5D5D5" }}>
        <button style={{ color: selectedTable === 0 ? "#3E8277" : "#7C7C7C", padding: "8px", borderBottom: selectedTable === 0 ? "1px solid #3E8277" : "none", marginRight: 10, fontWeight: selectedTable === 0 ? "500" : "400" }} onClick={() => {
          setSelectedTable(0)
          router.push(
            {
              pathname: router.pathname, // mantém a mesma página
              query: { ...router.query, modelo: 0 },
            },
            undefined,
            { shallow: true } // evita reload e refetch
          );
        }}>
          Mensagens Enviadas
        </button>
        <button style={{ color: selectedTable === 1 ? "#3E8277" : "#7C7C7C", padding: "8px", borderBottom: selectedTable === 1 ? "1px solid #3E8277" : "none", fontWeight: selectedTable === 1 ? "500" : "400" }} onClick={() => {
          setSelectedTable(1)
          router.push(
            {
              pathname: router.pathname, // mantém a mesma página
              query: { ...router.query, modelo: 1 },
            },
            undefined,
            { shallow: true } // evita reload e refetch
          );
        }}>
          Modelos
        </button>
      </div>
      {selectedTable === 0 ? <TableMensagensTutores /> : <TableMensagensModelos />}
      
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
    roles: ["Outros", "MEN"],
  }
);