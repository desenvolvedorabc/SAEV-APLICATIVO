import Highcharts, { Options as HighchartsOptions, SeriesSunburstDataLabelsOptionsObject } from "highcharts"
import HighchartsReact from "highcharts-react-official";
import { useBreadcrumbContext } from "src/context/breadcrumb.context";
import { IReportAbsenceProps } from "src/services/relatorio-infrequencia.service";
import { Container } from "./styles";

interface IGraphReportInfrequenciaProps {
  absences: IReportAbsenceProps
  isVisible?: boolean
  isPdf?: boolean
}

const GraphColors = {
  yellow: '#F9C462',
  gray: '#CCC5A8'
}

const months = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"]

export function GraphReportInfrequencia({
  absences,
  isVisible,
  isPdf
}: IGraphReportInfrequenciaProps) {
  const { mapBreadcrumb } = useBreadcrumbContext()

  function getSubTitle(): string {
    const year = mapBreadcrumb.find((data) => data.level === "year")
    const county = mapBreadcrumb.find((data) => data.level === "county")
    const school = mapBreadcrumb.find((data) => data.level === "school")
    const serie = mapBreadcrumb.find((data) => data.level === "serie")
    const schoolClass = mapBreadcrumb.find(
      (data) => data.level === "schoolClass"
    )

    return `${year?.name || ""} - ${county?.name || ""} - ${school?.name || ""} - ${serie?.name || ""} - ${schoolClass?.name || ""}`
  }

  function getTotalData(): SeriesSunburstDataLabelsOptionsObject[] {
    let data: SeriesSunburstDataLabelsOptionsObject[] = []

    absences?.graph?.months.map((currentMonth, index) => {
      data.push({
        color: (index + 1)%2 ? GraphColors.yellow : GraphColors.gray,
        y: currentMonth.total
      })
    })

    return data
  }

  function getSeries(): any {
    let list = [
      {
        type: "column",
        name: "Faltas",
        data: getTotalData(),
        visible: true
      },
    ]

    return list
  }


  function getBiggestNumber(): number {
    let max: number

    absences?.graph?.months.forEach((month) => {
      if (!max) {
        max = month.total
      } else {
        if (max < month.total) {
          max = month.total
        }
      }
    })

    return max
  }

  const options: HighchartsOptions = {
    chart: {
      type: "column",
      style: {
        fontFamily: "Inter",
        fontWeight: "600"
      },
      width: isPdf ? 1000 : null,
    },
    tooltip: {
      shared: true,
      useHTML: true,
      headerFormat: '<table><tr><th colspan="2">{point.key}</th></tr>',
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
        max: getBiggestNumber() + 50,
        gridLineDashStyle: "LongDash",
        gridLineWidth: 1.5,
        startOnTick: false,
        showFirstLabel: false,
        title: {
          text: "Total de faltas",
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
    },
    xAxis: {
      categories: 
        absences ? absences?.graph?.months.map((currentMonth) => `${months[currentMonth.month - 1]}`) : [''],
      crosshair: true,
      title: {
        text: '',
        // text: 'Meses',
        align: 'low',
        reserveSpace: true
      }
    },
    title: {
      text: ""
    },
    series: getSeries()
  }

  if (isVisible) {
    return (
      <Container>
        <header>
          <h3>Quantidade de Faltas</h3>
          <h4>Nº de Enturmados: <strong>{absences?.graph?.total_grouped}</strong></h4>
        </header>
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
        />
      </Container>
    )
  } else {
    return <></>
  }

}
