import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useEffect, useState } from "react";
import { useBreadcrumbContext } from "src/context/breadcrumb.context";
import { CardStyled, Content, ContentSubjects } from "./styledComponents";
import { darken } from "polished";

type GraphProps = {
  isPdf?: boolean;
  info: any;
  subjects: any;
  type: string;
  year?: string;
  studentName?: string;
};

export function GraphEvolutionaryLine({ isPdf = false, info, subjects= [], type, year, studentName }: GraphProps) {
  const { mapBreadcrumb } = useBreadcrumbContext();
  const [visibleSubjects, setVisibleSubjects] = useState([]);

  const startVisibility = () =>{
    let list = []
    
    subjects?.forEach((subject) => {
      list.push({
        name: subject.name,
        visibility: true
      })
    })
    
    setVisibleSubjects(list)
  }

  const getVisibility = (subject) =>{
    let isVisible = true

    visibleSubjects?.forEach((visibility) => {
      if(visibility.name === subject.name){
        isVisible = visibility.visibility
        return
      }
    })

    return isVisible
  }

  const setVisibility = (subject) =>{
    let list = [...visibleSubjects]

    list.map((visibility) => {
      if(visibility.name === subject.name){
        visibility.visibility = !visibility.visibility
        return
      }
    })
    setVisibleSubjects(list)
  }

  useEffect(() => {
    startVisibility()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjects]);

  function getSubTitle() {
    let subtitle = "";
    if(type === "general")
      mapBreadcrumb.map((x, index) => {
        if (index != 0) subtitle = subtitle.concat(" - ");
        if (x.name) subtitle = subtitle.concat(x?.name);
      });
    else
      if(year && studentName)
        subtitle = `${year} - ${studentName}`

    return subtitle;
  }

  function getParticipacao(subject){
    let list = []
    info?.forEach(item => {
      let findSubject = item?.subjects?.find(x => x.name === subject.name)

      if(findSubject){
        if(type === "general")
          list.push(Number(findSubject.percentageFinished.toFixed(0)))
        else
          list.push(findSubject?.isParticipated ? 100 : 0)
      }
      else
        list.push(0)
    })
    return list
  }

  function getResultado(subject){
    let list = []
    info?.forEach(item => {
      let findSubject = item?.subjects?.find(x => x.name === subject.name)

      if(findSubject){
        if(type === "general")
          list.push(Number(findSubject.percentageRightQuestions.toFixed(0)))
        else
          list.push(findSubject?.totalRightQuestions ? findSubject.totalRightQuestions : 0)
      }
      else
        list.push(0)
    })
    return list
  }

  function getSeries(){
    let list = []
    subjects.map(subject =>{
      list.push(
        {
          name: `Participação <br /> ${subject.name}`,
          data: getParticipacao(subject),
          color: subject.color,
          visible: getVisibility(subject),
          // pointPadding: 0.13,
          // pointPlacement: -0.02,
        },
      )  
      list.push(
        {
          name: `Resultado <br /> ${subject.name}`,
          data: getResultado(subject),
          color: subject.color ? darken(0.2, subject.color) : "#000000",
          visible: getVisibility(subject),
          // pointPadding: 0,
          // pointPlacement: 0.1,
        },
      )
    })
    return list
  }

  const options = {
    chart: {
      type: "column",
      style: {
        fontFamily: "Inter",
        fontWeight: "600",
      },
    },

    tooltip: {
      shared: true,
      useHTML: true,
      headerFormat: '<table><tr><th colspan="2">{point.key}</th></tr>',
      pointFormat:
        '<tr><td style="color: {series.color}">{series.name} </td>' +
        '<td style="text-align: right"><b>{point.y} %</b></td></tr>',
      footerFormat: "</table>",
      valueDecimals: 2,
    },
    plotOptions: {
      column: {
        grouping: true,
        shadow: false,
        borderWidth: 0,
        groupPadding: 0.03,
      },
      series: {
        groupPadding: 0,
        events: {
          legendItemClick: function () {
            return false;
          },
        },
      },
    },
    yAxis: [
      {
        min: 0,
        max:100,
        title: {
          text: "",
        },
      },
      {
        title: {
          text: "",
        },
        opposite: true,
        linkedTo: 0,
      }
    ],
    legend: {
      squareSymbol: true,
      symbolHeight: 12,
      symbolRadius: 0,
    },
    title: {
      text: getSubTitle(),
    },
    xAxis: {
      categories: info?.map(x => x.name),
      crosshair: true,
    },
    series: 
    getSeries()
  };

  return (
    <CardStyled>
      <header>
        <div className="d-flex">
          <h3>Visão Geral Linha Evolutiva</h3>
        </div>

        {!isPdf && (
          <ContentSubjects>
            <p>EXIBIR: </p>
            {subjects.map((subject) =>(
              <label htmlFor={subject.id} key={subject.id}>
                <input
                  type="checkbox"
                  id={subject.id}
                  checked={getVisibility(subject)}
                  onClick={() => setVisibility(subject)}
                />
                {subject.name}
              </label>

            ))}
          </ContentSubjects>
        )}
      </header>
      <Content>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </Content>
    </CardStyled>
  );
}
