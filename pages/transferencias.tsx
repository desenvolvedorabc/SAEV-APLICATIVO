import PageContainer from "src/components/pageContainer";
import { useState, useEffect } from "react";
import Layout from "src/components/layout";
import type { ReactElement } from "react";
import { useBreadcrumbContext } from "src/context/breadcrumb.context";
import Top from "src/components/top";
import { ContentSectionTranfers } from "src/components/transfers/ContentSectionTransfers";
import { ContentOptionsFilterTranfers } from "src/components/transfers/ContentOptionsFilterTranfers";
import { ContentFilterDataTransfers } from "src/components/transfers/ContentFilterDataTransfers";
import { parseCookies } from "nookies";
import ModalAviso from "src/components/modalAviso";
import ModalAvisoTexto from "src/components/modalAvisoTexto";
import ModalConfirmacao from "src/components/modalConfirmacao";
import { cancelTransfer, editTransfer, getTransfers } from "src/services/transferencias.service";
import ModalInformacao from "src/components/modalInformacao";

export default function Transferencias({ url, userInfo }) {
  const [transfers, setTransfer] = useState<any[]>([]);
  const [subject, setSubject] = useState("em-aberto");
  const [orderBy, setOrderBy] = useState("maisAntigos");
  const [studentSelect, setStudentSelect] = useState("");
  const [county, setCounty] = useState(null);
  const [school, setSchool] = useState(null);
  const [handleSubmit, setHandleSubmit] = useState(false);
  const [handleReload, setHandleReload] = useState(false);
  const [isLoading, setIsLoading]= useState(false);

  const [modalCancelTransfer, setModalCancelTransfer] = useState(null);
  const [modalCancelSuccess, setModalCancelSuccess] = useState(false);
  const [modalApprovTransfer, setModalApprovTransfer] = useState(false);
  const [modalApprovSuccess, setModalApprovSuccess] = useState(false);
  const [modalUnapprovTransfer, setModalUnapprovTransfer] = useState(false);
  const [modalUnapprovSuccess, setModalUnapprovSuccess] = useState(false);
  const [modalInfo, setModalInfo] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [text, setJustificative] = useState(null);

  const confirmCancel = async () => {
    cancelTransfer(modalCancelTransfer);
    setModalCancelTransfer(null);
    setModalCancelSuccess(true);
    setHandleReload(true);
  };

  const handleApprov = async (id: string) => {
    let transferFind = transfers.find((transfer) => transfer.TRF_ID === id);
    setSelectedTransfer(transferFind);
    setModalApprovTransfer(true);
  };

  const handleUnapprov = async (id: string) => {
    let transferFind = transfers.find((transfer) => transfer.TRF_ID === id);
    setSelectedTransfer(transferFind);
    setModalUnapprovTransfer(true);
  };

  const handleInfo = async (id: string) => {
    let transferFind = transfers.find((transfer) => transfer.TRF_ID === id);
    setSelectedTransfer(transferFind);
    setModalInfo(true);
  };

  const confirmApprov = async () => {
    const data = {
      TRF_STATUS: "TAPROVADO",
    };

    try {
      setIsLoading(true)
      await editTransfer(selectedTransfer.TRF_ID, data);
    } catch (err) {
      setIsLoading(false)
    } finally {
      setIsLoading(false)
    }
    setModalApprovTransfer(null);
    setModalApprovSuccess(true);
    setHandleReload(true);
  };

  const confirmUnapprov = async () => {
    const data = {
      TRF_STATUS: "TREPROVADO",
      TRF_JUSTIFICATIVA: text.target.value,
    };
    await editTransfer(selectedTransfer.TRF_ID, data);
    setModalUnapprovTransfer(null);
    setModalUnapprovSuccess(true);
    setHandleReload(true);
  };

  const { resetBreadcrumbs, handleUnClickBar } = useBreadcrumbContext();

  useEffect(() => {
    resetBreadcrumbs();
    handleUnClickBar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSelectSubject(type: string) {
    setSubject(type);
    setHandleSubmit(true);
  }

  function handleChangeOrderBy(e) {
    setOrderBy(e.target.id);
    setHandleSubmit(true);
  }

  function handleSelectStudent(e) {
    setStudentSelect(e.target.id);
    setHandleSubmit(true);
  }

  async function loadTransfers() {
    const response = await getTransfers(
      1,
      9999,
      school?.ESC_ID,
      county?.MUN_ID,
      orderBy,
      subject,
      studentSelect === "Todos" ? null : studentSelect
    );
    setTransfer(response.data.items);
    setStudentSelect("");
    setHandleSubmit(false);
  }

  useEffect(() => {
    loadTransfers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (handleSubmit || handleReload) {
      loadTransfers();
      setHandleReload(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleSubmit, handleReload]);

  return (
    <>
      <PageContainer>
        <Top title="Transferências" />
        <ContentFilterDataTransfers
          changeCounty={setCounty}
          changeSchool={setSchool}
          handleSubmit={setHandleSubmit}
        />
        <ContentOptionsFilterTranfers
          subject={subject}
          students={transfers}
          selectSubject={handleSelectSubject}
          studentSelect={studentSelect}
          setStudentSelect={handleSelectStudent}
          orderBy={orderBy}
          changeOrderBy={handleChangeOrderBy}
          county={county}
          school={school}
          />
        <ContentSectionTranfers
          transfers={transfers}
          url={url}
          school={school?.ESC_ID}
          handleCancel={setModalCancelTransfer}
          handleApprov={handleApprov}
          handleUnapprov={handleUnapprov}
          handleInfo={handleInfo}
          user={userInfo?.user}
        />

        <ModalAviso
          show={modalCancelTransfer}
          onConfirm={() => confirmCancel()}
          onHide={() => setModalCancelTransfer(null)}
          newModalFormat
          buttonNo={"Manter Pedido"}
          buttonYes={"Sim, Cancelar Pedido"}
          text={`Tem certeza que deseja cancelar o pedido de transferência enviado?`}
          warning
        />
        <ModalConfirmacao
          show={modalCancelSuccess}
          onHide={() => {
            setModalCancelSuccess(false);
          }}
          text={"Pedido cancelado com sucesso."}
          status={true}
        />

        {selectedTransfer && (
          <>
            <ModalAvisoTexto
              show={modalApprovTransfer}
              isLoading={isLoading}
              onConfirm={() => confirmApprov()}
              onHide={() => setModalApprovTransfer(null)}
              newModalFormat
              buttonNo={"Cancelar"}
              buttonYes={"Transferir"}
              text={`Tem certeza que deseja transferir o aluno(a) "${selectedTransfer.ALU_NOME}"?`}
              descriptionFrom={{
                school: selectedTransfer.ESC_NOME_ORIGEM,
                county: selectedTransfer.MUN_NOME_ORIGEM,
                serie: selectedTransfer?.SER_NOME_ORIGEM,
                schoolClass: selectedTransfer?.TUR_NOME_ORIGEM,
              }}
              descriptionTo={{
                school: selectedTransfer.ESC_NOME_DESTINO,
                county: selectedTransfer.MUN_NOME_DESTINO,
                serie: selectedTransfer?.SER_NOME_DESTINO,
                schoolClass: selectedTransfer?.TUR_NOME_DESTINO,
              }}
              input={false}
              warning
            />
            <ModalConfirmacao
              show={modalApprovSuccess}
              onHide={() => {
                setModalApprovSuccess(false);
              }}
              text={"Aluno(a) transferido com sucesso!"}
              status={true}
            />
          </>
        )}

        {selectedTransfer && (
          <>
            <ModalAvisoTexto
              show={modalUnapprovTransfer}
              isLoading={isLoading}
              onConfirm={() => confirmUnapprov()}
              onHide={() => setModalUnapprovTransfer(null)}
              onChange={(e) => setJustificative(e)}
              newModalFormat
              buttonNo={"Cancelar"}
              buttonYes={"Reprovar Transferência"}
              text={`Tem certeza que deseja reprovar a transferência do aluno(a) "${selectedTransfer.ALU_NOME}"?`}
              descriptionFrom={{
                school: selectedTransfer.ESC_NOME_ORIGEM,
                county: selectedTransfer.MUN_NOME_ORIGEM,
                serie: selectedTransfer?.SER_NOME_ORIGEM,
                schoolClass: selectedTransfer?.TUR_NOME_ORIGEM,
              }}
              descriptionTo={{
                school: selectedTransfer.ESC_NOME_DESTINO,
                county: selectedTransfer.MUN_NOME_DESTINO,
                serie: selectedTransfer?.SER_NOME_DESTINO,
                schoolClass: selectedTransfer?.TUR_NOME_DESTINO,
              }}
              input={true}
              warning
            />
            <ModalConfirmacao
              show={modalUnapprovSuccess}
              onHide={() => {
                setModalUnapprovSuccess(false);
              }}
              text={"Transferência reprovada com sucesso!"}
              status={true}
            />
            <ModalInformacao
              show={modalInfo}
              onHide={() => {
                setModalInfo(false);
              }}
              text={selectedTransfer.TRF_JUSTIFICATIVA}
              status={true}
            />
          </>
        )}
      </PageContainer>
    </>
  );
}

Transferencias.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={"Transferências"}>{page}</Layout>;
};

export async function getServerSideProps(context) {
  let cookies = parseCookies(context);
  const base64Url = cookies["__session"].split(".")[1];
  const base64 = base64Url.replace("-", "+").replace("_", "/");
  const userBuffer = base64 ? Buffer.from(base64, "base64").toString() : null;

  return {
    props: {
      userInfo: userBuffer ? JSON.parse(userBuffer) : null,
      url: process.env.NEXT_PUBLIC_API_URL,
    },
  };
}
