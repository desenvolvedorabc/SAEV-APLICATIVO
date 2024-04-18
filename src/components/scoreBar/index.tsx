import { useBreadcrumbContext } from "src/context/breadcrumb.context";
import { Bar, Container, Nome, BarBox, Score } from "./styledComponents";

interface Item {
  name: string;
  id: string;
  value: number;
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
    changeSchool,
    changeSchoolClass,
    handleClickBar,
    changeCounty,
  } = useBreadcrumbContext();

  const handleClick = async (_id, _name, _level) => {
    if (_level === "county") {
      changeCounty({
        AVM_MUN: {
          MUN_ID: _id,
          MUN_NOME: _name,
        },
      });
      changeSchool(null);
    } else if (_level === "school") {
      changeSchool({
        ESC_ID: _id,
        ESC_NOME: _name,
      });
      changeSchoolClass(null);
    } else if (_level === "school-class" || _level === "schoolClass") {
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
        <span> {item.name}</span>
      </Nome>
      <BarBox>
        <Bar width={item.value}></Bar>
        <Score>{item.value}%</Score>
      </BarBox>
    </Container>
  );
}
