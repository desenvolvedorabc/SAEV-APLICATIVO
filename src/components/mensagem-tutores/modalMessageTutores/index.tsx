import { Modal } from "react-bootstrap";
import {ButtonPadrao} from "src/components/buttons/buttonPadrao";
import { BoxDestinatario, Data, LineBox, Status, Text } from "./styledComponents";
import { format } from 'date-fns'
import { useEffect, useRef, useState } from "react";
import { getMessageTutor, getSendMessageTutor, useGetSendMessageTutorPag } from "src/services/mensagens-tutores.service";
import { Loading } from "src/components/Loading";

const StatusMessage = {
  PENDENTE: 'Pendente',
  NAO_ENVIADO: 'Não Enviado',
  ENTREGUE: 'Entregue',
  ENVIADO: 'Enviado',
  FALHOU: 'Falhou',
}


export function ModalMessage(props) {
  const [message, setMessage] = useState(null)
  const containerRef = useRef(null);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

    // Checa se chegou no final
    if (scrollTop + clientHeight >= scrollHeight - 5) {
      fetchNextPage();
    }
  };

  const loadMessage = async () => {
    if (props.message) {
      const resp = await getMessageTutor(props.message.MEN_ID);
      console.log('resp :', resp);
      setMessage(resp.data?.tutorMessage)

      const resp2 = await getSendMessageTutor({page: 1, limit: 9999999, tutorMessageId: props.message.MEN_ID});
      console.log('resp2 :', resp2);

      
    }
  }

  const { flatData: listStudents, query: { isLoading, fetchNextPage } } = useGetSendMessageTutorPag({
    limit: 10,
    tutorMessageId: props.message?.MEN_ID,
    enabled: !!props.message?.MEN_ID,
    options: null
  });

  useEffect(() => {
    loadMessage();
  }, [props.message]);

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton className=" justify-content-center border px-5">
        <Modal.Title id="contained-modal-title-vcenter">
          {props.message?.MEN_TITLE}
          <Data>
            {props.message?.MEN_DT_CRIACAO &&
              format(new Date(props.message?.MEN_DT_CRIACAO), 'dd/MM/yyyy')
            }
          </Data>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex flex-column justify-content-center px-5">
        <Text><div dangerouslySetInnerHTML={{__html: props.message?.MEN_TEXT}} /></Text>
        <div style={{width: '100%', border: '1px solid #D5D5D5'}} />
        <div style={{margin: '16px 0 8px 0'}}>
          {message?.filters?.countyId} {message?.filters?.schoolId && ' - ' + message?.filters?.schoolId} {message?.filters?.serieId && ' - ' + message?.filters?.serieId} {message?.filters?.schoolClassId && ' - ' + message?.filters?.schoolClassId}
        </div>
        <BoxDestinatario
          ref={containerRef}
          onScroll={handleScroll}
        >
          <table style={{width: '100%'}}>
            <thead>
              <LineBox>
                <td>
                  Destinatário 
                </td>
                <td align="center">
                  Status Email
                </td>
                <td align="center">
                  Status Whatsapp
                </td>
              </LineBox>
            </thead>
            <tbody>
              {listStudents?.map((x, index) => {
                return (
                  <LineBox key={index}>
                    <td>
                      {x?.student?.ALU_NOME}
                    </td>
                    <Status color={x?.statusEmail} align="center">
                      {StatusMessage[x.statusEmail]}
                    </Status>
                    <Status color={x?.statusWhatsapp} align="center">
                      {StatusMessage[x?.statusWhatsapp]}
                    </Status>
                  </LineBox>
                )
              })}
            </tbody>
            {isLoading && (
              <tfoot>
                <tr>
                  <td colSpan={3} align="center">
                    <Loading />
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </BoxDestinatario>
      </Modal.Body>
      <Modal.Footer className="d-flex flex-column justify-content-center border-0 align-center px-5">
        <div style={{width: 220}}>
          <ButtonPadrao onClick={props.onHide}>Fechar</ButtonPadrao>
        </div>
      </Modal.Footer>
    </Modal>
  );
}