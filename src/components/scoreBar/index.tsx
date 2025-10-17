import { useBreadcrumbContext } from "src/context/breadcrumb.context";
import { Bar, Container, Nome, BarBox, Score } from "./styledComponents";

interface Item {
  name: string;
  id: string;
  value: number;
  type?: string;
}

interface ScorebarProps {
  item: Item;
  level: string;
  haveClick?: boolean;
}

export default function ScoreBar({
  item,
  level,
  haveClick = true,
}: ScorebarProps) {
  
  const {
    addBreadcrumbs,
    handleClickBar,
    changeState,
    changeStateRegional,
    changeCounty,
    changeCountyRegional,
    changeSchool,
    changeSchoolClass,
  } = useBreadcrumbContext();

  const handleClick = async (_id, _name, _level) => {
    
    if (_level === "state") {
      changeState({
        id: _id,
        name: _name,
      });
      changeStateRegional(null);
    } else if (_level === "regional") {
      changeStateRegional({
        id: _id,
        name: _name,
      });
      changeCounty(null);
    } else if (_level === "county") {
      changeCounty({
        MUN_ID: _id,
        MUN_NOME: _name,
      });
      changeCountyRegional(null);
    } else if (_level === "regionalSchool") {
      changeCountyRegional({
        id: _id,
        name: _name,
      });
      changeSchool(null);
    } else if (_level === "school") {
      changeSchool({
        ESC_ID: _id,
        ESC_NOME: _name,
      });
      changeSchoolClass(null);
    } else if (
      _level === "schoolClass"
    ) {
      changeSchoolClass({
        TUR_ID: _id,
        TUR_NOME: _name,
      });
    }
    addBreadcrumbs(_id, _name, _level);
    handleClickBar();
  };

  return (
    <Container
      title={item.name}
      style={{
        cursor: !!haveClick ? 'pointer' : 'unset'
      }}
      onClick={() => {
        haveClick && handleClick(item.id, item.name, level);
      }}
    >
      <Nome>
        <span>{item.name}</span>
        {
          level === 'school' ?
          <div style={{ backgroundColor: '#989898', minWidth: '26px', height: '21px', borderRadius: '16px', textAlign: 'center', marginRight: '8px', color: '#fff', fontSize: '14px' }}>
            {item?.type === 'MUNICIPAL' ? 'M' : 'E'}
          </div>
          :
          <div></div>
        }
      </Nome>
      <BarBox>
        <Bar width={item.value}></Bar>
        <Score>{item.value}%</Score>
      </BarBox>
    </Container>
  );
}
