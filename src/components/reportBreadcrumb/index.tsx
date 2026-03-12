import { Container, BreadcrumbContent, ActionArea } from "./styledComponents";
import { MdChevronRight } from "react-icons/md";
import { useAuth } from "src/context/AuthContext";
import { useBreadcrumbContext } from "src/context/breadcrumb.context";
import { ReactNode } from "react";

type Props = {
  onPress: () => void;
  isDisabledCounty?: boolean;
  isDisabledSchool?: boolean;
  action?: ReactNode;
};

export function ReportBreadcrumb({ onPress, isDisabledCounty = false, isDisabledSchool = false, action }: Props) {
  const { mapBreadcrumb, subtractBreadcrumbs, setIsUpdateData } = useBreadcrumbContext()
  const { user } = useAuth()

  const handleClick = (id: string, level: string) => {
    subtractBreadcrumbs(id, level)
    setIsUpdateData(true);
    onPress();
  };

  const getDisabled = (level) => {
    if(level === 'year') return true;
    if(level === 'edition') return true;
    if(user?.USU_SPE?.role === 'MUNICIPIO_MUNICIPAL' || user?.USU_SPE?.role === 'MUNICIPIO_ESTADUAL'){
      if(//level === 'epv' || level === 'type' ||
        level === 'state' || level === 'regional'
      )
        return true
    }
    if(user?.USU_SPE?.role === 'ESCOLA'){
      if(level !== 'school' && level !== 'serie')
        return true
    }

    if(isDisabledCounty || isDisabledSchool) {
      if(level === 'year') return true;
    }

    return false;
  }

  return (
    <Container>
      <BreadcrumbContent>
        {mapBreadcrumb.map((item, index) =>
          (index === mapBreadcrumb.length - 1) ?
            <span key={item.id}>{item.name}</span> :
            <span key={item.id}>
              <button disabled={getDisabled(item.level)} onClick={() => handleClick(item.id, item.level)}>
                {item.name}
              </button>
              <MdChevronRight size={26} />
            </span>
        )}
      </BreadcrumbContent>
      {action && <ActionArea>{action}</ActionArea>}
    </Container>
  )
}