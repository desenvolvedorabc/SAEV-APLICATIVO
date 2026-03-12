import { useState, useEffect } from "react";
import Camelize from "src/utils/camelize";
import * as S from "./styles";

export function PerformanceHistorySubjectTabs({
  subjectId,
  selectSubjectId,
  items = [],
  selectSchool = false,
  typeOfVision,
  setTypeOfVision,
}) {
  const [sortedItems, setSortedItems] = useState([]);

  useEffect(() => {
    const sorted = items?.sort((a, b) => a.subject.localeCompare(b.subject));
    setSortedItems(sorted);
  }, [items]);

  return (
    <S.Container>
      <div>
        {selectSchool && (
          <>
            <button
              onClick={() => setTypeOfVision("general")}
              className={`${typeOfVision === "general" && "checked"}`}
            >
              Visão Geral
            </button>
            <button
              onClick={() => setTypeOfVision("student")}
              className={`${typeOfVision === "student" && "checked"}`}
            >
              Por Auno
            </button>
          </>
        )}
      </div>

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
