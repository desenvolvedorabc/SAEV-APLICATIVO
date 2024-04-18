import HighchartsReact from "highcharts-react-official"
import Highcharts, { Options as HighchartsOptions } from "highcharts"
import { Container } from "./styles";
import { reasons } from "pages/relatorio-nao-avaliados";
import { ExportItem } from "src/services/relatorio-nao-avaliados.service";

interface IGraphNaoAvaliadosProps {
  visible: boolean
  level: string
  notEvaluated: ExportItem
  notEvaluatedStudents: any
  isPDF?: boolean
}

export function GraphNaoAvaliados(props: IGraphNaoAvaliadosProps) {
  let graph
  let total  

  if (props.level === 'Estudantes') {
    graph = props.notEvaluatedStudents?.dataGraph
    total = graph?.total_enturmados
  } else {
    graph = props.notEvaluated?.dataGraph ? props.notEvaluated?.dataGraph : null
    total = props.notEvaluated?.items ? props.notEvaluated?.dataGraph?.total_enturmados : null
  }

  const options: HighchartsOptions = {
    chart: {
      type: "column",
      style: {
        fontFamily: "Inter",
        fontWeight: "600"
      },
      width: props.isPDF ? 1000 : null,
    },
    tooltip: {
      shared: false,
      useHTML: true,
      headerFormat: '<table>',
      pointFormat:
        '<tr><td style="color: {series.color}">{series.name}:&nbsp;</td>' +
        '<td style="text-align: right"><b>{point.y}</b></td></tr>',
      footerFormat: "</table>",
      valueDecimals: 0,
    },
    plotOptions: {
      column: {
        grouping: true,
        shadow: false,
        borderWidth: 0,
        groupPadding: 0.03,
      },
      series: {
        dataLabels: {
          enabled: true
        },
        events: {
          legendItemClick: function () {
            return false;
          },
        },
      },
    },
    yAxis: [
      {
        gridLineDashStyle: "LongDash",
        gridLineWidth: 1.5,
        startOnTick: false,
        showFirstLabel: false,
        title: {
          text: "Total de Não Avaliados",
          margin: 50
        },
        stackLabels: {
          enabled: true,
          verticalAlign: 'top',
        }
      }
    ],
    legend: {
      enabled: false,
      // itemDistance: 30
    },
    xAxis: {
      max: 5,
      categories: reasons?.map(reason => reason.label),
      visible: true,
      crosshair: true,
      title: {
        text: '',
        // text: 'Justificativas',
        align: 'low',
        reserveSpace: true
      }
    },
    title: {
      text: ""
    },
    series: [ 
      {
        data: [
          {
            name: "Recusou-se a participar",
            y: graph?.recusa || 0,
            color: "#11312B",
          }, 
          {
            name: "Faltou, mas está frequentando a escola",
            y: graph?.ausencia || 0,
            color: "#2D9B82",
          }, {
            name: "Abandonou a escola",
            y: graph?.abandono || 0,
            color: "#51D0B2",
          }, {
            name: "Foi transferido para outra escola",
            y: graph?.transferencia || 0,
            color: "#5A9BD5",
          },
          {
            name: "Motivos de deficiência",
            y: graph?.deficiencia || 0,
            color: "#9DC3E7",
          },
          {
            name: "Não participou",
            y: graph?.nao_participou || 0,
            color: "#BFBFBF",
          }
        ],
      name: "Total",
      type: "column"
    }]}
      // {
      //   type: 'column',
      //   data: [{y: graph?.recusa || 0, x:0}],
      //   name: "Recusou-se a participar",
      //   color: "#11312B",
      // },
      // {
      //   type: 'column',
      //   data: [{y:graph?.ausencia || 0, x:1}],
      //   name: "Faltou, mas está frequentando a escola",
      //   color: "#2D9B82",
      // },
      // {
      //   type: 'column',
      //   data: [{y: graph?.abandono || 0, x: 2}],
      //   name: "Abandonou a escola",
      //   color: "#51D0B2",
      // },
      // {
      //   type: 'column',
      //   data: [{y: graph?.transferencia || 0, x: 3}],
      //   name: "Foi transferido para outra escola",
      //   color: "#5A9BD5",
      // },
      // {
      //   type: 'column',
      //   data: [{y: graph?.deficiencia || 0, x: 4}],
      //   name: "Motivos de deficiência",
      //   color: "#9DC3E7",
      // },
      // {
      //   type: 'column',
      //   data: [{y: graph?.nao_participou || 0, x: 5}],
      //   name: "Não participou",
      //   color: "#BFBFBF",
      // },
  

  if (props.visible && graph && total) {
    return (
      <Container>
        <header>
          <h3><strong>Quantidade de Não Avaliados</strong></h3>
          <h4>Total de alunos enturmados: <strong>{total || 0}</strong></h4>
        </header>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </Container>
    )
  } else {
    return <></>
  }

}