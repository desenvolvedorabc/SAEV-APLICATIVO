import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { CardStyled, Content } from "./styledComponents";

type GraphProps = {
  isPdf?: boolean;
  info: any;
  race: string
};

export function GraphReportRace({ isPdf = false, info, race }: GraphProps) {
  function getCategories() {
    const list = []

    info?.forEach(x => {
      list.push(x.name);
    })

    return list;
  }

  function getData(type){

    let list = []


    info?.forEach(edition => {
      if(race === 'Não Declarado'){
        let findRace = edition?.races?.find(_race => _race.name === 'Não informada')

        let value = findRace[type]
        let total = findRace?.total

        findRace = edition?.races?.find(_race => _race.name === 'Não Coletada')

        value += findRace[type]
        total += findRace?.total
  
        list.push({value: value, y: total > 0 ? value / total * 100 : 0})

      }else {
        const findRace = edition?.races?.find(_race => _race.name === race)
  
        list.push({value: findRace[type], y: findRace?.total > 0 ? findRace[type] / findRace?.total * 100 : 0})
      }
    });

    return list
  }

  const options = {
    chart: {
      type: "bar",
      scrollablePlotArea: {
          minHeight: info?.length * 52,
          opacity: 1,
      },
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
      text: 'Nível de Leitura',
    },
    xAxis: {
      categories: getCategories()
    },
    yAxis: {
      visible: false,
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
        <div style={{ width: isPdf ? '1000px' : '100%' }}>
          <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
      </Content>
    </CardStyled>
  );
}
