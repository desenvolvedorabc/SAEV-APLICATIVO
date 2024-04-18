import { Box, Container, Title } from "./styledComponents"
import { Bar, BarBox, Nome, Score } from "./styledComponents"

interface IScoreBarRace {
  info: any
  race: string
}

export default function ScoreBarRace({ info, race}: IScoreBarRace) {

  if (!info) return <></>

  const getValue = (edition) => {

    if(race === 'Não Declarado') {
      let findRace = edition?.races?.find(_race => _race?.name === 'Não informada')

      let totalGrade = findRace?.totalGradesStudents
      let totalPresent = findRace?.countPresentStudents

      findRace = edition?.races?.find(_race => _race?.name === 'Não Coletada')
      
      totalGrade += findRace?.totalGradesStudents
      totalPresent += findRace?.countPresentStudents

      return totalPresent > 0 ? Math.round(totalGrade / totalPresent) : 0
    }

    return edition?.races.find(_race => race === _race?.name )?.total_percent
  }

  return (
    <Box>
      <Title>Resultados</Title>
      <div>
        {info.map(edition => (
          <>
            <Container>
              <Nome>
                <span>{edition?.name}</span>
              </Nome>
              <BarBox>
                <Bar width={getValue(edition)}></Bar>
                <Score>{getValue(edition)}%</Score>
              </BarBox>
            </Container>
          </>
        ))}
      </div>
    </Box>
  )
}