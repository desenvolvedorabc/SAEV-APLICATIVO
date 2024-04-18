import { useEffect, useState } from "react";
import { ButtonEncerrar, ButtonPage, ButtonTen, ButtonsNavigation, IconAnswered, PageNumbers } from "./styledComponents";
import { ButtonPadrao } from "src/components/buttons/buttonPadrao";
import { BiCheck, BiLeftArrowAlt, BiRightArrowAlt } from "react-icons/bi";
import ResponseQuestion from "../ResponseQuestion";
import ButtonYellow from "src/components/buttons/buttonYellow";
import ModalPergunta from "src/components/modalPergunta";
import ModalFinishAvOnline from "src/components/modalFinishAvOnline";
import ModalAviso from "src/components/modalAviso";
import { realizeAssessmentOnline } from "src/services/avaliacao-online";
import { signOut, useAuth } from "src/context/AuthContext";
import ModalConfirmacao from "src/components/modalConfirmacao";

export default function PerformAvaliation({testId, idAlu, questionPages, url}) {
  const [listQuestions, setListQuestions] = useState([])
  const [selectedQuestion, setSelectedQuestion] = useState(0)
  const [pageQuestions, setPageQuestions] = useState(0);
  const [modalShowExit, setModalShowExit] = useState(false);
  const [modalShowEnd, setModalShowEnd] = useState(false);
  const [modalShowFinish, setModalShowFinish] = useState(false);
  const [modalShowConfirm, setModalShowConfirm] = useState(false);
  const [modalStatus, setModalStatus] = useState(false);
  const [modalMessage, setModalMessage] = useState(null)
  const [isDisabled, setIsDisabled] = useState(false);
  const [finished, setFinished] = useState(false);
  const [finishDisabled, setFinishDisabled] = useState(true);
  const { user } = useAuth();

  const getQuestions = () => {
    let list = [];
    questionPages?.forEach((page) => {
      page.questions?.forEach((question) => {
        list.push({page: page.order, question: question, answer: ''})
      })
    })

    setListQuestions(list)
  }

  useEffect(() => {
    getQuestions()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionPages]);

  const handleChooseAlternative = (option) => {
    listQuestions[selectedQuestion].answer = option
    setListQuestions(listQuestions); 

    getFinishedDisabled()
  }

  const handlePreviousTen = () =>{
    setPageQuestions(pageQuestions - 1)
    setSelectedQuestion((pageQuestions - 1) * 10)
  }

  const handlePreviousPage = () =>{
    if((selectedQuestion - 1) / 10 < pageQuestions){
      setPageQuestions(pageQuestions - 1)
    }
    setSelectedQuestion(selectedQuestion -1)
  }

  const handleNextPage = () =>{    
    if((selectedQuestion + 1) / 10 >= pageQuestions + 1){
      setPageQuestions(pageQuestions + 1)
    }
    setSelectedQuestion(selectedQuestion + 1)
  }

  const handleNextTen = () =>{
    setPageQuestions(pageQuestions + 1)
    setSelectedQuestion((pageQuestions + 1) * 10)
  }

  const getPreviousDisabled = () =>{
    if(selectedQuestion > 0) {
      return false;
    }
    return true;
  }

  const getNextTenDisabled = () =>{
    if(listQuestions.length - (pageQuestions * 10 + 10)  >= 0) {
      return false;
    }
    return true;
  }

  const getPagesSelector = () =>{
    const list = [];
    let limit = 0;
    if(listQuestions.length - (pageQuestions * 10 + 10)  >= 0) {
      limit = 10;
    }
    else {
      limit = listQuestions.length - (pageQuestions * 10)
    }
    for(let i = pageQuestions * 10; i < limit + pageQuestions * 10; i++) {
      list.push(
        <ButtonPage type="button" key={i} active={selectedQuestion === i} onClick={() => setSelectedQuestion(i)}>{listQuestions[i]?.answer && <IconAnswered><BiCheck/></IconAnswered>}{i + 1}</ButtonPage>
      )
    }
    return list;
  }

  const finishAvaliation = async () => {

    if(!finished) {
      setModalStatus(true)
      setModalShowConfirm(true)
      setModalMessage(<><p>Avaliação Encerrada com Sucesso!</p></>)
      return
    }

    const formattedData = {
      ALT_ATIVO: true,
      ALT_TES: testId,
      ALT_USU: user?.USU_ID,
      ALT_ALU: idAlu,
      ALT_FINALIZADO: true,
      ALT_RESPOSTAS: [],
    };
    
    listQuestions.forEach((question) => {
      formattedData.ALT_RESPOSTAS.push({
        ATR_RESPOSTA: question.answer,
        ATR_TEG: question?.question?.questionTemplateId,
        ATR_ID: null,
      })
    })

    setIsDisabled(true)
    let response = null;
    try{
      response = await realizeAssessmentOnline(formattedData)
    }
    catch (err) {
      setIsDisabled(false)
    } finally {
      setIsDisabled(false)
    }
    if (!response?.message) {
      setModalStatus(true)
      setModalShowConfirm(true)
      setModalMessage(<><p>Avaliação Finalizada com Sucesso!</p><p>As respostas foram contabilizadas e registradas no nosso sistema.</p></>)
    }
    else {
      setModalStatus(false)
      setModalShowConfirm(true)
      setModalMessage(response.data.message || 'Erro ao finalizar avaliação')
    }
  }

  const handleLogout = () => {
    signOut()
  }

  const getFinishedDisabled = () => {
    let empty = false;
    listQuestions.forEach((question) => {
      if (question.answer === ''){
        empty = true;
      }
    })

    setFinishDisabled(empty);
  }

  return(
    <>
      <div style={{display: 'flex', justifyContent: 'flex-end'}}>
        <ButtonEncerrar type="button" onClick={() => {setModalShowExit(true), setFinished(false)}}>
          Encerrar Avaliação
        </ButtonEncerrar>
      </div>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <ResponseQuestion page={questionPages[listQuestions[selectedQuestion]?.page]} question={listQuestions[selectedQuestion]} changeQuestion={handleChooseAlternative} url={url} />
        <ButtonsNavigation>
          <div style={{width: 116, marginRight: 15}}>
            <ButtonPadrao onClick={handlePreviousPage} disable={getPreviousDisabled()}>
              <BiLeftArrowAlt size={22} /> 
              Anterior
            </ButtonPadrao>
          </div>
            {selectedQuestion === listQuestions?.length -1 ? 
              <div style={{width: 129}}>
                <ButtonYellow onClick={() => {setModalShowEnd(true), setFinished(true)}} disable={finishDisabled}>
                  Finalizar Avaliação
                </ButtonYellow>
              </div>
            :
              <div style={{width: 116}}>
                <ButtonPadrao onClick={handleNextPage}>
                  <BiRightArrowAlt size={22} /> 
                  Próxima
                </ButtonPadrao>
              </div>
            }
        </ButtonsNavigation>
      </div>
      <PageNumbers>
        <ButtonTen type="button" disabled={pageQuestions === 0} onClick={handlePreviousTen}>
          -10
        </ButtonTen>
        {getPagesSelector().map((pageButton) => pageButton)}
        <ButtonTen type="button" disabled={getNextTenDisabled()} onClick={handleNextTen}>+10</ButtonTen>
      </PageNumbers>
      <ModalPergunta
        show={modalShowExit}
        onHide={() => setModalShowExit(false)}
        onConfirm={() => {setModalShowExit(false), setModalShowFinish(true)}}
        buttonNo={`Voltar às Questões.`}
        buttonYes={"Sim. Desejo Encerrar Essa Avaliação."}
        text={`Atenção! Você está encerrando essa avaliação antes da conclusão de todas as questões. Tem certeza que deseja continuar com a finalização? `}
        status={false}
        size="lg"
      />
      <ModalAviso
        show={modalShowEnd}
        onHide={() => setModalShowEnd(false)}
        onConfirm={() => {
          {setModalShowEnd(false), setModalShowFinish(true)}
        }}
        buttonYes={"Sim. Desejo Finalizar essa avaliação."}
        buttonNo={"Não. Voltar às Questões."}
        buttonInverted={true}
        text={`Atenção! Você está finalizando essa avaliação. Tem certeza que deseja continuar com a finalização?`}
      />
      <ModalFinishAvOnline
        show={modalShowFinish}
        onHide={() => setModalShowFinish(false)}
        onConfirm={() => finishAvaliation()}
        size="sm"
      />
      <ModalConfirmacao
        show={modalShowConfirm}
        onHide={() => modalStatus ? (handleLogout(), setModalShowConfirm(false)) : setModalShowConfirm(false)}
        text={modalMessage}
        textConfirm="Fechar"
        status={modalStatus}
      />
    </>
  )
}