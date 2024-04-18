import { z } from "zod"
import { Container } from "./styles"

interface ISubjectsProps {
  examId: string
  setExamId: (subject: string) => void
  subjects: string[]
}

const subjectSchema = z.enum(['Leitura' , 'Língua Portuguesa' , 'Matemática', ''])

// export const subjects: string[] = ['Leitura' , 'Língua Portuguesa' , 'Matemática']

export function SubjectsFilter({ examId: currentExam, setExamId, subjects }: ISubjectsProps) {
  const examId = subjectSchema.parse(currentExam)

  return (
    <Container>
      <div>
        {subjects?.map((subject, key) => (
          <button
            key={subject ?? key}
            onClick={() => setExamId(subject)}
            className={`${examId === subject && "checked"}`}
          >
            {(subject)}
          </button>
        ))}
      </div>
    </Container>
  )
}