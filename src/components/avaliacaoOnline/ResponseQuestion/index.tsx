import { useEffect, useState } from "react";
import { AlternativeImage, BoxAlternative, BoxQuestion, BoxStatement, ImageBox, Option, QuestionDescription, QuestionImage, QuestionNumber, Text } from "./styledComponents";
import { Radio, RadioGroup } from "@mui/material";


export default function ResponseQuestion({page, question, changeQuestion, url}) {
  const [auxQuestion, setAuxQuestion] = useState(question)
  const [answer, setAnswer] = useState(question?.answer ? question.answer : '')

  useEffect(() => {
    setAuxQuestion(question)
    setAnswer(question?.answer);
  }, [question, question?.answer])

  const handleChooseAlternative = (option) => {
    setAnswer(option);
    changeQuestion(option)
  }

  return(
    <>
      <BoxQuestion>
        <div>
          <QuestionNumber>Questão {auxQuestion?.question?.order + 1}</QuestionNumber>
          <BoxStatement>
            <div style={{fontWeight: 600, width: '100%', marginBottom: 16}}>{page?.title}</div>
            {page?.image &&
              <ImageBox>
                <QuestionImage src={`${url}/assessment-online/images/${page?.image}`} />
              </ImageBox>
            }
            <QuestionDescription dangerouslySetInnerHTML={{ __html: auxQuestion?.question?.description }} />
          </BoxStatement>
          <div>
            <RadioGroup
              defaultValue={answer}
              value={answer}
              onChange={(e) => handleChooseAlternative(e.target.value)}
              aria-labelledby="demo-customized-radios"
              name="customized-radios"
              >
              {auxQuestion?.question?.alternatives.map((alternative) => 
                <BoxAlternative key={alternative?.option} value={alternative?.option} control={
                  <Radio
                    checkedIcon={
                      <Option checked={true}>
                        {alternative?.option}
                      </Option>
                      }
                    icon={
                      <Option checked={false}>
                        {alternative?.option}
                      </Option>
                    }
                  />}
                  label={alternative?.description ? 
                    <Text>{alternative?.description}</Text>
                    :
                    <AlternativeImage src={`${url}/assessment-online/images/${alternative?.image}`} />
                  }
                />
              )}
            </RadioGroup>
          </div>
        </div>
      </BoxQuestion>
    </>
  )
}