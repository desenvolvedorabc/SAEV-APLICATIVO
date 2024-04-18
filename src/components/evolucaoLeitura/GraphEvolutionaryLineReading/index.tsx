import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useEffect, useState } from "react";
import { useBreadcrumbContext } from "src/context/breadcrumb.context";
import { CardStyled, Content, ContentSubjects } from "./styledComponents";

type GraphProps = {
  isPdf?: boolean;
  info: any;
};

export function GraphEvolutionaryLineReading({ isPdf = false, info }: GraphProps) {
  const { mapBreadcrumb } = useBreadcrumbContext();
  
  function getSubTitle() {
    let subtitle = "";
    mapBreadcrumb.map((x, index) => {
      if (index != 0) subtitle = subtitle.concat(" - ");
      if (x.name) subtitle = subtitle.concat(x?.name);
    });
    return subtitle;
  }

  function getCategories() {
    const list = []

    info.forEach(x => {
      list.push(x.name);
    })

    return list;
  }

  function getData(type){
    let list = []
    info?.forEach(item => {
      list.push({value: item?.subject[type], y: item?.subject[type] / item?.subject.countTotalStudents * 100})
    })

    return list
  }

  const options = {
    chart: {
      type: "bar",
      scrollablePlotArea: {
          minHeight: info?.length * 52,
          opacity: 1,
          // maxHeight: 700
      },
      // marginTop: 50,
      // marginBottom: 50,
      style: {
        fontFamily: "Inter",
        fontWeight: "600",
      },
    },

    tooltip: {
      shared: false,
      useHTML: true,
      headerFormat: '<table><tr style="background: {series.color};text-align: center;color: #fff"><th colspan="2">{series.name}</th></tr>',
      pointFormat:
      `<tr><td style="text-align: center"><b>&nbsp;&nbsp;&nbsp;&nbsp;Quantidade de Alunos:&nbsp;&nbsp;&nbsp;&nbsp;</b></td></tr>`+
        `<tr><td style="text-align: center"><b>&nbsp;&nbsp;&nbsp;&nbsp;{point.value}&nbsp;&nbsp;&nbsp;&nbsp;</b></td></tr>`,
      footerFormat: "</table>",
      padding: 0,
      valueDecimals: 0,
    },
    title: {
      text: getSubTitle(),
    },
    xAxis: {
      categories: getCategories()
    },
    yAxis: {
      visible: false,
      // min: 0,
      // max: 100,
      // title: {
      //   text: ''
      // }
    },
    legend: {
      reversed: true,
    },
    plotOptions: {
      series: {
        stacking: 'normal',
        lineWidth: 6,
        dataLabels: {
          enabled: true,
          format: `{y:.0f}%`
        }
      }
    },
    series: [{
        name: 'Não Informado',
        data: getData('nao_informado'),
        color: '#FF8A9A'
      },{
        name: 'Não Avaliado',
        data: getData('nao_avaliado'),
        color: '#FED966'
      },{
        name: 'Não Leitor',
        data: getData('nao_leitor'),
        color: '#757575'
      },{
        name: 'Sílabas',
        data: getData('silabas'),
        color: '#9DC3E7'
      },{
        name: 'Palavras',
        data: getData('palavras'),
        color: '#5A9BD5'
      },{
        name: 'Frases',
        data: getData('frases'),
        color: '#51D0B2'
      },{
        name: 'Não Fluente',
        data: getData('nao_fluente'),
        color: '#3E8277'
      },{
        name: 'Fluente',
        data: getData('fluente'),
        color: '#11312B'
      },
    ]
  };

  return (
    <CardStyled>
      <Content>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </Content>
    </CardStyled>
  );
}
