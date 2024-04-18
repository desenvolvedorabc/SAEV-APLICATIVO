import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useEffect, useMemo, useState } from "react";
import { useBreadcrumbContext } from "src/context/breadcrumb.context";
import { ItemSubject } from "src/services/sintese-geral.service";
import * as S from "./styles";

enum Niveis{
  'Fluente'= 'fluente',
  'Não Fluente' = 'nao_fluente',
  'Frases' = 'frases',
  'Palavras' = 'palavras',
  'Silabas' = 'silabas',
  'Não Leitor' = 'nao_leitor',
  'Não Avaliado' = 'nao_avaliado',
  'Não informado' = 'nao_informado',
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
      groupPadding: 0.08,
      pointWidth: 73,
      grouping: true,
      shadow: false,
    },
  },
  tooltip: {
    // enabled: false,
    useHTML: true,
    headerFormat: null,
  },
  xAxis: {
    visible: true,
    scrollbar: {
      enabled: true,
    },
    categories: Object.keys(Niveis),
    crosshair: true,
  },
  legend: {
    enabled: false,
  },
  yAxis: {
    gridLineDashStyle: "longdash",
    gridLineWidth: 1.5,
    startOnTick: false,
    showFirstLabel: false,
    title: {
      text: "Qtd Estudantes",
    },
  },
};

export interface GraphProps {
  selectedItem: ItemSubject;
}



export function GraphStudentsReading({
  selectedItem: { dataGraph },
}: GraphProps) {
  const { mapBreadcrumb } = useBreadcrumbContext();

  function getSubTitle() {
    let subtitle = "";

    mapBreadcrumb.map((x, index) => {
      if (index != 0) subtitle = subtitle.concat(" - ");
      if (x.name) subtitle = subtitle.concat(x?.name);
    });

    return subtitle;
  }

  function getPercentage(type: string) {
    let total = 0
    Object.values(dataGraph).forEach((value) => total += value);



    if(dataGraph[Niveis[type]] === 0)
      return 0
    
    return (dataGraph[Niveis[type]] * 100 / total).toFixed(0);
  }

  const formatedOptios = useMemo(() => {
    return {
      ...options,
      title: {
        text: getSubTitle(),
      },
      series: [{
        data: [
          {
            y: dataGraph?.fluente ?? 0,
            name: "Fluente",
            color: "#20423D",
          },
          {
            y: dataGraph?.nao_fluente ?? 0,
            name: "Não Fluente",
            color: "#3E8277",
          },
          {
            y: dataGraph?.frases ?? 0,
            name: "Frases",
            color: "#5EC2B1",
          },
          {
            y: dataGraph?.palavras ?? 0,
            name: "Palavras",
            color: "#51BACF",
          },
          {
            y: dataGraph?.silabas ?? 0,
            name: "Silabas",
            color: "#93BBC5",
          },
          {
            y: dataGraph?.nao_leitor ?? 0,
            name: "Não Leitor",
            color: "#CCC5A8",
          },
          {
            y: dataGraph?.nao_avaliado ?? 0,
            name: "Não Avaliado",
            color: "#F9C462",
          },
          {
            y: dataGraph?.nao_informado ?? 0,
            name: "Não informado",
            color: "#FF8A9A",
          },
        ],
        name: "Total",
        type: "column"
      }],
      tooltip: {
        formatter: function() {
            return this?.key + ':<b>' + this.y + '</b>(' + getPercentage(this?.key) + '%)';
        }
    }
    };
    
  }, [dataGraph]);

  return (
    <S.Container className="isPdf">
      <HighchartsReact highcharts={Highcharts} options={formatedOptios} />
    </S.Container>
  );
}
