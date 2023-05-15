import { Container } from "./styledComponents";
import { MdChevronRight } from "react-icons/md";
import { useBreadcrumbContext } from "src/context/breadcrumb.context";

type Props = {
  onPress: () => void;
};

export function ReportBreadcrumb({ onPress }: Props) {
  const { mapBreadcrumb, subtractBreadcrumbs, setIsUpdateData } = useBreadcrumbContext()

  const handleClick = (id: string, level: string) => {
    subtractBreadcrumbs(id, level)
    setIsUpdateData(true);
    onPress();
  };

  return (
    <>
      <Container>
        {mapBreadcrumb.map((item, index) =>
          (index === mapBreadcrumb.length - 1) ?
            <>{item.name}</> :
            <>
              <button key={item.id} onClick={() => handleClick(item.id, item.level)}>
                {item.name}
              </button>
              <MdChevronRight size={26} />
            </>
        )
        }
      </Container>
    </>
  )
}