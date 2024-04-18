import { TextField } from "@mui/material";
import { 
  ButtonAddTopico, 
  ButtonDelete, 
  Card, 
  File, 
  FileText, 
  InputGroup, 
  Line, 
  Page 
} from "./styledComponents";
import { useState, useEffect } from 'react';
import InputFile from "src/components/InputFile";
import { MdControlPoint } from "react-icons/md";
import Question from "../Question";
import { updateAssessmentOnlineImage } from "src/services/avaliacao-online";
import { BiTrash } from "react-icons/bi";
import ModalConfirmacao from "src/components/modalConfirmacao";
import ModalLoading from "src/components/modalLoading";

export default function QuestionPage({ pageInfo, changePage, deletePage, addQuestion, removeQuestion, idsDelete }) {
  const [expanded, setExpanded] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [title, setTitle] = useState(pageInfo?.title);
  const [fileName, setFileName] = useState(pageInfo?.image ? pageInfo.image : '');
  const [file, setFile] = useState(null);
  const [modalStatus, setModalStatus] = useState(true)
  const [errorMessage, setErrorMessage] = useState('Erro ao criar Teste')
  const [ModalShowConfirm, setModalShowConfirm] = useState(false)
  const [ModalShowErrorImage, setModalShowErrorImage] = useState(false)
  const [loadingImage, setLoadingImage] = useState(false)
  const [errorMessageImage, setErrorMessageImage] = useState('Erro ao selecionar imagem')
  const [resetImageInput, setResetImageInput] = useState(false)
    
  useEffect(() => {
    setTitle(pageInfo?.title);
    setQuestions(pageInfo?.questions ? pageInfo?.questions : []);
    setFileName(pageInfo?.image ? pageInfo?.image : '');
    setFile(null)
  },[pageInfo])

  const handleChangeExpanded = (question) => {
    if(question === expanded){
      setExpanded(null);
    }
    else{
      setExpanded(question)
    }
  }

  const handleAddQuestion= () => {
    addQuestion(pageInfo.order)
  }

  const handleDeleteQuestion= async (questionNumber, questionId) => {
    if(questionId){
      idsDelete(questionId)
      // const resp = await deleteAssessmentOnlineQuestion(questionId)
      // if(resp.message){
      //   setModalStatus(false)
      //   setModalShowConfirm(true)
      //   setErrorMessage(resp.message || 'Erro ao deletar questão')
      // }
      // else{
      //   removeQuestion(pageInfo.order, questionNumber)
      // }
    }
    removeQuestion(pageInfo.order, questionNumber)
    
  }

  const handleChangeTitle = (e) => {
    setTitle(e.target.value)
    
    changePage(pageInfo.order, {...pageInfo, title: e.target.value});
  }

  const handleChangeFile = async (e) => {
    const data = new FormData();

    data.append('file', e.target.value)
    data.append('image', fileName)
    setLoadingImage(true)

    const resp = await updateAssessmentOnlineImage(data);

    if (resp.message) {
      if(resp.message === "Invalid file type"){
        setErrorMessageImage('Arquivo com tipo invalido');
      } else{
        setErrorMessageImage(resp.message);
      }
      setResetImageInput(!resetImageInput)
      setModalShowErrorImage(true)
      setFileName(fileName)
      setFile(file)
    } else {
      setFileName(resp.imageUrl)
      setFile(e.target.value)
      
      changePage(pageInfo.order, {...pageInfo, image: resp.imageUrl});
    }
    setLoadingImage(false)

  };

  const handleChangeQuestion= (questionNumber, info) => {
    questions[questionNumber] = info;

    changePage(pageInfo.order, {...pageInfo, questions: questions});
  };

  const handleModalLimitSize = () => {
    setErrorMessageImage('Imagem muito pesada')
    setModalShowErrorImage(true)
  }

  return(
    <>
      <div style={{display:'flex', alignItems: 'center', marginBottom:30}}>
        <div style={{display:'flex', borderRadius: '8px', border: '1px solid rgba(213, 213, 213, 0.84)', padding: '8px 0', marginRight: 16 }}>
          <ButtonDelete type="button" onClick={() => deletePage(true)}><BiTrash color={'#FF6868'} size={20}/></ButtonDelete>
          <Page>Página {pageInfo?.order + 1}</Page>
        </div>
        <Line/>
      </div>
      <Card>
        <InputGroup>
          <div>
            <TextField
              fullWidth
              label="Título"
              name="title"
              id="title"
              value={title}
              onChange={handleChangeTitle}
              size="small"
            />
          </div>
          <File>
            <FileText>Possui Imagem Suporte? </FileText>
            <div style={{width: '100%', marginTop: '-2px'}}>
              <InputFile label="Upload da Imagem" onChange={handleChangeFile} error={fileName} acceptFile={".png"} value={file} initialValue={fileName} limitSize={1048576} errorLimitSize={handleModalLimitSize} reset={resetImageInput}/>
            </div>
          </File>
        </InputGroup>
      </Card>

      <div style={{fontWeight: 700, marginBottom: 20}}>
        Questões
      </div>
      {questions?.map((question, index) => 
        <Question
          key={'page' + pageInfo.order + 'question' + index}
          expanded={expanded}
          changeExpanded={handleChangeExpanded} 
          question={index} 
          questionInfo={question}
          deleteQuestion={handleDeleteQuestion}
          changeQuestion={handleChangeQuestion}
        />
      )}
      <ButtonAddTopico type="button" onClick={handleAddQuestion}>
        <MdControlPoint color={"#3E8277"} size={39} />
      </ButtonAddTopico>
      <ModalConfirmacao
        show={ModalShowConfirm}
        onHide={() => { setModalShowConfirm(false) }}
        text={modalStatus ? `` : errorMessage ? errorMessage : `Erro ao deletar questão`}
        status={modalStatus}
      />
      <ModalLoading 
        show={loadingImage}
      />
      <ModalConfirmacao
        show={ModalShowErrorImage}
        onHide={() => { setModalShowErrorImage(false) }}
        text={errorMessageImage}
        status={false}
      />
    </>
  )
}