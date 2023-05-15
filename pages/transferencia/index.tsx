import PageContainer from "src/components/pageContainer";
import Top from "src/components/top";
import {useState} from 'react';
import Layout from "src/components/layout";
import type { ReactElement } from 'react'
import { NewTransfer } from "src/components/transfers/NewTransfer";
import { TableAlunosTransfer } from "src/components/transfers/tableAlunosTransfer";
import { withSSRAuth } from "src/utils/withSSRAuth";


export default function NovaTransferencia() {
  const [escola, setEscola] = useState("")
  const [busca, setBusca] = useState("")
  
  const changeSchool = (esc) => {
    setEscola(esc)
  }
  const changeSearch = (bus) => {
    setBusca(bus)
    console.log('alterou')
  }

  return (
    <PageContainer>
      <Top link={'/transferencias'}  title={"Transferências > Nova Transferência"}/>
      <NewTransfer changeSchool={changeSchool} changeSearch={changeSearch} />
      <TableAlunosTransfer escola={escola} busca={busca} />
    </PageContainer>
  );
}

NovaTransferencia.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout header={"Nova Transferência"}>{page}</Layout>
  )
}

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    return {
      props: {},
    };
  },
  {
    roles: ["TRF_ALU"],
  }
);