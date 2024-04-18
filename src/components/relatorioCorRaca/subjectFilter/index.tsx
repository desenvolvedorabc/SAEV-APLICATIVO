import { Container } from "./styles"

interface ISubjectsProps {
  examId: string
  setExamId: (subject: string) => void
  subjects: string[]
}

export function SubjectsFilter({ examId, setExamId, subjects }: ISubjectsProps) {
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