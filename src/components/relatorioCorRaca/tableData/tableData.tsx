import { ScrollArea } from "@radix-ui/react-scroll-area"

import { Box, Paper, Table, TableBody, TableContainer, TableHead, TableRow } from "@mui/material"
import { Container, Header, TableCellBorder, TableCellStyled, TableRowStyled, TableRowStyledVar, Title } from "./styles"
import { Race, SubjectProps } from "src/services/report-race.service";
import { useEffect, useState } from "react";

interface EnhancedTableProps {
  races: Race[];
}

function EnhancedTableHead(props: EnhancedTableProps) {

  const headers = [
    {
      id: "avaliacoes",
      status: true,
      label: "Avaliações",
    },
    {
      id: "geral",
      status: true,
      label: "Geral",
    },
  ]

  let headCells = [];

  headers.forEach((header) => {
    headCells.push({
      id: header.id,
      status: header.status,
      label: header.label,
    });
  })

  for (const race of props.races.filter(rac => rac.name !== 'Não informada').filter(rac => rac.name !== 'Não Coletada')) {
    headCells.push({
      id: race.id,
      status: true,
      label: race.name
    })
  }

  headCells.push({
    id: 'nao_declarado',
    status: true,
    label: 'Não Declarado'
  })

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCellStyled
            key={headCell.id}
            align={headCell.status ? "center" : "left"}
            padding={"normal"}
          >
            <strong>
              {headCell.label}
            </strong>
          </TableCellStyled>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface ITableDataProps {
  reportRace: SubjectProps
  serieNumber: number;
  exam: string;
}

export function TableData({ reportRace, serieNumber, exam }: ITableDataProps) {
  const [listRaces, setListRaces] = useState([])

  const getRaces = () => {
    let races = []
    if(reportRace?.items[0]){
      races = reportRace?.items[0]?.races?.map(race => {
        return {name: race.name, id: race.id}
      });
    }

    setListRaces(races);
  }

  useEffect(() => {
    if(reportRace?.items) {
      getRaces();      
    }
  }, [reportRace])

  if (!reportRace.items || !reportRace.items[0]?.races) return <></>
  
  function getVariation(race?: string): number {
    const editions = reportRace.items

    const firstEdition = editions[0]
    const lastEdition = editions[reportRace.items.length - 1]

    if (firstEdition.id === lastEdition.id) return 0

    if (!race) {      
      return firstEdition.total_percent - lastEdition.total_percent
    }

    if (race === 'Não Declarado') {
      let totalGradeFirst = 0
      let totalPresentFirst = 0
      let totalGradeLast = 0
      let totalPresentLast = 0

      if(exam === 'Leitura') {
        const firstDataByFirstEdition = firstEdition.races.find(currentRace => currentRace.name === 'Não informada')

        switch (serieNumber) {
          case 1:
            totalGradeFirst +=
              (firstDataByFirstEdition.fluente + firstDataByFirstEdition.nao_fluente + firstDataByFirstEdition.frases);
            break;
          case 2:
          case 3:
            totalGradeFirst += (firstDataByFirstEdition.fluente + firstDataByFirstEdition.nao_fluente);
            break;
          default:
            totalGradeFirst += (firstDataByFirstEdition.fluente);
            break;
        }
        
        totalPresentFirst += firstDataByFirstEdition?.countPresentStudents
  
        const lastDataByFirstEdition = firstEdition.races.find(currentRace => currentRace.name === 'Não Coletada')

        switch (serieNumber) {
          case 1:
            totalGradeFirst +=
              (lastDataByFirstEdition.fluente + lastDataByFirstEdition.nao_fluente + lastDataByFirstEdition.frases);
            break;
          case 2:
          case 3:
            totalGradeFirst += (lastDataByFirstEdition.fluente + lastDataByFirstEdition.nao_fluente);
            break;
          default:
            totalGradeFirst += (lastDataByFirstEdition.fluente);
            break;
        }

        totalPresentFirst += lastDataByFirstEdition?.countPresentStudents
  
        const firstDataByLastEdition = lastEdition.races.find(currentRace => currentRace.name === 'Não informada')

        switch (serieNumber) {
          case 1:
            totalGradeLast +=
              (firstDataByLastEdition.fluente + firstDataByLastEdition.nao_fluente + firstDataByLastEdition.frases);
            break;
          case 2:
          case 3:
            totalGradeLast += (firstDataByLastEdition.fluente + firstDataByLastEdition.nao_fluente);
            break;
          default:
            totalGradeLast += (firstDataByLastEdition.fluente);
            break;
        }
        
        totalPresentLast += firstDataByLastEdition?.countPresentStudents
  
        const lastDataByLastEdition = lastEdition.races.find(currentRace => currentRace.name === 'Não Coletada')

        switch (serieNumber) {
          case 1:
            totalGradeLast +=
              (lastDataByLastEdition.fluente + lastDataByLastEdition.nao_fluente + lastDataByLastEdition.frases);
            break;
          case 2:
          case 3:
            totalGradeLast += (lastDataByLastEdition.fluente + lastDataByLastEdition.nao_fluente);
            break;
          default:
            totalGradeLast += (lastDataByLastEdition.fluente);
            break;
        }
  
        totalPresentLast += lastDataByLastEdition?.countPresentStudents
  
        const firstNumber = totalPresentFirst ? Math.round(totalGradeFirst / totalPresentFirst * 100) : 0
  
        const secondNumber = totalPresentLast ? Math.round(totalGradeLast / totalPresentLast * 100) : 0
  
        return firstNumber - secondNumber
      } else {

        const firstDataByFirstEdition = firstEdition.races.find(currentRace => currentRace.name === 'Não informada')
  
        totalGradeFirst += firstDataByFirstEdition?.totalGradesStudents
        totalPresentFirst += firstDataByFirstEdition?.countPresentStudents
  
        const lastDataByFirstEdition = firstEdition.races.find(currentRace => currentRace.name === 'Não Coletada')
  
        totalGradeFirst += lastDataByFirstEdition?.totalGradesStudents
        totalPresentFirst += lastDataByFirstEdition?.countPresentStudents
        
  
        const firstDataByLastEdition = lastEdition.races.find(currentRace => currentRace.name === 'Não informada')
        
        totalGradeLast += firstDataByLastEdition?.totalGradesStudents
        totalPresentLast += firstDataByLastEdition?.countPresentStudents
  
        const lastDataByLastEdition = lastEdition.races.find(currentRace => currentRace.name === 'Não Coletada')
  
        totalGradeLast += lastDataByLastEdition?.totalGradesStudents
        totalPresentLast += lastDataByLastEdition?.countPresentStudents
  
        const firstNumber = totalPresentFirst ? Math.round(totalGradeFirst / totalPresentFirst) : 0
  
        const secondNumber = totalPresentLast ? Math.round(totalGradeLast / totalPresentLast) : 0
  
        return firstNumber - secondNumber
      }
    }

    const firstNumber = firstEdition.races.find(currentRace => currentRace.name === race)
    const secondNumber = lastEdition.races.find(currentRace => currentRace.name === race)

    return firstNumber.total_percent - secondNumber.total_percent
  }
  
  return (
    <div style={{ backgroundColor: '#fff', paddingTop: 16 }}>
      <Container>
        <Box sx={{ width: "100%" }}>
          <Header>
            <Title>Resultados</Title>
          </Header>
          <Paper
            sx={{
              width: "100%",
              pt: 3,
              pb: 0,
              borderRadius: 0
            }}
          >
            <TableContainer>
            <ScrollArea
              style={{ width: '100%', maxHeight: 350 }}
            >
              <Table
                aria-labelledby="tableTitle"
                size={"medium"}
              >
                  <EnhancedTableHead races={listRaces} />
                  <TableBody>
                    {
                      reportRace.items.map(row => {
                        let result = 0
                        let totalGrade = 0
                        let totalPresent = 0
                        
                        row.races.map(race => {
                          if (race.name === 'Não informada' || race.name === 'Não Coletada'){ 
                            if(exam === 'Leitura'){
                              switch (serieNumber) {
                                case 1:
                                  totalGrade +=
                                    (race.fluente + race.nao_fluente + race.frases);
                                  break;
                                case 2:
                                case 3:
                                  totalGrade += (race.fluente + race.nao_fluente);
                                  break;
                                default:
                                  totalGrade += (race.fluente);
                                  break;
                              }
                              totalPresent += race.countPresentStudents
                              result = Math.round(totalGrade / totalPresent * 100)
                            } else{
                              totalGrade += race.totalGradesStudents
                              totalPresent += race.countPresentStudents
                              result = Math.round(totalGrade / totalPresent)
                            }
                          }
                        })                      

                        return (
                          <TableRowStyled
                            key={row.id}
                            role="checkbox"
                            tabIndex={-1}
                          >
                            <TableCellBorder>
                              <span><strong>{row.name}</strong></span>
                            </TableCellBorder>
                            <TableCellBorder>
                              <span>{row.total_percent || 0}%</span>
                            </TableCellBorder>
                            {
                              listRaces.map(race => {
                                if (race.name === 'Não informada' || race.name === 'Não Coletada') return <></>

                                return (
                                  <TableCellBorder key={race?.id}>
                                    <span>{row?.races?.find(_race => _race?.name === race?.name)?.total_percent}%</span>
                                  </TableCellBorder>
                                )
                              })
                            }
                            <TableCellBorder>
                              <span>{totalPresent > 0 ? result : 0}%</span>
                            </TableCellBorder>
                          </TableRowStyled>
                        )
                      })
                    }
                    <div style={{ height: 20 }}>

                    </div>
                    <TableRowStyledVar>
                      <TableCellBorder>
                        <span><strong>Variação</strong></span>
                      </TableCellBorder>
                      <TableCellBorder>
                        <span>{getVariation()} p.p</span>
                      </TableCellBorder>
                      {
                        listRaces.map(race => {
                          if (race.name === 'Não informada' || race.name === 'Não Coletada') return <></>

                          return (
                            <TableCellBorder key={race.id}>
                              <span>{getVariation(race.name)} p.p</span>
                            </TableCellBorder>
                          )
                        })
                      }
                      <TableCellBorder>
                        <span>{getVariation('Não Declarado')} p.p</span>
                      </TableCellBorder>
                    </TableRowStyledVar>                     
                  </TableBody>
              </Table>
              </ScrollArea>
            </TableContainer>
          </Paper>
        </Box>
      </Container>
    </div>
  )
}