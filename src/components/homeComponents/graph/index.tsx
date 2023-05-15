import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { darken } from "polished";
import { CardStyled, Loading } from "./styledComponents";

export default function Graph({ listEdicoes, subjects }) {
  const data = new Date()

  const getSeries = () => {
    let list = [];
    subjects.forEach((subject) => {
      let dataAuxResultado = [];
      let dataAuxParticipacao = [];

      listEdicoes.forEach((edition) => {

        let findEdition = edition?.subjects?.find(editionSubject => editionSubject.id === subject.id)

        if(findEdition){
          dataAuxResultado.push([findEdition.percentageRightQuestions]);
          dataAuxParticipacao.push([findEdition.percentageFinished]);
        }
        else{
          dataAuxResultado.push([0]);
          dataAuxParticipacao.push([0]);
        }
      });

      list.push(
        {
          name: `Participação ${subject.name}`,
          type: "column",
          stack: 1,
          data: dataAuxParticipacao,
          color: subject.color,
          // pointPadding: 0.13,
          // pointPlacement: -0.02,
        },
        {
          name: `Resultado ${subject.name}`,
          type: "column",
          stack: 1,
          data: dataAuxResultado,
          // pointPadding: 0,
          color: subject.color ? darken(0.2, subject.color) : "#000000",
          zIndex: 10,
        }
      );
    });
    return list;
  };

  const options = {
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
      },
    },
    title: {
      text: `Resultados - ${data.getFullYear()} - 2º Ano Ensino Fundamental`,
    },
    xAxis: {
      categories: listEdicoes?.map((x) => x.name),
      crosshair: true,
    },
    yAxis: {
      // Primary yAxis
      min: 0,
      title: {
        text: " ",
      },
      labels: {
        format: "{text} %",
      },
    },
    series: getSeries(),
  };

  return (
    <CardStyled>
      <div className="d-flex">
        <h3>Linha Evolutiva Por Edição</h3>
      </div>
      <HighchartsReact highcharts={Highcharts} options={options} />
      {/* <Loading /> */}
    </CardStyled>
  );
}
