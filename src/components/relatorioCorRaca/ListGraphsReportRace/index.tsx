import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { MdExpandMore } from "react-icons/md"
import { TitleAccordion } from "./styledComponents";
import { GraphReportRace } from "../GraphReportRace";
import { useEffect, useState } from "react";
import ScoreBarRace from "../ScoreBarRace";

interface IListGraphsReportRaceProps {
  reportRace: any
  exam: string
  isPDF?: boolean
}

export default function ListGraphsReportRace({ reportRace, exam, isPDF = false }: IListGraphsReportRaceProps) {

  const [listRaces, setListRaces] = useState([])

  const getRaces = () => {
    const races = [];

    reportRace?.items[0]?.races?.forEach(race => races.push(race.name));

    setListRaces(races);
  }

  useEffect(() => {
    if(reportRace?.items) {
      getRaces();
    }
  }, [reportRace])

  const getTotalByRace = (race) => {
    if(reportRace?.items?.length > 0){

      let total = 0

      reportRace?.items[0]?.races?.forEach(_race => {
        total += _race.total
      });


      if(race === 'Não Declarado') {
        let totalNot = 0
        let findRace = reportRace?.items[0]?.races?.find(_race => _race.name === "Não informada")

        totalNot = findRace?.total

        findRace = reportRace?.items[0]?.races?.find(_race => _race.name === "Não Coletada")

        totalNot += findRace?.total
  
        let percent = '0'
    
        if(total !==  0) {
          percent = (totalNot / total * 100).toFixed(2)
        }
    
        return `(${totalNot} alunos - ${percent}% do total)`
      }
      else {
        const findRace = reportRace?.items[0]?.races?.find(_race => _race.name === race)
  
        let percent = '0'
    
        if(total !==  0) {
          percent = (findRace?.total / total * 100).toFixed(2)
        }
    
        return `(${findRace?.total} alunos - ${percent}% do total)`
      }      
    }

    return `(0 alunos - 0% do total)`
  }

  return (
    reportRace?.items &&
    <div>
      {
        listRaces?.map(race => (
          race !== "Não informada" && race !== "Não Coletada" &&
          <Accordion key={race} style={{marginBottom: '15px'}} defaultExpanded={isPDF}>
              <AccordionSummary
                expandIcon={<MdExpandMore color={'#3E8277'} size={32}/>}
                aria-controls="graph1"
                id="header-graph1"
              >
                <TitleAccordion><strong>{race.toUpperCase()}</strong><div> - {getTotalByRace(race)}</div></TitleAccordion>
              </AccordionSummary>
              <AccordionDetails>
                {exam === 'Leitura' ? 
                  <GraphReportRace info={reportRace?.items} race={race} isPdf={isPDF} />
                :
                  <ScoreBarRace info={reportRace?.items}  race={race}/>
                }
              </AccordionDetails>
            </Accordion>
        ))
      }
        <Accordion key={'Não Declarado'} style={{marginBottom: '15px'}} defaultExpanded={isPDF}>
          <AccordionSummary
            expandIcon={<MdExpandMore color={'#3E8277'} size={32}/>}
            aria-controls="graph1"
            id="header-graph1"
          >
            <TitleAccordion><strong>{'Não Declarado'.toUpperCase()}</strong><div> - {getTotalByRace('Não Declarado')}</div></TitleAccordion>
          </AccordionSummary>
          <AccordionDetails>
            {exam === 'Leitura' ? 
              <GraphReportRace info={reportRace?.items} race={'Não Declarado'} isPdf={isPDF} />
            :
              <ScoreBarRace info={reportRace?.items}  race={'Não Declarado'}/>
            }
          </AccordionDetails>
        </Accordion>
    </div>
  )

}