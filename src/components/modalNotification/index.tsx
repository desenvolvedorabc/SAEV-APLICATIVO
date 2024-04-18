import { Modal } from "react-bootstrap";
import {ButtonBlue} from "src/components/buttons/buttonBlue";
import { Data, Text, Title } from "./styledComponents";
import { format } from 'date-fns'
import {MdNotificationsActive} from 'react-icons/md'
import { getNotification } from "src/services/notificacoes.service";
import { useEffect, useState } from "react";

export function ModalNotification(props) {
  const [notification, setNotification] = useState(null)

  const loadNotification = async () => {
    if(props.notification != null){
      const resp = await getNotification(props.notification)
      setNotification(resp.data)
    }
  }

  useEffect(() => {
    loadNotification()
  },[props.notification])

  return (
    <Modal
      {...props}
      // size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header className="border-0 px-5">
        <Modal.Title id="contained-modal-title-vcenter">
          <MdNotificationsActive color={"#3B4BA2"} size={26} />
          <Title>{notification?.title}</Title>
          <Data>
            {notification?.createdAt &&
              format(new Date(notification?.createdAt), 'dd/MM/yyyy')
            }
          </Data>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex px-5">
        <Text><div dangerouslySetInnerHTML={{__html: notification?.message}} /></Text>
      </Modal.Body>
      <Modal.Footer className="d-flex flex-column justify-content-center border-0 align-center px-5">
        <div style={{width: 248}}>
          <ButtonBlue onClick={props.onHide}>Entendi</ButtonBlue>
        </div>
      </Modal.Footer>
    </Modal>
  );
}