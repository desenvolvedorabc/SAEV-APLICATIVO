import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { GridExpandMoreIcon } from "@mui/x-data-grid";
import { Editor } from "src/components/editor";
import Alternative from "../Alternative";
import { useEffect, useState } from 'react';
import { BoxAlternative, ButtonDelete } from "./styledComponents";
import { BiTrash } from "react-icons/bi";

export default function Question({expanded, changeExpanded, question, questionInfo, deleteQuestion, changeQuestion}) {
  
  const [alternatives, setAlternatives] = useState([])
  // const [description, setDescription] = useState('')

  useEffect(() => {
    // setDescription(questionInfo?.description);
    setAlternatives(questionInfo.alternatives)
  },[questionInfo])

  const handleChangeDescription = (value) => {
    if(value != questionInfo.description.trim()){
      // setDescription(value);
      changeQuestion(question, { ...questionInfo, description: value })
    }
  }

  const handleChangeAlternative = (info) => {
    alternatives[info.option.charCodeAt(0) - 65] = info;

    changeQuestion(question, { ...questionInfo, alternatives: alternatives })
  }

  return(
    <Accordion 
      expanded={expanded === question} 
      onChange={() => changeExpanded(question)}
      style={{marginBottom: 20}}
    >
      <AccordionSummary
        expandIcon={<GridExpandMoreIcon />}
        aria-controls="panel1bh-content"
        id="panel1bh-header"
        sx={{
          '.MuiAccordionSummary-content':{
            display: 'flex',
            alignItems: 'center',
          }
        }}
      >
        {expanded !== question &&
          <ButtonDelete type='button' onClick={(e) => {deleteQuestion(question, questionInfo?.id), e.stopPropagation()}}>
            <BiTrash color={"#FF6868"} size={20} />
          </ButtonDelete>
        }
        <div style={{fontWeight: 500}}>
          Questão {questionInfo.order + 1}
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <div>
          <Editor changeText={handleChangeDescription} initialValue={questionInfo?.description} minHeight={"100px"}/>
        </div>
        {alternatives.map((alt, index) => 
          <BoxAlternative key={'question'+ question + 'alt' + index}>
            <Alternative alternative={alt} changeAlternative={handleChangeAlternative} />
          </BoxAlternative>
        )}
      </AccordionDetails>
    </Accordion>
  )
}