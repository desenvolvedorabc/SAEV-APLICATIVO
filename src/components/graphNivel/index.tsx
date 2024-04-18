import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import * as S from "./styles";

import { useBreadcrumbContext } from "src/context/breadcrumb.context";

const levels = {
  edition: "Edições",
  county: "Municípios",
  school: "Escolas",
  schoolClass: "Turmas",
  student: "Alunos",
};

export function GraphNivel({ list, level }) {
  const { mapBreadcrumb } = useBreadcrumbContext();

  function getLevel() {
    return levels[level];
  }

  function getSubTitle() {
    let subtitle = "";

    mapBreadcrumb.map((x, index) => {
      if (x.level === "edition" || x.level === "year" || x.level === "county") {
        if (index != 0) subtitle = subtitle.concat(" - ");
        if (x.name) subtitle = subtitle.concat(x?.name);
      }
    });

    return subtitle;
  }

  const options = {
    chart: {
      type: "column",
      style: {
        fontFamily: "Inter",
        fontWeight: "600",
      },
      skipKeyboardNavigation: false,
    },
    plotOptions: {
      series: {
        showInLegend: true,
        skipKeyboardNavigation: false,
        dataLabels: {
          enabled: true,
        },
        states: {
          inactive: {
            opacity: 1,
          },
        },
      },
      column: {
        groupPadding: 0.28,
        pointWidth: 73,
        grouping: true,
        shadow: false,
      },
    },
    legend: {
      itemWidth: 150,
      squareSymbol: true,
      symbolHeight: 12,
      symbolRadius: 0,
      enabled: true,
    },
    tooltip: {
      enabled: false,
    },
    title: {
      text: `Nível ${getLevel()} (${list?.TOTAL_STUDENTS?.TOTAL})`,
    },
    subtitle: {
      text: `${getSubTitle()}`,
    },
    xAxis: {
      visible: false,
      scrollbar: {
        enabled: true,
      },
    },
    yAxis: {
      visible: false,
      // gridLineDashStyle: "longdash",
      // gridLineWidth: 1.5,
      // startOnTick: false,
      // showFirstLabel: false,
      // max: 3000,
      // title: {
      //   text: "Qtd Estudantes",
      // },
      // tickPositions: [100, 250, 500, 1000, 1500, 2000, 2500, 3000]
    },
    series: [
      {
        // data: [`${list?.maxPer}% (${list?.maxValue})`],
        data: [list?.TOTAL_STUDENTS?.FOUR],
        name: "Maior <br/> Desempenho",
        color: "#3E8277",
      },
      {
        data: [list?.TOTAL_STUDENTS?.TREE],
        name: "Desempenho <br/> Mediano",
        color: "#5EC2B1",
      },
      {
        data: [list?.TOTAL_STUDENTS?.TWO],
        name: "Desempenho <br/> Abaixo da Média",
        color: "#FAA036",
      },
      {
        data: [list?.TOTAL_STUDENTS?.ONE],
        name: "Menor <br/> Desempenho",
        color: "#FF6868",
      },
    ],
  };

  return (
    <S.Container>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </S.Container>
  );
}
