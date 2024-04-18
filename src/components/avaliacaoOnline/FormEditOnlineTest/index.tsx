import { Form } from "react-bootstrap";
import { useFormik } from 'formik';
import {ButtonPadrao} from 'src/components/buttons/buttonPadrao';
import { ButtonGroup, ButtonTen, ButtonPage, PageNumbers } from './styledComponents';
import ButtonWhite from 'src/components/buttons/buttonWhite';
import ModalConfirmacao from 'src/components/modalConfirmacao';
import ModalAviso from 'src/components/modalAviso';
import { useState } from 'react';
import Router from 'next/router'
import ModalAvOnline from "src/components/modalAvOnline";
import { BiLeftArrowAlt, BiRightArrowAlt } from "react-icons/bi";
import QuestionPage from "../QuestionPage";
import { createAssessmentOnline, deleteAssessmentOnlinePage, toggleActiveAssessmentOnline, updateAssessmentOnline } from "src/services/avaliacao-online";
import ButtonVermelho from "src/components/buttons/buttonVermelho";
import ModalPergunta from "src/components/modalPergunta";
import { ModalDelete } from "src/components/modalDelete";


export default function FormEditOnlineTest({idTest, onlineTest}) {

  const [ModalShowConfirm, setModalShowConfirm] = useState(false)
  const [modalShowQuestion, setModalShowQuestion] = useState(false)
  const [modalShowQuestionActive, setModalShowQuestionActive] = useState(false)
  const [modalShowConfirmQuestion, setModalShowConfirmQuestion] = useState(false)
  const [modalShowQuestionChange, setModalShowQuestionChange] = useState(false)
  const [modalShowAvOnline, setModalShowAvOnline] = useState(false)
  const [modalShowDeletePage, setModalShowDeletePage] = useState(false)
  const [modalStatus, setModalStatus] = useState(true)
  const [errorMessage, setErrorMessage] = useState('Erro ao criar Teste')
  const [isDisabled, setIsDisabled] = useState(false);
  const [idTeste, setIdTeste] = useState(null);
  const [pages, setPages] = useState(onlineTest ? onlineTest?.pages : [{
    title: '',
    order: 0,
    image: null,
    questions: [],
  }]);
  const [pagePages, setPagePages] = useState(0);
  const [selectedPage, setSelectedPage] = useState(0);
  const [questionsDelete, setQuestionsDelete] = useState([])
  let error = false;

  // const addTenPages = (add: number, first = false) => {
  //   let list = [];
  //   let i = 10 * (pagePages + add);
  //   let limit = 10 * (pagePages + add) + 10;

  //   if(first && onlineTest?.pages.length > 0) {
  //     i = onlineTest?.pages.length

  //     limit = Math.ceil(onlineTest?.pages.length / 10) * 10
  //   }

  //   for(i; i < limit; i++) {
  //     list.push({
  //       title: '',
  //       order: i,
  //       image: null,
  //       questions: [],
  //     })
  //   }

  //   let newList = pages.concat(list);
  //   handleUpdateQuestionsOrder(newList, false)
  // }

  const addPage = () => {
    let newList = pages.concat({
      title: '',
      order: selectedPage + 1,
      image: null,
      questions: [],
    });
    
    handleUpdateQuestionsOrder(newList, false)
  }

  const cleanPages = () => {
    error = false;
    let filterPages = pages.map(page => {
      let filterQuestions = page.questions.map(question => {
        let filterAlternatives = question.alternatives.filter((alternative) => {
          return alternative.description || alternative.image
        });
        if(filterAlternatives.length >= 0 && filterAlternatives.length < 4) {
          error = true;
        }
        return {...question, alternatives: filterAlternatives}
      });

      filterQuestions = filterQuestions.filter((question) => question.alternatives.length > 0)
      return {...page, questions: filterQuestions}
    })

    filterPages = filterPages.filter(page => page.title || page.questions.length > 0 )

    filterPages.map((page) => {
      if(!page.title || page.questions.length === 0){
        error = true;
      }
    })

    return handleUpdateQuestionsOrder(filterPages, true);
  }

  const formik = useFormik({
    initialValues: {
    },
    onSubmit: async (values) => {

      let cleanedPages = cleanPages();

      if (onlineTest){
        let countQuestions = 0;
        cleanedPages.forEach(page => {
          countQuestions += page.questions.length
        });

        if (onlineTest?.test?.TEMPLATE_TEST.length != countQuestions){
          setModalStatus(false)
          setModalShowConfirm(true)
          setErrorMessage('Informe a mesma quantidade de questões existente no gabarito do teste.')
          return
        }
      }

      if(error){
        setModalStatus(false)
        setModalShowConfirm(true)
        setErrorMessage('Existem campos incompletos')
        return
      }

      setIsDisabled(true)

      const data = {
        testId: idTest,
        pages: cleanedPages
      }

      let response = null;
      try{
        if(onlineTest) {
          response = await updateAssessmentOnline(onlineTest?.id, data, questionsDelete)
        }
        else{
          response = await createAssessmentOnline(data)
        }
      }
      catch (err) {
        setIsDisabled(false)
      } finally {
        setIsDisabled(false)
      }
      if (!response.message) {
        setModalStatus(true)
        setModalShowConfirm(true)
      }
      else {
        setModalStatus(false)
        setModalShowConfirm(true)
        setErrorMessage(response.message || 'Erro ao criar Avaliação')
      }
    }
  });

  const handlePreviousTen = () =>{
    setPagePages(pagePages - 1)
    setSelectedPage((pagePages - 1) * 10)
  }

  const handlePreviousPage = () =>{
    if((selectedPage - 1) / 10 < pagePages){
      setPagePages(pagePages - 1)
    }
    setSelectedPage(selectedPage -1)
  }

  const handleNextPage = () =>{
    if(selectedPage === pages.length -1){
      addPage()
    }
    
    if((selectedPage + 1) / 10 >= pagePages + 1){
      setPagePages(pagePages + 1)
    }
    setSelectedPage(selectedPage + 1)
  }

  const handleNextTen = () =>{
    setPagePages(pagePages + 1)
    setSelectedPage((pagePages + 1) * 10)
  }

  const getPreviousDisabled = () =>{
    if(selectedPage > 0) {
      return false;
    }
    return true;
  }

  const getNextTenDisabled = () =>{
    if(pages.length - (pagePages * 10 + 10)  >= 0) {
      return false;
    }
    return true;
  }

  const getPagesSelector = () =>{
    const list = [];
    let limit = 0;
    if(pages.length - (pagePages * 10 + 10)  >= 0) {
      limit = 10;
    }
    else {
      limit = pages.length - (pagePages * 10)
    }
    for(let i = pagePages * 10; i < limit + pagePages * 10; i++) {
      list.push(
        <ButtonPage type="button" key={i} active={selectedPage === i} onClick={() => setSelectedPage(i)}>{i + 1}</ButtonPage>
      )
    }
    return list;
  }

  const handleChangePage = (page: number, info: any) => {
    pages[page] = info;
    setPages([...pages]);
  }

  const handleDeletePage = async () => {
    const pageDelete = pages[selectedPage];
    const filterPages = pages.filter(page => page.order !== pageDelete?.order);
    if(pageDelete?.id){
      const resp = await deleteAssessmentOnlinePage(pageDelete?.id)
      if(resp.message){
        setModalStatus(false)
        setModalShowConfirm(true)
        setErrorMessage(resp.message || 'Erro ao deletar página')
        setModalShowDeletePage(false)  
      } else{
        handleUpdateQuestionsOrder(filterPages, false)
        setSelectedPage(selectedPage - 1);
    
        setModalShowDeletePage(false)  
      }
    } else{
      handleUpdateQuestionsOrder(filterPages, false)
      setSelectedPage(selectedPage - 1);
  
      setModalShowDeletePage(false)
    }
  }

  const handleUpdateQuestionsOrder = (_pages, isReturn) => {
    let pageNumber = 0;
    let questionNumber = 0;
    let list = _pages.map(page => {
      let questions = page.questions.map(question => {
        let order = questionNumber;
        questionNumber++;

        return {...question, order: order}
      })
      let order = pageNumber;
      pageNumber++;
      return {...page, order: order, questions: questions}
    })

    if (isReturn) {
      return list;
    }

    setPages(list)
  }

  const handleAddQuestion = (pageNumber) => {
    pages[pageNumber].questions.push({
      description: '', 
      order: null, 
      alternatives: [{
        option: 'A', 
        description: '', 
        image: null
      },{
        option: 'B', 
        description: '', 
        image: null
      },{
        option: 'C', 
        description: '', 
        image: null
      },{
        option: 'D', 
        description: '', 
        image: null
      }]
    })

    handleUpdateQuestionsOrder(pages, false)
  }

  const handleRemoveQuestion = (pageNumber, questionNumber) => {
    let list = pages.map((page) =>{
      if(page.order === pageNumber){
        let questions = page.questions.filter((x, index) => index !== questionNumber);
        return {...page, questions: questions}
      }
      return page
    });
     

    handleUpdateQuestionsOrder(list, false)
  }

  const handleQuestionToDelete = (questionId) => {
    setQuestionsDelete([...questionsDelete, questionId])
  }

  async function handleActiveAssessment() {
    setModalShowQuestionActive(false);

    const response = await toggleActiveAssessmentOnline(onlineTest?.id)

    if (!response.message) {
      setModalShowConfirmQuestion(true);
      setModalStatus(true);
    } else {
      setModalStatus(false);
      setModalShowConfirmQuestion(true);
    }
  }

  return (
    <>
      <Form onSubmit={formik.handleSubmit}>
        {pages[selectedPage] &&
          <QuestionPage pageInfo={pages[selectedPage]} changePage={handleChangePage} deletePage={setModalShowDeletePage} addQuestion={handleAddQuestion} removeQuestion={handleRemoveQuestion} idsDelete={handleQuestionToDelete} />
        }
        <div style={{ display: 'flex', justifyContent: 'flex-end'}}>
          <div style={{width: 116, marginRight: 15}}>
            <ButtonPadrao onClick={handlePreviousPage} disable={getPreviousDisabled()}>
              <BiLeftArrowAlt size={22} /> 
              Anterior
            </ButtonPadrao>
          </div>
          <div style={{width: 116}}>
            <ButtonPadrao onClick={handleNextPage}>
              <BiRightArrowAlt size={22} /> 
              Próxima
            </ButtonPadrao>
          </div>
        </div>
        <PageNumbers>
          <ButtonTen type="button" disabled={pagePages === 0} onClick={handlePreviousTen}>
            -10
          </ButtonTen>
          {getPagesSelector().map((pageButton) => pageButton)}
          <ButtonTen type="button" onClick={handleNextTen} disabled={getNextTenDisabled()}>+10</ButtonTen>
        </PageNumbers>
        <ButtonGroup >
          <div>
            {onlineTest && 
              <div>
                {onlineTest?.active ? (
                  <ButtonVermelho
                  onClick={(e) => {
                    e.preventDefault();
                    setModalShowQuestionActive(true);
                  }}
                  >
                    Desativar
                  </ButtonVermelho>
                ) : (
                  <ButtonPadrao
                  onClick={(e) => {
                    e.preventDefault();
                    setModalShowQuestionActive(true);
                  }}
                  >
                    Ativar
                  </ButtonPadrao>
                )}
              </div>
            }
          </div>
          <div style={{display: "flex"}}>
            <div style={{width:160}}>
              <ButtonWhite type='button' onClick={(e) => { e.preventDefault(); setModalShowQuestion(true) }}>
                Descartar
              </ButtonWhite>
            </div>
            <div className="ms-3" style={{width:160}}>
              <ButtonPadrao type="submit" onClick={(e) => { e.preventDefault(); formik.handleSubmit(e) }} disable={isDisabled
              }>
                Salvar Avaliação
              </ButtonPadrao>
            </div>
          </div>
        </ButtonGroup>
      </Form>
              
      <ModalConfirmacao
        show={ModalShowConfirm}
        onHide={() => { setModalShowConfirm(false), modalStatus && Router.push(`/teste/editar/${idTest}`) }}
        text={modalStatus ? `Avaliação ${onlineTest ? 'alterada' : 'criada'} com sucesso!` : errorMessage ? errorMessage : `Erro ao criar Avaliação`}
        status={modalStatus}
      />
      <ModalAviso
        show={modalShowQuestion}
        onHide={() => setModalShowQuestion(false)}
        onConfirm={() => { Router.push(`/teste/editar/${idTest}`) }}
        buttonYes={'Sim, Descartar Informações'}
        buttonNo={'Não Descartar Informações'}
        text={`Ao confirmar essa opção todas as informações serão perdidas.`}
      />
      <ModalAviso
        show={modalShowQuestionChange}
        onHide={() => setModalShowQuestionChange(false)}
        onConfirm={() => {  }}
        buttonYes={'Sim, Descartar Informações'}
        buttonNo={'Não Descartar Informações'}
        text={`Ao confirmar essa opção todos os gabaritos serão perdidos.`}
      />
      <ModalAvOnline
        show={modalShowAvOnline}
        onHide={() => {
          setModalShowAvOnline(false);
          setModalShowConfirm(true);
        }}
        idTeste={idTeste}
      />
      <ModalPergunta
        show={modalShowQuestionActive}
        onHide={() => setModalShowQuestionActive(false)}
        onConfirm={() => handleActiveAssessment()}
        buttonNo={onlineTest?.active ? "Não Desativar" : 'Não Ativar'}
        buttonYes={"Sim, Tenho Certeza"}
        text={`Você está ${
          !onlineTest?.active === true
            ? `ativando essa avaliação`
            : `desativando essa avaliação, isso tirará todos os acessos, os dados serão desconsiderados do relatório.`
        } Você pode ${
          onlineTest?.active === true ? "ativar" : "desativar"
        } novamente a qualquer momento.`}
        status={!onlineTest?.active}
        size="lg"
      />
      <ModalConfirmacao
        show={modalShowConfirmQuestion}
        onHide={() => {
          setModalShowConfirmQuestion(false);
          modalStatus && Router.push(`/teste/editar/${idTest}`);
        }}
        text={modalStatus ? `Avaliação ${
          !onlineTest?.active === true ? "ativada" : "desativada"
        } com sucesso!` : `Erro ao ${!onlineTest?.active ? "ativar" : "desativar"}`}
        status={modalStatus}
      />
      <ModalDelete
        show={modalShowDeletePage}
        onHide={() => setModalShowDeletePage(false)}
        onConfirm={() => handleDeletePage()}
        buttonNo={'Não tenho certeza'}
        buttonYes={"Sim. Deletar Página"}
        text={`Atenção! Você está prestes a deletar essa página. Todas as informações nela cadastradas serão perdidas. Tem certeza que deseja continuar?`}
      />
    </>
  )
}