import { useState, useEffect } from "react";
import Camelize from "src/utils/camelize";
import * as S from "./styles";

export function PerformanceHistorySubjectTabs({
  subjectId,
  selectSubjectId,
  items = [],
}) {
  const [sortedItems, setSortedItems] = useState([]);

  useEffect(() => {
    const sorted = items?.sort((a, b) => a.subject.localeCompare(b.subject));
    setSortedItems(sorted);
  }, [items]);

  return (
    <S.Container>
      <div>
        {sortedItems?.map((data, key) => (
          <button
            key={data?.id ?? key}
            onClick={() => selectSubjectId(data.id)}
            className={`${subjectId === data.id && "checked"}`}
          >
            {Camelize(data.subject)}
          </button>
        ))}
      </div>
    </S.Container>
  );
}
